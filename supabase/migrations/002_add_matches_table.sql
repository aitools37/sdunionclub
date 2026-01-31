-- Migration: Add matches table for calendar data
-- This table stores match schedules scraped from RFCF

-- Create matches table if not exists
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
    
    -- Unique constraint to prevent duplicates
    CONSTRAINT unique_match UNIQUE (competition_id, match_date, opponent)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_competition ON public.matches(competition_id);
CREATE INDEX IF NOT EXISTS idx_matches_team ON public.matches(team_id);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY IF NOT EXISTS "Allow public read matches"
    ON public.matches
    FOR SELECT
    TO public
    USING (true);

-- Policy: Allow service role to manage
CREATE POLICY IF NOT EXISTS "Allow service role to manage matches"
    ON public.matches
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Update trigger for updated_at
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

-- Comment on table
COMMENT ON TABLE public.matches IS 'Match schedule and results scraped from RFCF';
