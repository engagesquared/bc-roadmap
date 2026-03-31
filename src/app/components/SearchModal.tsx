import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Package, Puzzle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getFeatureSummary } from "../data/roadmap";
import type { Release } from "../data/roadmap";

interface SearchResult {
  type: "release" | "feature";
  releaseId: string;
  releaseVersion: string;
  featureIndex?: number;
  title: string;
  subtitle: string;
  matchSnippet: string;
}

interface SearchModalProps {
  releases: Release[];
  open: boolean;
  onClose: () => void;
  onSelectRelease: (releaseId: string) => void;
  onSelectFeature: (releaseId: string, featureIndex: number) => void;
}

function searchReleases(releases: Release[], query: string): SearchResult[] {
  if (!query.trim()) return [];

  const lower = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const release of releases) {
    const themeMatch = release.theme.toLowerCase().includes(lower);
    const summaryMatch = release.summary.toLowerCase().includes(lower);
    const descriptionMatch = release.description.toLowerCase().includes(lower);

    if (themeMatch || summaryMatch || descriptionMatch) {
      const matchSnippet = themeMatch
        ? release.theme
        : summaryMatch
          ? release.summary
          : getSnippet(release.description, lower);

      results.push({
        type: "release",
        releaseId: release.id,
        releaseVersion: release.version,
        title: `v${release.version} — ${release.theme}`,
        subtitle: release.anticipatedRelease,
        matchSnippet,
      });
    }

      release.features.forEach((feature, featureIndex) => {
        const titleMatch = feature.title.toLowerCase().includes(lower);
        const featureDescMatch = feature.description.toLowerCase().includes(lower);
        const featureSummary = getFeatureSummary(feature);

        if (titleMatch || featureDescMatch) {
          results.push({
          type: "feature",
          releaseId: release.id,
          releaseVersion: release.version,
            featureIndex,
            title: feature.title,
            subtitle: `v${release.version} — ${release.theme}`,
            matchSnippet: titleMatch
              ? featureSummary
              : getSnippet(feature.description, lower),
          });
        }
    });
  }

  return results;
}

function getSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query);

  if (index === -1) return text.slice(0, 120);

  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + query.length + 80);
  let snippet = text.slice(start, end).replace(/\s+/g, " ").trim();

  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

export function SearchModal({ releases, open, onClose, onSelectRelease, onSelectFeature }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchReleases(releases, query), [releases, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      // Small delay to let the modal animation start before focusing
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleSelect(result: SearchResult) {
    if (result.type === "feature" && typeof result.featureIndex === "number") {
      onSelectFeature(result.releaseId, result.featureIndex);
    } else {
      onSelectRelease(result.releaseId);
    }

    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-0 sm:pt-[12vh] sm:px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative bg-white shadow-2xl w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-xl overflow-hidden flex flex-col"
          >
            {/* Gradient header accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E7FE5] via-[#1E4FD8] to-[#2E7FE5]" />

            {/* Search input */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0">
              <Search className="w-5 h-5 text-[#5E6678] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search releases and features..."
                className="flex-1 text-base text-[#1A1A1A] placeholder-[#5E6678]/60 outline-none bg-transparent"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden text-gray-400 hover:text-[#1A1A1A] transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="flex-1 min-h-0 overflow-y-auto sm:max-h-[50vh]">
              {query.trim() === "" ? (
                <div className="px-5 py-8 text-center text-sm text-[#5E6678]">
                  Type to search releases and features
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-[#5E6678]">
                  No results for "{query}"
                </div>
              ) : (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.releaseId}-${result.type}-${index}`}
                      type="button"
                      className="w-full px-4 sm:px-5 py-3 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors"
                      onClick={() => handleSelect(result)}
                    >
                      <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${result.type === "release" ? "bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8]" : "bg-[#2E7FE5]/10"}`}>
                        {result.type === "release" ? (
                          <Package className="w-4 h-4 text-white" />
                        ) : (
                          <Puzzle className="w-4 h-4 text-[#2E7FE5]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#1A1A1A] truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-[#5E6678] mt-0.5">
                          {result.subtitle}
                        </div>
                        <div className="text-xs text-[#5E6678]/80 mt-1 line-clamp-2 leading-relaxed">
                          {result.matchSnippet}
                        </div>
                      </div>
                      <span className={`mt-1 flex-shrink-0 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${result.type === "release" ? "bg-[#2E7FE5]/10 text-[#2E7FE5]" : "bg-gray-100 text-[#5E6678]"}`}>
                        {result.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="px-5 py-2.5 border-t border-gray-100 text-[11px] text-[#5E6678] flex-shrink-0">
                {results.length} {results.length === 1 ? "result" : "results"}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
