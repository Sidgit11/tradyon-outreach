import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
  isOpen?: boolean;
}

export default function FilterSidebar({ isOpen = true }: FilterSidebarProps) {
  const filterSections = [
    {
      title: 'Grade/Form',
      options: ['ASTA 500', 'ASTA 450', 'ASTA 400', 'Ground', 'Whole']
    },
    {
      title: 'Packaging',
      options: ['500g pouch', '550g pouch', '1kg bag', '25kg sack', 'Bulk']
    },
    {
      title: 'Recency',
      options: ['7 days', '30 days', '90 days', '180 days']
    },
    {
      title: 'Volume (MT)',
      options: ['< 10', '10-50', '50-100', '100-500', '500+']
    },
    {
      title: 'Price Range (USD/kg)',
      options: ['< $2', '$2-4', '$4-6', '$6-8', '> $8']
    },
    {
      title: 'Country/Port',
      options: ['Germany', 'Netherlands', 'Spain', 'Italy', 'France']
    },
    {
      title: 'Certifications',
      options: ['Organic', 'Fair Trade', 'HACCP', 'BRC', 'IFS']
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-lg p-4 h-fit">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Filters</h3>
      </div>

      <div className="space-y-4">
        {filterSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <button className="flex items-center justify-between w-full text-left">
              <span className="text-sm font-medium text-gray-700">{section.title}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <div className="space-y-2 ml-2">
              {section.options.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Emerging buyers only</span>
          </label>
        </div>

        <div className="pt-4 space-y-2">
          <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Apply Filters
          </button>
          <button className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}