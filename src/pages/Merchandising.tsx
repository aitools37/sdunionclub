import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Star, Heart, ShoppingCart, Filter, Grid3X3, List } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

const Merchandising: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCartStore();

  const products = [
    {
      id: 'bufanda-1',
      name: 'Bufanda Oficial Verde',
      price: 15,
      image: 'https://images.pexels.com/photos/7689734/pexels-photo-7689734.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'bufandas',
      rating: 4.5,
      reviews: 32,
      description: 'Bufanda oficial en colores verde con el escudo del club bordado.',
    },
    {
      id: 'bufanda-2',
      name: 'Bufanda Clásica Unionista',
      price: 18,
      image: 'https://images.pexels.com/photos/7689734/pexels-photo-7689734.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'bufandas',
      rating: 4.7,
      reviews: 28,
      description: 'Bufanda clásica con los colores tradicionales del club y el lema "Unidos se vence siempre".',
    },
    {
      id: 'gorra-1',
      name: 'Gorra Bordada Verde',
      price: 12,
      image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'gorras',
      rating: 4.6,
      reviews: 24,
      description: 'Gorra ajustable con escudo bordado y visera curvada en color verde.',
    },
    {
      id: 'gorra-2',
      name: 'Gorra Negra Premium',
      price: 16,
      image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'gorras',
      rating: 4.8,
      reviews: 19,
      description: 'Gorra premium en negro con detalles en verde y escudo bordado en relieve.',
    },
    {
      id: 'llavero-1',
      name: 'Llavero Escudo Metal',
      price: 5,
      image: 'https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'llaveros',
      rating: 4.3,
      reviews: 45,
      description: 'Llavero metálico con el escudo del club en relieve.',
    },
    {
      id: 'llavero-2',
      name: 'Llavero Balón Miniatura',
      price: 7,
      image: 'https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'llaveros',
      rating: 4.4,
      reviews: 38,
      description: 'Llavero en forma de balón miniatura con los colores del club.',
    },
    {
      id: 'pulsera-1',
      name: 'Pulsera de Silicona Verde',
      price: 3,
      image: 'https://images.pexels.com/photos/1213447/pexels-photo-1213447.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'pulseras',
      rating: 4.2,
      reviews: 52,
      description: 'Pulsera de silicona en verde con el nombre del club grabado.',
    },
    {
      id: 'pulsera-2',
      name: 'Pulsera Tejida Unionista',
      price: 8,
      image: 'https://images.pexels.com/photos/1213447/pexels-photo-1213447.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'pulseras',
      rating: 4.6,
      reviews: 29,
      description: 'Pulsera tejida con los colores del club y cierre ajustable.',
    },
    {
      id: 'pin-1',
      name: 'Pin Escudo Esmaltado',
      price: 4,
      image: 'https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'pines',
      rating: 4.5,
      reviews: 22,
      description: 'Pin esmaltado con el escudo oficial del club.',
    },
    {
      id: 'taza-1',
      name: 'Taza Oficial del Club',
      price: 10,
      image: 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      category: 'otros',
      rating: 4.4,
      reviews: 16,
      description: 'Taza de cerámica con el escudo del club y el lema unionista.',
    },
  ];

  const categories = [
    { id: 'todos', name: 'Todos los productos', count: products.length },
    { id: 'bufandas', name: 'Bufandas', count: products.filter(p => p.category === 'bufandas').length },
    { id: 'gorras', name: 'Gorras', count: products.filter(p => p.category === 'gorras').length },
    { id: 'llaveros', name: 'Llaveros', count: products.filter(p => p.category === 'llaveros').length },
    { id: 'pulseras', name: 'Pulseras', count: products.filter(p => p.category === 'pulseras').length },
    { id: 'otros', name: 'Otros', count: products.filter(p => p.category === 'otros' || p.category === 'pines').length },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'todos') {
      if (selectedCategory === 'otros') {
        filtered = filtered.filter(product => product.category === 'otros' || product.category === 'pines');
      } else {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} añadido al carrito`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/tienda"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a tienda
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Merchandising</h1>
          <p className="text-lg text-secondary-600">
            Accesorios y productos oficiales del S.D. Unión Club de Astillero
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-3">Categorías</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-100 text-secondary-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-3">Precio</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                  <div className="text-sm text-secondary-600">
                    Hasta €{priceRange[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="text-secondary-600">
                  {filteredProducts.length} productos encontrados
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="name">Ordenar por nombre</option>
                    <option value="price-low">Precio: menor a mayor</option>
                    <option value="price-high">Precio: mayor a menor</option>
                    <option value="rating">Mejor valorados</option>
                  </select>
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

            {/* Products */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-w-1 aspect-h-1 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                          <Heart className="w-4 h-4 text-secondary-400" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-secondary-500 ml-2">
                            ({product.reviews})
                          </span>
                        </div>
                        <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary-600">
                            €{product.price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Añadir
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-secondary-500 ml-2">
                            ({product.reviews})
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-secondary-600 mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary-600">
                            €{product.price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Añadir al carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-secondary-400 mb-4">
                  <Grid3X3 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-secondary-600">
                  Prueba a ajustar los filtros o buscar otros términos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-secondary-900 mb-6">Información Importante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">Sobre los Productos</h4>
              <ul className="space-y-2 text-secondary-600">
                <li>• Todos los productos son oficiales del S.D. Unión Club de Astillero</li>
                <li>• Fabricados con materiales de alta calidad</li>
                <li>• Envío gratuito en pedidos superiores a €25</li>
                <li>• Descuentos especiales para socios del club</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">Política de Devoluciones</h4>
              <ul className="space-y-2 text-secondary-600">
                <li>• Devolución gratuita en 30 días</li>
                <li>• Los productos deben estar en perfecto estado</li>
                <li>• Reembolso completo garantizado</li>
                <li>• Atención al cliente personalizada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandising;