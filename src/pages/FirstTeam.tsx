import React from 'react';
import { Trophy, Calendar, MapPin, Users, Star, Award, Target, TrendingUp } from 'lucide-react';

const FirstTeam: React.FC = () => {
  const players = [
    // Porteros
    { name: 'Miguel Ángel Ruiz', position: 'Portero', number: 1, age: 28, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'David González', position: 'Portero', number: 13, age: 22, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    
    // Defensas
    { name: 'Carlos Fernández', position: 'Defensa Central', number: 3, age: 26, photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Javier Martín', position: 'Defensa Central', number: 4, age: 29, photo: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Alejandro Sánchez', position: 'Lateral Derecho', number: 2, age: 24, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Pablo Díaz', position: 'Lateral Izquierdo', number: 5, age: 25, photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    
    // Centrocampistas
    { name: 'Sergio López', position: 'Centrocampista', number: 6, age: 27, photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Adrián Pérez', position: 'Centrocampista', number: 8, age: 23, photo: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Daniel Rodríguez', position: 'Centrocampista', number: 10, age: 30, photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    
    // Delanteros
    { name: 'Mario García', position: 'Delantero', number: 9, age: 25, photo: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Rubén Morales', position: 'Extremo', number: 7, age: 22, photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Iván Jiménez', position: 'Extremo', number: 11, age: 21, photo: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  ];

  const staff = [
    { name: 'Antonio Martínez', position: 'Entrenador', experience: '8 años', photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Luis Sánchez', position: 'Entrenador Asistente', experience: '5 años', photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Jorge Fernández', position: 'Preparador Físico', experience: '6 años', photo: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Dr. Pedro Ruiz', position: 'Médico', experience: '12 años', photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  ];

  const seasonStats = {
    matchesPlayed: 17,
    wins: 17,
    draws: 0,
    losses: 0,
    goalsFor: 57,
    goalsAgainst: 9,
    position: 1,
    points: 51
  };

  const recentMatches = [
    { opponent: 'Santoña CF', result: '1-2', date: '08/02/2026', venue: 'Visitante', status: 'win' },
    { opponent: 'Nueva Montaña', result: '4-2', date: '01/02/2026', venue: 'Local', status: 'win' },
    { opponent: 'SD Villaescusa B', result: '0-3', date: '25/01/2026', venue: 'Visitante', status: 'win' },
    { opponent: 'CD Guarnizo C', result: '3-1', date: '18/01/2026', venue: 'Local', status: 'win' },
    { opponent: 'Castro B', result: '1-3', date: '11/01/2026', venue: 'Visitante', status: 'win' },
  ];

  const upcomingMatches = [
    { opponent: 'Samano B', date: '15/02/2026', time: '17:00', venue: 'Local' },
    { opponent: 'EMF Meruelo', date: '22/02/2026', time: '16:00', venue: 'Visitante' },
    { opponent: 'Marina de Cudeyo', date: '01/03/2026', time: '17:00', venue: 'Local' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop)'
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Primer Equipo</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Segunda Regional Grupo C - Temporada 2025/26
            </p>
            <div className="text-lg font-medium">
              "Unidos por la misma pasión"
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Season Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-20 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{seasonStats.position}º</div>
            <div className="text-sm text-secondary-600">Posición Liga</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{seasonStats.points}</div>
            <div className="text-sm text-secondary-600">Puntos</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{seasonStats.wins}</div>
            <div className="text-sm text-secondary-600">Victorias</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{seasonStats.goalsFor}</div>
            <div className="text-sm text-secondary-600">Goles a Favor</div>
          </div>
        </div>

        {/* Squad */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Users className="w-8 h-8 text-primary-600 mr-3" />
            Plantilla 2023/24
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-secondary-900">{player.name}</div>
                    <div className="text-sm text-secondary-600">{player.position}</div>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {player.number}
                  </div>
                </div>
                <div className="text-sm text-secondary-500">
                  {player.age} años
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Staff */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Award className="w-8 h-8 text-primary-600 mr-3" />
            Cuerpo Técnico
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.position}
                </p>
                <p className="text-sm text-secondary-500">
                  {member.experience} de experiencia
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Matches Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Matches */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
              Últimos Resultados
            </h2>
            
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-secondary-900">
                      vs {match.opponent}
                    </div>
                    <div className="text-sm text-secondary-600">
                      {match.date} - {match.venue}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    match.status === 'win' ? 'bg-green-100 text-green-800' :
                    match.status === 'loss' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {match.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Matches */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 text-primary-600 mr-3" />
              Próximos Partidos
            </h2>
            
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="font-semibold text-secondary-900 mb-2">
                    vs {match.opponent}
                  </div>
                  <div className="flex items-center text-sm text-secondary-600 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {match.date}
                    </div>
                    <div>{match.time}</div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {match.venue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Season Objectives */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Target className="w-8 h-8 text-primary-600 mr-3" />
            Objetivos de la Temporada
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-sem bold text-secondary-900 mb-3">
                Clasificación Europea
              </h3>
              <p className="text-secondary-600">
                Mantener una posición en la parte alta de la tabla para optar a competiciones superiores
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Desarrollo de Cantera
              </h3>
              <p className="text-secondary-600">
                Integrar jóvenes talentos de nuestras categorías inferiores en el primer equipo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Juego Atractivo
              </h3>
              <p className="text-secondary-600">
                Mantener un estilo de juego ofensivo y atractivo que emocione a nuestra afición
              </p>
            </div>
          </div>
        </div>

        {/* Team Philosophy */}
        <div className="bg-primary-600 rounded-lg shadow-lg p-8 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Filosofía del Equipo</h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            "Nuestro primer equipo representa los valores históricos del S.D. Unión Club de Astillero: 
            trabajo, humildad, sacrificio y pasión. Cada jugador que viste nuestra camiseta lleva 
            consigo más de 100 años de historia y el orgullo de representar a El Astillero."
          </p>
          <div className="mt-6 text-primary-300 font-semibold text-lg">
            - Antonio Martínez, Entrenador
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTeam;