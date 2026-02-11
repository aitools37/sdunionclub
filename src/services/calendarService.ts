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
  matchday?: number;
}

const fallbackMatches: MatchDisplay[] = [];

export const calendarService = {
  _filterFallback(options?: {
    upcoming?: boolean;
    past?: boolean;
    limit?: number;
  }): MatchDisplay[] {
    let matches = [...fallbackMatches];
    const now = new Date();

    if (options?.upcoming) {
      matches = matches
        .filter(m => new Date(m.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    if (options?.past) {
      matches = matches
        .filter(m => new Date(m.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    if (options?.limit) {
      matches = matches.slice(0, options.limit);
    }

    return matches;
  },

  async getMatches(options?: {
    teamId?: string;
    upcoming?: boolean;
    past?: boolean;
    limit?: number;
  }): Promise<MatchDisplay[]> {
    if (!supabase) {
      return this._filterFallback(options);
    }

    try {
      let query = supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: options?.past ? false : true });

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
        return this._filterFallback(options);
      }

      if (!data || data.length === 0) {
        return this._filterFallback(options);
      }

      return data.map((match: Match) => ({
        id: match.id,
        opponent: match.opponent,
        opponentLogo: match.opponent_logo,
        date: match.match_date,
        time: match.match_time,
        venue: match.venue,
        competition: 'Segunda Regional Grupo C',
        isHome: match.is_home,
        result: match.home_score !== null && match.away_score !== null
          ? `${match.home_score}-${match.away_score}`
          : undefined,
        homeScore: match.home_score,
        awayScore: match.away_score,
        status: match.status,
        matchday: match.matchday,
      }));
    } catch (error) {
      console.error('Error in getMatches:', error);
      return this._filterFallback(options);
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
