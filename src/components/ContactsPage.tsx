import React, { useState, useEffect } from 'react';
import { Users, Settings, Play, Upload, Filter, Edit3, CheckSquare, Square } from 'lucide-react';
import { Contact, ContactEnrichmentSettings, EnrichmentResult, EnrichmentCandidate, NavigationScreen, OutreachMessage } from '../types';
import { mockEnrichContacts, mockGetContactsVault } from '../mockApi';
import EnrichmentBuckets from './EnrichmentBuckets';
import ContactsVaultTable from './ContactsVaultTable';

interface ContactsPageProps {
  enrichmentCandidates: EnrichmentCandidate[];
  selectedEnrichmentCandidates: string[];
  onSelectedCandidatesChange: (selected: string[]) => void;
  enrichmentSettings: ContactEnrichmentSettings;
  onEnrichmentSettingsChange: (settings: ContactEnrichmentSettings) => void;
  selectedBuyerForEnrichment: string | null;
  onScreenChange: (screen: NavigationScreen, options?: { contact?: Contact; template?: OutreachMessage['template'] }) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function ContactsPage({
  enrichmentCandidates,
  selectedEnrichmentCandidates,
  onSelectedCandidatesChange,
  enrichmentSettings,
  onEnrichmentSettingsChange,
  selectedBuyerForEnrichment,
  onScreenChange,
  showToast
}: ContactsPageProps) {
  const [activeTab, setActiveTab] = useState<'enrich' | 'vault'>('enrich');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettingsEdit, setShowSettingsEdit] = useState(false);

  useEffect(() => {
    if (activeTab === 'vault') {
      loadContactsVault();
    }
  }, [activeTab]);

  useEffect(() => {
    // Pre-select buyer if navigating from qualification
    if (selectedBuyerForEnrichment && !selectedEnrichmentCandidates.includes(selectedBuyerForEnrichment)) {
      const candidate = enrichmentCandidates.find(c => c.companyName === selectedBuyerForEnrichment);
      if (candidate) {
        onSelectedCandidatesChange([candidate.id]);
      }
    }
  }, [selectedBuyerForEnrichment, enrichmentCandidates]);

