import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Player {
  id: string;
  team_slug: string;
  first_name: string;
  last_name: string;
  display_name: string;
  position: string;
  shirt_number: number | null;
  sort_order: number;
}

export interface Staff {
  id: string;
  team_slug: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  sort_order: number;
}

export type PositionGroup = 'POR' | 'DEF' | 'MED' | 'DEL' | '';

export const POSITION_LABELS: Record<string, string> = {
  POR: 'Porteros',
  DEF: 'Defensas',
  MED: 'Centrocampistas',
  DEL: 'Delanteros',
  '': 'Otros',
};

export const POSITION_SHORT: Record<string, string> = {
  POR: 'POR',
  DEF: 'DEF',
  MED: 'MED',
  DEL: 'DEL',
  '': '',
};

export const playerService = {
  async getPlayers(teamSlug: string): Promise<Player[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_slug', teamSlug)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    return data || [];
  },

  async getStaff(teamSlug: string): Promise<Staff[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('team_slug', teamSlug)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching staff:', error);
      return [];
    }

    return data || [];
  },

  groupByPosition(players: Player[]): Record<string, Player[]> {
    const order: string[] = ['POR', 'DEF', 'MED', 'DEL', ''];
    const groups: Record<string, Player[]> = {};

    for (const pos of order) {
      const filtered = players.filter(p => p.position === pos);
      if (filtered.length > 0) {
        groups[pos] = filtered;
      }
    }

    return groups;
  },
};
