import React from 'react';
import { Settings, User, Bell, CreditCard, Shield, HelpCircle, Users, DollarSign, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { EnrichmentRulesSettings, CreditBalance } from '../types';

interface SettingsPageProps {
  enrichmentRulesSettings: EnrichmentRulesSettings;
  onEnrichmentRulesChange: (settings: EnrichmentRulesSettings) => void;
  creditBalance: CreditBalance;
  creditSplitEnabled: boolean;
  onCreditSplitToggle: (enabled: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function SettingsPage({ 
  enrichmentRulesSettings, 
  onEnrichmentRulesChange, 
  creditBalance, 
  creditSplitEnabled, 
  onCreditSplitToggle, 
  showToast 
}: SettingsPageProps) {
  const [editingEnrichmentRules, setEditingEnrichmentRules] = React.useState(false);
  const [enrichmentForm, setEnrichmentForm] = React.useState<EnrichmentRulesSettings>(enrichmentRulesSettings);

  React.useEffect(() => {
    setEnrichmentForm(enrichmentRulesSettings);
  }, [enrichmentRulesSettings]);

  const handleSaveEnrichmentRules = () => {
    onEnrichmentRulesChange(enrichmentForm);
    setEditingEnrichmentRules(false);
    showToast('Enrichment rules updated successfully!', 'success');
  };

  const handleEnrichmentFormChange = (field: keyof EnrichmentRulesSettings, value: any) => {
    setEnrichmentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    const newRoles = enrichmentForm.target_roles.includes(role)
      ? enrichmentForm.target_roles.filter(r => r !== role)
      : [...enrichmentForm.target_roles, role];
    handleEnrichmentFormChange('target_roles', newRoles);
  };

  const handleChannelToggle = (channel: string) => {
    const newChannels = enrichmentForm.channels.includes(channel)
      ? enrichmentForm.channels.filter(c => c !== channel)
      : [...enrichmentForm.channels, channel];
    handleEnrichmentFormChange('channels', newChannels);
  };

  const handleFieldToggle = (field: string) => {
    const newFields = enrichmentForm.fields_to_enrich.includes(field)
      ? enrichmentForm.fields_to_enrich.filter(f => f !== field)
      : [...enrichmentForm.fields_to_enrich, field];
    handleEnrichmentFormChange('fields_to_enrich', newFields);
  };

  const settingSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', description: 'Update your personal details and company info' },
        { label: 'Password & Security', description: 'Change password and security settings' },
        { label: 'API Keys', description: 'Manage your API access keys' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Preferences', description: 'Configure email notifications and alerts' },
        { label: 'Campaign Updates', description: 'Get notified about campaign performance' },
        { label: 'New Leads Alerts', description: 'Receive alerts for hot leads and opportunities' }
      ]
    },
    {
      title: 'Privacy & Data',
      icon: Shield,
      items: [
        { label: 'Data Export', description: 'Export your data and enriched profiles' },
        { label: 'Privacy Settings', description: 'Control data sharing and privacy options' },
        { label: 'GDPR Compliance', description: 'Manage GDPR and data protection settings' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account, preferences, and integrations
          </p>
        </div>
      </div>

      {/* Enrichment Rules Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Enrichment Rules</h2>
              <p className="text-sm text-gray-600">Configure default settings for contact enrichment</p>
            </div>
          </div>
          <button
            onClick={() => setEditingEnrichmentRules(!editingEnrichmentRules)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{editingEnrichmentRules ? 'Cancel' : 'Edit Rules'}</span>
          </button>
        </div>

        {editingEnrichmentRules ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max contacts per company
                </label>
                <select
                  value={enrichmentForm.max_per_company}
                  onChange={(e) => handleEnrichmentFormChange('max_per_company', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={1}>1 contact</option>
                  <option value={2}>2 contacts</option>
                  <option value={3}>3 contacts</option>
                  <option value={5}>5 contacts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification mode
                </label>
                <select
                  value={enrichmentForm.verification_mode}
                  onChange={(e) => handleEnrichmentFormChange('verification_mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="strict">Strict (person-level email/phone)</option>
                  <option value="relaxed">Relaxed (includes generic)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geography
                </label>
                <select
                  value={enrichmentForm.geography}
                  onChange={(e) => handleEnrichmentFormChange('geography', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="global">Global</option>
                  <option value="local">Local region only</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="americas">Americas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target roles
              </label>
              <div className="flex flex-wrap gap-2">
                {['Procurement', 'QA', 'Operations', 'CEO', 'Sales', 'Marketing'].map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleToggle(role)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      enrichmentForm.target_roles.includes(role)
                        ? 'bg-primary-100 text-primary-800 border border-primary-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Channels
              </label>
              <div className="flex flex-wrap gap-2">
                {['Email', 'LinkedIn', 'Phone', 'WhatsApp'].map(channel => (
                  <button
                    key={channel}
                    onClick={() => handleChannelToggle(channel)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      enrichmentForm.channels.includes(channel)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fields to enrich
              </label>
              <div className="flex flex-wrap gap-2">
                {['contact_info', 'company_profile', 'trade_history', 'certifications', 'financial_data'].map(field => (
                  <button
                    key={field}
                    onClick={() => handleFieldToggle(field)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      enrichmentForm.fields_to_enrich.includes(field)
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {field.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setEditingEnrichmentRules(false);
                  setEnrichmentForm(enrichmentRulesSettings);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEnrichmentRules}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Rules</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Max contacts per company:</span>
                <span className="text-sm text-gray-900 ml-2">{enrichmentRulesSettings.max_per_company}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Verification mode:</span>
                <span className="text-sm text-gray-900 ml-2">{enrichmentRulesSettings.verification_mode}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Geography:</span>
                <span className="text-sm text-gray-900 ml-2">{enrichmentRulesSettings.geography}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Target roles:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {enrichmentRulesSettings.target_roles.map(role => (
                    <span key={role} className="px-2 py-0.5 bg-primary-100 text-primary-800 rounded text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {enrichmentRulesSettings.channels.map(channel => (
                    <span key={channel} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fields to enrich:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {enrichmentRulesSettings.fields_to_enrich.map(field => (
                    <span key={field} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                      {field.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Credits and Billing Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Credits and Billing</h2>
            <p className="text-sm text-gray-600">Monitor your credit usage and billing</p>
          </div>
        </div>

        {/* Credit Split Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Credit Split View</h3>
            <p className="text-sm text-gray-600">Show separate balances for contact and profile credits</p>
          </div>
          <button
            onClick={() => onCreditSplitToggle(!creditSplitEnabled)}
            className="flex items-center"
          >
            {creditSplitEnabled ? (
              <ToggleRight className="w-8 h-8 text-primary-600" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-400" />
            )}
          </button>
        </div>

        {/* Credit Balance Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {creditSplitEnabled ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Contact Credits</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{creditBalance.contactCredits || 0}</div>
                <div className="text-sm text-blue-700">For verified person-level contacts</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Profile Credits</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{creditBalance.profileCredits || 0}</div>
                <div className="text-sm text-purple-700">For company profile enrichment</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Total Credits</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{creditBalance.totalCredits}</div>
                <div className="text-sm text-gray-700">Combined balance</div>
              </div>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Total Credits</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{creditBalance.totalCredits}</div>
              <div className="text-sm text-green-700">Available for enrichment</div>
            </div>
          )}
        </div>

        {/* Charging Rules */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Charging Rules</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Contact Credits:</strong> Only consumed for verified person-level contacts with email/phone</li>
            <li>• <strong>Generic/HQ contacts:</strong> Not charged (info@company.com, sales@company.com)</li>
            <li>• <strong>Phone-only partials:</strong> Not charged until person email is verified</li>
            <li>• <strong>Profile Credits:</strong> Consumed when non-contact company data is successfully fetched</li>
            <li>• <strong>Not found results:</strong> Never charged</li>
          </ul>
        </div>

        {/* Recent Billing Events */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Billing Events</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {creditBalance.billedEvents.slice(0, 10).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{event.description}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                    {event.companyName && ` • ${event.companyName}`}
                    {event.contactName && ` • ${event.contactName}`}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.type === 'contact' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-sm font-medium text-gray-900">-{event.amount}</span>
                </div>
              </div>
            ))}
          </div>
          
          {creditBalance.billedEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No billing events yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <section.icon className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => showToast(`${item.label} settings coming soon!`, 'info')}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Help & Support</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => showToast('Documentation coming soon!', 'info')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900 mb-2">Documentation</h3>
            <p className="text-sm text-gray-600">Learn how to use Tradyon effectively</p>
          </button>
          
          <button
            onClick={() => showToast('Support chat coming soon!', 'info')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">Get help from our support team</p>
          </button>
          
          <button
            onClick={() => showToast('Feature requests coming soon!', 'info')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h3 className="font-medium text-gray-900 mb-2">Feature Requests</h3>
            <p className="text-sm text-gray-600">Suggest new features and improvements</p>
          </button>
        </div>
      </div>
    </div>
  );
}