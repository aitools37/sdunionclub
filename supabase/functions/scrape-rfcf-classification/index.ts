import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
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
    const parseBotApiKey = Deno.env.get('PARSEBOT_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: competition, error: compError } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (compError || !competition) {
      throw new Error('No active competition found');
    }

    const rfcfUrl = `https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=${competition.rfcf_competition_code}&codgrupo=${competition.rfcf_group_code}&cod_agrupacion=1`;

    console.log('RFCF URL:', rfcfUrl);

    let teams: any[] = [];

    if (parseBotApiKey) {
      try {
        teams = await fetchFromParseBot(parseBotApiKey, rfcfUrl);
        console.log('Parse.bot returned', teams.length, 'teams');
      } catch (e) {
        console.error('Parse.bot failed:', e);
        console.log('Falling back to direct RFCF scrape...');
      }
    }

    if (teams.length === 0) {
      teams = await scrapeRFCFDirectly(rfcfUrl);
      console.log('Direct scrape returned', teams.length, 'teams');
    }

    if (teams.length === 0) {
      throw new Error('Could not retrieve classification data from any source');
    }

    const totalTeams = teams.length;
    let processedCount = 0;

    for (let i = 0; i < teams.length; i++) {
      const t = teams[i];

      try {
        const teamName = String(t.name || `Team ${i + 1}`).trim();
        const position = parseInt(String(t.position || i + 1));
        const points = parseInt(String(t.points || 0));
        const played = parseInt(String(t.played || 0));
        const won = parseInt(String(t.won || 0));
        const drawn = parseInt(String(t.drawn || 0));
        const lost = parseInt(String(t.lost || 0));
        const goalsFor = parseInt(String(t.goalsFor || 0));
        const goalsAgainst = parseInt(String(t.goalsAgainst || 0));
        const goalDifference = goalsFor - goalsAgainst;
        const form = String(t.form || '');

        console.log(`  ${position}. ${teamName} - ${points} pts`);

        const isOurTeam = teamName.toLowerCase().includes('union');

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
            form,
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

async function fetchFromParseBot(apiKey: string, rfcfUrl: string): Promise<any[]> {
  const parseBotUrl = 'https://api.parse.bot/scraper/60aee77f-422f-429b-ba22-26756d847d81/run';

  const response = await fetch(parseBotUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ url: rfcfUrl, count: 1 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Parse.bot ${response.status}: ${errText}`);
  }

  const data = await response.json();
  console.log('Parse.bot raw response keys:', Object.keys(data));

  let rawTeams: any[] = [];

  if (data.data?.teams && Array.isArray(data.data.teams)) {
    rawTeams = data.data.teams;
  } else if (data.results && Array.isArray(data.results)) {
    rawTeams = data.results;
  } else if (Array.isArray(data.data)) {
    rawTeams = data.data;
  } else if (Array.isArray(data)) {
    rawTeams = data;
  } else {
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key]) && data[key].length > 3) {
        rawTeams = data[key];
        break;
      }
    }
  }

  if (rawTeams.length === 0) return [];

  console.log('Parse.bot first team sample:', JSON.stringify(rawTeams[0]));

  const mapping = detectFieldMapping(rawTeams[0]);
  return rawTeams.map((t: any, i: number) => ({
    position: t[mapping.position] || i + 1,
    name: t[mapping.name] || `Team ${i + 1}`,
    points: t[mapping.points] || 0,
    played: t[mapping.played] || 0,
    won: t[mapping.won] || 0,
    drawn: t[mapping.drawn] || 0,
    lost: t[mapping.lost] || 0,
    goalsFor: t[mapping.goalsFor] || 0,
    goalsAgainst: t[mapping.goalsAgainst] || 0,
    form: t[mapping.form] || '',
  }));
}

async function scrapeRFCFDirectly(rfcfUrl: string): Promise<any[]> {
  console.log('Fetching RFCF page directly...');

  const response = await fetch(rfcfUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`RFCF returned ${response.status}`);
  }

  const html = await response.text();
  console.log('RFCF page size:', html.length, 'bytes');

  return parseRFCFClassificationHTML(html);
}

function parseRFCFClassificationHTML(html: string): any[] {
  const teams: any[] = [];

  const tableMatch = html.match(/<table[^>]*class="[^"]*tabla_resultados[^"]*"[^>]*>([\s\S]*?)<\/table>/i)
    || html.match(/<table[^>]*id="[^"]*clasif[^"]*"[^>]*>([\s\S]*?)<\/table>/i)
    || html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);

  if (!tableMatch) {
    console.log('No classification table found in HTML');
    const snippet = html.substring(0, 2000);
    console.log('HTML start:', snippet);
    return [];
  }

  const tableHtml = Array.isArray(tableMatch) ? findClassificationTable(tableMatch) : tableMatch[1];
  if (!tableHtml) return [];

  const rows = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  console.log('Found', rows.length, 'rows in table');

  let dataRowStart = 0;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('<th')) {
      dataRowStart = i + 1;
    }
  }

  for (let i = dataRowStart; i < rows.length; i++) {
    const row = rows[i];
    const cells = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || []).map(
      (cell: string) => cell.replace(/<[^>]+>/g, '').trim()
    );

    if (cells.length < 8) continue;

    const position = parseInt(cells[0]) || (teams.length + 1);
    const name = cells[1]?.trim();

    if (!name || name === '') continue;

    teams.push({
      position,
      name,
      points: parseInt(cells[2]) || 0,
      played: parseInt(cells[3]) || 0,
      won: parseInt(cells[4]) || 0,
      drawn: parseInt(cells[5]) || 0,
      lost: parseInt(cells[6]) || 0,
      goalsFor: parseInt(cells[7]) || 0,
      goalsAgainst: parseInt(cells[8]) || 0,
      form: '',
    });
  }

  console.log('Parsed', teams.length, 'teams from RFCF HTML');
  return teams;
}

function findClassificationTable(tables: string[]): string | null {
  for (const table of tables) {
    const rowCount = (table.match(/<tr/gi) || []).length;
    if (rowCount >= 10 && (table.includes('Equipo') || table.includes('equipo') || table.includes('Puntos') || table.includes('PJ') || table.includes('Pts'))) {
      return table;
    }
  }
  for (const table of tables) {
    const rowCount = (table.match(/<tr/gi) || []).length;
    if (rowCount >= 10) return table;
  }
  return null;
}

function detectFieldMapping(obj: any): Record<string, string> {
  return {
    position: findKey(obj, ['position', 'pos', 'rank', 'posicion']),
    name: findKey(obj, ['team', 'name', 'equipo', 'club', 'teamname', 'team_name']),
    points: findKey(obj, ['points', 'pts', 'puntos']),
    played: findKey(obj, ['played', 'pj', 'matches', 'games', 'partidos']),
    won: findKey(obj, ['won', 'w', 'g', 'wins', 'ganados']),
    drawn: findKey(obj, ['drawn', 'd', 'e', 'draws', 'empates']),
    lost: findKey(obj, ['lost', 'l', 'p', 'losses', 'perdidos']),
    goalsFor: findKey(obj, ['goalsfor', 'gf', 'golesfavor']),
    goalsAgainst: findKey(obj, ['goalsagainst', 'ga', 'gc', 'golescontra']),
    form: findKey(obj, ['form', 'streak', 'racha', 'ultimos']),
  };
}

function findKey(obj: any, possibilities: string[]): string {
  const keys = Object.keys(obj);
  for (const possibility of possibilities) {
    const found = keys.find(k => k.toLowerCase().replace(/[_\s-]/g, '') === possibility.replace(/[_\s-]/g, ''));
    if (found) return found;
  }
  return possibilities[0];
}
