import React, { useState, useEffect } from 'react';
import { Plus, Upload, Filter, Users, TrendingUp, Calendar, DollarSign, Eye, Edit3, Trash2 } from 'lucide-react';
import { Lead, NavigationScreen, Product } from '../types';
import { mockGetLeads, mockCreateLead, mockUpdateLeadStatus, mockUploadLeadCSV, downloadLeadCSVTemplate } from '../mockApi';
import LeadCard from './LeadCard';
import LeadCreationModal from './LeadCreationModal';
import LeadCSVUploadModal from './LeadCSVUploadModal';
import QuoteGeneratorModal from './QuoteGeneratorModal';

interface HotLeadsPageProps {
  leads: Lead[];
  onLeadsChange: (leads: Lead[]) => void;
  products: Product[];
  onScreenChange: (screen: NavigationScreen) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function HotLeadsPage({ 
  leads, 
  onLeadsChange, 
  products, 
  onScreenChange, 
  showToast 
}: HotLeadsPageProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showLeadCreationModal, setShowLeadCreationModal] = useState(false);
  const [showLeadCSVUploadModal, setShowLeadCSVUploadModal] = useState(false);
  const [showQuoteGeneratorModal, setShowQuoteGeneratorModal] = useState(false);
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    owner: 'all'
  });

  const pipelineStages = [
    { id: 'New', label: 'New', color: 'bg-gray-100 text-gray-800' },
    { id: 'Qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-800' },
    { id: 'Meeting', label: 'Meeting', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Sample or Quote', label: 'Sample/Quote', color: 'bg-orange-100 text-orange-800' },
    { id: 'Negotiation', label: 'Negotiation', color: 'bg-purple-100 text-purple-800' },
    { id: 'PO or Won', label: 'Won', color: 'bg-green-100 text-green-800' },
    { id: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' }
  ];

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleLeadStatusChange = async (leadId: string, newStatus: Lead['status'], reason?: string) => {
    try {
      const updatedLead = await mockUpdateLeadStatus(leadId, newStatus, reason);
      const updatedLeads = leads.map(l => l.id === leadId ? updatedLead : l);
      onLeadsChange(updatedLeads);
      
      if (selectedLead?.id === leadId) {
        setSelectedLead(updatedLead);
      }
      
      showToast(`Lead status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Failed to update lead status:', error);
      showToast('Failed to update lead status', 'error');
    }
  };

  const handleCreateLead = async (leadData: Partial<Lead>) => {
    try {
      const newLead = await mockCreateLead(leadData);
      onLeadsChange([...leads, newLead]);
      setShowLeadCreationModal(false);
      showToast('Lead created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create lead:', error);
      showToast('Failed to create lead', 'error');
    }
  };

  const handleBulkCreateLeads = async (leadsData: Partial<Lead>[]) => {
    try {
      const newLeads = await Promise.all(leadsData.map(leadData => mockCreateLead(leadData)));
      onLeadsChange([...leads, ...newLeads]);
      setShowLeadCSVUploadModal(false);
      showToast(`${newLeads.length} leads created successfully!`, 'success');
    } catch (error) {
      console.error('Failed to create leads:', error);
      showToast('Failed to create leads', 'error');
    }
  };

  const handleCreateQuote = (lead: Lead) => {
    setSelectedLeadForQuote(lead);
    setShowQuoteGeneratorModal(true);
  };

  const handleQuoteGenerated = (lead: Lead) => {
    // Refresh the lead data
    const updatedLeads = leads.map(l => l.id === lead.id ? lead : l);
    onLeadsChange(updatedLeads);
    
    if (selectedLead?.id === lead.id) {
      setSelectedLead(lead);
    }
    
    setShowQuoteGeneratorModal(false);
    setSelectedLeadForQuote(null);
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleBulkStatusChange = async (newStatus: Lead['status']) => {
    if (selectedLeads.length === 0) {
      showToast('Please select leads to update', 'warning');
      return;
    }

    try {
      setLoading(true);
      const updatedLeads = [...leads];
      
      for (const leadId of selectedLeads) {
        const updatedLead = await mockUpdateLeadStatus(leadId, newStatus, 'Bulk status update');
        const index = updatedLeads.findIndex(l => l.id === leadId);
        if (index !== -1) {
          updatedLeads[index] = updatedLead;
        }
      }
      
      onLeadsChange(updatedLeads);
      setSelectedLeads([]);
      showToast(`${selectedLeads.length} leads updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Failed to bulk update leads:', error);
      showToast('Failed to update leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.source !== 'all' && lead.source !== filters.source) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    const stage = pipelineStages.find(s => s.id === status);
    return stage?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusCounts = () => {
    return pipelineStages.map(stage => ({
      ...stage,
      count: leads.filter(l => l.status === stage.id).length
    }));
  };

  const totalValue = leads
    .filter(l => l.estimatedValue && !['Lost'].includes(l.status))
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

  return (
    <div className="flex-1 flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hot Leads</h1>
              <p className="text-gray-600 mt-1">
                Manage your sales pipeline and track opportunities
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowLeadCreationModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Lead</span>
              </button>
              
              <button
                onClick={() => setShowLeadCSVUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload CSV</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
                  <div className="text-sm text-gray-600">Total Leads</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Pipeline Value</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {leads.filter(l => ['Qualified', 'Meeting', 'Sample or Quote', 'Negotiation'].includes(l.status)).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Leads</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {leads.filter(l => l.dueDate && new Date(l.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-gray-600">Due This Week</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Status Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Pipeline Overview</h3>
            <div className="flex space-x-2">
              {getStatusCounts().map(stage => (
                <div
                  key={stage.id}
                  className={`flex-1 text-center p-3 rounded-lg ${stage.color} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => setFilters(prev => ({ ...prev, status: stage.id }))}
                >
                  <div className="font-medium">{stage.count}</div>
                  <div className="text-xs">{stage.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {pipelineStages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>

            <select
              value={filters.source}
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="Campaign">Campaign</option>
              <option value="Manual">Manual</option>
              <option value="CSV">CSV</option>
            </select>

            {selectedLeads.length > 0 && (
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-sm text-gray-600">{selectedLeads.length} selected</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusChange(e.target.value as Lead['status']);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Move to...</option>
                  {pipelineStages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company/Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                      selectedLeads.includes(lead.id) ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => handleLeadSelect(lead)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectLead(lead.id);
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.companyName}</div>
                        <div className="text-sm text-gray-600">{lead.contactName}</div>
                        {lead.email && (
                          <div className="text-xs text-gray-500">{lead.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        {lead.statusReason && (
                          <div className="text-xs text-gray-500 mt-1">{lead.statusReason}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        {lead.interestCommodity && (
                          <div className="text-sm text-gray-900">{lead.interestCommodity}</div>
                        )}
                        {lead.interestSpec && (
                          <div className="text-xs text-gray-500">{lead.interestSpec}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {lead.estimatedValue && (
                        <div className="text-sm text-gray-900">${lead.estimatedValue.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {lead.nextBestAction && (
                        <div className="text-sm text-gray-700">{lead.nextBestAction}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {lead.dueDate && (
                        <div className={`text-sm ${
                          new Date(lead.dueDate) < new Date() 
                            ? 'text-red-600 font-medium' 
                            : new Date(lead.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'text-orange-600'
                            : 'text-gray-900'
                        }`}>
                          {new Date(lead.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{lead.source}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeadSelect(lead);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateQuote(lead);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Create Quote"
                        >
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-6">
              {leads.length === 0 
                ? "Create your first lead to start tracking opportunities"
                : "No leads match your current filters"
              }
            </p>
            {leads.length === 0 && (
              <button
                onClick={() => setShowLeadCreationModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First Lead
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <LeadCard
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleLeadStatusChange}
          onCreateQuote={handleCreateQuote}
          showToast={showToast}
        />
      )}

      {/* Modals */}
      <LeadCreationModal
        isOpen={showLeadCreationModal}
        onClose={() => setShowLeadCreationModal(false)}
        onCreateLead={handleCreateLead}
        showToast={showToast}
      />

      <LeadCSVUploadModal
        isOpen={showLeadCSVUploadModal}
        onClose={() => setShowLeadCSVUploadModal(false)}
        onBulkCreateLeads={handleBulkCreateLeads}
        showToast={showToast}
      />

      {selectedLeadForQuote && (
        <QuoteGeneratorModal
          isOpen={showQuoteGeneratorModal}
          onClose={() => {
            setShowQuoteGeneratorModal(false);
            setSelectedLeadForQuote(null);
          }}
          lead={selectedLeadForQuote}
          products={products}
          onQuoteGenerated={handleQuoteGenerated}
          showToast={showToast}
        />
      )}
    </div>
  );
}