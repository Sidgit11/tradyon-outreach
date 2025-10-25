import React, { useState } from 'react';
import { X, Activity, Users, Network, Shield, ExternalLink, Send, UserPlus } from 'lucide-react';
import { QualifiedBuyer } from '../types';

interface BuyerQualificationDrawerProps {
  buyer: QualifiedBuyer | null;
  onClose: () => void;
}

export default function BuyerQualificationDrawer({ buyer, onClose }: BuyerQualificationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'network' | 'risks' | 'evidence'>('activity');

  if (!buyer) return null;

  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'risks', label: 'Risks', icon: Shield },
    { id: 'evidence', label: 'Evidence', icon: ExternalLink }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready Now': return 'bg-green-100 text-green-800';
      case 'Nurture': return 'bg-yellow-100 text-yellow-800';
      case 'Dormant': return 'bg-gray-100 text-gray-800';
      case 'Investigate': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{buyer.buyer}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(buyer.status)}`}>
                {buyer.status}
              </span>
              <span className="text-sm text-gray-500">
                Network: <span className="font-medium">{buyer.network_confidence}</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Trade Activity</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Last shipment: {buyer.last_activity_days}d ago</div>
                    <div className="text-xs text-gray-600 mt-1">90d volume: {buyer.shipments_90d} shipments</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">R/F/V Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Recency</span>
                    <span className="font-medium">{buyer.last_activity_days}d</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frequency</span>
                    <span className="font-medium">{buyer.shipments_90d}/90d</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Volume</span>
                    <span className="font-medium">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Common Partners</h3>
                <div className="space-y-2">
                  {buyer.common_partners.map((partner, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{partner}</div>
                      <div className="text-xs text-gray-600 mt-1">Trust overlap</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Partners</h3>
                <div className="space-y-2">
                  {buyer.recent_partners.map((partner, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{partner}</div>
                      <div className="text-xs text-blue-600 mt-1">Active relationship</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Network Graph</h3>
                <div className="p-8 bg-gray-50 rounded-lg text-center">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">2nd/3rd order network visualization</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Risk Factors</h3>
                {buyer.risks.length > 0 ? (
                  <div className="space-y-2">
                    {buyer.risks.map((risk, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm text-red-800">{risk}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">No risk factors identified</div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Certifications</h3>
                {buyer.certs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {buyer.certs.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No certifications on file</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Evidence & Sources</h3>
              <div className="space-y-3">
                {buyer.why.map((evidence, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-900">{evidence}</span>
                      <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Enrich Contacts</span>
          </button>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Send className="w-4 h-4" />
              <span>First-Action Pack</span>
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Add to Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}