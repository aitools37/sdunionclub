import React from 'react';
import { MapPin, Users, Ruler, Calendar, Car, Bus, Train, Camera } from 'lucide-react';

const Stadium: React.FC = () => {
  const stadiumImages = [
    'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/186076/pexels-photo-186076.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    'https://images.pexels.com/photos/159677/stadium-football-the-pitch-engine-159677.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  ];

  const facilities = [
    { name: 'Capacidad Total', value: '617 personas', icon: Users },
    { name: 'Dimensiones', value: '108 x 69 metros', icon: Ruler },
    { name: 'Inauguración', value: '1922', icon: Calendar },
    { name: 'Superficie', value: 'Hierba Natural', icon: MapPin },
  ];

  const transportOptions = [
    {
      type: 'Coche',
      icon: Car,
      description: 'Aparcamiento gratuito disponible',
      details: [
        'Parking principal: 150 plazas',
        'Parking auxiliar: 80 plazas',
        'Acceso desde Avenida Chiclana',
        'Plazas reservadas para personas con movilidad reducida'
      ]
    },
    {
      type: 'Autobús',
      icon: Bus,
      description: 'Líneas regulares hasta el estadio',
      details: [
        'Línea 1: Santander - El Astillero',
        'Línea 5: Camargo - El Astillero',
        'Parada: Avenida Chiclana (50m del estadio)',
        'Frecuencia cada 15 minutos en día de partido'
      ]
    },
    {
      type: 'Cercanías',
      icon: Train,
      description: 'Estación FEVE El Astillero',
      details: [
        'Línea Santander - Cabezón de la Sal',
        'Estación a 800m del estadio',
        'Trenes cada 30 minutos',
        '10 minutos caminando hasta La Planchada'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop)'
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Campos de Sport La Planchada
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Nuestro hogar desde 1922. Más que un estadio, es el corazón del S.D. Unión Club de Astillero
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stadium Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-20 mb-16">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-secondary-900 mb-2">
                  {facility.value}
                </div>
                <div className="text-sm text-secondary-600">
                  {facility.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stadium Description */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Historia del Estadio</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 text-secondary-700 leading-relaxed">
              <p>
                Los Campos de Sport La Planchada han sido el hogar del S.D. Unión Club de Astillero 
                desde su fundación en 1922. Ubicado en el corazón de El Astillero, este histórico 
                estadio ha sido testigo de más de un siglo de fútbol cántabro.
              </p>
              <p>
                Con una capacidad para 617 espectadores, La Planchada ofrece una atmósfera íntima 
                y familiar que convierte cada partido en una experiencia única. Sus gradas de 
                hormigón y su terreno de hierba natural mantienen el espíritu tradicional del 
                fútbol de siempre.
              </p>
              <p>
                El estadio ha sido renovado en varias ocasiones para mejorar las instalaciones 
                y la comodidad de los aficionados, manteniendo siempre su esencia histórica y 
                su conexión con la comunidad local.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop"
                alt="Vista histórica de La Planchada"
                className="rounded-lg shadow-md w-full"
              />
            </div>
          </div>
        </div>

        {/* Stadium Gallery */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="flex items-center mb-6">
            <Camera className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-3xl font-bold text-secondary-900">Galería del Estadio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stadiumImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Vista ${index + 1} de La Planchada`}
                  className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Location and Transport */}
        <div id="como-llegar" className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Cómo Llegar</h2>
          
          {/* Address */}
          <div className="mb-8 p-6 bg-primary-50 rounded-lg">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold text-secondary-900">Dirección</h3>
            </div>
            <div className="text-secondary-700">
              <div className="text-lg font-medium">Campos de Sport La Planchada</div>
              <div>Avenida Chiclana, s/n</div>
              <div>39610 El Astillero, Cantabria</div>
              <div className="mt-2">
                <strong>Coordenadas GPS:</strong> 43.4089° N, 3.8162° W
              </div>
            </div>
          </div>

          {/* Transport Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transportOptions.map((transport, index) => {
              const Icon = transport.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-secondary-900">
                        {transport.type}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {transport.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-600">
                    {transport.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stadium Map */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Mapa del Estadio</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-secondary-500">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Mapa Interactivo</p>
              <p className="text-sm">Próximamente disponible</p>
            </div>
          </div>
        </div>

        {/* Stadium Rules */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Normas del Estadio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Permitido</h3>
              <ul className="space-y-2 text-secondary-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
                  Banderas y pancartas de apoyo al equipo
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
                  Cámaras fotográficas personales
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
                  Comida y bebida comprada en el estadio
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2"></div>
                  Acceso con silla de ruedas
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Prohibido</h3>
              <ul className="space-y-2 text-secondary-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-error-600 rounded-full mr-3 mt-2"></div>
                  Objetos que puedan ser arrojados
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-error-600 rounded-full mr-3 mt-2"></div>
                  Bengalas y material pirotécnico
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-error-600 rounded-full mr-3 mt-2"></div>
                  Bebidas alcohólicas del exterior
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-error-600 rounded-full mr-3 mt-2"></div>
                  Comportamiento antideportivo
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stadium;