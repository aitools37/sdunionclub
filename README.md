# S.D. Unión Club de Astillero - Web Oficial

Página web oficial del S.D. Unión Club de Astillero, club de fútbol fundado en 1922.

![S.D. Unión Club de Astillero](https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png)

## 🚀 Tecnologías

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Backend:** Supabase (Auth, DB, Edge Functions)
- **Scraping:** Parse.bot API para datos de RFCF
- **Hosting:** Netlify

## 📋 Características

### Implementadas
- ✅ Página principal con diseño moderno estilo grandes clubes
- ✅ Cuenta atrás para el próximo partido
- ✅ Clasificación en tiempo real desde RFCF
- ✅ Calendario de partidos con vista lista y mes
- ✅ Sistema de noticias conectado a Instagram
- ✅ Tienda online con carrito
- ✅ Sistema de socios
- ✅ Venta de entradas
- ✅ Páginas de equipos (Primer Equipo, Marismas, Escuelas)
- ✅ Información del estadio La Planchada
- ✅ Responsive design para móviles

### En desarrollo
- 🔄 Integración real con Instagram API
- 🔄 Integración con canal de WhatsApp
- 🔄 Notificaciones push para partidos
- 🔄 Panel de administración

## 🛠️ Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Parse.bot (para scraping RFCF)
PARSEBOT_API_KEY=tu_api_key
```

### Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones en `supabase/migrations/`
3. Configura los secrets en Edge Functions:
   - `PARSEBOT_API_KEY`: API key de Parse.bot

### Parse.bot Setup

Para el scraping de clasificación y calendario:

1. Crea una cuenta en [Parse.bot](https://parse.bot)
2. Configura un scraper para la URL de clasificación RFCF:
   ```
   https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=XXXXX&codgrupo=XXXXX
   ```
3. Guarda el API key en las variables de entorno

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/aitools37/sdunionclub.git
cd sdunionclub

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📁 Estructura del Proyecto

```
sdunionclub/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React reutilizables
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── MatchCard.tsx
│   │   ├── NextMatchCountdown.tsx
│   │   ├── SocialFeed.tsx
│   │   ├── StandingsWidget.tsx
│   │   └── ...
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home.tsx
│   │   ├── Calendar.tsx
│   │   ├── Classification.tsx
│   │   └── ...
│   ├── services/           # Servicios y APIs
│   │   ├── calendarService.ts
│   │   ├── classificationService.ts
│   │   └── instagramService.ts
│   ├── stores/             # Estado global (Zustand)
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── functions/          # Edge Functions
│   │   ├── scrape-rfcf-classification/
│   │   └── scrape-rfcf-calendar/
│   └── migrations/         # Migraciones SQL
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🎨 Componentes Principales

### NextMatchCountdown
Muestra cuenta atrás animada para el próximo partido con información del rival.

### StandingsWidget
Widget compacto de clasificación que muestra posiciones cercanas al equipo.

### MatchCard
Tarjeta de partido reutilizable con múltiples variantes (default, compact, featured).

### SocialFeed
Feed de Instagram con grid de imágenes y overlay interactivo.

## 🔧 Edge Functions

### scrape-rfcf-classification
Scrapea la clasificación de la RFCF y actualiza la base de datos.

### scrape-rfcf-calendar
Scrapea el calendario de partidos de la RFCF.

## 📱 Despliegue

### Netlify
```bash
# Build
npm run build

# El directorio dist/ se despliega automáticamente
```

### Configuración Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18+

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad del S.D. Unión Club de Astillero.

## 📞 Contacto

- **Web:** [sdunionclub.com](https://sdunionclub.com)
- **Email:** info@sdunionclub.com
- **Instagram:** [@unionclubastillero](https://instagram.com/unionclubastillero)

---

Hecho con ❤️ en El Astillero
