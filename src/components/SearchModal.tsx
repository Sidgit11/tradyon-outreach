import React, { useState, useEffect } from 'react';
import { X, Upload, BookOpen, Loader2 } from 'lucide-react';
import { SearchAssumptions } from '../types';
import { mockSearch } from '../mockApi';
import AssumptionsBar from './AssumptionsBar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, assumptions: SearchAssumptions) => void;
}

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [assumptions, setAssumptions] = useState<SearchAssumptions>({
    hs: [],
    markets: [],
    days: 180
  });
  const [isParsingQuery, setIsParsingQuery] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setAssumptions({
        hs: [],
        markets: [],
        days: 180
      });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsParsingQuery(true);
      try {
        const result = await mockSearch(query);
        setAssumptions(result.assumptions);
      } catch (error) {
        console.error('Failed to parse query:', error);
      } finally {
        setIsParsingQuery(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = () => {
    if (query.trim() && assumptions.hs.length > 0) {
      onSearch(query, assumptions);
      onClose();
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Buyer Search</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Main Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you're looking for
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., pepper ASTA 500 • 550g pouch • EU • last 180d"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              
              {/* Quick Examples */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Quick examples:</span>
                <button
                  onClick={() => handleExampleClick('pepper ASTA 500 550g pouch EU 180d')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
                >
                  pepper asta 500 europe 180d
                </button>
                <button
                  onClick={() => handleExampleClick('frozen shrimp 21/25 US 90d')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
                >
                  frozen shrimp 21/25 us 90d
                </button>
              </div>
            </div>

            {/* Alternative Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Upload Spec PDF</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Choose Saved Product Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Assumptions Panel */}
        {(query.trim() || assumptions.hs.length > 0) && (
          <div className="border-t border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Live Parse Results</h3>
                {isParsingQuery && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              </div>
              
              <AssumptionsBar
                assumptions={assumptions}
                onAssumptionsChange={setAssumptions}
              />
              
              {assumptions.hs.length === 0 && query.trim() && !isParsingQuery && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    No HS codes identified. Try being more specific about the product type.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || assumptions.hs.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Run Search
          </button>
        </div>
      </div>
    </div>
  );
}