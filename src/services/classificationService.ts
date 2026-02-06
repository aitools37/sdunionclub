import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ClassificationTeam {
  position: number;
  team: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  lastFiveResults: string[];
  isPromoted?: boolean;
  isRelegated?: boolean;
  isPlayoff?: boolean;
  link?: string;
}

export interface Competition {
  id: string;
  name: string;
  season: string;
  group_name: string;
  rfcf_competition_code: string;
  rfcf_group_code: string;
  is_active: boolean;
}

export const classificationService = {
  async getActiveCompetition(): Promise<Competition | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching competition:', error);
      return null;
    }
    return data;
  },

  async getClassification(): Promise<ClassificationTeam[]> {
    if (!supabase) return [];

    const competition = await this.getActiveCompetition();
    if (!competition) return [];

    const { data: standings, error } = await supabase
      .from('classification_standings')
      .select(`
        *,
        team:teams(name, is_our_team, rfcf_link)
      `)
      .eq('competition_id', competition.id)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching classification:', error);
      return [];
    }

    if (!standings || standings.length === 0) return [];

    return standings.map(standing => {
      const formString = standing.form || '';
      const lastFiveResults = formString
        .slice(-5)
        .split('')
        .map((char: string) => {
          switch (char.toUpperCase()) {
            case 'W':
            case 'G': return 'G';
            case 'L':
            case 'P': return 'P';
            case 'D':
            case 'E': return 'E';
            default: return '?';
          }
        });

      return {
        position: standing.position,
        team: standing.team?.name || 'Equipo desconocido',
        points: standing.points,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        goalsFor: standing.goals_for,
        goalsAgainst: standing.goals_against,
        goalDifference: standing.goal_difference,
        lastFiveResults: lastFiveResults.length > 0 ? lastFiveResults : [],
        isPromoted: standing.is_promoted,
        isPlayoff: standing.is_playoff,
        isRelegated: standing.is_relegated,
        link: standing.team?.rfcf_link || undefined,
      };
    });
  },

  async triggerScrape(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, error: 'Supabase no configurado' };
    }

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/scrape-rfcf-classification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Error ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error triggering scrape:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  },

  async getLastUpdateTime(): Promise<Date | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('classification_standings')
      .select('scraped_at')
      .order('scraped_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.scraped_at) return null;
    return new Date(data.scraped_at);
  },
};
