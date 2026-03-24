import type { Release } from "../data/roadmap";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, CalendarDays, ExternalLink, MessageSquareMore, Rocket, X } from "lucide-react";
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
  if (!release) return null;

  const selectedFeature =
    selectedFeatureIndex !== null ? release.features[selectedFeatureIndex] ?? null : null;
  const releaseDateLabel = release.estimatedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E7FE5] via-[#1E4FD8] to-[#2E7FE5]" />

          <div className="flex items-start justify-between p-8 border-b border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="px-4 py-1.5 bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] text-white rounded-lg font-semibold text-lg">
                  v{release.version}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-[#5E6678] rounded-lg text-sm font-medium">
                  <CalendarDays className="w-4 h-4" />
                  {releaseDateLabel}
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-2">
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
              <div className="flex flex-wrap gap-2 mt-4">
                {release.consultationPeriod && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2E7FE5]/10 text-[#1E4FD8] rounded-lg text-sm font-medium">
                    <MessageSquareMore className="w-4 h-4" />
                    Consultation period: {release.consultationPeriod}
                  </div>
                )}
                {release.released && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    <Rocket className="w-4 h-4" />
                    Released
                  </div>
                )}
                <div className="px-3 py-1.5 bg-gray-100 text-[#5E6678] rounded-lg text-sm font-medium">
                  {release.released ? "Roadmap slot" : "Anticipated release"}: {release.anticipatedRelease}
                </div>
                {release.releaseNotesUrl && (
                  <a
                    href={release.releaseNotesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2E7FE5]/10 text-[#1E4FD8] rounded-lg text-sm font-medium hover:bg-[#2E7FE5]/15 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View release notes
                  </a>
                )}
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              {permalink && shareHref && (
                <ModalShareActions
                  permalink={permalink}
                  shareHref={shareHref}
                  itemLabel={`release v${release.version}`}
                />
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-8 max-h-[calc(85vh-180px)]">
            {selectedFeature ? (
              <motion.div
                key={`${release.id}-feature-${selectedFeatureIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-[#2E7FE5]/6 via-white to-[#1E4FD8]/4 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center text-white font-semibold">
                    {(selectedFeatureIndex ?? 0) + 1}
                  </div>
                  <div className="text-sm font-medium text-[#5E6678]">Key feature</div>
                </div>
                <p className="text-base leading-7 text-[#334155]">{selectedFeature.description}</p>
              </motion.div>
            ) : (
              <>
                <div className="prose prose-sm max-w-none mb-10">
                  <ReactMarkdown>{release.description}</ReactMarkdown>
                </div>

                {release.features.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <h3 className="text-xl font-semibold text-[#1A1A1A]">Key Features</h3>
                      <span className="px-2.5 py-0.5 bg-[#2E7FE5]/10 text-[#2E7FE5] rounded-full text-xs font-semibold">
                        {release.features.length}
                      </span>
                    </div>
                    <div className="grid gap-4">
                      {release.features.map((feature, index) => (
                        <motion.button
                          key={`${release.id}-feature-${index}`}
                          type="button"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="w-full p-6 rounded-xl border-2 border-gray-200 bg-gradient-to-r from-[#2E7FE5]/5 to-transparent hover:border-[#2E7FE5]/40 hover:from-[#2E7FE5]/10 text-left transition-colors"
                          onClick={() => onFeatureSelect(index)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center text-white font-semibold">
                                  {index + 1}
                                </div>
                                <span className="text-lg font-semibold text-[#1A1A1A]">
                                  {feature.title}
                                </span>
                              </div>
                              <p className="text-sm text-[#5E6678] leading-relaxed ml-12">
                                {feature.description}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
