import { Release } from "../data/roadmap";
import ReactMarkdown from "react-markdown";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReleaseDetailModalProps {
  release: Release | null;
  onClose: () => void;
  onFeatureClick: (featureId: string) => void;
}

export function ReleaseDetailModal({ release, onClose, onFeatureClick }: ReleaseDetailModalProps) {
  if (!release) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
        >
          {/* Gradient header accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2E7FE5] via-[#1E4FD8] to-[#2E7FE5]" />
          
          {/* Header */}
          <div className="flex items-start justify-between p-8 border-b border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="px-4 py-1.5 bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] text-white rounded-lg font-semibold text-lg">
                  v{release.version}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-[#5E6678] rounded-lg text-sm font-medium">
                  <X className="w-4 h-4" />
                  {release.estimatedDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-2">
                {release.theme}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto p-8 max-h-[calc(85vh-180px)]">
            {/* Description */}
            <div className="prose prose-sm max-w-none mb-10">
              <ReactMarkdown>
                {release.description}
              </ReactMarkdown>
            </div>
            
            {/* Features */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-semibold text-[#1A1A1A]">
                  Key Features
                </h3>
                <span className="px-2.5 py-0.5 bg-[#2E7FE5]/10 text-[#2E7FE5] rounded-full text-xs font-semibold">
                  {release.features.length}
                </span>
              </div>
              <div className="grid gap-4">
                {release.features.map((feature, index) => (
                  <motion.button
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onFeatureClick(feature.id)}
                    className="w-full text-left p-6 rounded-xl border-2 border-gray-200 hover:border-[#2E7FE5] hover:bg-gradient-to-r hover:from-[#2E7FE5]/5 hover:to-transparent transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center text-white font-semibold group-hover:scale-110 transition-transform">
                            {index + 1}
                          </div>
                          <span className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#2E7FE5] transition-colors">
                            {feature.title}
                          </span>
                        </div>
                        <p className="text-sm text-[#5E6678] leading-relaxed ml-12">
                          {feature.description}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-[#2E7FE5] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}