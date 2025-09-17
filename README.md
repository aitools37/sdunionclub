sdunionclub

## 🔧 Configuración de Parse.bot para Clasificación

### Datos necesarios a extraer de la tabla de la RFCF:

La URL objetivo es: `https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=7986463&codgrupo=7986502`

### Estructura de la tabla HTML a extraer:

```html
<table>
  <thead>
    <tr>
      <th>Pos</th>
      <th>Equipo</th>
      <th>Pts</th>
      <th>PJ</th>
      <th>G</th>
      <th>E</th>
      <th>P</th>
      <th>GF</th>
      <th>GC</th>
      <th>Dif</th>
      <th>Últimos 5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><a href="enlace">Nombre del Equipo</a></td>
      <td>52</td>
      <td>22</td>
      <td>16</td>
      <td>4</td>
      <td>2</td>
      <td>58</td>
      <td>18</td>
      <td>+40</td>
      <td>GGEGGG</td>
    </tr>
  </tbody>
</table>
```

### Configuración del scraper en Parse.bot:

1. **Selector de tabla**: `table` o más específico si hay múltiples tablas
2. **Selector de filas**: `tbody tr`
3. **Campos a extraer por fila**:
   - `position`: Primera celda `td:nth-child(1)`
   - `team`: Texto de la segunda celda `td:nth-child(2)`
   - `link`: Atributo href del enlace en la segunda celda `td:nth-child(2) a`
   - `points`: Tercera celda `td:nth-child(3)`
   - `played`: Cuarta celda `td:nth-child(4)`
   - `won`: Quinta celda `td:nth-child(5)`
   - `drawn`: Sexta celda `td:nth-child(6)`
   - `lost`: Séptima celda `td:nth-child(7)`
   - `goalsFor`: Octava celda `td:nth-child(8)`
   - `goalsAgainst`: Novena celda `td:nth-child(9)`
   - `goalDifference`: Décima celda `td:nth-child(10)`
   - `form`: Undécima celda `td:nth-child(11)` (últimos 5 resultados como "GGEGP")

### Ejemplo de configuración JSON para Parse.bot:

```json
{
  "url": "https://www.rfcf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&codcompeticion=7986463&codgrupo=7986502",
  "selector": "tbody tr",
  "fields": {
    "position": "td:nth-child(1)",
    "team": "td:nth-child(2)",
    "link": "td:nth-child(2) a@href",
    "points": "td:nth-child(3)",
    "played": "td:nth-child(4)",
    "won": "td:nth-child(5)",
    "drawn": "td:nth-child(6)",
    "lost": "td:nth-child(7)",
    "goalsFor": "td:nth-child(8)",
    "goalsAgainst": "td:nth-child(9)",
    "goalDifference": "td:nth-child(10)",
    "form": "td:nth-child(11)"
  }
}
```

### Variables de entorno necesarias:

```env
REACT_APP_PARSEBOT_API_KEY=tu_api_key_de_parsebot
```