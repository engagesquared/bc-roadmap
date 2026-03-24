import { Release } from "../data/roadmap";
import { motion } from "motion/react";
import { forwardRef } from "react";

/** Half the dot diameter – used to centre the dot on the timeline line. */
const DOT_RADIUS = 10; // dot is w-5 h-5 = 20px

/** Length of the vertical connecting line from dot to card. */
const STEM_HEIGHT = 50;

interface ReleaseMarkerProps {
  release: Release;
  position: number;
  timelineY: number;
  isSelected: boolean;
  onClick: () => void;
}

export const ReleaseMarker = forwardRef<HTMLDivElement, ReleaseMarkerProps>(
  ({ release, position, timelineY, isSelected, onClick }, ref) => {
    const month = release.estimatedDate.toLocaleDateString('en-US', { month: 'short' });
    const year = release.estimatedDate.getFullYear();
    
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
        {/* Date label – above the dot */}
        <motion.div 
          className="absolute text-xs font-medium text-[#5E6678] whitespace-nowrap"
          style={{
            top: `${timelineY - DOT_RADIUS - 24}px`,
            left: 0,
            transform: 'translateX(-50%)',
          }}
          animate={isSelected ? { scale: 1.05 } : {}}
        >
          {month} {year}
        </motion.div>
        
        {/* Marker dot – centred on the timeline line */}
        <motion.div
          className={`absolute rounded-full transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] shadow-lg shadow-[#2E7FE5]/40' : 'bg-white border-2 border-[#2E7FE5] group-hover:border-[#1E4FD8] group-hover:shadow-md'}`}
          style={{
            width: DOT_RADIUS * 2,
            height: DOT_RADIUS * 2,
            top: `${timelineY - DOT_RADIUS}px`,
            left: `${-DOT_RADIUS}px`,
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

        {/* Pulse effect for selected */}
        {isSelected && (
          <motion.div
            className="absolute rounded-full bg-[#2E7FE5]/30"
            style={{
              width: DOT_RADIUS * 2,
              height: DOT_RADIUS * 2,
              top: `${timelineY - DOT_RADIUS}px`,
              left: `${-DOT_RADIUS}px`,
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Vertical stem connecting dot to card */}
        <div
          className={`absolute transition-colors duration-300 ${isSelected ? 'bg-[#2E7FE5]' : 'bg-gray-200 group-hover:bg-[#2E7FE5]'}`}
          style={{
            width: 2,
            height: STEM_HEIGHT,
            top: `${timelineY + DOT_RADIUS}px`,
            left: -1,
          }}
        />

        {/* Release info card – below the stem */}
        <div 
          className={`absolute flex flex-col w-[220px] px-5 py-4 rounded-xl transition-all duration-300 shadow-md ${isSelected ? 'bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] shadow-xl shadow-[#2E7FE5]/30' : 'bg-white border-2 border-gray-200 group-hover:border-[#2E7FE5] group-hover:shadow-lg'}`}
          style={{
            top: `${timelineY + DOT_RADIUS + STEM_HEIGHT}px`,
            left: 0,
            transform: 'translateX(-50%)',
          }}
        >
          <div className={`text-xl font-bold mb-1 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-[#1A1A1A] group-hover:text-[#2E7FE5]'}`}>
            v{release.version}
          </div>
          <div className={`text-sm font-semibold mb-2 transition-colors duration-300 ${isSelected ? 'text-white/95' : 'text-[#1A1A1A]'}`}>
            {release.theme}
          </div>
          <div className={`text-xs leading-relaxed transition-colors duration-300 ${isSelected ? 'text-white/80' : 'text-[#5E6678]'}`}>
            {getShortDescription(release.description)}
          </div>
          
          {/* Feature count badge */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/20">
            <div className={`text-xs font-medium transition-colors duration-300 ${isSelected ? 'text-white/90' : 'text-[#5E6678]'}`}>
              {release.features.length} {release.features.length === 1 ? 'feature' : 'features'}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ReleaseMarker.displayName = 'ReleaseMarker';

// Helper function to extract clean description from markdown
function getShortDescription(description: string): string {
  // Remove markdown headers (##, ###, etc.)
  let clean = description.replace(/^#+\s+/gm, '');
  
  // Remove bold/italic markers
  clean = clean.replace(/\*\*(.+?)\*\*/g, '$1');
  clean = clean.replace(/\*(.+?)\*/g, '$1');
  
  // Remove bullet points
  clean = clean.replace(/^[-*]\s+/gm, '');
  
  // Get first meaningful paragraph
  const paragraphs = clean.split('\n\n').filter(p => p.trim().length > 0);
  const firstPara = paragraphs[0] || '';
  
  // Truncate to reasonable length
  const maxLength = 85;
  if (firstPara.length <= maxLength) {
    return firstPara.trim();
  }
  
  // Find last complete word within limit
  const truncated = firstPara.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}
