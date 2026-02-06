import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const SIGUETULIGA_URL = 'https://www.siguetuliga.com/liga/cantabria-segunda-regional-grupo-b';

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

    console.log('Fetching classification from siguetuliga.com...');

    const teams = await scrapeSigueTuLiga();

    if (teams.length === 0) {
      throw new Error('Could not retrieve classification data');
    }

    console.log(`Found ${teams.length} teams`);

    const totalTeams = teams.length;
    let processedCount = 0;

    for (let i = 0; i < teams.length; i++) {
      const t = teams[i];

      try {
        const teamName = String(t.name).trim();
        const position = t.position;
        const points = t.points;
        const played = t.played;
        const won = t.won;
        const drawn = t.drawn;
        const lost = t.lost;
        const goalsFor = t.goalsFor;
        const goalsAgainst = t.goalsAgainst;
        const goalDifference = goalsFor - goalsAgainst;

        console.log(`  ${position}. ${teamName} - ${points} pts (${played}J ${won}G ${drawn}E ${lost}P)`);

        const isOurTeam = teamName.toLowerCase().includes('uni') && teamName.toLowerCase().includes('club');

        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .upsert({
            name: teamName,
            short_name: teamName,
            is_our_team: isOurTeam,
          }, {
            onConflict: 'name',
            ignoreDuplicates: false,
          })
          .select()
          .maybeSingle();

        if (teamError || !teamData) {
          console.error('Error upserting team:', teamName, teamError);
          continue;
        }

        const isPromoted = position === 1;
        const isPlayoff = position >= 2 && position <= 3;
        const isRelegated = position > totalTeams - 3;

        const { error: standingError } = await supabase
          .from('classification_standings')
          .upsert({
            competition_id: competition.id,
            team_id: teamData.id,
            position,
            points,
            played,
            won,
            drawn,
            lost,
            goals_for: goalsFor,
            goals_against: goalsAgainst,
            goal_difference: goalDifference,
            form: '',
            is_promoted: isPromoted,
            is_playoff: isPlayoff,
            is_relegated: isRelegated,
            scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'competition_id,team_id',
          });

        if (standingError) {
          console.error('Error upserting standing:', teamName, standingError);
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

async function scrapeSigueTuLiga(): Promise<any[]> {
  const response = await fetch(SIGUETULIGA_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`siguetuliga.com returned ${response.status}`);
  }

  const html = await response.text();
  console.log('Page size:', html.length, 'bytes');

  return parseSigueTuLigaHTML(html);
}

function parseSigueTuLigaHTML(html: string): any[] {
  const teams: any[] = [];

  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = html.match(tableRegex);

  if (!tables) {
    console.log('No tables found');
    return [];
  }

  let classTable = '';
  for (const table of tables) {
    if (table.includes('Equipo') && table.includes('GF') && table.includes('GC')) {
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
    console.log('Classification table not found');
    return [];
  }

  const rows = classTable.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  console.log('Table rows:', rows.length);

  for (const row of rows) {
    if (row.includes('<th')) continue;

    const cells: string[] = [];
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellMatch;

    while ((cellMatch = cellRegex.exec(row)) !== null) {
      const text = cellMatch[1].replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
      cells.push(text);
    }

    if (cells.length < 10) continue;

    const position = parseInt(cells[0]);
    const name = cells[1].trim();
    const points = parseInt(cells[2]);
    const played = parseInt(cells[3]);
    const won = parseInt(cells[4]);
    const drawn = parseInt(cells[5]);
    const lost = parseInt(cells[6]);
    const goalsFor = parseInt(cells[7]);
    const goalsAgainst = parseInt(cells[8]);

    if (isNaN(position) || !name) continue;

    teams.push({
      position,
      name,
      points,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
    });
  }

  console.log('Parsed', teams.length, 'teams');
  return teams;
}
