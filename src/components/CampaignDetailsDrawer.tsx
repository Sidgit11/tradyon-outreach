import React, { useState } from 'react';
import { X, Eye, Star, Tag, Download, TrendingUp } from 'lucide-react';
import { CampaignDetail, CampaignRecipient } from '../types';
import { mockGetCampaignMessage } from '../mockApi';

interface CampaignDetailsDrawerProps {
  campaignDetail: CampaignDetail | null;
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function CampaignDetailsDrawer({ campaignDetail, onClose, showToast }: CampaignDetailsDrawerProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<CampaignRecipient | null>(null);
  const [messageDetails, setMessageDetails] = useState<{ subject: string; body: string; replyText?: string } | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [filters, setFilters] = useState({
    engagement: 'all',
    geography: 'all'
  });

  if (!campaignDetail) return null;

  const handleViewMessage = async (recipient: CampaignRecipient, eventType: string) => {
    try {
      const message = await mockGetCampaignMessage(campaignDetail.id, recipient.contactId);
      setMessageDetails(message);
      setSelectedRecipient(recipient);
      setShowMessageModal(true);
    } catch (error) {
      console.error('Failed to load message:', error);
      showToast('Failed to load message details', 'error');
    }
  };

  const handleMarkInterested = (recipient: CampaignRecipient) => {
    showToast(`Marked ${recipient.contactName} as interested`, 'success');
  };

  const handleAddToHotLeads = (recipient: CampaignRecipient) => {
    showToast(`Added ${recipient.contactName} to Hot Leads`, 'success');
  };

  const handleTagCommodity = (recipient: CampaignRecipient) => {
    showToast(`Tagged commodity interest for ${recipient.contactName}`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'replied': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'po': return 'bg-purple-100 text-purple-800';
      case 'opened': return 'bg-yellow-100 text-yellow-800';
      case 'clicked': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'sent': return '📤';
      case 'delivered': return '✅';
      case 'opened': return '👁️';
      case 'clicked': return '🖱️';
      case 'replied': return '💬';
      case 'meeting': return '📅';
      case 'po': return '💰';
      case 'bounced': return '❌';
      default: return '📋';
    }
  };

  const filteredAudience = campaignDetail.audience.filter(recipient => {
    if (filters.engagement !== 'all' && recipient.status !== filters.engagement) {
      return false;
    }
    // Add geography filter logic here if needed
    return true;
  });

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{campaignDetail.name}</h2>
            <p className="text-sm text-gray-600">Campaign Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* KPIs */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{campaignDetail.metrics.sent}</div>
              <div className="text-xs text-gray-600">Sent</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{campaignDetail.metrics.delivered}</div>
              <div className="text-xs text-gray-600">Delivered</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{campaignDetail.metrics.opens}</div>
              <div className="text-xs text-gray-600">Opens</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{campaignDetail.metrics.replies}</div>
              <div className="text-xs text-gray-600">Replies</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{campaignDetail.metrics.meetings}</div>
              <div className="text-xs text-gray-600">Meetings</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{campaignDetail.metrics.poCount}</div>
              <div className="text-xs text-gray-600">POs</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <select
              value={filters.engagement}
              onChange={(e) => setFilters(prev => ({ ...prev, engagement: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Engagement</option>
              <option value="replied">Replied</option>
              <option value="opened">Opened</option>
              <option value="clicked">Clicked</option>
              <option value="bounced">Bounced</option>
            </select>
            <button
              onClick={() => showToast('Export functionality coming soon!', 'info')}
              className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Audience Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Audience ({filteredAudience.length} recipients)
            </h3>
            <div className="space-y-3">
              {filteredAudience.map((recipient) => (
                <div key={recipient.contactId} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{recipient.contactName}</div>
                      <div className="text-sm text-gray-600">{recipient.companyName}</div>
                      <div className="text-xs text-gray-500">{recipient.email}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipient.status)}`}>
                      {recipient.status}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">Timeline:</div>
                    {recipient.timeline.map((event, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span>{getEventIcon(event.type)}</span>
                          <span className="text-gray-600">{event.type}</span>
                          <span className="text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {(event.type === 'sent' || event.type === 'replied') && (
                          <button
                            onClick={() => handleViewMessage(recipient, event.type)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="View Message"
                          >
                            <Eye className="w-3 h-3 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleMarkInterested(recipient)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                      <Star className="w-3 h-3" />
                      <span>Interested</span>
                    </button>
                    <button
                      onClick={() => handleAddToHotLeads(recipient)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>Hot Lead</span>
                    </button>
                    <button
                      onClick={() => handleTagCommodity(recipient)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      <span>Tag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && messageDetails && selectedRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">To:</div>
                  <div className="text-sm text-gray-900">{selectedRecipient.contactName} ({selectedRecipient.email})</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Subject:</div>
                  <div className="text-sm text-gray-900">{messageDetails.subject}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Message:</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {messageDetails.body}
                  </div>
                </div>
                
                {messageDetails.replyText && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Reply:</div>
                    <div className="text-sm text-gray-900 whitespace-pre-wrap bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      {messageDetails.replyText}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}