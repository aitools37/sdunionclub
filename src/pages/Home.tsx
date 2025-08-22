import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, MapPin, ArrowRight, Star, Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts, convertInstagramPostsToNews, INSTAGRAM_PROFILE } from '../services/instagramService';

const Home: React.FC = () => {
  const [instagramNews, setInstagramNews] = React.useState<any[]>([]);
  const [loadingInstagram, setLoadingInstagram] = React.useState(true);

  React.useEffect(() => {
    const loadInstagramPosts = async () => {
      try {
        const posts = await fetchInstagramPosts(6);
        const newsData = convertInstagramPostsToNews(posts);
        setInstagramNews(newsData);
      } catch (error) {
        console.error('Error loading Instagram posts:', error);
      } finally {
        setLoadingInstagram(false);
      }
    };

    loadInstagramPosts();
  }, []);

  const stats = [
    { label: 'Años de Historia', value: '102', icon: Trophy },
    { label: 'Socios Activos', value: '1,250', icon: Users },
    { label: 'Capacidad Estadio', value: '617', icon: MapPin },
    { label: 'Equipos', value: '8', icon: Star },
  ];

  const upcomingMatches = [
    {
      id: 1,
      opponent: 'CD Laredo',
      date: '2024-03-15',
      time: '17:00',
      venue: 'La Planchada',
      competition: 'Segunda Regional',
    },
    {
      id: 2,
      opponent: 'UD Samano',
      date: '2024-03-22',
      time: '16:30',
      venue: 'Campo Municipal Samano',
      competition: 'Segunda Regional',
    },
    {
      id: 3,
      opponent: 'Real Racing Santander B',
      date: '2024-03-29',
      time: '18:00',
      venue: 'La Planchada',
      competition: 'Segunda Regional',
    },
  ];

  // Use Instagram news or fallback to static news
  const news = instagramNews.length > 0 ? instagramNews : [
    {
      id: 1,
      title: 'Victoria contundente ante el CD Laredo por 3-0',
      summary: 'Gran actuación del primer equipo en La Planchada con goles de Martín, González y Pérez.',
      date: '2024-03-08',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'Redacción Club',
      views: 145,
      comments: 8,
      category: 'partidos',
    },
    {
      id: 2,
      title: 'Renovación del convenio con las Escuelas Municipales',
      summary: 'El club renueva su compromiso con la formación de jóvenes talentos de El Astillero.',
      date: '2024-03-05',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'Junta Directiva',
      views: 67,
      comments: 12,
      category: 'club',
    },
    {
      id: 3,
      title: 'Nueva camiseta conmemorativa del centenario',
      summary: 'Presentamos el diseño especial que celebra los 102 años de historia del club.',
      date: '2024-03-01',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      author: 'Marketing Club',
      views: 203,
      comments: 15,
      category: 'club',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-r from-primary-900 via-primary-600 to-secondary-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="block">S.D. Unión Club</span>
              <span className="block text-primary-300">de Astillero</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Unidos desde 1922, representando con orgullo a El Astillero en cada partido
            </p>
            <div className="text-2xl font-semibold text-primary-300 mb-8">
              "Unidos se vence siempre"
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/entradas"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Comprar Entradas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/hazte-socio"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Hazte Socio
                <Heart className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest News Carousel - Moved up */}
      <section className="py-12 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Últimas Noticias
            </h2>
            <p className="text-xl text-secondary-600">
              Mantente al día con toda la actualidad del club
            </p>
            {!loadingInstagram && instagramNews.length > 0 && (
              <div className="flex items-center justify-center text-sm text-secondary-500 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Actualizadas desde <a 
                  href={INSTAGRAM_PROFILE.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  {INSTAGRAM_PROFILE.displayName}
                </a>
              </div>
            )}
          </div>

          {loadingInstagram ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-4 text-secondary-600">Cargando noticias...</span>
            </div>
          ) : (
            <NewsCarousel news={instagramNews.length > 0 ? instagramNews : news} />
          )}
        </div>
      </section>

      {/* Stats Section */}
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
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
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

      {/* Latest News Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Todas las Noticias
            </h2>
          </div>

          {loadingInstagram ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-secondary-500 mb-2">
                      {new Date(article.date).toLocaleDateString('es-ES')}
                      {article.author && ` • ${article.author}`}
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-secondary-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    {(article.views || article.comments) && (
                      <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-500">
                        {article.views && <span>👁 {article.views}</span>}
                        {article.comments && <span>💬 {article.comments}</span>}
                      </div>
                    )}
                    {article.instagramUrl ? (
                      <a
                        href={article.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 font-semibold inline-flex items-center"
                      >
                        Ver en Instagram
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    ) : (
                      <button className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
                        Leer más
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Link to main Instagram profile */}
                    {instagramNews.length === 0 && (
                      <div className="mt-4">
                        <a
                          href={INSTAGRAM_PROFILE.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 text-sm font-medium inline-flex items-center"
                        >
                          Ver en Instagram {INSTAGRAM_PROFILE.displayName}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                      </div>
                    )}</parameter>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/noticias"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver todas las noticias
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Próximos Partidos
            </h2>
            <p className="text-xl text-secondary-600">
              No te pierdas ningún encuentro en La Planchada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-center">
                  <div className="text-sm text-primary-600 font-semibold mb-2">
                    {match.competition}
                  </div>
                  <div className="text-2xl font-bold text-secondary-900 mb-4">
                    UCA vs {match.opponent}
                  </div>
                  <div className="space-y-2 text-secondary-600 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(match.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}</span>
                    </div>
                  </div>
                  <Link
                    to="/entradas"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
                  >
                    Comprar Entradas
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/calendario"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver calendario completo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para formar parte de la familia?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Únete a más de 1,250 socios que apoyan al S.D. Unión Club de Astillero 
              en cada partido y en cada momento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/hazte-socio"
                className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Hazte Socio
                <Users className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/tienda"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Visita la Tienda
                <Target className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// News Carousel Component
interface NewsCarouselProps {
  news: any[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ news }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Auto-advance carousel
  React.useEffect(() => {
    if (!isAutoPlaying || news.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, news.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % news.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + news.length) % news.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">No hay noticias disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl bg-white">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {news.map((article, index) => (
            <div key={article.id} className="w-full flex-shrink-0">
              <div className="lg:flex lg:h-96">
                {/* Image */}
                <div className="lg:w-1/2">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  {article.instagramUrl && (
                    <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Instagram
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      article.category === 'partidos' ? 'bg-primary-100 text-primary-600' :
                      article.category === 'fotos' ? 'bg-secondary-100 text-secondary-600' :
                      'bg-accent-100 text-accent-600'
                    }`}>
                      {article.category === 'partidos' ? '⚽ Partidos' :
                       article.category === 'fotos' ? '📸 Galería' :
                       '🏆 Club'}
                    </span>
                    <span className="text-sm text-secondary-500 ml-3">
                      {new Date(article.date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6 line-clamp-3 text-lg leading-relaxed">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      {article.views && <span>👁 {article.views}</span>}
                      {article.comments && <span>💬 {article.comments}</span>}
                    </div>
                    
                    {article.instagramUrl ? (
                      <a
                        href={article.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver en Instagram
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        to="/noticias"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                      >
                        Leer más
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-secondary-800 p-3 rounded-full shadow-lg transition-colors z-10"
      >
        <ArrowRight className="w-6 h-6 transform rotate-180" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-secondary-800 p-3 rounded-full shadow-lg transition-colors z-10"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isAutoPlaying 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isAutoPlaying ? '▶ Auto' : '⏸ Pausado'}
        </div>
      </div>
    </div>
  );
};
export default Home;