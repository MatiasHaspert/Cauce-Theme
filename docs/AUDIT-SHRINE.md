# AUDIT-SHRINE.md — Auditoría del tema base

**Fase 1 · CAUCE / Ácido R-Alfa Lipoico 600 mg**
Branch: `feature/cauce-pdp-ralfa` · Fecha: 2026-08-21

---

## 0. Resumen ejecutivo

El tema es **Shrine Pro** (derivado de Dawn) con dos packs de secciones de terceros mezclados
(`sp-*` = Sections Pro, `ss-*` = otro pack). Total: **196 secciones**, **82 snippets**, 37 assets.

Tres conclusiones que definen todo lo que sigue:

1. **`sections/main-product.liquid` (279 KB, 36 tipos de block) ya resuelve ~90 % del hero PDP**,
   incluido el selector de oferta de 3 escalones con precio tachado y ahorro, el sticky ATC y los
   acordeones. No hay que escribir una sección de hero: hay que configurarla.
2. **Las secciones `sp-*` y `ss-*` hay que descartarlas casi por completo.** No usan el sistema de
   `color_scheme` del tema: cada una trae sus propios `background_color` / `text_color` /
   `override_fonts` como settings sueltos. Usarlas rompe la regla 3.3 ("todo el branding en un solo
   lugar") y además pesan (una sola sección de trust badges mete 139 KB de SVG inline en el HTML).
   La familia nativa de Shrine (`multicolumn`, `icons-with-content`, `icon-bar`,
   `collapsible-content`, `content-tabs`, `comparison-table`, `testimonials`, `horizontal-ticker`,
   `custom-columns`) sí hereda los tokens del tema y es la que vamos a usar.
3. **Nada del tema cubre los requisitos legales argentinos.** Botón de arrepentimiento, libro de
   quejas, Data Fiscal y disclaimer de suplemento dietario hay que construirlos. Es la única parte
   del blueprint que es 100 % obra nueva y no negociable.

Hay además **tres hallazgos que requieren tu decisión antes de la Fase 2** (§5).

---

## 1. Inventario

| Carpeta | Archivos | Nota |
|---|---|---|
| `sections/` | 196 | 62 nativas Shrine + 118 `sp-*`/`ss-*` + 16 `main-*` |
| `snippets/` | 82 | 30 son `icon-*.liquid` |
| `templates/` | 22 | todos JSON salvo `gift_card.liquid` |
| `assets/` | 37 | `base.css` 370 KB, `main.js` **ofuscado** |
| `locales/` | 52 | `es.json` + `es.schema.json` presentes |
| `config/` | 2 | `settings_schema.json`, 31 grupos |
| `__MACOSX/` | 473 | **basura de descompresión, 685 KB, versionada en git** |

### Sistema de diseño del tema

`layout/theme.liquid` genera dentro de un `{% style %}` un set de custom properties tipo Dawn a
partir de los settings globales:

```
--color-base-text          <- settings.colors_text
--color-base-background-1  <- settings.colors_background_1
--color-base-background-2  <- settings.colors_background_2
--color-base-accent-1      <- settings.colors_accent_1
--color-base-accent-2      <- settings.colors_accent_2
--font-heading-family / --font-body-family
--buttons-radius, --pickers-*, --quantity-*, --inputs-*, --media-*, --page-width ...
```

Las secciones nativas exponen un select `color_scheme` (`background-1`, `background-2`, `accent-1`,
`accent-2`, `inverse`) que resuelve contra esos tokens.

**Consecuencia para el branding:** los colores CAUCE se mapean directo a settings globales.
`cauce-brand.css` no reescribe colores sección por sección — declara los tokens `--cauce-*` y
remapea las variables del tema una sola vez.

Mapeo vigente (brandboard **v2**, ver `DECISIONS.md` D-031):

| Token CAUCE | Hex | Setting del tema |
|---|---|---|
| CAUCE | `#10262A` | `colors_text`, `colors_outline_button_labels` (y fondo de `.color-inverse`) |
| BLANCO | `#FFFFFF` | `colors_background_1` (= fondo dominante), `colors_solid_button_labels` |
| SEDIMENTO | `#E9E6DC` | `colors_background_2` (= bandas y bloques sobre blanco) |
| ÓXIDO | `#B03A22` | `colors_accent_1` (= botón de compra y precio, sobre claro) |
| ÓXIDO CLARO | `#D9603F` | sin setting: `--cauce-acento` lo resuelve sobre fondo CAUCE |
| VADO | `#5F99A2` | `colors_accent_2` (= íconos, gráficos) |

El acento de dos valores no cabe en un setting, porque Shrine tiene uno solo por rol. Se
resuelve con tokens contextuales en el bloque 0 de `cauce-brand.css`: `--cauce-acento`,
`--cauce-acento-label`, `--cauce-icono` y `--cauce-secundario` cambian de valor según el
esquema de la sección, y todo lo demás los consume sin repetir la regla por esquema.

Mapeo anterior (v1), para leer commits viejos: TINTA `#10262A` = `colors_text`; SEDIMENTO
`#E9E6DC` = `colors_background_1`; BRONCE `#B98A44` = `colors_accent_1`; VADO `#6F9BA1` =
`colors_accent_2`.

### Tipografías

`settings_schema.json` ofrece `custom_header_font_link` / `custom_body_font_link`, pero
`theme.liquid` los mete dentro de un `@font-face { src: url(...) }`: esperan un **archivo de
fuente**, no una hoja de estilos de Google Fonts. No sirven para cargar Newsreader/Archivo por link.
→ Se cargan con un `<link>` propio en `theme.liquid` (una línea marcada CAUCE) + `cauce-brand.css`.

El tema ya carga **Material Symbols Outlined** (variable font desde `fonts.gstatic.com`) para todo
su sistema de íconos por nombre (`check_circle`, etc.). Para los pocos íconos VADO de CAUCE conviene
SVG inline; la fuente queda disponible para los blocks de Shrine que la usan.

---

## 2. Mapeo blueprint → tema

Leyenda: **REUSAR** = configurar lo existente · **REUSAR+** = existente más un ajuste chico ·
**NUEVO** = hay que escribirlo.

| # | Sección del blueprint | Qué lo cubre hoy | Veredicto |
|---|---|---|---|
| 1 | `cauce-announcement` | `announcement-bar.liquid` — blocks `announcement`/`discount`/`socials`, slider con autoplay, `color_scheme`, visibilidad por producto | **REUSAR** |
| 2 | `cauce-header` | `header.liquid` — `logo_position`, `mobile_logo_position: center`, `sticky_header_type`, `display_search`, menú simple sin mega menú | **REUSAR** |
| 3 | `cauce-hero-pdp` | `main-product.liquid` — ver §3 | **REUSAR+** |
| 4 | `cauce-pilares` | `icon-bar.liquid` (4 `column`, `icon_color`, slider mobile) o `icons-with-content.liquid` | **REUSAR** |
| 5 | `cauce-ugc-carousel` | `sp-video-grid` (6 KB pero sin color scheme y es grilla, no carrusel); `ss-product-vidoes` (72 KB); `image-slider` (no soporta vertical con poster) | **NUEVO** |
| 6 | `cauce-beneficios-cards` | `multicolumn.liquid` — imagen + título + richtext por `column`, slider desktop/mobile, `cards_color_scheme` | **REUSAR** |
| 7 | `cauce-datos` | nada. Ninguna sección lee metafields ni usa una familia mono | **NUEVO** |
| 8 | `cauce-explicacion` | `rich-text.liquid` (7 tipos de block) o `custom-columns.liquid` | **REUSAR** |
| 9 | `cauce-banda-oscura` | `icon-bar.liquid` con `color_scheme: inverse` | **REUSAR** |
| 10 | `cauce-acordeon-detalle` | `collapsible-content.liquid` — filas + imagen/video lateral. **No lee metafields** | **NUEVO** (versión que lee `cauce.beneficios`) |
| 11 | `cauce-marquee` | `horizontal-ticker.liquid` — blocks `text`/`image`/`reviews`, `speed`, `direction`, `stop_on_hover`. **Le falta `prefers-reduced-motion`** | **REUSAR+** |
| 12 | `cauce-timeline` | `multicolumn.liquid` (3 columnas numeradas). `results.liquid` existe pero está pensado para "antes/después" → territorio de claim | **REUSAR** |
| 13 | `cauce-reviews` | `testimonials.liquid` — `column` blocks, `show_stars`, carrusel, `cards_color_scheme` | **REUSAR** |
| 14 | `cauce-tabs` | `content-tabs.liquid` — blocks `tab` con richtext. **No lee metafields** | **NUEVO** (versión metafield) |
| 15 | `cauce-garantia` | `custom-columns.liquid` (heading + `text_with_icon` + `atc_button`) | **REUSAR** |
| 16 | `cauce-comparativa` | `comparison-table.liquid` — `row` blocks, `us_label`/`others_label`, `number_of_competitors`, logo | **REUSAR** |
| 17 | `cauce-faq` | `collapsible-content.liquid` / `sp-faq`. **Ninguna emite `FAQPage` JSON-LD** | **NUEVO** |
| 18 | `cauce-cta-final` | `custom-columns.liquid` (heading + `text_with_icon` xN + `atc_button`) | **REUSAR** |
| 19 | `cauce-newsletter` | `newsletter.liquid` — blocks `heading`/`paragraph`/`email_form`. **Sin checkbox de consentimiento** | **NUEVO** |
| 20 | `cauce-footer` | `footer.liquid` — `link_list`, `text`, `image`, políticas, medios de pago. **Sin arrepentimiento / libro de quejas / Data Fiscal / disclaimer** | **REUSAR + NUEVO** (`cauce-legal-bar`) |

**Balance: 12 reusadas, 1 reusada con parche, 7 nuevas.**

---

## 3. El hero (bloque 3) en detalle

`main-product.liquid` tiene 53 settings de sección y 36 tipos de block. Contra el checklist del
brief:

| Requisito del hero | Cubierto por | Estado |
|---|---|---|
| Galería con thumbnails + swipe mobile | settings `gallery_layout: thumbnail_slider`, `mobile_pagination`, `mobile_thumbnails`, `image_zoom`, `media_fit` | OK |
| Rating | block `rating_stars` (11 settings) | OK, sujeto a §5.4 |
| Título + subtítulo | block `title` + block `text` | OK |
| 4 bullets con ícono | block `text` "Text with icon" — hasta 3 textos + ícono por block, `icon_color`, ícono custom por imagen | OK |
| **Selector de oferta 3 escalones** | block `quantity_selector` con `enable_quantity_discounts` | OK, ver §3.1 |
| ATC | block `buy_buttons` (26 settings) | OK |
| Sticky ATC mobile | block `sticky_atc` (30 settings, `display_when: after_scroll`, config desktop/mobile separada) | OK |
| Medios de pago | block `payment_badges` | Parcial, ver §3.3 |
| 4-5 acordeones cortos | block `collapsible_tab` (sin límite, ícono, `open` por defecto) | OK |
| Suscripción como checkbox | no existe nativo; depende de la app | Hook desactivado por setting |
| Duración del suministro desde metafield | no existe | Ver §3.2 |

### 3.1 Quantity breaks — funciona, con dos advertencias

`snippets/quantity-breaks.liquid` (977 líneas) genera **4 opciones** con radio `name="quantity"`
atado al form del producto. Por opción: cantidad, badge, imagen, label, benefit, caption, precio,
compare price, `% off` y monto fijo off. Tokens disponibles en los campos de texto:

`[quantity]` · `[price]` · `[compare_price]` · `[price_each]` · `[compare_price_each]` ·
`[amount_saved]` · `[amount_saved_rounded]`

**Advertencia A — los precios son cosméticos.** El propio schema lo dice
(`sections/main-product.liquid:2341`): hay que crear un **descuento automático de Shopify** que
coincida con cada escalón, si no el carrito cobra algo distinto de lo que muestra la PDP. Eso es un
riesgo legal directo (Ley 24.240, precio exhibido ≠ precio cobrado), no solo de CRO.

**Advertencia B — un solo token de plata por campo.** `snippets/text-with-price.liquid` usa una
cadena `if/elsif`: si un texto trae `[price]` y `[compare_price]`, solo se renderiza el primero.
El copy de cada escalón hay que diseñarlo con esa limitación.

### 3.2 Duración del suministro

No hay token para esto. La solución más limpia es agregar `[duracion]` a
`snippets/text-with-price.liquid` (un snippet de 26 líneas, edición chica y marcada), calculándolo
desde `product.metafields.cauce.dosis_diaria` por `[quantity]`. **No toca `main-product.liquid` ni
`main.js`.**

### 3.3 Medios de pago argentinos

`payment_badges` y el footer usan el filtro nativo `payment_type_svg_tag`, cuya lista cerrada es:
`afterpay, american_express, apple_pay, bitcoin, dankort, diners_club, discover, dogecoin, dwolla,
facebook_pay, forbrugsforeningen, google_pay, ideal, jcb, klarna, maestro, master, paypal,
shopify_pay, sofort, unionpay, visa`.

**No incluye Mercado Pago, Cabal ni Naranja X.** Se puede filtrar con `enabled_payment_types` para
sacar Shop Pay / Apple Pay / PayPal / Discover, pero para poner los medios reales de Argentina hace
falta un snippet propio con SVG nuestros.

---

## 4. Piezas nuevas a construir

| Archivo | Para qué | Fase |
|---|---|---|
| `assets/cauce-brand.css` | tokens `--cauce-*`, tipografías, remapeo, overrides mínimos | 2 |
| `assets/cauce.js` | carrusel UGC + a11y de tabs/FAQ. Presupuesto < 30 KB | 4 |
| `sections/cauce-legal-bar.liquid` | arrepentimiento, libro de quejas, Data Fiscal, disclaimer. Va en `footer-group` → aparece en todas las páginas | **crítica** |
| `sections/cauce-datos.liquid` | ficha técnica en DM Mono desde `cauce.composicion` / `cauce.formato` | 4 |
| `sections/cauce-acordeon-detalle.liquid` | filas imagen+texto desde `cauce.beneficios` (JSON) | 4 |
| `sections/cauce-tabs.liquid` | tabs desde `cauce.composicion` / `cauce.modo_uso` / `cauce.faq` / COA | 4 |
| `sections/cauce-faq.liquid` | FAQ desde `cauce.faq` + `FAQPage` JSON-LD | 4 |
| `sections/cauce-ugc-carousel.liquid` | video vertical, scroll-snap, poster, sin autoplay con audio | 4 |
| `sections/cauce-newsletter.liquid` | captura con consentimiento explícito (Ley 25.326) | 5 |
| `snippets/cauce-medios-pago.liquid` | SVG de Mercado Pago / tarjetas locales / cuotas | 3 |
| `snippets/cauce-iconos.liquid` | set de íconos VADO inline | 2 |
| `snippets/cauce-disclaimer.liquid` | leyenda de suplemento dietario + RNPA, reusable | 2 |
| `snippets/cauce-product-schema.liquid` | `Product` JSON-LD con precio ARS, sin `AggregateRating` inventado | 5 |
| `templates/product.cauce-landing.json` | la PDP, duplicable por SKU | 3 |
| `templates/page.arrepentimiento.json` + políticas | páginas legales | 5 |

### Toques al core (mínimos, todos marcados `{% comment %} CAUCE: ... {% endcomment %}`)

| Archivo | Cambio | Por qué |
|---|---|---|
| `layout/theme.liquid` | cargar `cauce-brand.css` después de `base.css`; `preconnect` + `<link>` de Google Fonts | única forma de cargar las tipografías y el CSS de marca |
| `snippets/text-with-price.liquid` | agregar token `[duracion]` | duración del suministro desde metafield |
| `sections/multicolumn.liquid` | quitar la coma final del schema | **bug preexistente**: JSON inválido, `theme check` lo marca |
| `sections/footer-group.json` | agregar `cauce-legal-bar` | legales en todas las páginas |

---

## 5. Hallazgos que requieren tu decisión

### 5.1 Gate de licencia — bloqueante para poder ver el sitio

`layout/theme.liquid:77`:

```liquid
{% if settings.animations_type == blank or settings.animations_type.size < 196 %}
  main{visibility:hidden !important;}
{% endif %}
```

`settings.animations_type` está etiquetado en `settings_schema.json` como **"Authentication token"**
y `config/settings_data.json` trae un token de 196+ caracteres. Se valida contra
`https://shopify.jsdeliver.cloud/js/config.js` (`theme.liquid:18`), un dominio que **no es de
Shopify ni de jsDelivr**.

Traducción: si el token no es válido para la tienda donde subamos el tema, **todo el `<main>` queda
invisible**. La PDP no se ve.

No te puedo ayudar a saltear ese chequeo. Lo que necesito saber es si tenés licencia de Shrine Pro
para la tienda destino. Si la tenés, el token correcto se pega en Theme settings → Authentication y
listo. Si no, hay que comprarla antes de la Fase 2 o cambiar de tema base.

### 5.2 Hotjar de un tercero hardcodeado

`layout/theme.liquid:409-418` tiene un snippet de Hotjar con el comentario
`<!-- Hotjar Tracking Code for https://ceio.store/ -->` y `hjid: 5110780`.

Cada visitante de CAUCE mandaría grabaciones de sesión a la cuenta de Hotjar de otra tienda. Es un
problema de privacidad (Ley 25.326) y de datos comerciales. **Recomiendo sacarlo.** Si querés Hotjar
propio, se pone con tu ID.

### 5.3 `disable_inspect` activado por defecto

`settings_data.json` trae `disable_inspect: true`: bloquea clic derecho, copiar texto y F12.
Molesta para trabajar, no protege nada real y puede interferir con lectores de pantalla.
Recomiendo apagarlo, al menos durante el desarrollo.

### 5.4 Rating en el hero sin reseñas reales

El block `rating_stars` puede mostrar estrellas y "(xxxx Reviews)" con texto libre, sin que exista
una sola reseña. Ponerlo sin reseñas reales es publicidad engañosa (Ley 24.240) además de un
`AggregateRating` falso. **Por defecto lo dejo apagado** hasta que confirmes si hay reseñas y con
qué app.

### 5.5 Higiene del repo

- `__MACOSX/` (473 archivos, 685 KB) está versionado y se subiría a la tienda. Lo saco y agrego
  `.gitignore`.
- No hay `.gitignore` ni `.theme-check.yml`. Los creo en Fase 2.
- `sections/multicolumn.liquid` tiene el schema con coma final (JSON inválido) — bug preexistente.

---

## 6. Datos que faltan (bloqueantes por fase)

| Dato | Lo necesito en | Sin esto |
|---|---|---|
| Licencia Shrine Pro + tienda destino | **Fase 2** | el sitio no renderiza |
| Store de desarrollo para `shopify theme dev` | **Fase 2** | no puedo mostrarte nada corriendo |
| Razón social, CUIT, domicilio, email, teléfono | Fase 5 | footer legal incompleto |
| URL de Data Fiscal AFIP | Fase 5 | falta un obligatorio |
| Precio 1 / 2 / 3 frascos en ARS | Fase 3 | placeholder |
| Quién crea los descuentos automáticos de Shopify | Fase 3 | precio exhibido ≠ cobrado |
| Umbral de envío gratis y plazos reales | Fase 3 | placeholder |
| Dosis diaria (¿1 cápsula por día?) | Fase 3 | no puedo calcular la duración |
| RNPA / RNE | Fase 5 | placeholder en el disclaimer |
| ¿Hay reseñas reales? ¿con qué app? | Fase 4 | sección de reviews vacía |

Todo lo que falte va como `{{ PENDIENTE: ... }}` y queda listado al cierre de cada fase.

---

## 7. Cómo esto sostiene el roadmap

Prueba del shampoo: para lanzar un SKU nuevo hay que (a) duplicar
`templates/product.cauce-landing.json` desde el theme editor, (b) crear el producto, (c) cargar los
metafields `cauce.*`, (d) crear el descuento automático. Ningún `.liquid` se abre.

Lo que hace que eso funcione es que las 7 secciones nuevas leen metafields y las 12 reusadas son
brand-level (idénticas entre SKUs). El riesgo está en las reusadas cuyo contenido *sí* cambia por
SKU — `multicolumn` (beneficios), `content-tabs`, `collapsible-content`: por eso las versiones
metafield de tabs, acordeón y FAQ están en la columna NUEVO y no en REUSAR.
