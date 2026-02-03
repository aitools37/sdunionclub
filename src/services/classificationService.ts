import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Modificado: Inicializar Supabase solo si las claves están presentes,
// y usar fallback si no lo están.
let supabase: ReturnType<typeof createClient> | null = null;
let useFallback = true;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    useFallback = false; // Solo usar fallback si no se pudo inicializar Supabase
    // Comprobar la conexión básica
    const { error } = await supabase.from('competitions').select('id').limit(1).maybeSingle();
    if (error) {
      console.error('Supabase connection test failed:', error);
      useFallback = true;
      supabase = null; // Reset supabase client if connection fails
    }
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    useFallback = true;
    supabase = null;
  }
} else {
  console.warn('Supabase environment variables not provided. Falling back to mock data.');
}


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

// Fallback data for classification
const fallbackClassification: ClassificationTeam[] = [
  {
    position: 1, team: 'Racing Santander B', points: 45, played: 20, won: 14, drawn: 3, lost: 3, goalsFor: 40, goalsAgainst: 15, goalDifference: 25, lastFiveResults: ['G', 'G', 'E', 'P', 'G'], isPromoted: true
  },
  {
    position: 2, team: 'S.D. Unión Club', points: 42, played: 20, won: 13, drawn: 3, lost: 4, goalsFor: 38, goalsAgainst: 18, goalDifference: 20, lastFiveResults: ['G', 'G', 'P', 'G', 'G'], isPromoted: true
  },
  {
    position: 3, team: 'CD Laredo', points: 39, played: 20, won: 12, drawn: 3, lost: 5, goalsFor: 35, goalsAgainst: 20, goalDifference: 15, lastFiveResults: ['G', 'E', 'G', 'G', 'P'], isPlayoff: true
  },
  {
    position: 4, team: 'Gimnástica de Torrelavega', points: 36, played: 20, won: 11, drawn: 3, lost: 6, goalsFor: 32, goalsAgainst: 22, goalDifference: 10, lastFiveResults: ['E', 'P', 'G', 'E', 'G']
  },
  {
    position: 5, team: 'UD Samano', points: 33, played: 20, won: 10, drawn: 3, lost: 7, goalsFor: 30, goalsAgainst: 25, goalDifference: 5, lastFiveResults: ['P', 'G', 'G', 'E', 'P']
  },
  {
    position: 16, team: 'SD Cayón', points: 15, played: 20, won: 4, drawn: 3, lost: 13, goalsFor: 18, goalsAgainst: 38, goalDifference: -20, isRelegated: true
  },
];

export const classificationService = {
  async getActiveCompetition(): Promise<Competition | null> {
    if (useFallback || !supabase) {
      // Provide a fallback competition if Supabase is not available
      return {
        id: 'fallback-competition-id',
        name: 'Segunda Regional',
        season: '2025-2026',
        group_name: 'Grupo Cántabro',
        rfcf_competition_code: 'XXXXX',
        rfcf_group_code: 'XXXXX',
        is_active: true
      };
    }

    try {
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
    } catch (err) {
      console.error('Error in getActiveCompetition:', err);
      return null;
    }
  },

  async getClassification(): Promise<ClassificationTeam[]> {
    if (useFallback || !supabase) {
      return fallbackClassification;
    }

    try {
      // Changed query to use 'teams' and 'competitions' directly if they are linked tables
      const { data: standings, error } = await supabase
        .from('classification_standings')
        .select(`
          *,
          team:teams(name, is_our_team, rfcf_link),
          competition:competitions(*)
        `)
        .eq('competition.is_active', true) // Ensure we only get standings for the active competition
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching classification:', error);
        // In case of error, fall back to mock data
        return fallbackClassification;
      }

      if (!standings || standings.length === 0) {
        return fallbackClassification; // Return fallback if no data
      }

      return standings.map(standing => {
        const formString = standing.form || '';
        const lastFiveResults = formString
          .slice(-5)
          .split('')
          .map(char => {
            switch (char.toUpperCase()) {
              case 'W':
              case 'G': return 'G'; // Win
              case 'L':
              case 'P': return 'P'; // Loss
              case 'D':
              case 'E': return 'E'; // Draw
              default: return '?'; // Unknown
            }
          });

        return {
          position: standing.position,
          team: standing.team?.name || 'Unknown Team', // Handle cases where team might not be linked
          points: standing.points,
          played: standing.played,
          won: standing.won,
          drawn: standing.drawn,
          lost: standing.lost,
          goalsFor: standing.goals_for,
          goalsAgainst: standing.goals_against,
          goalDifference: standing.goal_difference,
          lastFiveResults: lastFiveResults.length > 0 ? lastFiveResults : Array(5).fill('?'),
          isPromoted: standing.is_promoted,
          isPlayoff: standing.is_playoff,
          isRelegated: standing.is_relegated,
          link: standing.team?.rfcf_link || undefined,
        };
      });
    } catch (err) {
      console.error('Unexpected error in getClassification:', err);
      return fallbackClassification; // Catch any unexpected errors
    }
  },

  async triggerScrape(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (useFallback || !supabase) {
      return { success: false, error: 'Supabase not available for scraping' };
    }

    try {
      // Ensure the Supabase URL is correctly fetched from environment variables
      const currentSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const currentSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!currentSupabaseUrl || !currentSupabaseAnonKey) {
        return { success: false, error: 'Supabase URL or Anon Key missing for scraping trigger' };
      }

      const response = await fetch(
        `${currentSupabaseUrl}/functions/v1/scrape-rfcf-classification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSupabaseAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error triggering scrape:', error);
      if (error instanceof Error) {
        return { success: false, error: error.message };
      } else {
        return { success: false, error: 'An unknown error occurred during scrape trigger.' };
      }
    }
  },

  async getLastUpdateTime(): Promise<Date | null> {
    if (useFallback || !supabase) {
      return null; // Cannot determine last update time if not connected
    }

    try {
      const { data, error } = await supabase
        .from('classification_standings')
        .select('scraped_at')
        .order('scraped_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data || !data.scraped_at) {
        return null;
      }

      return new Date(data.scraped_at);
    } catch (err) {
      console.error('Error fetching last update time:', err);
      return null;
    }
  },
};

