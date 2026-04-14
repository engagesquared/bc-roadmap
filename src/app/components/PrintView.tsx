import { useEffect } from "react";
import { getFeatureSummary } from "../data/roadmap";
import type { Release, Feature } from "../data/roadmap";
import logo from "../assets/brief-connect-logo.svg";
import { CalendarDays, MessageSquareMore } from "lucide-react";

interface PrintViewProps {
  release: Release;
}

const FEATURE_SUMMARY_WARN_LENGTH = 120;
const RELEASE_SUMMARY_WARN_LENGTH = 200;

/**
 * How many 2-col feature rows fit on each page type.
 * First page has the full release header so fewer features fit.
 * Continuation pages have a compact header with more room.
 *
 * Each row = 2 features in 2-col mode, 1 feature in 1-col mode.
 * Tuned for landscape A4 (297 x 210 mm) with the current card sizes.
 */
const FEATURES_FIRST_PAGE = 8;
const FEATURES_PER_PAGE = 12;

/**
 * Log warnings for content that may cause the print slide to overflow badly.
 * These fire once on mount during development so authors notice early.
 */
function warnLongContent(release: Release) {
  if (release.summary.length > RELEASE_SUMMARY_WARN_LENGTH) {
    console.warn(
      `[PrintView] Release v${release.version} summary is ${release.summary.length} chars (recommended max ${RELEASE_SUMMARY_WARN_LENGTH}). Consider shortening it for a cleaner print layout.`,
    );
  }

  for (const feature of release.features) {
    const summary = getFeatureSummary(feature);

    if (summary.length > FEATURE_SUMMARY_WARN_LENGTH) {
      console.warn(
        `[PrintView] Feature "${feature.title}" in v${release.version} has a print summary of ${summary.length} chars (recommended max ${FEATURE_SUMMARY_WARN_LENGTH}). Add a shorter "summary" field in the feature frontmatter.`,
      );
    }
  }
}

/**
 * Split features into chunks that fit on each page.
 * First page has fewer slots because the full release header takes space.
 */
function paginateFeatures(features: Feature[]): Feature[][] {
  if (features.length === 0) return [[]];

  const pages: Feature[][] = [];
  let offset = 0;

  // First page
  const firstChunk = features.slice(0, FEATURES_FIRST_PAGE);
  pages.push(firstChunk);
  offset = firstChunk.length;

  // Continuation pages
  while (offset < features.length) {
    const chunk = features.slice(offset, offset + FEATURES_PER_PAGE);
    pages.push(chunk);
    offset += chunk.length;
  }

  return pages;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Top gradient bar + logo — shown on every page */
function PageHeader({ release, compact }: { release: Release; compact?: boolean }) {
  return (
    <>
      {/* Top gradient accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#2E7FE5] via-[#1E4FD8] to-[#2E7FE5]" />

      {/* Logo bar */}
      <div className="flex items-center gap-4 px-10 pt-5 pb-3 border-b border-gray-100">
        <img src={logo} alt="Brief Connect" className="h-8" />
        <span className="text-sm font-semibold text-[#1A1A1A]">Product Roadmap</span>
        {compact && (
          <div className="ml-auto flex items-center gap-3">
            <div className="px-3 py-1 bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] text-white rounded-lg font-semibold text-sm">
              v{release.version}
            </div>
            <span className="text-xs text-[#5E6678] font-medium">{release.theme}</span>
          </div>
        )}
      </div>

      {/* Full release header — only on the first page */}
      {!compact && (
        <div className="px-10 pt-5 pb-1">
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <div className="px-3.5 py-1 bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] text-white rounded-lg font-semibold text-base">
              v{release.version}
            </div>
            {release.consultationPeriod && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2E7FE5]/10 text-[#1E4FD8] rounded-lg text-xs font-medium">
                <MessageSquareMore className="w-3.5 h-3.5" />
                Consultation: {release.consultationPeriod}
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-[#5E6678] rounded-lg text-xs font-medium">
              <CalendarDays className="w-3.5 h-3.5" />
              Anticipated release: {release.anticipatedRelease}
            </div>
          </div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] mt-1">
            {release.theme}
          </h2>
          <p className="text-xs text-[#374151] leading-relaxed mt-1.5 max-w-4xl">
            {release.summary}
          </p>
        </div>
      )}
    </>
  );
}

/** A 2-col grid of feature cards */
function FeatureGrid({
  features,
  startIndex,
  totalCount,
  gridCols,
}: {
  features: Feature[];
  startIndex: number;
  totalCount: number;
  gridCols: string;
}) {
  return (
    <div className={`grid ${gridCols} gap-2.5`}>
      {features.map((feature, i) => {
        const globalIndex = startIndex + i;
        return (
          <div
            key={`print-feature-${globalIndex}`}
            className="print-feature-card flex items-start gap-2.5 p-2.5 rounded-xl border border-gray-200 bg-gradient-to-r from-[#2E7FE5]/5 to-transparent"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 mt-0.5">
              {globalIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#1A1A1A] leading-snug">
                {feature.title}
              </div>
              <p className="text-[11px] text-[#5E6678] leading-relaxed mt-0.5">
                {getFeatureSummary(feature)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function PrintView({ release }: PrintViewProps) {
  useEffect(() => {
    warnLongContent(release);
  }, [release]);

  const featureCount = release.features.length;
  const gridCols = featureCount >= 5 ? "grid-cols-2" : "grid-cols-1";
  const pages = paginateFeatures(release.features);

  return (
    <div className="print-view-root bg-gray-100 min-h-screen flex flex-col items-center gap-8 p-8 print:p-0 print:bg-white print:min-h-0 print:gap-0">
      {pages.map((pageFeatures, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const startIndex = isFirstPage
          ? 0
          : FEATURES_FIRST_PAGE + (pageIndex - 1) * FEATURES_PER_PAGE;

        return (
          <div
            key={`print-page-${pageIndex}`}
            className="print-page bg-white relative overflow-hidden shadow-lg print:shadow-none"
            style={{ width: "297mm", height: "210mm" }}
          >
            <div className="h-full flex flex-col">
              <PageHeader release={release} compact={!isFirstPage} />

              {/* Feature content area — fills remaining space */}
              <div className="flex-1 px-10 pt-4 pb-6 flex flex-col">
                {pageFeatures.length > 0 && (
                  <>
                    {isFirstPage && (
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-base font-semibold text-[#1A1A1A]">Key Features</h3>
                        <span className="px-2 py-0.5 bg-[#2E7FE5]/10 text-[#2E7FE5] rounded-full text-xs font-semibold">
                          {featureCount}
                        </span>
                      </div>
                    )}
                    {!isFirstPage && (
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-[#5E6678]">
                          Features (continued)
                        </h3>
                      </div>
                    )}
                    <FeatureGrid
                      features={pageFeatures}
                      startIndex={startIndex}
                      totalCount={featureCount}
                      gridCols={gridCols}
                    />
                  </>
                )}

                {pageFeatures.length === 0 && isFirstPage && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[#5E6678] text-sm">Features to be determined.</p>
                  </div>
                )}
              </div>

              {/* Page number */}
              {pages.length > 1 && (
                <div className="px-10 pb-3 text-right">
                  <span className="text-[10px] text-[#5E6678]">
                    Page {pageIndex + 1} of {pages.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
