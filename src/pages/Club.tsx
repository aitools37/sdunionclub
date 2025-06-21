import React from 'react';
import { Trophy, Users, Calendar, MapPin, Star, Award, Heart, Target } from 'lucide-react';

const Club: React.FC = () => {
  const achievements = [
    { year: '1922', title: 'Fundación del Club', description: 'Nace el S.D. Unión Club de Astillero' },
    { year: '1955', title: 'Primera Promoción', description: 'Ascenso a Primera Regional' },
    { year: '1978', title: 'Copa Cantabria', description: 'Campeones de la Copa de Cantabria' },
    { year: '1995', title: 'Centenario del Fútbol', description: 'Reconocimiento por 100 años del fútbol español' },
    { year: '2010', title: 'Reforma del Estadio', description: 'Modernización de La Planchada' },
    { year: '2022', title: 'Centenario del Club', description: '100 años de historia unionista' },
  ];

  const directiveMembers = [
    { name: 'José María González', position: 'Presidente', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Ana Ruiz Martín', position: 'Vicepresidenta', photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Carlos Fernández', position: 'Secretario', photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'María Sánchez', position: 'Tesorera', photo: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Pedro Díaz', position: 'Vocal de Deportes', photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
    { name: 'Laura Pérez', position: 'Vocal de Comunicación', photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Pasión',
      description: 'Vivimos el fútbol con intensidad y entrega, transmitiendo el amor por nuestros colores.'
    },
    {
      icon: Users,
      title: 'Unidad',
      description: 'Somos una familia unida que apoya al equipo en las buenas y en las malas.'
    },
    {
      icon: Trophy,
      title: 'Excelencia',
      description: 'Buscamos la mejora continua en todos los aspectos del club y la formación.'
    },
    {
      icon: Target,
      title: 'Compromiso',
      description: 'Comprometidos con El Astillero, sus aficionados y el desarrollo del fútbol base.'
    }
  ];

  const stats = [
    { value: '102', label: 'Años de Historia', icon: Calendar },
    { value: '1,250', label: 'Socios Activos', icon: Users },
    { value: '8', label: 'Equipos', icon: Trophy },
    { value: '150', label: 'Jugadores', icon: Star }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Historia del Club
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Más de 100 años representando con orgullo a El Astillero
            </p>
            <div className="text-2xl font-semibold text-primary-300">
              "Unidos se vence siempre"
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-20 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-secondary-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Club History */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Nuestra Historia</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Los Inicios (1922)</h3>
                <p className="text-secondary-700 leading-relaxed">
                  El S.D. Unión Club de Astillero nació en 1922 de la fusión de varios equipos locales, 
                  con el objetivo de representar dignamente a la villa de El Astillero en las competiciones 
                  regionales. Desde sus primeros años, el club se caracterizó por su espíritu luchador y 
                  su profundo arraigo en la comunidad local.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Crecimiento y Consolidación</h3>
                <p className="text-secondary-700 leading-relaxed">
                  A lo largo de las décadas, el club ha mantenido una presencia constante en las categorías 
                  regionales de Cantabria, convirtiéndose en una institución respetada y querida. Su compromiso 
                  con la formación de jóvenes talentos ha sido una de sus señas de identidad más importantes.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">El Presente</h3>
                <p className="text-secondary-700 leading-relaxed">
                  Hoy en día, el S.D. Unión Club de Astillero cuenta con equipos en todas las categorías, 
                  desde fútbol base hasta el primer equipo, manteniendo vivos los valores de trabajo, 
                  humildad y pasión que han caracterizado al club durante más de un siglo.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&fit=crop"
                alt="Historia del club"
                className="rounded-lg shadow-md w-full max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div id="logros" className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Hitos Históricos</h2>
          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-24 text-right mr-8">
                  <div className="text-2xl font-bold text-primary-600">{achievement.year}</div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mt-2 mr-6"></div>
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

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Directive */}
        <div id="directiva" className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Junta Directiva</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {directiveMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium">
                  {member.position}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Award className="w-8 h-8 text-primary-600 mr-3" />
            Reconocimientos y Logros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Títulos Deportivos</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">Campeón Copa Cantabria (1978)</span>
                </li>
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">Subcampeón Segunda Regional (2019)</span>
                </li>
                <li className="flex items-center">
                  <Trophy className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">Campeón Tercera Regional - Marismas (2021)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Reconocimientos</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">Premio Ayuntamiento de El Astillero (2022)</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">Reconocimiento Federación Cántabra (2020)</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">Club Centenario de España (2022)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Club;