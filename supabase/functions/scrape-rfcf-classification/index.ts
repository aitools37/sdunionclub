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
    const url = `https://es.besoccer.com/competicion/clasificacion/segunda_regional_cantabria/2026/${groupSlug}`;

    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`BeSoccer returned HTTP ${response.status}`);
    }

    const html = await response.text();
    console.log(`Page size: ${html.length} bytes`);

    const teams = parseClassification(html);

    if (teams.length === 0) {
      throw new Error('No teams parsed from BeSoccer HTML');
    }

    console.log(`Parsed ${teams.length} teams`);

    const totalTeams = teams.length;
    let processedCount = 0;

    for (const t of teams) {
      try {
        console.log(`  ${t.position}. ${t.name} - ${t.points}pts (${t.played}J ${t.won}G ${t.drawn}E ${t.lost}P)`);

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
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = html.match(tableRegex) || [];
  console.log(`Found ${tables.length} tables`);

  let classTable = '';
  for (const table of tables) {
    if ((table.includes('PTS') || table.includes('Puntos')) &&
        (table.includes('PJ') || table.includes('PG')) &&
        table.includes('GF')) {
      classTable = table;
      break;
    }
  }

  if (!classTable) {
    for (const table of tables) {
      const rowCount = (table.match(/<tr/gi) || []).length;
      if (rowCount >= 10 && table.includes('<td')) {
        classTable = table;
        break;
      }
    }
  }

  if (!classTable) {
    console.log('No classification table found');
    return [];
  }

  const rows = classTable.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  console.log(`Table rows: ${rows.length}`);

  const teams: TeamData[] = [];
  let autoPosition = 0;

  for (const row of rows) {
    if (row.includes('<th')) continue;

    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let m;
    while ((m = cellRegex.exec(row)) !== null) {
      cells.push(m[1]);
    }

    if (cells.length < 8) continue;

    let name = '';
    let link = '';
    let nameIdx = -1;

    for (let i = 0; i < cells.length; i++) {
      const linkMatch = cells[i].match(/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/);
      if (linkMatch && linkMatch[2].trim().length > 2) {
        link = linkMatch[1];
        name = linkMatch[2].trim();
        nameIdx = i;
        break;
      }
    }

    if (!name || nameIdx < 0) {
      for (let i = 0; i < Math.min(cells.length, 4); i++) {
        const altMatch = cells[i].match(/alt="([^"]+)"/);
        if (altMatch && altMatch[1].trim().length > 2) {
          name = altMatch[1].trim();
          nameIdx = i;
          break;
        }
      }
    }

    if (!name || nameIdx < 0) continue;

    autoPosition++;
    const posText = strip(cells[0]);
    const posNum = parseInt(posText);
    if (!isNaN(posNum) && posNum > 0 && posNum <= 30) {
      autoPosition = posNum;
    }

    const stats = cells.slice(nameIdx + 1);
    if (stats.length < 7) continue;

    const points = parseInt(strip(stats[0]));
    const played = parseInt(strip(stats[1]));
    const won = parseInt(strip(stats[2]));
    const drawn = parseInt(strip(stats[3]));
    const lost = parseInt(strip(stats[4]));
    const goalsFor = parseInt(strip(stats[5]));
    const goalsAgainst = parseInt(strip(stats[6]));

    if ([points, played, won, drawn, lost, goalsFor, goalsAgainst].some(isNaN)) {
      console.log(`NaN in row for: ${name}, cells: ${stats.slice(0, 7).map(strip).join(', ')}`);
      continue;
    }

    if (played < 0 || won < 0 || drawn < 0 || lost < 0 || goalsFor < 0 || goalsAgainst < 0) {
      console.log(`Negative value in row for: ${name}`);
      continue;
    }

    teams.push({
      position: autoPosition,
      name,
      link: link.startsWith('http') ? link : link ? `https://es.besoccer.com${link}` : '',
      points,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
    });
  }

  if (teams.length > 20) {
    console.log(`${teams.length} rows found, keeping first 13 (Total only)`);
    return teams.slice(0, 13);
  }

  console.log(`Final: ${teams.length} teams parsed`);
  return teams;
}

function strip(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}
