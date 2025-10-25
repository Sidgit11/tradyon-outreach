import React from 'react';
import { Search, Zap, Target } from 'lucide-react';

interface LandingPageProps {
  onNewSearch: () => void;
  onExampleClick: (query: string) => void;
}

export default function LandingPage({ onNewSearch, onExampleClick }: LandingPageProps) {
  const examples = [
    "pepper asta 500 europe 180d",
    "frozen shrimp 21/25 us 90d",
    "organic turmeric powder 500g india 120d"
  ];

  const features = [
    {
      icon: Target,
      title: "Precision Matching",
      description: "AI-powered matching based on grade, form, packaging, and trade lanes"
    },
    {
      icon: Search,
      title: "Global Coverage",
      description: "Access to comprehensive global trade data across all major markets"
    },
    {
      icon: Zap,
      title: "Real-time Intelligence",
      description: "Live updates on buyer behavior, emerging trends, and market opportunities"
    }
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Buyers
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover, rank, and qualify global buyers with precision matching and explainable AI insights
          </p>
        </div>

        <div className="mb-12">
          <button
            onClick={onNewSearch}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Search className="w-6 h-6 mr-3" />
            New Buyer Search
          </button>
          
          <div className="mt-4 text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd> anywhere
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Examples</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => onExampleClick(example)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}