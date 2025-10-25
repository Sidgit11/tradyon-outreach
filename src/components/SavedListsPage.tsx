import React from 'react';
import { Calendar, RefreshCw, Star, Eye, Edit3, Trash2, Clock, TrendingUp } from 'lucide-react';
import { SmartList, ShortlistEntry } from '../types';

interface SavedListsPageProps {
  savedLists: SmartList[];
  shortlist: ShortlistEntry[];
  onViewResults: (list: SmartList) => void;
  onEditList: (list: SmartList) => void;
  onDeleteList: (listId: string) => void;
  onViewBuyer: (entry: ShortlistEntry) => void;
  onRemoveFromShortlist: (entryId: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export default function SavedListsPage({
  savedLists,
  shortlist,
  onViewResults,
  onEditList,
  onDeleteList,
  onViewBuyer,
  onRemoveFromShortlist,
  showToast
}: SavedListsPageProps) {
  const getRefreshStatusColor = (status: string) => {
    switch (status) {
      case 'up-to-date': return 'text-green-600';
      case 'refresh-due': return 'text-yellow-600';
      case 'refreshing': return 'text-primary-600';
      default: return 'text-gray-600';
    }
  };

  const getRefreshStatusText = (list: SmartList) => {
    if (list.newLeadsCount > 0) {
      return `${list.newLeadsCount} new leads found`;
    }
    if (list.refreshStatus === 'refresh-due') {
      const daysUntil = Math.ceil((new Date(list.nextRefresh).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil > 0 ? `Refresh due in ${daysUntil} days` : 'Refresh overdue';
    }
    return 'Up to date';
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Lists</h2>
        <p className="text-gray-600">
          Manage your smart lists and pinned buyers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Lists Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Smart Lists ({savedLists.length})</h3>
            <button
              onClick={() => showToast('Create new list functionality coming soon!', 'info')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create New List
            </button>
          </div>

          <div className="space-y-3">
            {savedLists.map((list) => (
              <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{list.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{list.query}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created {list.createdAt}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <RefreshCw className="w-3 h-3" />
                        <span>{list.refreshFrequency}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewResults(list)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View Results"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onEditList(list)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit List"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onDeleteList(list.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Delete List"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-1 text-sm ${getRefreshStatusColor(list.refreshStatus)}`}>
                    {list.refreshStatus === 'refreshing' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : list.newLeadsCount > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    <span>{getRefreshStatusText(list)}</span>
                  </div>

                  {list.automationSettings.notifyOnNewBuyer && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Auto-notify
                    </span>
                  )}
                </div>
              </div>
            ))}

            {savedLists.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No saved lists yet</p>
                <p className="text-sm">Create your first smart list to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Shortlist Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Pinned Shortlist ({shortlist.length})</h3>

          <div className="space-y-3">
            {shortlist.map((entry) => (
              <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{entry.buyerName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>Score: {entry.matchScore}</span>
                      </span>
                      <span>Last activity: {entry.lastActivity}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Pinned on {entry.pinnedDate}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewBuyer(entry)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View Buyer Detail"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onRemoveFromShortlist(entry.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Remove from Shortlist"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {shortlist.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pinned buyers yet</p>
                <p className="text-sm">Pin buyers from search results to track them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}