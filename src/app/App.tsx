import { useState } from "react";
import { Timeline } from "./components/Timeline";
import { ReleaseDetailModal } from "./components/ReleaseDetailModal";
import { FeaturePRDModal } from "./components/FeaturePRDModal";
import { roadmapData } from "./data/roadmap";
import type { Feature } from "./data/roadmap";
import logo from "./assets/brief-connect-logo.svg";

export default function App() {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const selectedRelease = roadmapData.find(r => r.id === selectedReleaseId) || null;

  const handleFeatureClick = (featureId: string) => {
    if (!selectedRelease) return;
    
    const feature = selectedRelease.features.find(f => f.id === featureId);
    if (feature) {
      setSelectedFeature(feature);
    }
  };

  const handleCloseAll = () => {
    setSelectedReleaseId(null);
    setSelectedFeature(null);
  };

  const handleBackToRelease = () => {
    setSelectedFeature(null);
  };

  return (
    <div className="size-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-gray-200 flex items-center gap-3">
        <img src={logo} alt="Brief Connect" className="h-10" />
        <h1 className="text-lg font-semibold text-[#1A1A1A]">Product Roadmap</h1>
      </div>

      {/* Timeline Container */}
      <div className="flex-1 overflow-hidden">
        <Timeline
          releases={roadmapData}
          selectedReleaseId={selectedReleaseId}
          onReleaseClick={setSelectedReleaseId}
        />
      </div>

      {/* Modals */}
      {!selectedFeature && (
        <ReleaseDetailModal
          release={selectedRelease}
          onClose={handleCloseAll}
          onFeatureClick={handleFeatureClick}
        />
      )}

      {selectedFeature && (
        <FeaturePRDModal
          feature={selectedFeature}
          onClose={handleCloseAll}
          onBack={handleBackToRelease}
        />
      )}
    </div>
  );
}
