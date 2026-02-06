/*
  # Create players and staff tables

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `team_slug` (text) - identifies which team: 'primer-equipo', 'marismas-juvenil'
      - `first_name` (text) - player first name
      - `last_name` (text) - player last name
      - `display_name` (text) - short name shown on cards
      - `position` (text) - POR (Portero), DEF (Defensa), MED (Centrocampista), DEL (Delantero)
      - `shirt_number` (integer, nullable) - dorsal number
      - `is_active` (boolean) - whether currently active
      - `sort_order` (integer) - for custom ordering within position groups
      - `created_at` (timestamptz)

    - `staff`
      - `id` (uuid, primary key)
      - `team_slug` (text) - identifies which team
      - `first_name` (text)
      - `last_name` (text)
      - `display_name` (text)
      - `role` (text) - Entrenador, Delegado, Auxiliar, etc.
      - `sort_order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add read-only policies for authenticated and anonymous users (public roster data)

  3. Data
    - Populate with real player data from RFCF and BeSoccer for SD Union Club de Astillero
    - Populate with real Juvenil data from AA.VV. La Marisma match sheets
    - Staff data from RFCF official registry
*/

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_slug text NOT NULL DEFAULT '',
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  shirt_number integer,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players are publicly readable"
  ON players
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Players are readable by anon"
  ON players
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_slug text NOT NULL DEFAULT '',
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff are publicly readable"
  ON staff
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff are readable by anon"
  ON staff
  FOR SELECT
  TO anon
  USING (true);

-- =============================================
-- SD UNION CLUB DE ASTILLERO - PRIMER EQUIPO
-- Source: RFCF Official + BeSoccer positions
-- =============================================

-- PORTEROS
INSERT INTO players (team_slug, first_name, last_name, display_name, position, sort_order)
VALUES ('primer-equipo', 'Arce', '', 'Arce', 'POR', 1);

-- DEFENSAS
INSERT INTO players (team_slug, first_name, last_name, display_name, position, sort_order)
VALUES
  ('primer-equipo', 'Raúl', 'Antunes Díaz', 'Rafa', 'DEF', 10),
  ('primer-equipo', 'Ramón', 'García Planes', 'Chema', 'DEF', 11),
  ('primer-equipo', 'Miguel Ángel', '', 'Miguel Ángel', 'DEF', 12),
  ('primer-equipo', 'Gordillo', '', 'Gordillo', 'DEF', 13),
  ('primer-equipo', 'Mauro', '', 'Mauro', 'DEF', 14);

-- CENTROCAMPISTAS
INSERT INTO players (team_slug, first_name, last_name, display_name, position, sort_order)
VALUES
  ('primer-equipo', 'Loren', '', 'Loren', 'MED', 20),
  ('primer-equipo', 'Luis', '', 'Luis', 'MED', 21),
  ('primer-equipo', 'Valle', '', 'Valle', 'MED', 22),
  ('primer-equipo', 'José Ignacio', 'Fernández', 'Josein', 'MED', 23),
  ('primer-equipo', 'Álvaro', 'Alonso', 'Fredi', 'MED', 24);

-- DELANTEROS
INSERT INTO players (team_slug, first_name, last_name, display_name, position, sort_order)
VALUES
  ('primer-equipo', 'Chuchi', 'Cos', 'Chuchi Cos', 'DEL', 30),
  ('primer-equipo', 'Jorge', 'Sanvicente', 'Sanvi', 'DEL', 31),
  ('primer-equipo', 'Maza', '', 'Maza I', 'DEL', 32),
  ('primer-equipo', 'Manuel', 'Maza', 'Maza II', 'DEL', 33);

-- Players without known position from RFCF registry
INSERT INTO players (team_slug, first_name, last_name, display_name, position, sort_order)
VALUES
  ('primer-equipo', 'Óscar', 'Abascal Pérez', 'Óscar Abascal', '', 50),
  ('primer-equipo', 'Iván', 'Agüeros Gómez', 'Iván Agüeros', '', 51),
  ('primer-equipo', 'Ismael', 'Arriola Martínez', 'Ismael Arriola', '', 52),
  ('primer-equipo', 'Bernard', 'Ceballos Martínez', 'Bernard', '', 53),
  ('primer-equipo', 'Fernando', 'Galván Lombilla', 'Fernando Galván', '', 54),
  ('primer-equipo', 'David', 'Gómez Clemente', 'David Gómez', '', 55),
  ('primer-equipo', 'Hugo', 'González Gómez', 'Hugo González', '', 56),
  ('primer-equipo', 'Álvaro', 'Gutiérrez Muñiz', 'Álvaro Gutiérrez', '', 57),
  ('primer-equipo', 'Mario', 'Herrera Macía', 'Mario Herrera', '', 58),
  ('primer-equipo', 'Francisco', 'Herrero López', 'Fran Herrero', '', 59),
  ('primer-equipo', 'Mario', 'Isla Antón', 'Mario Isla', '', 60),
  ('primer-equipo', 'Manuel', 'Lanza García', 'Manuel Lanza', '', 61),
  ('primer-equipo', 'Héctor', 'Laredo Cobo', 'Héctor Laredo', '', 62),
  ('primer-equipo', 'Óscar', 'Liaño Abascal', 'Óscar Liaño', '', 63),
  ('primer-equipo', 'Hulgize', 'Llata Fernández', 'Hulgize', '', 64),
  ('primer-equipo', 'Víctor', 'Palacio Navarro', 'Víctor Palacio', '', 65),
  ('primer-equipo', 'Diego', 'Prieto Marina', 'Diego Prieto', '', 66),
  ('primer-equipo', 'Iván', 'Suárez García', 'Iván Suárez', '', 67),
  ('primer-equipo', 'Alexis', 'Usle Rasines', 'Alexis Usle', '', 68),
  ('primer-equipo', 'Iker', 'Vélez Robledo', 'Iker Vélez', '', 69);

