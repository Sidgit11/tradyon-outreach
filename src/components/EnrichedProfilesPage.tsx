import React, { useState, useEffect } from 'react';
import { Filter, Send, Bookmark, Eye, Download } from 'lucide-react';
import { EnrichedProfile, NavigationScreen } from '../types';
import { mockGetEnrichedProfiles } from '../mockApi';

interface EnrichedProfilesPageProps {
  onScreenChange: (screen: NavigationScreen) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function EnrichedProfilesPage({ onScreenChange, showToast }: EnrichedProfilesPageProps) {
  const [profiles, setProfiles] = useState<EnrichedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    verificationLevel: 'all',
    charged: 'all',
    commodity: 'all',
    geography: 'all',
    industry: 'all'
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await mockGetEnrichedProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load enriched profiles:', error);
      showToast('Failed to load enriched profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedProfiles.length === profiles.length) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(profiles.map(p => p.companyId));
    }
  };

  const handleSelectProfile = (companyId: string) => {
    setSelectedProfiles(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const getVerificationColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enriched Profiles</h1>
          <p className="text-gray-600 mt-1">
            All companies with enriched contact and profile data
          </p>
        </div>
        
        {selectedProfiles.length > 0 && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onScreenChange('campaigns')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Start Campaign ({selectedProfiles.length})</span>
            </button>
            <button
              onClick={() => showToast('Export functionality coming soon!', 'info')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex items-center space-x-4">
            <select
              value={filters.verificationLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, verificationLevel: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Verification</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filters.charged}
              onChange={(e) => setFilters(prev => ({ ...prev, charged: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Billing</option>
              <option value="charged">Charged</option>
              <option value="not_charged">Not Charged</option>
            </select>

            <select
              value={filters.commodity}
              onChange={(e) => setFilters(prev => ({ ...prev, commodity: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Commodities</option>
              <option value="pepper">Pepper</option>
              <option value="turmeric">Turmeric</option>
              <option value="cardamom">Cardamom</option>
            </select>

            <select
              value={filters.geography}
              onChange={(e) => setFilters(prev => ({ ...prev, geography: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Regions</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="americas">Americas</option>
            </select>

            <select
              value={filters.industry}
              onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Industries</option>
              <option value="food_import">Food Import</option>
              <option value="distribution">Distribution</option>
              <option value="trading">Trading</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedProfiles.length === profiles.length && profiles.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Enriched</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R/F/V Summary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr
                  key={profile.companyId}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    selectedProfiles.includes(profile.companyId) ? 'bg-primary-50' : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProfiles.includes(profile.companyId)}
                      onChange={() => handleSelectProfile(profile.companyId)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{profile.companyName}</div>
                      <div className="text-sm text-gray-600">{profile.commodity} • {profile.geography}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVerificationColor(profile.verificationLevel)}`}>
                      {profile.verificationLevel}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{profile.lastEnrichedDate}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {profile.verifiedCount}V / {profile.genericCount}G / {profile.partialCount}P
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      R:{profile.rfvSummary.recency}d F:{profile.rfvSummary.frequency} V:{profile.rfvSummary.volume}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onScreenChange('campaigns')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Start Campaign"
                      >
                        <Send className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => showToast('Add to segment functionality coming soon!', 'info')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Add to Segment"
                      >
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => showToast('Open profile functionality coming soon!', 'info')}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Open Profile"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
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
  );
}