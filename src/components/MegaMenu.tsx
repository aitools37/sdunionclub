import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, ShoppingBag, Home, Building2, History } from 'lucide-react';

interface MegaMenuProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ onMouseEnter, onMouseLeave }) => {
  const menuSections = [
    {
      title: 'Equipos',
      icon: Trophy,
      links: [
        { name: 'Primer Equipo', path: '/equipos/primer-equipo', description: 'Plantilla y cuerpo técnico' },
        { name: 'Marismas', path: '/equipos/marismas', description: 'Equipo filial' },
        { name: 'Escuelas', path: '/equipos/escuelas', description: 'Fútbol base y canteras' },
      ],
    },
    {
      title: 'Hazte Socio',
      icon: Users,
      links: [
        { name: 'Tipos de Socios', path: '/hazte-socio', description: 'Planes y beneficios' },
        { name: 'Registro', path: '/hazte-socio#registro', description: 'Únete al club' },
      ],
    },
    {
      title: 'Tienda',
      icon: ShoppingBag,
      links: [
        { name: 'Uniformes', path: '/tienda?categoria=uniformes', description: 'Camisetas oficiales' },
        { name: 'Merchandising', path: '/tienda?categoria=merchandising', description: 'Productos del club' },
      ],
    },
    {
      title: 'Estadio',
      icon: Home,
      links: [
        { name: 'La Planchada', path: '/estadio', description: 'Nuestro hogar desde 1922' },
        { name: 'Cómo Llegar', path: '/estadio#como-llegar', description: 'Ubicación y transporte' },
      ],
    },
    {
      title: 'Club',
      icon: Building2,
      links: [
        { name: 'Historia', path: '/club', description: 'Desde 1922' },
        { name: 'Directiva', path: '/club#directiva', description: 'Órganos de gobierno' },
        { name: 'Logros', path: '/club#logros', description: 'Trayectoria del club' },
      ],
    },
  ];

  return (
    <div
      className="fixed top-24 left-0 right-0 z-40 bg-white shadow-xl border-t border-gray-100"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {menuSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="space-y-4">
                <div className="flex items-center space-x-2 text-primary-600">
                  <Icon className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="block group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                          {link.name}
                        </div>
                        <div className="text-sm text-secondary-600 mt-1">
                          {link.description}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;