import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { MatchReason, MatchReasonDirection } from '../types';
import { getTopReasons, getFullBreakdown } from '../api/matchReasons';
import { trackEvent } from '../utils/analytics';

interface MatchScoreChipProps {
  score: number;
  entityId: string;
  entityType: 'company' | 'buyer';
}

export default function MatchScoreChip({ score, entityId, entityType }: MatchScoreChipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [topReasons, setTopReasons] = useState<MatchReason[]>([]);
  const [breakdown, setBreakdown] = useState<MatchReason[]>([]);
  const [sum, setSum] = useState<number>(0);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [error, setError] = useState(false);

  const chipRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTopReasons();
  }, [entityId, entityType]);

  useEffect(() => {
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showPopover]);

  const loadTopReasons = async () => {
    try {
      const reasons = await getTopReasons(entityId, entityType);
      setTopReasons(reasons);
    } catch (err) {
      console.error('Failed to load top reasons:', err);
    }
  };

  const loadBreakdown = async () => {
    if (breakdown.length > 0) return;

    setLoadingBreakdown(true);
    setError(false);

    try {
      const result = await getFullBreakdown(entityId, entityType);
      setBreakdown(result.breakdown);
      setSum(result.sum);
    } catch (err) {
      console.error('Failed to load breakdown:', err);
      setError(true);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
      trackEvent('match_reason_view_hover', {
        entityType,
        entityId,
        matchScore: score
      });
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowTooltip(false);
  };

  const handleClick = () => {
    setShowPopover(!showPopover);
    if (!showPopover) {
      trackEvent('match_reason_view_click', {
        entityType,
        entityId,
        matchScore: score
      });
      loadBreakdown();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(e.target as Node) &&
      chipRef.current &&
      !chipRef.current.contains(e.target as Node)
    ) {
      setShowPopover(false);
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowPopover(false);
      chipRef.current?.focus();
    }
  };

  const handleImproveClick = () => {
    trackEvent('match_reason_improve_click', {
      entityType,
      entityId,
      matchScore: score
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getIconForDirection = (dir: MatchReasonDirection) => {
    switch (dir) {
      case 'pos':
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'neg':
        return <AlertTriangle className="w-3 h-3 text-red-600" />;
      case 'neu':
        return <Info className="w-3 h-3 text-gray-500" />;
    }
  };

  const getBarColor = (dir: MatchReasonDirection): string => {
    switch (dir) {
      case 'pos':
        return 'bg-green-600';
      case 'neg':
        return 'bg-red-600';
      case 'neu':
        return 'bg-gray-400';
    }
  };

  const getContribText = (contrib: number): string => {
    return contrib > 0 ? `+${contrib} pts` : contrib < 0 ? `${contrib} pts` : '0 pts';
  };

  return (
    <div className="relative inline-block">
      <button
        ref={chipRef}
        className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${getScoreColor(score)}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        aria-expanded={showPopover}
        aria-label={`Match score ${score}. Click for details.`}
        tabIndex={0}
      >
        Match {score}
      </button>

      {showTooltip && !showPopover && topReasons.length > 0 && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 pointer-events-none">
          <div className="text-xs font-semibold text-gray-700 mb-2">Why this match</div>
          <div className="space-y-1">
            {topReasons.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                {getIconForDirection(reason.dir)}
                <span className="text-xs text-gray-700 flex-1">{reason.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}

      {showPopover && (
        <div
          ref={popoverRef}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popover-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 id="popover-title" className="text-lg font-semibold text-gray-900">
                Why this match
              </h3>
              <button
                onClick={() => setShowPopover(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              {loadingBreakdown ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-sm text-red-600 mb-3">Couldn't load reasons. Try again.</p>
                  <button
                    onClick={() => {
                      setError(false);
                      loadBreakdown();
                    }}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : breakdown.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600">
                    Not enough data to explain this match. Broaden filters or enrich when ready.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {breakdown.map((reason, idx) => {
                      const maxContrib = Math.max(...breakdown.map(r => Math.abs(r.contrib || 0)));
                      const barWidth = maxContrib > 0 ? (Math.abs(reason.contrib || 0) / maxContrib) * 100 : 0;

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getIconForDirection(reason.dir)}
                              <span className="text-sm text-gray-900">{reason.label}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {getContribText(reason.contrib || 0)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getBarColor(reason.dir)} transition-all`}
                              style={{ width: `${barWidth}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {sum > 0 && (
                    <div className="pt-3 border-t border-gray-200 mb-3">
                      <p className="text-sm text-gray-600">Contributes ~{sum} pts</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleImproveClick}
                className="text-sm text-blue-600 hover:text-blue-700 underline transition-colors"
              >
                Improve this match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