  const loadContactsVault = async () => {
    setLoading(true);
    try {
      const data = await mockGetContactsVault();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts vault:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrichContacts = async () => {
    if (selectedEnrichmentCandidates.length === 0) {
      showToast('Please select at least one company to enrich', 'warning');
      return;
    }

    setLoading(true);
    try {
      const selectedCompanies = enrichmentCandidates
        .filter(c => selectedEnrichmentCandidates.includes(c.id))
        .map(c => c.companyName.toLowerCase().replace(/\s+/g, ''));
      const results = await mockEnrichContacts(selectedCompanies, enrichmentSettings);
      setEnrichmentResults(results);
      showToast(`Enrichment completed for ${selectedCompanies.length} companies`, 'success');
    } catch (error) {
      console.error('Failed to enrich contacts:', error);
      showToast('Failed to enrich contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateToggle = (candidateId: string) => {
    if (selectedEnrichmentCandidates.includes(candidateId)) {
      onSelectedCandidatesChange(selectedEnrichmentCandidates.filter(id => id !== candidateId));
    } else {
      onSelectedCandidatesChange([...selectedEnrichmentCandidates, candidateId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEnrichmentCandidates.length === enrichmentCandidates.length) {
      onSelectedCandidatesChange([]);
    } else {
      onSelectedCandidatesChange(enrichmentCandidates.map(c => c.id));
    }
  };

  const tabs = [
    { id: 'enrich', label: 'Enrich Contacts', icon: Users },
    { id: 'vault', label: 'Contacts Vault', icon: Filter }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Enrichment</h2>
        <p className="text-gray-600">
          Find verified person-level contacts with transparent billing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'enrich' && (
        <div className="space-y-6">
          {/* Enrichment Candidates Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Companies to Enrich</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  {selectedEnrichmentCandidates.length === enrichmentCandidates.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-500">
                  ({selectedEnrichmentCandidates.length} of {enrichmentCandidates.length} selected)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {enrichmentCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedEnrichmentCandidates.includes(candidate.id)
                      ? 'border-primary-200 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleCandidateToggle(candidate.id)}
                >
                  <div className="flex items-center space-x-3">
                    {selectedEnrichmentCandidates.includes(candidate.id) ? (
                      <CheckSquare className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{candidate.companyName}</div>
                      <div className="text-sm text-gray-600">{candidate.country} • Last activity: {candidate.lastActivity}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    ~{candidate.estimatedContacts} contacts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-800">
                Charged only for Verified person-level contacts
              </span>
            </div>
          </div>

          {/* Defaults Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enrichment Settings</h3>
               <div className="flex items-center space-x-2">
                 <p className="text-sm text-gray-600">
                   {enrichmentSettings.max_per_company} contacts/company, {enrichmentSettings.target_roles.join(' + ')} roles, {enrichmentSettings.verification_mode} verification
                 </p>
                 <button
                   onClick={() => setShowSettingsEdit(!showSettingsEdit)}
                   className="p-1 hover:bg-gray-100 rounded transition-colors"
                 >
                   <Edit3 className="w-4 h-4 text-gray-400" />
                 </button>
               </div>
              </div>
              <button
                onClick={handleEnrichContacts}
               disabled={loading || selectedEnrichmentCandidates.length === 0}
               className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
              >
                <Play className="w-4 h-4" />
               <span>{loading ? 'Enriching...' : `Enrich Selected (${selectedEnrichmentCandidates.length})`}</span>
              </button>
            </div>

           {showSettingsEdit && (
             <div className="border-t border-gray-200 pt-4 space-y-4">
               <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max contacts per company
                </label>
                <select
                 value={enrichmentSettings.max_per_company}
                 onChange={(e) => onEnrichmentSettingsChange({ ...enrichmentSettings, max_per_company: parseInt(e.target.value) })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={2}>2 contacts</option>
                  <option value={3}>3 contacts</option>
                  <option value={5}>5 contacts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Procurement', 'QA', 'Operations', 'CEO'].map(role => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={enrichmentSettings.target_roles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onEnrichmentSettingsChange({ ...enrichmentSettings, target_roles: [...enrichmentSettings.target_roles, role] });
                          } else {
                            onEnrichmentSettingsChange({ ...enrichmentSettings, target_roles: enrichmentSettings.target_roles.filter(r => r !== role) });
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification mode
                </label>
                <select
                  value={enrichmentSettings.verification_mode}
                  onChange={(e) => onEnrichmentSettingsChange({ ...enrichmentSettings, verification_mode: e.target.value as 'strict' | 'relaxed' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="strict">Strict (person-level email/phone)</option>
                  <option value="relaxed">Relaxed (includes generic)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Email', 'LinkedIn', 'Phone'].map(channel => (
                    <label key={channel} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={enrichmentSettings.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onEnrichmentSettingsChange({ ...enrichmentSettings, channels: [...enrichmentSettings.channels, channel] });
                          } else {
                            onEnrichmentSettingsChange({ ...enrichmentSettings, channels: enrichmentSettings.channels.filter(c => c !== channel) });
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
               </div>
               
               <div className="flex justify-end space-x-3">
                 <button
                   onClick={() => setShowSettingsEdit(false)}
                   className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     setShowSettingsEdit(false);
                     showToast('Settings updated successfully!', 'success');
                   }}
                   className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                 >
                   Save Settings
                 </button>
               </div>
             </div>
           )}
          </div>

          {/* Results */}
          {enrichmentResults.length > 0 && (
            <EnrichmentBuckets 
              results={enrichmentResults} 
              onScreenChange={onScreenChange}
              showToast={showToast}
            />
          )}
        </div>
      )}

      {activeTab === 'vault' && (
        <ContactsVaultTable 
          contacts={contacts} 
          loading={loading} 
          onScreenChange={onScreenChange}
          showToast={showToast}
        />
      )}
    </div>
  );
}