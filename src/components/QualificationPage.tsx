import React, { useState, useEffect } from 'react';
import { Settings, Play, Undo2, ChevronDown, ChevronUp } from 'lucide-react';
import { QualifiedBuyer, QualificationRules, SearchAssumptions } from '../types';
import { mockQualification, mockAutoQualify } from '../mockApi';
import QualificationTable from './QualificationTable';
import BuyerQualificationDrawer from './BuyerQualificationDrawer';

interface QualificationPageProps {
  assumptions: SearchAssumptions;
}

export default function QualificationPage({ assumptions }: QualificationPageProps) {
  const [buyers, setBuyers] = useState<QualifiedBuyer[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<QualifiedBuyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [rules, setRules] = useState<QualificationRules>({
    last_activity_days: 90,
    min_shipments_180d: 3,
    min_moq_mt: 5,
    min_spec_fit: 'close',
    exclude_sanctions: true
  });
  const [rulesHistory, setRulesHistory] = useState<QualificationRules[]>([]);

  useEffect(() => {
    loadQualification();
  }, []);

  const loadQualification = async () => {
    setLoading(true);
    try {
      const data = await mockQualification();
      setBuyers(data);
    } catch (error) {
      console.error('Failed to load qualification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoQualify = async () => {
    setLoading(true);
    setRulesHistory(prev => [...prev, rules]);
    try {
      const data = await mockAutoQualify(rules);
      setBuyers(data);
    } catch (error) {
      console.error('Failed to auto-qualify:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRuleChange = (key: keyof QualificationRules, value: any) => {
    setRules(prev => ({ ...prev, [key]: value }));
  };

  const handleUndo = () => {
    if (rulesHistory.length > 0) {
      const newHistory = [...rulesHistory];
      const previousRules = newHistory.pop()!;
      setRules(previousRules);
      setRulesHistory(newHistory);
    }
  };

  const statusCounts = buyers.reduce((acc, buyer) => {
    acc[buyer.status] = (acc[buyer.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Buyer Qualification</h2>
          <p className="text-gray-600">
            Auto-label buyers based on activity, volume, and network signals
          </p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          ))}
        </div>

        {/* Auto-Qualify Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Auto-Qualify</h3>
              <p className="text-sm text-gray-600">
                Default rules: activity ≤90d, shipments ≥3, MOQ ≥5MT, spec fit ≥close
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {rulesHistory.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Undo</span>
                </button>
              )}
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Controls</span>
                {showControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={handleAutoQualify}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Run Auto-Qualify</span>
              </button>
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Activity (days)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    value={rules.last_activity_days}
                    onChange={(e) => handleRuleChange('last_activity_days', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>30</span>
                    <span>{rules.last_activity_days}d</span>
                    <span>180</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Shipments (180d)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rules.min_shipments_180d}
                    onChange={(e) => handleRuleChange('min_shipments_180d', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>{rules.min_shipments_180d}</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min MOQ (MT)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={rules.min_moq_mt}
                    onChange={(e) => handleRuleChange('min_moq_mt', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>{rules.min_moq_mt}MT</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spec Fit
                  </label>
                  <select
                    value={rules.min_spec_fit}
                    onChange={(e) => handleRuleChange('min_spec_fit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="exact">Exact</option>
                    <option value="close">Close</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="exclude_sanctions"
                  checked={rules.exclude_sanctions}
                  onChange={(e) => handleRuleChange('exclude_sanctions', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="exclude_sanctions" className="text-sm text-gray-700">
                  Exclude sanctioned entities and payment holds
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowControls(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAutoQualify}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Rules
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Qualification Table */}
        <QualificationTable
          buyers={buyers}
          onBuyerSelect={setSelectedBuyer}
          loading={loading}
        />
      </div>

      {/* Buyer Detail Drawer */}
      <BuyerQualificationDrawer
        buyer={selectedBuyer}
        onClose={() => setSelectedBuyer(null)}
      />
    </div>
  );
}