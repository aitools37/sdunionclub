import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, MapPin, ArrowRight, TrendingUp, Award } from 'lucide-react';

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
  goalDiff: number;
}

const Teams: React.FC = () => {
  const [classification, setClassification] = useState<ClassificationTeam[]>([]);
  const [loadingClassification, setLoadingClassification] = useState(true);
  const [classificationError, setClassificationError] = useState<string | null>(null);

  const teams = [
    {
      id: 'primer-equipo',
      name: 'Primer Equipo',
      category: 'Segunda Regional Grupo B',
      description: 'Nuestro equipo senior que representa al club en la máxima categoría regional.',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      stats: {
        players: 22,
        age: '18-35 años',
        season: '2023-24',
        stadium: 'La Planchada'
      },
      nextMatch: {
        opponent: 'CD Laredo',
        date: '2024-03-15',
        time: '17:00',
        venue: 'Local'
      },
      highlights: [
        'Equipo con más historia del club',
        'Participante en Segunda Regional desde 2018',
        'Base de jugadores locales de El Astillero',
        'Cantera de futuros talentos'
      ]
    },
    {
      id: 'marismas',
      name: 'Marismas',
      category: 'Tercera Regional',
      description: 'Nuestro equipo filial que sirve de puente entre el fútbol base y el primer equipo.',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      stats: {
        players: 20,
        age: '16-25 años',
        season: '2023-24',
        stadium: 'La Planchada'
      },
      nextMatch: {
        opponent: 'CD Bezana',
        date: '2024-03-16',
        time: '11:00',
        venue: 'Local'
      },
      highlights: [
        'Equipo de desarrollo y formación',
        'Campeones de Tercera Regional 2021',
        'Combinación de veteranos y jóvenes promesas',
        'Importante rol en la cantera del club'
      ]
    },
    {
      id: 'escuelas',
      name: 'Escuelas de Fútbol',
      category: 'Fútbol Base (6-18 años)',
      description: 'Nuestras categorías formativas que desarrollan el talento desde la base.',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      stats: {
        players: 120,
        age: '6-18 años',
        season: '2023-24',
        stadium: 'La Planchada + Campos auxiliares'
      },
      categories: [
        'Prebenjamín (6-7 años)',
        'Benjamín (8-9 años)',
        'Alevín (10-11 años)',
        'Infantil (12-13 años)',
        'Cadete (14-15 años)',
        'Juvenil (16-18 años)'
      ],
      highlights: [
        'Más de 120 jóvenes en formación',
        'Metodología de enseñanza moderna',
        'Participación en ligas locales y regionales',
        'Formación integral: técnica, táctica y valores'
      ]
    }
  ];

  // Fetch classification data
  useEffect(() => {
    const fetchClassification = async () => {
      try {
        setLoadingClassification(true);
        setClassificationError(null);

        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = 'https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=7986463&codgrupo=7986502';
        
        const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const htmlText = await response.text();
        
        // Parse HTML using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        // Find the classification table
        const table = doc.querySelector('table.table-bordered.table-striped');
        
        if (!table) {
          throw new Error('No se encontró la tabla de clasificación');
        }
        
        const rows = table.querySelectorAll('tbody tr');
        const classificationData: ClassificationTeam[] = [];
        
        rows.forEach((row, index) => {
          const cells = row.querySelectorAll('td');
          
          if (cells.length >= 10) {
            const teamData: ClassificationTeam = {
              position: index + 1,
              team: cells[1]?.textContent?.trim() || '',
              points: parseInt(cells[2]?.textContent?.trim() || '0'),
              played: parseInt(cells[3]?.textContent?.trim() || '0'),
              won: parseInt(cells[4]?.textContent?.trim() || '0'),
              drawn: parseInt(cells[5]?.textContent?.trim() || '0'),
              lost: parseInt(cells[6]?.textContent?.trim() || '0'),
              goalsFor: parseInt(cells[7]?.textContent?.trim() || '0'),
              goalsAgainst: parseInt(cells[8]?.textContent?.trim() || '0'),
              goalDiff: parseInt(cells[9]?.textContent?.trim() || '0')
            };
            
            if (teamData.team) {
              classificationData.push(teamData);
            }
          }
        });
        
        setClassification(classificationData);
      } catch (error) {
        console.error('Error fetching classification:', error);
        setClassificationError('Error al cargar la clasificación. Inténtalo de nuevo más tarde.');
      } finally {
        setLoadingClassification(false);
      }
    };

    fetchClassification();
  }, []);

  // Find our team in the classification
  const ourTeamInClassification = classification.find(team => 
    team.team.toLowerCase().includes('unión') || 
    team.team.toLowerCase().includes('astillero')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nuestros Equipos</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Desde el primer equipo hasta las escuelas de fútbol base, 
              todos unidos por los mismos colores y valores
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Classification Section */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center mb-8">
              <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-3xl font-bold text-secondary-900">
                Clasificación Segunda Regional Grupo B
              </h2>
            </div>
            
            {/* Our team highlight */}
            {ourTeamInClassification && (
              <div className="mb-6 p-4 bg-primary-50 rounded-lg border-l-4 border-primary-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      {ourTeamInClassification.team}
                    </h3>
                    <p className="text-primary-700 text-sm">
                      Posición {ourTeamInClassification.position}ª con {ourTeamInClassification.points} puntos
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {ourTeamInClassification.points}
                    </div>
                    <div className="text-sm text-primary-700">puntos</div>
                  </div>
                </div>
              </div>
            )}

            {loadingClassification ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-secondary-600">Cargando clasificación...</p>
              </div>
            ) : classificationError ? (
              <div className="text-center py-8">
                <div className="text-error-600 mb-4">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <p>{classificationError}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : classification.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Pos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Equipo</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">Pts</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">PJ</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">G</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">E</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">P</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">GF</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">GC</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">DG</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classification.map((team, index) => {
                      const isOurTeam = team.team.toLowerCase().includes('unión') || 
                                       team.team.toLowerCase().includes('astillero');
                      const isTopThree = index < 3;
                      const isRelegation = index >= classification.length - 3;
                      
                      return (
                        <tr 
                          key={index} 
                          className={`hover:bg-gray-50 ${
                            isOurTeam ? 'bg-primary-50 border-primary-200' : ''
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                                isTopThree ? 'bg-success-100 text-success-800' :
                                isRelegation ? 'bg-error-100 text-error-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {team.position}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              isOurTeam ? 'text-primary-900' : 'text-secondary-900'
                            }`}>
                              {team.team}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className={`text-lg font-bold ${
                              isOurTeam ? 'text-primary-600' : 'text-secondary-900'
                            }`}>
                              {team.points}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-secondary-500">
                            {team.played}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-success-600">
                            {team.won}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-warning-600">
                            {team.drawn}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-error-600">
                            {team.lost}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-secondary-600">
                            {team.goalsFor}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-secondary-600">
                            {team.goalsAgainst}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span className={`text-sm font-medium ${
                              team.goalDiff > 0 ? 'text-success-600' :
                              team.goalDiff < 0 ? 'text-error-600' : 'text-secondary-600'
                            }`}>
                              {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-secondary-600">No se pudo cargar la clasificación</p>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-100 rounded mr-2"></div>
                <span className="text-secondary-600">Posiciones de ascenso</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-error-100 rounded mr-2"></div>
                <span className="text-secondary-600">Posiciones de descenso</span>
              </div>
              <div className="text-secondary-500">
                PJ: Partidos Jugados | G: Ganados | E: Empatados | P: Perdidos | GF: Goles a Favor | GC: Goles en Contra | DG: Diferencia de Goles
              </div>
            </div>
          </div>
        </div>

        {/* Teams Overview */}
        <div className="space-y-12">
          {teams.map((team, index) => (
            <div key={team.id} className={`lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              {/* Team Image */}
              <div className={`mb-8 lg:mb-0 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Team Info */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex items-center mb-4">
                    <Trophy className="w-6 h-6 text-primary-600 mr-3" />
                    <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
                      {team.category}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                    {team.name}
                  </h2>
                  
                  <p className="text-secondary-600 mb-6 text-lg leading-relaxed">
                    {team.description}
                  </p>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{team.stats.players}</div>
                      <div className="text-sm text-secondary-600">Jugadores</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-primary-600">{team.stats.age}</div>
                      <div className="text-sm text-secondary-600">Edad</div>
                    </div>
                  </div>

                  {/* Next Match or Categories */}
                  {team.nextMatch ? (
                    <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                      <h4 className="font-semibold text-secondary-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Próximo Partido
                      </h4>
                      <div className="text-secondary-700">
                        <div className="font-medium">vs {team.nextMatch.opponent}</div>
                        <div className="text-sm">
                          {team.nextMatch.date} - {team.nextMatch.time} ({team.nextMatch.venue})
                        </div>
                      </div>
                    </div>
                  ) : team.categories && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-900 mb-3">Categorías</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {team.categories.map((category, catIndex) => (
                          <div key={catIndex} className="text-sm text-secondary-600 bg-gray-50 p-2 rounded">
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary-900 mb-3">Destacados</h4>
                    <ul className="space-y-2">
                      {team.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-start text-secondary-600">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={`/equipos/${team.id}`}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Ver más detalles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            Datos Generales del Club
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-2">162</div>
              <div className="text-secondary-600">Jugadores Total</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-2">8</div>
              <div className="text-secondary-600">Equipos Activos</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-2">3</div>
              <div className="text-secondary-600">Campos de Juego</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-2">102</div>
              <div className="text-secondary-600">Años de Historia</div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="mt-16 bg-primary-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Quieres formar parte?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Siempre estamos buscando nuevos talentos para nuestras categorías. 
            Únete a la familia unionista y desarrolla tu pasión por el fútbol.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/equipos/escuelas"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Escuelas de Fútbol
            </Link>
            <Link
              to="/hazte-socio"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Hazte Socio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;