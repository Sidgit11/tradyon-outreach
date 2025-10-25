import React from 'react';
import { CheckCircle, Mail, AlertCircle, Send, UserPlus, Search } from 'lucide-react';
import { EnrichmentResult } from '../types';

interface EnrichmentBucketsProps {
  results: EnrichmentResult[];
}

export default function EnrichmentBuckets({ results }: EnrichmentBucketsProps) {
  const totalVerified = results.reduce((sum, r) => sum + r.verified.length, 0);
  const totalGeneric = results.reduce((sum, r) => sum + r.generic.length, 0);
  const totalNotFound = results.reduce((sum, r) => sum + r.not_found.length, 0);
  const totalChargeable = results.reduce((sum, r) => sum + r.billing.chargeable, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Verified</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{totalVerified}</div>
          <div className="text-sm text-green-700">{totalChargeable} chargeable</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Generic/HQ</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">{totalGeneric}</div>
          <div className="text-sm text-yellow-700">Not charged</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Not Found</span>
          </div>
          <div className="text-2xl font-bold text-red-900">{totalNotFound}</div>
          <div className="text-sm text-red-700">Not charged</div>
        </div>
      </div>

      {/* Results by Company */}
      {results.map((result, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{result.company}</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {result.billing.verified_count}/{result.billing.verified_count + result.generic.length + result.not_found.length} Verified
                </span>
                <span className="text-sm font-medium text-green-600">
                  {result.billing.chargeable} charged
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Verified Contacts */}
            {result.verified.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Verified Contacts ({result.verified.length})</span>
                </h4>
                <div className="space-y-3">
                  {result.verified.map((contact, idx) => (
                    <div key={idx} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.title}</div>
                          <div className="text-sm text-gray-600">{contact.email}</div>
                          {contact.phone && (
                            <div className="text-sm text-gray-600">{contact.phone}</div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.why.map((reason, reasonIdx) => (
                              <span
                                key={reasonIdx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            <UserPlus className="w-3 h-3" />
                            <span>Add to Buyer</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            <Send className="w-3 h-3" />
                            <span>Start Outreach</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            <Search className="w-3 h-3" />
                            <span>Find More</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generic Contacts */}
            {result.generic.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-yellow-600" />
                  <span>Generic/HQ Contacts ({result.generic.length})</span>
                </h4>
                <div className="space-y-3">
                  {result.generic.map((contact, idx) => (
                    <div key={idx} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.email}</div>
                          {contact.mutual && (
                            <div className="text-sm text-blue-600 mt-1">
                              Mutual: {contact.mutual}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {contact.why.map((reason, reasonIdx) => (
                              <span
                                key={reasonIdx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          {contact.mutual ? (
                            <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                              <UserPlus className="w-3 h-3" />
                              <span>Ask for Intro</span>
                            </button>
                          ) : (
                            <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                              <Send className="w-3 h-3" />
                              <span>Generic Outreach</span>
                            </button>
                          )}
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            <Search className="w-3 h-3" />
                            <span>Queue Re-search</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Not Found */}
            {result.not_found.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Not Found ({result.not_found.length})</span>
                </h4>
                <div className="space-y-3">
                  {result.not_found.map((contact, idx) => (
                    <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-red-800">{contact.reason}</div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            <UserPlus className="w-3 h-3" />
                            <span>Ask for Intro</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                            <Search className="w-3 h-3" />
                            <span>Set Watch</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}