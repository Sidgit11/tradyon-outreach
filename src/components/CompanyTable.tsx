import React, { useState } from 'react';
import { Star, MapPin, Building2, Package } from 'lucide-react';
import { Company } from '../types';

interface CompanyTableProps {
  companies: Company[];
  onCompanySelection: (companies: Company[]) => void;
  onEnrichSingle?: (company: Company) => void;
  onViewEnrichedProfile?: (company: Company) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function CompanyTable({ companies, onCompanySelection, onEnrichSingle, onViewEnrichedProfile, showToast }: CompanyTableProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
      onCompanySelection([]);
    } else {
      const allIds = companies.map(c => c.companyId);
      setSelectedCompanies(allIds);
      onCompanySelection(companies);
    }
  };

  const handleSelectCompany = (companyId: string) => {
    const newSelected = selectedCompanies.includes(companyId)
      ? selectedCompanies.filter(id => id !== companyId)
      : [...selectedCompanies, companyId];
    
    setSelectedCompanies(newSelected);
    const selectedCompanyObjects = companies.filter(c => newSelected.includes(c.companyId));
    onCompanySelection(selectedCompanyObjects);
  };

  const handleEnrichSingle = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnrichSingle) {
      onEnrichSingle(company);
    }
  };

  const handleViewEnrichedProfile = (company: Company, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewEnrichedProfile) {
      onViewEnrichedProfile(company);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedCompanies.length === companies.length && companies.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commodities</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HQ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinations</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Match Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company) => (
              <tr
                key={company.companyId}
                className={`hover:bg-gray-50 transition-colors duration-150 ${
                  selectedCompanies.includes(company.companyId) ? 'bg-primary-50' : ''
                }`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company.companyId)}
                    onChange={() => handleSelectCompany(company.companyId)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-xs text-gray-500">{company.companyId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {company.commodities.map((commodity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                      >
                        <Package className="w-3 h-3 mr-1" />
                        {commodity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-900">{company.hqCountry}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700">
                    {company.originCountries.slice(0, 3).join(', ')}
                    {company.originCountries.length > 3 && ` +${company.originCountries.length - 3}`}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700">
                    {company.destinationCountries.slice(0, 3).join(', ')}
                    {company.destinationCountries.length > 3 && ` +${company.destinationCountries.length - 3}`}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {company.profileType}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{company.industry}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900">{company.matchScore}</span>
                    <Star className="w-4 h-4 ml-1 text-yellow-400 fill-current" />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {company.enriched ? (
                      <>
                        <div className="flex items-center space-x-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Enriched
                          </span>
                          {company.verifiedCount !== undefined && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" title={`Enriched on ${company.enrichedAt ? new Date(company.enrichedAt).toLocaleString() : 'Unknown'}`}>
                              {company.verifiedCount}V
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleViewEnrichedProfile(company, e)}
                          className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                        >
                          View enriched details
                        </button>
                      </>
                    ) : company.enrichmentStatus === 'fetching' || company.enrichmentStatus === 'queued' ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                        <span className="text-xs text-gray-600">Enriching...</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleEnrichSingle(company, e)}
                        className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      >
                        Enrich
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}