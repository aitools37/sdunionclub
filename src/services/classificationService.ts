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

const fallbackClassification: ClassificationTeam[] = [
  { position: 1, team: 'SD Unión Club', points: 58, played: 26, won: 18, drawn: 4, lost: 4, goalsFor: 52, goalsAgainst: 22, goalDifference: 30, lastFiveResults: ['G', 'G', 'E', 'G', 'G'], isPromoted: true },
  { position: 2, team: 'CD Guarnizo C', points: 55, played: 26, won: 17, drawn: 4, lost: 5, goalsFor: 48, goalsAgainst: 25, goalDifference: 23, lastFiveResults: ['G', 'P', 'G', 'G', 'G'], isPromoted: true },
  { position: 3, team: 'Samano B', points: 50, played: 26, won: 15, drawn: 5, lost: 6, goalsFor: 44, goalsAgainst: 28, goalDifference: 16, lastFiveResults: ['G', 'E', 'G', 'P', 'G'], isPlayoff: true },
  { position: 4, team: 'EMF Meruelo', points: 46, played: 26, won: 14, drawn: 4, lost: 8, goalsFor: 40, goalsAgainst: 30, goalDifference: 10, lastFiveResults: ['P', 'G', 'G', 'E', 'G'], isPlayoff: true },
  { position: 5, team: 'Marina de Cudeyo', points: 42, played: 26, won: 12, drawn: 6, lost: 8, goalsFor: 38, goalsAgainst: 32, goalDifference: 6, lastFiveResults: ['E', 'G', 'P', 'G', 'E'] },
  { position: 6, team: 'Nueva Montaña', points: 38, played: 26, won: 11, drawn: 5, lost: 10, goalsFor: 35, goalsAgainst: 35, goalDifference: 0, lastFiveResults: ['P', 'P', 'G', 'G', 'E'] },
  { position: 7, team: 'Santoña CF', points: 35, played: 26, won: 10, drawn: 5, lost: 11, goalsFor: 33, goalsAgainst: 37, goalDifference: -4, lastFiveResults: ['G', 'E', 'P', 'P', 'G'] },
  { position: 8, team: 'CD Pontejos', points: 32, played: 26, won: 9, drawn: 5, lost: 12, goalsFor: 30, goalsAgainst: 38, goalDifference: -8, lastFiveResults: ['P', 'G', 'E', 'P', 'P'] },
  { position: 9, team: 'Atlético Laredo B', points: 28, played: 26, won: 8, drawn: 4, lost: 14, goalsFor: 28, goalsAgainst: 42, goalDifference: -14, lastFiveResults: ['P', 'P', 'G', 'P', 'E'] },
  { position: 10, team: 'CD Bezana B', points: 22, played: 26, won: 6, drawn: 4, lost: 16, goalsFor: 24, goalsAgainst: 48, goalDifference: -24, lastFiveResults: ['P', 'P', 'P', 'G', 'P'], isRelegated: true },
];

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
    if (!supabase) return fallbackClassification;

    const competition = await this.getActiveCompetition();
    if (!competition) return fallbackClassification;

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
      return fallbackClassification;
    }

    if (!standings || standings.length === 0) return fallbackClassification;

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
