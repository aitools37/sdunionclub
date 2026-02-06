import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Ticket, Users, Calendar, Trophy, Building2, History, Award, Star, MapPin, Clock, ShoppingBag, TrendingUp, Newspaper, ChevronDown } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { getTotalItems } = useCartStore();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    {
      name: 'Equipos',
      children: [
        { name: 'Primer Equipo', path: '/equipos/primer-equipo', icon: Star },
        { name: 'Marismas', path: '/equipos/marismas', icon: Users },
        { name: 'Escuelas', path: '/equipos/escuelas', icon: Award },
        { name: 'Ver Todos', path: '/equipos', icon: Trophy },
      ],
    },
    {
      name: 'Competicion',
      children: [
        { name: 'Calendario', path: '/calendario', icon: Calendar },
        { name: 'Clasificacion', path: '/clasificacion', icon: TrendingUp },
      ],
    },
    {
      name: 'Club',
      children: [
        { name: 'Historia', path: '/club', icon: History },
        { name: 'La Planchada', path: '/estadio', icon: MapPin },
        { name: 'Patrocinadores', path: '/patrocinadores', icon: Building2 },
      ],
    },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Tienda', path: '/tienda' },
  ];

  const cartItemCount = getTotalItems();
  const headerTransparent = isHome && !isScrolled && !isMenuOpen;

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          headerTransparent
            ? 'bg-transparent'
            : 'bg-white shadow-md'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link to="/" className="flex items-center space-x-3 z-10">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png"
                alt="S.D. Union Club de Astillero"
                className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
              />
              <div className={`hidden sm:block transition-colors duration-300 ${headerTransparent ? 'text-white' : 'text-secondary-900'}`}>
                <div className="font-display text-lg font-bold uppercase leading-tight tracking-wide">Union Club</div>
                <div className={`text-xs font-medium uppercase tracking-widest ${headerTransparent ? 'text-white/70' : 'text-secondary-500'}`}>de Astillero</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.name)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${
                        headerTransparent
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-secondary-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === link.name && (
                      <div className="absolute top-full left-0 pt-2 animate-slide-down">
                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[220px]">
                          {link.children.map((child) => {
                            const Icon = child.icon;
                            return (
                              <Link
                                key={child.name}
                                to={child.path}
                                className="flex items-center space-x-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                  <Icon className="w-4 h-4 text-primary-600" />
                                </div>
                                <span className="font-medium text-secondary-700 group-hover:text-primary-600 transition-colors">{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${
                      headerTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center space-x-2 z-10">
              <Link
                to="/entradas"
                className={`hidden md:inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                  headerTransparent
                    ? 'bg-white text-primary-700 hover:bg-gray-100'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Entradas</span>
              </Link>

              <Link
                to="/hazte-socio"
                className={`hidden lg:inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide border-2 transition-all ${
                  headerTransparent
                    ? 'border-white/60 text-white hover:bg-white hover:text-primary-700'
                    : 'border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Socio</span>
              </Link>

              <Link
                to="/carrito"
                className={`relative p-2.5 rounded-lg transition-colors ${
                  headerTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                  headerTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-secondary-700 hover:bg-gray-50'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto">
            <div className="pt-20 pb-8 px-6">
              <div className="space-y-1">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.name}>
                      <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-secondary-400 mt-4">
                        {link.name}
                      </div>
                      {link.children.map((child) => {
                        const Icon = child.icon;
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Icon className="w-5 h-5 text-primary-600" />
                            <span className="font-medium text-secondary-800">{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path!}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-secondary-800"
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>

              <div className="mt-8 space-y-3 border-t border-gray-100 pt-6">
                <Link
                  to="/entradas"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full bg-primary-600 text-white py-3 rounded-lg font-bold"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Comprar Entradas</span>
                </Link>
                <Link
                  to="/hazte-socio"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full border-2 border-primary-600 text-primary-600 py-3 rounded-lg font-bold"
                >
                  <Users className="w-5 h-5" />
                  <span>Hazte Socio</span>
                </Link>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6 space-y-3 text-sm text-secondary-500">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>La Planchada, El Astillero</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Desde 1922</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isHome && <div className="h-16 lg:h-20" />}
    </>
  );
};

export default Header;
