import React, { useState } from 'react';
import { X, Undo2 } from 'lucide-react';
import { SearchAssumptions, HSCode } from '../types';

interface AssumptionsBarProps {
  assumptions: SearchAssumptions;
  onAssumptionsChange: (assumptions: SearchAssumptions) => void;
  onUndo?: () => void;
}

export default function AssumptionsBar({ assumptions, onAssumptionsChange, onUndo }: AssumptionsBarProps) {
  const [editingChip, setEditingChip] = useState<string | null>(null);

  const removeHSCode = (code: string) => {
    onAssumptionsChange({
      ...assumptions,
      hs: assumptions.hs.filter(hs => hs.code !== code)
    });
  };

  const removeMarket = (market: string) => {
    onAssumptionsChange({
      ...assumptions,
      markets: assumptions.markets.filter(m => m !== market)
    });
  };

  const removeCert = (cert: string) => {
    onAssumptionsChange({
      ...assumptions,
      certs: assumptions.certs?.filter(c => c !== cert) || []
    });
  };

  const updateGrade = (newGrade: string) => {
    onAssumptionsChange({
      ...assumptions,
      grade: newGrade || undefined
    });
    setEditingChip(null);
  };

  const updatePack = (newPack: string) => {
    onAssumptionsChange({
      ...assumptions,
      pack: newPack || undefined
    });
    setEditingChip(null);
  };

  const updateDays = (newDays: string) => {
    const days = parseInt(newDays);
    if (!isNaN(days)) {
      onAssumptionsChange({
        ...assumptions,
        days
      });
    }
    setEditingChip(null);
  };

  const renderEditableChip = (
    key: string,
    value: string,
    onSave: (value: string) => void,
    className: string = "bg-blue-100 text-blue-800"
  ) => {
    if (editingChip === key) {
      return (
        <input
          key={key}
          type="text"
          defaultValue={value}
          className="px-2 py-1 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onBlur={(e) => onSave(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSave((e.target as HTMLInputElement).value);
            } else if (e.key === 'Escape') {
              setEditingChip(null);
            }
          }}
          autoFocus
        />
      );
    }

    return (
      <button
        key={key}
        onClick={() => setEditingChip(key)}
        className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium hover:opacity-80 transition-opacity ${className}`}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Assumptions:</span>
          
          {/* HS Codes */}
          {assumptions.hs.map((hs) => (
            <div key={hs.code} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              <span>HS {hs.code}</span>
              <span className="ml-1 text-xs opacity-75">({Math.round(hs.confidence * 100)}%)</span>
              <button
                onClick={() => removeHSCode(hs.code)}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Grade */}
          {assumptions.grade && renderEditableChip(
            'grade',
            assumptions.grade,
            updateGrade,
            "bg-purple-100 text-purple-800"
          )}

          {/* Pack */}
          {assumptions.pack && renderEditableChip(
            'pack',
            assumptions.pack,
            updatePack,
            "bg-orange-100 text-orange-800"
          )}

          {/* Markets */}
          {assumptions.markets.map((market) => (
            <div key={market} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
              <span>{market}</span>
              <button
                onClick={() => removeMarket(market)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Timeframe */}
          {renderEditableChip(
            'days',
            `${assumptions.days}d`,
            updateDays,
            "bg-teal-100 text-teal-800"
          )}

          {/* MOQ */}
          {assumptions.moq_mt && (
            <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
              <span>MOQ {assumptions.moq_mt}MT</span>
            </div>
          )}

          {/* Certifications */}
          {assumptions.certs?.map((cert) => (
            <div key={cert} className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-sm font-medium">
              <span>{cert}</span>
              <button
                onClick={() => removeCert(cert)}
                className="ml-1 hover:bg-emerald-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {onUndo && (
          <button
            onClick={onUndo}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </button>
        )}
      </div>
    </div>
  );
}