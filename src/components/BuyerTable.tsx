import React from 'react';
import { TrendingUp, Star, Info, Eye } from 'lucide-react';
import { BuyerRow } from '../types';

interface BuyerTableProps {
  buyers: BuyerRow[];
  onBuyerSelect: (buyer: BuyerRow) => void;
  onBuyerAction?: (buyer: BuyerRow, action: 'pin' | 'qualify' | 'enrich' | 'outreach') => void;
  loading?: boolean;
}

export default function BuyerTable({ buyers, onBuyerSelect, onBuyerAction, loading = false }: BuyerTableProps) {
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Why this lead</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Last Ship</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">90d Vol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">USD/kg</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typical Pack</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Suppliers</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
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
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">#{buyer.rank}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{buyer.buyer}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        {buyer.emerging && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Emerging
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          buyer.confidence === 'high' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {buyer.confidence}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900">{buyer.match_score}</span>
                    <Star className="w-4 h-4 ml-1 text-yellow-400 fill-current" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {buyer.why.map((reason, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {new Date(buyer.last_ship).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{buyer.vol_90d_mt} MT</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">${buyer.usd_per_kg_median.toFixed(1)}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{buyer.typical_pack}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-700">
                    {buyer.top_suppliers.slice(0, 2).join(', ')}
                    {buyer.top_suppliers.length > 2 && ` +${buyer.top_suppliers.length - 2}`}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyerAction?.(buyer, 'pin');
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors group"
                      title="Pin to Shortlist"
                    >
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyerAction?.(buyer, 'qualify');
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors group"
                      title="Send to Qualification"
                    >
                      <Info className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
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