import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ParseBotTeam {
  position?: string | number;
  team?: string;
  points?: string | number;
  played?: string | number;
  won?: string | number;
  drawn?: string | number;
  lost?: string | number;
  goalsFor?: string | number;
  goalsAgainst?: string | number;
  goalDifference?: string | number;
  form?: string;
}

interface ParseBotResponse {
  success: boolean;
  data?: {
    teams?: ParseBotTeam[];
    [key: string]: any;
  };
  error?: string;
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
    const parseBotApiKey = Deno.env.get('PARSEBOT_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting RFCF classification scrape via Parse.bot...');

    if (!parseBotApiKey) {
      throw new Error('PARSEBOT_API_KEY not configured');
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

    console.log('Active competition:', competition.name);

    // Call Parse.bot API with the updated scraper ID
    const parseBotUrl = 'https://api.parse.bot/scraper/60aee77f-422f-429b-ba22-26756d847d81/run';
    
    console.log('Calling Parse.bot API...');

    const parseBotResponse = await fetch(parseBotUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': parseBotApiKey,
      },
      body: JSON.stringify({ count: 1 }),
    });

    if (!parseBotResponse.ok) {
      throw new Error(`Parse.bot API error: ${parseBotResponse.status} ${parseBotResponse.statusText}`);
    }

    const parseBotData: ParseBotResponse = await parseBotResponse.json();
    
    console.log('Parse.bot response received:', {
      success: parseBotData.success,
      hasData: !!parseBotData.data,
      hasTeams: !!parseBotData.data?.teams,
      teamsCount: parseBotData.data?.teams?.length || 0,
    });

    if (!parseBotData.success || !parseBotData.data?.teams) {
      throw new Error(parseBotData.error || 'No teams data received from Parse.bot');
    }

    const teams = parseBotData.data.teams;
    console.log(`Processing ${teams.length} teams...`);

    // Store teams and standings in database
    const totalTeams = teams.length;
    let processedCount = 0;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      
      // Extract and clean team data
      const teamName = String(team.team || `Team ${i + 1}`).trim();
      const position = parseInt(String(team.position || i + 1));
      const points = parseInt(String(team.points || 0));
      const played = parseInt(String(team.played || 0));
      const won = parseInt(String(team.won || 0));
      const drawn = parseInt(String(team.drawn || 0));
      const lost = parseInt(String(team.lost || 0));
      const goalsFor = parseInt(String(team.goalsFor || 0));
      const goalsAgainst = parseInt(String(team.goalsAgainst || 0));
      const goalDifference = parseInt(String(team.goalDifference || (goalsFor - goalsAgainst)));
      const form = String(team.form || '').slice(-5);

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
        console.error('Error upserting team:', teamName, teamError);
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
        console.error('Error upserting standing:', teamName, standingError);
      } else {
        processedCount++;
      }
    }

    console.log(`Classification data updated successfully: ${processedCount}/${teams.length} teams`);

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
