import React from 'react';
import { 
  BuildAudienceTab, 
  SearchAssumptions, 
  Company, 
  UploadMatchResult, 
  StickyActionBarState,
  Segment
} from '../types';
import FindBuyersTab from './FindBuyersTab';
import UploadListTab from './UploadListTab';
import StickyActionBar from './StickyActionBar';

interface BuildAudiencePageProps {
  activeTab: BuildAudienceTab;
  onTabChange: (tab: BuildAudienceTab) => void;
  currentQuery: string;
  currentAssumptions: SearchAssumptions;
  onAssumptionsChange: (assumptions: SearchAssumptions) => void;
  onSearch: (query: string) => void;
  searchResults: Company[];
  totalCandidates: number;
  resultsShown: number;
  refineSuggestions: string[];
  broadenSuggestions: string[];
  uploadMatchResults: UploadMatchResult[];
  onFileUpload: (file: File) => void;
  stickyActionBar: StickyActionBarState;
  onCompanySelection: (companies: Company[]) => void;
  onGetEnrichmentEstimate: (companyIds: string[]) => void;
  onEnrichCompanies: (companyIds: string[]) => void;
  onCreateSegment: (name: string, description: string, companyIds: string[]) => void;
  onAddToSegment: (segmentId: string, companyIds: string[]) => void;
  onAddBookmark: (companyId: string) => void;
  onStartCampaign: (companies: Company[]) => void;
  segments: Segment[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function BuildAudiencePage({
  activeTab,
  onTabChange,
  currentQuery,
  currentAssumptions,
  onAssumptionsChange,
  onSearch,
  searchResults,
  totalCandidates,
  resultsShown,
  refineSuggestions,
  broadenSuggestions,
  uploadMatchResults,
  onFileUpload,
  stickyActionBar,
  onCompanySelection,
  onGetEnrichmentEstimate,
  onEnrichCompanies,
  onCreateSegment,
  onAddToSegment,
  onAddBookmark,
  onStartCampaign,
  segments,
  showToast
}: BuildAudiencePageProps) {
  const tabs = [
    { id: 'findBuyers', label: 'Find buyers' },
    { id: 'uploadList', label: 'Upload your list' }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Build Audience</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id as BuildAudienceTab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        {activeTab === 'findBuyers' && (
          <FindBuyersTab
            currentQuery={currentQuery}
            currentAssumptions={currentAssumptions}
            onAssumptionsChange={onAssumptionsChange}
            onSearch={onSearch}
            searchResults={searchResults}
            totalCandidates={totalCandidates}
            resultsShown={resultsShown}
            refineSuggestions={refineSuggestions}
            broadenSuggestions={broadenSuggestions}
            onCompanySelection={onCompanySelection}
            showToast={showToast}
          />
        )}

        {activeTab === 'uploadList' && (
          <UploadListTab
            uploadMatchResults={uploadMatchResults}
            onFileUpload={onFileUpload}
            onCompanySelection={onCompanySelection}
            showToast={showToast}
          />
        )}

        {/* Sticky Action Bar */}
        {stickyActionBar.visible && (
          <StickyActionBar
            selectedCompanies={stickyActionBar.selectedCompanies}
            enrichmentEstimate={stickyActionBar.enrichmentEstimate}
            onGetEnrichmentEstimate={onGetEnrichmentEstimate}
            onEnrichCompanies={onEnrichCompanies}
            onCreateSegment={onCreateSegment}
            onAddToSegment={onAddToSegment}
            onStartCampaign={onStartCampaign}
            segments={segments}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}