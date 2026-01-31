# Guía de Configuración - S.D. Unión Club Web

## 🔧 Configuración Completa

### 1. Supabase Setup

#### Crear proyecto
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Anota la URL y la Anon Key del proyecto

#### Ejecutar migraciones
En el SQL Editor de Supabase, ejecuta las siguientes migraciones en orden:

```sql
-- 1. Crear tabla de competiciones
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    season TEXT NOT NULL,
    group_name TEXT,
    rfcf_competition_code TEXT,
    rfcf_group_code TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de equipos
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    short_name TEXT,
    logo_url TEXT,
    is_our_team BOOLEAN DEFAULT false,
    rfcf_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crear tabla de clasificación
CREATE TABLE IF NOT EXISTS public.classification_standings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    goal_difference INTEGER DEFAULT 0,
    form TEXT,
    is_promoted BOOLEAN DEFAULT false,
    is_playoff BOOLEAN DEFAULT false,
    is_relegated BOOLEAN DEFAULT false,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_standing UNIQUE (competition_id, team_id)
);

-- 4. Crear tabla de partidos
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    opponent TEXT NOT NULL,
    opponent_logo TEXT,
    match_date DATE NOT NULL,
    match_time TIME DEFAULT '17:00',
    venue TEXT,
    is_home BOOLEAN DEFAULT true,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'scheduled',
    matchday INTEGER,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_match UNIQUE (competition_id, match_date, opponent)
);

-- 5. Habilitar RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classification_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de lectura pública
CREATE POLICY "Public read competitions" ON public.competitions FOR SELECT TO public USING (true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT TO public USING (true);
CREATE POLICY "Public read standings" ON public.classification_standings FOR SELECT TO public USING (true);
CREATE POLICY "Public read matches" ON public.matches FOR SELECT TO public USING (true);

-- 7. Insertar competición activa
INSERT INTO public.competitions (name, season, group_name, rfcf_competition_code, rfcf_group_code, is_active)
VALUES ('Segunda Regional', '2025-2026', 'Grupo B', '22119651', '22119687', true);

-- 8. Insertar nuestro equipo
INSERT INTO public.teams (name, short_name, is_our_team)
VALUES ('S.D. Unión Club', 'UCA', true);
```

#### Configurar Edge Functions
1. Instala Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link proyecto: `supabase link --project-ref TU_PROJECT_REF`
4. Deploy functions:
```bash
supabase functions deploy scrape-rfcf-classification
supabase functions deploy scrape-rfcf-calendar
```
5. Configura secrets:
```bash
supabase secrets set PARSEBOT_API_KEY=tu_api_key
```

### 2. Parse.bot Setup

#### Crear scraper de clasificación
1. Crea cuenta en [parse.bot](https://parse.bot)
2. Crea nuevo scraper con URL:
   ```
   https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=22119651&codgrupo=22119687
   ```
3. Configura selectores para extraer:
   - `position` (posición)
   - `team` (nombre equipo)
   - `points` (puntos)
   - `played` (partidos jugados)
   - `won`, `drawn`, `lost` (ganados, empatados, perdidos)
   - `goalsFor`, `goalsAgainst` (goles a favor/contra)
   - `form` (últimos resultados)

### 3. Variables de Entorno

#### Frontend (.env)
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Netlify (Environment Variables)
Mismas variables que arriba, más:
- `NODE_VERSION`: `18`

### 4. Despliegue en Netlify

1. Conecta el repo de GitHub a Netlify
2. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Añade variables de entorno
4. Deploy!

### 5. Automatización

#### Cron para actualizar datos
Configura un cron job para llamar a las Edge Functions periódicamente:

```bash
# Cada 6 horas
0 */6 * * * curl -X POST https://tu-proyecto.supabase.co/functions/v1/scrape-rfcf-classification -H "Authorization: Bearer TU_ANON_KEY"
```

O usa Supabase cron (pg_cron):
```sql
SELECT cron.schedule(
  'scrape-classification',
  '0 */6 * * *',
  $$SELECT net.http_post(
    url := 'https://tu-proyecto.supabase.co/functions/v1/scrape-rfcf-classification',
    headers := '{"Authorization": "Bearer TU_SERVICE_KEY"}'::jsonb
  )$$
);
```

## 📱 Integración Instagram (Próximamente)

Para conectar Instagram real:

1. Crea una app en [Facebook Developers](https://developers.facebook.com)
2. Configura Instagram Basic Display API
3. Obtén un token de acceso de larga duración
4. Actualiza `instagramService.ts` para usar la API real

## 🔗 URLs de Referencia RFCF

- **Clasificación:** `https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=XXXXX&codgrupo=XXXXX`
- **Calendario:** `https://www.rfcf.es/pnfg/NPcd/NFG_VisCalendario?cod_primaria=1000120&codcompeticion=XXXXX&codgrupo=XXXXX`
- **Ficha equipo:** `https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120`

Los códigos de competición y grupo varían cada temporada. Búscalos en la web de la RFCF.

---

¿Dudas? Abre un issue en el repositorio.
