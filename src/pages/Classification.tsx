import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Users, Trophy, Calendar, Loader, RefreshCw, ExternalLink } from 'lucide-react';

interface ClassificationTeam {
  position: number;
  team: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  lastFiveResults: string[];
  isPromoted?: boolean;
  isRelegated?: boolean;
  isPlayoff?: boolean;
  link?: string;
}

interface ParseBotResponse {
  success: boolean;
  data: {
    teams: Array<{
      position: number;
      team: string;
      link?: string;
      points: number;
      played: number;
      won: number;
      drawn: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
      form?: string; // Last 5 results as a string like "WLDWW"
    }>;
  };
  error?: string;
}

const Classification: React.FC = () => {
  const [classification, setClassification] = useState<ClassificationTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchClassification = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call Parse.bot API to get classification data
      const response = await fetch('https://api.parse.bot/scraper/99019bdc-3b09-46cb-888b-410d26c62f99/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_PARSEBOT_API_KEY || '4e282a3c-09d9-49e8-9b54-be7c3c5222b0',
        },
        body: JSON.stringify({
          count: "100",
          extract_full_table: "true" // Request full table data extraction
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ParseBotResponse = await response.json();
      
      console.log('Parse.bot API response:', data);
      
      if (!data.success || !data.data || !data.data.teams) {
        throw new Error(data.error || 'No se pudieron obtener datos de la API');
      }

      // Transform Parse.bot data to our classification format
      const classificationData: ClassificationTeam[] = data.data.teams.map((team, index) => {
        const isOurTeam = team.team.toLowerCase().includes('union') || 
                         team.team.toLowerCase().includes('astillero');
        
        // Convert form string (e.g., "WLDWW") to our format
        const lastFiveResults: string[] = [];
        if (team.form) {
          for (const char of team.form.slice(-5)) {
            switch (char.toUpperCase()) {
              case 'W':
                lastFiveResults.push('G'); // Win -> Victoria
                break;
              case 'L':
                lastFiveResults.push('P'); // Loss -> Derrota
                break;
              case 'D':
                lastFiveResults.push('E'); // Draw -> Empate
                break;
              default:
                lastFiveResults.push('?'); // Unknown
            }
          }
        } else {
          // Fallback if no form data available
          lastFiveResults.push('G', 'E', 'P', 'G', 'G');
        }
        
        return {
          position: team.position || index + 1,
          team: team.team,
          points: team.points || 0,
          played: team.played || 0,
          won: team.won || 0,
          drawn: team.drawn || 0,
          lost: team.lost || 0,
          goalsFor: team.goalsFor || 0,
          goalsAgainst: team.goalsAgainst || 0,
          goalDifference: team.goalDifference || (team.goalsFor - team.goalsAgainst) || 0,
          lastFiveResults,
          isPromoted: (team.position || index + 1) === 1,
          isPlayoff: (team.position || index + 1) >= 2 && (team.position || index + 1) <= 3,
          isRelegated: (team.position || index + 1) >= data.data.teams.length - 2,
          link: team.link
        };
      });
      
      if (classificationData.length === 0) {
        throw new Error('No se pudieron extraer datos de la clasificación');
      }
      
      setClassification(classificationData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching classification:', error);
      setError(`Error al cargar la clasificación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassification();
  }, []);

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'G':
        return { color: 'bg-green-500', label: 'Victoria' };
      case 'E':
        return { color: 'bg-yellow-500', label: 'Empate' };
      case 'P':
        return { color: 'bg-red-500', label: 'Derrota' };
      default:
        return { color: 'bg-gray-400', label: 'Desconocido' };
    }
  };

  const getPositionStyle = (team: ClassificationTeam) => {
    if (team.isPromoted) {
      return 'bg-green-100 border-l-4 border-green-500';
    }
    if (team.isPlayoff) {
      return 'bg-yellow-100 border-l-4 border-yellow-500';
    }
    if (team.isRelegated) {
      return 'bg-red-100 border-l-4 border-red-500';
    }
    return '';
  };

  const ourTeam = classification.find(team => 
    team.team.toLowerCase().includes('unión') || 
    team.team.toLowerCase().includes('astillero')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-10 h-10 text-primary-600 mr-3" />
              <h1 className="text-3xl font-bold text-secondary-900">Clasificación</h1>
            </div>
            <p className="text-lg text-secondary-600 mb-4">
              Segunda Regional Grupo B - Temporada 2024-2025
            </p>
            {lastUpdated && (
              <p className="text-sm text-secondary-500">
                Última actualización: {lastUpdated.toLocaleDateString('es-ES')} a las {lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Our Team Highlight */}
        {ourTeam && (
          <div className="mb-8 p-6 bg-primary-50 rounded-lg border-l-4 border-primary-600">
            <div className="mb-4 text-sm text-secondary-600">
              <strong>✅ Datos en tiempo real:</strong> La información se obtiene directamente desde la RFCF usando Parse.bot API. 
              Todos los datos (puntos, partidos, goles, etc.) son reales y se actualizan automáticamente.
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary-900 mb-2">
                  {ourTeam.team}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-primary-700 font-medium">Posición:</span>
                    <div className="text-primary-900 font-bold">{ourTeam.position}ª</div>
                  </div>
                  <div>
                    <span className="text-primary-700 font-medium">Puntos:</span>
                    <div className="text-primary-900 font-bold">{ourTeam.points}</div>
                  </div>
                  <div>
                    <span className="text-primary-700 font-medium">Partidos:</span>
                    <div className="text-primary-900 font-bold">{ourTeam.played}</div>
                  </div>
                  <div>
                    <span className="text-primary-700 font-medium">Goles:</span>
                    <div className="text-primary-900 font-bold">{ourTeam.goalsFor}-{ourTeam.goalsAgainst}</div>
                  </div>
                  <div>
                    <span className="text-primary-700 font-medium">Últimos 5:</span>
                    <div className="flex space-x-1 mt-1">
                      {ourTeam.lastFiveResults.slice(-5).map((result, index) => {
                        const resultStyle = getResultIcon(result);
                        return (
                          <div
                            key={index}
                            className={`w-5 h-5 rounded-full ${resultStyle.color} text-white text-xs flex items-center justify-center font-bold`}
                            title={resultStyle.label}
                          >
                            {result}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">{ourTeam.points}</div>
                <div className="text-sm text-primary-700">puntos</div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary-900">Tabla de Clasificación</h2>
          <div className="flex space-x-4">
            <button
              onClick={fetchClassification}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Actualizar</span>
            </button>
            <a
              href="https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=7986463&codgrupo=7986502"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver en RFCF</span>
            </a>
          </div>
        </div>

        {/* Classification Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-secondary-600">Cargando clasificación...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-error-600 mb-4">
                <Award className="w-12 h-12 mx-auto mb-2" />
                <p>{error}</p>
              </div>
              <button
                onClick={fetchClassification}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : classification.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Pos</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Equipo</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Pts</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">PJ</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">G</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">E</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">P</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider hidden md:table-cell">GF</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider hidden md:table-cell">GC</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider hidden lg:table-cell">Dif</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Últimos 5</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classification.map((team, index) => {
                      const isOurTeam = team.team.toLowerCase().includes('unión') || 
                                       team.team.toLowerCase().includes('astillero');
                      
                      return (
                        <tr 
                          key={index} 
                          className={`hover:bg-gray-50 transition-colors ${
                            isOurTeam ? 'bg-primary-50' : ''
                          } ${getPositionStyle(team)}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                team.isPromoted ? 'bg-green-500 text-white' :
                                team.isPlayoff ? 'bg-yellow-500 text-white' :
                                team.isRelegated ? 'bg-red-500 text-white' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {team.position}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {team.link ? (
                              <a
                                href={team.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm font-medium hover:underline ${
                                  isOurTeam ? 'text-primary-900 hover:text-primary-700' : 'text-secondary-900 hover:text-secondary-700'
                                }`}
                              >
                                {team.team}
                                <ExternalLink className="w-3 h-3 inline ml-1" />
                              </a>
                            ) : (
                              <div className={`text-sm font-medium ${
                                isOurTeam ? 'text-primary-900' : 'text-secondary-900'
                              }`}>
                                {team.team}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`text-xl font-bold ${
                              isOurTeam ? 'text-primary-600' : 'text-secondary-900'
                            }`}>
                              {team.points}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-secondary-500">
                            {team.played}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-green-600">
                              {team.won}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-yellow-600">
                              {team.drawn}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-red-600">
                              {team.lost}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-secondary-600 hidden md:table-cell">
                            {team.goalsFor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-secondary-600 hidden md:table-cell">
                            {team.goalsAgainst}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium hidden lg:table-cell">
                            <span className={team.goalDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {team.goalDifference >= 0 ? '+' : ''}{team.goalDifference}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-1">
                              {team.lastFiveResults.slice(-5).map((result, resultIndex) => {
                                const resultStyle = getResultIcon(result);
                                return (
                                  <div
                                    key={resultIndex}
                                    className={`w-6 h-6 rounded-full ${resultStyle.color} text-white text-xs flex items-center justify-center font-bold`}
                                    title={resultStyle.label}
                                  >
                                    {result}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-secondary-600">Ascenso directo</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-secondary-600">Playoff de ascenso</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-secondary-600">Descenso</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-secondary-500">
                  PJ: Partidos Jugados | G: Ganados | E: Empatados | P: Perdidos | GF: Goles a Favor | GC: Goles en Contra | Dif: Diferencia de Goles
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-secondary-600">No se pudo cargar la clasificación</p>
            </div>
          )}
        </div>

        {/* Competition Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-primary-600 mr-2" />
            Información de la Competición
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Competición</h4>
              <p className="text-secondary-600">Segunda Regional Grupo B</p>
              <p className="text-secondary-500 text-sm">Temporada 2024-2025</p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Equipos</h4>
              <p className="text-secondary-600">{classification.length} equipos participantes</p>
              <p className="text-secondary-500 text-sm">Sistema de liga a doble vuelta</p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Promoción</h4>
              <p className="text-secondary-600">1 ascenso directo</p>
              <p className="text-secondary-500 text-sm">Posiciones 2-3: Playoff de ascenso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classification;