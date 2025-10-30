import { createClient } from '@supabase/supabase-js';
import { MatchScoreExplanation, MatchReason, MatchReasonDirection } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Match score explanations will use fallback data.');
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const breakdownCache = new Map<string, MatchReason[]>();

export async function getTopReasons(
  entityId: string,
  entityType: 'company' | 'buyer'
): Promise<MatchReason[]> {
  if (!supabase) {
    return getFallbackTopReasons();
  }

  try {
    const { data, error } = await supabase
      .from('match_score_reasons')
      .select('top_reasons')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .maybeSingle();

    if (error) {
      console.error('Error fetching top reasons:', error);
      return getFallbackTopReasons();
    }

    if (!data || !data.top_reasons) {
      return getFallbackTopReasons();
    }

    return data.top_reasons as MatchReason[];
  } catch (error) {
    console.error('Error fetching top reasons:', error);
    return getFallbackTopReasons();
  }
}

export async function getFullBreakdown(
  entityId: string,
  entityType: 'company' | 'buyer'
): Promise<{ breakdown: MatchReason[]; sum: number }> {
  const cacheKey = `${entityType}-${entityId}`;

  if (breakdownCache.has(cacheKey)) {
    const breakdown = breakdownCache.get(cacheKey)!;
    const sum = breakdown.reduce((acc, r) => acc + (r.contrib || 0), 0);
    return { breakdown, sum };
  }

  if (!supabase) {
    const fallback = getFallbackBreakdown();
    breakdownCache.set(cacheKey, fallback.breakdown);
    return fallback;
  }

  try {
    const { data: reasonRecord, error: reasonError } = await supabase
      .from('match_score_reasons')
      .select('id')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .maybeSingle();

    if (reasonError || !reasonRecord) {
      console.error('Error fetching reason record:', reasonError);
      const fallback = getFallbackBreakdown();
      return fallback;
    }

    const { data: details, error: detailsError } = await supabase
      .from('match_reason_details')
      .select('reason_id, label, direction, contribution, sort_order')
      .eq('match_score_reason_id', reasonRecord.id)
      .order('sort_order', { ascending: true });

    if (detailsError || !details) {
      console.error('Error fetching reason details:', detailsError);
      const fallback = getFallbackBreakdown();
      return fallback;
    }

    const breakdown: MatchReason[] = details.map(d => ({
      id: d.reason_id,
      label: d.label,
      dir: d.direction as MatchReasonDirection,
      contrib: d.contribution
    }));

    breakdownCache.set(cacheKey, breakdown);

    const sum = breakdown.reduce((acc, r) => acc + (r.contrib || 0), 0);
    return { breakdown, sum };
  } catch (error) {
    console.error('Error fetching full breakdown:', error);
    const fallback = getFallbackBreakdown();
    return fallback;
  }
}

export async function getMatchScoreExplanation(
  entityId: string,
  entityType: 'company' | 'buyer',
  loadFullBreakdown: boolean = false
): Promise<MatchScoreExplanation> {
  const topReasons = await getTopReasons(entityId, entityType);

  if (!loadFullBreakdown) {
    return {
      topReasons,
      hasBreakdown: true
    };
  }

  const { breakdown, sum } = await getFullBreakdown(entityId, entityType);

  return {
    topReasons,
    hasBreakdown: true,
    breakdown,
    sum
  };
}

function getFallbackTopReasons(): MatchReason[] {
  return [
    { id: 'spec_fit', label: 'Exact spec match', dir: 'pos' },
    { id: 'geo_fit', label: 'Geographic overlap', dir: 'pos' },
    { id: 'rfv', label: 'Recent activity', dir: 'pos' }
  ];
}

function getFallbackBreakdown(): { breakdown: MatchReason[]; sum: number } {
  const breakdown: MatchReason[] = [
    { id: 'spec_fit', label: 'Spec fit', dir: 'pos', contrib: 22 },
    { id: 'geo_fit', label: 'Geo fit', dir: 'pos', contrib: 18 },
    { id: 'partners', label: 'Partner proximity', dir: 'pos', contrib: 9 },
    { id: 'price_band', label: 'Price band', dir: 'pos', contrib: 6 },
    { id: 'rfv', label: 'Recency & frequency', dir: 'pos', contrib: 10 }
  ];

  const sum = breakdown.reduce((acc, r) => acc + (r.contrib || 0), 0);

  return { breakdown, sum };
}
