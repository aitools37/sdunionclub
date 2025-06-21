import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Star, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  // Mock product data - in real app, fetch by ID
  const product = {
    id: id,
    name: 'Camiseta 1ª Equipación Verde',
    price: 45,
    images: [
      'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    ],
    category: 'uniformes',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviews: 24,
    description: 'Camiseta oficial del primer equipo del S.D. Unión Club de Astillero. Confeccionada con materiales de alta calidad y tecnología Dri-FIT para mantener la comodidad durante el juego.',
    features: [
      'Escudo del club bordado',
      'Tecnología Dri-FIT',
      'Corte atlético',
      '100% Poliéster reciclado',
      'Cuello redondo reforzado',
    ],
    sizeGuide: {
      'S': { chest: '88-96', length: '69' },
      'M': { chest: '96-104', length: '72' },
      'L': { chest: '104-112', length: '75' },
      'XL': { chest: '112-120', length: '78' },
      'XXL': { chest: '120-128', length: '81' },
    },
    inStock: true,
    stockCount: 15,
  };

  const relatedProducts = [
    {
      id: '2',
      name: 'Camiseta 2ª Equipación Negra',
      price: 45,
      image: 'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    },
    {
      id: '3',
      name: 'Conjunto Completo Verde',
      price: 80,
      image: 'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    },
    {
      id: '7',
      name: 'Pantalón Oficial',
      price: 25,
      image: 'https://images.pexels.com/photos/8007362/pexels-photo-8007362.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    },
  ];

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedSize || 'default'}`,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        category: product.category,
      });
    }
    
    toast.success(`${quantity} ${product.name} añadido(s) al carrito`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-8">
          <Link to="/tienda" className="hover:text-primary-600 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a la tienda
          </Link>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-secondary-500 ml-2">
                  ({product.reviews} reseñas)
                </span>
              </div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                {product.name}
              </h1>
              <div className="text-3xl font-bold text-primary-600 mb-4">
                €{product.price}
              </div>
              <p className="text-secondary-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">Talla</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-gray-300 text-secondary-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-secondary-900 mb-3">Cantidad</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {product.stockCount <= 5 && (
                <p className="text-sm text-warning-600 mt-2">
                  Solo quedan {product.stockCount} unidades
                </p>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {product.inStock ? 'Añadir al carrito' : 'Agotado'}
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="w-6 h-6 text-secondary-400" />
              </button>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-secondary-900 mb-3">Características</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-secondary-600">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-sm text-secondary-600">
                <Truck className="w-5 h-5 text-primary-600" />
                <span>Envío gratuito en pedidos superiores a €50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-secondary-600">
                <RotateCcw className="w-5 h-5 text-primary-600" />
                <span>Devoluciones gratuitas en 30 días</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-secondary-600">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>Garantía oficial del fabricante</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/tienda/producto/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-secondary-900 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-xl font-bold text-primary-600">
                      €{relatedProduct.price}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;