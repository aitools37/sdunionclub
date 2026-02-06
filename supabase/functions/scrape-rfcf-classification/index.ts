import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const GROUP_MAP: Record<string, string> = {
  'Grupo A': 'grupo1',
  'Grupo B': 'grupo2',
  'Grupo C': 'grupo3',
  'Grupo D': 'grupo4',
};

interface TeamData {
  position: number;
  name: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
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

    const groupSlug = GROUP_MAP[competition.group_name] || 'grupo3';
    const seasonYear = competition.season.split('-')[1] || '2026';
    const url = `https://www.resultados-futbol.com/competicion/segunda_regional_cantabria/${seasonYear}/${groupSlug}/clasificacion`;

    console.log(`Fetching: ${url}`);

    const teams = await scrapeResultadosFutbol(url);

    if (teams.length === 0) {
      throw new Error(`No teams found for ${competition.group_name}. URL: ${url}`);
    }

    console.log(`Found ${teams.length} teams`);

    const totalTeams = teams.length;
    let processedCount = 0;

    for (const t of teams) {
      try {
        console.log(`  ${t.position}. ${t.name} - ${t.points}pts (${t.played}J ${t.won}G ${t.drawn}E ${t.lost}P ${t.goalsFor}GF ${t.goalsAgainst}GC)`);

        const nameLower = t.name.toLowerCase();
        const isOurTeam = nameLower.includes('uni') && nameLower.includes('club');

        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .upsert({ name: t.name, short_name: t.name, is_our_team: isOurTeam }, {
            onConflict: 'name',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (teamError || !teamData) {
          console.error('Team upsert error:', t.name, teamError);
          continue;
        }

        const { error: standingError } = await supabase
          .from('classification_standings')
          .upsert({
            competition_id: competition.id,
            team_id: teamData.id,
            position: t.position,
            points: t.points,
            played: t.played,
            won: t.won,
            drawn: t.drawn,
            lost: t.lost,
            goals_for: t.goalsFor,
            goals_against: t.goalsAgainst,
            goal_difference: t.goalsFor - t.goalsAgainst,
            form: '',
            is_promoted: t.position === 1,
            is_playoff: t.position >= 2 && t.position <= 3,
            is_relegated: t.position > totalTeams - 3,
            scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'competition_id,team_id' });

        if (standingError) {
          console.error('Standing upsert error:', t.name, standingError);
        } else {
          processedCount++;
        }
      } catch (e) {
        console.error(`Error processing ${t.name}:`, e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Classification updated: ${processedCount}/${totalTeams} teams`,
        teams: processedCount,
        total: totalTeams,
        group: competition.group_name,
        season: competition.season,
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

async function scrapeResultadosFutbol(url: string): Promise<TeamData[]> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9',
      'Cookie': 'euconsent-v2=accept',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from resultados-futbol.com`);
  }

  const html = await response.text();
  console.log('Page size:', html.length, 'bytes');

  return parseHTML(html);
}

function parseHTML(html: string): TeamData[] {
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = html.match(tableRegex) || [];

  console.log(`Found ${tables.length} tables`);

  let classTable = '';
  for (const table of tables) {
    if (table.includes('Puntos') && table.includes('PJ') && table.includes('GF')) {
      classTable = table;
      break;
    }
  }

  if (!classTable) {
    for (const table of tables) {
      const rows = (table.match(/<tr/gi) || []).length;
      if (rows >= 14 && table.includes('<td')) {
        classTable = table;
        break;
      }
    }
  }

  if (!classTable) {
    console.log('No classification table found in HTML');
    return [];
  }

  const rows = classTable.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  console.log(`Table has ${rows.length} rows`);

  const teams: TeamData[] = [];

  for (const row of rows) {
    if (row.includes('<th')) continue;

    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let match;
    while ((match = cellRegex.exec(row)) !== null) {
      cells.push(match[1]);
    }

    if (cells.length < 9) continue;

    const position = parseInt(stripHTML(cells[0]));
    if (isNaN(position) || position < 1 || position > 30) continue;

    const nameCell = cells[1];
    let name = '';

    const linkMatch = nameCell.match(/<a[^>]*>([^<]+)<\/a>/);
    if (linkMatch) {
      name = linkMatch[1].trim();
    }

    if (!name) {
      const altMatch = nameCell.match(/alt="([^"]+)"/);
      if (altMatch) {
        name = altMatch[1].trim();
      }
    }

    if (!name) {
      name = stripHTML(nameCell).trim();
    }

    if (!name || name.length < 2) continue;

    const points = parseInt(stripHTML(cells[2]));
    const played = parseInt(stripHTML(cells[3]));
    const won = parseInt(stripHTML(cells[4]));
    const drawn = parseInt(stripHTML(cells[5]));
    const lost = parseInt(stripHTML(cells[6]));
    const goalsFor = parseInt(stripHTML(cells[7]));
    const goalsAgainst = parseInt(stripHTML(cells[8]));

    if ([points, played, won, drawn, lost, goalsFor, goalsAgainst].some(isNaN)) {
      console.log(`Skipping row with NaN values: ${name}`);
      continue;
    }

    teams.push({ position, name, points, played, won, drawn, lost, goalsFor, goalsAgainst });
  }

  if (teams.length > 13) {
    console.log(`Found ${teams.length} rows, trimming to first 13 (Total table only)`);
    return teams.slice(0, 13);
  }

  console.log(`Parsed ${teams.length} teams`);
  return teams;
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}
