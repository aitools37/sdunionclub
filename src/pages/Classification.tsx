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

      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = 'https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=7986463&codgrupo=7986502';
      
      const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const htmlText = await response.text();
      console.log('Fetched HTML content for classification');
      
      // Parse HTML using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      // Find the visible classification table (summary table)
      const resumeSection = doc.querySelector('span#CL_Resumen[style*="display:"]');
      
      if (!resumeSection) {
        throw new Error('No se encontró la sección de resumen de clasificación');
      }
      
      const table = resumeSection.querySelector('table');
      
      if (!table) {
        throw new Error('No se encontró la tabla de clasificación');
      }
      
      const rows = table.querySelectorAll('tbody tr');
      const classificationData: ClassificationTeam[] = [];
      
      console.log(`Found ${rows.length} rows in classification table`);
      
      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        
        if (cells.length >= 9) {
          const positionText = cells[1]?.textContent?.trim() || '0';
          const position = parseInt(positionText);
          
          const teamElement = cells[2]?.querySelector('a') || cells[2];
          const team = teamElement?.textContent?.trim() || '';
          
          const pointsText = cells[3]?.textContent?.trim() || '0';
          const points = parseInt(pointsText);
          
          const playedText = cells[4]?.textContent?.trim() || '0';
          const played = parseInt(playedText);
          
          const wonText = cells[5]?.textContent?.trim() || '0';
          const won = parseInt(wonText);
          
          const drawnText = cells[6]?.textContent?.trim() || '0';
          const drawn = parseInt(drawnText);
          
          const lostText = cells[7]?.textContent?.trim() || '0';
          const lost = parseInt(lostText);
          
          // Extract last five results from the results cell
          const resultsCell = cells[8];
          const resultSpans = resultsCell?.querySelectorAll('span[title]') || [];
          const lastFiveResults = Array.from(resultSpans).map(span => {
            const title = span.getAttribute('title');
            const text = span.textContent?.trim();
            return text || '';
          });
          
          if (team && position > 0 && !isNaN(points)) {
            const teamData: ClassificationTeam = {
              position,
              team,
              points,
              played,
              won,
              drawn,
              lost,
              goalsFor: 0, // Not available in summary table
              goalsAgainst: 0, // Not available in summary table
              goalDifference: 0, // Not available in summary table
              lastFiveResults,
              isPromoted: position === 1, // Top team gets promoted
              isPlayoff: position >= 2 && position <= 3, // Playoff positions
              isRelegated: false // No relegation info available
            };
            
            classificationData.push(teamData);
          }
        }
      });
      
      console.log('Final parsed classification data:', classificationData);
      
      if (classificationData.length === 0) {
        throw new Error('No se pudieron extraer datos de la clasificación');
      }
      
      setClassification(classificationData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching classification:', error);
      setError('Error al cargar la clasificación. Inténtalo de nuevo más tarde.');
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
                    <span className="text-primary-700 font-medium">Victorias:</span>
                    <div className="text-primary-900 font-bold">{ourTeam.won}</div>
                  </div>
                  <div>
                    <span className="text-primary-700 font-medium">Últimos:</span>
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
                            <div className={`text-sm font-medium ${
                              isOurTeam ? 'text-primary-900' : 'text-secondary-900'
                            }`}>
                              {team.team}
                            </div>
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
                  PJ: Partidos Jugados | G: Ganados | E: Empatados | P: Perdidos
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
              <p className="text-secondary-600">{classification.length} equipos</p>
              <p className="text-secondary-500 text-sm">Sistema de liga a doble vuelta</p>
            </div>
            <div>
              <h4 className="font-medium text-secondary-900 mb-2">Promoción</h4>
              <p className="text-secondary-600">1 ascenso directo</p>
              <p className="text-secondary-500 text-sm">Posiciones 2-3: Playoff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classification;