import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import SponsorCarousel from './SponsorCarousel';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      {/* Sponsor Carousel */}
      <SponsorCarousel />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative">
                <img
                  src="https://images.pexels.com/photos/274566/pexels-photo-274566.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  alt="S.D. Unión Club de Astillero"
                  className="w-full h-full object-contain rounded-full border-2 border-primary-600"
                />
              </div>
              <div>
                <div className="text-lg font-bold">S.D. Unión Club</div>
                <div className="text-sm text-gray-300">de Astillero</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Fundado en 1922, el S.D. Unión Club de Astillero es más que un club de fútbol. 
              Somos una familia unida por la pasión y el orgullo de representar a El Astillero.
            </p>
            <div className="text-primary-400 font-semibold text-sm">
              "Unidos se vence siempre"
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/entradas" className="text-gray-300 hover:text-primary-400 transition-colors">Entradas</Link></li>
              <li><Link to="/tienda" className="text-gray-300 hover:text-primary-400 transition-colors">Tienda Oficial</Link></li>
              <li><Link to="/hazte-socio" className="text-gray-300 hover:text-primary-400 transition-colors">Hazte Socio</Link></li>
              <li><Link to="/calendario" className="text-gray-300 hover:text-primary-400 transition-colors">Calendario</Link></li>
              <li><Link to="/equipos" className="text-gray-300 hover:text-primary-400 transition-colors">Equipos</Link></li>
              <li><Link to="/club" className="text-gray-300 hover:text-primary-400 transition-colors">Historia</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <div>Campos de Sport La Planchada</div>
                  <div>Avenida Chiclana</div>
                  <div>39610 El Astillero, Cantabria</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-sm text-gray-300">+34 942 54 XX XX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-sm text-gray-300">info@sdunionastillero.es</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">Síguenos para estar al día</div>
              <div className="text-gray-300">con todas las noticias,</div>
              <div className="text-gray-300">partidos y eventos del club.</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 S.D. Unión Club de Astillero. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacidad" className="hover:text-primary-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors">
                Cookies
              </Link>
              <Link to="/legal" className="hover:text-primary-400 transition-colors">
                Aviso Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;