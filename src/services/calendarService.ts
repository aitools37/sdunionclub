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

const fallbackMatches: MatchDisplay[] = [
  {
    id: 'fb-1',
    opponent: 'Castro B',
    date: '2025-10-05',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '3-1',
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    matchday: 1,
  },
  {
    id: 'fb-2',
    opponent: 'CD Guarnizo C',
    date: '2025-10-12',
    time: '16:30',
    venue: 'Campo Municipal Guarnizo',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '0-2',
    homeScore: 0,
    awayScore: 2,
    status: 'finished',
    matchday: 2,
  },
  {
    id: 'fb-3',
    opponent: 'SD Villaescusa B',
    date: '2025-10-19',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '4-0',
    homeScore: 4,
    awayScore: 0,
    status: 'finished',
    matchday: 3,
  },
  {
    id: 'fb-4',
    opponent: 'Nueva Montaña',
    date: '2025-10-26',
    time: '16:00',
    venue: 'Campo Nueva Montaña',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '1-3',
    homeScore: 1,
    awayScore: 3,
    status: 'finished',
    matchday: 4,
  },
  {
    id: 'fb-5',
    opponent: 'Santoña CF',
    date: '2025-11-02',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '2-0',
    homeScore: 2,
    awayScore: 0,
    status: 'finished',
    matchday: 5,
  },
  {
    id: 'fb-6',
    opponent: 'Samano B',
    date: '2025-11-09',
    time: '16:00',
    venue: 'Campo Municipal Samano',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '0-4',
    homeScore: 0,
    awayScore: 4,
    status: 'finished',
    matchday: 6,
  },
  {
    id: 'fb-7',
    opponent: 'EMF Meruelo',
    date: '2025-11-16',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '3-0',
    homeScore: 3,
    awayScore: 0,
    status: 'finished',
    matchday: 7,
  },
  {
    id: 'fb-8',
    opponent: 'Marina de Cudeyo',
    date: '2025-11-23',
    time: '16:00',
    venue: 'Campo Marina de Cudeyo',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '0-2',
    homeScore: 0,
    awayScore: 2,
    status: 'finished',
    matchday: 8,
  },
  {
    id: 'fb-9',
    opponent: 'SD Noja B',
    date: '2025-11-30',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '5-0',
    homeScore: 5,
    awayScore: 0,
    status: 'finished',
    matchday: 9,
  },
  {
    id: 'fb-10',
    opponent: 'Velarde Camargo B',
    date: '2025-12-07',
    time: '16:00',
    venue: 'Campo Velarde Camargo',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '1-4',
    homeScore: 1,
    awayScore: 4,
    status: 'finished',
    matchday: 10,
  },
  {
    id: 'fb-11',
    opponent: 'CD Pontejos',
    date: '2025-12-14',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '6-1',
    homeScore: 6,
    awayScore: 1,
    status: 'finished',
    matchday: 11,
  },
  {
    id: 'fb-12',
    opponent: 'Los Rios B',
    date: '2025-12-21',
    time: '16:00',
    venue: 'Campo Los Rios',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '0-5',
    homeScore: 0,
    awayScore: 5,
    status: 'finished',
    matchday: 12,
  },
  {
    id: 'fb-13',
    opponent: 'Castro B',
    date: '2026-01-11',
    time: '16:00',
    venue: 'Campo Municipal Castro',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '1-3',
    homeScore: 1,
    awayScore: 3,
    status: 'finished',
    matchday: 13,
  },
  {
    id: 'fb-14',
    opponent: 'CD Guarnizo C',
    date: '2026-01-18',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '3-1',
    homeScore: 3,
    awayScore: 1,
    status: 'finished',
    matchday: 14,
  },
  {
    id: 'fb-15',
    opponent: 'SD Villaescusa B',
    date: '2026-01-25',
    time: '16:00',
    venue: 'Campo Villaescusa',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '0-3',
    homeScore: 0,
    awayScore: 3,
    status: 'finished',
    matchday: 15,
  },
  {
    id: 'fb-16',
    opponent: 'Nueva Montaña',
    date: '2026-02-01',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    result: '4-2',
    homeScore: 4,
    awayScore: 2,
    status: 'finished',
    matchday: 16,
  },
  {
    id: 'fb-17',
    opponent: 'Santoña CF',
    date: '2026-02-08',
    time: '16:30',
    venue: 'Campo Municipal Santoña',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    result: '1-2',
    homeScore: 1,
    awayScore: 2,
    status: 'finished',
    matchday: 17,
  },
  {
    id: 'fb-18',
    opponent: 'Samano B',
    date: '2026-02-15',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    status: 'scheduled',
    matchday: 18,
  },
  {
    id: 'fb-19',
    opponent: 'EMF Meruelo',
    date: '2026-02-22',
    time: '16:00',
    venue: 'Campo Municipal Meruelo',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    status: 'scheduled',
    matchday: 19,
  },
  {
    id: 'fb-20',
    opponent: 'Marina de Cudeyo',
    date: '2026-03-01',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    status: 'scheduled',
    matchday: 20,
  },
  {
    id: 'fb-21',
    opponent: 'SD Noja B',
    date: '2026-03-08',
    time: '16:00',
    venue: 'Campo Municipal Noja',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    status: 'scheduled',
    matchday: 21,
  },
  {
    id: 'fb-22',
    opponent: 'Velarde Camargo B',
    date: '2026-03-15',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    status: 'scheduled',
    matchday: 22,
  },
  {
    id: 'fb-23',
    opponent: 'CD Pontejos',
    date: '2026-03-22',
    time: '16:00',
    venue: 'Campo Municipal Pontejos',
    competition: 'Segunda Regional Grupo C',
    isHome: false,
    status: 'scheduled',
    matchday: 23,
  },
  {
    id: 'fb-24',
    opponent: 'Los Rios B',
    date: '2026-03-29',
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional Grupo C',
    isHome: true,
    status: 'scheduled',
    matchday: 24,
  },
];

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
