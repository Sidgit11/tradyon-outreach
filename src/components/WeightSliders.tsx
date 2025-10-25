import React from 'react';
import { SearchWeights } from '../types';

interface WeightSlidersProps {
  weights: SearchWeights;
  onWeightsChange: (weights: SearchWeights) => void;
}

export default function WeightSliders({ weights, onWeightsChange }: WeightSlidersProps) {
  const handleWeightChange = (key: keyof SearchWeights, value: number) => {
    onWeightsChange({
      ...weights,
      [key]: value
    });
  };

  const sliders = [
    { key: 'recency' as keyof SearchWeights, label: 'Recency', color: 'blue' },
    { key: 'volume' as keyof SearchWeights, label: 'Volume', color: 'green' },
    { key: 'growth' as keyof SearchWeights, label: 'Growth', color: 'purple' },
    { key: 'spec_fit' as keyof SearchWeights, label: 'Spec Fit', color: 'orange' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Ranking Weights</h3>
      <div className="space-y-4">
        {sliders.map(({ key, label, color }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <span className="text-sm text-gray-500">{weights[key]}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights[key]}
              onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${color}`}
            />
          </div>
        ))}
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total:</span>
            <span className={`font-medium ${
              Object.values(weights).reduce((a, b) => a + b, 0) === 100 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {Object.values(weights).reduce((a, b) => a + b, 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}