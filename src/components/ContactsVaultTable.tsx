import React, { useState } from 'react';
import { Send, Download, Users, Filter } from 'lucide-react';
import { Contact } from '../types';

interface ContactsVaultTableProps {
  contacts: Contact[];
  loading?: boolean;
}

export default function ContactsVaultTable({ contacts, loading = false }: ContactsVaultTableProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    verification: 'all',
    billed: 'all'
  });

  const filteredContacts = contacts.filter(contact => {
    if (filters.verification !== 'all' && contact.verification !== filters.verification) {
      return false;
    }
    if (filters.billed === 'charged' && !contact.billed) {
      return false;
    }
    if (filters.billed === 'not_charged' && contact.billed) {
      return false;
    }
    return true;
  });

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'generic': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
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

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.verification}
              onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="generic">Generic</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <select
            value={filters.billed}
            onChange={(e) => setFilters(prev => ({ ...prev, billed: e.target.value }))}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Billing</option>
            <option value="charged">Charged</option>
            <option value="not_charged">Not Charged</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {selectedContacts.length > 0 && (
            <>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Send className="w-4 h-4" />
                <span>Start Outreach ({selectedContacts.length})</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-4 h-4" />
                <span>Merge/Dedupe</span>
              </button>
            </>
          )}
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contact.contact_name}</div>
                      <div className="text-sm text-gray-600">{contact.title}</div>
                      <div className="text-sm text-gray-600">{contact.email}</div>
                      {contact.phone && (
                        <div className="text-sm text-gray-600">{contact.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.company_name}</div>
                    {contact.country && (
                      <div className="text-sm text-gray-600">{contact.country}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVerificationColor(contact.verification)}`}>
                      {contact.verification}
                    </span>
                    {contact.confidence && (
                      <div className="text-xs text-gray-500 mt-1">{contact.confidence}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm ${contact.billed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      {contact.billed ? 'Charged' : 'Free'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        <Send className="w-3 h-3" />
                        <span>Outreach</span>
                      </button>
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                        <Users className="w-3 h-3" />
                        <span>Find More</span>
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