import React, { useState } from 'react';
import { Bookmark, Users, Send, Eye, Trash2, Plus } from 'lucide-react';
import { Segment, Bookmark as BookmarkType, NavigationScreen } from '../types';

interface SegmentsBookmarksPageProps {
  segments: Segment[];
  bookmarks: BookmarkType[];
  onScreenChange: (screen: NavigationScreen) => void;
  onCreateSegment: (name: string, description: string, companyIds: string[]) => void;
  onAddBookmark: (companyId: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function SegmentsBookmarksPage({
  segments,
  bookmarks,
  onScreenChange,
  onCreateSegment,
  onAddBookmark,
  showToast
}: SegmentsBookmarksPageProps) {
  const [activeTab, setActiveTab] = useState<'segments' | 'bookmarks'>('segments');
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  const tabs = [
    { id: 'segments', label: 'Segments', count: segments.length },
    { id: 'bookmarks', label: 'Bookmarks', count: bookmarks.length }
  ];

  const handleViewSegmentDetail = (segment: Segment) => {
    setSelectedSegment(segment);
  };

  const handleStartCampaignFromSegment = (segment: Segment) => {
    onScreenChange('campaigns');
    showToast(`Starting campaign for segment: ${segment.name}`, 'info');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segments & Bookmarks</h1>
          <p className="text-gray-600 mt-1">
            Organize and manage your saved companies and segments
          </p>
        </div>
        
        <button
          onClick={() => showToast('Create segment functionality available in Build Audience', 'info')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Segment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{label}</span>
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gray-400 rounded-full">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-4">
          {selectedSegment ? (
            // Segment Detail View
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedSegment(null)}
                    className="text-primary-600 hover:text-primary-800 text-sm mb-2"
                  >
                    ← Back to segments
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedSegment.name}</h2>
                  <p className="text-gray-600">{selectedSegment.description}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleStartCampaignFromSegment(selectedSegment)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Start Campaign</span>
                  </button>
                  <button
                    onClick={() => showToast('Enrich more functionality coming soon!', 'info')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Enrich more</span>
                  </button>
                  <button
                    onClick={() => showToast('Export functionality coming soon!', 'info')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Segment Members Table */}
              <div className="space-y-4">
                {/* Bulk Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">Select all</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => showToast('Bulk enrich functionality coming soon!', 'info')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Users className="w-3 h-3" />
                      <span>Enrich</span>
                    </button>
                    <button
                      onClick={() => showToast('Remove from segment functionality coming soon!', 'info')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                    <button
                      onClick={() => showToast('Export functionality coming soon!', 'info')}
                      className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={() => handleStartCampaignFromSegment(selectedSegment)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Start Campaign</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ Country</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedSegment.companies.map((company) => (
                        <tr key={company.companyId} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{company.industry}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{company.hqCountry}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{company.matchScore}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => showToast('View company profile coming soon!', 'info')}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={() => onAddBookmark(company.companyId)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Bookmark"
                              >
                                <Bookmark className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            </div>
          ) : (
            // Segments List View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map((segment) => (
                <div key={segment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{segment.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{segment.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{segment.memberCount} members</span>
                        <span>Updated {segment.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewSegmentDetail(segment)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleStartCampaignFromSegment(segment)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {segments.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No segments yet</h3>
                  <p className="text-gray-600">Create segments from your search results to organize companies</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookmarked Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookmarks.map((bookmark) => (
                    <tr key={bookmark.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Bookmark className="w-4 h-4 text-yellow-500" />
                          <div className="text-sm font-medium text-gray-900">{bookmark.companyName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{bookmark.bookmarkedAt}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => showToast('View profile functionality coming soon!', 'info')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => showToast('Remove bookmark functionality coming soon!', 'info')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Remove Bookmark"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {bookmarks.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-600">Bookmark companies from search results or enriched profiles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}