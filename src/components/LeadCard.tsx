import React, { useState } from 'react';
import { X, Calendar, DollarSign, User, Building2, Package, FileText, Clock, MessageSquare, Quote, CheckCircle } from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (leadId: string, newStatus: Lead['status'], reason?: string) => void;
  onCreateQuote: (lead: Lead) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function LeadCard({ lead, onClose, onStatusChange, onCreateQuote, showToast }: LeadCardProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'notes'>('details');
  const [newNote, setNewNote] = useState('');
  const [showStatusChange, setShowStatusChange] = useState(false);

  const pipelineStages = [
    { id: 'New', label: 'New', color: 'bg-gray-100 text-gray-800' },
    { id: 'Qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
    { id: 'Meeting', label: 'Meeting', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Sample or Quote', label: 'Sample/Quote', color: 'bg-orange-100 text-orange-800' },
    { id: 'Negotiation', label: 'Negotiation', color: 'bg-purple-100 text-purple-800' },
    { id: 'PO or Won', label: 'Won', color: 'bg-green-100 text-green-800' },
    { id: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusColor = (status: string) => {
    const stage = pipelineStages.find(s => s.id === status);
    return stage?.color || 'bg-gray-100 text-gray-800';
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'lead_created': return <User className="w-4 h-4 text-blue-600" />;
      case 'status_change': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'quote_sent': return <Quote className="w-4 h-4 text-purple-600" />;
      case 'campaign_reply': return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'meeting_scheduled': return <Calendar className="w-4 h-4 text-yellow-600" />;
      case 'sample_sent': return <Package className="w-4 h-4 text-indigo-600" />;
      case 'po_received': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'note_added': return <FileText className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleStatusChange = (newStatus: Lead['status']) => {
    onStatusChange(lead.id, newStatus, 'Status changed manually');
    setShowStatusChange(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // In a real app, this would call an API to add the note
    showToast('Note added successfully!', 'success');
    setNewNote('');
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: Building2 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{lead.companyName}</h2>
            <p className="text-sm text-gray-600">{lead.contactName}</p>
            {lead.email && (
              <p className="text-xs text-gray-500">{lead.email}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Status and Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
              {lead.statusReason && (
                <p className="text-xs text-gray-500 mt-1">{lead.statusReason}</p>
              )}
            </div>
            <button
              onClick={() => setShowStatusChange(!showStatusChange)}
              className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Change Status
            </button>
          </div>

          {showStatusChange && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                {pipelineStages.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => handleStatusChange(stage.id as Lead['status'])}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      stage.id === lead.status 
                        ? stage.color 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={() => onCreateQuote(lead)}
              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Create Quote
            </button>
            <button
              onClick={() => showToast('Schedule meeting functionality coming soon!', 'info')}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Key Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Interest</div>
                    <div className="text-sm text-gray-600">
                      {lead.interestCommodity || 'Not specified'}
                    </div>
                    {lead.interestSpec && (
                      <div className="text-xs text-gray-500">{lead.interestSpec}</div>
                    )}
                  </div>
                </div>

                {lead.estimatedValue && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Estimated Value</div>
                      <div className="text-sm text-gray-600">${lead.estimatedValue.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {lead.nextBestAction && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Next Best Action</div>
                      <div className="text-sm text-gray-600">{lead.nextBestAction}</div>
                    </div>
                  </div>
                )}

                {lead.dueDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Due Date</div>
                      <div className={`text-sm ${
                        new Date(lead.dueDate) < new Date() 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-600'
                      }`}>
                        {new Date(lead.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Source</div>
                    <div className="text-sm text-gray-600">{lead.source}</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Notes</div>
                  <div className="text-sm text-gray-600">{lead.notes}</div>
                </div>
              )}

              {/* Attachments */}
              {lead.attachments && lead.attachments.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">Attachments</div>
                  <div className="space-y-2">
                    {lead.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Activity Timeline</h3>
              <div className="space-y-3">
                {lead.timeline.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{event.description}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          {event.details.oldStatus && event.details.newStatus && (
                            <span>Changed from {event.details.oldStatus} to {event.details.newStatus}</span>
                          )}
                          {event.details.quoteId && (
                            <span>Quote ID: {event.details.quoteId}</span>
                          )}
                          {event.details.campaignId && (
                            <span>Campaign ID: {event.details.campaignId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Note
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add a note about this lead..."
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Note
                </button>
              </div>

              {/* Existing Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Previous Notes</h4>
                <div className="space-y-2">
                  {lead.notes ? (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-900">{lead.notes}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Added on {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No notes yet</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}