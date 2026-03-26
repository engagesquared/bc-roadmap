import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Lightbulb, Search } from "lucide-react";
import { Timeline } from "./components/Timeline";
import { roadmapData } from "./data/roadmap";
import logo from "./assets/brief-connect-logo.svg";

const ReleaseDetailModal = lazy(async () => {
  const module = await import("./components/ReleaseDetailModal");
  return { default: module.ReleaseDetailModal };
});

const SearchModal = lazy(async () => {
  const module = await import("./components/SearchModal");
  return { default: module.SearchModal };
});

interface HashSelection {
  releaseId: string;
  featureIndex: number | null;
}

function slugifyFeatureTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFeatureSlug(releaseId: string, featureIndex: number): string | null {
  const release = roadmapData.find((entry) => entry.id === releaseId);
  const feature = release?.features[featureIndex];

  if (!release || !feature) {
    return null;
  }

  const baseSlug = slugifyFeatureTitle(feature.title);
  let duplicateCount = 0;

  for (let index = 0; index <= featureIndex; index += 1) {
    const candidate = release.features[index];

    if (slugifyFeatureTitle(candidate.title) === baseSlug) {
      duplicateCount += 1;
    }
  }

  return duplicateCount > 1 ? `${baseSlug}-${duplicateCount}` : baseSlug;
}

function getFeatureIndexFromSegment(releaseId: string, featureSegment: string): number | null {
  const release = roadmapData.find((entry) => entry.id === releaseId);

  if (!release) {
    return null;
  }

  const matchingIndex = release.features.findIndex((_, index) => getFeatureSlug(releaseId, index) === featureSegment);

  return matchingIndex >= 0 ? matchingIndex : null;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatReleaseDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function parseHash(hash: string): HashSelection | null {
  const value = hash.replace(/^#/, "").trim();

  if (!value) {
    return null;
  }

  const [releaseSegment, featureSegment] = value.split("/");
  const releaseId = decodeURIComponent(releaseSegment);
  const release = roadmapData.find((entry) => entry.id === releaseId);

  if (!release) {
    return null;
  }

  if (featureSegment === undefined) {
    return { releaseId, featureIndex: null };
  }

  const featureIndex = getFeatureIndexFromSegment(releaseId, decodeURIComponent(featureSegment));

  if (featureIndex === null) {
    return { releaseId, featureIndex: null };
  }

  return { releaseId, featureIndex };
}

function getInitialSelection(): HashSelection | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseHash(window.location.hash);
}

export default function App() {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(() => getInitialSelection()?.releaseId ?? null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number | null>(() => getInitialSelection()?.featureIndex ?? null);
  const [searchOpen, setSearchOpen] = useState(false);

  const selectedRelease = roadmapData.find((release) => release.id === selectedReleaseId) || null;
  const selectedFeature = selectedRelease && selectedFeatureIndex !== null
    ? selectedRelease.features[selectedFeatureIndex] ?? null
    : null;
  const selectedFeatureSlug = selectedReleaseId && selectedFeatureIndex !== null
    ? getFeatureSlug(selectedReleaseId, selectedFeatureIndex)
    : null;
  const permalink = selectedReleaseId && typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}${window.location.search}#${encodeURIComponent(selectedReleaseId)}${selectedFeatureSlug ? `/${encodeURIComponent(selectedFeatureSlug)}` : ""}`
    : null;
  const shareHref = selectedRelease && permalink
    ? `mailto:?subject=${encodeURIComponent(selectedFeature
        ? `Brief Connect roadmap feature: ${selectedFeature.title}`
        : `Brief Connect roadmap release: v${selectedRelease.version}`)}&body=${encodeURIComponent([
        selectedFeature
          ? `Brief Connect feature: ${selectedFeature.title}`
          : `Brief Connect v${selectedRelease.version}`,
        `Theme: ${selectedRelease.theme}`,
        `Date: ${formatReleaseDate(selectedRelease.estimatedDate)}`,
        "",
        stripMarkdown(selectedFeature ? selectedFeature.description : selectedRelease.description),
        "",
        `Permalink: ${permalink}`,
      ].join("\n"))}`
    : null;
  const ideaSubmissionHref = `mailto:roadmap@brief-connect.com?subject=${encodeURIComponent("Roadmap idea")}&body=${encodeURIComponent([
    "Hi Brief Connect team,",
    "",
    "I'd like to submit this idea for the roadmap:",
    "",
    "Context:",
    "- Problem:",
    "- Who it helps:",
    "- Why now:",
    "",
    "Thanks,",
  ].join("\n"))}`;

  const syncSelectionFromLocation = useCallback(() => {
    const selection = parseHash(window.location.hash);
    setSelectedReleaseId(selection?.releaseId ?? null);
    setSelectedFeatureIndex(selection?.featureIndex ?? null);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", syncSelectionFromLocation);
    window.addEventListener("popstate", syncSelectionFromLocation);

    return () => {
      window.removeEventListener("hashchange", syncSelectionFromLocation);
      window.removeEventListener("popstate", syncSelectionFromLocation);
    };
  }, [syncSelectionFromLocation]);

  const handleReleaseClick = (releaseId: string) => {
    setSelectedFeatureIndex(null);
    window.location.hash = `#${encodeURIComponent(releaseId)}`;
  };

  const handleFeatureClick = (releaseId: string, featureIndex: number) => {
    setSelectedFeatureIndex(featureIndex);
    const featureSlug = getFeatureSlug(releaseId, featureIndex);

    if (!featureSlug) {
      return;
    }

    window.location.hash = `#${encodeURIComponent(releaseId)}/${encodeURIComponent(featureSlug)}`;
  };

  const handleBackToRelease = () => {
    if (!selectedRelease) {
      return;
    }

    setSelectedFeatureIndex(null);
    window.location.hash = `#${encodeURIComponent(selectedRelease.id)}`;
  };

  const handleCloseRelease = () => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setSelectedReleaseId(null);
    setSelectedFeatureIndex(null);
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="flex-shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center gap-3 sm:gap-5">
        <img src={logo} alt="Brief Connect" className="h-8 sm:h-10" />
        <h1 className="text-base sm:text-lg font-semibold text-[#1A1A1A] truncate">Product Roadmap</h1>
        <a
          href={ideaSubmissionHref}
          aria-label="Submit your idea"
          title="Submit your idea"
          className="group relative ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-[#5E6678] transition-colors hover:border-[#2E7FE5] hover:text-[#2E7FE5]"
        >
          <Lightbulb className="h-4 w-4" />
          <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1A1A1A] px-2 py-1 text-xs font-medium text-white shadow-lg group-hover:block">
            Submit your idea
          </span>
        </a>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#5E6678] hover:border-[#2E7FE5] hover:text-[#2E7FE5] transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Timeline
          releases={roadmapData}
          selectedReleaseId={selectedReleaseId}
          onReleaseClick={handleReleaseClick}
          onFeatureClick={handleFeatureClick}
        />
      </div>

      <Suspense fallback={null}>
        <ReleaseDetailModal
          release={selectedRelease}
          selectedFeatureIndex={selectedFeatureIndex}
          permalink={permalink}
          shareHref={shareHref}
          onFeatureSelect={(featureIndex) => {
            if (!selectedRelease) return;
            handleFeatureClick(selectedRelease.id, featureIndex);
          }}
          onBackToRelease={handleBackToRelease}
          onClose={handleCloseRelease}
        />

        <SearchModal
          releases={roadmapData}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectRelease={handleReleaseClick}
          onSelectFeature={handleFeatureClick}
        />
      </Suspense>
    </div>
  );
}
