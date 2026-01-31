import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Users, Trophy, MapPin, ArrowRight, Star, Heart, 
  Target, Ticket, ShoppingBag, TrendingUp, Newspaper, Play,
  ChevronLeft, ChevronRight, Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import NextMatchCountdown from '../components/NextMatchCountdown';
import StandingsWidget from '../components/StandingsWidget';
import MatchCard from '../components/MatchCard';
import SocialFeed from '../components/SocialFeed';

// Services
import { calendarService, MatchDisplay } from '../services/calendarService';
import { fetchInstagramPosts, convertInstagramPostsToNews, INSTAGRAM_PROFILE } from '../services/instagramService';
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

  useEffect(() => {
    const loadData = async () => {
      // Load matches
      const [next, upcoming, past] = await Promise.all([
        calendarService.getNextMatch(),
        calendarService.getUpcomingMatches(3),
        calendarService.getPastMatches(3)
      ]);
      
      setNextMatch(next);
      setUpcomingMatches(upcoming);
      setRecentResults(past);

      // Load classification data for our team
      try {
        const standings = await classificationService.getClassification();
        const ourTeam = standings.find(team => 
          team.team.toLowerCase().includes('union')
        );
        if (ourTeam) {
          setOurPosition(ourTeam.position);
          setOurPoints(ourTeam.points);
        }
      } catch (error) {
        console.error('Error loading standings:', error);
      }

      // Load Instagram posts
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

  // Auto-advance news carousel
  useEffect(() => {
    if (news.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentNewsIndex(prev => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  const stats = [
    { label: 'Años de Historia', value: '103', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Socios Activos', value: '1,250', icon: Users, color: 'text-primary-500' },
    { label: 'Posición Actual', value: ourPosition ? `${ourPosition}º` : '-', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Puntos', value: ourPoints?.toString() || '-', icon: Star, color: 'text-orange-500' },
  ];

  const quickLinks = [
    { name: 'Entradas', icon: Ticket, path: '/entradas', color: 'bg-primary-600 hover:bg-primary-700' },
    { name: 'Calendario', icon: Calendar, path: '/calendario', color: 'bg-secondary-600 hover:bg-secondary-700' },
    { name: 'Clasificación', icon: TrendingUp, path: '/clasificacion', color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Tienda', icon: ShoppingBag, path: '/tienda', color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Fullscreen with Video/Image background */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-secondary-900/95" />
          
          {/* Animated overlay pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Temporada 2025-2026</span>
            </div>

            {/* Club Logo */}
            <div className="mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png"
                alt="S.D. Unión Club de Astillero"
                className="w-28 h-28 mx-auto drop-shadow-2xl"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4">
              <span className="block">S.D. Unión Club</span>
              <span className="block text-primary-300">de Astillero</span>
            </h1>

            {/* Motto */}
            <p className="text-xl sm:text-2xl text-white/80 mb-8 font-light italic">
              "Unidos se vence siempre"
            </p>

            {/* Stats Row */}
            {(ourPosition || ourPoints) && (
              <div className="flex items-center justify-center space-x-8 mb-8">
                {ourPosition && (
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary-300">{ourPosition}º</div>
                    <div className="text-sm text-white/60">Posición</div>
                  </div>
                )}
                <div className="w-px h-12 bg-white/20" />
                {ourPoints && (
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary-300">{ourPoints}</div>
                    <div className="text-sm text-white/60">Puntos</div>
                  </div>
                )}
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary-300">103</div>
                  <div className="text-sm text-white/60">Años</div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/entradas"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 hover:shadow-xl inline-flex items-center justify-center"
              >
                <Ticket className="mr-2 w-5 h-5" />
                Comprar Entradas
              </Link>
              <Link
                to="/hazte-socio"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-4 rounded-lg font-bold transition-all inline-flex items-center justify-center"
              >
                <Heart className="mr-2 w-5 h-5" />
                Hazte Socio
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Quick Links Bar */}
      <section className="bg-white shadow-md -mt-8 relative z-20 mx-4 sm:mx-8 lg:mx-auto lg:max-w-5xl rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`${link.color} text-white p-4 sm:p-6 text-center transition-all hover:opacity-90 ${
                  index < quickLinks.length - 1 ? 'border-r border-white/10' : ''
                }`}
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <span className="text-sm sm:text-base font-semibold">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Next Match Countdown */}
      {nextMatch && (
        <NextMatchCountdown
          match={{
            id: nextMatch.id,
            opponent: nextMatch.opponent,
            date: nextMatch.date,
            time: nextMatch.time,
            venue: nextMatch.venue,
            competition: nextMatch.competition,
            isHome: nextMatch.isHome
          }}
        />
      )}

      {/* Main Content Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* News Section - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured News Carousel */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-xl font-bold text-secondary-900 flex items-center">
                    <Newspaper className="w-5 h-5 text-primary-600 mr-2" />
                    Últimas Noticias
                  </h2>
                  <Link
                    to="/noticias"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {loadingNews ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                  </div>
                ) : news.length > 0 ? (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentNewsIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        <div className="aspect-video relative">
                          <img
                            src={news[currentNewsIndex]?.image}
                            alt={news[currentNewsIndex]?.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full mb-3">
                              {news[currentNewsIndex]?.category === 'partidos' ? '⚽ Partidos' :
                               news[currentNewsIndex]?.category === 'fotos' ? '📸 Galería' : '🏆 Club'}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
                              {news[currentNewsIndex]?.title}
                            </h3>
                            <p className="text-white/80 text-sm line-clamp-2 mb-4">
                              {news[currentNewsIndex]?.summary}
                            </p>
                            {news[currentNewsIndex]?.instagramUrl ? (
                              <a
                                href={news[currentNewsIndex].instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-white font-semibold hover:text-primary-300 transition-colors"
                              >
                                <Instagram className="w-4 h-4 mr-2" />
                                Ver en Instagram
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </a>
                            ) : (
                              <Link
                                to="/noticias"
                                className="inline-flex items-center text-white font-semibold hover:text-primary-300 transition-colors"
                              >
                                Leer más
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {news.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentNewsIndex(prev => (prev - 1 + news.length) % news.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5 text-secondary-700" />
                        </button>
                        <button
                          onClick={() => setCurrentNewsIndex(prev => (prev + 1) % news.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5 text-secondary-700" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2">
                          {news.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentNewsIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentNewsIndex ? 'bg-white w-6' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-secondary-500">
                    No hay noticias disponibles
                  </div>
                )}
              </div>

              {/* Upcoming Matches */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary-900 flex items-center">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    Próximos Partidos
                  </h2>
                  <Link
                    to="/calendario"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    Ver calendario <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingMatches.length > 0 ? (
                    upcomingMatches.map(match => (
                      <MatchCard 
                        key={match.id} 
                        match={{
                          id: match.id,
                          opponent: match.opponent,
                          date: match.date,
                          time: match.time,
                          venue: match.venue,
                          competition: match.competition,
                          isHome: match.isHome
                        }} 
                        variant="compact" 
                      />
                    ))
                  ) : (
                    <p className="text-center text-secondary-500 py-8">
                      No hay partidos programados
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Results */}
              {recentResults.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-secondary-900 flex items-center">
                      <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                      Últimos Resultados
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {recentResults.map(match => (
                      <MatchCard 
                        key={match.id} 
                        match={{
                          id: match.id,
                          opponent: match.opponent,
                          date: match.date,
                          time: match.time,
                          venue: match.venue,
                          competition: match.competition,
                          isHome: match.isHome,
                          result: match.result
                        }} 
                        variant="compact"
                        showTicketButton={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Standings Widget */}
              <StandingsWidget showCount={6} />

              {/* Instagram Feed */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <SocialFeed limit={6} layout="grid" />
              </div>

              {/* Become a Member CTA */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">¡Hazte Socio!</h3>
                <p className="text-primary-100 mb-6 text-sm">
                  Únete a más de 1,250 socios que apoyan al club en cada partido
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary-300 rounded-full mr-3" />
                    Entrada gratuita a partidos locales
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary-300 rounded-full mr-3" />
                    Descuentos en la tienda oficial
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary-300 rounded-full mr-3" />
                    Contenido exclusivo
                  </li>
                </ul>
                <Link
                  to="/hazte-socio"
                  className="block w-full bg-white text-primary-600 text-center py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Más Información
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-secondary-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              ¿Listo para formar parte de la familia?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Únete a más de 1,250 socios que apoyan al S.D. Unión Club de Astillero 
              en cada partido y en cada momento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/hazte-socio"
                className="bg-white hover:bg-gray-100 text-primary-600 px-10 py-4 rounded-lg font-bold transition-all transform hover:scale-105 shadow-xl inline-flex items-center justify-center"
              >
                <Users className="mr-2 w-5 h-5" />
                Hazte Socio
              </Link>
              <Link
                to="/tienda"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-10 py-4 rounded-lg font-bold transition-all inline-flex items-center justify-center"
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
