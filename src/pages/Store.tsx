import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shirt, ArrowRight, Gift, Trophy } from 'lucide-react';

const Store: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Tienda Oficial</h1>
            <p className="text-lg text-secondary-600">
              Productos oficiales del S.D. Unión Club de Astillero
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            ¿Qué estás buscando?
          </h2>
          <p className="text-xl text-secondary-600">
            Elige la categoría de productos que más te interese
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Merchandising Option */}
          <Link
            to="/tienda/merchandising"
            className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Merchandising</h3>
                  <p className="text-primary-100">
                    Accesorios y productos del club
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    Productos Oficiales
                  </h4>
                  <p className="text-secondary-600">
                    Bufandas, gorras, llaveros, pulseras y más accesorios oficiales del club
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  Bufandas
                </span>
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  Gorras
                </span>
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  Llaveros
                </span>
                <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  Pulseras
                </span>
              </div>
            </div>
          </Link>

          {/* Equipment Option */}
          <a
            href="https://tienda.austral.es/unionclubsdfutbol/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-64 bg-gradient-to-br from-secondary-500 to-secondary-700">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shirt className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Equipación</h3>
                  <p className="text-secondary-100">
                    Camisetas y uniformes oficiales
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                    Tienda Externa
                  </h4>
                  <p className="text-secondary-600">
                    Camisetas oficiales, pantalones, medias y equipación completa del club
                  </p>
                </div>
                <div className="flex items-center text-primary-600">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform mr-2" />
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm">
                  1ª Equipación
                </span>
                <span className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm">
                  2ª Equipación
                </span>
                <span className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm">
                  Pantalones
                </span>
                <span className="bg-secondary-100 text-secondary-600 px-3 py-1 rounded-full text-sm">
                  Medias
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              ¿Por qué comprar productos oficiales?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Calidad Garantizada</h4>
                <p className="text-secondary-600">
                  Todos nuestros productos son oficiales y de la máxima calidad
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Apoyas al Club</h4>
                <p className="text-secondary-600">
                  Cada compra ayuda directamente al desarrollo del club
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-2">Diseños Exclusivos</h4>
                <p className="text-secondary-600">
                  Productos únicos que no encontrarás en ningún otro lugar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;