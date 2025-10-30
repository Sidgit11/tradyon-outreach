import React, { useState, useEffect } from 'react';
import { Users, Bookmark, Send, CreditCard, Info } from 'lucide-react';
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
  const [showEnrichConfirm, setShowEnrichConfirm] = useState(false);

  // Get enrichment estimate when enrichment is selected
  useEffect(() => {
    if (enrichmentSelected && selectedCompanies.length > 0 && !enrichmentEstimate) {
      const companyIds = selectedCompanies.map(c => c.companyId);
      onGetEnrichmentEstimate(companyIds);
    }
  }, [enrichmentSelected, selectedCompanies, enrichmentEstimate, onGetEnrichmentEstimate]);

  const handleEnrich = () => {
    if (!enrichmentSelected) {
      setEnrichmentSelected(true);
    } else if (enrichmentEstimate) {
      setShowEnrichConfirm(true);
    }
  };

  const handleConfirmEnrich = () => {
    const companyIds = selectedCompanies.map(c => c.companyId);
    onEnrichCompanies(companyIds);
    setEnrichmentSelected(false);
    setShowEnrichConfirm(false);
  };

  const handleCancelEnrich = () => {
    setEnrichmentSelected(false);
    setShowEnrichConfirm(false);
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
                enrichmentSelected && enrichmentEstimate
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>
                {enrichmentSelected && enrichmentEstimate
                  ? `Confirm (${enrichmentEstimate.totalCredits} credits)`
                  : enrichmentSelected
                  ? 'Estimating...'
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

      {/* Enrich Confirmation Modal */}
      {showEnrichConfirm && enrichmentEstimate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Enrichment</h3>
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div>
                  <p className="text-sm font-medium text-blue-900">Estimated Credits</p>
                  <p className="text-2xl font-bold text-blue-700">{enrichmentEstimate.totalCredits}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {enrichmentEstimate.contactCredits} contact + {enrichmentEstimate.profileCredits} profile credits
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-800">{selectedCompanies.length} companies</p>
                  <p className="text-xs text-blue-600">~2 contacts per company</p>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Breakdown by company:</h4>
                {enrichmentEstimate.breakdown.map((item) => (
                  <div key={item.companyId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.companyName}</p>
                      <p className="text-xs text-gray-600">
                        ~{item.estimatedContacts} contacts • {item.contactCredits} contact + {item.profileCredits} profile
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.contactCredits + item.profileCredits} credits</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Default Settings:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Max 2 contacts per company</li>
                    <li>Roles: Procurement, Category Manager, Owner/CEO/Founder</li>
                    <li>Channels: Email + LinkedIn</li>
                    <li>Verification: Strict (charged only for verified person emails)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleCancelEnrich}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnrich}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Confirm Enrichment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}