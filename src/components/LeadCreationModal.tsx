import React, { useState } from 'react';
import { X, User, Building2, Package, DollarSign, Calendar, FileText } from 'lucide-react';
import { Lead } from '../types';

interface LeadCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLead: (leadData: Partial<Lead>) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function LeadCreationModal({ isOpen, onClose, onCreateLead, showToast }: LeadCreationModalProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    companyName: '',
    contactName: '',
    email: '',
    source: 'Manual',
    status: 'New',
    interestCommodity: '',
    interestSpec: '',
    estimatedValue: undefined,
    nextBestAction: 'Initial contact',
    dueDate: '',
    notes: ''
  });

  const pipelineStages = [
    'New', 'Qualified', 'Meeting', 'Sample or Quote', 'Negotiation', 'PO or Won', 'Lost'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName?.trim() || !formData.contactName?.trim()) {
      showToast('Company name and contact name are required', 'warning');
      return;
    }

    onCreateLead(formData);
    
    // Reset form
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      source: 'Manual',
      status: 'New',
      interestCommodity: '',
      interestSpec: '',
      estimatedValue: undefined,
      nextBestAction: 'Initial contact',
      dueDate: '',
      notes: ''
    });
  };

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Create New Lead</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-6">
            {/* Company and Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Company Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., EuroSpice GmbH"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  <span>Contact Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName || ''}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Anna Keller"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., anna.keller@eurospice.de"
              />
            </div>

            {/* Lead Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'New'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {pipelineStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Estimated Value ($)</span>
                </label>
                <input
                  type="number"
                  value={formData.estimatedValue || ''}
                  onChange={(e) => handleChange('estimatedValue', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 25000"
                />
              </div>
            </div>

            {/* Interest Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4" />
                  <span>Interest Commodity</span>
                </label>
                <input
                  type="text"
                  value={formData.interestCommodity || ''}
                  onChange={(e) => handleChange('interestCommodity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Black Pepper"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Specification
                </label>
                <input
                  type="text"
                  value={formData.interestSpec || ''}
                  onChange={(e) => handleChange('interestSpec', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., ASTA 500, 500g pouches"
                />
              </div>
            </div>

            {/* Action and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Best Action
                </label>
                <input
                  type="text"
                  value={formData.nextBestAction || ''}
                  onChange={(e) => handleChange('nextBestAction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Send product samples"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add any additional notes about this lead..."
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Lead
          </button>
        </div>
      </div>
    </div>
  );
}