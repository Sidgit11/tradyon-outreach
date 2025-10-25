import React, { useState, useEffect } from 'react';
import { Save, Download, Calendar, AlertCircle } from 'lucide-react';
import { BuyerRow, SearchAssumptions, SearchWeights, SmartList, NavigationScreen, Contact, OutreachMessage } from '../types';
import { mockBuyerSearch } from '../mockApi';
import BuyerTable from './BuyerTable';
import WeightSliders from './WeightSliders';
import FilterSidebar from './FilterSidebar';
import BuyerDetailDrawer from './BuyerDetailDrawer';

interface ResultsPageProps {
  query: string;
  assumptions: SearchAssumptions;
  onSaveSmartList: (listData: Omit<SmartList, 'id' | 'createdAt' | 'lastRefresh' | 'nextRefresh' | 'newLeadsCount' | 'refreshStatus'>) => void;
  onPinToShortlist: (buyerName: string, matchScore: number) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onScreenChange: (screen: NavigationScreen, options?: { buyerId?: string; contact?: Contact; template?: OutreachMessage['template'] }) => void;
}

export default function ResultsPage({ query, assumptions, onSaveSmartList, onPinToShortlist, showToast, onScreenChange }: ResultsPageProps) {
  const [buyers, setBuyers] = useState<BuyerRow[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerRow | null>(null);
  const [weights, setWeights] = useState<SearchWeights>({
    recency: 40,
    volume: 25,
    growth: 15,
    spec_fit: 20
  });
  const [loading, setLoading] = useState(true);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [listName, setListName] = useState(`Buyers: ${query}`);
  const [refreshFrequency, setRefreshFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'manual'>('daily');
  const [automationSettings, setAutomationSettings] = useState({
    notifyOnNewBuyer: false,
    alertOnVolumeIncrease: false,
    moqThresholdCrossed: false
  });

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    setLoading(true);
    try {
      const data = await mockBuyerSearch();
      setBuyers(data);
    } catch (error) {
      console.error('Failed to load buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyerSelect = (buyer: BuyerRow) => {
    setSelectedBuyer(buyer);
  };

  const handleBuyerAction = (buyer: BuyerRow, action: 'pin' | 'qualify' | 'enrich' | 'outreach') => {
    switch (action) {
      case 'pin':
        onPinToShortlist(buyer.buyer, buyer.match_score);
        break;
      case 'qualify':
        onScreenChange('qualify', { buyerId: buyer.buyer });
        break;
      case 'enrich':
        onScreenChange('contacts', { buyerId: buyer.buyer });
        break;
      case 'outreach':
        const mockContact: Contact = {
          id: `contact_${buyer.buyer}`,
          company_name: buyer.buyer,
          contact_name: 'Team',
          email: 'info@example.com',
          verification: 'generic',
          billed: false
        };
        onScreenChange('outreach', { contact: mockContact, template: 'intro' });
        break;
    }
  };

  const handleWeightsChange = (newWeights: SearchWeights) => {
    setWeights(newWeights);
    // In real app, this would re-rank the results
    setBuyers(prev => [...prev].sort((a, b) => b.match_score - a.match_score));
  };

  const handleSaveSmartList = () => {
    setShowSaveOptions(true);
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = buyers.map(buyer => 
      `${buyer.rank},${buyer.buyer},${buyer.match_score},${buyer.last_ship},${buyer.vol_90d_mt}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buyer-search-${Date.now()}.csv`;
    a.click();
    showToast('Buyer list exported successfully!', 'success');
  };

  const handleSaveList = () => {
    const listData = {
      name: listName,
      query,
      assumptions,
      refreshFrequency,
      automationSettings
    };
    onSaveSmartList(listData);
    setShowSaveOptions(false);
  };

  const handleBroadenSearch = () => {
    showToast('Opening search modal to broaden criteria...', 'info');
    // This would typically open the search modal
  };

  return (
    <div className="flex-1 flex">
      {/* Left Sidebar - Filters */}
      <div className="w-64 p-6">
        <FilterSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Buyer Search Results</h2>
              <p className="text-gray-600 mt-1">
                {loading ? 'Loading...' : `${buyers.length} buyers found`} for "{query}"
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveSmartList}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Smart List</span>
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Quality Indicators */}
          {!loading && buyers.length < 5 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Limited Results</p>
                <p className="text-sm text-yellow-700">
                  Consider broadening your search criteria to find more buyers. Try expanding the timeframe or adjusting grade requirements.
                </p>
                <button 
                  onClick={handleBroadenSearch}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-1"
                >
                  Broaden search criteria
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <BuyerTable
              buyers={buyers}
              onBuyerSelect={handleBuyerSelect}
              onBuyerAction={handleBuyerAction}
              loading={loading}
            />
          </div>
          
          <div className="space-y-4">
            <WeightSliders
              weights={weights}
              onWeightsChange={handleWeightsChange}
            />
            
            {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Weights must total 100%. Current total: {Object.values(weights).reduce((a, b) => a + b, 0)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buyer Detail Drawer */}
      <BuyerDetailDrawer
        buyer={selectedBuyer}
        onClose={() => setSelectedBuyer(null)}
        onPinToShortlist={onPinToShortlist}
        onScreenChange={onScreenChange}
        showToast={showToast}
      />

      {/* Save Options Modal */}
      {showSaveOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save as Smart List</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Name
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-refresh frequency
                </label>
                <select 
                  value={refreshFrequency}
                  onChange={(e) => setRefreshFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Manual only</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={automationSettings.notifyOnNewBuyer}
                    onChange={(e) => setAutomationSettings(prev => ({ ...prev, notifyOnNewBuyer: e.target.checked }))}
                    className="rounded" 
                  />
                  <span className="text-sm text-gray-700">Notify on new buyers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={automationSettings.alertOnVolumeIncrease}
                    onChange={(e) => setAutomationSettings(prev => ({ ...prev, alertOnVolumeIncrease: e.target.checked }))}
                    className="rounded" 
                  />
                  <span className="text-sm text-gray-700">Alert when volume increases &gt; 30%</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={automationSettings.moqThresholdCrossed}
                    onChange={(e) => setAutomationSettings(prev => ({ ...prev, moqThresholdCrossed: e.target.checked }))}
                    className="rounded" 
                  />
                  <span className="text-sm text-gray-700">MOQ threshold crossed</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSaveOptions(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveList}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}