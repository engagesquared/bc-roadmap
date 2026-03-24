interface MarkdownModule {
  attributes: Record<string, unknown>;
  body: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string; // Brief description for list view
  content: string; // Markdown content
}

export interface Release {
  id: string;
  version: string;
  theme: string;
  description: string; // Markdown content
  estimatedDate: Date;
  features: Feature[];
}

const releaseModules = import.meta.glob('/content/releases/**/release.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const featureModules = import.meta.glob('/content/releases/**/features/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseMarkdownModule(source: string, filePath: string): MarkdownModule {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Expected YAML frontmatter in ${filePath}`);
  }

  const attributes = match[1]
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .reduce<Record<string, string>>((result, line) => {
      const separatorIndex = line.indexOf(':');

      if (separatorIndex === -1) {
        throw new Error(`Invalid frontmatter line in ${filePath}: ${line}`);
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^(['"])(.*)\1$/, '$2');

      result[key] = value;
      return result;
    }, {});

  return {
    attributes,
    body: match[2],
  };
}

function getReleaseVersionFromPath(path: string): string {
  const match = path.match(/^\/content\/releases\/([^/]+)\/release\.md$/);

  if (!match) {
    throw new Error(`Invalid release markdown path: ${path}`);
  }

  return match[1];
}

function getFeatureSlugFromPath(path: string): string {
  const match = path.match(/^\/content\/releases\/[^/]+\/features\/([^/]+)\.md$/);

  if (!match) {
    throw new Error(`Invalid feature markdown path: ${path}`);
  }

  return match[1].replace(/^\d+-/, '');
}

function getStringAttribute(
  attributes: Record<string, unknown>,
  key: string,
  filePath: string,
): string {
  const value = attributes[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Expected '${key}' string in ${filePath}`);
  }

  return value.trim();
}

function getDateAttribute(
  attributes: Record<string, unknown>,
  key: string,
  filePath: string,
): Date {
  const value = attributes[key];

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string') {
    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  throw new Error(`Expected '${key}' date in ${filePath}`);
}

function getFeatureSummary(module: MarkdownModule, filePath: string): string {
  const summary = module.attributes.summary;

  if (typeof summary === 'string' && summary.trim().length > 0) {
    return summary.trim();
  }

  const firstParagraph = module.body
    .split(/\n\s*\n/)
    .map((section) => section.replace(/[#*_`>-]/g, '').trim())
    .find(Boolean);

  if (!firstParagraph) {
    throw new Error(`Expected markdown content in ${filePath}`);
  }

  return firstParagraph;
}

function getReleaseFeatures(version: string): Feature[] {
  return Object.entries(featureModules)
    .filter(([path]) => path.startsWith(`/content/releases/${version}/features/`))
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([path, source]) => {
      const module = parseMarkdownModule(source, path);

      return {
        id: `feature-${getFeatureSlugFromPath(path)}`,
        title: getStringAttribute(module.attributes, 'title', path),
        description: getFeatureSummary(module, path),
        content: module.body.trim(),
      };
    });
}

export const roadmapData: Release[] = Object.entries(releaseModules)
  .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
  .map(([path, source]) => {
    const module = parseMarkdownModule(source, path);
    const version = getReleaseVersionFromPath(path);

    return {
      id: `release-${version}`,
      version,
      theme: getStringAttribute(module.attributes, 'title', path),
      description: module.body.trim(),
      estimatedDate: getDateAttribute(module.attributes, 'date', path),
      features: getReleaseFeatures(version),
    };
  })
  .sort((left, right) => left.estimatedDate.getTime() - right.estimatedDate.getTime());
