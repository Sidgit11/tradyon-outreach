import React from 'react';
import { Play, Pause, BarChart3, Download, Eye } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignsTableProps {
  campaigns: Campaign[];
  onCampaignSelect: (campaignId: string) => void;
  loading?: boolean;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function CampaignsTable({ campaigns, onCampaignSelect, loading = false, showToast }: CampaignsTableProps) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.sent, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Sent</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.delivered, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Delivered</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.opens, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Opens</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.replies, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Replies</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.meetings, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Meetings</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.hotLeads, 0)}
          </div>
          <div className="text-sm text-gray-600">Hot Leads</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.bounces, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Bounces</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns.reduce((sum, c) => sum + c.poCount, 0)}
          </div>
          <div className="text-sm text-gray-600">PO Count</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Sent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Delivered</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Opens</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Clicks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Replies</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Meetings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Hot Leads</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">PO Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => onCampaignSelect(campaign.id)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campaign.sent}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{campaign.delivered}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900">{campaign.opens}</span>
                      <div className="text-xs text-gray-500">
                        {campaign.delivered > 0 ? Math.round(campaign.opens/campaign.delivered*100) : 0}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900">{campaign.clicks}</span>
                      <div className="text-xs text-gray-500">
                        {campaign.opens > 0 ? Math.round(campaign.clicks/campaign.opens*100) : 0}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900">{campaign.replies}</span>
                      <div className="text-xs text-gray-500">
                        {campaign.sent > 0 ? Math.round(campaign.replies/campaign.sent*100) : 0}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900">{campaign.meetings}</span>
                      <div className="text-xs text-gray-500">
                        {campaign.sent > 0 ? Math.round(campaign.meetings/campaign.sent*100) : 0}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900">{campaign.hotLeads}</span>
                      <div className="text-xs text-gray-500">
                        {campaign.sent > 0 ? Math.round(campaign.hotLeads/campaign.sent*100) : 0}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <span className="text-sm text-gray-900">{campaign.poCount}</span>
                      <div className="text-xs text-gray-500">
                        {campaign.sent > 0 ? Math.round(campaign.poCount/campaign.sent*100) : 0}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{campaign.source}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'sending' ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Paused campaign: ${campaign.name}`, 'info');
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors group"
                          title="Pause Campaign"
                        >
                          <Pause className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(`Resumed campaign: ${campaign.name}`, 'info');
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors group"
                          title="Resume Campaign"
                        >
                          <Play className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast('Campaign analytics coming soon!', 'info');
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors group"
                        title="View Analytics"
                      >
                        <BarChart3 className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Exported data for campaign: ${campaign.name}`, 'success');
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors group"
                        title="Export Data"
                      >
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
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