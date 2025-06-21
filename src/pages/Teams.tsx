import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, MapPin, ArrowRight } from 'lucide-react';

const Teams: React.FC = () => {
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