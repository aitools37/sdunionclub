import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Ticket, Users, Calendar, Home, Trophy, ChevronDown } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import MegaMenu from './MegaMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
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
        setShowMegaMenu(false); // Close mega menu when hiding
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

  const navigationItems = [
    {
      name: 'Club',
      path: '/club',
      icon: Trophy,
      hasSubmenu: true,
      submenu: [
        { name: 'Historia', path: '/club', description: 'Desde 1922' },
        { name: 'Directiva', path: '/club#directiva', description: 'Órganos de gobierno' },
        { name: 'Logros', path: '/club#logros', description: 'Trayectoria del club' },
      ]
    },
    {
      name: 'Equipos',
      path: '/equipos',
      hasSubmenu: true,
      submenu: [
        { name: 'Primer Equipo', path: '/equipos/primer-equipo', description: 'Plantilla y cuerpo técnico' },
        { name: 'Marismas', path: '/equipos/marismas', description: 'Equipo filial' },
        { name: 'Escuelas', path: '/equipos/escuelas', description: 'Fútbol base y canteras' },
      ]
    },
    { name: 'Calendario', path: '/calendario' },
    { name: 'Estadio', path: '/estadio' },
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

              {/* Desktop Navigation - Hidden on smaller screens */}
              <div className="hidden lg:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.hasSubmenu ? (
                      <button
                        className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link 
                        to={item.path} 
                        className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

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
                    className="p-2 text-secondary-700 hover:text-primary-600 transition-colors flex items-center space-x-1"
                  >
                    <Menu className="w-6 h-6" />
                    <span className="hidden sm:block text-sm font-medium">Menú</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* Mobile Quick Access (visible on small screens) */}
                      <div className="md:hidden px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-secondary-900 mb-3">Acceso Rápido</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {quickAccessButtons.map((button) => {
                            const Icon = button.icon;
                            return (
                              <Link
                                key={button.name}
                                to={button.path}
                                onClick={() => setShowDropdown(false)}
                                className="flex items-center space-x-2 px-3 py-2 text-secondary-700 hover:bg-gray-50 rounded-md transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{button.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="px-4 py-2">
                        <h3 className="text-sm font-semibold text-secondary-900 mb-3">Navegación</h3>
                        {navigationItems.map((item) => (
                          <div key={item.name} className="mb-2">
                            <Link
                              to={item.path}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center space-x-2 px-3 py-2 text-secondary-700 hover:bg-gray-50 rounded-md transition-colors font-medium"
                            >
                              {item.icon && <item.icon className="w-4 h-4" />}
                              <span>{item.name}</span>
                            </Link>
                            {item.submenu && (
                              <div className="ml-6 mt-1 space-y-1">
                                {item.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    onClick={() => setShowDropdown(false)}
                                    className="block px-3 py-2 text-sm text-secondary-600 hover:bg-gray-50 rounded-md transition-colors"
                                  >
                                    <div className="font-medium">{subItem.name}</div>
                                    <div className="text-xs text-secondary-500">{subItem.description}</div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Additional Links */}
                      <div className="border-t border-gray-200 px-4 py-2">
                        <Link
                          to="/patrocinadores"
                          onClick={() => setShowDropdown(false)}
                          className="block px-3 py-2 text-sm text-secondary-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Patrocinadores
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mega Menu */}
      {showMegaMenu && isVisible && (
        <MegaMenu
          onMouseEnter={() => setShowMegaMenu(true)}
          onMouseLeave={() => setShowMegaMenu(false)}
        />
      )}

      {/* Spacer for fixed header */}
      <div className="h-24"></div>
    </>
  );
};

export default Header;