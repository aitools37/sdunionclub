import React from 'react';
import { Trophy, Users, Star, Target } from 'lucide-react';
import PlayerRoster from '../components/PlayerRoster';

const Marismas: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gradient-to-r from-secondary-600 to-primary-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop)',
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Marismas</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Equipo filial - Temporada 2025/26
            </p>
            <div className="text-lg font-medium">"El futuro del club"</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mt-12 mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">Sobre el Equipo Marismas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 text-secondary-700 leading-relaxed">
              <p>
                El equipo Marismas representa el futuro del S.D. Union Club de Astillero.
                Formado principalmente por jovenes talentos, este equipo sirve como puente
                fundamental entre nuestras categorias de formacion y el primer equipo.
              </p>
              <p>
                El Marismas ha demostrado ser una cantera excepcional, con varios jugadores
                que han dado el salto al primer equipo en los ultimos anos.
              </p>
              <p>
                Su filosofia de juego se basa en la posesion del balon, el juego combinativo
                y la presion alta, preparando a los jovenes para el futbol de mayor nivel.
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

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <PlayerRoster teamSlug="marismas-juvenil" />
        </div>

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
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Formacion Integral</h3>
              <p className="text-secondary-600">
                Desarrollo tecnico, tactico y personal de cada jugador para su progresion al primer equipo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Competitividad</h3>
              <p className="text-secondary-600">
                Mantener el nivel competitivo alto para preparar a los jugadores para categorias superiores
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Mentalidad Ganadora</h3>
              <p className="text-secondary-600">
                Inculcar los valores del club y la mentalidad necesaria para representar al Union
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-600 rounded-lg shadow-lg p-8 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Cantera del Club</h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            "El Marismas es pieza clave en el proyecto deportivo del S.D. Union Club de Astillero,
            dando oportunidad a los jovenes de la zona de formarse y crecer como futbolistas
            dentro de la familia unionista."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Marismas;
