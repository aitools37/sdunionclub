import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Ticket, Users, Calendar, Home, Trophy } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import MegaMenu from './MegaMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
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
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const quickAccessButtons = [
    { name: 'Entradas', path: '/entradas', icon: Ticket },
    { name: 'Tienda', path: '/tienda', icon: ShoppingCart },
    { name: 'Hazte Socio', path: '/hazte-socio', icon: Users },
    { name: 'Calendario', path: '/calendario', icon: Calendar },
    { name: 'Estadio', path: '/estadio', icon: Home },
  ];

  const cartItemCount = getTotalItems();

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

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                <div className="relative">
                  <button
                    className="flex items-center space-x-1 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                    onMouseEnter={() => setShowMegaMenu(true)}
                    onMouseLeave={() => setShowMegaMenu(false)}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Club</span>
                  </button>
                </div>
                <Link 
                  to="/equipos" 
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Equipos
                </Link>
                <Link 
                  to="/calendario" 
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Calendario
                </Link>
                <Link 
                  to="/estadio" 
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Estadio
                </Link>
              </div>

              {/* Cart and Mobile Menu */}
              <div className="flex items-center space-x-4">
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

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {quickAccessButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Link
                    key={button.name}
                    to={button.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-2 text-secondary-700 hover:text-primary-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{button.name}</span>
                  </Link>
                );
              })}
              <div className="border-t pt-4">
                <Link
                  to="/equipos"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Equipos
                </Link>
                <Link
                  to="/club"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Historia del Club
                </Link>
              </div>
            </div>
          </div>
        )}
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