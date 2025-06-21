import React from 'react';
import { Users, Star, Award, Target, Calendar, MapPin, Heart, Trophy, BookOpen } from 'lucide-react';

const Youth: React.FC = () => {
  const categories = [
    {
      name: 'Prebenjamín',
      age: '6-7 años',
      players: 15,
      description: 'Primeros pasos en el fútbol con enfoque en diversión y coordinación básica.',
      schedule: 'Martes y Jueves 17:00-18:00',
      objectives: ['Coordinación motriz', 'Trabajo en equipo', 'Diversión', 'Respeto por las reglas'],
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      name: 'Benjamín',
      age: '8-9 años',
      players: 18,
      description: 'Desarrollo de habilidades básicas del fútbol y conceptos tácticos simples.',
      schedule: 'Lunes y Miércoles 17:30-18:30',
      objectives: ['Técnica individual', 'Conceptos básicos', 'Compañerismo', 'Disciplina'],
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      name: 'Alevín',
      age: '10-11 años',
      players: 20,
      description: 'Perfeccionamiento técnico y introducción a la táctica colectiva.',
      schedule: 'Martes y Jueves 18:00-19:30',
      objectives: ['Técnica avanzada', 'Táctica básica', 'Competitividad sana', 'Liderazgo'],
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      name: 'Infantil',
      age: '12-13 años',
      players: 22,
      description: 'Consolidación técnico-táctica y desarrollo de la personalidad deportiva.',
      schedule: 'Lunes, Miércoles y Viernes 18:30-20:00',
      objectives: ['Táctica colectiva', 'Mentalidad competitiva', 'Responsabilidad', 'Trabajo duro'],
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      name: 'Cadete',
      age: '14-15 años',
      players: 25,
      description: 'Especialización posicional y preparación para el fútbol juvenil.',
      schedule: 'Lunes, Miércoles y Viernes 19:00-20:30',
      objectives: ['Especialización', 'Táctica avanzada', 'Preparación física', 'Mentalidad profesional'],
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      name: 'Juvenil',
      age: '16-18 años',
      players: 20,
      description: 'Transición al fútbol adulto y preparación para equipos superiores.',
      schedule: 'Martes, Jueves y Sábado 20:00-21:30',
      objectives: ['Rendimiento', 'Profesionalización', 'Liderazgo', 'Proyección futura'],
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    }
  ];

  const coaches = [
    { name: 'Miguel Ángel Ruiz', category: 'Coordinador General', license: 'UEFA B', experience: '12 años', photo: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Ana García López', category: 'Prebenjamín y Benjamín', license: 'Monitor Regional', experience: '6 años', photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'Carlos Fernández', category: 'Alevín e Infantil', license: 'Entrenador Regional', experience: '8 años', photo: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
    { name: 'David Martínez', category: 'Cadete y Juvenil', license: 'UEFA A', experience: '10 años', photo: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Respeto',
      description: 'Hacia compañeros, rivales, árbitros y entrenadores'
    },
    {
      icon: Users,
      title: 'Trabajo en Equipo',
      description: 'La importancia de jugar unidos y apoyarse mutuamente'
    },
    {
      icon: Star,
      title: 'Esfuerzo',
      description: 'Dar siempre lo mejor de uno mismo en cada entrenamiento y partido'
    },
    {
      icon: Trophy,
      title: 'Humildad',
      description: 'Mantener los pies en el suelo tanto en victorias como en derrotas'
    }
  ];

  const facilities = [
    { name: 'Campo Principal', description: 'Hierba natural - 108x69m', icon: MapPin },
    { name: 'Campo de Entrenamiento', description: 'Hierba artificial - 90x60m', icon: MapPin },
    { name: 'Vestuarios', description: '4 vestuarios equipados', icon: Users },
    { name: 'Sala Polivalente', description: 'Para charlas técnicas y reuniones', icon: BookOpen },
  ];

  const stats = [
    { value: '120', label: 'Jugadores Totales', icon: Users },
    { value: '6', label: 'Categorías', icon: Trophy },
    { value: '8', label: 'Entrenadores', icon: Award },
    { value: '15', label: 'Años de Experiencia', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop)'
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Escuelas de Fútbol</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Formando a los futbolistas del mañana desde los 6 años
            </p>
            <div className="text-lg font-medium">
              "Donde nacen los sueños unionistas"
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

        {/* Philosophy */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Nuestra Filosofía</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 text-secondary-700 leading-relaxed">
              <p>
                En las Escuelas de Fútbol del S.D. Unión Club de Astillero creemos que el deporte 
                es una herramienta fundamental para la formación integral de los niños y jóvenes. 
                Nuestro objetivo va más allá de enseñar fútbol: formamos personas.
              </p>
              <p>
                Cada entrenamiento es una oportunidad para inculcar valores como el respeto, 
                la disciplina, el trabajo en equipo y la superación personal. Adaptamos nuestra 
                metodología a cada edad, priorizando siempre la diversión y el desarrollo personal.
              </p>
              <p>
                Nuestros entrenadores están altamente cualificados y comprometidos con el desarrollo 
                de cada jugador, tanto a nivel técnico como humano.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop"
                alt="Escuelas de fútbol"
                className="rounded-lg shadow-md w-full"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Nuestras Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-secondary-900">{category.name}</h3>
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm font-medium">
                      {category.age}
                    </span>
                  </div>
                  
                  <p className="text-secondary-600 mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <Users className="w-4 h-4 mr-2" />
                      {category.players} jugadores
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {category.schedule}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-2 text-sm">Objetivos:</h4>
                    <ul className="space-y-1">
                      {category.objectives.map((objective, objIndex) => (
                        <li key={objIndex} className="text-xs text-secondary-600 flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coaches */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Award className="w-8 h-8 text-primary-600 mr-3" />
            Nuestros Entrenadores
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coaches.map((coach, index) => (
              <div key={index} className="text-center">
                <img
                  src={coach.photo}
                  alt={coach.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {coach.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2 text-sm">
                  {coach.category}
                </p>
                <div className="text-xs text-secondary-500 space-y-1">
                  <div>{coach.license}</div>
                  <div>{coach.experience} de experiencia</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">Valores que Transmitimos</h2>
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

        {/* Facilities */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
            <Target className="w-8 h-8 text-primary-600 mr-3" />
            Nuestras Instalaciones
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      {facility.name}
                    </h3>
                    <p className="text-secondary-600">
                      {facility.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration CTA */}
        <div className="bg-primary-600 rounded-lg shadow-lg p-8 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Quieres que tu hijo forme parte?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Las inscripciones están abiertas todo el año. Ven a conocer nuestras instalaciones 
            y descubre por qué somos la mejor opción para la formación deportiva de tu hijo.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Información e Inscripciones
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Visitar Instalaciones
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">€25</div>
              <div className="text-primary-200">Cuota mensual</div>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">Gratis</div>
              <div className="text-primary-200">Primera semana de prueba</div>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">Todo</div>
              <div className="text-primary-200">Material incluido</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Youth;