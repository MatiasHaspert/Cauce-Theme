# ICONOS.md — Como agregar un icono nuevo

Los iconos del tema son **SVG inline**, no una fuente. No hay nada que descargar en runtime
y no hay ninguna URL que regenerar (ver `docs/DECISIONS.md` D-029).

Conviven dos sets y **no son intercambiables**:

| Snippet | Estilo | viewBox | Se usa en |
|---|---|---|---|
| `cauce-iconos.liquid` | trazo, `stroke` | `0 0 24 24` | secciones propias CAUCE |
| `material-icon.liquid` | relleno, `fill` | `0 -960 960 960` | blocks reusados de Shrine |

Elegi el que corresponde a la seccion que estas tocando. Mezclarlos se nota.

---

## Agregar un Material Symbol

El editor de Shopify deja escribir cualquier nombre de
[Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols&icon.platform=web),
pero solo renderizan los que estan en el snippet. **Un nombre que no este no rompe nada: no
dibuja nada.** Si pusiste un icono en el editor y no aparece, es esto.

### 1. Traer el path

Reemplaza `NOMBRE` por el nombre exacto del icono, en snake_case:

```bash
curl -s -A "Mozilla/5.0 Chrome/131.0.0.0" \
  "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/NOMBRE/wght300/24px.svg"
```

`wght300` no es opcional: es el peso que usaba la fuente variable del tema. Bajarlo en el
`wght400` que ofrece por default la web de Google Fonts te deja ese icono mas grueso que el
resto. Para la variante rellena, `wght300fill1` en lugar de `wght300`.

### 2. Pegarlo en el snippet

En `snippets/material-icon.liquid`, dentro del `case`, en orden alfabetico:

```liquid
    when 'nombre'
      assign icon_path = 'M480-120q-133...'
```

Copia **solo el contenido del atributo `d`**, sin el `<svg>` ni el `<path>` que los envuelven.
El snippet ya pone el `viewBox`, el `1em` y el `currentColor`.

### 3. Si el icono se usa relleno

Agregalo tambien con sufijo `__fill` y sumalo a la lista `fillable` de arriba del `case`:

```liquid
  assign fillable = 'check_circle,pause,person,play_arrow,verified,nombre' | split: ','
```

Antes de hacerlo, compara los dos archivos. Varios iconos tienen la variante rellena identica a
la delineada (`check`, por ejemplo) y ahi el `__fill` es peso muerto: dejalo afuera y `filled:
true` cae solo en la delineada.

---

## Lo que no hay que hacer

**No le pongas `width`, `height` ni `fill` al SVG.** El snippet los deja en `1em` y
`currentColor` a proposito, para que el icono herede el `font-size` y el `color` que ya manejan
el slider de tamano y el selector de color del editor:

```css
.icon-with-text .material-icon { font-size: var(--icon-size); }
.material-icon--custom-color   { color: var(--color-icon); }
```

Si hardcodeas los del archivo que baja Google (`height="24px" fill="#e3e3e3"`), esos controles
dejan de tener efecto y quedan dos fuentes de verdad peleandose.

**No borres el `viewBox`.** Sin el, el SVG no escala.

**No vuelvas a meter un `@font-face` de iconos.** Era el recurso mas pesado de la PDP: 350 KB
con `font-display: block`, LCP mobile en 7,4 s.
