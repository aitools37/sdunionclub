import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Trophy, ArrowRight, Heart,
  Ticket, ShoppingBag, TrendingUp, Newspaper,
  ChevronLeft, ChevronRight, MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MatchTicker from '../components/MatchTicker';
import StandingsWidget from '../components/StandingsWidget';
import SocialFeed from '../components/SocialFeed';

import { calendarService, MatchDisplay } from '../services/calendarService';
import { fetchInstagramPosts, convertInstagramPostsToNews } from '../services/instagramService';
import { classificationService } from '../services/classificationService';

const Home: React.FC = () => {
  const [nextMatch, setNextMatch] = useState<MatchDisplay | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchDisplay[]>([]);
  const [recentResults, setRecentResults] = useState<MatchDisplay[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [loadingNews, setLoadingNews] = useState(true);
  const [ourPosition, setOurPosition] = useState<number | null>(null);
  const [ourPoints, setOurPoints] = useState<number | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const loadData = async () => {
      const [next, upcoming, past] = await Promise.all([
        calendarService.getNextMatch(),
        calendarService.getUpcomingMatches(3),
        calendarService.getPastMatches(3),
      ]);
      setNextMatch(next);
      setUpcomingMatches(upcoming);
      setRecentResults(past);

      try {
        const standings = await classificationService.getClassification();
        const ourTeam = standings.find((team) => team.team.toLowerCase().includes('union'));
        if (ourTeam) {
          setOurPosition(ourTeam.position);
          setOurPoints(ourTeam.points);
        }
      } catch (error) {
        console.error('Error loading standings:', error);
      }

      try {
        const posts = await fetchInstagramPosts(6);
        const newsData = convertInstagramPostsToNews(posts);
        setNews(newsData);
      } catch (error) {
        console.error('Error loading Instagram:', error);
      } finally {
        setLoadingNews(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!nextMatch) return;
    const tick = () => {
      const matchDateTime = new Date(`${nextMatch.date}T${nextMatch.time}:00`);
      const diff = matchDateTime.getTime() - Date.now();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [nextMatch]);

  useEffect(() => {
    if (news.length <= 1) return;
    const timer = setInterval(() => setCurrentNewsIndex((prev) => (prev + 1) % news.length), 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatMatchDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getResultColor = (result: string, isHome: boolean) => {
    const [home, away] = result.split('-').map(Number);
    const ourScore = isHome ? home : away;
    const theirScore = isHome ? away : home;
    if (ourScore > theirScore) return 'bg-green-500';
    if (ourScore < theirScore) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary-950/80 via-secondary-900/70 to-secondary-950/90" />
        </div>

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 lg:py-40">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white/90">Temporada 2025-2026</span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white uppercase leading-[0.9] mb-6">
                  <span className="block">Union</span>
                  <span className="block">Club de</span>
                  <span className="block text-primary-400">Astillero</span>
                </h1>

                <p className="text-lg sm:text-xl text-white/60 mb-10 max-w-lg font-light">
                  Mas de 100 anos de historia, pasion y futbol en El Astillero, Cantabria.
                </p>

                {(ourPosition || ourPoints) && (
                  <div className="flex items-center space-x-6 mb-10">
                    {ourPosition && (
                      <div>
                        <div className="font-display text-4xl font-bold text-primary-400">{ourPosition}&#186;</div>
                        <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Posicion</div>
                      </div>
                    )}
                    {ourPosition && ourPoints && <div className="w-px h-10 bg-white/20" />}
                    {ourPoints && (
                      <div>
                        <div className="font-display text-4xl font-bold text-primary-400">{ourPoints}</div>
                        <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Puntos</div>
                      </div>
                    )}
                    <div className="w-px h-10 bg-white/20" />
                    <div>
                      <div className="font-display text-4xl font-bold text-white">103</div>
                      <div className="text-xs text-white/50 uppercase tracking-widest mt-1">Anos</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/entradas"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-primary-600/30 inline-flex items-center justify-center"
                  >
                    <Ticket className="mr-2 w-5 h-5" />
                    Comprar Entradas
                  </Link>
                  <Link
                    to="/hazte-socio"
                    className="border-2 border-white/30 hover:border-white hover:bg-white hover:text-secondary-900 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide transition-all inline-flex items-center justify-center"
                  >
                    <Heart className="mr-2 w-5 h-5" />
                    Hazte Socio
                  </Link>
                </div>
              </motion.div>

              {nextMatch && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="hidden lg:block"
                >
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                    <div className="text-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary-400">
                        Proximo Partido
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <div className="flex flex-col items-center space-y-3 flex-1">
                        <div className="w-20 h-20 bg-white rounded-xl p-2">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png"
                            alt="UCA"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-white font-bold text-sm">
                          {nextMatch.isHome ? 'UCA' : nextMatch.opponent.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                      <div className="px-6 text-center">
                        <div className="text-white/40 text-sm font-medium mb-2 capitalize">{formatDate(nextMatch.date)}</div>
                        <div className="font-display text-3xl font-bold text-white">{nextMatch.time}h</div>
                      </div>
                      <div className="flex flex-col items-center space-y-3 flex-1">
                        <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center">
                          <span className="text-3xl font-bold text-white/60">
                            {(nextMatch.isHome ? nextMatch.opponent : 'UCA').charAt(0)}
                          </span>
                        </div>
                        <span className="text-white font-bold text-sm">
                          {nextMatch.isHome ? nextMatch.opponent.split(' ').slice(0, 2).join(' ') : 'UCA'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {[
                        { value: countdown.days, label: 'Dias' },
                        { value: countdown.hours, label: 'Hrs' },
                        { value: countdown.minutes, label: 'Min' },
                        { value: countdown.seconds, label: 'Seg' },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/10 rounded-lg py-3 text-center">
                          <div className="font-display text-2xl font-bold text-white tabular-nums">
                            {String(item.value).padStart(2, '0')}
                          </div>
                          <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center space-x-4 text-white/50 text-xs">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{nextMatch.venue}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3" />
                        <span>{nextMatch.competition}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10 pb-8 text-center"
        >
          <div className="w-5 h-8 border-2 border-white/30 rounded-full mx-auto flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      <MatchTicker />

      {/* MAIN CONTENT */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* News */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title text-secondary-900">
                    <Newspaper className="w-7 h-7 text-primary-600 inline mr-3 -mt-1" />
                    Noticias
                  </h2>
                  <Link to="/noticias" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center">
                    Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {loadingNews ? (
                  <div className="bg-white rounded-2xl shadow-sm h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                  </div>
                ) : news.length > 0 ? (
                  <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentNewsIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="aspect-[16/9] relative">
                          <img
                            src={news[currentNewsIndex]?.image}
                            alt={news[currentNewsIndex]?.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded mb-3">
                              {news[currentNewsIndex]?.category === 'partidos'
                                ? 'Partidos'
                                : news[currentNewsIndex]?.category === 'fotos'
                                  ? 'Galeria'
                                  : 'Club'}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
                              {news[currentNewsIndex]?.title}
                            </h3>
                            <p className="text-white/70 text-sm line-clamp-2 max-w-xl">
                              {news[currentNewsIndex]?.summary}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {news.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + news.length) % news.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5 text-secondary-700" />
                        </button>
                        <button
                          onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % news.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5 text-secondary-700" />
                        </button>
                        <div className="absolute bottom-20 sm:bottom-24 left-6 sm:left-8 flex space-x-2">
                          {news.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentNewsIndex(idx)}
                              className={`h-1 rounded-full transition-all ${
                                idx === currentNewsIndex ? 'bg-white w-8' : 'bg-white/40 w-4'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm h-80 flex items-center justify-center text-secondary-400">
                    No hay noticias disponibles
                  </div>
                )}
              </div>

              {/* Upcoming Matches */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="section-title text-secondary-900">
                    <Calendar className="w-7 h-7 text-primary-600 inline mr-3 -mt-1" />
                    Proximos Partidos
                  </h2>
                  <Link to="/calendario" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center">
                    Calendario <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {upcomingMatches.length > 0 ? (
                    upcomingMatches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-1.5 h-12 rounded-full ${match.isHome ? 'bg-primary-500' : 'bg-secondary-300'}`}
                          />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  match.isHome ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {match.isHome ? 'Local' : 'Visitante'}
                              </span>
                              <span className="text-xs text-secondary-400">{match.competition}</span>
                            </div>
                            <p className="font-semibold text-secondary-900">
                              {match.isHome ? 'UCA' : match.opponent} vs {match.isHome ? match.opponent : 'UCA'}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-secondary-400 mt-1">
                              <span className="capitalize">{formatMatchDate(match.date)}</span>
                              <span>{match.time}h</span>
                              <span className="hidden sm:inline">{match.venue}</span>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/entradas"
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 opacity-80 group-hover:opacity-100"
                        >
                          <Ticket className="w-4 h-4" />
                          <span className="hidden sm:inline">Entradas</span>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-8 shadow-sm text-center text-secondary-400">
                      No hay partidos programados
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Results */}
              {recentResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="section-title text-secondary-900">
                      <Trophy className="w-7 h-7 text-yellow-500 inline mr-3 -mt-1" />
                      Resultados
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {recentResults.map((match) => (
                      <div
                        key={match.id}
                        className="bg-white rounded-xl p-5 shadow-sm text-center hover:shadow-md transition-all"
                      >
                        <div className="text-xs text-secondary-400 capitalize mb-3">{formatMatchDate(match.date)}</div>
                        <div className="flex items-center justify-center space-x-3 mb-3">
                          <span className={`font-bold ${match.isHome ? 'text-secondary-900' : 'text-secondary-500'}`}>
                            {match.isHome ? 'UCA' : match.opponent.split(' ').slice(0, 2).join(' ')}
                          </span>
                          {match.result && (
                            <span
                              className={`${getResultColor(match.result, match.isHome)} text-white px-3 py-1 rounded-lg font-bold text-lg`}
                            >
                              {match.result}
                            </span>
                          )}
                          <span className={`font-bold ${!match.isHome ? 'text-secondary-900' : 'text-secondary-500'}`}>
                            {match.isHome ? match.opponent.split(' ').slice(0, 2).join(' ') : 'UCA'}
                          </span>
                        </div>
                        <div className="text-xs text-secondary-400">{match.venue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-8">
              <StandingsWidget showCount={6} />

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <SocialFeed limit={6} layout="grid" />
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-900 to-secondary-950 p-8 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-3 block">
                    Unete al club
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase mb-3">Hazte Socio</h3>
                  <p className="text-secondary-400 text-sm mb-6 leading-relaxed">
                    Unete a mas de 1,250 socios que apoyan al club en cada partido.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {['Entrada gratuita a partidos locales', 'Descuentos en la tienda oficial', 'Contenido exclusivo'].map(
                      (item) => (
                        <li key={item} className="flex items-center text-sm text-secondary-300">
                          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                  <Link
                    to="/hazte-socio"
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3.5 rounded-lg font-bold uppercase tracking-wide transition-colors"
                  >
                    Mas Informacion
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-secondary-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-4 block">
              Se parte de la familia
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase mb-6">
              Listo para unirte?
            </h2>
            <p className="text-xl text-secondary-400 mb-10 max-w-2xl mx-auto">
              Unete a la familia del S.D. Union Club de Astillero y vive cada partido como nunca.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/hazte-socio"
                className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-lg font-bold uppercase tracking-wide transition-all hover:shadow-lg hover:shadow-primary-600/30 inline-flex items-center justify-center"
              >
                <Users className="mr-2 w-5 h-5" />
                Hazte Socio
              </Link>
              <Link
                to="/tienda"
                className="border-2 border-white/30 hover:border-white hover:bg-white hover:text-secondary-900 text-white px-10 py-4 rounded-lg font-bold uppercase tracking-wide transition-all inline-flex items-center justify-center"
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                Visita la Tienda
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
