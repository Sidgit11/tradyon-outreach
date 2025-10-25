import React from 'react';
import { Search, Users, Bookmark, Send, TrendingUp, Package, Settings } from 'lucide-react';
import { NavigationScreen } from '../types';

interface NavigationProps {
  currentScreen: NavigationScreen;
  segmentsCount: number;
  onScreenChange: (screen: NavigationScreen) => void;
}

export default function Navigation({ currentScreen, segmentsCount, onScreenChange }: NavigationProps) {
  const navItems = [
    { id: 'buildAudience', label: 'Build Audience', icon: Search },
    { id: 'enrichedProfiles', label: 'Enriched Profiles', icon: Users },
    { id: 'segmentsBookmarks', label: 'Segments & Bookmarks', icon: Bookmark, count: segmentsCount },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'hotLeads', label: 'Hot Leads', icon: TrendingUp },
    { id: 'myProducts', label: 'My Products', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="space-y-1">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => onScreenChange(id as NavigationScreen)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentScreen === id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}