import React from 'react';
import { Trophy, Calendar, MapPin, Users, Star, Award, Target, TrendingUp } from 'lucide-react';

const Marismas: React.FC = () => {
  const players = [
    // Porteros
    { name: 'Álvaro Martínez', position: 'Portero', number: 1, age: 19, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Hugo Fernández', position: 'Portero', number: 13, age: 17, photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    
    // Defensas
    { name: 'Marcos López', position: 'Defensa Central', number: 3, age: 20, photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Iker Sánchez', position: 'Defensa Central', number: 4, age: 22, photo: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Unai García', position: 'Lateral Derecho', number: 2, age: 18, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Aitor Ruiz', position: 'Lateral Izquierdo', number: 5, age: 21, photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    
    // Centrocampistas
    { name: 'Jon Pérez', position: 'Centrocampista', number: 6, age: 20, photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Mikel Díaz', position: 'Centrocampista', number: 8, age: 19, photo: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Asier González', position: 'Centrocampista', number: 10, age: 23, photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    
    // Delanteros
    { name: 'Gorka Morales', position: 'Delantero', number: 9, age: 18, photo: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Endika Jiménez', position: 'Extremo', number: 7, age: 17, photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Beñat Rodríguez', position: 'Extremo', number: 11, age: 19, photo: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  ];

  const staff = [
    { name: 'Iñaki Etxeberria', position: 'Entrenador', experience: '4 años', photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Mikel Aguirre', position: 'Entrenador Asistente', experience: '2 años', photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Koldo Zabala', position: 'Preparador Físico', experience: '3 años', photo: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  ];

  const seasonStats = {
    matchesPlayed: 22,
    wins: 16,
    draws: 4,
    losses: 2,
    goalsFor: 58,
    goalsAgainst: 18,
    position: 1,
    points: 52
  };

  const recentMatches = [
    { opponent: 'CD Bezana', result: '3-0', date: '10/03/2024', venue: 'Local', status: 'win' },
    { opponent: 'UD Corvera', result: '2-1', date: '03/03/2024', venue: 'Visitante', status: 'win' },
    { opponent: 'CD Textil Escudo', result: '4-0', date: '25/02/2024', venue: 'Local', status: 'win' },
    { opponent: 'SD Noja', result: '1-1', date: '18/02/2024', venue: 'Visitante', status: 'draw' },
    { opponent: 'CF Vimenor', result: '5-1', date: '11/02/2024', venue: 'Local', status: 'win' },
  ];

  const upcomingMatches = [
    { opponent: 'CD Bezana', date: '16/03/2024', time: '11:00', venue: 'Local' },
    { opponent: 'UD Corvera', date: '23/03/2024', time: '16:00', venue: 'Visitante' },
    { opponent: 'CD Textil Escudo', date: '30/03/2024', time: '11:30', venue: 'Local' },
  ];

  const achievements = [
    { year: '2021', title: 'Campeón Tercera Regional', description: 'Ascenso histórico tras una temporada perfecta' },
    { year: '2022', title: 'Subcampeón Copa Cantabria', description: 'Finalista en la copa regional' },
    { year: '2023', title: 'Mejor Cantera Regional', description: 'Reconocimiento por la formación de jóvenes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-secondary-600 to-primary-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop)'
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Marismas</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Tercera Regional - Temporada 2023/24
            </p>
            <div className="text-lg font-medium">
              "El futuro del club"
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Season Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-20 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{seasonStats.position}º</div>
            <div className="text-sm text-secondary-600">Líder Liga</div>
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

        {/* Team Description */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Sobre el Equipo Marismas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 text-secondary-700 leading-relaxed">
              <p>
                El equipo Marismas representa el futuro del S.D. Unión Club de Astillero. 
                Formado principalmente por jóvenes talentos de entre 16 y 25 años, este equipo 
                sirve como puente fundamental entre nuestras categorías de formación y el primer equipo.
              </p>
              <p>
                Actualmente compitiendo en Tercera Regional, el Marismas ha demostrado ser una 
                cantera excepcional de talentos, con varios jugadores que han dado el salto al 
                primer equipo en los últimos años.
              </p>
              <p>
                Su filosofía de juego se basa en la posesión del balón, el juego combinativo 
                y la presión alta, preparando a los jóvenes para el fútbol de mayor nivel.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop"
                alt="Equipo Marismas"
                className="rounded-lg shadow-md w-full"
              />
            </div>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Trophy className="w-8 h-8 text-primary-600 mr-3" />
            Logros Recientes
          </h2>
          
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start p-6 bg-primary-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center mr-6">
                  <div className="text-2xl font-bold text-primary-600">{achievement.year}</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-secondary-600">
                    {achievement.description}
                  </p>
                </div>
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

        {/* Development Focus */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Target className="w-8 h-8 text-primary-600 mr-3" />
            Enfoque de Desarrollo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Formación Integral
              </h3>
              <p className="text-secondary-600">
                Desarrollo técnico, táctico y personal de cada jugador para su progresión al primer equipo
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Competitividad
              </h3>
              <p className="text-secondary-600">
                Mantener el nivel competitivo alto para preparar a los jugadores para categorías superiores
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Mentalidad Ganadora
              </h3>
              <p className="text-secondary-600">
                Inculcar los valores del club y la mentalidad necesaria para representar al Unión
              </p>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-primary-600 rounded-lg shadow-lg p-8 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Historias de Éxito</h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-6">
            "En los últimos 3 años, 8 jugadores del Marismas han dado el salto al primer equipo, 
            demostrando la calidad de nuestra cantera y la efectividad de nuestro proyecto formativo."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">8</div>
              <div className="text-primary-200">Jugadores promovidos</div>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">1</div>
              <div className="text-primary-200">Título de liga</div>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="text-primary-200">Años consecutivos en playoffs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marismas;