-- PRIMER EQUIPO STAFF (from RFCF)
INSERT INTO staff (team_slug, first_name, last_name, display_name, role, sort_order)
VALUES
  ('primer-equipo', 'Juan', 'Vega Gutiérrez', 'Juan Vega', 'Entrenador', 1),
  ('primer-equipo', 'Ángel', 'Caso López', 'Ángel Caso', 'Segundo Entrenador', 2),
  ('primer-equipo', 'José Luis', 'González Raba', 'José L. González', 'Preparador Físico', 3),
  ('primer-equipo', 'Eneko', 'Torre Ortega', 'Eneko Torre', 'Delegado', 4),
  ('primer-equipo', 'José Pablo', 'Portilla Arqúes', 'José P. Portilla', 'Auxiliar', 5);

-- =============================================
-- AA.VV. LA MARISMA - JUVENIL A
-- Source: RFCF match sheets (Tercera Juvenil Grupo D)
-- =============================================

INSERT INTO players (team_slug, first_name, last_name, display_name, position, shirt_number, sort_order)
VALUES
  ('marismas-juvenil', 'Diego', 'Fernández Arenas', 'Diego Fernández', 'POR', 1, 1),
  ('marismas-juvenil', 'Iuric', 'Munteanu Munteanu', 'Iuric Munteanu', 'POR', NULL, 2),
  ('marismas-juvenil', 'Rodrigo', 'Cianca Liaño', 'Rodrigo Cianca', 'DEF', 2, 10),
  ('marismas-juvenil', 'Pablo', 'García Morales', 'Pablo García', 'DEF', 3, 11),
  ('marismas-juvenil', 'Diego', 'Samperio Gutiérrez', 'Diego Samperio', 'DEF', 4, 12),
  ('marismas-juvenil', 'Adrián', 'Higuera Vega', 'Adrián Higuera', 'DEF', 5, 13),
  ('marismas-juvenil', 'Yeray', 'Errea González', 'Yeray Errea', 'MED', 8, 20),
  ('marismas-juvenil', 'Pedro', 'Castelo Angulo', 'Pedro Castelo', 'MED', 9, 21),
  ('marismas-juvenil', 'Juan José', 'Costa Catalina', 'Juanjo Costa', 'MED', 10, 22),
  ('marismas-juvenil', 'Martín Elías', 'Huertas Valbuena', 'Martín Huertas', 'MED', 11, 23),
  ('marismas-juvenil', 'Ethan', 'Ramírez Fernández', 'Ethan Ramírez', 'DEL', 12, 30),
  ('marismas-juvenil', 'Leo', 'Cavada Portilla', 'Leo Cavada', 'DEL', 13, 31),
  ('marismas-juvenil', 'Pablo', 'Martínez Pérez', 'Pablo Martínez', 'DEL', 14, 32),
  ('marismas-juvenil', 'Salvi', 'Fernández Pinho', 'Salvi Fernández', 'DEL', 15, 33),
  ('marismas-juvenil', 'Fernando', 'Miguel Terán', 'Fernando Miguel', '', NULL, 40),
  ('marismas-juvenil', 'Iván', 'Castillo Rydzewski', 'Iván Castillo', '', 16, 41),
  ('marismas-juvenil', 'Rodrigo', 'Campo Abín', 'Rodrigo Campo', 'DEL', NULL, 34),
  ('marismas-juvenil', 'Miguel', 'Sol Ibáñez', 'Miguel Sol', 'DEL', NULL, 35),
  ('marismas-juvenil', 'Alonso', 'Herrera Sarabia', 'Alonso Herrera', 'DEL', NULL, 36);

-- MARISMAS JUVENIL STAFF (from RFCF match sheets)
INSERT INTO staff (team_slug, first_name, last_name, display_name, role, sort_order)
VALUES
  ('marismas-juvenil', 'Alejandro', 'Sainz Zorrilla', 'Alejandro Sainz', 'Entrenador', 1),
  ('marismas-juvenil', 'Alberto', 'Coterillo Gómez', 'Alberto Coterillo', 'Delegado', 2);
