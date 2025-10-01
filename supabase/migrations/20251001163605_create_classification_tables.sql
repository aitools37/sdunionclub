/*
  # Create Classification Tables

  ## Overview
  This migration creates tables to store football classification (standings) data
  from the Real Federación Cántabra de Fútbol (RFCF).

  ## New Tables
  
  ### `competitions`
  Stores information about different competitions/leagues
  - `id` (uuid, primary key)
  - `name` (text) - Competition name
  - `season` (text) - Season identifier (e.g., "2024-2025")
  - `group_name` (text) - Group name (e.g., "Grupo B")
  - `rfcf_competition_code` (text) - RFCF competition code
  - `rfcf_group_code` (text) - RFCF group code
  - `is_active` (boolean) - Whether this is the current active competition
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `teams`
  Stores team information
  - `id` (uuid, primary key)
  - `name` (text) - Team name
  - `short_name` (text) - Short team name
  - `is_our_team` (boolean) - Whether this is S.D. Union Club
  - `rfcf_link` (text) - Link to team page on RFCF
  - `created_at` (timestamptz)

  ### `classification_standings`
  Stores the actual classification/standings data
  - `id` (uuid, primary key)
  - `competition_id` (uuid, foreign key)
  - `team_id` (uuid, foreign key)
  - `position` (integer) - League position
  - `points` (integer) - Total points
  - `played` (integer) - Matches played
  - `won` (integer) - Matches won
  - `drawn` (integer) - Matches drawn
  - `lost` (integer) - Matches lost
  - `goals_for` (integer) - Goals scored
  - `goals_against` (integer) - Goals conceded
  - `goal_difference` (integer) - Goal difference
  - `form` (text) - Last 5 results (e.g., "WDLWW")
  - `is_promoted` (boolean) - In promotion zone
  - `is_playoff` (boolean) - In playoff zone
  - `is_relegated` (boolean) - In relegation zone
  - `scraped_at` (timestamptz) - When this data was scraped
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access (data is public on RFCF website)
  - Restrict write access to service role only
*/

-- Create competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  season text NOT NULL,
  group_name text,
  rfcf_competition_code text,
  rfcf_group_code text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  short_name text,
  is_our_team boolean DEFAULT false,
  rfcf_link text,
  created_at timestamptz DEFAULT now()
);

-- Create classification_standings table
CREATE TABLE IF NOT EXISTS classification_standings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  position integer NOT NULL,
  points integer DEFAULT 0,
  played integer DEFAULT 0,
  won integer DEFAULT 0,
  drawn integer DEFAULT 0,
  lost integer DEFAULT 0,
  goals_for integer DEFAULT 0,
  goals_against integer DEFAULT 0,
  goal_difference integer DEFAULT 0,
  form text,
  is_promoted boolean DEFAULT false,
  is_playoff boolean DEFAULT false,
  is_relegated boolean DEFAULT false,
  scraped_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(competition_id, team_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_competitions_active ON competitions(is_active);
CREATE INDEX IF NOT EXISTS idx_teams_our_team ON teams(is_our_team);
CREATE INDEX IF NOT EXISTS idx_standings_competition ON classification_standings(competition_id);
CREATE INDEX IF NOT EXISTS idx_standings_position ON classification_standings(position);

-- Enable Row Level Security
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE classification_standings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to competitions"
  ON competitions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to teams"
  ON teams FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to standings"
  ON classification_standings FOR SELECT
  TO anon
  USING (true);

-- Create policies for authenticated read access
CREATE POLICY "Allow authenticated read access to competitions"
  ON competitions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read access to standings"
  ON classification_standings FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial competition data
INSERT INTO competitions (name, season, group_name, rfcf_competition_code, rfcf_group_code, is_active)
VALUES (
  'Segunda Regional',
  '2024-2025',
  'Grupo B',
  '22119651',
  '22119687',
  true
) ON CONFLICT DO NOTHING;

-- Insert S.D. Union Club as our team
INSERT INTO teams (name, short_name, is_our_team)
VALUES (
  'S.D. UNION CLUB',
  'Union Club',
  true
) ON CONFLICT (name) DO NOTHING;