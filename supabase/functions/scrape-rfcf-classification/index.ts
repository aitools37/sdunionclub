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

    console.log('🚀 Starting RFCF classification scrape via Parse.bot...');
    console.log('🔑 API Key present:', !!parseBotApiKey);
    console.log('🔑 API Key length:', parseBotApiKey?.length || 0);

    if (!parseBotApiKey) {
      throw new Error('PARSEBOT_API_KEY not configured in Supabase secrets');
    }

    // Get active competition
    const { data: competition, error: compError } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (compError || !competition) {
      throw new Error('No active competition found');
    }

    console.log('🏆 Active competition:', competition.name);

    // Call Parse.bot API
    const parseBotUrl = 'https://api.parse.bot/scraper/60aee77f-422f-429b-ba22-26756d847d81/run';
    
    console.log('📡 Calling Parse.bot API...');
    console.log('📡 URL:', parseBotUrl);

    const parseBotResponse = await fetch(parseBotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': parseBotApiKey,
      },
      body: JSON.stringify({ count: 1 }),
    });

    console.log('📥 Parse.bot response status:', parseBotResponse.status);

    if (!parseBotResponse.ok) {
      const errorText = await parseBotResponse.text();
      console.error('❌ Parse.bot error response:', errorText);
      throw new Error(`Parse.bot API error: ${parseBotResponse.status} - ${errorText}`);
    }

    const parseBotData = await parseBotResponse.json();
    
    console.log('📦 Parse.bot full response:', JSON.stringify(parseBotData, null, 2));

    // Parse.bot puede devolver diferentes estructuras de datos
    // Intentemos detectar automáticamente la estructura
    let teams: any[] = [];
    
    // Caso 1: data.teams
    if (parseBotData.data?.teams && Array.isArray(parseBotData.data.teams)) {
      teams = parseBotData.data.teams;
      console.log('✅ Found teams in data.teams');
    }
    // Caso 2: results (array directo)
    else if (parseBotData.results && Array.isArray(parseBotData.results)) {
      teams = parseBotData.results;
      console.log('✅ Found teams in results');
    }
    // Caso 3: data es array directo
    else if (Array.isArray(parseBotData.data)) {
      teams = parseBotData.data;
      console.log('✅ Found teams in data (array)');
    }
    // Caso 4: respuesta es array directo
    else if (Array.isArray(parseBotData)) {
      teams = parseBotData;
      console.log('✅ Found teams in root (array)');
    }
    // Caso 5: el primer campo del objeto es un array
    else {
      const firstKey = Object.keys(parseBotData)[0];
      if (firstKey && Array.isArray(parseBotData[firstKey])) {
        teams = parseBotData[firstKey];
        console.log(`✅ Found teams in ${firstKey}`);
      }
    }

    if (teams.length === 0) {
      console.error('❌ No teams found in Parse.bot response');
      throw new Error('No teams data received from Parse.bot');
    }

    console.log(`📊 Processing ${teams.length} teams...`);
    console.log('📊 First team sample:', JSON.stringify(teams[0], null, 2));

    // Detectar los nombres de los campos automáticamente
    const firstTeam = teams[0];
    const fieldMapping = detectFieldMapping(firstTeam);
    console.log('🗺️ Field mapping detected:', fieldMapping);

    // Store teams and standings in database
    const totalTeams = teams.length;
    let processedCount = 0;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      
      try {
        // Extract and clean team data usando el mapping detectado
        const teamName = String(team[fieldMapping.name] || `Team ${i + 1}`).trim();
        const position = parseInt(String(team[fieldMapping.position] || i + 1));
        const points = parseInt(String(team[fieldMapping.points] || 0));
        const played = parseInt(String(team[fieldMapping.played] || 0));
        const won = parseInt(String(team[fieldMapping.won] || 0));
        const drawn = parseInt(String(team[fieldMapping.drawn] || 0));
        const lost = parseInt(String(team[fieldMapping.lost] || 0));
        const goalsFor = parseInt(String(team[fieldMapping.goalsFor] || 0));
        const goalsAgainst = parseInt(String(team[fieldMapping.goalsAgainst] || 0));
        const goalDifference = parseInt(String(team[fieldMapping.goalDifference] || (goalsFor - goalsAgainst)));
        const form = String(team[fieldMapping.form] || '').slice(-5);

        console.log(`  ${position}. ${teamName} - ${points} pts`);

        // Check if this is S.D. Union Club
        const isOurTeam = teamName.toLowerCase().includes('union');

        // Insert or update team
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
          console.error('  ❌ Error upserting team:', teamName, teamError);
          continue;
        }

        // Determine position flags
        const isPromoted = position === 1;
        const isPlayoff = position >= 2 && position <= 3;
        const isRelegated = position > totalTeams - 3;

        // Insert or update standing
        const { error: standingError } = await supabase
          .from('classification_standings')
          .upsert({
            competition_id: competition.id,
            team_id: teamData.id,
            position: position,
            points: points,
            played: played,
            won: won,
            drawn: drawn,
            lost: lost,
            goals_for: goalsFor,
            goals_against: goalsAgainst,
            goal_difference: goalDifference,
            form: form,
            is_promoted: isPromoted,
            is_playoff: isPlayoff,
            is_relegated: isRelegated,
            scraped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'competition_id,team_id',
          });

        if (standingError) {
          console.error('  ❌ Error upserting standing:', teamName, standingError);
        } else {
          processedCount++;
        }
      } catch (teamError) {
        console.error(`  ❌ Error processing team ${i + 1}:`, teamError);
      }
    }

    console.log(`✅ Classification data updated: ${processedCount}/${teams.length} teams`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Classification data updated from RFCF via Parse.bot',
        teams: processedCount,
        total: teams.length,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ Error in scrape function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

// Detecta automáticamente los nombres de los campos en el objeto
function detectFieldMapping(obj: any): Record<string, string> {
  const keys = Object.keys(obj).map(k => k.toLowerCase());
  
  return {
    position: findKey(obj, ['position', 'pos', 'rank', 'ranking', 'posicion']),
    name: findKey(obj, ['team', 'name', 'equipo', 'club', 'teamname', 'team_name']),
    points: findKey(obj, ['points', 'pts', 'puntos', 'pt']),
    played: findKey(obj, ['played', 'pj', 'matches', 'games', 'partidos', 'partidosjugados']),
    won: findKey(obj, ['won', 'w', 'g', 'wins', 'ganados', 'victories']),
    drawn: findKey(obj, ['drawn', 'd', 'e', 'draws', 'ties', 'empates', 'empatados']),
    lost: findKey(obj, ['lost', 'l', 'p', 'losses', 'perdidos', 'defeats']),
    goalsFor: findKey(obj, ['goalsfor', 'gf', 'golesfavor', 'golesmarcados', 'for', 'golesafavor']),
    goalsAgainst: findKey(obj, ['goalsagainst', 'ga', 'gc', 'golescontra', 'golesrecibidos', 'against', 'golesencontra']),
    goalDifference: findKey(obj, ['goaldifference', 'gd', 'dif', 'diff', 'difference', 'diferencia']),
    form: findKey(obj, ['form', 'streak', 'racha', 'ultimos', 'recent']),
  };
}

function findKey(obj: any, possibilities: string[]): string {
  const keys = Object.keys(obj);
  for (const possibility of possibilities) {
    const found = keys.find(k => k.toLowerCase().replace(/[_\s-]/g, '') === possibility.replace(/[_\s-]/g, ''));
    if (found) return found;
  }
  // Si no encuentra, devolver el primer candidato como fallback
  return possibilities[0];
}
