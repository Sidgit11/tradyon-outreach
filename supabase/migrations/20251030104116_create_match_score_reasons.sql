/*
  # Match Score Explainability Tables

  ## Overview
  This migration creates tables to store match score explanation data for the explainability feature.
  All data stored here is dummy/mock data for demonstration purposes and does not trigger any external
  API calls or credit consumption.

  ## New Tables
  
  ### `match_score_reasons`
  Stores the main explanation record for each entity (Company or Buyer) with their match score.
  - `id` (uuid, primary key)
  - `entity_id` (text) - The ID of the company or buyer
  - `entity_type` (text) - Either 'company' or 'buyer'
  - `match_score` (integer) - The match score (0-100)
  - `top_reasons` (jsonb) - Denormalized top 3 reasons for instant tooltip display
  - `created_at` (timestamptz) - When this explanation was created

  ### `match_reason_details`
  Stores individual reason breakdowns with contribution scores.
  - `id` (uuid, primary key)
  - `match_score_reason_id` (uuid, foreign key to match_score_reasons)
  - `reason_id` (text) - One of: spec_fit, geo_fit, partners, price_band, rfv, moq
  - `label` (text) - Human-readable label for the reason
  - `direction` (text) - One of: pos, neg, neu
  - `contribution` (integer) - Numeric contribution to the score
  - `sort_order` (integer) - Display order (1-5)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on both tables
  - Add policies to allow authenticated users to read explanation data
  - This is read-only data for display purposes
*/

-- Create match_score_reasons table
CREATE TABLE IF NOT EXISTS match_score_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('company', 'buyer')),
  match_score integer NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  top_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups by entity
CREATE INDEX IF NOT EXISTS idx_match_score_reasons_entity 
  ON match_score_reasons(entity_id, entity_type);

-- Create match_reason_details table
CREATE TABLE IF NOT EXISTS match_reason_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_score_reason_id uuid NOT NULL REFERENCES match_score_reasons(id) ON DELETE CASCADE,
  reason_id text NOT NULL CHECK (reason_id IN ('spec_fit', 'geo_fit', 'partners', 'price_band', 'rfv', 'moq')),
  label text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('pos', 'neg', 'neu')),
  contribution integer NOT NULL,
  sort_order integer NOT NULL CHECK (sort_order >= 1 AND sort_order <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups by parent reason
CREATE INDEX IF NOT EXISTS idx_match_reason_details_parent 
  ON match_reason_details(match_score_reason_id);

-- Enable Row Level Security
ALTER TABLE match_score_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_reason_details ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to read data
CREATE POLICY "Authenticated users can read match score reasons"
  ON match_score_reasons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read reason details"
  ON match_reason_details FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for public read access (since this is demo/mock data)
CREATE POLICY "Public can read match score reasons"
  ON match_score_reasons FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can read reason details"
  ON match_reason_details FOR SELECT
  TO anon
  USING (true);