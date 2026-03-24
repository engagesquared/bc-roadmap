import { Release } from "../data/roadmap";
import { ReleaseMarker } from "./ReleaseMarker";
import { useEffect, useRef } from "react";

/** Y-coordinate (px from top of scroll content) for the centre of the timeline line. */
const TIMELINE_Y = 72;
const START_PADDING = 160;
const END_PADDING = 260;
const TIMELINE_LENGTH = 2200;
const TIMELINE_LINE_INSET = 40;
const SCROLL_CONTENT_WIDTH = START_PADDING + TIMELINE_LENGTH + END_PADDING;
const TIMELINE_LINE_LEFT = START_PADDING - TIMELINE_LINE_INSET;
const TIMELINE_LINE_WIDTH = TIMELINE_LENGTH + TIMELINE_LINE_INSET * 2;

interface TimelineProps {
  releases: Release[];
  selectedReleaseId: string | null;
  onReleaseClick: (releaseId: string) => void;
}

export function Timeline({ releases, selectedReleaseId, onReleaseClick }: TimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedMarkerRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Convert vertical wheel events into horizontal scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY * 3;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Click-and-drag horizontal scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Only primary button; ignore clicks on interactive elements
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button, a, [role='button']")) return;

      isDragging = true;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
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

  // Auto-scroll to selected release
  useEffect(() => {
    if (selectedReleaseId && scrollContainerRef.current) {
      const markerElement = selectedMarkerRef.current[selectedReleaseId];
      if (markerElement) {
        const container = scrollContainerRef.current;
        const markerRect = markerElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const scrollLeft = container.scrollLeft + markerRect.left - containerRect.left - (containerRect.width / 2) + (markerRect.width / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedReleaseId]);

  // Calculate positions based on dates
  const getTimelinePosition = (date: Date) => {
    // Find min and max dates
    const dates = releases.map(r => r.estimatedDate.getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    
    // Calculate position as percentage of time range
    const timeRange = maxDate - minDate;
    const timeFromStart = date.getTime() - minDate;
    const percentageAlong = timeRange > 0 ? timeFromStart / timeRange : 0;
    
    return START_PADDING + (percentageAlong * TIMELINE_LENGTH);
  };

  // Generate month markers – tick + label sit just below the line
  const generateMonthMarkers = () => {
    const markers = [];
    const currentYear = 2026;
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const position = getTimelinePosition(date);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      markers.push(
        <div
          key={`month-${month}`}
          className="absolute text-xs text-gray-400"
          style={{ left: `${position}px`, top: `${TIMELINE_Y + 6}px` }}
        >
          <div className="w-px h-2 bg-gray-300 mb-1" />
          {monthName}
        </div>
      );
    }
    
    return markers;
  };

  // Quarter indicators – sit above the timeline line
  const generateQuarterMarkers = () => {
    const quarters = [
      { name: 'Q1 2026', month: 0 },
      { name: 'Q2 2026', month: 3 },
      { name: 'Q3 2026', month: 6 },
      { name: 'Q4 2026', month: 9 },
    ];
    
    return quarters.map(({ name, month }) => {
      const date = new Date(2026, month, 1);
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
      {/* Scroll indicators - outside scroll container so they stay fixed */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-x-auto flex items-center scroll-smooth cursor-grab"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="relative shrink-0" style={{ minWidth: `${SCROLL_CONTENT_WIDTH}px`, height: '380px' }}>
          {/* Quarter markers */}
          {generateQuarterMarkers()}
          
          {/* Main timeline line */}
          <div
            className="absolute bg-[#2E7FE5] rounded-full shadow-sm"
            style={{ left: `${TIMELINE_LINE_LEFT}px`, width: `${TIMELINE_LINE_WIDTH}px`, height: '2px', top: `${TIMELINE_Y}px` }}
          />
          
          {/* Month markers */}
          {generateMonthMarkers()}
          
          {/* Release markers */}
          {releases.map((release) => (
            <ReleaseMarker
              key={release.id}
              release={release}
              position={getTimelinePosition(release.estimatedDate)}
              timelineY={TIMELINE_Y}
              isSelected={selectedReleaseId === release.id}
              onClick={() => onReleaseClick(release.id)}
              ref={(el) => selectedMarkerRef.current[release.id] = el}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
