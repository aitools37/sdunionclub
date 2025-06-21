import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Ticket, Users, Calendar, Home, Trophy, Building2, History, Award, Star, MapPin, Clock, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled
      setIsScrolled(currentScrollY > 10);
      
      // Determine visibility based on scroll direction
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and not near top
        setIsVisible(false);
        setShowDropdown(false); // Close dropdown when hiding
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const quickAccessButtons = [
    { name: 'Entradas', path: '/entradas', icon: Ticket },
    { name: 'Tienda', path: '/tienda', icon: ShoppingCart },
    { name: 'Hazte Socio', path: '/hazte-socio', icon: Users },
    { name: 'Calendario', path: '/calendario', icon: Calendar },
    { name: 'Estadio', path: '/estadio', icon: Home },
  ];

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const handleNavigationWithAnchor = (path: string, anchor?: string) => {
    setShowDropdown(false);
    navigate(path);
    
    if (anchor) {
      // Small delay to ensure page loads before scrolling
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const menuSections = [
    {
      title: 'Equipos',
      icon: Trophy,
      color: 'bg-primary-50 text-primary-600',
      items: [
        { name: 'Primer Equipo', path: '/equipos/primer-equipo', description: 'Plantilla y cuerpo técnico', icon: Star },
        { name: 'Marismas', path: '/equipos/marismas', description: 'Equipo filial', icon: Users },
        { name: 'Escuelas', path: '/equipos/escuelas', description: 'Fútbol base y canteras', icon: Award },
        { name: 'Ver Todos', path: '/equipos', description: 'Todos los equipos', icon: Trophy },
      ],
    },
    {
      title: 'Club',
      icon: Building2,
      color: 'bg-secondary-50 text-secondary-600',
      items: [
        { name: 'Historia', path: '/club', description: 'Desde 1922', icon: History },
        { name: 'Directiva', path: '/club', anchor: 'directiva', description: 'Órganos de gobierno', icon: Users },
        { name: 'Logros', path: '/club', anchor: 'logros', description: 'Trayectoria del club', icon: Award },
        { name: 'Patrocinadores', path: '/patrocinadores', description: 'Nuestros colaboradores', icon: Building2 },
      ],
    },
    {
      title: 'Estadio',
      icon: Home,
      color: 'bg-accent-50 text-accent-600',
      items: [
        { name: 'La Planchada', path: '/estadio', description: 'Nuestro hogar desde 1922', icon: Home },
        { name: 'Cómo Llegar', path: '/estadio', anchor: 'como-llegar', description: 'Ubicación y transporte', icon: MapPin },
        { name: 'Calendario', path: '/calendario', description: 'Próximos partidos', icon: Calendar },
      ],
    },
    {
      title: 'Servicios',
      icon: ShoppingBag,
      color: 'bg-success-50 text-success-600',
      items: [
        { name: 'Entradas', path: '/entradas', description: 'Compra tus entradas', icon: Ticket },
        { name: 'Tienda', path: '/tienda', description: 'Productos oficiales', icon: ShoppingBag },
        { name: 'Hazte Socio', path: '/hazte-socio', description: 'Únete al club', icon: Users },
      ],
    },
  ];

  const cartItemCount = getTotalItems();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        {/* Quick Access Bar */}
        <div className="bg-primary-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden md:flex justify-center space-x-8">
              {quickAccessButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Link
                    key={button.name}
                    to={button.path}
                    className="flex items-center space-x-2 px-4 py-1 rounded-full hover:bg-primary-700 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{button.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  UCA
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-secondary-900">S.D. Unión Club</div>
                  <div className="text-sm text-secondary-600">de Astillero</div>
                </div>
              </Link>

              {/* Right Side - Cart and Dropdown Menu */}
              <div className="flex items-center space-x-4">
                {/* Cart */}
                <Link
                  to="/carrito"
                  className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Dropdown Menu Button */}
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleDropdown}
                    className="p-2 text-secondary-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
                  >
                    {showDropdown ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    <span className="hidden sm:block text-sm font-medium">Menú</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Full Width Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Mobile Quick Access (visible on small screens) */}
              <div className="md:hidden mb-8">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Acceso Rápido
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {quickAccessButtons.map((button) => {
                    const Icon = button.icon;
                    return (
                      <Link
                        key={button.name}
                        to={button.path}
                        onClick={handleCloseDropdown}
                        className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-secondary-900">{button.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Main Menu Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {menuSections.map((section) => {
                  const SectionIcon = section.icon;
                  return (
                    <div key={section.title} className="space-y-4">
                      <div className={`flex items-center space-x-3 p-3 rounded-lg ${section.color}`}>
                        <SectionIcon className="w-6 h-6" />
                        <h3 className="font-bold text-lg">{section.title}</h3>
                      </div>
                      
                      <ul className="space-y-3">
                        {section.items.map((item) => {
                          const ItemIcon = item.icon;
                          if (item.anchor) {
                            // Items with anchors need special handling
                            return (
                              <li key={item.name}>
                                <button
                                  onClick={() => handleNavigationWithAnchor(item.path, item.anchor)}
                                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
                                >
                                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                    <ItemIcon className="w-4 h-4 text-secondary-500 group-hover:text-primary-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-secondary-600 mt-1">
                                      {item.description}
                                    </div>
                                  </div>
                                </button>
                              </li>
                            );
                          } else {
                            // Regular navigation items
                            return (
                              <li key={item.name}>
                                <Link
                                  to={item.path}
                                  onClick={handleCloseDropdown}
                                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
                                >
                                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                    <ItemIcon className="w-4 h-4 text-secondary-500 group-hover:text-primary-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-secondary-600 mt-1">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Footer with Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-secondary-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Campos de Sport La Planchada</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-secondary-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Fundado en 1922</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-secondary-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Más de 1,250 socios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24"></div>
    </>
  );
};

export default Header;