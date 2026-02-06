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
  link: string;
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

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from resultados-futbol.com`);
    }

    const html = await response.text();
    console.log(`Page size: ${html.length} bytes`);

    const teams = parseClassification(html);

    if (teams.length === 0) {
      throw new Error(`No teams parsed. Tables found: ${(html.match(/<table/gi) || []).length}`);
    }

    console.log(`Parsed ${teams.length} teams`);

    const totalTeams = teams.length;
    let processedCount = 0;

    for (const t of teams) {
      try {
        console.log(`  ${t.position}. ${t.name} - ${t.points}pts (${t.played}J ${t.won}G ${t.drawn}E ${t.lost}P ${t.goalsFor}GF ${t.goalsAgainst}GC)`);

        const nameLower = t.name.toLowerCase();
        const isOurTeam = nameLower.includes('uni') && nameLower.includes('club');

        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .upsert({
            name: t.name,
            short_name: t.name,
            is_our_team: isOurTeam,
            rfcf_link: t.link || null,
          }, { onConflict: 'name', ignoreDuplicates: false })
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

function parseClassification(html: string): TeamData[] {
  const rows = html.match(/<tr[^>]*data-type\s*=\s*"total"[^>]*>[\s\S]*?<\/tr>/gi) || [];
  console.log(`Found ${rows.length} total-type rows`);

  if (rows.length === 0) {
    return fallbackParse(html);
  }

  const teams: TeamData[] = [];

  for (const row of rows) {
    const posMatch = row.match(/<th[^>]*>(\d+)<\/th>/);
    if (!posMatch) continue;
    const position = parseInt(posMatch[1]);

    const linkMatch = row.match(/<a\s+href="([^"]*)"[^>]*>([^<]+)<\/a>/);
    if (!linkMatch) continue;
    const link = linkMatch[1];
    const name = linkMatch[2].trim();
    if (!name || name.length < 2) continue;

    const pts = extractByClass(row, 'pts');
    const pj = extractByClass(row, 'pj');
    const win = extractByClass(row, 'win');
    const draw = extractByClass(row, 'draw');
    const lose = extractByClass(row, 'lose');

    const gfMatch = row.match(/<td\s+class="f"[^>]*>(\d+)<\/td>/);
    const gcMatch = row.match(/<td\s+class="c"[^>]*>(\d+)<\/td>/);
    const goalsFor = gfMatch ? parseInt(gfMatch[1]) : NaN;
    const goalsAgainst = gcMatch ? parseInt(gcMatch[1]) : NaN;

    if ([pts, pj, win, draw, lose, goalsFor, goalsAgainst].some(isNaN)) {
      console.log(`NaN for ${name}: pts=${pts} pj=${pj} w=${win} d=${draw} l=${lose} gf=${goalsFor} gc=${goalsAgainst}`);
      continue;
    }

    teams.push({
      position,
      name,
      link: link.startsWith('http') ? link : `https://www.resultados-futbol.com${link}`,
      points: pts,
      played: pj,
      won: win,
      drawn: draw,
      lost: lose,
      goalsFor,
      goalsAgainst,
    });
  }

  console.log(`Parsed ${teams.length} teams from data-type=total rows`);
  return teams;
}

function extractByClass(html: string, className: string): number {
  const dataMatch = html.match(new RegExp(`<td[^>]*class="${className}"[^>]*data-total="(\\d+)"`, 'i'));
  if (dataMatch) return parseInt(dataMatch[1]);

  const textMatch = html.match(new RegExp(`<td[^>]*class="${className}"[^>]*>(\\d+)<\\/td>`, 'i'));
  if (textMatch) return parseInt(textMatch[1]);

  return NaN;
}

function fallbackParse(html: string): TeamData[] {
  console.log('Using fallback parser');
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = html.match(tableRegex) || [];
  console.log(`Fallback: found ${tables.length} tables`);

  let classTable = '';
  for (const table of tables) {
    if (table.includes('Puntos') && table.includes('PJ')) {
      classTable = table;
      break;
    }
  }

  if (!classTable) return [];

  const rows = classTable.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  const teams: TeamData[] = [];

  for (const row of rows) {
    const posMatch = row.match(/<th[^>]*>(\d+)<\/th>/);
    if (!posMatch) continue;

    const linkMatch = row.match(/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/);
    if (!linkMatch) continue;

    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = cellRegex.exec(row)) !== null) {
      cells.push(m[1]);
    }

    const nums: number[] = [];
    for (const cell of cells) {
      const stripped = cell.replace(/<[^>]+>/g, '').trim();
      const n = parseInt(stripped);
      if (!isNaN(n) && stripped === String(n)) {
        nums.push(n);
      }
    }

    if (nums.length < 7) continue;

    teams.push({
      position: parseInt(posMatch[1]),
      name: linkMatch[2].trim(),
      link: linkMatch[1],
      points: nums[0],
      played: nums[1],
      won: nums[2],
      drawn: nums[3],
      lost: nums[4],
      goalsFor: nums[5],
      goalsAgainst: nums[6],
    });
  }

  return teams;
}
