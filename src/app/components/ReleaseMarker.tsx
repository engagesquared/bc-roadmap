import type { Release } from "../data/roadmap";
import { motion } from "motion/react";
import { forwardRef } from "react";

const DOT_RADIUS = 10;
const STEM_HEIGHT = 50;
const MAX_VISIBLE_FEATURES = 3;

export type ReleaseMarkerPlacement = "above" | "below";

interface ReleaseMarkerProps {
  release: Release;
  position: number;
  timelineY: number;
  placement: ReleaseMarkerPlacement;
  isSelected: boolean;
  compact?: boolean;
  onClick: () => void;
  onFeatureClick: (featureIndex: number) => void;
}

export const ReleaseMarker = forwardRef<HTMLDivElement, ReleaseMarkerProps>(
  ({ release, position, timelineY, placement, isSelected, compact = false, onClick, onFeatureClick }, ref) => {
    const month = release.estimatedDate.toLocaleDateString("en-US", { month: "short" });
    const year = release.estimatedDate.getFullYear();
    const maxFeatures = compact ? 2 : MAX_VISIBLE_FEATURES;
    const stemHeight = compact ? 30 : STEM_HEIGHT;
    const dotRadius = compact ? 8 : DOT_RADIUS;
    const visibleFeatures = release.features.slice(0, maxFeatures);
    const hiddenFeatureCount = release.features.length - visibleFeatures.length;
    const isAbove = placement === "above";
    const isReleased = release.released;

    const stemStyle = isAbove
      ? {
          width: 2,
          height: stemHeight,
          top: `${timelineY - dotRadius - stemHeight}px`,
          left: -1,
        }
      : {
          width: 2,
          height: stemHeight,
          top: `${timelineY + dotRadius}px`,
          left: -1,
        };

    const cardStyle = isAbove
      ? {
          top: `${timelineY - dotRadius - stemHeight}px`,
          left: 0,
          transform: "translate(-50%, -100%)",
        }
      : {
          top: `${timelineY + dotRadius + stemHeight}px`,
          left: 0,
          transform: "translateX(-50%)",
        };

    const cardWidth = compact ? "w-[210px]" : "w-[272px]";
    const cardPadding = compact ? "px-3 py-3" : "px-5 py-4";

    return (
      <motion.div
        className="absolute cursor-pointer group"
        style={{ left: `${position}px`, top: 0, bottom: 0 }}
        onClick={onClick}
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className={`absolute rounded-full transition-all duration-300 ${isSelected ? "bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] shadow-lg shadow-[#2E7FE5]/40" : "bg-white border-2 border-[#2E7FE5] group-hover:border-[#1E4FD8] group-hover:shadow-md"}`}
          style={{
            width: dotRadius * 2,
            height: dotRadius * 2,
            top: `${timelineY - dotRadius}px`,
            left: `${-dotRadius}px`,
          }}
          animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white opacity-30"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {isSelected && (
          <motion.div
            className="absolute rounded-full bg-[#2E7FE5]/30"
            style={{
              width: dotRadius * 2,
              height: dotRadius * 2,
              top: `${timelineY - dotRadius}px`,
              left: `${-dotRadius}px`,
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div
          className={`absolute transition-colors duration-300 ${isSelected ? "bg-[#2E7FE5]" : "bg-gray-200 group-hover:bg-[#2E7FE5]"}`}
          style={stemStyle}
        />

        <div
          className={`absolute flex flex-col ${cardWidth} ${cardPadding} rounded-xl transition-all duration-300 shadow-md ${isSelected ? "bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] shadow-xl shadow-[#2E7FE5]/30" : "bg-white border-2 border-gray-200 group-hover:border-[#2E7FE5] group-hover:shadow-lg"}`}
          style={cardStyle}
        >
          <div className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide mb-1 transition-colors duration-300 ${isSelected ? "text-white/70" : "text-[#5E6678]"}`}>
            <span className="shrink-0">{month} {year}</span>
            {isReleased && (
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] tracking-normal transition-colors duration-300 ${isSelected ? "bg-emerald-400/20 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                Released
              </span>
            )}
            {!compact && release.consultationPeriod && (
              <span className={`truncate rounded-full px-2 py-0.5 text-[10px] tracking-normal transition-colors duration-300 ${isSelected ? "bg-white/15 text-white/80" : "bg-[#2E7FE5]/8 text-[#1E4FD8]"}`}>
                Consult: {release.consultationPeriod}
              </span>
            )}
          </div>
          <div className={`${compact ? "text-base" : "text-xl"} font-bold mb-1 transition-colors duration-300 ${isSelected ? "text-white" : "text-[#1A1A1A] group-hover:text-[#2E7FE5]"}`}>
            v{release.version}
          </div>
          <div className={`${compact ? "text-xs" : "text-sm"} font-semibold mb-1 transition-colors duration-300 ${isSelected ? "text-white/95" : "text-[#1A1A1A]"}`}>
            {release.theme}
          </div>
          {!compact && (
            <div className={`text-xs leading-relaxed transition-colors duration-300 ${isSelected ? "text-white/80" : "text-[#5E6678]"}`}>
              {release.summary}
            </div>
          )}
          {release.features.length > 0 && (
            <div className={`${compact ? "mt-2 pt-2" : "mt-4 pt-3"} border-t transition-colors duration-300 ${isSelected ? "border-white/20" : "border-gray-200"}`}>
              <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${isSelected ? "text-white/75" : "text-[#5E6678]"}`}>
                Key features
              </div>
              <div className="flex flex-wrap gap-1.5">
                {visibleFeatures.map((feature, index) => (
                  <button
                    key={`${release.id}-feature-pill-${index}`}
                    type="button"
                    title={feature.title}
                    className={`max-w-full rounded-full ${compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected ? "bg-white/15 text-white hover:bg-white/20 focus:ring-white/70 focus:ring-offset-[#2E7FE5]" : "bg-[#2E7FE5]/8 text-[#1E4FD8] hover:bg-[#2E7FE5]/14 focus:ring-[#2E7FE5]/45 focus:ring-offset-white"}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onFeatureClick(index);
                    }}
                  >
                    <span className={`block ${compact ? "max-w-[140px]" : "max-w-[190px]"} truncate`}>{feature.title}</span>
                  </button>
                ))}
                {hiddenFeatureCount > 0 && (
                  <div className={`rounded-full ${compact ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} font-medium transition-colors duration-300 ${isSelected ? "bg-white/10 text-white/80" : "bg-gray-100 text-[#5E6678]"}`}>
                    + {hiddenFeatureCount} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  },
);

ReleaseMarker.displayName = "ReleaseMarker";
