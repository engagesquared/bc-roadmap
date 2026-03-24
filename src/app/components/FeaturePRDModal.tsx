import { Feature } from "../data/roadmap";
import ReactMarkdown from "react-markdown";
import { X, ArrowLeft, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import remarkGfm from 'remark-gfm';

interface FeaturePRDModalProps {
  feature: Feature | null;
  onClose: () => void;
  onBack: () => void;
}

export function FeaturePRDModal({ feature, onClose, onBack }: FeaturePRDModalProps) {
  if (!feature) return null;

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
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Gradient header accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E4FD8] via-[#2E7FE5] to-[#5BC0BE]" />
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={onBack}
                className="text-[#5E6678] hover:text-[#2E7FE5] transition-colors p-2 hover:bg-white rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7FE5] to-[#1E4FD8] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-[#5E6678] uppercase tracking-wider font-semibold">Feature PRD</div>
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">
                    {feature.title}
                  </h2>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#1A1A1A] transition-colors p-2 hover:bg-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto p-10 max-h-[calc(90vh-100px)] bg-gradient-to-br from-white to-gray-50">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-sm max-w-none prose-headings:text-[#1A1A1A] prose-h1:text-3xl prose-h1:font-semibold prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-[#2E7FE5] prose-p:text-[#374151] prose-p:leading-relaxed prose-strong:text-[#1A1A1A] prose-strong:font-semibold prose-ul:text-[#374151] prose-li:text-[#374151] prose-li:marker:text-[#2E7FE5] prose-a:text-[#2E7FE5] prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {feature.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}