import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { UploadMatchResult, Company } from '../types';
import { downloadCSVTemplate } from '../mockApi';

interface UploadListTabProps {
  uploadMatchResults: UploadMatchResult[];
  onFileUpload: (file: File) => void;
  onCompanySelection: (companies: Company[]) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function UploadListTab({
  uploadMatchResults,
  onFileUpload,
  onCompanySelection,
  showToast
}: UploadListTabProps) {
  const [matchToTradyon, setMatchToTradyon] = useState(true);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      showToast('Please upload a CSV file', 'error');
      return;
    }
    onFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSelectAll = () => {
    if (selectedResults.length === uploadMatchResults.length) {
      setSelectedResults([]);
      onCompanySelection([]);
    } else {
      const allIds = uploadMatchResults.map(r => r.id);
      setSelectedResults(allIds);
      // Convert to Company objects for selection
      const companies: Company[] = uploadMatchResults
        .filter(r => r.status === 'Matched' && r.matchedCompanyId)
        .map(r => ({
          companyId: r.matchedCompanyId!,
          name: r.matchedCompanyName!,
          commodities: [],
          hqCountry: r.originalEntry.country || '',
          originCountries: [],
          destinationCountries: [],
          profileType: 'Unknown',
          industry: 'Unknown',
          matchScore: r.confidence || 0
        }));
      onCompanySelection(companies);
    }
  };

  const handleSelectResult = (resultId: string) => {
    const newSelected = selectedResults.includes(resultId)
      ? selectedResults.filter(id => id !== resultId)
      : [...selectedResults, resultId];
    
    setSelectedResults(newSelected);
    
    // Convert selected results to Company objects
    const companies: Company[] = uploadMatchResults
      .filter(r => newSelected.includes(r.id) && r.status === 'Matched' && r.matchedCompanyId)
      .map(r => ({
        companyId: r.matchedCompanyId!,
        name: r.matchedCompanyName!,
        commodities: [],
        hqCountry: r.originalEntry.country || '',
        originCountries: [],
        destinationCountries: [],
        profileType: 'Unknown',
        industry: 'Unknown',
        matchScore: r.confidence || 0
      }));
    
    onCompanySelection(companies);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Matched':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Multiple':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'New':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Matched':
        return 'bg-green-100 text-green-800';
      case 'Multiple':
        return 'bg-yellow-100 text-yellow-800';
      case 'New':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleContinueWithList = () => {
    if (selectedResults.length === 0) {
      showToast('Please select at least one company to continue', 'warning');
      return;
    }
    showToast(`Continuing with ${selectedResults.length} selected companies`, 'success');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Upload Section */}
      <div className="max-w-4xl">
        <div className="space-y-4">
          {/* Dropzone */}
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
                Upload a list of companies to match against Tradyon profiles
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
                  Choose CSV
                </span>
              </label>
              
              <button
                onClick={downloadCSVTemplate}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV template
              </button>
            </div>
          </div>

          {/* Match Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="matchToggle"
                checked={matchToTradyon}
                onChange={(e) => setMatchToTradyon(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="matchToggle" className="text-sm font-medium text-gray-900">
                Match to Tradyon profiles
              </label>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Automatically match your companies to existing Tradyon profiles for richer data
                </div>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">Recommended</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {uploadMatchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Results ({uploadMatchResults.length} entries)
            </h2>
            <button
              onClick={handleContinueWithList}
              disabled={selectedResults.length === 0}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue with this list ({selectedResults.length} selected)
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedResults.length === uploadMatchResults.length && uploadMatchResults.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Entry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matched Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {uploadMatchResults.map((result) => (
                    <tr
                      key={result.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        selectedResults.includes(result.id) ? 'bg-primary-50' : ''
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedResults.includes(result.id)}
                          onChange={() => handleSelectResult(result.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{result.originalEntry.name}</div>
                          <div className="text-sm text-gray-600">
                            {result.originalEntry.country && `${result.originalEntry.country} • `}
                            {result.originalEntry.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {result.confidence && (
                          <span className="text-sm text-gray-900">{result.confidence}%</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {result.matchedCompanyName ? (
                          <div className="text-sm text-gray-900">{result.matchedCompanyName}</div>
                        ) : result.status === 'New' ? (
                          <span className="text-sm text-gray-500">Will be added as new</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {result.status === 'Multiple' && (
                          <button
                            onClick={() => showToast('Resolve conflicts functionality coming soon!', 'info')}
                            className="text-sm text-primary-600 hover:text-primary-800 underline"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadMatchResults.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your company list</h3>
          <p className="text-gray-600">
            Upload a CSV file to match your companies against Tradyon profiles
          </p>
        </div>
      )}
    </div>
  );
}