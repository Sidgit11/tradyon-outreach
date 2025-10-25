import React, { useState, useEffect } from 'react';
import { Send, Upload, BarChart3, UserX, Target, FileText } from 'lucide-react';
import { Contact, OutreachMessage, OutreachSequence, Campaign } from '../types';
import { mockSendOutreach, mockGetCampaigns, mockUploadCSV } from '../mockApi';
import OutreachCompose from './OutreachCompose';
import CampaignsTable from './CampaignsTable';

export default function OutreachPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'sequences' | 'templates' | 'campaigns' | 'analytics' | 'suppression'>('compose');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'campaigns') {
      loadCampaigns();
    }
  }, [activeTab]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await mockGetCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOutreach = async (
    audience: Contact[],
    message: OutreachMessage,
    sequence?: OutreachSequence
  ) => {
    setLoading(true);
    try {
      const result = await mockSendOutreach({ audience, message, sequence });
      console.log('Campaign created:', result.campaign_id);
      // Show success toast
    } catch (error) {
      console.error('Failed to send outreach:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: Send },
    { id: 'sequences', label: 'Sequences', icon: Target },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'suppression', label: 'Suppression', icon: UserX }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Outreach & Conversion</h2>
        <p className="text-gray-600">
          Evidence-backed emails with sequences, reply tracking, and pipeline management
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Tab Content */}
      {activeTab === 'compose' && (
        <OutreachCompose onSend={handleSendOutreach} loading={loading} />
      )}

      {activeTab === 'campaigns' && (
        <CampaignsTable campaigns={campaigns} loading={loading} />
      )}

      {activeTab === 'sequences' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Sequences</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Standard Follow-up</h4>
                <span className="text-sm text-gray-500">3 emails</span>
              </div>
              <div className="text-sm text-gray-600">
                Day 0: Initial outreach → Day 3: Gentle follow-up → Day 7: Final touch
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Sample Request</h4>
                <span className="text-sm text-gray-500">2 emails</span>
              </div>
              <div className="text-sm text-gray-600">
                Day 0: Sample offer → Day 5: Follow-up with spec sheet
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Intro', 'Sample', 'Price'].map(template => (
              <div key={template} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{template} Template</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Professional {template.toLowerCase()} email with evidence bullets
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Edit Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">18.2%</div>
              <div className="text-sm text-gray-600">Reply Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">8.7%</div>
              <div className="text-sm text-gray-600">Meeting Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">2.1%</div>
              <div className="text-sm text-gray-600">PO Rate</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">68</div>
              <div className="text-sm text-gray-600">Total Sent</div>
            </div>
          </div>

          {/* Template Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Performance</h3>
            <div className="space-y-3">
              {[
                { template: 'Intro', sent: 45, replies: 8, meetings: 3 },
                { template: 'Sample', sent: 23, replies: 6, meetings: 2 },
                { template: 'Price', sent: 12, replies: 2, meetings: 1 }
              ].map(stat => (
                <div key={stat.template} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{stat.template}</span>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{stat.sent} sent</span>
                    <span>{stat.replies} replies ({Math.round(stat.replies/stat.sent*100)}%)</span>
                    <span>{stat.meetings} meetings ({Math.round(stat.meetings/stat.sent*100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppression' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppression Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Upload Suppression List</h4>
                <p className="text-sm text-gray-600">CSV with email addresses to exclude from campaigns</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload CSV</span>
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Auto-Unsubscribes</h4>
                <span className="text-sm text-gray-500">12 contacts</span>
              </div>
              <p className="text-sm text-gray-600">
                Automatically respect unsubscribe requests and bounced emails
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}