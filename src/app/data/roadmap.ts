interface MarkdownModule {
  attributes: Record<string, unknown>;
  body: string;
}

export interface Feature {
  title: string;
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

    if (key === 'features') {
      const features: Feature[] = [];

      while (index + 1 < lines.length && /^  - /.test(lines[index + 1])) {
        index += 1;
        const featureLine = lines[index].trim();
        const featureSeparatorIndex = featureLine.indexOf(':');

        if (!featureLine.startsWith('- ') || featureSeparatorIndex === -1) {
          throw new Error(`Invalid feature line in ${filePath}: ${lines[index]}`);
        }

        const feature: Partial<Feature> = {};
        const featureKey = featureLine.slice(2, featureSeparatorIndex).trim();
        const featureValue = featureLine.slice(featureSeparatorIndex + 1).trim();

        if (featureKey !== 'title') {
          throw new Error(`Expected feature title in ${filePath}: ${lines[index]}`);
        }

        feature.title = parseScalar(featureValue);

        while (index + 1 < lines.length && /^    /.test(lines[index + 1])) {
          index += 1;
          const nestedLine = lines[index].trim();
          const nestedSeparatorIndex = nestedLine.indexOf(':');

          if (nestedSeparatorIndex === -1) {
            throw new Error(`Invalid feature attribute in ${filePath}: ${lines[index]}`);
          }

          const nestedKey = nestedLine.slice(0, nestedSeparatorIndex).trim();
          const nestedValue = nestedLine.slice(nestedSeparatorIndex + 1).trim();

          if (nestedKey === 'description') {
            feature.description = parseScalar(nestedValue);
          }
        }

        if (!feature.title || !feature.description) {
          throw new Error(`Expected feature title and description in ${filePath}`);
        }

        features.push(feature as Feature);
      }

      attributes.features = features;
      continue;
    }

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

function getFeaturesAttribute(
  attributes: Record<string, unknown>,
  filePath: string,
): Feature[] {
  const value = attributes.features;

  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`Expected 'features' list in ${filePath}`);
  }

  return value as Feature[];
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
      features: getFeaturesAttribute(module.attributes, path),
    };
  })
  .sort((left, right) => left.estimatedDate.getTime() - right.estimatedDate.getTime());
