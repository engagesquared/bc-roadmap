import type { Release } from "../data/roadmap";
import type { ReleaseMarkerPlacement } from "./ReleaseMarker";
import { ReleaseMarker } from "./ReleaseMarker";
import { useEffect, useRef } from "react";

const TIMELINE_Y = 330;
const START_PADDING = 160;
const END_PADDING = 260;
const TIMELINE_LENGTH = 2200;
const TIMELINE_LINE_INSET = 40;
const SCROLL_CONTENT_WIDTH = START_PADDING + TIMELINE_LENGTH + END_PADDING;
const TIMELINE_LINE_LEFT = START_PADDING - TIMELINE_LINE_INSET;
const TIMELINE_LINE_WIDTH = TIMELINE_LENGTH + TIMELINE_LINE_INSET * 2;
const OVERLAP_THRESHOLD = 290;

function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getQuarterLabel(date: Date): string {
  return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
}

interface TimelineProps {
  releases: Release[];
  selectedReleaseId: string | null;
  onReleaseClick: (releaseId: string) => void;
  onFeatureClick: (releaseId: string, featureIndex: number) => void;
}

function computePlacements(
  sortedReleases: Release[],
  getPosition: (date: Date) => number,
): ReleaseMarkerPlacement[] {
  const placements: ReleaseMarkerPlacement[] = [];
  let lastBelowPos = -Infinity;
  let lastAbovePos = -Infinity;

  for (let i = 0; i < sortedReleases.length; i++) {
    const pos = getPosition(sortedReleases[i].estimatedDate);

    if (pos - lastBelowPos >= OVERLAP_THRESHOLD) {
      placements.push("below");
      lastBelowPos = pos;
    } else if (pos - lastAbovePos >= OVERLAP_THRESHOLD) {
      placements.push("above");
      lastAbovePos = pos;
    } else {
      placements.push("below");
      lastBelowPos = pos;
    }
  }

  return placements;
}

export function Timeline({ releases, selectedReleaseId, onReleaseClick, onFeatureClick }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedMarkerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const sortedReleases = [...releases].sort(
    (left, right) => left.estimatedDate.getTime() - right.estimatedDate.getTime(),
  );
  const firstReleaseDate = sortedReleases[0]?.estimatedDate;
  const lastReleaseDate = sortedReleases[sortedReleases.length - 1]?.estimatedDate;
  const timelineStartDate = firstReleaseDate ? getStartOfMonth(firstReleaseDate) : new Date();
  const timelineEndDate = lastReleaseDate ? getEndOfMonth(lastReleaseDate) : new Date();

  const getTimelinePosition = (date: Date) => {
    const timeRange = timelineEndDate.getTime() - timelineStartDate.getTime();
    const timeFromStart = date.getTime() - timelineStartDate.getTime();
    const percentageAlong = timeRange > 0 ? timeFromStart / timeRange : 0;

    return START_PADDING + percentageAlong * TIMELINE_LENGTH;
  };

  const placements = computePlacements(sortedReleases, getTimelinePosition);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      container.scrollLeft += event.deltaY * 3;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button, a, [role='button']")) return;

      isDragging = true;
      startX = event.clientX;
      startScrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      const dx = event.clientX - startX;
      container.scrollLeft = startScrollLeft - dx;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = "";
      container.style.userSelect = "";
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!selectedReleaseId || !scrollContainerRef.current) {
      return;
    }

    const markerElement = selectedMarkerRef.current[selectedReleaseId];
    if (!markerElement) {
      return;
    }

    const container = scrollContainerRef.current;
    const markerRect = markerElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      markerRect.left -
      containerRect.left -
      containerRect.width / 2 +
      markerRect.width / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }, [selectedReleaseId]);

  const generateMonthMarkers = () => {
    const markers = [];
    const currentDate = getStartOfMonth(timelineStartDate);
    const endDate = getStartOfMonth(timelineEndDate);

    while (currentDate <= endDate) {
      const date = new Date(currentDate);
      const position = getTimelinePosition(date);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      markers.push(
        <div
          key={`month-${date.getFullYear()}-${date.getMonth()}`}
          className="absolute text-xs text-gray-400"
          style={{ left: `${position}px`, top: `${TIMELINE_Y + 6}px` }}
        >
          <div className="w-px h-2 bg-gray-300 mb-1" />
          {monthName}
        </div>,
      );

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return markers;
  };

  const generateQuarterMarkers = () => {
    const quarters = [];
    const quarterStartMonth = Math.floor(timelineStartDate.getMonth() / 3) * 3;
    const currentDate = new Date(timelineStartDate.getFullYear(), quarterStartMonth, 1);
    const endDate = getStartOfMonth(timelineEndDate);

    while (currentDate <= endDate) {
      const date = new Date(currentDate);
      quarters.push({
        name: getQuarterLabel(date),
        date,
      });
      currentDate.setMonth(currentDate.getMonth() + 3);
    }

    return quarters.map(({ name, date }) => {
      const position = getTimelinePosition(date);

      return (
        <div
          key={name}
          className="absolute text-base font-semibold text-gray-600"
          style={{ left: `${position}px`, top: `${TIMELINE_Y - 32}px` }}
        >
          {name}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-x-auto flex items-center scroll-smooth cursor-grab"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="relative shrink-0" style={{ minWidth: `${SCROLL_CONTENT_WIDTH}px`, height: "720px" }}>
          {generateQuarterMarkers()}

          <div
            className="absolute bg-[#2E7FE5] rounded-full shadow-sm"
            style={{ left: `${TIMELINE_LINE_LEFT}px`, width: `${TIMELINE_LINE_WIDTH}px`, height: "2px", top: `${TIMELINE_Y}px` }}
          />

          {generateMonthMarkers()}

          {sortedReleases.map((release, index) => (
            <ReleaseMarker
              key={release.id}
              release={release}
              position={getTimelinePosition(release.estimatedDate)}
              timelineY={TIMELINE_Y}
              placement={placements[index]}
              isSelected={selectedReleaseId === release.id}
              onClick={() => onReleaseClick(release.id)}
              onFeatureClick={(featureIndex) => onFeatureClick(release.id, featureIndex)}
              ref={(el) => {
                selectedMarkerRef.current[release.id] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
