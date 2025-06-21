import React from 'react';
import { Link } from 'react-router-dom';

const SponsorCarousel: React.FC = () => {
  const sponsors = [
    { name: 'Banco Santander', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=150&h=75&fit=crop' },
    { name: 'SODERCAN', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=150&h=75&fit=crop' },
    { name: 'Ayuntamiento El Astillero', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=150&h=75&fit=crop' },
    { name: 'Gobierno de Cantabria', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=150&h=75&fit=crop' },
    { name: 'Construcciones Navales', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=150&h=75&fit=crop' },
    { name: 'Deportes Martínez', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=150&h=75&fit=crop' },
  ];

  return (
    <div className="bg-secondary-800 border-b border-secondary-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="overflow-hidden w-full">
            <div className="flex animate-pulse space-x-8 justify-center">
              {sponsors.map((sponsor, index) => (
                <Link
                  key={index}
                  to="/patrocinadores"
                  className="flex-shrink-0 group"
                >
                  <div className="h-12 w-24 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <span className="text-xs text-secondary-600 font-medium text-center px-2">
                      {sponsor.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorCarousel;