import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, Award, TrendingUp, Clock, Package, ExternalLink } from 'lucide-react';
import { BuyerRow, BuyerDetail, NavigationScreen, Contact, OutreachMessage } from '../types';
import { mockGetBuyerDetail } from '../mockApi';

interface BuyerDetailDrawerProps {
  buyer: BuyerRow | null;
  onClose: () => void;
  onPinToShortlist: (buyerName: string, matchScore: number) => void;
  onScreenChange: (screen: NavigationScreen, options?: { buyerId?: string; contact?: Contact; template?: OutreachMessage['template'] }) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function BuyerDetailDrawer({ buyer, onClose, onPinToShortlist, onScreenChange, showToast }: BuyerDetailDrawerProps) {
  const [buyerDetail, setBuyerDetail] = useState<BuyerDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'products' | 'lanes' | 'suppliers' | 'evidence'>('timeline');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (buyer) {
      setLoading(true);
      mockGetBuyerDetail(buyer.buyer).then(detail => {
        setBuyerDetail(detail);
        setLoading(false);
      });
    }
  }, [buyer]);

  const handlePinToShortlist = () => {
    if (buyer) {
      onPinToShortlist(buyer.buyer, buyer.match_score);
      onClose();
    }
  };

  const handleSendToQualification = () => {
    if (buyer) {
      onScreenChange('qualify', { buyerId: buyer.buyer });
      onClose();
    }
  };

  const handleAddNote = () => {
    showToast('Add Note functionality coming soon!', 'info');
  };

  if (!buyer) return null;

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'lanes', label: 'Lanes', icon: MapPin },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'evidence', label: 'Evidence', icon: ExternalLink }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{buyer.buyer}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Match Score:</span>
              <span className="text-sm font-medium text-gray-900">{buyer.match_score}/100</span>
              {buyer.emerging && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Emerging
                </span>
              )}
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
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          ) : (
            <>
              {activeTab === 'timeline' && buyerDetail && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">24-Month Timeline</h3>
                  <div className="space-y-2">
                    {buyerDetail.timeline.map(([month, volume]) => (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(volume / 20 * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{volume} MT</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'products' && buyerDetail && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Product Mix</h3>
                  <div className="space-y-2">
                    {buyerDetail.product_mix.map(({ grade, share }) => (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{grade}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(share * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'lanes' && buyerDetail && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Trade Lanes</h3>
                  <div className="space-y-3">
                    {buyerDetail.lanes.map((lane, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {lane.from} → {lane.to}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{lane.mt} MT</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'suppliers' && buyerDetail && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Supplier History</h3>
                  <div className="space-y-3">
                    {buyerDetail.suppliers.map((supplier, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{supplier.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            supplier.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {supplier.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">Since {supplier.since}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'evidence' && buyerDetail && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Evidence & Sources</h3>
                  <div className="space-y-3">
                    {buyerDetail.evidence.map((evidence, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <span className="text-sm text-gray-900">{evidence.fact}</span>
                          <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {buyerDetail?.certs && buyerDetail.certs.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {buyerDetail.certs.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            onClick={handlePinToShortlist}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddNote}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Note
            </button>
            <button 
              onClick={handleSendToQualification}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Send to Qualification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}