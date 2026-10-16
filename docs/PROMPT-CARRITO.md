# Prompt — Carrito CAUCE (Numen × Shrine)

> Este archivo **es un prompt**. Se lo pasás entero a un modelo que trabaje sobre este repo.
> Todo lo que sigue después de la línea es lo que se copia.

---

## Rol

Sos desarrollador senior de temas Shopify trabajando sobre el tema **CAUCE**
(`Shrine Pro Con Esteroides + 186 Sections`, Shrine Pro reskineado). CAUCE vende suplementos
dietarios en Argentina, un solo SKU hoy (R-ALA 600), con el catálogo pensado para crecer
duplicando `templates/product.cauce-landing.json` + metafields.

**Antes de escribir una línea, leé** (en este orden):

1. `docs/DECISIONS.md` — el log de decisiones. Es la constitución del proyecto. Prestá atención
   a D-002 (tokens), D-012 y D-045 (medios de pago), D-029 (íconos SVG), D-031 (brandboard v2),
   D-043 (locales), D-044 (disclaimer editable).
2. `docs/CLAIMS-AUDIT.md` — **regla 1: ningún claim se escribe en un `.liquid`.**
3. `assets/cauce-brand.css` — bloque 0 (tokens contextuales) y bloque 2 (utilidades de marca).
   Ningún archivo del tema declara un hex fuera de ahí.
4. `docs/METAFIELDS.md` — namespace `cauce.*`.

No edites un archivo que no leíste en esta sesión.

## Qué hay que hacer

Rehacer el carrito de CAUCE —**drawer y `/cart`**— tomando el diseño y los componentes de
**otro tema mío, Haspert-Theme (línea "Numen", perfumería)**, y conservando de Shrine lo único
que Shrine hace mejor: que el carrito sea **una sección con bloques reordenables desde el theme
editor**.

Repo fuente: `https://github.com/MatiasHaspert/Haspert-Theme`. Clonalo en un directorio
temporal; no lo agregues a este repo ni como submódulo.

### El estado de partida, para que sepas contra qué peleás

El carrito de CAUCE hoy es **Shrine de demo, sin tocar, en inglés**:

