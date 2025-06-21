import React from 'react';
import { Building2, Handshake, Star, Award, Users, Target, Heart, Trophy } from 'lucide-react';

const Sponsors: React.FC = () => {
  const mainSponsors = [
    {
      name: 'Banco Santander',
      category: 'Patrocinador Principal',
      description: 'Nuestro patrocinador principal desde 2018, apoyando el crecimiento del club.',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop',
      website: 'https://www.bancosantander.es',
      partnership: '6 años'
    },
    {
      name: 'SODERCAN',
      category: 'Patrocinador Oficial',
      description: 'Sociedad para el Desarrollo Regional de Cantabria, impulsando el deporte local.',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop',
      website: 'https://www.sodercan.es',
      partnership: '4 años'
    },
    {
      name: 'Ayuntamiento de El Astillero',
      category: 'Colaborador Institucional',
      description: 'Apoyo institucional y mantenimiento de las instalaciones deportivas.',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop',
      website: 'https://www.aytoastillero.es',
      partnership: '102 años'
    }
  ];

  const officialSponsors = [
    {
      name: 'Gobierno de Cantabria',
      category: 'Colaborador Regional',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop'
    },
    {
      name: 'Construcciones Navales',
      category: 'Patrocinador Local',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop'
    },
    {
      name: 'Deportes Martínez',
      category: 'Proveedor Oficial',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop'
    },
    {
      name: 'Restaurante La Marina',
      category: 'Colaborador Gastronómico',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop'
    },
    {
      name: 'Farmacia Central',
      category: 'Colaborador Sanitario',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop'
    },
    {
      name: 'Talleres García',
      category: 'Colaborador Técnico',
      logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop'
    }
  ];

  const sponsorshipLevels = [
    {
      level: 'Patrocinador Principal',
      price: '€5,000 - €10,000',
      benefits: [
        'Logo en camiseta del primer equipo',
        'Presencia en todos los materiales promocionales',
        'Palco VIP para directivos',
        'Menciones en redes sociales',
        'Evento de presentación exclusivo'
      ],
      icon: Trophy
    },
    {
      level: 'Patrocinador Oficial',
      price: '€2,000 - €5,000',
      benefits: [
        'Logo en equipación de entrenamiento',
        'Presencia en cartelería del estadio',
        'Entradas para directivos',
        'Menciones en web y redes sociales',
        'Participación en eventos del club'
      ],
      icon: Star
    },
    {
      level: 'Colaborador',
      price: '€500 - €2,000',
      benefits: [
        'Logo en materiales promocionales',
        'Presencia en web del club',
        'Entradas de cortesía',
        'Menciones en redes sociales',
        'Certificado de colaboración'
      ],
      icon: Handshake
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Visibilidad Local',
      description: 'Llega a más de 1,250 socios y miles de aficionados en El Astillero y comarca'
    },
    {
      icon: Heart,
      title: 'Compromiso Social',
      description: 'Apoya el deporte base y la formación de jóvenes en valores deportivos'
    },
    {
      icon: Target,
      title: 'Marketing Deportivo',
      description: 'Asocia tu marca con los valores del deporte: esfuerzo, trabajo en equipo y superación'
    },
    {
      icon: Building2,
      title: 'Networking',
      description: 'Conecta con otros empresarios y profesionales de la región en eventos del club'
    }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Patrocinadores</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Empresas y entidades que hacen posible el sueño del S.D. Unión Club de Astillero
            </p>
            <div className="text-lg font-medium">
              "Juntos construimos el futuro del club"
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Sponsors */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
            Patrocinadores Principales
          </h2>
          
          <div className="space-y-8">
            {mainSponsors.map((sponsor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 p-8 flex items-center justify-center bg-gray-50">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-full h-24 object-contain"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mr-4">
                        {sponsor.category}
                      </span>
                      <span className="text-secondary-500 text-sm">
                        {sponsor.partnership} de colaboración
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                      {sponsor.name}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed mb-6">
                      {sponsor.description}
                    </p>
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Visitar sitio web
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Sponsors Grid */}
        <div className="py-16 bg-white rounded-lg shadow-sm mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
              Colaboradores Oficiales
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {officialSponsors.map((sponsor, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-gray-50 rounded-lg p-6 mb-4 group-hover:shadow-md transition-shadow">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-full h-16 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-1 text-sm">
                    {sponsor.name}
                  </h3>
                  <p className="text-xs text-secondary-500">
                    {sponsor.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits of Sponsorship */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
            ¿Por qué patrocinar al S.D. Unión Club de Astillero?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sponsorship Levels */}
        <div className="py-16 bg-white rounded-lg shadow-sm mb-16">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
              Niveles de Patrocinio
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sponsorshipLevels.map((level, index) => {
                const Icon = level.icon;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold text-secondary-900 mb-2">
                        {level.level}
                      </h3>
                      <div className="text-2xl font-bold text-primary-600">
                        {level.price}
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {level.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start text-secondary-600">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="py-16 bg-primary-600 rounded-lg shadow-lg text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-6">¿Quieres ser nuestro próximo patrocinador?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya confían en nosotros y forma parte de la familia unionista. 
            Juntos podemos hacer crecer el club y la comunidad.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Solicitar Información
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Descargar Dossier
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">1,250+</div>
              <div className="text-primary-200">Socios del club</div>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">5,000+</div>
              <div className="text-primary-200">Seguidores en redes</div>
            </div>
            <div className="bg-primary-700 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">102</div>
              <div className="text-primary-200">Años de historia</div>
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            Gracias a Todos Nuestros Colaboradores
          </h2>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            El S.D. Unión Club de Astillero no sería lo que es hoy sin el apoyo incondicional 
            de nuestros patrocinadores y colaboradores. Cada contribución, grande o pequeña, 
            ayuda a mantener vivo el espíritu unionista y a formar a las futuras generaciones 
            de futbolistas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;