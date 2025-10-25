import React from 'react';
import { Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Tradyon</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}