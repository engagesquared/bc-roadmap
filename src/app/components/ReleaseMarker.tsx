import { Release } from "../data/roadmap";
import { motion } from "motion/react";
import { forwardRef } from "react";

interface ReleaseMarkerProps {
  release: Release;
  position: number;
  isSelected: boolean;
  onClick: () => void;
}

export const ReleaseMarker = forwardRef<HTMLDivElement, ReleaseMarkerProps>(
  ({ release, position, isSelected, onClick }, ref) => {
    const month = release.estimatedDate.toLocaleDateString('en-US', { month: 'short' });
    const year = release.estimatedDate.getFullYear();
    
    return (
      <motion.div
        className="absolute top-0 flex flex-col items-center cursor-pointer group"
        style={{ left: `${position}px` }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Date label */}
        <motion.div 
          className="text-xs font-medium text-[#5E6678] mb-3 whitespace-nowrap"
          animate={isSelected ? { scale: 1.05 } : {}}
        >
          {month} {year}
        </motion.div>
        
        {/* Timeline marker */}
        <div className="relative">
          {/* Connecting line to timeline */}
          <motion.div 
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-10 transition-colors duration-300 ${isSelected ? 'bg-gradient-to-b from-[#2E7FE5] to-[#1E4FD8]' : 'bg-gray-300 group-hover:bg-[#2E7FE5]'}`}
            animate={isSelected ? { scaleY: 1.1 } : {}}
            transition={{ duration: 0.3 }}
          />
          
          {/* Marker dot with brand colors */}
          <motion.div
            className={`relative top-10 w-5 h-5 rounded-full transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] shadow-lg shadow-[#2E7FE5]/40' : 'bg-white border-2 border-[#2E7FE5] group-hover:border-[#1E4FD8] group-hover:shadow-md'}`}
            animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            {/* Inner glow for selected state */}
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
              className="absolute top-10 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#2E7FE5]/30"
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        
        {/* Release info card - bigger and more detailed */}
        <motion.div 
          className={`mt-12 flex flex-col w-[220px] px-5 py-4 rounded-xl transition-all duration-300 shadow-md ${isSelected ? 'bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] shadow-xl shadow-[#2E7FE5]/30' : 'bg-white border-2 border-gray-200 group-hover:border-[#2E7FE5] group-hover:shadow-lg'}`}
          animate={isSelected ? { y: -6 } : {}}
          whileHover={!isSelected ? { y: -3 } : {}}
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
        </motion.div>
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