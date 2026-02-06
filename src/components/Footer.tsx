import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Mail, Clock,
  Facebook, Instagram, Twitter, Youtube,
  Heart, ChevronRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Club',
      links: [
        { name: 'Historia', path: '/club' },
        { name: 'Primer Equipo', path: '/equipos/primer-equipo' },
        { name: 'Marismas', path: '/equipos/marismas' },
        { name: 'Escuelas', path: '/equipos/escuelas' },
        { name: 'La Planchada', path: '/estadio' },
        { name: 'Patrocinadores', path: '/patrocinadores' },
      ],
    },
    {
      title: 'Competicion',
      links: [
        { name: 'Calendario', path: '/calendario' },
        { name: 'Clasificacion', path: '/clasificacion' },
        { name: 'Noticias', path: '/noticias' },
      ],
    },
    {
      title: 'Servicios',
      links: [
        { name: 'Hazte Socio', path: '/hazte-socio' },
        { name: 'Comprar Entradas', path: '/entradas' },
        { name: 'Tienda Oficial', path: '/tienda' },
        { name: 'Merchandising', path: '/tienda/merchandising' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/sdunionclubastillero' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/unionclubastillero' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/sdunionclub' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@sdunionclub' },
  ];

  return (
    <footer className="bg-secondary-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png"
                alt="S.D. Union Club de Astillero"
                className="w-14 h-14 object-contain"
              />
              <div>
                <h3 className="font-display text-xl font-bold uppercase">Union Club</h3>
                <p className="text-secondary-500 text-xs uppercase tracking-widest">de Astillero</p>
              </div>
            </div>
            <p className="text-secondary-400 mb-8 max-w-sm leading-relaxed text-sm">
              Fundado en 1922, representamos con orgullo a El Astillero y su comarca.
              Mas de 100 anos de historia, pasion y futbol.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">Campos de Sport La Planchada</p>
                  <p className="text-secondary-500">39610 El Astillero, Cantabria</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@sdunionclub.com" className="text-secondary-400 hover:text-white transition-colors">
                  info@sdunionclub.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <p className="text-secondary-500">Oficinas: Lun-Vie 10:00-14:00</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-secondary-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary-400 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary-500" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-500">
            <span>{currentYear} S.D. Union Club de Astillero. Todos los derechos reservados.</span>
            <div className="flex items-center space-x-1 text-secondary-600">
              <span>Hecho con</span>
              <Heart className="w-3 h-3 text-red-500" fill="currentColor" />
              <span>en El Astillero</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
