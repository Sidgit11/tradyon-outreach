import React, { useState } from 'react';
import { X, Plus, Bookmark } from 'lucide-react';
import { Company, Segment } from '../types';

interface SegmentPopoverProps {
  selectedCompanies: Company[];
  segments: Segment[];
  onCreateSegment: (name: string, description: string, companyIds: string[]) => void;
  onAddToSegment: (segmentId: string, companyIds: string[]) => void;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function SegmentPopover({
  selectedCompanies,
  segments,
  onCreateSegment,
  onAddToSegment,
  onClose,
  showToast
}: SegmentPopoverProps) {
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentDescription, setNewSegmentDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleAddToExistingSegment = (segmentId: string) => {
    const companyIds = selectedCompanies.map(c => c.companyId);
    onAddToSegment(segmentId, companyIds);
    onClose();
  };

  const handleCreateNewSegment = () => {
    if (!newSegmentName.trim()) {
      showToast('Please enter a segment name', 'warning');
      return;
    }

    const companyIds = selectedCompanies.map(c => c.companyId);
    onCreateSegment(newSegmentName, newSegmentDescription, companyIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add to Segment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-sm text-gray-600">
            Adding {selectedCompanies.length} companies to segment
          </div>

          {/* Existing Segments */}
          {segments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Segments</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {segments.slice(0, 5).map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => handleAddToExistingSegment(segment.id)}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{segment.name}</div>
                      <div className="text-sm text-gray-500">{segment.memberCount} members</div>
                    </div>
                    <Bookmark className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create New Segment */}
          <div>
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Create new segment</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment Name
                  </label>
                  <input
                    type="text"
                    value={newSegmentName}
                    onChange={(e) => setNewSegmentName(e.target.value)}
                    placeholder="e.g., EU Pepper Importers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={newSegmentDescription}
                    onChange={(e) => setNewSegmentDescription(e.target.value)}
                    placeholder="Brief description of this segment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewSegment}
                    className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}