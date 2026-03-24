import type { Release } from "../data/roadmap";
import type { ReleaseMarkerPlacement } from "./ReleaseMarker";
import { ReleaseMarker } from "./ReleaseMarker";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIsMobile } from "./ui/use-mobile";

const TODAY_LABEL_HEIGHT = 20;

interface TimelineGeometry {
  timelineY: number;
  startPadding: number;
  endPadding: number;
  timelineLength: number;
  lineInset: number;
  overlapThreshold: number;
  canvasHeight: number;
}

const DESKTOP_GEOMETRY: TimelineGeometry = {
  timelineY: 400,
  startPadding: 160,
  endPadding: 260,
  timelineLength: 2200,
  lineInset: 40,
  overlapThreshold: 290,
  canvasHeight: 800,
};

const MOBILE_GEOMETRY: TimelineGeometry = {
  timelineY: 160,
  startPadding: 80,
  endPadding: 120,
  timelineLength: 1400,
  lineInset: 20,
  overlapThreshold: 200,
  canvasHeight: 460,
};

/** Below this container height (px), switch desktop to adapted short layout */
const SHORT_DESKTOP_THRESHOLD = DESKTOP_GEOMETRY.canvasHeight;

/** Below this container height (px), use compact cards on short desktop */
const COMPACT_HEIGHT_THRESHOLD = 500;

function useContainerHeight(ref: React.RefObject<HTMLDivElement | null>) {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(Math.floor(entry.contentRect.height));
      }
    });

    setHeight(Math.floor(el.clientHeight));
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return height;
}

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
  overlapThreshold: number,
  forceBelow: boolean,
): ReleaseMarkerPlacement[] {
  if (forceBelow) {
    return sortedReleases.map(() => "below");
  }

  const placements: ReleaseMarkerPlacement[] = [];
  let lastBelowPos = -Infinity;
  let lastAbovePos = -Infinity;

  for (let i = 0; i < sortedReleases.length; i++) {
    const pos = getPosition(sortedReleases[i].estimatedDate);

    if (pos - lastBelowPos >= overlapThreshold) {
      placements.push("below");
      lastBelowPos = pos;
    } else if (pos - lastAbovePos >= overlapThreshold) {
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
  const isMobile = useIsMobile();
  const containerHeight = useContainerHeight(scrollContainerRef);

  let geo: TimelineGeometry;
  let forceBelow: boolean;
  let useCompactCards: boolean;

  if (isMobile) {
    geo = MOBILE_GEOMETRY;
    forceBelow = true;
    useCompactCards = true;
  } else if (containerHeight > 0 && containerHeight < SHORT_DESKTOP_THRESHOLD) {
    // Wide but short viewport — adapt geometry to fit available height
    const timelineY = Math.max(80, Math.min(160, Math.floor(containerHeight * 0.28)));
    useCompactCards = containerHeight < COMPACT_HEIGHT_THRESHOLD;
    geo = {
      timelineY,
      startPadding: DESKTOP_GEOMETRY.startPadding,
      endPadding: DESKTOP_GEOMETRY.endPadding,
      timelineLength: DESKTOP_GEOMETRY.timelineLength,
      lineInset: DESKTOP_GEOMETRY.lineInset,
      overlapThreshold: DESKTOP_GEOMETRY.overlapThreshold,
      canvasHeight: containerHeight,
    };
    forceBelow = true;
  } else {
    geo = DESKTOP_GEOMETRY;
    forceBelow = false;
    useCompactCards = false;
  }

  const scrollContentWidth = geo.startPadding + geo.timelineLength + geo.endPadding;
  const timelineLineLeft = geo.startPadding - geo.lineInset;
  const timelineLineWidth = geo.timelineLength + geo.lineInset * 2;

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

    return geo.startPadding + percentageAlong * geo.timelineLength;
  };

  const placements = computePlacements(sortedReleases, getTimelinePosition, geo.overlapThreshold, forceBelow);
  const today = new Date();
  const todayMarkerPosition = getTimelinePosition(today);
  const showTodayMarker = today >= timelineStartDate && today <= timelineEndDate;

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
          style={{ left: `${position}px`, top: `${geo.timelineY + 6}px` }}
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
          className="absolute text-sm sm:text-base font-semibold text-gray-600"
          style={{ left: `${position}px`, top: `${geo.timelineY - 32}px` }}
        >
          {name}
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-x-auto flex items-center scroll-smooth cursor-grab"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="relative shrink-0" style={{ minWidth: `${scrollContentWidth}px`, height: `${geo.canvasHeight}px` }}>
          {generateQuarterMarkers()}

          <div
            className="absolute bg-[#2E7FE5] rounded-full shadow-sm"
            style={{ left: `${timelineLineLeft}px`, width: `${timelineLineWidth}px`, height: "2px", top: `${geo.timelineY}px` }}
          />

          {showTodayMarker && (
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ left: `${todayMarkerPosition}px`, top: `${geo.timelineY - 48 - TODAY_LABEL_HEIGHT}px`, transform: "translateX(-50%)" }}
            >
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400 mb-1">
                Today
              </div>
              <div className="w-px bg-gray-300" style={{ height: `${48 + 48}px` }} />
            </div>
          )}

          {generateMonthMarkers()}

          {sortedReleases.map((release, index) => (
            <ReleaseMarker
              key={release.id}
              release={release}
              position={getTimelinePosition(release.estimatedDate)}
              timelineY={geo.timelineY}
              placement={placements[index]}
              isSelected={selectedReleaseId === release.id}
              compact={useCompactCards}
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
