import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, MapPin, ArrowRight, Star, Heart, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchInstagramPosts, convertInstagramPostsToNews } from '../services/instagramService';

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
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-primary-900 via-primary-600 to-secondary-900">
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

      {/* Upcoming Matches */}
      <section className="py-16 bg-gray-50">
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
                    <div>{match.time} - {match.venue}</div>
                  </div>
                  <Link
                    to="/entradas"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-block"
                  >
                    Comprar Entradas
                  </Link>
                </div>
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

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Últimas Noticias
            </h2>
            <p className="text-xl text-secondary-600">
              Mantente al día con todo lo que pasa en el club
            </p>
          </div>

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
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 line-clamp-3">
                    {article.summary}
                  </p>
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
                </div>
              </motion.article>
            ))}
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
                          {article.author && ` • ${article.author}`}
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
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;