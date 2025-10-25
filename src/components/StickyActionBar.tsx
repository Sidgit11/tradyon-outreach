import React, { useState, useEffect } from 'react';
import { Users, Bookmark, Send, CreditCard } from 'lucide-react';
import { Company, Segment, EnrichmentEstimate } from '../types';
import SegmentPopover from './SegmentPopover';

interface StickyActionBarProps {
  selectedCompanies: Company[];
  enrichmentEstimate?: EnrichmentEstimate;
  onGetEnrichmentEstimate: (companyIds: string[]) => void;
  onEnrichCompanies: (companyIds: string[]) => void;
  onCreateSegment: (name: string, description: string, companyIds: string[]) => void;
  onAddToSegment: (segmentId: string, companyIds: string[]) => void;
  onStartCampaign: (companies: Company[]) => void;
  segments: Segment[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function StickyActionBar({
  selectedCompanies,
  enrichmentEstimate,
  onGetEnrichmentEstimate,
  onEnrichCompanies,
  onCreateSegment,
  onAddToSegment,
  onStartCampaign,
  segments,
  showToast
}: StickyActionBarProps) {
  const [showSegmentPopover, setShowSegmentPopover] = useState(false);
  const [enrichmentSelected, setEnrichmentSelected] = useState(false);

  // Get enrichment estimate when enrichment is selected
  useEffect(() => {
    if (enrichmentSelected && selectedCompanies.length > 0 && !enrichmentEstimate) {
      const companyIds = selectedCompanies.map(c => c.companyId);
      onGetEnrichmentEstimate(companyIds);
    }
  }, [enrichmentSelected, selectedCompanies, enrichmentEstimate, onGetEnrichmentEstimate]);

  const handleEnrich = () => {
    if (enrichmentSelected && enrichmentEstimate) {
      // Confirm and proceed with enrichment
      const companyIds = selectedCompanies.map(c => c.companyId);
      onEnrichCompanies(companyIds);
      setEnrichmentSelected(false);
    } else {
      // Select enrichment and get estimate
      setEnrichmentSelected(true);
    }
  };

  const handleAddToSegment = () => {
    setShowSegmentPopover(true);
  };

  const handleStartCampaign = () => {
    onStartCampaign(selectedCompanies);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {selectedCompanies.length} companies selected
              </span>
            </div>

            {/* Enrichment Estimate */}
            {enrichmentSelected && enrichmentEstimate && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Est. {enrichmentEstimate.totalCredits} credits 
                  ({enrichmentEstimate.contactCredits} contact + {enrichmentEstimate.profileCredits} profile)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleEnrich}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                enrichmentSelected
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>
                {enrichmentSelected 
                  ? `Confirm Enrichment (${enrichmentEstimate?.totalCredits || 0} credits)`
                  : 'Enrich'
                }
              </span>
            </button>

            <button
              onClick={handleAddToSegment}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Add to segment</span>
            </button>

            <button
              onClick={handleStartCampaign}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Start campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segment Popover */}
      {showSegmentPopover && (
        <SegmentPopover
          selectedCompanies={selectedCompanies}
          segments={segments}
          onCreateSegment={onCreateSegment}
          onAddToSegment={onAddToSegment}
          onClose={() => setShowSegmentPopover(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
}