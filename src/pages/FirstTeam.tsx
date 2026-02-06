import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, MapPin, Users, Star, Target, TrendingUp } from 'lucide-react';
import { calendarService, MatchDisplay } from '../services/calendarService';
import { classificationService } from '../services/classificationService';
import { OUR_TEAM_NAME } from '../lib/team';
import PlayerRoster from '../components/PlayerRoster';

const FirstTeam: React.FC = () => {
  const [recentMatches, setRecentMatches] = useState<MatchDisplay[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchDisplay[]>([]);
  const [ourStats, setOurStats] = useState<{ position: number; points: number } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [past, upcoming] = await Promise.all([
        calendarService.getPastMatches(5),
        calendarService.getUpcomingMatches(3),
      ]);
      setRecentMatches(past);
      setUpcomingMatches(upcoming);

      try {
        const standings = await classificationService.getClassification();
        const us = standings.find((t) => t.team.toLowerCase().includes('union'));
        if (us) {
          setOurStats({ position: us.position, points: us.points });
        }
      } catch {
        // classification not available
      }
    };
    loadData();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getResultStatus = (result: string, isHome: boolean) => {
    const [home, away] = result.split('-').map(Number);
    const ours = isHome ? home : away;
    const theirs = isHome ? away : home;
    if (ours > theirs) return 'win';
    if (ours < theirs) return 'loss';
    return 'draw';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop)',
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Primer Equipo</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">
              Segunda Regional Grupo C - Temporada 2025/26
            </p>
            <div className="text-lg font-medium">"Unidos por la misma pasion"</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {ourStats && (
          <div className="grid grid-cols-2 gap-4 -mt-16 relative z-20 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{ourStats.position}&#186;</div>
              <div className="text-sm text-secondary-600">Posicion Liga</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{ourStats.points}</div>
              <div className="text-sm text-secondary-600">Puntos</div>
            </div>
          </div>
        )}

        {!ourStats && <div className="mb-16" />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
              Ultimos Resultados
            </h2>

            {recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match) => {
                  const status = match.result ? getResultStatus(match.result, match.isHome) : null;
                  const homeName = match.isHome ? OUR_TEAM_NAME : match.opponent;
                  const awayName = match.isHome ? match.opponent : OUR_TEAM_NAME;
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-secondary-900">
                          {homeName} vs {awayName}
                        </div>
                        <div className="text-sm text-secondary-600">
                          {formatDate(match.date)} - {match.isHome ? 'Local' : 'Visitante'}
                        </div>
                      </div>
                      {match.result && status && (
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            status === 'win'
                              ? 'bg-green-100 text-green-800'
                              : status === 'loss'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {match.result}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-3" />
                Cargando resultados...
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 text-primary-600 mr-3" />
              Proximos Partidos
            </h2>

            {upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.map((match) => {
                  const homeName = match.isHome ? OUR_TEAM_NAME : match.opponent;
                  const awayName = match.isHome ? match.opponent : OUR_TEAM_NAME;
                  return (
                    <div key={match.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="font-semibold text-secondary-900 mb-2">
                        {homeName} vs {awayName}
                      </div>
                      <div className="flex items-center text-sm text-secondary-600 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(match.date)}
                        </div>
                        <div>{match.time}h</div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {match.isHome ? 'Local' : 'Visitante'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-400">
                No hay proximos partidos programados
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <PlayerRoster teamSlug="primer-equipo" />
        </div>

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
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Ascenso</h3>
              <p className="text-secondary-600">
                Pelear por las primeras posiciones y lograr el ascenso a Primera Regional
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Desarrollo de Cantera</h3>
              <p className="text-secondary-600">
                Integrar jovenes talentos de nuestras categorias inferiores en el primer equipo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Juego Atractivo</h3>
              <p className="text-secondary-600">
                Mantener un estilo de juego ofensivo y atractivo que emocione a nuestra aficion
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-600 rounded-lg shadow-lg p-8 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Filosofia del Equipo</h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            "Nuestro primer equipo representa los valores historicos del S.D. Union Club de Astillero:
            trabajo, humildad, sacrificio y pasion. Cada jugador que viste nuestra camiseta lleva
            consigo mas de 100 anos de historia y el orgullo de representar a El Astillero."
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirstTeam;
