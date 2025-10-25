import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Edit3 } from 'lucide-react';

interface PlanPreviewProps {
  onContinue: () => void;
  onEditPlan: () => void;
}

const planSteps = [
  { id: 1, label: 'Scanning trade data sources', status: 'completed' },
  { id: 2, label: 'Applying grade & packaging filters', status: 'completed' },
  { id: 3, label: 'Deduplicating buyer records', status: 'completed' },
  { id: 4, label: 'Detecting emerging buyers', status: 'in-progress' },
  { id: 5, label: 'Computing match scores', status: 'pending' }
];

export default function PlanPreview({ onContinue, onEditPlan }: PlanPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < planSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onContinue, 1000);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Preparing Search Plan</h2>
          <p className="text-gray-600">Analyzing data sources and building search strategy</p>
        </div>

        <div className="space-y-4 mb-6">
          {planSteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex items-center space-x-3">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={`text-sm ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onEditPlan}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Plan</span>
          </button>
          <button
            onClick={onContinue}
            disabled={currentStep < planSteps.length - 1}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {currentStep < planSteps.length - 1 ? 'Processing...' : 'View Results'}
          </button>
        </div>
      </div>
    </div>
  );
}