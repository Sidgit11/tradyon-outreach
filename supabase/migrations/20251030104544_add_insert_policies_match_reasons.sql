/*
  # Add INSERT policies for match score reasons

  ## Changes
  - Add INSERT policies for match_score_reasons table to allow seeding
  - Add INSERT policies for match_reason_details table
  - These policies allow both authenticated and anonymous users to insert (for demo/seeding purposes)
*/

-- Add INSERT policy for match_score_reasons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'match_score_reasons' 
    AND policyname = 'Allow insert for seeding'
  ) THEN
    CREATE POLICY "Allow insert for seeding"
      ON match_score_reasons FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Add INSERT policy for match_reason_details
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'match_reason_details' 
    AND policyname = 'Allow insert for seeding'
  ) THEN
    CREATE POLICY "Allow insert for seeding"
      ON match_reason_details FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;