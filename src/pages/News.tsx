import React, { useState } from 'react';
import { Calendar, Camera, Trophy, Users, Eye, MessageSquare, Share2, Filter, Grid3X3, List } from 'lucide-react';

const News: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'todas', name: 'Todas', count: 12 },
    { id: 'partidos', name: 'Partidos', count: 5 },
    { id: 'fotos', name: 'Fotos', count: 4 },
    { id: 'club', name: 'Club', count: 3 },
  ];

  const news = [
    {
      id: 1,
      title: 'Victoria contundente ante Nueva Montaña por 4-2',
      summary: 'Gran actuación del primer equipo en La Planchada con goles de Martín, González y doblete de Pérez. El equipo sigue líder invicto.',
      content: 'El S.D. Unión Club de Astillero consiguió una nueva victoria en La Planchada ante Nueva Montaña. El encuentro se desarrolló de manera muy favorable para los locales...',
      category: 'partidos',
      date: '2024-03-08',
      time: '18:30',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Redacción Club',
      views: 145,
      comments: 8,
      featured: true,
    },
    {
      id: 2,
      title: 'Galería: Entrenamiento del primer equipo',
      summary: 'Imágenes del entrenamiento de esta semana en preparación para el próximo partido contra Samano B.',
      content: 'El primer equipo ha trabajado intensamente durante esta semana preparando el próximo encuentro...',
      category: 'fotos',
      date: '2024-03-06',
      time: '16:45',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Fotografía Club',
      views: 89,
      comments: 5,
      featured: false,
      photoCount: 24,
    },
    {
      id: 3,
      title: 'Renovación del convenio con las Escuelas Municipales',
      summary: 'El club renueva su compromiso con la formación de jóvenes talentos de El Astillero y comarca.',
      content: 'El S.D. Unión Club de Astillero ha renovado su convenio de colaboración con las Escuelas Municipales...',
      category: 'club',
      date: '2024-03-05',
      time: '12:00',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Junta Directiva',
      views: 67,
      comments: 12,
      featured: false,
    },
    {
      id: 4,
      title: 'El Marismas vence 4-1 al CD Pontejos',
      summary: 'Excelente partido del equipo filial que sigue líder en su categoría con autoridad.',
      content: 'El equipo Marismas del S.D. Unión Club de Astillero continúa su racha exitosa...',
      category: 'partidos',
      date: '2024-03-03',
      time: '20:15',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Redacción Club',
      views: 112,
      comments: 6,
      featured: false,
    },
    {
      id: 5,
      title: 'Nueva camiseta conmemorativa del centenario',
      summary: 'Presentamos el diseño especial que celebra los 102 años de historia del club.',
      content: 'Con motivo de la celebración de nuestro 102 aniversario, el club presenta una camiseta conmemorativa...',
      category: 'club',
      date: '2024-03-01',
      time: '11:30',
      image: 'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Marketing Club',
      views: 203,
      comments: 15,
      featured: true,
    },
    {
      id: 6,
      title: 'Fotos del partido contra Santoña CF',
      summary: 'Las mejores imágenes del último partido fuera de casa con victoria por 1-2.',
      content: 'Recopilación fotográfica del emocionante encuentro disputado en La Planchada...',
      category: 'fotos',
      date: '2024-02-28',
      time: '21:00',
      image: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
      author: 'Fotografía Club',
      views: 98,
      comments: 4,
      featured: false,
      photoCount: 36,
    },
  ];

  const filteredNews = selectedCategory === 'todas' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const featuredNews = news.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'partidos':
        return Trophy;
      case 'fotos':
        return Camera;
      case 'club':
        return Users;
      default:
        return Calendar;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'partidos':
        return 'bg-primary-100 text-primary-600';
      case 'fotos':
        return 'bg-secondary-100 text-secondary-600';
      case 'club':
        return 'bg-accent-100 text-accent-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Noticias</h1>
            <p className="text-lg text-secondary-600">
              Toda la actualidad del S.D. Unión Club de Astillero
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured News */}
        {featuredNews.length > 0 && selectedCategory === 'todas' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Noticias Destacadas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category);
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                          <CategoryIcon className="w-4 h-4 inline mr-1" />
                          {categories.find(c => c.id === item.category)?.name}
                        </span>
                      </div>
                      {item.photoCount && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          <Camera className="w-4 h-4 inline mr-1" />
                          {item.photoCount} fotos
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-secondary-600 mb-4 line-clamp-3">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(item.date).toLocaleDateString('es-ES')}
                          </div>
                          <div>{item.author}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {item.views}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {item.comments}
                          </div>
                        </div>
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Leer más
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Categorías
              </h3>

              <div className="space-y-2">
                {categories.map((category) => {
                  const CategoryIcon = getCategoryIcon(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100 text-secondary-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <CategoryIcon className="w-4 h-4 mr-2" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm">({category.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* News Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="text-secondary-600">
                  {filteredNews.length} noticias encontradas
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'
                      }`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
              : 'space-y-6'
            }>
              {regularNews.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category);
                
                if (viewMode === 'list') {
                  return (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                            {item.photoCount && (
                              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                <Camera className="w-3 h-3 inline mr-1" />
                                {item.photoCount}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mr-3 ${getCategoryColor(item.category)}`}>
                              <CategoryIcon className="w-3 h-3 inline mr-1" />
                              {categories.find(c => c.id === item.category)?.name}
                            </span>
                            <span className="text-xs text-secondary-500">
                              {new Date(item.date).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-secondary-900 mb-3">
                            {item.title}
                          </h3>
                          <p className="text-secondary-600 mb-4 line-clamp-2">
                            {item.summary}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-secondary-500">
                              Por {item.author}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-secondary-500">
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {item.views}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {item.comments}
                              </div>
                              <button className="text-primary-600 hover:text-primary-700">
                                <Share2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          <CategoryIcon className="w-3 h-3 inline mr-1" />
                          {categories.find(c => c.id === item.category)?.name}
                        </span>
                      </div>
                      {item.photoCount && (
                        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                          <Camera className="w-3 h-3 inline mr-1" />
                          {item.photoCount} fotos
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-secondary-600 mb-3 line-clamp-3">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-secondary-500 mb-3">
                        <div>
                          {new Date(item.date).toLocaleDateString('es-ES')} • {item.author}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {item.views}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {item.comments}
                          </div>
                        </div>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Leer más →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <div className="text-secondary-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  No hay noticias en esta categoría
                </h3>
                <p className="text-secondary-600">
                  Prueba a seleccionar otra categoría o vuelve más tarde
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;