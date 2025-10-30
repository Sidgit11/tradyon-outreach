import React, { useState } from 'react';
import { Search, AlertCircle, Filter } from 'lucide-react';
import { SearchAssumptions, Company } from '../types';
import CompanyTable from './CompanyTable';
import AssumptionsBar from './AssumptionsBar';

interface FindBuyersTabProps {
  currentQuery: string;
  currentAssumptions: SearchAssumptions;
  onAssumptionsChange: (assumptions: SearchAssumptions) => void;
  onSearch: (query: string) => void;
  searchResults: Company[];
  totalCandidates: number;
  resultsShown: number;
  refineSuggestions: string[];
  broadenSuggestions: string[];
  onCompanySelection: (companies: Company[]) => void;
  onEnrichSingle?: (company: Company) => void;
  onViewEnrichedProfile?: (company: Company) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function FindBuyersTab({
  currentQuery,
  currentAssumptions,
  onAssumptionsChange,
  onSearch,
  searchResults,
  totalCandidates,
  resultsShown,
  refineSuggestions,
  broadenSuggestions,
  onCompanySelection,
  onEnrichSingle,
  onViewEnrichedProfile,
  showToast
}: FindBuyersTabProps) {
  const [query, setQuery] = useState(currentQuery);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast('Please enter a search query', 'warning');
      return;
    }
    
    setLoading(true);
    try {
      await onSearch(query);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  const examples = [
    "pepper ASTA 500 Europe 180d",
    "turmeric powder 500g Asia 90d",
    "cardamom green pods US 120d"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Search Section */}
      <div className="max-w-4xl">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., pepper ASTA 500 • 550g pouch • EU • last 180d"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Searching...' : 'See up to 50 best matches'}</span>
            </button>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Quick examples:</span>
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assumptions Bar */}
      {currentAssumptions.hs.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <AssumptionsBar
            assumptions={currentAssumptions}
            onAssumptionsChange={onAssumptionsChange}
          />
        </div>
      )}

      {/* Results Section */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({resultsShown} of {totalCandidates} candidates)
              </h2>
              <p className="text-sm text-gray-600">
                Showing top matches for "{currentQuery}"
              </p>
            </div>
          </div>

          {/* Refine/Broaden Banners */}
          {totalCandidates > 50 && refineSuggestions.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Filter className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Too many results ({totalCandidates} candidates found)
                  </p>
                  <p className="text-sm text-yellow-700 mb-2">
                    Try these filters to refine your search:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {refineSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => showToast(`Applied filter: ${suggestion}`, 'info')}
                        className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {resultsShown < 20 && broadenSuggestions.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    Limited results ({resultsShown} companies found)
                  </p>
                  <p className="text-sm text-blue-700 mb-2">
                    Try these suggestions to broaden your search:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {broadenSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => showToast(`Applied suggestion: ${suggestion}`, 'info')}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company Table */}
          <CompanyTable
            companies={searchResults}
            onCompanySelection={onCompanySelection}
            onEnrichSingle={onEnrichSingle}
            onViewEnrichedProfile={onViewEnrichedProfile}
            showToast={showToast}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && searchResults.length === 0 && currentQuery && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or using broader criteria
          </p>
        </div>
      )}
    </div>
  );
}