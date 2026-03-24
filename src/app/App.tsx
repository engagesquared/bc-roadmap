import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
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

  const featureIndex = Number.parseInt(decodeURIComponent(featureSegment), 10);

  if (!Number.isInteger(featureIndex) || featureIndex < 0 || featureIndex >= release.features.length) {
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
  const permalink = selectedReleaseId && typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}${window.location.search}#${encodeURIComponent(selectedReleaseId)}`
    : null;
  const shareHref = selectedRelease && permalink
    ? `mailto:?subject=${encodeURIComponent(`Brief Connect roadmap release: v${selectedRelease.version}`)}&body=${encodeURIComponent([
        `Brief Connect v${selectedRelease.version}`,
        `Theme: ${selectedRelease.theme}`,
        `Date: ${formatReleaseDate(selectedRelease.estimatedDate)}`,
        "",
        stripMarkdown(selectedRelease.description),
        "",
        `Permalink: ${permalink}`,
      ].join("\n"))}`
    : null;

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
    window.location.hash = `#${encodeURIComponent(releaseId)}/${featureIndex}`;
  };

  const handleCloseRelease = () => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setSelectedReleaseId(null);
    setSelectedFeatureIndex(null);
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center gap-5">
        <img src={logo} alt="Brief Connect" className="h-10" />
        <h1 className="text-lg font-semibold text-[#1A1A1A]">Product Roadmap</h1>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-[#5E6678] hover:border-[#2E7FE5] hover:text-[#2E7FE5] transition-colors"
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
          onBackToRelease={() => setSelectedFeatureIndex(null)}
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
