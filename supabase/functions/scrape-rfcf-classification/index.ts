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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
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
    const besoccerUrl = `https://es.besoccer.com/competicion/clasificacion/segunda_regional_cantabria/2026/${groupSlug}`;

    console.log(`Competition: ${competition.name} - ${competition.group_name} (${competition.season})`);
    console.log(`BeSoccer URL: ${besoccerUrl}`);

    const teams = await scrapeBeSoccer(besoccerUrl);

    if (teams.length === 0) {
      throw new Error(`Could not retrieve classification data from BeSoccer for ${competition.group_name}`);
    }

    console.log(`Found ${teams.length} teams in ${competition.group_name}`);

    const totalTeams = teams.length;
    let processedCount = 0;

    for (let i = 0; i < teams.length; i++) {
      const t = teams[i];

      try {
        console.log(`  ${t.position}. ${t.name} - ${t.points} pts (${t.played}J ${t.won}G ${t.drawn}E ${t.lost}P)`);

        const isOurTeam = t.name.toLowerCase().includes('uni') && t.name.toLowerCase().includes('club');

        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .upsert({
            name: t.name,
            short_name: t.name,
            is_our_team: isOurTeam,
          }, {
            onConflict: 'name',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (teamError || !teamData) {
          console.error('Error upserting team:', t.name, teamError);
          continue;
        }

        const isPromoted = t.position === 1;
        const isPlayoff = t.position >= 2 && t.position <= 3;
        const isRelegated = t.position > totalTeams - 3;

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
            form: t.form,
            is_promoted: isPromoted,
            is_playoff: isPlayoff,
            is_relegated: isRelegated,
            scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'competition_id,team_id',
          });

        if (standingError) {
          console.error('Error upserting standing:', t.name, standingError);
        } else {
          processedCount++;
        }
      } catch (teamError) {
        console.error(`Error processing team ${i + 1}:`, teamError);
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
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

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
  form: string;
}

async function scrapeBeSoccer(url: string): Promise<TeamData[]> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`BeSoccer returned ${response.status}`);
  }

  const html = await response.text();
  console.log('BeSoccer page size:', html.length, 'bytes');

  return parseBeSoccerHTML(html);
}

function parseBeSoccerHTML(html: string): TeamData[] {
  const teams: TeamData[] = [];

  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = html.match(tableRegex);

  if (!tables) {
    console.log('No tables found in BeSoccer HTML');
    return [];
  }

  let classTable = '';
  for (const table of tables) {
    if ((table.includes('PTS') || table.includes('Puntos')) &&
        (table.includes('PJ') || table.includes('PG')) &&
        (table.includes('GF') || table.includes('GC'))) {
      classTable = table;
      break;
    }
  }

  if (!classTable) {
    for (const table of tables) {
      const rowCount = (table.match(/<tr/gi) || []).length;
      if (rowCount >= 10) {
        classTable = table;
        break;
      }
    }
  }

  if (!classTable) {
    console.log('No classification table found');

    const divRegex = /class="[^"]*panel-body[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*panel-body)/gi;
    const sections = html.match(divRegex);
    if (sections) {
      console.log('Found', sections.length, 'panel sections');
    }

    return parseFromStructuredData(html);
  }

  const rows = classTable.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  console.log('Table rows found:', rows.length);

  for (const row of rows) {
    if (row.includes('<th')) continue;

    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(row)) !== null) {
      const text = cellMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\*\*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      cells.push(text);
    }

    if (cells.length < 8) continue;

    const posStr = cells[0].trim();
    const position = parseInt(posStr);
    if (isNaN(position)) continue;

    let name = '';
    for (const cell of cells) {
      const cleaned = cell.replace(/[0-9]/g, '').trim();
      if (cleaned.length > 3 && !/^[VDEW\s]+$/.test(cleaned)) {
        name = cleaned;
        break;
      }
    }

    if (!name) continue;

    const numbers: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      const num = parseInt(cells[i].trim());
      if (!isNaN(num) && cells[i].trim() === String(num)) {
        numbers.push(num);
      }
    }

    if (numbers.length < 8) continue;

    const formMatch = row.match(/([VDEW]\s*){3,}/);
    const form = formMatch ? formMatch[0].replace(/\s+/g, '') : '';

    teams.push({
      position: numbers[0],
      name,
      points: numbers[1],
      played: numbers[2],
      won: numbers[3],
      drawn: numbers[4],
      lost: numbers[5],
      goalsFor: numbers[6],
      goalsAgainst: numbers[7],
      form,
    });
  }

  if (teams.length > 0) {
    console.log('Parsed', teams.length, 'teams from BeSoccer table');
    return teams;
  }

  return parseFromStructuredData(html);
}

function parseFromStructuredData(html: string): TeamData[] {
  const teams: TeamData[] = [];

  const teamPattern = /(\d+)\s+\|\s+([^|]+?)\s+\[([^\]]+)\][^|]*\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)\s+\|\s+(\d+)/g;
  let match;

  while ((match = teamPattern.exec(html)) !== null) {
    const formMatch = match[0].match(/([VDEW]\s+){2,}/);

    teams.push({
      position: parseInt(match[1]),
      name: match[3].trim(),
      points: parseInt(match[4]),
      played: parseInt(match[5]),
      won: parseInt(match[6]),
      drawn: parseInt(match[7]),
      lost: parseInt(match[8]),
      goalsFor: parseInt(match[9]),
      goalsAgainst: parseInt(match[10]),
      form: formMatch ? formMatch[0].replace(/\s+/g, '') : '',
    });
  }

  if (teams.length > 0) {
    console.log('Parsed', teams.length, 'teams from structured data');
    return teams;
  }

  const linePattern = /\|\s*(\d{1,2})\s*\|\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s.']+?)(?:\s*\[|\s*\|)\s*(?:\[([^\]]+)\])?\s*[^|]*?\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)/g;

  while ((match = linePattern.exec(html)) !== null) {
    const name = (match[3] || match[2]).trim();
    if (!name || name.length < 3) continue;

    teams.push({
      position: parseInt(match[1]),
      name,
      points: parseInt(match[4]),
      played: parseInt(match[5]),
      won: parseInt(match[6]),
      drawn: parseInt(match[7]),
      lost: parseInt(match[8]),
      goalsFor: parseInt(match[9]),
      goalsAgainst: parseInt(match[10]),
      form: '',
    });
  }

  console.log('Fallback parsing found', teams.length, 'teams');
  return teams;
}
