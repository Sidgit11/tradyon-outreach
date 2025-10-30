export type AnalyticsEventType =
  | 'match_reason_view_hover'
  | 'match_reason_view_click'
  | 'match_reason_improve_click';

export interface AnalyticsEventData {
  event: AnalyticsEventType;
  entityType: 'company' | 'buyer';
  entityId: string;
  matchScore: number;
  timestamp: string;
  sessionId?: string;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  return sessionId;
}

export function trackEvent(
  event: AnalyticsEventType,
  data: {
    entityType: 'company' | 'buyer';
    entityId: string;
    matchScore: number;
  }
): void {
  const eventData: AnalyticsEventData = {
    event,
    entityType: data.entityType,
    entityId: data.entityId,
    matchScore: data.matchScore,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId()
  };

  console.log('[Analytics]', eventData);
}
