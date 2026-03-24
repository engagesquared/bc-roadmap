import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Timeline } from "./components/Timeline";
import { ReleaseDetailModal } from "./components/ReleaseDetailModal";
import { SearchModal } from "./components/SearchModal";
import { roadmapData } from "./data/roadmap";
import logo from "./assets/brief-connect-logo.svg";

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

function parseHash(hash: string): string | null {
  const value = hash.replace(/^#/, "").trim();

  if (!value) {
    return null;
  }

  const releaseId = decodeURIComponent(value.split("/")[0]);
  return roadmapData.some((entry) => entry.id === releaseId) ? releaseId : null;
}

function getInitialSelection(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseHash(window.location.hash);
}

export default function App() {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(getInitialSelection);
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
    setSelectedReleaseId(parseHash(window.location.hash));
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
    window.location.hash = `#${encodeURIComponent(releaseId)}`;
  };

  const handleCloseRelease = () => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setSelectedReleaseId(null);
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
        />
      </div>

      <ReleaseDetailModal
        release={selectedRelease}
        permalink={permalink}
        shareHref={shareHref}
        onClose={handleCloseRelease}
      />

      <SearchModal
        releases={roadmapData}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectRelease={handleReleaseClick}
      />
    </div>
  );
}
