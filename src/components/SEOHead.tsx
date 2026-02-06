import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'S.D. Union Club de Astillero';
const BASE_DESCRIPTION = 'Club de futbol fundado en 1922 en El Astillero, Cantabria. Compra entradas, hazte socio y sigue la actualidad del club.';

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: `${SITE_NAME} - Club de Futbol Historico de Cantabria`,
    description: BASE_DESCRIPTION,
  },
  '/tienda': {
    title: `Tienda Oficial | ${SITE_NAME}`,
    description: 'Compra camisetas, bufandas, gorras y todo el merchandising oficial del S.D. Union Club de Astillero.',
  },
  '/tienda/merchandising': {
    title: `Merchandising | ${SITE_NAME}`,
    description: 'Merchandising oficial del S.D. Union Club de Astillero. Bufandas, gorras, llaveros y mas.',
  },
  '/entradas': {
    title: `Comprar Entradas | ${SITE_NAME}`,
    description: 'Compra tus entradas para los partidos del S.D. Union Club de Astillero en La Planchada.',
  },
  '/hazte-socio': {
    title: `Hazte Socio | ${SITE_NAME}`,
    description: 'Unete como socio del S.D. Union Club de Astillero. Entrada gratuita, descuentos y contenido exclusivo.',
  },
  '/calendario': {
    title: `Calendario de Partidos | ${SITE_NAME}`,
    description: 'Consulta el calendario completo de partidos del S.D. Union Club de Astillero. Proximos encuentros y resultados.',
  },
  '/clasificacion': {
    title: `Clasificacion | ${SITE_NAME}`,
    description: 'Clasificacion actualizada de la Segunda Regional Grupo C. Posicion y estadisticas del S.D. Union Club de Astillero.',
  },
  '/estadio': {
    title: `La Planchada - Nuestro Estadio | ${SITE_NAME}`,
    description: 'Campos de Sport La Planchada, el hogar del S.D. Union Club de Astillero en El Astillero, Cantabria.',
  },
  '/club': {
    title: `Historia del Club | ${SITE_NAME}`,
    description: 'Conoce la historia del S.D. Union Club de Astillero, fundado en 1922. Mas de 100 anos de tradicion futbolistica en Cantabria.',
  },
  '/equipos': {
    title: `Equipos | ${SITE_NAME}`,
    description: 'Primer equipo, Marismas y escuelas de futbol del S.D. Union Club de Astillero.',
  },
  '/equipos/primer-equipo': {
    title: `Primer Equipo | ${SITE_NAME}`,
    description: 'Plantilla y jugadores del primer equipo del S.D. Union Club de Astillero.',
  },
  '/equipos/marismas': {
    title: `Marismas | ${SITE_NAME}`,
    description: 'Equipo Marismas del S.D. Union Club de Astillero.',
  },
  '/equipos/escuelas': {
    title: `Escuelas de Futbol | ${SITE_NAME}`,
    description: 'Escuelas de futbol base del S.D. Union Club de Astillero. Formacion para jovenes futbolistas.',
  },
  '/noticias': {
    title: `Noticias | ${SITE_NAME}`,
    description: 'Ultimas noticias y actualidad del S.D. Union Club de Astillero.',
  },
  '/patrocinadores': {
    title: `Patrocinadores | ${SITE_NAME}`,
    description: 'Empresas y patrocinadores que apoyan al S.D. Union Club de Astillero.',
  },
};

const SEOHead: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMeta[pathname] || {
      title: SITE_NAME,
      description: BASE_DESCRIPTION,
    };

    document.title = meta.title;

    const updateMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', meta.description);
    updateMeta('og:title', meta.title, 'property');
    updateMeta('og:description', meta.description, 'property');
    updateMeta('og:url', `https://sdunionclub.com${pathname}`, 'property');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://sdunionclub.com${pathname}`);
  }, [pathname]);

  return null;
};

export default SEOHead;
