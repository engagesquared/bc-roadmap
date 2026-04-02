import { useEffect, useRef } from "react";
import { getFeatureSummary } from "../data/roadmap";
import type { Release } from "../data/roadmap";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, CalendarDays, ExternalLink, MessageSquareMore, Printer, Rocket, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ModalShareActions } from "./ModalShareActions";

interface ReleaseDetailModalProps {
  release: Release | null;
  selectedFeatureIndex: number | null;
  permalink: string | null;
  shareHref: string | null;
  onFeatureSelect: (featureIndex: number) => void;
  onBackToRelease: () => void;
  onClose: () => void;
}

export function ReleaseDetailModal({
  release,
  selectedFeatureIndex,
  permalink,
  shareHref,
  onFeatureSelect,
  onBackToRelease,
  onClose,
}: ReleaseDetailModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const releaseScrollTopRef = useRef(0);

  useEffect(() => {
    releaseScrollTopRef.current = 0;
  }, [release?.id]);

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    if (selectedFeatureIndex !== null) {
      contentElement.scrollTop = 0;
      return;
    }

    contentElement.scrollTop = releaseScrollTopRef.current;
  }, [selectedFeatureIndex, release?.id]);

  if (!release) return null;

  const selectedFeature =
    selectedFeatureIndex !== null ? release.features[selectedFeatureIndex] ?? null : null;
  const releaseDateLabel = release.estimatedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const featureDisclaimer =
    "Roadmap feature descriptions are indicative only and may change at any time. Final implementation details, scope, and UX may differ from what is shown here.";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white shadow-2xl w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-3xl sm:max-h-[85vh] overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E7FE5] via-[#1E4FD8] to-[#2E7FE5]" />

          <div className="flex items-start justify-between p-4 sm:p-8 border-b border-gray-100 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] text-white rounded-lg font-semibold text-base sm:text-lg">
                  v{release.version}
                </div>
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-[#5E6678] rounded-lg text-xs sm:text-sm font-medium">
                  <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {releaseDateLabel}
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mt-2">
                {selectedFeature ? selectedFeature.title : release.theme}
              </h2>
              {selectedFeature ? (
                <button
                  type="button"
                  onClick={onBackToRelease}
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#2E7FE5] hover:text-[#1E4FD8] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to release overview
                </button>
              ) : null}
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                {release.consultationPeriod && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#2E7FE5]/10 text-[#1E4FD8] rounded-lg text-xs sm:text-sm font-medium">
                    <MessageSquareMore className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Consultation: {release.consultationPeriod}
                  </div>
                )}
                {release.released && (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs sm:text-sm font-medium">
                    <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Released
                  </div>
                )}
                <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-[#5E6678] rounded-lg text-xs sm:text-sm font-medium">
                  {release.released ? "Roadmap slot" : "Anticipated release"}: {release.anticipatedRelease}
                </div>
                {release.releaseNotesUrl && (
                  <a
                    href={release.releaseNotesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#2E7FE5]/10 text-[#1E4FD8] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#2E7FE5]/15 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    View release notes
                  </a>
                )}
              </div>
            </div>
            <div className="ml-2 sm:ml-4 flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {permalink && shareHref && (
                <ModalShareActions
                  permalink={permalink}
                  shareHref={shareHref}
                  itemLabel={selectedFeature ? `feature ${selectedFeature.title}` : `release v${release.version}`}
                />
              )}
              <button
                type="button"
                onClick={() => {
                  const printUrl = `${window.location.pathname}${window.location.search}${window.location.search ? "&" : "?"}print=${encodeURIComponent(release.id)}`;
                  window.open(printUrl, "_blank");
                }}
                title="Print release as PDF"
                className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={contentRef} className="overflow-y-auto p-4 sm:p-8 flex-1 min-h-0">
            {selectedFeature ? (
              <motion.div
                key={`${release.id}-feature-${selectedFeatureIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-[#2E7FE5]/6 via-white to-[#1E4FD8]/4 p-4 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center text-white font-semibold">
                    {(selectedFeatureIndex ?? 0) + 1}
                  </div>
                  <div className="text-sm font-medium text-[#5E6678]">Key feature</div>
                </div>
                <div className="prose prose-sm max-w-none text-base leading-7 text-[#334155]">
                  <ReactMarkdown>{selectedFeature.description}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="prose prose-sm max-w-none mb-8 sm:mb-10">
                  <ReactMarkdown>{release.description}</ReactMarkdown>
                </div>

                {release.features.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">Key Features</h3>
                      <span className="px-2.5 py-0.5 bg-[#2E7FE5]/10 text-[#2E7FE5] rounded-full text-xs font-semibold">
                        {release.features.length}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:gap-4">
                      {release.features.map((feature, index) => (
                        <motion.button
                          key={`${release.id}-feature-${index}`}
                          type="button"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="w-full p-4 sm:p-6 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-[#2E7FE5]/5 to-transparent hover:border-[#2E7FE5]/40 hover:from-[#2E7FE5]/10 text-left transition-colors"
                           onClick={() => {
                             releaseScrollTopRef.current = contentRef.current?.scrollTop ?? 0;
                             onFeatureSelect(index);
                           }}
                         >
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-base sm:text-lg font-semibold text-[#1A1A1A]">
                                  {feature.title}
                                </span>
                              </div>
                              <p className="text-sm text-[#5E6678] leading-relaxed sm:ml-12">
                                {getFeatureSummary(feature)}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {selectedFeature ? (
            <div className="border-t border-gray-200 bg-[#F8FAFC] px-4 py-3 text-xs leading-5 text-[#5E6678] sm:px-8 sm:text-sm">
              {featureDisclaimer}
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
