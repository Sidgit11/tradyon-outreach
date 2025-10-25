import React, { useState } from 'react';
import { Send, BarChart3, FileText, UserX, Upload, Eye } from 'lucide-react';
import { Contact, OutreachMessage, Campaign, CampaignTab, Product, CampaignDetail } from '../types';
import OutreachCompose from './OutreachCompose';
import CampaignsTable from './CampaignsTable';
import CampaignDetailsDrawer from './CampaignDetailsDrawer';

interface CampaignsPageProps {
  selectedContactForOutreach?: Contact | null;
  outreachMessageTemplate?: OutreachMessage['template'];
  activeCampaignTab: CampaignTab;
  onCampaignTabChange: (tab: CampaignTab) => void;
  campaigns: Campaign[];
  selectedCampaignDetail: CampaignDetail | null;
  onCampaignSelect: (campaignId: string) => void;
  onCloseCampaignDetail: () => void;
  products: Product[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function CampaignsPage({
  selectedContactForOutreach,
  outreachMessageTemplate,
  activeCampaignTab,
  onCampaignTabChange,
  campaigns,
  selectedCampaignDetail,
  onCampaignSelect,
  onCloseCampaignDetail,
  products,
  showToast,
}: CampaignsPageProps) {
  const tabs = [
    { id: 'viewCampaigns', label: 'View Campaigns', icon: Eye },
    { id: 'startNewCampaign', label: 'Start New Campaign', icon: Send },
  ] as const;

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaigns</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onCampaignTabChange(id as CampaignTab)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCampaignTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        {activeCampaignTab === 'viewCampaigns' && (
          <div className="p-6">
            <CampaignsTable
              campaigns={campaigns}
              onCampaignSelect={onCampaignSelect}
              showToast={showToast}
            />
          </div>
        )}

        {activeCampaignTab === 'startNewCampaign' && (
          <div className="p-6">
            <OutreachCompose
              selectedContactForOutreach={selectedContactForOutreach}
              outreachMessageTemplate={outreachMessageTemplate}
              products={products}
              showToast={showToast}
            />
          </div>
        )}

        {/* Campaign Details Drawer */}
        <CampaignDetailsDrawer
          campaignDetail={selectedCampaignDetail}
          onClose={onCloseCampaignDetail}
          showToast={showToast}
        />
      </div>
    </div>
  );
}

/** Legacy content for reference */
const LegacyCampaignsContent = ({
  showToast,
}: {
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'analytics' | 'suppression'>('templates');

  const legacyTabs = [
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'suppression', label: 'Suppression', icon: UserX },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Campaign Management</h2>
          <p className="text-gray-600 mt-1">Templates, analytics, and suppression settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {legacyTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Tab Content */}
      {activeTab === 'templates' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Intro', 'Sample', 'Price'].map((template) => (
              <div key={template} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{template} Template</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Professional {template.toLowerCase()} email with evidence bullets
                </p>
                <button
                  onClick={() => showToast('Template editing functionality coming soon!', 'info')}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
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
                { template: 'Price', sent: 12, replies: 2, meetings: 1 },
              ].map((stat) => (
                <div key={stat.template} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{stat.template}</span>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{stat.sent} sent</span>
                    <span>
                      {stat.replies} replies ({Math.round((stat.replies / stat.sent) * 100)}%)
                    </span>
                    <span>
                      {stat.meetings} meetings ({Math.round((stat.meetings / stat.sent) * 100)}%)
                    </span>
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
              <button
                onClick={() => showToast('Upload suppression list functionality coming soon!', 'info')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
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
};