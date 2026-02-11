import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const GROUP_MAP: Record<string, string> = {
  'Grupo A': 'grupo1',
  'Grupo B': 'grupo2',
  'Grupo C': 'grupo3',
  'Grupo D': 'grupo4',
};

interface ParsedMatch {
  matchday: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'finished' | 'postponed';
}

const OUR_TEAM_PATTERNS = ['sd unión club', 'sd union club', 'unión club', 'union club', 's.d. unión', 's.d. union', 'sduc astillero', 'sduc-astillero'];

function isOurTeam(name: string): boolean {
  const lower = name.toLowerCase();
  return OUR_TEAM_PATTERNS.some(p => lower.includes(p));
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: competition, error: compError } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (compError || !competition) {
      throw new Error('No active competition found');
    }

    const { data: ourTeam } = await supabase
      .from('teams')
      .select('*')
      .eq('is_our_team', true)
      .maybeSingle();

    const groupSlug = GROUP_MAP[competition.group_name] || 'grupo3';
    const seasonYear = competition.season.split('-')[1] || '2026';

    console.log(`Scraping calendar: ${competition.name} ${competition.group_name} ${competition.season}`);

    let allMatches: ParsedMatch[] = [];

    for (let jornada = 1; jornada <= 26; jornada++) {
      try {
        const url = `https://www.resultados-futbol.com/competicion/segunda_regional_cantabria/${seasonYear}/${groupSlug}/jornada${jornada}`;

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9',
          },
        });

        if (!response.ok) {
          console.log(`J${jornada}: HTTP ${response.status}`);
          continue;
        }

        const html = await response.text();
        const matches = parseJornadaPage(html, jornada);
        console.log(`J${jornada}: ${matches.length} matches`);
        allMatches.push(...matches);

        await new Promise(r => setTimeout(r, 250));
      } catch (e) {
        console.warn(`J${jornada} error:`, e);
      }
    }

    const ourMatches = allMatches.filter(m => isOurTeam(m.homeTeam) || isOurTeam(m.awayTeam));
    console.log(`Total: ${allMatches.length} matches, ours: ${ourMatches.length}`);

    const matchesToSave = ourMatches.length > 0 ? ourMatches : allMatches;
    let processedCount = 0;

    for (const match of matchesToSave) {
      try {
        const ourHome = isOurTeam(match.homeTeam);
        const opponent = ourHome ? match.awayTeam : match.homeTeam;

        const { error: matchError } = await supabase
          .from('matches')
          .upsert({
            competition_id: competition.id,
            team_id: ourTeam?.id || null,
            opponent: opponent.trim(),
            match_date: match.date,
            match_time: match.time,
            venue: ourHome ? 'La Planchada' : 'Campo visitante',
            is_home: ourHome,
            home_score: match.homeScore,
            away_score: match.awayScore,
            status: match.status,
            matchday: match.matchday,
            scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'competition_id,match_date,opponent',
          });

        if (matchError) {
          console.error(`Error: ${opponent}:`, matchError);
        } else {
          processedCount++;
        }
      } catch (e) {
        console.error('Match error:', e);
      }
    }

    console.log(`Done: ${processedCount}/${matchesToSave.length} matches saved`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Calendario actualizado: ${processedCount} partidos`,
        matches: processedCount,
        total: matchesToSave.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseJornadaPage(html: string, matchday: number): ParsedMatch[] {
  const matches: ParsedMatch[] = [];

  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];

  for (const row of rows) {
    const links = row.match(/<a[^>]*>([^<]+)<\/a>/gi) || [];
    const teamNames: string[] = [];

    for (const link of links) {
      const nameMatch = link.match(/>([^<]+)</);
      if (!nameMatch) continue;
      const name = nameMatch[1].trim();
      if (name.length > 2 && !name.match(/^\d/) && !name.toLowerCase().includes('jornada') && !name.includes('.com')) {
        teamNames.push(name);
      }
    }

    if (teamNames.length < 2) continue;

    const scoreMatch = row.match(/>(\d+)\s*-\s*(\d+)</);

    let date = '';
    let time = '17:00';

    const isoMatch = row.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (isoMatch) {
      date = `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
      time = `${isoMatch[4]}:${isoMatch[5]}`;
    } else {
      const slashDate = row.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (slashDate) {
        date = `${slashDate[3]}-${slashDate[2].padStart(2, '0')}-${slashDate[1].padStart(2, '0')}`;
      }
      const timeMatch = row.match(/(\d{1,2}:\d{2})/);
      if (timeMatch) {
        time = timeMatch[1];
      }
    }

    const homeTeam = teamNames[0];
    const awayTeam = teamNames[teamNames.length >= 2 ? 1 : 0];

    if (homeTeam === awayTeam) continue;

    matches.push({
      matchday,
      date,
      time,
      homeTeam,
      awayTeam,
      homeScore: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
      awayScore: scoreMatch ? parseInt(scoreMatch[2]) : undefined,
      status: scoreMatch ? 'finished' : (date ? 'scheduled' : 'scheduled'),
    });
  }

  return matches;
}
