import { createClient } from '@supabase/supabase-js';
import { MatchReasonId, MatchReasonDirection } from '../types';

const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta?.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta?.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ReasonConfig {
  id: MatchReasonId;
  label: string;
  dir: MatchReasonDirection;
  contrib: number;
}

function generateReasonsForScore(score: number): {
  topReasons: ReasonConfig[];
  allReasons: ReasonConfig[];
} {
  const reasons: ReasonConfig[] = [];

  if (score >= 85) {
    reasons.push(
      { id: 'spec_fit', label: 'Exact spec match', dir: 'pos', contrib: Math.floor(score * 0.24) },
      { id: 'geo_fit', label: 'Geographic overlap', dir: 'pos', contrib: Math.floor(score * 0.20) },
      { id: 'partners', label: 'Shared trade partners', dir: 'pos', contrib: Math.floor(score * 0.10) },
      { id: 'rfv', label: 'Recent & frequent activity', dir: 'pos', contrib: Math.floor(score * 0.12) },
      { id: 'price_band', label: 'Price band compatible', dir: 'pos', contrib: Math.floor(score * 0.07) }
    );
  } else if (score >= 70) {
    reasons.push(
      { id: 'spec_fit', label: 'Good spec match', dir: 'pos', contrib: Math.floor(score * 0.20) },
      { id: 'geo_fit', label: 'Some geographic overlap', dir: 'pos', contrib: Math.floor(score * 0.15) },
      { id: 'rfv', label: 'Moderate activity', dir: 'neu', contrib: Math.floor(score * 0.08) },
      { id: 'partners', label: 'Limited partner overlap', dir: 'neu', contrib: 0 },
      { id: 'price_band', label: 'Price within range', dir: 'pos', contrib: Math.floor(score * 0.05) }
    );
  } else {
    reasons.push(
      { id: 'spec_fit', label: 'Partial spec match', dir: 'neu', contrib: Math.floor(score * 0.15) },
      { id: 'geo_fit', label: 'Limited geographic overlap', dir: 'neu', contrib: Math.floor(score * 0.10) },
      { id: 'rfv', label: 'Low recent activity', dir: 'neg', contrib: -Math.floor(score * 0.05) },
      { id: 'price_band', label: 'Price band mismatch', dir: 'neg', contrib: -Math.floor(score * 0.03) },
      { id: 'moq', label: 'Volume band fit uncertain', dir: 'neu', contrib: 0 }
    );
  }

  return {
    topReasons: reasons.slice(0, 3),
    allReasons: reasons
  };
}

export async function seedMatchReasons() {
  console.log('Starting to seed match reasons...');

  const companies = [
    { id: 'c_001', name: 'EuroSpice GmbH', score: 92 },
    { id: 'c_002', name: 'Mediterranean Imports Ltd', score: 88 },
    { id: 'c_003', name: 'Nordic Food Solutions', score: 84 },
    { id: 'c_004', name: 'Atlantic Spice Co', score: 81 },
    { id: 'c_005', name: 'Asia Pacific Trading', score: 79 }
  ];

  for (const company of companies) {
    const { topReasons, allReasons } = generateReasonsForScore(company.score);

    const topReasonsJson = topReasons.map(r => ({
      id: r.id,
      label: r.label,
      dir: r.dir
    }));

    const { data: reasonRecord, error: insertError } = await supabase
      .from('match_score_reasons')
      .insert({
        entity_id: company.id,
        entity_type: 'company',
        match_score: company.score,
        top_reasons: topReasonsJson
      })
      .select()
      .single();

    if (insertError) {
      console.error(`Error inserting reason record for ${company.name}:`, insertError);
      continue;
    }

    const details = allReasons.map((reason, idx) => ({
      match_score_reason_id: reasonRecord.id,
      reason_id: reason.id,
      label: reason.label,
      direction: reason.dir,
      contribution: reason.contrib,
      sort_order: idx + 1
    }));

    const { error: detailsError } = await supabase
      .from('match_reason_details')
      .insert(details);

    if (detailsError) {
      console.error(`Error inserting reason details for ${company.name}:`, detailsError);
      continue;
    }

    console.log(`✓ Seeded match reasons for ${company.name}`);
  }

  console.log('Match reasons seeding completed!');
}
