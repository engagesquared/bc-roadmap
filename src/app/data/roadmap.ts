interface MarkdownModule {
  attributes: Record<string, unknown>;
  body: string;
}

export interface Feature {
  title: string;
  summary?: string;
  description: string;
}

export interface Release {
  id: string;
  version: string;
  theme: string;
  summary: string;
  description: string;
  estimatedDate: Date;
  anticipatedRelease: string;
  consultationPeriod?: string;
  released: boolean;
  releaseNotesUrl?: string;
  features: Feature[];
}

const releaseModules = import.meta.glob('/content/releases/*/release.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const featureModules = import.meta.glob('/content/releases/*/features/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseScalar(value: string): string {
  const trimmedValue = value.trim();

  return trimmedValue.replace(/^(['"])(.*)\1$/, '$2');
}

function parseFrontmatter(source: string, filePath: string): MarkdownModule {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Expected YAML frontmatter in ${filePath}`);
  }

  const lines = match[1].split(/\r?\n/);
  const attributes: Record<string, unknown> = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      throw new Error(`Invalid frontmatter line in ${filePath}: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    attributes[key] = parseScalar(rawValue);
  }

  return {
    attributes,
    body: match[2].trim(),
  };
}

function getReleaseVersionFromPath(path: string): string {
  const match = path.match(/^\/content\/releases\/([^/]+)\/release\.md$/);

  if (!match) {
    throw new Error(`Invalid release markdown path: ${path}`);
  }

  return match[1];
}

function getFeatureReleaseVersionFromPath(path: string): string {
  const match = path.match(/^\/content\/releases\/([^/]+)\/features\/[^/]+\.md$/);

  if (!match) {
    throw new Error(`Invalid feature markdown path: ${path}`);
  }

  return match[1];
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

function getOptionalStringAttribute(
  attributes: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = attributes[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function getDateAttribute(
  attributes: Record<string, unknown>,
  key: string,
  filePath: string,
): Date {
  const value = attributes[key];

  if (typeof value === 'string') {
    const parsedDate = new Date(value);

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  throw new Error(`Expected '${key}' date in ${filePath}`);
}

function getBooleanAttribute(
  attributes: Record<string, unknown>,
  key: string,
): boolean {
  const value = attributes[key];

  return typeof value === 'string' && value.trim().toLowerCase() === 'true';
}

// Group feature files by release version
const featuresByRelease = new Map<string, Feature[]>();

for (const [path, source] of Object.entries(featureModules).sort(([a], [b]) => a.localeCompare(b))) {
  const version = getFeatureReleaseVersionFromPath(path);
  const module = parseFrontmatter(source, path);

  const feature: Feature = {
    title: getStringAttribute(module.attributes, 'title', path),
    summary: getOptionalStringAttribute(module.attributes, 'summary'),
    description: module.body,
  };

  const existing = featuresByRelease.get(version);

  if (existing) {
    existing.push(feature);
  } else {
    featuresByRelease.set(version, [feature]);
  }
}

export const roadmapData: Release[] = Object.entries(releaseModules)
  .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
  .map(([path, source]) => {
    const module = parseFrontmatter(source, path);
    const version = getReleaseVersionFromPath(path);

    return {
      id: `release-${version}`,
      version: getStringAttribute(module.attributes, 'version', path),
      theme: getStringAttribute(module.attributes, 'title', path),
      summary: getStringAttribute(module.attributes, 'summary', path),
      description: module.body,
      estimatedDate: getDateAttribute(module.attributes, 'date', path),
      anticipatedRelease: getStringAttribute(module.attributes, 'anticipatedRelease', path),
      consultationPeriod: getOptionalStringAttribute(module.attributes, 'consultationPeriod'),
      released: getBooleanAttribute(module.attributes, 'released'),
      releaseNotesUrl: getOptionalStringAttribute(module.attributes, 'releaseNotesUrl'),
      features: featuresByRelease.get(version) ?? [],
    };
  })
  .sort((left, right) => left.estimatedDate.getTime() - right.estimatedDate.getTime());
