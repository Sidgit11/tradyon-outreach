import React, { useState } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Lead } from '../types';
import { mockUploadLeadCSV, downloadLeadCSVTemplate } from '../mockApi';

interface LeadCSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkCreateLeads: (leadsData: Partial<Lead>[]) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function LeadCSVUploadModal({ isOpen, onClose, onBulkCreateLeads, showToast }: LeadCSVUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ leads: Partial<Lead>[]; errors: string[] } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      showToast('Please upload a CSV file', 'error');
      return;
    }
    setFile(selectedFile);
    setUploadResults(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a file first', 'warning');
      return;
    }

    setUploading(true);
    try {
      const results = await mockUploadLeadCSV(file);
      setUploadResults(results);
      
      if (results.errors.length > 0) {
        showToast(`Upload completed with ${results.errors.length} errors`, 'warning');
      } else {
        showToast(`Successfully parsed ${results.leads.length} leads`, 'success');
      }
    } catch (error) {
      console.error('Failed to upload CSV:', error);
      showToast('Failed to upload CSV file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateLeads = () => {
    if (!uploadResults || uploadResults.leads.length === 0) {
      showToast('No valid leads to create', 'warning');
      return;
    }

    onBulkCreateLeads(uploadResults.leads);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setUploadResults(null);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upload Leads CSV</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Drop your CSV file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-600">
                    Upload a CSV file with lead information
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <span className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      Choose CSV File
                    </span>
                  </label>
                  
                  <button
                    onClick={downloadLeadCSVTemplate}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                </div>
              </div>

              {file && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CSV Format Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Required columns:</strong> Company Name, Contact Name</p>
                <p><strong>Optional columns:</strong> Email, Phone, Interest Commodity, Interest Spec, Estimated Value, Notes, Due Date</p>
                <p><strong>Note:</strong> All leads will be created with status "New" and source "CSV"</p>
              </div>
            </div>

            {/* Upload Results */}
            {uploadResults && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Upload Results</h4>
                
                {/* Success Summary */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {uploadResults.leads.length} leads ready to create
                    </span>
                  </div>
                </div>

                {/* Errors */}
                {uploadResults.errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-800 mb-2">
                          {uploadResults.errors.length} errors found:
                        </div>
                        <ul className="text-sm text-red-700 space-y-1">
                          {uploadResults.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview of Leads */}
                {uploadResults.leads.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Preview (first 3 leads):</h5>
                    <div className="space-y-2">
                      {uploadResults.leads.slice(0, 3).map((lead, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.companyName} - {lead.contactName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {lead.email && `${lead.email} • `}
                            {lead.interestCommodity && `Interest: ${lead.interestCommodity} • `}
                            {lead.estimatedValue && `Value: $${lead.estimatedValue.toLocaleString()}`}
                          </div>
                        </div>
                      ))}
                      {uploadResults.leads.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{uploadResults.leads.length - 3} more leads
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          
          {!uploadResults ? (
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Processing...' : 'Process CSV'}
            </button>
          ) : (
            <button
              onClick={handleCreateLeads}
              disabled={uploadResults.leads.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create {uploadResults.leads.length} Leads
            </button>
          )}
        </div>
      </div>
    </div>
  );
}