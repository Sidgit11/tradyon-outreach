import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Users,
  Send,
  TrendingUp,
  MapPin,
  DollarSign,
  Award,
  AlertTriangle,
  Building2,
  Globe,
  Info,
  Mail,
  Phone,
  Copy,
  UserPlus,
  Loader
} from 'lucide-react';
import { Company, EnrichmentResult } from '../types';

interface EnrichedProfileDrawerProps {
  company: Company | null;
  enrichmentData: EnrichmentResult | null;
  loading: boolean;
  onClose: () => void;
  onBookmark: (companyId: string) => void;
  onAddToSegment: (companyId: string) => void;
  onStartCampaign: (companyId: string) => void;
  onFindMoreContacts: (companyId: string) => void;
  onStartOutreach: (email: string, name: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function EnrichedProfileDrawer({
  company,
  enrichmentData,
  loading,
  onClose,
  onBookmark,
  onAddToSegment,
  onStartCampaign,
  onFindMoreContacts,
  onStartOutreach,
  showToast
}: EnrichedProfileDrawerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['contacts']));
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  if (!company) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  const renderSectionHeader = (id: string, title: string, icon: React.ReactNode) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {expandedSections.has(id) ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                  <span className="text-2xl">{company.hqCountry === 'DE' ? '🇩🇪' : company.hqCountry === 'ES' ? '🇪🇸' : company.hqCountry === 'SE' ? '🇸🇪' : company.hqCountry === 'US' ? '🇺🇸' : '🌍'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{company.profileType}</span>
                  <span>•</span>
                  <span>{company.industry}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {enrichmentData && !loading && (
              <>
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    company.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                    company.matchScore >= 80 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Match {company.matchScore}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    enrichmentData.verificationLevel === 'high' ? 'bg-green-100 text-green-800' :
                    enrichmentData.verificationLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Verification {enrichmentData.verificationLevel}
                  </span>
                  {enrichmentData.risks && enrichmentData.risks.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Risk
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => onBookmark(company.companyId)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Bookmark</span>
                  </button>
                  <button
                    onClick={() => onAddToSegment(company.companyId)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span>Add to segment</span>
                  </button>
                  <button
                    onClick={() => onStartCampaign(company.companyId)}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Start campaign</span>
                  </button>
                </div>

                <div className="text-xs text-gray-600 flex items-center space-x-1">
                  <span>Enriched on {new Date(enrichmentData.enrichedAt).toLocaleDateString()} • {new Date(enrichmentData.enrichedAt).toLocaleTimeString()}</span>
                  <span>•</span>
                  <span>Contacts: {enrichmentData.verified.length}V / {enrichmentData.generic.length}G / {enrichmentData.not_found.length}NF</span>
                  <span>•</span>
                  <span className="font-medium">Billing: {enrichmentData.billing.chargeable} charged</span>
                </div>
              </>
            )}
          </div>

          {/* Summary Band */}
          {enrichmentData && !loading && (
            <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs mb-1">Contacts</div>
                  <div className="font-medium text-gray-900">
                    {enrichmentData.verified.length} Verified / {enrichmentData.generic.length} Generic / {enrichmentData.not_found.length} Not found
                  </div>
                </div>
                {enrichmentData.shipmentHistory && (
                  <div>
                    <div className="text-gray-500 text-xs mb-1">R/F/V</div>
                    <div className="font-medium text-gray-900">
                      Last: {new Date(enrichmentData.shipmentHistory.rfv.lastShip).toLocaleDateString()} •
                      90d: {enrichmentData.shipmentHistory.rfv.shipments90d} / {enrichmentData.shipmentHistory.rfv.vol90dMt}MT
                    </div>
                  </div>
                )}
                {enrichmentData.lanes && enrichmentData.lanes.length > 0 && (
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Top Lanes</div>
                    <div className="font-medium text-gray-900">
                      {enrichmentData.lanes.slice(0, 2).map(lane => `${lane.from} → ${lane.to}`).join(', ')}
                    </div>
                  </div>
                )}
              </div>
              {enrichmentData.evidence && enrichmentData.evidence.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {enrichmentData.evidence.slice(0, 3).map((ev, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      {ev.fact}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6">
              <div className="flex items-center justify-center space-x-3 py-12">
                <Loader className="w-6 h-6 text-primary-600 animate-spin" />
                <span className="text-sm text-gray-600">Enrichment in progress...</span>
              </div>
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : enrichmentData ? (
            <div className="divide-y divide-gray-200">
              {/* Contacts Section */}
              <div>
                {renderSectionHeader('contacts', 'Contacts', <Users className="w-4 h-4 text-gray-500" />)}
                {expandedSections.has('contacts') && (
                  <div className="p-6 space-y-6">
                    {/* Verified Contacts */}
                    {enrichmentData.verified.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Verified ({enrichmentData.verified.length})
                          </h4>
                          <span className="text-xs text-green-600 font-medium">Chargeable</span>
                        </div>
                        <div className="space-y-3">
                          {enrichmentData.verified.map((contact, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="font-semibold text-gray-900">{contact.name}</h5>
                                  <p className="text-sm text-gray-600">{contact.title}</p>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  contact.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                  contact.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {contact.confidence}
                                </span>
                              </div>
                              <div className="space-y-1 mb-3">
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span>{contact.email}</span>
                                  <button onClick={() => copyToClipboard(contact.email)} className="p-1 hover:bg-gray-100 rounded">
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                                {contact.phone && (
                                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{contact.phone}</span>
                                    <button onClick={() => copyToClipboard(contact.phone)} className="p-1 hover:bg-gray-100 rounded">
                                      <Copy className="w-3 h-3 text-gray-400" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {contact.why.map((reason, ridx) => (
                                  <span key={ridx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                    {reason}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => onStartOutreach(contact.email, contact.name)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                                >
                                  Start outreach
                                </button>
                                <button
                                  onClick={() => copyToClipboard(contact.email)}
                                  className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                >
                                  Copy email
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generic Contacts */}
                    {enrichmentData.generic.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Generic or HQ ({enrichmentData.generic.length})
                          </h4>
                          <span className="text-xs text-gray-500 font-medium">Not charged</span>
                        </div>
                        <div className="space-y-3">
                          {enrichmentData.generic.map((contact, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="mb-2">
                                <h5 className="font-semibold text-gray-900">{contact.name}</h5>
                                <p className="text-sm text-gray-600">{contact.email}</p>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {contact.why.map((reason, ridx) => (
                                  <span key={ridx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                                    {reason}
                                  </span>
                                ))}
                              </div>
                              {contact.mutual && (
                                <p className="text-xs text-blue-600 mt-2">
                                  Try a mutual introduction via {contact.mutual}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Not Found */}
                    {enrichmentData.not_found.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                          Not found ({enrichmentData.not_found.length})
                        </h4>
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <p className="text-sm text-gray-600 mb-3">{enrichmentData.not_found[0].reason}</p>
                          <div className="flex flex-col space-y-2">
                            <button className="text-xs text-primary-600 hover:text-primary-700 text-left">
                              Ask for Intro (if mutual partner)
                            </button>
                            <button className="text-xs text-primary-600 hover:text-primary-700 text-left">
                              LinkedIn InMail
                            </button>
                            <button className="text-xs text-primary-600 hover:text-primary-700 text-left">
                              Set Watch (notify when person appears)
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Find More Contacts */}
                    <button
                      onClick={() => onFindMoreContacts(company.companyId)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">Find more</span>
                    </button>

                    {/* How Credits Work */}
                    <button
                      onClick={() => setShowCreditsModal(true)}
                      className="flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700"
                    >
                      <Info className="w-3 h-3" />
                      <span>How credits work</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Shipment History */}
              {enrichmentData.shipmentHistory && (
                <div>
                  {renderSectionHeader('shipments', 'Shipment History', <TrendingUp className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('shipments') && (
                    <div className="p-6">
                      <div className="space-y-2">
                        {enrichmentData.shipmentHistory.timeline.map(([month, count]) => (
                          <div key={month} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{month}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trade Partners */}
              {enrichmentData.tradePartners && (
                <div>
                  {renderSectionHeader('partners', 'Trade Partners', <Users className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('partners') && (
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Top Suppliers</h4>
                        <div className="flex flex-wrap gap-2">
                          {enrichmentData.tradePartners.suppliers.map((supplier, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
                              {supplier}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Top Forwarders</h4>
                        <div className="flex flex-wrap gap-2">
                          {enrichmentData.tradePartners.forwarders.map((forwarder, idx) => (
                            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                              {forwarder}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Lanes */}
              {enrichmentData.lanes && enrichmentData.lanes.length > 0 && (
                <div>
                  {renderSectionHeader('lanes', 'Lanes', <MapPin className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('lanes') && (
                    <div className="p-6">
                      <div className="space-y-3">
                        {enrichmentData.lanes.map((lane, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {lane.from} → {lane.to}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">{lane.mt} MT</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Key People */}
              {enrichmentData.keyPeople && enrichmentData.keyPeople.length > 0 && (
                <div>
                  {renderSectionHeader('people', 'Key People', <Users className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('people') && (
                    <div className="p-6">
                      <div className="space-y-3">
                        {enrichmentData.keyPeople.map((person, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-900">{person.name}</h5>
                              <p className="text-sm text-gray-600">{person.title}</p>
                              {person.lastSeen && (
                                <p className="text-xs text-gray-500 mt-1">Last seen: {new Date(person.lastSeen).toLocaleDateString()}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                person.confidence === 'high' ? 'bg-green-100 text-green-800' :
                                person.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {person.confidence}
                              </span>
                              {person.linkedin && (
                                <a href={`https://${person.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price Trends */}
              {enrichmentData.priceTrends && enrichmentData.priceTrends.length > 0 && (
                <div>
                  {renderSectionHeader('pricing', 'Price Trends', <DollarSign className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('pricing') && (
                    <div className="p-6">
                      <div className="space-y-2">
                        {enrichmentData.priceTrends.map((trend, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{trend.period}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">${trend.avgPrice.toFixed(2)}/kg</span>
                              {trend.delta && (
                                <span className={`text-xs ${trend.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {trend.delta > 0 ? '+' : ''}{trend.delta.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certificates & Risks */}
              {((enrichmentData.certificates && enrichmentData.certificates.length > 0) ||
                (enrichmentData.risks && enrichmentData.risks.length > 0)) && (
                <div>
                  {renderSectionHeader('certs', 'Certificates & Risks', <Award className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('certs') && (
                    <div className="p-6 space-y-4">
                      {enrichmentData.certificates && enrichmentData.certificates.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Certificates</h4>
                          <div className="flex flex-wrap gap-2">
                            {enrichmentData.certificates.map((cert, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
                                <Award className="w-3 h-3 mr-1" />
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {enrichmentData.risks && enrichmentData.risks.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Risk Flags</h4>
                          <div className="space-y-2">
                            {enrichmentData.risks.map((risk, idx) => (
                              <div key={idx} className={`p-3 rounded-lg border ${
                                risk.severity === 'high' ? 'bg-red-50 border-red-200' :
                                risk.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                'bg-gray-50 border-gray-200'
                              }`}>
                                <div className="flex items-start space-x-2">
                                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                                    risk.severity === 'high' ? 'text-red-600' :
                                    risk.severity === 'medium' ? 'text-yellow-600' :
                                    'text-gray-600'
                                  }`} />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{risk.type}</p>
                                    <p className="text-xs text-gray-600 mt-1">{risk.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {enrichmentData.risks.some(r => r.type === 'sanctions' || r.type === 'pep') && (
                            <p className="text-xs text-gray-600 mt-2 italic">
                              Disclaimer: Verify independently before proceeding with business.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Company Metadata */}
              {enrichmentData.companyMeta && (
                <div>
                  {renderSectionHeader('metadata', 'Company Metadata', <Building2 className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('metadata') && (
                    <div className="p-6 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Domain</label>
                        <p className="text-sm text-gray-900">{enrichmentData.companyMeta.domain}</p>
                      </div>
                      {enrichmentData.companyMeta.website && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Website</label>
                          <a href={enrichmentData.companyMeta.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                            <span>{enrichmentData.companyMeta.website}</span>
                            <Globe className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {enrichmentData.companyMeta.socials && enrichmentData.companyMeta.socials.length > 0 && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Social Media</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {enrichmentData.companyMeta.socials.map((social, idx) => (
                              <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700">
                                {social.platform}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {enrichmentData.companyMeta.aliases && enrichmentData.companyMeta.aliases.length > 0 && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase">Aliases</label>
                          <p className="text-sm text-gray-900">{enrichmentData.companyMeta.aliases.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Evidence */}
              {enrichmentData.evidence && enrichmentData.evidence.length > 0 && (
                <div>
                  {renderSectionHeader('evidence', 'Evidence', <Info className="w-4 h-4 text-gray-500" />)}
                  {expandedSections.has('evidence') && (
                    <div className="p-6">
                      <div className="space-y-2">
                        {enrichmentData.evidence.map((ev, idx) => (
                          <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className="flex items-start justify-between">
                              <p className="text-sm text-gray-900 flex-1">{ev.fact}</p>
                              <div className="flex items-center space-x-2 ml-3">
                                <span className="text-xs text-gray-500">{ev.source}</span>
                                <span className="text-xs text-gray-400">{new Date(ev.ts).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {ev.confidence && (
                              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full"
                                      style={{ width: `${ev.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600">{ev.confidence}% confidence</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center py-12">
              <p className="text-gray-600">No enrichment data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {enrichmentData && !loading && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onAddToSegment(company.companyId)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Add to Segment
              </button>
              <button
                onClick={() => onStartCampaign(company.companyId)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Start campaign
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">How credits work</h3>
              <button onClick={() => setShowCreditsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• You are charged only for verified person emails or direct phones.</p>
              <p>• Generic or HQ emails are not charged.</p>
              <p>• Phone-only is not charged until a person email is verified.</p>
              <p className="pt-3 border-t border-gray-200 text-xs text-gray-600 italic">
                Open question: split credits into Contact vs Profile enrichment for shipments/lanes/partners/pricing?
              </p>
            </div>
            <button
              onClick={() => setShowCreditsModal(false)}
              className="mt-6 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
