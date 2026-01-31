import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export interface Match {
  id: string;
  competition_id: string;
  team_id: string;
  opponent: string;
  opponent_logo?: string;
  match_date: string;
  match_time: string;
  venue: string;
  is_home: boolean;
  home_score?: number;
  away_score?: number;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  matchday?: number;
  competition?: {
    name: string;
    season: string;
  };
  scraped_at?: string;
}

export interface MatchDisplay {
  id: string;
  opponent: string;
  opponentLogo?: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  isHome: boolean;
  result?: string;
  homeScore?: number;
  awayScore?: number;
  status: string;
}

// Fallback data when Supabase is not configured
const fallbackMatches: MatchDisplay[] = [
  {
    id: '1',
    opponent: 'CD Laredo',
    date: '2026-02-08',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional',
    isHome: true,
    status: 'scheduled'
  },
  {
    id: '2',
    opponent: 'UD Samano',
    date: '2026-02-15',
    time: '16:30',
    venue: 'Campo Municipal Samano',
    competition: 'Segunda Regional',
    isHome: false,
    status: 'scheduled'
  },
  {
    id: '3',
    opponent: 'Racing Santander B',
    date: '2026-02-22',
    time: '18:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional',
    isHome: true,
    status: 'scheduled'
  },
  {
    id: '4',
    opponent: 'SD Cayón',
    date: '2026-01-25',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional',
    isHome: true,
    result: '2-1',
    homeScore: 2,
    awayScore: 1,
    status: 'finished'
  },
  {
    id: '5',
    opponent: 'CD Revilla',
    date: '2026-01-18',
    time: '16:00',
    venue: 'Campo Municipal Revilla',
    competition: 'Segunda Regional',
    isHome: false,
    result: '1-3',
    homeScore: 1,
    awayScore: 3,
    status: 'finished'
  },
];

export const calendarService = {
  async getMatches(options?: {
    teamId?: string;
    upcoming?: boolean;
    past?: boolean;
    limit?: number;
  }): Promise<MatchDisplay[]> {
    if (!supabase) {
      // Return fallback data filtered appropriately
      let matches = [...fallbackMatches];
      const now = new Date();
      
      if (options?.upcoming) {
        matches = matches.filter(m => new Date(m.date) >= now);
      }
      if (options?.past) {
        matches = matches.filter(m => new Date(m.date) < now);
      }
      if (options?.limit) {
        matches = matches.slice(0, options.limit);
      }
      
      return matches;
    }

    try {
      let query = supabase
        .from('matches')
        .select(`
          *,
          competition:competitions(name, season),
          team:teams(name, is_our_team)
        `)
        .order('match_date', { ascending: options?.past ? false : true });

      if (options?.teamId) {
        query = query.eq('team_id', options.teamId);
      }

      if (options?.upcoming) {
        query = query.gte('match_date', new Date().toISOString().split('T')[0]);
      }

      if (options?.past) {
        query = query.lt('match_date', new Date().toISOString().split('T')[0]);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching matches:', error);
        return fallbackMatches;
      }

      if (!data || data.length === 0) {
        return fallbackMatches;
      }

      return data.map((match: Match) => ({
        id: match.id,
        opponent: match.opponent,
        opponentLogo: match.opponent_logo,
        date: match.match_date,
        time: match.match_time,
        venue: match.venue,
        competition: match.competition?.name || 'Segunda Regional',
        isHome: match.is_home,
        result: match.home_score !== null && match.away_score !== null
          ? `${match.home_score}-${match.away_score}`
          : undefined,
        homeScore: match.home_score,
        awayScore: match.away_score,
        status: match.status
      }));
    } catch (error) {
      console.error('Error in getMatches:', error);
      return fallbackMatches;
    }
  },

  async getUpcomingMatches(limit: number = 5): Promise<MatchDisplay[]> {
    return this.getMatches({ upcoming: true, limit });
  },

  async getPastMatches(limit: number = 5): Promise<MatchDisplay[]> {
    return this.getMatches({ past: true, limit });
  },

  async getNextMatch(): Promise<MatchDisplay | null> {
    const matches = await this.getUpcomingMatches(1);
    return matches.length > 0 ? matches[0] : null;
  },

  async getLastMatch(): Promise<MatchDisplay | null> {
    const matches = await this.getPastMatches(1);
    return matches.length > 0 ? matches[0] : null;
  },

  async triggerScrape(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!supabase || !supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/scrape-rfcf-calendar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error triggering calendar scrape:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async getLastUpdateTime(): Promise<Date | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('matches')
        .select('scraped_at')
        .order('scraped_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return new Date(data.scraped_at);
    } catch {
      return null;
    }
  },
};
