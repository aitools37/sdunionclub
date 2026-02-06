/*
  # Create matches table

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `competition_id` (uuid, foreign key to competitions)
      - `team_id` (uuid, foreign key to teams)
      - `opponent` (text, not null)
      - `opponent_logo` (text, nullable)
      - `match_date` (date, not null)
      - `match_time` (time, default 17:00)
      - `venue` (text, nullable)
      - `is_home` (boolean, default true)
      - `home_score` (integer, nullable)
      - `away_score` (integer, nullable)
      - `status` (text, default 'scheduled')
      - `matchday` (integer, nullable)
      - `rfcf_match_id` (text, nullable)
      - `scraped_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Indexes
    - match_date, status, competition_id, team_id
  3. Security
    - Enable RLS on `matches` table
    - Public read access for match schedules
    - Service role full access for scraping
*/

CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    opponent TEXT NOT NULL,
    opponent_logo TEXT,
    match_date DATE NOT NULL,
    match_time TIME DEFAULT '17:00',
    venue TEXT,
    is_home BOOLEAN DEFAULT true,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'postponed', 'cancelled')),
    matchday INTEGER,
    rfcf_match_id TEXT,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_match UNIQUE (competition_id, match_date, opponent)
);

CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_competition ON public.matches(competition_id);
CREATE INDEX IF NOT EXISTS idx_matches_team ON public.matches(team_id);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read matches"
    ON public.matches
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anonymous users can read matches"
    ON public.matches
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Service role can insert matches"
    ON public.matches
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Service role can update matches"
    ON public.matches
    FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can delete matches"
    ON public.matches
    FOR DELETE
    TO service_role
    USING (true);

CREATE OR REPLACE FUNCTION update_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_matches_timestamp ON public.matches;
CREATE TRIGGER update_matches_timestamp
    BEFORE UPDATE ON public.matches
    FOR EACH ROW
    EXECUTE FUNCTION update_matches_updated_at();