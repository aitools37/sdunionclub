import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Clock, 
  Facebook, Instagram, Twitter, Youtube,
  Heart, ExternalLink, ChevronRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Calendario', path: '/calendario' },
    { name: 'Clasificación', path: '/clasificacion' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Tienda', path: '/tienda' },
    { name: 'Contacto', path: '/club#contacto' },
  ];

  const clubLinks = [
    { name: 'Historia del Club', path: '/club' },
    { name: 'Primer Equipo', path: '/equipos/primer-equipo' },
    { name: 'Marismas', path: '/equipos/marismas' },
    { name: 'Escuelas', path: '/equipos/escuelas' },
    { name: 'La Planchada', path: '/estadio' },
    { name: 'Patrocinadores', path: '/patrocinadores' },
  ];

  const serviceLinks = [
    { name: 'Hazte Socio', path: '/hazte-socio' },
    { name: 'Comprar Entradas', path: '/entradas' },
    { name: 'Merchandising', path: '/tienda/merchandising' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/sdunionclubastillero', color: 'hover:bg-blue-600' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/unionclubastillero', color: 'hover:bg-gradient-to-br hover:from-pink-500 hover:via-red-500 hover:to-yellow-500' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/sdunionclub', color: 'hover:bg-sky-500' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@sdunionclub', color: 'hover:bg-red-600' },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Club Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png"
                alt="S.D. Unión Club de Astillero"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">S.D. Unión Club</h3>
                <p className="text-secondary-400 text-sm">de Astillero</p>
              </div>
            </div>
            <p className="text-secondary-400 mb-6 max-w-sm">
              Fundado en 1922, el S.D. Unión Club de Astillero representa con orgullo a 
              El Astillero y su comarca. Más de 100 años de historia, pasión y fútbol.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">Campos de Sport La Planchada</p>
                  <p className="text-secondary-400">39610 El Astillero, Cantabria</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-400">+34 942 XX XX XX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@sdunionclub.com" className="text-secondary-400 hover:text-white transition-colors">
                  info@sdunionclub.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-400">Oficinas: Lun-Vie 10:00-14:00</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Club */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">El Club</h4>
            <ul className="space-y-2">
              {clubLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Servicios</h4>
            <ul className="space-y-2 mb-6">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <h4 className="text-lg font-semibold mb-4 text-white">Síguenos</h4>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors Bar */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-secondary-500 text-sm">Nuestros patrocinadores:</p>
            <div className="flex items-center space-x-6">
              <Link to="/patrocinadores" className="text-secondary-400 hover:text-white text-sm transition-colors flex items-center">
                Ver todos los patrocinadores
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800 bg-secondary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary-500">
            <div className="flex items-center space-x-1">
              <span>© {currentYear} S.D. Unión Club de Astillero.</span>
              <span>Todos los derechos reservados.</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/privacidad" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <Link to="/legal" className="hover:text-white transition-colors">
                Aviso Legal
              </Link>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-secondary-600 flex items-center justify-center">
            <span>Hecho con</span>
            <Heart className="w-3 h-3 mx-1 text-red-500" fill="currentColor" />
            <span>en El Astillero</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
