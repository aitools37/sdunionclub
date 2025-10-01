import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Team {
  position: number;
  name: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

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

    console.log('Starting RFCF classification scrape...');

    // Get active competition
    const { data: competition, error: compError } = await supabase
      .from('competitions')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (compError || !competition) {
      throw new Error('No active competition found');
    }

    console.log('Active competition:', competition.name);

    // Construct RFCF URL
    const rfcfUrl = `https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=${competition.rfcf_competition_code}&codgrupo=${competition.rfcf_group_code}&cod_agrupacion=1`;
    
    console.log('Fetching from:', rfcfUrl);

    // Fetch the RFCF page
    const response = await fetch(rfcfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RFCF page: ${response.status}`);
    }

    const html = await response.text();
    console.log('HTML fetched, length:', html.length);

    // Parse the HTML to extract classification data
    const teams = parseClassificationTable(html);
    
    if (teams.length === 0) {
      throw new Error('No teams found in classification table');
    }

    console.log(`Found ${teams.length} teams`);

    // Store teams and standings in database
    const totalTeams = teams.length;
    for (const team of teams) {
      // Insert or update team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .upsert({
          name: team.name,
          short_name: team.name,
        }, {
          onConflict: 'name',
          ignoreDuplicates: false,
        })
        .select()
        .maybeSingle();

      if (teamError || !teamData) {
        console.error('Error upserting team:', team.name, teamError);
        continue;
      }

      // Determine position flags
      const isPromoted = team.position === 1;
      const isPlayoff = team.position >= 2 && team.position <= 3;
      const isRelegated = team.position > totalTeams - 3;

      // Insert or update standing
      const { error: standingError } = await supabase
        .from('classification_standings')
        .upsert({
          competition_id: competition.id,
          team_id: teamData.id,
          position: team.position,
          points: team.points,
          played: team.played,
          won: team.won,
          drawn: team.drawn,
          lost: team.lost,
          goals_for: team.goalsFor,
          goals_against: team.goalsAgainst,
          goal_difference: team.goalDifference,
          form: team.form || '',
          is_promoted: isPromoted,
          is_playoff: isPlayoff,
          is_relegated: isRelegated,
          scraped_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'competition_id,team_id',
        });

      if (standingError) {
        console.error('Error upserting standing:', team.name, standingError);
      }
    }

    console.log('Classification data updated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Classification data updated',
        teams: teams.length,
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
    console.error('Error in scrape function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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

function parseClassificationTable(html: string): Team[] {
  const teams: Team[] = [];
  
  try {
    // Look for table rows - RFCF uses specific patterns
    // This is a basic parser - may need adjustment based on actual HTML structure
    
    // Try to find the classification table
    const tableMatch = html.match(/<table[^>]*class=["']?[^"']*clasificacion[^"']*["']?[^>]*>([\s\S]*?)<\/table>/i);
    
    if (!tableMatch) {
      console.log('Classification table not found with class, trying alternate patterns...');
      // Try other patterns or extract all tables
      return extractFromAllTables(html);
    }

    const tableContent = tableMatch[1];
    const rowMatches = tableContent.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    
    let position = 0;
    for (const rowMatch of rowMatches) {
      const rowHtml = rowMatch[1];
      
      // Skip header rows
      if (rowHtml.includes('<th') || rowHtml.includes('Equipo') || rowHtml.includes('Puntos')) {
        continue;
      }
      
      // Extract cells
      const cells = Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi))
        .map(m => m[1].replace(/<[^>]+>/g, '').trim());
      
      if (cells.length >= 10) {
        position++;
        teams.push({
          position: position,
          name: cells[1] || `Team ${position}`,
          points: parseInt(cells[2]) || 0,
          played: parseInt(cells[3]) || 0,
          won: parseInt(cells[4]) || 0,
          drawn: parseInt(cells[5]) || 0,
          lost: parseInt(cells[6]) || 0,
          goalsFor: parseInt(cells[7]) || 0,
          goalsAgainst: parseInt(cells[8]) || 0,
          goalDifference: parseInt(cells[9]) || 0,
          form: cells[10] || '',
        });
      }
    }
  } catch (error) {
    console.error('Error parsing table:', error);
  }
  
  return teams;
}

function extractFromAllTables(html: string): Team[] {
  // Fallback: try to extract from any table that looks like classification data
  const teams: Team[] = [];
  
  // Look for numeric patterns that might indicate standings
  // This is a best-effort approach
  console.log('Using fallback extraction method');
  
  return teams;
}