- `config/settings_data.json` → `current.sections["cart-drawer"]`, bloques en este orden:
  `countdown_timer` (ON, *"Cart reserved for [timer]"*), `checkpoints_bar` (OFF, metas
  "Free Shipping / 20% OFF / Free Gift" con montos en dólares), `progress_bar` (OFF, *"Spend
  [amount] more to get FREE shipping!"*), `cart_items`, `discount_field` (OFF), `subtotals`,
  `checkout_btn`, `payment_badges`. Título de la sección: `"Cart • [count] items"`.
- El mismo archivo tiene settings legacy de carrito con datos de la demo, entre ellos
  `cart_upsell_1_product = "thedogface-designer-dog-jacket"`.
- `templates/cart.json`: debajo del carrito quedaron un `featured-collection` *"You may also
  like"* sobre la colección `all`, y un `newsletter` con copy en inglés.

Nada de eso es CAUCE. Todo se reemplaza o se apaga con criterio explícito.

## La arquitectura

**De Shrine se conserva una sola cosa: la sección con bloques.** `sections/cart-drawer.liquid`
sigue siendo una sección con `{% schema %}` y bloques reordenables, y su configuración sigue
viviendo en `settings_data.json` → `current.sections["cart-drawer"]`. El comercio tiene que
poder prender, apagar y reordenar piezas del carrito sin abrir código.

Numen resuelve esto con un orden fijo de `{% render %}` dentro de un snippet: **eso es un
downgrade, no lo copies.**

**Todo lo demás sale de Numen**: el layout, la línea de producto, los componentes de AOV y de
reaseguro, el patrón de re-render por AJAX, y sobre todo el criterio de qué se muestra y qué no.

En Numen el carrito vive en:

| Archivo | Qué es |
|---|---|
| `snippets/cart-drawer.liquid` | el drawer entero (la sección homónima es un `render` de una línea) |
| `snippets/cart-line-item.liquid` | la línea de producto, **compartida** por drawer y `/cart` vía un parámetro `context` |
| `snippets/cart-trust.liquid` | reaseguro de una línea, sin badges ni emojis |
| `snippets/free-shipping-bar.liquid` | barra de progreso de envío gratis |
| `snippets/cart-cross-sell.liquid` | cross-sell que **agrega por AJAX**, no linkea a la PDP |
| `snippets/cart-transfer-benefit.liquid` | beneficio por transferencia + cuotas |
| `snippets/cart-b2b-nudge.liquid` | nudge del canal mayorista |
| `snippets/cart-decant-legal.liquid` | nota legal condicionada al contenido del carrito |
| `snippets/cart-empty.liquid` | empty state compartido |
| `assets/numen-cart-add.js` | el AJAX del cross-sell |
| `assets/component-numen-cart.css` | el CSS (`.nc-*`) |
| `sections/main-cart-items.liquid`, `sections/main-cart-footer.liquid` | `/cart` reusando los mismos snippets |

Leelos todos antes de decidir nada. Los comentarios de cabecera de esos snippets explican por
qué cada cosa está donde está; esa información vale más que el markup.

## Componente por componente

Para cada uno: de dónde sale, en qué se convierte acá, y qué bloque lo envuelve. Todo lo que
diga "bloque" es un `{% when %}` en el `case block.type` de `sections/cart-drawer.liquid`, con
su entrada correspondiente en el `{% schema %}`.

### 1. Línea de producto → bloque `cart_items`

Portá `cart-line-item.liquid` **completo, incluido el parámetro `context`**: una sola línea para
el drawer y para `/cart` es la mejor decisión de ese carrito y acá se replica.

Conservá **intactos** los hooks que cablea el JS de Dawn. Numen los lista en su comentario de
cabecera: `cart-item#{row_id}`, `quantity-input` con `name="minus"`/`"plus"`, `#{qty_id}` con
`name="updates[]"`, `cart-remove-button[data-index]` con un `<a href=url_to_remove>` adentro,
`.cart-item__name`, `.loading__spinner`, `#{error_id}` con `.cart-item__error-text`.
**Verificalos contra el `cart.js` / `cart-drawer.js` de ESTE repo, no contra el de Numen**: son
temas distintos y los selectores pueden no coincidir. Si difieren, mandan los de acá.

El `<a>` de remove es progressive enhancement: sin JS elimina por navegación. No lo conviertas
en `<button>`.

Cambios de contenido respecto de Numen:

- **Chip de presentación.** Numen muestra `custom.tipo_presentacion` (Decant / Sellado), que acá
  no existe. Usá `cauce.formato` (ej. *"30 cápsulas"*); si falta el metafield, no hay chip.
- **Precio por unidad.** Numen muestra `$X/ml`. El equivalente CAUCE es **precio por día de
  uso**, derivable de `snippets/cauce-duracion.liquid` (`unidades_envase ÷ dosis_diaria`). Si
  falta cualquiera de los dos metafields **no se muestra nada** — nunca un `0`. El texto sale de
  un locale nuevo, no de un `.liquid`.
- **Íconos.** En Numen son SVG inline sueltos. Acá el tema ya tiene `snippets/cauce-iconos.liquid`
  (trazo, `viewBox 0 0 24 24`) y `material-icon` para lo reusado de Shrine (D-029). Usá
  `cauce-iconos`; si le falta un glifo, agregalo ahí en vez de pegar un `<svg>` en el markup.

### 2. Reaseguro → bloque nuevo `trust_line`

`cart-trust.liquid` es una línea sola, muteada, sin badges ni emojis, con cada token en su propio
`<span>` nowrap y el separador `·` puesto por CSS con `::before` **para que no quede un `·`
huérfano al final de un renglón cuando wrapea en mobile**. Copiá esa técnica tal cual.

Los tokens de Numen (original / devoluciones / despacho hoy) se reemplazan por los de CAUCE.
Candidatos, todos ya en el repo: arrepentimiento a `settings.cauce_dias_arrepentimiento` días,
envío, y la leyenda de precio en pesos con IVA. **No inventes claims**: cada token sale de
`locales/es.json → cauce.*` o de un setting. Si un token depende de capacidad operativa (tipo
"despacho hoy"), va detrás de un checkbox que se pueda apagar, como hace Numen con
`dispatch_today_enabled`.

### 3. Envío gratis → bloque `progress_bar` (el de Shrine, reescrito)

Shrine ya trae `progress_bar` y `checkpoints_bar`. **Conservá los bloques, reescribí el render**
con `free-shipping-bar.liquid` de Numen, que es mejor en tres cosas concretas:

- `role="progressbar"` con `aria-valuenow` y `aria-valuetext` reales.
- La base del cálculo es `cart.items_subtotal_price` (subtotal de **lista**), no el total con
  descuentos: así un descuento de carrito no mueve la barra. Es coherente con cómo se calculan
  las cuotas y el beneficio de pago.
- Estado "logrado" en verde sobrio, nunca fluo, y transición respetando `prefers-reduced-motion`.

**Dos cosas de Numen que NO se copian:** los colores literales dentro del `{% style %}` (en CAUCE
van tokens, D-002) y el `<style>` por snippet (el CSS del carrito va todo junto en un bloque
nuevo de `assets/cauce-brand.css`).

El umbral: CAUCE ya tiene `settings.cauce_umbral_envio_gratis`, pero es de tipo **`text`** y el
cálculo necesita un número. Resolvelo (`| plus: 0`, o migrar el setting a `number`) y **decí
cuál elegiste y por qué**.

### 4. Cross-sell → bloque `product_upsells` (el de Shrine, reescrito)

De Numen se toma **el comportamiento**: el botón agrega la variante por AJAX
(`assets/numen-cart-add.js`) pidiendo las secciones ya renderizadas en la misma llamada a
`/cart/add` y re-renderizando las mismas regiones que usa Dawn, en vez de mandar a la PDP.
Portá ese JS adaptándolo a los selectores de este tema.

De Numen **no** se toma el criterio de match (familia olfativa) ni el gancho (la variante decant
disponible más barata): acá no hay ni una cosa ni la otra.

**Con un solo SKU en catálogo, un cross-sell no tiene qué ofrecer.** Antes de codearlo, proponé
qué debería empujar el carrito de CAUCE y esperá respuesta. Opciones a evaluar: segundo o tercer
frasco (que es como CAUCE ya vende, en escalones de cantidad), suscripción
(`settings.cauce_suscripcion_activa` ya existe, apagada), o dejar el bloque implementado pero
apagado hasta que haya catálogo. **Lo que no puede quedar es el handle de la demo de Shrine.**

### 5. Beneficio de pago → bloque nuevo `payment_benefit`

Portá `cart-transfer-benefit.liquid`. Es la pieza más fina de ese carrito y las razones están
escritas en su comentario de cabecera. Respetalas todas:

- Vive **dentro de la región re-renderizada del footer**, para que el monto se recalcule solo al
  cambiar cantidades.
- Muestra el **ahorro**, no un segundo precio, y **nunca tacha un precio**.
- El beneficio no se autoaplica: se comunica el código y se aclara que baja en el checkout.
- Consolida transferencia + cuotas en una sola card, para no duplicar wrapper ni gating ni dejar
  una card vacía.

En CAUCE las cuotas salen de `settings.cauce_cuotas` y el texto de
`locales/es.json → cauce.pdp.cuotas`. Si CAUCE no tiene definido un beneficio por transferencia,
**preguntá antes de inventar un porcentaje**: el bloque puede quedar solo con cuotas.

### 6. Legal → bloque nuevo `legal_note`

Numen muestra una nota legal condicionada al contenido del carrito (`cart-decant-legal`). CAUCE
tiene el equivalente exacto y ya escrito: **`{% render 'cauce-disclaimer' %}`** (suplemento
dietario + RNPA, Disp. ANMAT 4980/05). Ver D-044: el texto vive en
`settings.cauce_disclaimer_texto` con fallback al locale, y hoy se renderiza en cuatro lugares.
Este carrito sería el quinto: **actualizá la lista del §7 de `CLAIMS-AUDIT.md`.**

Va en versión compacta (primera frase, sin la de consulta médica), como en la barra legal del pie.

### 7. Medios de pago → bloque `payment_badges` (reescrito)

El bloque de Shrine renderiza con `payment_type_svg_tag`, que no conoce Mercado Pago, Cabal ni
Naranja X. **Ya está resuelto en este repo**: reemplazalo por `{% render 'cauce-medios-pago' %}`,
igual que se hizo en el pie. Ver **D-045 y D-012**.

Si el carrito queda sobre fondo oscuro, los logos propios necesitan placa blanca — la regla ya
existe en `cauce-brand.css` bloque 16. Reusala en vez de escribir otra.

### 8. Empty state

Portá `cart-empty.liquid` de Numen, incluido el detalle que marca su comentario: **contiene el
`<a>` que el trap de foco espera cuando el carrito queda vacío**. Verificalo contra el `cart.js`
de este repo.

### 9. Checkout y footer del drawer → bloques `subtotals` y `checkout_btn`

De Numen: el CTA que muestra **etiqueta + separador + monto** (`.nc-cta`), y el "seguir
comprando" como acción secundaria de texto. De Shrine: que sigan siendo dos bloques separados y
movibles.

Numen **sacó del drawer** la nota "instrucciones especiales" de Dawn porque comía altura y
empujaba el primer ítem abajo del fold, dejándola viva solo en `/cart`. Es una buena decisión:
replicala. El bloque `cart_note` de Shrine queda disponible pero apagado por defecto.

### 10. `/cart`

Numen resuelve `/cart` reusando **los mismos snippets** que el drawer, con una clase contenedora
que activa el mismo CSS. Hacé lo mismo: `/cart` no puede ser un segundo diseño que se
desincroniza del drawer al primer cambio.

Además, `templates/cart.json` arrastra dos secciones de la demo en inglés
(`featured-collection` "You may also like" y `newsletter`). Decidí qué hacer con las dos y
justificalo. El `newsletter` nativo **no se puede usar**: no pide consentimiento y viola la Ley
25.326. CAUCE tiene `sections/cauce-newsletter.liquid` para eso.

## Lo que NO se porta

- **`cart-b2b-nudge.liquid`.** Es un canal mayorista de perfumería, con gating por
  `tipo_presentacion == 'Sellado'`. CAUCE no tiene canal B2B. No lo traigas "por las dudas".
- **El precio por ml y el chip Decant / Sellado**, ya cubierto arriba.
- **La paleta Ultramar (`--nc-*`) y las fuentes de Numen.** CAUCE tiene su propio brandboard
  (D-031). Portás estructura y criterio, **no un solo color**.
- **El prefijo `.nc-`.** Renombralo: los componentes de este tema son `.cauce-*`.

## Reglas del repo que no se negocian

1. **Ningún hex fuera de `assets/cauce-brand.css`.** Ni en `.liquid`, ni en `.json`, ni en un
   `{% style %}`. Los tokens contextuales del bloque 0 ya resuelven claro/oscuro solos.
2. **Ningún texto de cara al cliente escrito en un `.liquid`.** Va a `locales/es.json` **y a
   `locales/en.default.json`** (D-043: el default es el fallback de toda clave faltante), o a un
   setting. Una clave nueva va a los dos archivos.
3. **Todo dato que falte se muestra como pendiente visible**, nunca oculto. El patrón está en
   `snippets/cauce-dato-legal.liquid` y la razón en D-004.
4. **El CSS del carrito va en un bloque nuevo numerado de `cauce-brand.css`**, con cabecera que
   explique qué resuelve, igual que los 16 que ya están. Nada de un `component-*.css` nuevo.
5. **Íconos SVG inline**, cero fuentes de íconos (D-029).
6. `theme check` tiene que quedar en **el mismo número de warnings que ahora (59)**, sin ninguno
   nuevo en los archivos que tocaste:
   `SHOPIFY_CLI_NO_AUTO_UPDATE=1 "$APPDATA/npm/shopify" theme check`
7. **Accesibilidad**: foco visible (`.cauce-page :focus-visible` ya existe), trap de foco del
   drawer intacto, `role="status"` en los totales, error de línea anunciado, y contraste AA
   verificado **con números**, no con "se ve bien".

## Tres cosas que tenés que traerme antes de codear

No las decidas solo:

1. **El `countdown_timer` está prendido y dice *"Cart reserved for [timer] more minutes"*.** El
   carrito no se reserva: es urgencia falsa. En Argentina es exponible ante Defensa del
   Consumidor, y además contradice el criterio de todo este tema, que publica leyendas legales
   por obligación y muestra pendientes en vez de esconderlos. Mi posición es apagarlo. Si ves un
   argumento para conservarlo, decilo; si no, apagalo y dejalo asentado.
2. **Qué empuja el cross-sell con un solo SKU** (ver §4).
3. **Si existe beneficio por transferencia en CAUCE**, con qué porcentaje y qué código (ver §5).

## Entregable

- **Plan corto antes de tocar código**: qué bloques quedan, cuáles se agregan, cuáles se apagan,
  y en qué orden queda el drawer. Esperá el OK.
- Implementación en commits chicos y atómicos.
- **Una entrada nueva en `docs/DECISIONS.md`** (la próxima es D-046), con el formato de las que
  ya están: decisión, alternativa descartada, por qué, y qué queda pendiente. Si una decisión
  tuya actualiza una vieja, anotalo en la vieja.
- Cierre con: qué hiciste, qué falta, **una o dos mejoras o riesgos que no te pedí**, y cómo
  testearlo a mano en mobile (~380px) y en desktop.
