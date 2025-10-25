import React from 'react';
import { Users, Send, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { QualifiedBuyer } from '../types';

interface QualificationTableProps {
  buyers: QualifiedBuyer[];
  onBuyerSelect: (buyer: QualifiedBuyer) => void;
  loading?: boolean;
}

export default function QualificationTable({ buyers, onBuyerSelect, loading = false }: QualificationTableProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready Now': return 'bg-green-100 text-green-800';
      case 'Nurture': return 'bg-yellow-100 text-yellow-800';
      case 'Dormant': return 'bg-gray-100 text-gray-800';
      case 'Investigate': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNetworkColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Last Activity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Common Partners</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Partners</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Network Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Why</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {buyers.map((buyer, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => onBuyerSelect(buyer)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{buyer.buyer}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        {buyer.certs.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {buyer.certs.join(', ')}
                          </span>
                        )}
                        {buyer.risks.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600">{buyer.risks[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(buyer.status)}`}>
                    {buyer.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{buyer.last_activity_days}d ago</span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700">
                    {buyer.common_partners.slice(0, 2).join(', ')}
                    {buyer.common_partners.length > 2 && ` +${buyer.common_partners.length - 2}`}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700">
                    {buyer.recent_partners.slice(0, 2).join(', ')}
                    {buyer.recent_partners.length > 2 && ` +${buyer.recent_partners.length - 2}`}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getNetworkColor(buyer.network_confidence)}`}>
                    {buyer.network_confidence}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {buyer.why.slice(0, 3).map((reason, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to contacts enrichment
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Users className="w-3 h-3" />
                      <span>Enrich</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to outreach
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Outreach</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to pipeline
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Pipeline</span>
                    </button>
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