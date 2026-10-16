# DECISIONS.md — Decisiones de implementación

Registro de decisiones tomadas sin consultar, con la alternativa descartada y el motivo.
Formato: fecha · decisión · alternativa descartada · por qué.

---

## D-001 · 2026-08-21 · Usar solo la familia nativa de Shrine, descartar `sp-*` y `ss-*`

**Decisión.** El cuerpo de la landing se arma con secciones nativas del tema
(`multicolumn`, `icons-with-content`, `icon-bar`, `collapsible-content`, `content-tabs`,
`comparison-table`, `testimonials`, `horizontal-ticker`, `custom-columns`, `rich-text`).
Las 118 secciones `sp-*` / `ss-*` quedan fuera.

**Alternativa descartada.** Usar los packs de terceros, que traen layouts más armados
(`ss-comparison-table-6`, `sp-faq-plus`, `ss-tabs-block`, `sp-trust-badges`).

**Por qué.**
1. No implementan `color_scheme`. Cada una expone `background_color` / `text_color` /
   `override_fonts` propios. Brandear la página significaría repetir los hex de CAUCE en decenas
   de settings, que es exactamente lo que prohíbe la regla 3.3 del brief.
2. Peso. `sp-trust-badges` son 139 KB de SVG inline que van al HTML renderizado;
   `ss-feature-13` son 235 KB de fuente. Contra un presupuesto de LCP < 2.5 s en 4G, no entran.
3. Estética. Son el look "supplement store" saturado de badges que el brief descarta.

**Consecuencia.** Las secciones que quedan sin cubrir por la familia nativa (UGC, datos, tabs y
FAQ desde metafield, newsletter con consentimiento, legales) se escriben de cero como `cauce-*`.

---

## D-002 · 2026-08-21 · Los tokens de marca viven en settings globales, no en CSS

**Decisión.** Los 4 colores CAUCE se cargan en los settings globales del tema
(`colors_text` = TINTA, `colors_background_1` = SEDIMENTO, `colors_accent_1` = BRONCE,
`colors_accent_2` = VADO). `assets/cauce-brand.css` declara los `--cauce-*` como fuente de verdad
documental y agrega lo que el tema no tiene (mono, tracking del logo, aire mínimo).

**Alternativa descartada.** Definir todo en `cauce-brand.css` y sobrescribir las variables del
tema con `!important`.

**Por qué.** El tema resuelve `color_scheme` a partir de esos settings en `theme.liquid`. Si los
seteamos ahí, las 12 secciones reusadas quedan brandeadas sin una línea de CSS y el theme editor
sigue mostrando previews correctos. Sobrescribir por CSS habría dejado el editor mintiendo.

**Riesgo asumido.** El branding queda repartido entre `settings_data.json` y `cauce-brand.css`.
Se mitiga documentando el mapeo en la tabla de AUDIT §1 y versionando `settings_data.json`.

---

## D-003 · 2026-08-21 · El token `[duracion]` va en `text-with-price.liquid`, no en JS

**Decisión.** La duración del suministro se calcula en Liquid, agregando un token `[duracion]` a
`snippets/text-with-price.liquid` a partir de `product.metafields.cauce.dosis_diaria`.

**Alternativa descartada.** Un script propio que reescriba el texto de los quantity breaks en el
cliente.

**Por qué.** `assets/main.js` está ofuscado (string-array), así que no es editable. Pero
`text-with-price.liquid` es un snippet de 26 líneas en Liquid plano por donde ya pasan todos los
labels de los escalones. Es el punto de inyección más chico y no toca `main-product.liquid`.

**Costo.** Es un toque al core del tema. Queda marcado con `{% comment %} CAUCE: ... {% endcomment %}`
y anotado en AUDIT §4.

---

## D-004 · 2026-08-21 · Los legales argentinos van en `footer-group`, no en el footer

**Decisión.** Se crea `sections/cauce-legal-bar.liquid` y se agrega a `sections/footer-group.json`
como sección hermana de `footer`, en vez de configurar blocks dentro de `footer.liquid`.

**Alternativa descartada.** Resolver arrepentimiento, libro de quejas, Data Fiscal y disclaimer con
blocks `text` / `image` / `link_list` del footer nativo, que técnicamente alcanzan.

**Por qué.** Con blocks, los obligatorios legales dependen de que alguien no los borre desde el
theme editor al rediseñar el footer. Como sección propia con settings requeridos y fallbacks
visibles, el incumplimiento es evidente y auditable. `footer-group` garantiza que aparezca en todas
las páginas, incluido home y checkout-adyacentes.

**Precisada por D-046 (2026-08-31).** La regla del "pendiente visible" que sale de acá es
sobre **datos que la ley obliga a publicar**: ahí esconder el hueco es esconder un
incumplimiento. No aplica a los datos comerciales que faltan —un umbral de envío gratis, un
número de cuotas—, donde publicar `[[PENDIENTE: …]]` en la cara del cliente sería peor que
callarse. Para esos, el carrito usa la tercera vía: nada en la tienda y un aviso bajo
`request.design_mode`, o sea sólo para quien puede cargarlo. Ver D-046 §6.

---

## D-005 · 2026-08-21 · Íconos VADO en SVG inline, no Material Symbols

**Decisión.** Los íconos de las secciones CAUCE salen de `snippets/cauce-iconos.liquid` (SVG inline
con `currentColor`). Material Symbols queda solo donde ya lo usan los blocks reusados de Shrine.

**Alternativa descartada.** Usar el sistema de íconos por nombre del tema
(`{% render 'material-icon', icon: 'check_circle' %}`).

**Por qué.** Material Symbols Outlined es una variable font traída de `fonts.gstatic.com`. Para
media docena de íconos es un round-trip de red y un archivo grande contra el presupuesto de LCP.
Además `currentColor` deja que el ícono tome VADO desde el token sin un setting de color extra.

---

## D-006 · 2026-08-21 · Reseñas: `testimonials` nativo, sin `AggregateRating`

**Decisión.** El bloque 13 usa `testimonials.liquid`. No se emite `AggregateRating` en el JSON-LD y
el block `rating_stars` del hero arranca desactivado.

**Alternativa descartada.** Activar `rating_stars` con un texto tipo "(1.200 reseñas)" como hacen
los temas de dropshipping.

**Por qué.** No hay reseñas todavía. Inventarlas es publicidad engañosa bajo Ley 24.240 y marcado
estructurado falso ante Google. El brief lo pide explícito ("Schema.org solo si son reales").

**Pendiente de vos.** Si hay reseñas reales y una app (Judge.me, Loox, Ryviu), se reevalúa: el tema
ya lee `product.metafields.reviews.rating` y tiene hooks para Loox y Ryviu.

---

## D-007 · 2026-08-21 · Espanol como locale por defecto y borrado de los otros 48

**Decision.** `es.json` pasa a ser `es.default.json` (y `es.schema.json` a
`es.default.schema.json`). Se borran los otros 50 archivos de `locales/`, ingles incluido.

**Alternativa descartada.** Dejar `en.default.json` como default y `es.json` como traduccion.

**Por que.** La tienda es solo Argentina, sin selector de pais ni de idioma (regla 3.1). Con
ingles como default, cualquier string que Shrine no tradujo caia en ingles en una tienda
rioplatense. Ademas `theme check` valida contra el locale default: con espanol como default,
las etiquetas de las secciones CAUCE se validan en el idioma en el que se van a leer.

**Impacto medido.** De 1.645 a 20 errores de `theme check` en un paso. Los 1.625 eran los otros
locales sin las claves nuevas.

**Riesgo y mitigacion.** Antes de renombrar se compararon las claves: a `es` le faltaban 8, todas
bajo `shopify.checkout.*`. Se completaron a mano. Si manana se agrega un segundo idioma, se
recupera el archivo desde git (`git show main:locales/en.default.json`).

---

## D-008 · 2026-08-21 · Nombres de tag dinamicos reescritos como variable

**Decision.** El patron `<{% if x %}a{% else %}div{% endif %}>` se reescribe como
`{%- liquid assign tag = ... -%}` + `<{{ tag }}>` en los 6 archivos donde aparecia y que si usamos:
`header.liquid`, `logo-list.liquid`, `main-product.liquid`, `bundle-offer.liquid`,
`cart-drawer.liquid` (snippet) y `upsell-block.liquid`.

**Alternativa descartada.** Apagar la regla `LiquidHTMLSyntaxError` en `.theme-check.yml`.

**Por que.** Shopify acepta el patron original, pero el parser de theme-check no, y **se corta en el
primer error de cada archivo**: mientras estuviera ahi, cualquier error real que escribieramos mas
abajo en `main-product.liquid` o en `header.liquid` quedaba invisible. Apagar la regla habria
tenido el mismo efecto. El HTML renderizado es identico; se verifico que cada apertura tenga su
cierre correspondiente.

**Alcance.** Las mismas ocurrencias en secciones `sp-*` / `ss-*` no se tocaron: estan fuera del
alcance por D-001 y `.theme-check.yml` ya las ignora.

---

## D-009 · 2026-08-21 · Borrar tres secciones importadas de otro tema

**Decision.** Se eliminan `special-banner.liquid`, `spotlight-products.liquid` y
`spotlight-block.liquid`.

**Alternativa descartada.** Escribir a mano las 115 claves de traduccion que les faltan.

**Por que.** No son de Shrine. Referencian namespaces que no existen en ningun locale de este tema
(`sections.layout.*`, `sections.collection_lookbook.*`, `sections.main_lookbook_page.*`,
`sections.policies_block.*`) y ademas piden tres assets que no estan en `assets/`
(`component-special-banner.css`, `component-spotlight-products.css`, `lookbook-script.js`). Aunque
alguien las insertara, renderizarian sin estilos y con las etiquetas rotas. Ningun template las
referencia.

**Impacto.** 244 errores menos. Si aparecen los archivos que faltan, se recuperan desde git.

---

## D-010 · 2026-08-21 · Se elimina el snippet cjpod

**Decision.** Se borra `snippets/cjpod.liquid`.

**Por que.** Es una integracion de CJ Dropshipping que inyecta `frontend.cjdropshipping.com/egg/pod3.js`
en las paginas de producto y vuelca el objeto `product` completo a `window`. Ningun archivo del tema
lo renderiza, asi que hoy esta muerto, pero es un script de terceros esperando a que alguien lo
conecte. Nada del roadmap de CAUCE lo necesita.

---

## D-011 · 2026-08-21 · El label del boton solido es TINTA, no blanco

> **REVERTIDA por D-031 (2026-08-25).** Valia mientras el acento era BRONCE. Sobre OXIDO los
> numeros se dan vuelta: blanco da 6.04:1 y TINTA 2.61:1. La etiqueta del boton es blanca.
> Lo que sigue queda como registro del razonamiento, no como regla vigente.

**Decision.** `colors_solid_button_labels` = `#10262A` (TINTA).

**Alternativa descartada.** Blanco o SEDIMENTO sobre el boton BRONCE, que es lo que se ve en la
mayoria de las tiendas.

**Por que.** Contraste medido sobre BRONCE `#B98A44`:

| Label | Ratio | AA texto |
|---|---|---|
| Blanco `#FFFFFF` | 3.10:1 | falla |
| SEDIMENTO `#E9E6DC` | 2.48:1 | falla |
| **TINTA `#10262A`** | **5.09:1** | **pasa** |

El boton de compra es el elemento mas importante de la pagina; no puede ser el que no pasa AA.
Ademas tinta sobre bronce lee mas editorial que blanco sobre dorado.

**Relacionado.** Por la misma razon existen `--cauce-bronce-texto` y `--cauce-vado-icono` en
`cauce-brand.css`: los tokens puros como texto sobre SEDIMENTO dan 2.48:1 y 2.44:1. Se ajusto el
tono del texto, no el token de marca.

---

## D-003bis · 2026-08-22 · Correccion: el token `[duracion]` no va en `text-with-price.liquid`

**Que cambia.** D-003 decia que la sustitucion de `[duracion]` iba adentro de
`snippets/text-with-price.liquid`. Al implementarlo aparecieron dos impedimentos y la
sustitucion termino en `snippets/quantity-breaks.liquid`.

**Impedimento 1 — el JS pisa el texto.** Cada label de escalon se renderiza dos veces:
una en el servidor via `text-with-price`, y otra en el cliente, porque el tema guarda la
plantilla cruda en un atributo `data-text` y la vuelve a resolver al cambiar de variante
(clases `dynamic-price variant-price-update`). Ese atributo se escribe directo desde
`block.settings`, sin pasar por el snippet. Resolviendo el token solo en el snippet, el
primer cambio de variante mostraba `[duracion]` en crudo.

**Impedimento 2 — Liquid no admite filtros en argumentos de `render`.** El intento de
pasar `text: block.settings.option_1_label | replace: ...` dio 24 errores
`UnsupportedFilterArguments` en `theme check`.

**Solucion.** Al tope de `quantity-breaks.liquid` se calculan cuatro duraciones (una por
escalon) y se derivan 24 variables `cauce_oN_campo` con el token ya resuelto. Esas
variables reemplazan a `block.settings.option_N_campo` en **las 80 referencias del
archivo**, incluidos los guardas `!= blank`. Eso ultimo importa: un SKU sin metafields de
dosis deja el caption vacio, y con el guarda apuntando a la variable el renglon
directamente no se renderiza.

**Costo.** El toque al core es mas grande de lo previsto (un archivo, 80 referencias) pero
es mecanico y esta generado por script, no a mano. Si Shrine actualiza el archivo, se
reaplica corriendo el mismo reemplazo.

---

## D-012 · 2026-08-22 · Medios de pago propios, no el block `payment_badges`

**Decision.** `snippets/cauce-medios-pago.liquid` reemplaza al block `payment_badges` del
tema en la PDP.

**Alternativa descartada.** Usar `payment_badges` con la lista de tipos configurada.

**Por que.** Ese block renderiza con el filtro `payment_type_svg_tag`, que solo conoce el
set fijo de Shopify: visa, master, american_express, paypal, apple_pay, shop_pay,
discover, diners_club. **Mercado Pago no esta**, que en Argentina es el medio principal, y
la mitad de los que si estan son los que el brief pide sacar.

**Como resuelve.** Las marcas que Shopify si dibuja salen como SVG nativo. Las locales
(Mercado Pago, Cabal, Naranja X, Pago Facil, Rapipago) salen como **chip tipografico** en
DM Mono. No se redibujaron los logos: un logo de marca dibujado de memoria es un logo mal
dibujado, y ademas la regla de marca prohibe la sopa de sellos. Si el comercio quiere los
logos oficiales, sube una tira en `settings.cauce_img_medios_pago` y esa imagen reemplaza
a los chips.

**Nota.** La lista de medios es un setting, no una constante. Mostrar un medio que la
tienda no acepta seria publicidad enganosa bajo Ley 24.240.

---

## D-013 · 2026-08-22 · Borrar los cuatro archivos `*.context.*.json`

**Decision.** Se eliminan `header-group.context.04d13b88-….json`,
`header-group.context.international.json` y sus dos equivalentes de footer.

**Por que.** Son overrides de mercado heredados de la tienda donde se exporto el tema.
Los cuatro estan **vacios** (`"sections": {}`) y apuntan a mercados que no existen en
`causear.myshopify.com`, asi que el push los rechazaba con "el nombre de archivo principal
header-group.json no existe". Ademas CAUCE es un solo mercado sin selector de pais
(regla 3.1), asi que no hay override que preservar.

**Como se encontro.** El push a la tienda, no `theme check`: son archivos de datos que
solo valida el servidor de Shopify.

---

## D-014 · 2026-08-22 · Los placeholders en JSON usan `[[PENDIENTE: x]]`, no `{{ }}`

**Decision.** En archivos `.json` (templates y section groups) el marcador de dato
faltante es `[[PENDIENTE: clave]]`. En archivos `.liquid` se mantiene
`{% raw %}{{ PENDIENTE: clave }}{% endraw %}` como pedia el brief.

**Por que.** Shopify interpreta `{{ … }}` dentro de un setting de JSON como **dynamic
source** (binding a metafield o setting). El push fallo con "La fuente dinamica
'PENDIENTE: email_contacto' es invalida". No es una preferencia de estilo: la sintaxis
del brief es imposible ahi.

**Consecuencia.** Para listar todos los pendientes hay que buscar las dos formas:
`grep -rn "PENDIENTE" templates/ sections/ snippets/`.

---

## D-015 · 2026-08-22 · El token `[duracion]` no se aplica a los escalones por variante

**Decision.** `snippets/product-variant-options.liquid` (los quantity breaks que se arman
desde el `variant_picker`) queda **sin** soporte de `[duracion]`.

**Por que.** En ese modo cada escalon es una **variante distinta**, no una cantidad. Los
metafields de dosis viven a nivel producto, asi que las tres filas mostrarian la misma
duracion — y el caso real donde alguien usaria ese modo es justamente un producto con
varios tamanos, donde cada variante rinde distinto. Poner un numero igual en las tres
seria inventar un dato.

**Cuando se resuelve.** Cuando exista un SKU con tamanos distintos. Ahi los metafields de
dosis pasan a nivel variante y el calculo se hace por variante. No antes.

---

## D-016 · 2026-08-22 · Un solo elemento BRONCE en el hero: el boton de compra

> **VIGENTE, con el color cambiado por D-031 (2026-08-25).** Donde dice BRONCE, leer OXIDO
> (`#B03A22` sobre claro, `#D9603F` sobre CAUCE). La regla no cambio; el acento si.

**Decision.** En `templates/product.cauce-landing.json`, el unico elemento que resuelve a
BRONCE es el boton de agregar al carrito. El precio va en `text` (TINTA), los escalones de
cantidad en `text`, y los iconos de los bullets en `accent-2` (VADO).

**Alternativa descartada.** Los defaults de Shrine, que ponen `accent-1` en el precio, en
el borde del escalon seleccionado y en el badge — tres bronces compitiendo.

**Por que.** Es la regla 1 del brandboard, y ademas coincide con lo que conviene por CRO:
si el unico acento calido de la pantalla es el boton, el ojo va ahi. Con el precio tambien
en bronce, el acento se reparte y no senala nada.

---

## D-017 · 2026-08-22 · Los escalones de cantidad arrancan con descuento 0

**Decision.** Los tres escalones tienen `option_N_percentage_off_text: "0"` y el pill de
beneficio dice `[[PENDIENTE: descuento_x2]]` / `_x3`.

**Por que.** El porcentaje de descuento por cantidad es una decision comercial, no una de
implementacion, y el brief prohibe inventar numeros. Con 0, los tres escalones muestran el
precio real multiplicado, que es cierto aunque no sea persuasivo.

**Advertencia que sigue vigente desde la fase 1.** Los precios de los escalones son
**solo display**. El descuento real lo tiene que aplicar un **descuento automatico de
Shopify** con las mismas cantidades y porcentajes. Si no coinciden, la PDP muestra un
precio y el carrito cobra otro: eso es infraccion al art. 7 y 8 de la Ley 24.240, no un
detalle de UX. Cargar los porcentajes en el theme editor **y** en Descuentos, o ninguno de
los dos.

---

## D-018 · 2026-08-22 · Los schemas de las secciones cauce-* usan texto plano, no claves `t:`

**Decision.** Los `{% schema %}` de `cauce-datos`, `cauce-tabs`, `cauce-acordeon-detalle` y
`cauce-ugc` escriben sus labels en castellano directo, sin pasar por
`locales/es.default.schema.json`.

**Alternativa descartada.** Usar `t:sections.cauce_*.…` como hace Shrine.

**Por que.** Son etiquetas del theme editor, no copy de la tienda: no las lee un cliente,
no son auditables bajo la regla 3.1 y la tienda tiene un solo idioma. La indireccion solo
agrega un archivo mas donde equivocarse y una clase de error (`ValidSchemaTranslations`)
que ya nos costo 244 offenses en la fase 2.

**Alcance.** El copy que **si** ve el cliente sigue saliendo de `locales/es.default.json` o
de settings. Ni un solo string de storefront esta hardcodeado en estas secciones.

---

## D-019 · 2026-08-22 · La seccion de resenas queda en el template pero desactivada

**Decision.** El bloque 13 esta en `product.cauce-landing.json` como seccion
`testimonials` con `"disabled": true` y sin bloques.

**Alternativa descartada.** Dejarla afuera del template, o ponerle testimonios de relleno.

**Por que.** Todavia no hay resenas reales. Un testimonio inventado es publicidad enganosa
bajo Ley 24.240, y "lorem ipsum" en una seccion activa es exactamente lo que se publica por
accidente. Con `disabled` la seccion aparece en el editor, ya configurada con el esquema de
color y el layout correctos, y alcanza con destildarla el dia que haya resenas.

**Cuando se activa.** Cuando existan resenas reales. Ahi tambien se reevalua el
`AggregateRating` del JSON-LD (ver D-006), que hoy no se emite.

---

## D-020 · 2026-08-22 · El detalle de producto sale del hero y pasa a las pestanas

**Decision.** Los acordeones de composicion, modo de uso y analisis se sacan del hero. El
hero queda con dos acordeones de compra: envios y devoluciones. El detalle del producto
vive en el bloque 14 (`cauce-tabs`).

**Se aparta del brief**, que en el bloque 3 pedia "4-5 acordeones cortos debajo del boton
(composicion, uso, envios, garantia)".

**Por que.** El brief pide composicion y modo de uso en el hero (bloque 3) y otra vez en las
pestanas (bloque 14). Como las dos piezas leen el **mismo metafield**, el resultado no era
un resumen y un detalle: era el mismo texto dos veces en la misma pagina. Habia que elegir
uno.

Se eligio las pestanas por dos razones. La primera es de mobile: el hero es la pantalla
donde se decide la compra y cinco acordeones empujan el boton y las objeciones de compra
fuera de vista. La segunda es que junto al boton conviene lo que destraba la compra —
cuando llega, que pasa si no me gusta — y no la ficha tecnica.

**Como revertirlo.** Los tres bloques `custom_liquid` con `cauce-acordeon` estan en el
historial del template (commit de la fase 3). Es copiar y pegar tres entradas en
`blocks` y tres ids en `block_order`.

---

## D-021 · 2026-08-22 · La card de "biodisponibilidad" se reemplaza por "origen del ingrediente"

**Decision.** El bloque 6 (`cauce-beneficios-cards`) usa composicion, dosis, **origen del
ingrediente** y control de lote.

**Se aparta del brief**, que listaba "composicion, dosis, biodisponibilidad, control de
calidad".

**Por que.** Biodisponibilidad no es un dato de composicion, es una afirmacion sobre lo que
el cuerpo hace con el compuesto. Cualquier redaccion util de esa card ("se absorbe mejor",
"mayor biodisponibilidad que la mezcla racemica") es un claim de eficacia comparativa, que
es justo lo que prohibe la regla 3.1 y lo que no podriamos sostener con el COA — el
certificado dice que hay 600 mg de isomero R, no que se absorba mejor.

"Origen del ingrediente" ocupa el mismo lugar argumental (por que esta formula y no otra) y
se respalda con un documento: el certificado de la materia prima.

**Queda anotado en `docs/CLAIMS-AUDIT.md`** como sustitucion deliberada, para que no se
lea como un olvido.

---

## D-022 · 2026-08-22 · Sin libreria de carrusel: scroll-snap y `<details>` nativos

**Decision.** `assets/cauce.js` son 5,6 KB sin comprimir (**1,9 KB gzip**) y contiene
exactamente dos custom elements: `<cauce-tabs>` y `<cauce-ugc>`.

**Por que tan poco.** Todo lo que el navegador ya hace bien quedo en HTML y CSS:

| Necesidad | Resuelto con | JS |
|---|---|---|
| Acordeones | `<details>` / `<summary>` | 0 |
| Carrusel de videos | `scroll-snap-type: x mandatory` | 0 |
| Estado expandido para lectores de pantalla | nativo de `<details>` | 0 |
| Pestanas con teclado | `<cauce-tabs>` | si |
| Play, silenciar, pausar fuera de pantalla | `<cauce-ugc>` | si |

**Degradacion sin JS.** Los paneles de pestanas quedan todos visibles y el carrusel sigue
scrolleando con el poster. Nada desaparece.

**Presupuesto.** El brief pedia menos de 30 KB comprimidos de JS propio. Estamos en 1,9 KB.

---

## D-023 · 2026-08-22 · `cauce-datos` acepta cualquier clave del namespace

**Decision.** Cada fila de `cauce-datos` tiene un campo *clave del metafield* de texto
libre, no un select con claves fijas.

**Por que.** Las filas de la ficha cambian por categoria: una capsula muestra "activo por
capsula", un shampoo muestra "rinde" y un polvo muestra "porcion". Un select cerrado
obligaria a tocar el `.liquid` cada vez que aparece una categoria nueva, que es justo lo que
la arquitectura tiene que evitar.

**Contrapartida.** Una clave mal escrita no da error, simplemente cae al valor fijo. Es la
degradacion correcta: se ve el valor de respaldo, no un hueco.

---

## D-024 · 2026-08-22 · Seccion de suscripcion propia, por el consentimiento

**Decision.** Se crea `sections/cauce-newsletter.liquid` en vez de usar `newsletter`,
`email-signup-banner` o el block `email_signup` del footer.

**Por que.** Los cinco formularios de newsletter que trae Shrine mandan `contact[email]`
y una etiqueta fija, y **ninguno pide consentimiento**. La Ley 25.326 exige consentimiento
libre, expreso e informado; una casilla ausente no lo es, y una premarcada tampoco.

**Como lo resuelve.** Casilla `required` sin premarcar, texto del consentimiento en el
locale (auditable en un solo lugar), link a la politica de privacidad, y la etiqueta que
recibe el contacto deja constancia (`consentimiento-ley-25326`) para que el dato quede
trazable del lado de Shopify.

**Limite conocido.** `required` es validacion de navegador. Para un alta de newsletter
alcanza; si mañana el formulario pide mas datos personales, hay que validarlo del lado del
servidor con una app.

---

## D-025 · 2026-08-22 · No se escribe un snippet de datos estructurados de producto

**Decision.** No se crea `cauce-product-schema.liquid`. Se usa el JSON-LD que ya emite
`main-product.liquid`.

**Por que.** Al auditarlo cumple lo que pedia el brief: `Product` con `offers`, precio
tomado de `cart.currency.iso_code` (ARS), disponibilidad por variante, y **sin
`AggregateRating`**. Escribir uno propio habria duplicado el marcado en la misma pagina,
que es peor que no tener ninguno.

**Lo que si hay que arreglar, y no es del tema.** Ese JSON-LD publica
`"brand": product.vendor`, y el proveedor cargado en Shopify es *Vitalab*. Se corrige en el
admin del producto. Ver `CLAIMS-AUDIT.md` R2.

---

## D-026 · 2026-08-22 · La comparativa compara formatos, no competidores

**Decision.** La columna de comparacion se llama "Suplemento generico" y el texto de la
seccion aclara que la comparacion es **contra el acido alfa lipoico en mezcla racemica**,
que es el formato habitual de la categoria, y no contra ninguna marca ni medicamento.

**Alternativa descartada.** Nombrar marcas, que es lo que hace la referencia.

**Por que.** El brief lo prohibe y ademas es publicidad comparativa con nombre propio, que
en Argentina exige un estandar de prueba que no tenemos.

**Riesgo que queda.** Sigue siendo publicidad comparativa. Las dos primeras filas son
verdaderas por definicion quimica y se sostienen solas; las otras cuatro son sobre
practicas de divulgacion y son las discutibles. Anotado como R5 en `CLAIMS-AUDIT.md`.

---

## D-027 · 2026-08-22 · El CTA de cierre usa `atc_button` sin producto asignado

**Decision.** El bloque 18 usa el block `atc_button` de `custom-columns` **dejando vacio**
el selector de producto.

**Por que.** Con el selector vacio, Shrine renderiza un boton con la clase
`main-product-atc`, que su JS conecta al formulario del producto de la pagina. Eso da tres
cosas a la vez: respeta el escalon de cantidad que el cliente eligio arriba, no obliga a
cargar el producto en el template, y por lo tanto duplicar el template para otro SKU no
requiere tocar este bloque.

**Alternativa descartada.** Un link ancla al selector de ofertas. El id que genera Shopify
incluye el id de la seccion, que no se puede escribir en un JSON de otra seccion.

---

## D-028 · 2026-08-22 · Footer sin selector de pais, idioma ni medios de pago nativos

**Decision.** En `sections/footer-group.json`: `enable_country_selector: false`,
`enable_language_selector: false`, `payment_enable: false`, `show_policy: true`.

**Por que.**
- Pais e idioma: un solo mercado y un solo idioma (regla 3.1). Un selector de pais ademas
  habilita conversion de moneda, que la regla prohibe explicitamente.
- Medios de pago: el block nativo usa `payment_type_svg_tag`, que no conoce Mercado Pago
  (D-012). Se muestran con `cauce-medios-pago` en la PDP y en el cierre.
- `show_policy` en true hace que Shopify liste solas las politicas apenas se escriban, sin
  depender de que alguien arme un menu.

**Nota.** `branding_text` quedo vacio: el "Powered by Shrine" del pie no aporta y compite
con la firma de la marca.

**Actualizada por D-045 (2026-08-30).** `payment_enable` vuelve a `true`: el problema no era
mostrar medios de pago en el pie, era el renderizador. Ahora la tira la dibuja
`cauce-medios-pago`, el mismo snippet de la PDP. Pais e idioma siguen en `false` y
`show_policy` en `true`. El esquema de color pasa de `background-2` a `inverse`.

---

## D-029 · 2026-08-23 · Todo el tema pasa a SVG inline, se elimina Material Symbols

**Decision.** `snippets/material-icon.liquid` emite SVG inline con `currentColor` en vez del
nombre del icono como texto. Se borro el `@font-face` de Material Symbols de `layout/theme.liquid`
y con el la ultima descarga de fuente de iconos del tema. Extiende D-005 al tema completo.

**Alternativa descartada.** Un script que regenerara la URL del subset de gstatic escaneando
`.liquid` y `.json` y reescribiendo `theme.liquid`.

**Por que.** El subset de la fase 6 dejo el LCP en 2,7 s pero creo un modo de falla silencioso:
la lista de iconos vive en el `@font-face` y el editor deja elegir cualquiera de los ~3.000 de
Material Symbols. Al elegir uno afuera del subset la ligadura no resuelve y el nombre se imprime
como texto, recortado a 1em por `max-width` + `overflow: hidden`, o sea una unica letra. Paso al
cambiar un icono a `water_drop` y se vio una "W". El script tapaba el sintoma pero mantenia la
dependencia de red y el paso manual de regeneracion. Con SVG inline no hay fuente, no hay URL que
regenerar y un icono desconocido no renderiza nada en vez de romperse en pantalla.

**Alcance.** Un solo chokepoint: los 54 `render 'material-icon'` del tema siguen igual. Se
reescribio el snippet y se reemplazaron los 4 `<span class="material-symbols-outlined">` sueltos
de `cart-checkpoints-bar.liquid` y `cart-progress-bar.liquid` por renders del snippet.

**Compatibilidad.** El SVG lleva `width`/`height` en `1em` y `fill="currentColor"`, y el span
conserva las clases `material-icon material-symbols-outlined`. Asi heredan el `font-size` y el
`color` que ya setean `.icon-with-text .material-icon { font-size: var(--icon-size) }` y
`.material-icon--custom-color { color: var(--color-icon) }`. Los sliders de tamano y el selector
de color del editor siguen funcionando y no se toco una linea de `base.css`.

**Nota.** Los paths son Material Symbols Outlined en `wght 300`, el mismo peso que declaraba el
`font-variation-settings` de la fuente variable, asi que el render es identico al anterior. Solo
se incluyen variantes rellenas donde el relleno cambia el dibujo y el tema las usa:
`check_circle`, `pause`, `person`, `play_arrow`, `verified`. `check` se descarto porque su
variante rellena es byte a byte igual a la delineada. Para el resto, `filled: true` cae en la
delineada en vez de fallar.

**Pendiente.** Conviven dos sets: `cauce-iconos` (trazo, `viewBox 0 0 24 24`) para las secciones
CAUCE y `material-icon` (relleno, `viewBox 0 -960 960 960`) para los blocks reusados de Shrine.
No se unificaron: son lenguajes graficos distintos y unificarlos es rediseno, no refactor.

---

## D-030 · 2026-08-25 · `ss-glow-testimonial` entra a la landing, pero reescrita

**Decisión.** Se agrega `SS - Glow Testimonial` a `templates/product.cauce-landing.json`
(handle `resenas`, entre `reviews` y `fichas`). La sección se reescribió entera contra el
sistema CAUCE: markup en `sections/ss-glow-testimonial.liquid`, estilo en
`assets/cauce-brand.css` bloque 9, `color_scheme` en vez de pickers de color, cero hex en el
template.

**Alternativa descartada.** Usar la sección del pack tal como venía y brandearla desde el
theme editor cargando los hex de CAUCE en sus nueve settings de color.

**Por qué.** Es la excepción pedida a D-001, y la única forma de que no lo sea de verdad es
que la sección deje de comportarse como una `ss-*`. Sin reescribir habría quedado: los cuatro
colores de marca repetidos en el template, un `<style>` inline por instancia, y —el problema
real— clases globales (`.reviews`, `.parer`, `.reviews_item`) que hacen que dos instancias en
la misma página se pisen entre sí.

**Qué se conservó del original.** El nombre, la marquesina de dos filas en sentidos opuestos y
el halo alrededor de la tarjeta. Es lo que hace reconocible a la sección.

**Qué cambió, y por qué.**

| Original | Ahora | Motivo |
|---|---|---|
| Degradado de 3 colores en una palabra del título | VADO plano | El bronce se usa una vez por pieza y el título nunca es bronce (bloque 1 de `cauce-brand.css`). El degradado no existe en el brandboard. |
| Halo `box-shadow` en un color de setting | Una sombra difusa en VADO | Mismo gesto, un solo color de marca. |
| `border-radius: 100px` fijo | Setting, default 4px | 4px es el radio del sistema. La pastilla sigue disponible. |
| JS que medía el carril con `getBoundingClientRect` en `DOMContentLoaded` + `resize` | Sin JS | El carril se duplica un número par de veces y se anima con `translate3d(-50%)`. No hay nada que medir. |
| `animation: CarouselSlider 45s` hardcodeado, con un setting `animation_time` que no se leía | `calc(var(--cauce-glow-vel) * var(--cauce-glow-items))` | El setting ahora hace algo, y las dos filas van a la misma velocidad lineal aunque tengan distinta cantidad de reseñas. |
| Estrella servida desde el CDN de otra tienda | `cauce-iconos`, icono `estrella` | Era una dependencia de red a un dominio ajeno para un SVG de 300 bytes. |
| Sin `prefers-reduced-motion` | Grilla estática, clones ocultos | Una marquesina detenida a mitad de camino deja tarjetas cortadas por el `overflow`. |
| Sin pausa | Pausa en `:hover` y `:focus-within` | Para leer una reseña hay que poder detenerla. |
| Las copias del carril repetidas en el árbol de accesibilidad | `aria-hidden` en todo lo que no sea la primera copia | Un lector de pantalla leía cada reseña N veces. |

**Contenido.** La sección ya estaba cargada desde el theme editor con 7 testimonios y sus
fotos, con el esquema del pack (bloques `Image`, settings `review_*`). Al cambiar el esquema
esos bloques habrían dejado de renderizar, así que se migraron a `resena` conservando texto,
foto y puntaje palabra por palabra, y se mantuvo la posición elegida en el editor (después de
`main`). El setting `texto` es `inline_richtext` y no `textarea` porque el contenido ya usaba
`<strong>` para el arranque de cada testimonio.

**Lo que la migración NO resuelve, y hay que resolver antes de publicar.** Los 7 textos son
exactamente lo que `docs/CLAIMS-AUDIT.md` §2 prohíbe, y son el único lugar de la tienda que
hoy afirma un beneficio: cifras de glucemia, plazos de resultado, aval de un médico, una
patología y una comparación con otro producto con efecto adverso incluido. Un testimonio no
deja de ser claim terapéutico porque lo firme un cliente (Disp. ANMAT 4980/05), y si no hay
cliente real detrás es además publicidad engañosa (Res. SC 270/2020). Se migró tal cual
porque reescribir el copy de otro no es una decisión de implementación, pero queda anotado
como bloqueante en el checklist de `CLAIMS-AUDIT.md` §6. La sección sigue soportando el caso
vacío: sin texto en ningún bloque no se renderiza y en el editor muestra un aviso.

---

## D-031 · 2026-08-25 · Rebrandeo a la brandboard v2

**Decisión.** Se aplica la paleta v2 completa. El acento pasa de BRONCE `#B98A44` a ÓXIDO
`#B03A22` en dos valores, y **el fondo dominante pasa de SEDIMENTO a BLANCO**. SEDIMENTO baja
a `colors_background_2` y queda como superficie de bloques sobre blanco, que es como lo
describe la brandboard. La tipografía no cambió entre v1 y v2, así que no se tocó.

| | v1 | v2 | Setting |
|---|---|---|---|
| Marca | TINTA `#10262A` | CAUCE `#10262A` | `colors_text` |
| Fondo dominante | SEDIMENTO `#E9E6DC` | BLANCO `#FFFFFF` | `colors_background_1` |
| Superficie | sedimento-2 `#DFDBCE` | SEDIMENTO `#E9E6DC` | `colors_background_2` |
| Acento sobre claro | BRONCE `#B98A44` | ÓXIDO `#B03A22` | `colors_accent_1` |
| Acento sobre oscuro | — | ÓXIDO CLARO `#D9603F` | sin setting |
| Secundario | VADO `#6F9BA1` | VADO `#5F99A2` | `colors_accent_2` |

---

### 1. El acento de dos valores se resuelve con tokens contextuales, no con reglas pareadas

La brandboard define el acento en dos valores según el fondo (`#B03A22` sobre claro,
`#D9603F` sobre CAUCE) y prohíbe VADO sobre SEDIMENTO. En v1 eso estaba resuelto repitiendo
cada regla dos veces: una clara y una `.color-inverse`. Con un acento de dos valores más la
prohibición de VADO, esa forma escalaba a cuatro variantes por regla.

Se reemplaza por cuatro tokens que cambian de valor según el esquema, declarados una sola vez
en el bloque 0 de `cauce-brand.css`: `--cauce-acento`, `--cauce-acento-label`, `--cauce-icono`
y `--cauce-secundario`. Diez pares de reglas colapsaron a diez reglas simples, y la prohibición
de VADO sobre SEDIMENTO dejó de ser una nota en un comentario para pasar a aplicarse sola
(`.color-background-2 { --cauce-icono: var(--cauce-vado-texto) }`).

**Efecto colateral bueno.** `--cauce-bronce-texto` y `--cauce-vado-icono` desaparecen. El
primero existía porque BRONCE daba 2.48:1 sobre SEDIMENTO; ÓXIDO da 4.84:1 y 6.04:1 sobre
blanco, así que el acento ya se usa puro, como lo dibuja la brandboard.

### 2. Revierte D-011: la etiqueta del botón vuelve a ser blanca

D-011 puso `colors_solid_button_labels` en TINTA porque blanco sobre BRONCE daba 3.10:1. Sobre
ÓXIDO, blanco da **6.04:1** y TINTA da 2.61:1: los dos números se dieron vuelta. La brandboard
además lo pide explícito ("botón, precio, texto blanco encima"). `colors_solid_button_labels`
= `#FFFFFF`.

### 3. ÓXIDO CLARO se conserva tal cual, con su límite anotado

ÓXIDO CLARO sobre CAUCE da **4.27:1**: AA para texto grande (≥2.4rem, o ≥1.87rem en negrita) y
para componentes, corto de AA para texto chico. Manteniendo matiz y croma **no existe** un
valor que llegue a 4.5:1 sobre CAUCE — se verificó barriendo la luminosidad a matiz y croma
fijos.

**Decisión tomada: se prioriza la fidelidad a la brandboard.** El hex queda intacto. Lo que se
acota es dónde puede aterrizar: sobre banda oscura el acento va en títulos, precios, datos
grandes y trazo del isotipo, todos usos donde 4.27:1 pasa. Queda anotado como LÍMITE en el
comentario de `.cauce-acento`, al lado del token, no solo acá.

**Un uso violaba ese límite y se corrigió.** El hover de los links de la barra legal es texto
de 1.3rem sobre CAUCE. Pasa a blanco (15.76:1), que además es lo correcto de marca: el óxido se
usa una vez por pieza y ese uso es el botón de compra, no un link del pie.

### 4. Shrine acopla el primer plano de los dos esquemas de acento

`base.css` trae `.color-accent-1, .color-accent-2 { --color-foreground: var(--color-base-solid-button-labels) }`.
O sea que un solo setting decide el texto sobre ÓXIDO **y** sobre VADO. Con acento de dos
valores no alcanza: blanco es el único que funciona sobre ÓXIDO (6.04:1) pero sobre VADO da
3.20:1 y no pasa.

Se separa en `cauce-brand.css` y solo para `accent-2`: `--color-foreground: var(--color-base-text)`,
o sea CAUCE sobre VADO, 4.93:1. Misma especificidad que la regla de `base.css`, gana por orden
de carga. Arrastra `--accent-color` y `--color-button`, que se derivan de él.

**Cómo se encontró.** No lo reportó `theme check` — es contraste, no sintaxis. Salió de auditar
las combinaciones *resueltas* (esquema × rol), no la paleta suelta. Sin ese paso el rebrandeo
habría dejado texto blanco a 3.20:1 en el badge de oferta y en las citas de la landing.

### 5. Las tildes de la comparativa pasan a VADO

`checkmark_bg_color` pasa de BRONCE a **VADO `#5F99A2`**, no a ÓXIDO. Con ÓXIDO habría dos
elementos en óxido en la misma página — el botón de compra y una tabla entera de tildes — y la
regla de la brandboard es un solo elemento en óxido por pieza. Con BRONCE el problema no se
notaba porque el bronce era mucho menos saturado; el óxido compite de verdad con el CTA. VADO
es el token de gráficos e íconos, y CAUCE encima da 4.93:1.

---

**Verificación.** Auditoría de contraste sobre las 5 combinaciones esquema × 4 roles + botón:
todas pasan AA salvo el acento sobre CAUCE (4.27:1, punto 3). `theme check`: 61 offenses antes
y 61 después, ninguna nueva. Render en Chrome headless de las cinco bandas con el CSS real.

**Pendiente de vos.** El setting `logo` apunta a `shopify://shop_images/05-wordmark-descriptor-tinta.png`.
El header no lo usa (renderiza `snippets/cauce-logo.liquid`, que es texto y ya toma los tokens),
pero sigue cargado en el theme editor y lo usan los metadatos sociales. Si ese PNG tiene fondo
SEDIMENTO en vez de transparente, ahora se ve como un recuadro sobre blanco: hay que resubir el
export de v2. Lo mismo con el favicon si alguna vez se sube uno; el fallback inline de
`theme.liquid` ya está en ÓXIDO.

---

## D-032 · 2026-08-25 · La firma de la reseña baja al pie y suma sello de verificación

**Decisión.** En `ss-glow-testimonial` la atribución deja de ser una etiqueta suelta al final
del párrafo. Foto, nombre y sello "Cliente verificado" pasan juntos a un `<figcaption>` al pie
de la tarjeta, y la tarjeta pasa de fila (`foto | texto`) a columna (`texto` sobre `firma`).
El sello es un setting de sección (`etiqueta_verificado`, default `Cliente verificado`) más un
checkbox por bloque (`verificado`, default sí).

**Alternativa descartada.** Dejar la foto centrada a la izquierda y colgar el sello debajo del
nombre, donde ya estaba el nombre.

**Por qué.** Cara, nombre y sello son una sola unidad de atribución: son lo que hace que la
reseña se lea como escrita por una persona y no como copy de la marca. Con la foto a la
izquierda y el nombre al final del párrafo esa unidad quedaba partida por el ancho de la
tarjeta, y el sello agregado lo empeoraba. Es además la estructura de la referencia que se usó
para pedir el cambio. `justify-content: space-between` pega la firma al borde inferior, así que
dentro de una fila todas las firmas quedan a la misma altura aunque las reseñas tengan distinto
largo — la tarjeta ya se estiraba a la más alta, antes ese espacio sobrante quedaba abajo.

**El sello no puede ir entero en VADO**, que es lo que pedía la referencia (su línea de
"Cliente Verificado" va en el color secundario). El número que importa no es el del fondo de la
sección sino el de la **superficie de la tarjeta**, que es un escalón más:

| Esquema | Superficie de la tarjeta | Color del sello | Contraste |
|---|---|---|---|
| `background-1` | SEDIMENTO `#E9E6DC` | VADO-TEXTO | 4.50:1 ✓ |
| `background-2` | SEDIMENTO-2 `#DFDBCE` | VADO-TEXTO | **4.06:1** ✗ |
| `inverse` | `#1b3033` | VADO | **4.33:1** ✗ |

Dos de los tres esquemas quedan cortos de AA para texto de 1.2rem, y `background-2` es
justamente el que usa la landing. Se separa color de peso: la **tilde** lleva el VADO
contextual y como ícono le alcanza con 3:1 (1.4.11), umbral que pasa en los tres esquemas; el
**texto** se queda en `currentColor` a `opacity: 0.85`, que es el mismo remedio del bloque 8 de
`cauce-brand.css` y da 7.75:1. La tilde es `cauce-iconos` → `chequeo`, no un glifo `✓`, así
hereda el color por contexto y no hay una fuente de emoji decidiendo cómo se ve.

**El nombre sale del mono de datos.** Pasa de `.cauce-dato` 1.1rem mayúsculas a Archivo 1.4rem
peso 600. Como etiqueta al final del párrafo el mono funcionaba; ahora encabeza la firma, y una
persona no es un dato. Archivo ya está cargada como variable `400..600`, así que el 600 es un
peso real y no un bold sintético.

**Los nombres cargados son deuda, no dato.** Tres de los siete bloques quedaron con el nombre
que la referencia muestra junto a ese mismo testimonio y esa misma cara (`margaret.png`,
`frank.png`): Margaret E., Frank D., Carol V. Los otros cuatro quedan como
`[[PENDIENTE: nombre_resena_*]]` según D-014 — son datos que no tengo, no datos que invento.
Nada de esto sale del bloqueante que ya abrió D-030: los siete textos siguen siendo los de otra
tienda. Un sello de "cliente verificado" sobre una reseña sin compra detrás es publicidad
engañosa por sí solo (Res. SC 270/2020), así que el checkbox por bloque existe para poder
apagarlo reseña por reseña, y el setting de sección vacío lo saca de toda la sección de una vez.
Anotado en el checklist de `CLAIMS-AUDIT.md` §6.

---

## D-033 · 2026-08-26 · Bloque de dolor: sección propia, no `multicolumn` con íconos

**Decisión.** Entra `sections/cauce-dolor.liquid` — foto, título con el cierre en acento,
bajada y lista de items marcados con cruz — y se instancia en `product.cauce-landing` como
`dolor`, entre la FAQ de entrada (`cauce_faq_nNHY4y`) y los pilares. El texto vive entero en
el template; el `.liquid` no tiene una sola palabra de copy.

**Alternativa descartada.** Armarlo con `multicolumn` + `icon-bar`, que es como están resueltos
`beneficios`, `explicacion` y `timeline`. Tres cosas no salen de ahí: los items serían cuatro
tarjetas en grilla y no una lista de una línea con la marca al costado; el título a dos colores
necesitaría el `title_highlight_color` de Shrine, que es un color picker donde alguien puede
cargar cualquier hex y que el bloque 3 de `cauce-brand.css` justamente neutraliza; y la imagen
quedaría como una columna más, sin control de `loading` ni de relación de aspecto.

**El acento del título es un setting aparte, no un richtext con color.** `titulo` +
`titulo_acento` se concatenan y el segundo va en `.cauce-acento`. Así el par claro/oscuro lo
resuelve el token contextual del bloque 0 y no hay un hex guardado en el JSON del template que
quede mal el día que cambie la paleta. Es la misma razón de D-031.

**El recuadro de cada item va como borde y el texto no.** Sobre CAUCE `--cauce-acento` vale
ÓXIDO CLARO, que da 4.27:1: alcanza para un componente (1.4.11) pero no para texto de 1.7rem.
El marco y la cruz llevan el acento; la frase se queda en `currentColor`. Es el mismo reparto
"color en el ícono, peso en el texto" que resolvió D-032 para el sello de verificado.

**`loading` es un setting.** La sección puede quedar arriba o abajo del pliegue según dónde la
pongan, y una imagen de 21:9 a ancho de columna es candidata a LCP. `carga_prioritaria` marca
`eager` + `fetchpriority="high"`; apagado — el default, y cómo quedó en la landing, donde la
sección es la cuarta — se queda en `lazy` para no competir con la imagen del hero.

**El `sizes` se arma en Liquid y no con `var()`.** El atributo `sizes` lo parsea el HTML, no el
CSS: una custom property ahí no resuelve y el browser descarta el media query entero, con lo
que baja siempre la variante más grande del `srcset`. Los cortes salen del padding real de
`.page-width` (1.5rem hasta 750px, 5rem después).

**En mobile la relación de aspecto tiene piso.** Un recorte 21:9 a 345px de ancho es una franja
de 148px. `min-height: 22rem` deja que `object-fit: cover` recorte a lo ancho en vez de aplastar
la escena; arriba de ese piso manda la relación elegida.

**Dos íconos nuevos en `cauce-iconos`:** `cruz` y `alerta`. Van sin recuadro — el marco lo
dibuja quien los usa — así el mismo glifo sirve suelto en una comparativa y enmarcado en esta
lista.

**El copy es un bloqueante abierto.** La sección es, por construcción, la más expuesta del
tema: una lista de síntomas arriba de un suplemento sugiere que el suplemento los resuelve
aunque ninguna línea lo diga. El texto cargado es el de la referencia y cae en eso. Está
anotado en el checklist de `CLAIMS-AUDIT.md` §6, junto con la nota de §3.3: la landing ya
venía diciendo esas cosas desde el theme editor, esta sección no lo inaugura. Vaciar título,
bajada e items apaga la sección entera sin tocar código.

---

## D-034 · 2026-08-27 · Bloque de solución: sección propia con grilla de beneficios y packshot

**Decisión.** Entra `sections/cauce-solucion.liquid` — volanta, título, bajada, grilla de
beneficios con ícono y foto del producto cerrando — instanciada en `product.cauce-landing`
como `solucion`, inmediatamente debajo de `dolor` y arriba de los pilares. El par queda
armado: una sección nombra el problema y la que sigue presenta el producto. Como en D-033, el
`.liquid` no tiene una sola palabra de copy.

**Alternativa descartada.** Armarlo con `multicolumn`, que es como están resueltos `beneficios`
y `explicacion`. Dos cosas no salen de ahí: los íconos serían imágenes subidas una por una, en
vez del set SVG que ya resuelve el color por contexto con `--cauce-icono` (VADO sobre CAUCE,
VADO-TEXTO sobre SEDIMENTO, que es una regla del brandboard aplicada sola); y el packshot
quedaría como una columna más de la grilla, sin ancho propio ni control de `loading`.

**La imagen tiene tope de ancho propio, separado del ancho del bloque.** `ancho_imagen` (900px
por defecto) contra los 1020px de contenido que deja `ancho_maximo`. Un packshot estirado al
ancho del contenedor se lee como un banner: el producto tiene que quedar más chico que el
bloque que lo contiene. Es el mismo motivo por el que el `sizes` de esta sección tiene un corte
más que el de `dolor` — el pedido se limita con `min()` en los dos tramos de abajo, porque
arriba de 900px la imagen ya no crece.

**En mobile la grilla se queda en dos columnas, no en una.** Son etiquetas de dos o tres
palabras con el ícono arriba: en una sola columna la sección se estira a cuatro pantallas de
scroll para decir muy poco. Medido a 390px cada celda queda en 172px y la etiqueta más larga
("Metabolismo de Glucosa") entra en dos renglones centrados. La cantidad de columnas de desktop
sí es un setting (2, 3 o 4).

**La bajada va en `--cauce-secundario` y no en el color de texto.** Es el gris de apoyo del
brandboard y el token ya resuelve el par: VADO 4.93:1 sobre CAUCE, VADO-TEXTO 5.63:1 sobre
blanco y 4.50:1 sobre SEDIMENTO. Los tres pasan AA como texto, que es lo que esto es. Las
etiquetas de la grilla, en cambio, se quedan en `currentColor`: son el ancla visual de cada
ítem y no pueden depender de un token de apoyo.

**Dos íconos nuevos en `cauce-iconos`:** `gota` y `rayo`. Los dos se dibujan a 4rem acá —el
doble que el `.cauce-icono` de base— así que el trazo ocupa casi todo el viewBox: a ese tamaño
un glifo chico dentro de una caja grande se lee como un error de alineación.

**El packshot ideal es un PNG con fondo transparente.** La referencia es una sola imagen
generada donde los frascos y el fondo son lo mismo. Acá el fondo lo pinta el esquema de color de
la sección, así que una foto con su propio fondo deja un rectángulo que no empalma con CAUCE.
Está dicho en el `info` del setting, y `estilo_imagen` deja redondear las esquinas para cuando
el rectángulo es inevitable y conviene que se lea como una foto y no como un error.

**El copy es un bloqueante abierto, y es el más directo de todos.** Las cuatro etiquetas de la
grilla —"Azúcar Saludable", "Energía Estable", "Metabolismo de Glucosa", "Apoyo
Antioxidante"— son, palabra por palabra, la traducción de los claims que R1 manda sacar de las
imágenes del producto: *"Apoyo Para un Azúcar Saludable"*, *"Energía Estable Todo el Día"*,
*"Apoya el Metabolismo de la Glucosa"*, *"ANTIOXIDANT SUPPORT"*. Sacarlos de la foto y
escribirlos en HTML no los cambia de naturaleza: siguen siendo funciones atribuidas al producto
bajo Disp. ANMAT 4980/05. La bajada agrega el mecanismo ("sacar el azúcar de la sangre y
llevarlo a los músculos") y la volanta agrega un claim de origen ("la molécula alemana") que
necesita el certificado de materia prima de A4/B3. Todo eso queda anotado en el checklist de
`CLAIMS-AUDIT.md` §6. Vaciar título, bajada, ítems e imagen apaga la sección entera sin tocar
código.

---

## D-035 · 2026-08-27 · Bloque de etapas: `<ol>` de filas, no una grilla de tarjetas

**Decisión.** Entra `sections/cauce-etapas.liquid` — título de sección y una fila por etapa,
foto de un lado y panel de texto del otro, pegados — instanciada en `product.cauce-landing`
como `etapas`, debajo de `solucion`. Como en D-033 y D-034, el `.liquid` no tiene copy.

**Es un `<ol>`, no un `<ul>` ni tres tarjetas.** Las etapas son una secuencia: el orden *es* el
contenido. Con `<ul>` un lector de pantalla las lee como opciones intercambiables, y con
tarjetas en grilla se pierde además la lectura de arriba hacia abajo, que es lo que hace que se
entienda como una línea de tiempo.

**La numeración es un campo por bloque y no `forloop.index`.** Escribir "Etapa " en el `.liquid`
para concatenarle el índice sería meter copy en el código, que es justo lo que prohíbe la regla
1 de `CLAIMS-AUDIT.md`. Cuesta un campo más al cargar y a cambio la palabra queda en el
template —greppable y traducible— y permite que la etiqueta no sea un número: "Hoy", "A los 45",
"Dos años después".

**La fila es una pieza sola: columnas pegadas, un solo `border-radius` y `overflow: hidden`.**
El aire está entre filas (`--cauce-aire-s`), nunca adentro. Es lo que hace que cada etapa se lea
como un bloque y la lista como una tira; con gap entre la foto y el panel se leerían seis
elementos sueltos en vez de tres.

**5/12 para la foto y 7/12 para el texto.** Con mitad y mitad el panel queda en 42 caracteres
por línea a 1120px de bloque y un texto de dos renglones se parte en cinco.

**`height: 100%` y `aspect-ratio` juntos en la foto, a propósito.** En desktop la fila es una
grilla y la figura se estira: la altura queda definida, gana el `100%` y la foto toma la altura
del panel — que es lo que hace que las dos columnas terminen parejas sin fijar una altura a
mano. En mobile la figura mide por su contenido, el `100%` se resuelve en `auto` y ahí sí aplica
la relación elegida. Una sola declaración cubre los dos casos, y por eso el `info` del setting
aclara que la relación solo manda en mobile.

**El panel no declara fondo propio: lo pide con `--cauce-fondo-celda`**, el mismo mecanismo de
`cauce-datos`. SEDIMENTO sobre blanco, SEDIMENTO-2 sobre SEDIMENTO. Sobre la banda oscura vale
CAUCE, o sea lo mismo que el fondo: ahí la fila se lee por la foto y por el texto, no por un
recuadro. Es lo único honesto sin inventar un quinto color fuera del brandboard.

**El número de etapa va en `--cauce-secundario` y no en el acento.** La referencia lo pone en
color de marca, pero acá serían tres óxidos en la misma pantalla y la regla es uno por pieza.
Y a 1.1rem el acento tampoco daría: sobre CAUCE vale ÓXIDO CLARO, 4.27:1, que no alcanza para
texto chico. VADO pasa AA como texto en los tres esquemas.

**Las fotos van siempre en `lazy`, sin setting de prioridad.** A diferencia de `dolor` y
`solucion`, esta sección es la sexta de la landing: nunca está arriba del pliegue, y son tres
imágenes grandes compitiendo por el mismo ancho de banda que el hero.

**Nota de orden, que es del usuario y no mía.** La landing queda hoy `dolor` → `solucion` →
`etapas`: problema, solución, problema otra vez. La secuencia natural sería `dolor` → `etapas`
→ `solucion`, o mover `etapas` arriba de `solucion`. Se cambia arrastrando en el editor, sin
tocar código.

**El copy es un bloqueante abierto, y es el más expuesto de los tres.** Nombra valores de
laboratorio ("108. Luego 112"), dibuja una progresión que termina en una consulta médica y
menciona medicamentos ("la cita que tanto temías — la de los medicamentos"). Puesta en la página
de un suplemento, la secuencia sugiere que el suplemento la frena, que es exactamente lo que
mira la Disp. ANMAT 4980/05. Anotado en el checklist de `CLAIMS-AUDIT.md` §6. Vaciar el título de
sección y las tres etapas apaga la sección entera sin tocar código.

---

## D-036 · 2026-08-27 · Bloque de progreso: línea de tiempo con pseudo-elementos

**Decisión.** Entra `sections/cauce-progreso.liquid` — título de sección y una lista de hitos
colgados de una línea vertical, cada uno con pastilla, párrafo y una lista corta de ítems con
tilde — instanciada como `progreso`, debajo de `solucion`. La landing queda `dolor` → `etapas`
→ `solucion` → `progreso`. Como en D-033, D-034 y D-035, el `.liquid` no tiene copy.

**Es la contracara de `etapas`, y por eso es una sección aparte y no un preset de aquella.**
`etapas` cuenta lo que pasa sin hacer nada y describe al cliente; `progreso` cuenta qué esperar
después de empezar y habla del producto. Se parecen en la forma y no se parecen en nada más: el
riesgo legal de una y de otra no es el mismo, y mezclarlas en una sola sección haría que
apagar una apague la otra.

**La línea y los marcadores son pseudo-elementos del `<li>`.** La alternativa era un `<span>`
decorativo por hito, que es markup que un lector de pantalla tiene que saltear para nada. El
tramo de línea de cada hito se estira un `--cauce-aire-m` de más para cruzar el gap y tocar el
tramo del siguiente, así los cuatro tramos se leen como una sola línea; el último corta en el
borde de su propio contenido, porque una línea que sigue más allá del último hito promete un
hito que no existe.

**El marcador se pinta con `rgb(var(--color-background))`.** Necesita ser opaco para tapar la
línea que le pasa por atrás, y ese token es el fondo que el esquema de color ya calculó: el
cuadrado sale hueco en los tres esquemas sin una regla por esquema.

**La pastilla redeclara `--cauce-acento`, y esto es lo más importante de la sección.** El token
del bloque 0 se define **por superficie**, no por sección: adentro de la pastilla el fondo ya no
es CAUCE sino blanco, así que ahí el acento vuelve a valer ÓXIDO puro (6.04:1 sobre blanco,
4.84:1 sobre SEDIMENTO). Heredar el ÓXIDO CLARO de la banda oscura daría 3.69:1 sobre blanco y
no pasaría AA. Es el primer lugar del tema donde una superficie clara vive adentro de una
sección oscura, y deja el patrón sentado para la próxima.

**Las tildes van en el secundario, no en el acento.** Con ocho tildes más cuatro pastillas, el
óxido dejaría de ser un acento y pasaría a ser el color de la sección. El único óxido del
bloque es la etiqueta de cada pastilla, que es la que marca jerarquía; VADO sobre CAUCE da
4.93:1, de sobra para una viñeta.

**La pastilla va en Archivo y no en Newsreader**, aunque sea un `<h3>`. Es una etiqueta de
interfaz, del mismo orden que `.cauce-eyebrow` o `.cauce-dato`, no un título de sección. Y lleva
selector de dos clases —`.cauce-progreso .cauce-progreso__pastilla`— porque la regla del bloque
1 (`.cauce-page h3`) le fijaría el color al foreground de la sección, que sobre la banda oscura
es blanco, adentro de una pastilla blanca. Por el mismo motivo el `font-size` del media query
también va con dos clases: la especificidad gana sobre el orden, y con una sola clase el tamaño
de desktop nunca se aplicaba (encontrado en el QA).

**Los ítems de cada hito se cargan en un `textarea`, uno por línea.** Shopify no da bloques
anidados en secciones clásicas, y un par de campos fijos (`item_1`, `item_2`) congelaría la
cantidad. Se parten con `newline_to_br | split: '<br />'` y no con un `split` por `\n` porque el
editor puede guardar el salto como `\r\n` según el sistema, y ahí quedaría un `\r` colgado al
final de cada ítem.

**Un ícono nuevo:** `visto`, la tilde suelta. La que había (`chequeo`) tiene círculo y es un
sello; esta es una viñeta. De paso `chequeo` pasa a llamarse "Tilde en círculo" en el selector
de `cauce-solucion`, que es lo que siempre fue.

**El copy es el bloqueante más grave de los cuatro bloques nuevos.** No describe una situación:
es un cronograma de resultados con semanas. "Semana 5–8: El Número se Mueve" le pone fecha a un
efecto sobre la glucemia, que es exactamente lo que el §3.3 listaba como algo que la página
deliberadamente no decía, y lo que la Disp. ANMAT 4980/05 prohíbe afirmar de un suplemento
dietario. Además los tres asteriscos no remiten a ninguna nota: un asterisco sin aclaración al
pie es una remisión a nada, y eso solo ya es un problema bajo Ley 24.240 art. 4. Anotado en el
checklist de `CLAIMS-AUDIT.md` §6. Si la sección se queda, el contenido honesto de esta forma es
la **rutina** —cómo se toma, con qué comida, cuánto dura el frasco, cuándo se repone— que no
promete nada y ocupa el mismo lugar en la página.

---

## D-037 · 2026-08-28 · Resultados: sección propia en lugar de la `results` de Shrine

**Contexto.** Desde el theme editor se instanció la sección nativa `results` con tres
porcentajes (88 / 91 / 90), un texto por fila y una imagen. Se pidió adaptarla a CAUCE y
reforzarla.

**Decisión.** Entra `sections/cauce-resultados.liquid` y la instancia nativa `results_WhnfCa`
se reemplaza por `resultados`, en la misma posición (después de `progreso`). Se conservan la
imagen cargada, las tres cifras y el sentido de cada fila; se rehacen la estructura y el
encuadre del copy.

**Por qué no adaptar la nativa con CSS.** Tres motivos, en orden:

1. `results` expone `title_highlight_color` y siete `custom_colors_*` como color pickers. La
   instancia traía `#6D388B` (violeta), `#dd1d1d` (rojo) y `#2E2A39` — ninguno es de CAUCE. El
   bloque 3 de `cauce-brand.css` existe justamente para neutralizar esos pickers; pelearle a
   siete settings de color desde CSS es más frágil que no tenerlos. En la sección nueva no hay
   un solo hex elegible.
2. La nativa no tiene dónde poner la metodología de la encuesta, y una cifra de resultado sin
   fuente no se puede publicar.
3. La nativa pone el porcentaje y un párrafo. Un dato se lee mejor partido en tres —cifra, qué
   dice la cifra, y el detalle—: el ojo baja por la columna de números y el que quiere leer
   lee.

**Lo que se agrega, y por qué es CRO y no adorno.**

- **`metodologia` es un campo propio, con regla arriba, no un renglón del pie.** Una cifra sin
  fuente el lector la descuenta sola: es la diferencia entre "dicen que 88 %" y "88 % de 214
  respuestas, marzo 2026". La credibilidad es la palanca de conversión de un bloque de
  números, y acá coincide con lo que además pide la ley.
- **La volanta lleva el universo y la fecha.** Va arriba del título porque es lo que se lee
  primero y es lo que hace creíble todo lo que viene abajo.
- **Cada fila arranca con un verbo de reporte**: "dijeron", "describieron". El sujeto de la
  frase pasa a ser quien respondió y no el producto. Es a la vez el encuadre honesto y el que
  suena a encuesta de verdad en vez de a folleto.
- **Botón al cierre, apuntando a `#shopify-section-main`.** El bloque de cifras es el pico de
  credibilidad de la página; sin un paso siguiente ese pico se desperdicia y el lector sigue
  scrolleando. El ancla vuelve al bloque de compra sin recargar.
- **`valor` y `barra` son campos separados.** Así una cifra que no es un porcentaje —"9 de
  cada 10", "600 mg", "30 días"— igual puede dibujar su barra, o no dibujarla con `barra: 0`.

**La barra es decorativa y va con `aria-hidden`.** El valor ya está escrito al lado en texto:
un `role="progressbar"` le haría leer el mismo número dos veces a un lector de pantalla. No se
anima: animarla al entrar en viewport pide JS y un observer, y el número ya está escrito.

**Dos detalles de CSS que salieron del QA.** La pista de la barra es un pseudo-elemento y no un
`background` con `opacity` sobre el contenedor: `opacity` crea un grupo de composición y se
comería también el relleno, que tiene que quedar opaco. Y el layout sin imagen necesita
`align-items: stretch` explícito, porque el `center` que centra la foto contra el texto pasa a
ser eje transversal cuando el contenedor vuelve a ser columna y encoge el cuerpo al ancho de su
contenido.

**La cifra va en DM Mono con `tabular-nums`**, como `.cauce-datos__valor`: los números de esta
marca son datos, no titulares. El espacio fino antes del `%` se escribe en el campo —es lo
correcto en castellano— y se compensa en el CSS con `word-spacing`, porque el espacio de una
monoespaciada mide 0.6em y a 4.4rem son 26px de aire entre el número y el signo.

**El copy es el bloqueante más grave del tema, por encima de D-036.** Un porcentaje de
resultado es la afirmación más fuerte que puede hacer una página de producto, y es publicidad
verificable: hay que poder mostrar la encuesta. Hoy no hay ninguna. Además el §4 de
`CLAIMS-AUDIT.md` registra que un "bloque de porcentajes de resultado" ya se había descartado
en su momento por ser cifra de eficacia; volvió por el editor. Los tres `[[PENDIENTE: ...]]`
cargados siguen la convención de D-014: son datos que no tengo, no datos que invento. Si la
encuesta no existe, la versión honesta de este bloque son las cifras que sí se pueden probar
—600 mg por cápsula, 30 días de frasco, los días de garantía— que ocupan el mismo lugar, se
ven igual de bien y no dependen de nadie.

---

## D-038 · 2026-08-28 · La home vende el SKU: `featured-product` y el CTA a la landing

**Decisión.** Dos cambios en `templates/index.json`. La sección `producto` pasa de
`featured-collection` a `featured-product` apuntada al único SKU
(`acido-r-alfa-lipoico-capsulas-de-600-mg-en-forma-r-pura`), con bloques título + precio +
botón. Y el CTA del hero deja de apuntar a `/collections/all` para ir directo a la landing.

**El `featured-collection` no estaba mal configurado: estaba sin configurar.** No tenía la
clave `collection`, así que Shopify caía al onboarding y la home mostraba "Example product
title" con imágenes fantasma. Encima estaba en `columns_desktop: 3` con `products_to_show: 4`
para un catálogo de un producto: una card sola en una grilla de tres. Para un solo SKU la
grilla es la primitiva equivocada — no hay nada que grillar.

**El precio se muestra en la home, el botón de compra no.** El bloque lleva `title`, `price` y
`button`, no `buy_buttons`. Esconder el precio genera fricción y pre-califica mal, así que se
muestra; pero el ATC no va, porque el argumento de la marca —el COA, la composición, los 10
días— vive entero en la landing. Un ATC en la home deja comprar sin haber visto una sola
prueba, que es exactamente lo contrario de lo que la marca dice ser. El botón dice "Comprar" y
lleva a la PDP: es la convención de cualquier card de producto y el destino sí es donde se
compra.

**El `price` copia los settings de la landing, no los defaults.** `price_color: text` y
`displayed_badge: none`. El default del bloque es `accent-1`, que bajo los tokens de marca es
ÓXIDO: un precio en el color del acento compite con el botón, y D-016 ya fijó que el acento en
un hero es un solo elemento. `mobile_media_corner_radius` baja de 12 a 2, que es el
`card_corner_radius` global.

**El `?view=cauce-landing` es deuda anotada, no una decisión de arquitectura.** El link es
`/products/<handle>?view=cauce-landing` porque R7 de `CLAIMS-AUDIT.md` §5 sigue abierto: el
producto figura con "Producto predeterminado" en el admin, así que un link limpio caería en
`product.json` y no en la landing. El día que se asigne la plantilla, el parámetro sale y el
link queda `/products/<handle>`. Con la plantilla asignada el parámetro es redundante pero
inofensivo, así que el orden entre las dos cosas no importa.

**Riesgo conocido del parámetro:** el picker de URL del editor de temas puede normalizar el
valor si alguien abre la sección y vuelve a guardar, y ahí el `?view=` se pierde en silencio.
Es una razón más para cerrar R7 en vez de convivir con el workaround.

---

## D-039 · 2026-08-29 · Hero propio con media al costado; la home deja el `rich-text`

**Decisión.** Entra `sections/cauce-hero.liquid` — volanta, título con cierre en acento,
bajada, hasta dos botones y un pie chico, con una imagen o un loop de video al costado — y la
sección `hero` de `templates/index.json` deja de ser `rich-text` para instanciarla. Suma el
bloque 15 de `assets/cauce-brand.css` y un tercer custom element, `<cauce-hero>`, en
`assets/cauce.js`. El copy es exactamente el que ya tenía el `rich-text`: no entra ni una
línea nueva.

**Alternativa descartada: agregarle media al `rich-text` de Shrine.** La sección no tiene
bloque de imagen ni de video. Los únicos campos de media son `custom_image_background` y
`custom_mobile_image_background`, y los dos se activan sólo con `color_scheme: custom`, que
obliga a cargar hexes a mano en el JSON del template. Eso choca de frente con D-002 y D-031.

**La media va al costado, nunca de fondo — y no hay opción de fondo.** Un video cambia de
luminancia cuadro a cuadro: la tabla de contraste del bloque 0 de `cauce-brand.css` mide pares
de color fijos, no un frame promedio. Sobre un fondo en movimiento no se puede afirmar que el
titular cumple 1.4.3; habría que medirlo frame por frame o taparlo con un velo que arruina la
imagen. Al costado, el texto se apoya siempre sobre un `color_scheme` ya medido.

**El poster es el LCP y el video no compite con él.** El `<img>` va con `eager` +
`fetchpriority="high"` y es el que define la altura del marco. El `<video>` va encima en
`position: absolute`, con `preload="none"` y **sin** `autoplay`: no baja un byte hasta que
`<cauce-hero>` decide arrancarlo, y aparece por opacidad recién en el evento `playing`, así el
layout no salta ni se ve un rectángulo negro. Sin JS queda el poster, que es la degradación
correcta porque el video es atmósfera y no información. Tampoco lleva atributo `poster`: el
`<img>` de abajo ya lo es, y ponerlo dos veces serían dos descargas de la misma foto.

**Y no siempre arranca.** `<cauce-hero>` no reproduce nada si el visitante pidió
`prefers-reduced-motion`, si `navigator.connection.saveData` está prendido o si la conexión es
2g. El `matchMedia` queda escuchando: si alguien activa "reducir movimiento" con la página
abierta, el loop frena.

**El botón de pausa no es opcional (WCAG 2.2.2).** Todo movimiento que arranca solo y dura más
de cinco segundos necesita un control para frenarlo. Aparece recién cuando el video
efectivamente reproduce — hasta ahí lo esconde el `hidden` del HTML — y una pausa a mano gana
siempre: el `IntersectionObserver` no vuelve a arrancar lo que el visitante frenó. El chip va
con fondo sólido y no translúcido porque se apoya sobre un color que cambia cuadro a cuadro, y
es la única forma de garantizar 1.4.11.

**El texto va primero en el DOM; el orden en mobile es un setting.** En desktop la media puede
ir a la izquierda, pero eso se resuelve con `order` en CSS: la escena es atmósfera y no se
pierde nada leyéndola después. Al revés sí se perdería — en un teléfono una imagen 1:1 arriba
del titular lo empuja fuera de la primera pantalla, y al botón con él. El default es "texto
arriba" y `orden_mobile` deja invertirlo. La regla de `order` está acotada a
`max-width: 989px` a propósito: sin eso se filtraría a la grilla de desktop y mandaría la media
a la columna izquierda aunque el setting diga derecha.

**El título de la home es `h2`, no `h1`.** El encabezado del tema ya envuelve el logo en `<h1>`
cuando `request.page_type == 'index'`, así que un `h1` acá sería el segundo de la página. El
setting `titulo_principal` existe para plantillas donde no haya otro `h1` y en la home queda
apagado. Al margen: la home nunca tuvo un `h1` de contenido — el `rich-text` de Shrine
renderiza `h2` —, con lo cual esto no cambia lo que había.

**Sin cierre en acento en la home.** `titulo_acento` existe en el schema, pero en `index.json`
queda vacío: el único ÓXIDO de la pantalla es el botón. Es D-016 aplicado a la home — si el
acento se reparte entre el título y el CTA, no señala nada.

**La imagen todavía no existe y eso se ve.** La sección queda instanciada con
`posicion_media: derecha` y sin imagen, así que renderiza `placeholder_svg_tag` igual que las
secciones nativas. Es deliberado: el hueco aparece en el editor y en la home y no se puede
olvidar. Cuando esté el loop, se carga desde el editor sin tocar código. La escena tiene que
respetar la regla de imagen del proyecto — atmósfera, nunca evidencia: sin laboratorios, sin
batas, sin manos, sin medidores, sin antes y después, y sin packshots generados del frasco,
porque la foto del producto es parte de la oferta (Ley 24.240 art. 8).

---

## D-040 · 2026-08-29 · Banda de condiciones de compra en la home, reusando `icon-bar`

**Decisión.** Entra la sección `banda` en `templates/index.json`, entre `producto` y
`manifiesto`: cuatro ítems de condiciones de compra — envío, arrepentimiento, medio de pago y
contacto — bajo el título **Comprar acá**. Es un `icon-bar`, no una sección nueva, y el copy
es palabra por palabra el de la banda homónima de `product.cauce-landing.json`.

**Sin sección propia, a diferencia de D-033 y D-039.** Las secciones `cauce-*` se escribieron
cuando lo nativo no alcanzaba: `multicolumn` no daba una lista de una línea con marca al
costado, `rich-text` no tiene bloque de media. Acá `icon-bar` da exactamente lo que hace falta
—ícono, título, texto, columnas, esquema de color— y sus íconos ya son SVG inline desde D-029,
así que no hay nada que ganar duplicando código. La regla que queda escrita: sección propia
sólo cuando lo nativo no llega, nunca por prolijidad.

**El copy se repite a propósito.** La landing ya dice estas cuatro cosas con estas mismas
palabras. Reescribirlas para la home habría abierto cuatro claims nuevos que auditar, y peor:
dos páginas prometiendo lo mismo con matices distintos es exactamente lo que un cliente lee
como letra chica. Repetido y verbatim, además, no cuesta nada de mantenimiento.

**No repite lo que ya dicen los pilares.** `pilares` argumenta el producto — isómero R, 600 mg,
laboratorio externo, producción nacional. La banda argumenta la compra. Cero solapamiento: son
las dos preguntas distintas que se hace alguien parado frente al precio.

**SEDIMENTO y no TINTA, que es como está en la landing.** En la landing la banda es la única
sección oscura de la página. En la home, `manifiesto` ya es TINTA a ancho completo: una banda
oscura pegada arriba las funde en un solo bloque negro. Con SEDIMENTO la home queda con un
degradé de peso hacia el cierre —blanco, blanco, blanco, sedimento, tinta— y el manifiesto
sigue siendo el único remate oscuro.

**Dos columnas horizontales, no cuatro verticales.** Es el mismo `icon-bar` que `pilares`, tres
secciones más arriba, así que si copiaba también el layout la home mostraba dos grillas
idénticas de cuatro columnas. Con `columns_desktop: 2` e `icon_layout: horizontal` la banda se
lee distinto sin una línea de CSS nueva, y de paso el ícono al costado del texto es el formato
natural de una condición de compra.

**Sin slider en mobile, y eso no es un detalle de estilo.** `pilares` usa `slider_mobile: true`
con puntos. Acá va apilado: una reversión de riesgo que exige deslizar para descubrirse no
revierte nada, porque la objeción que frena la compra puede ser justo la que quedó fuera de
pantalla. Cuatro ítems de una línea apilados son unos pocos centímetros de scroll.

**No se copian los hexes que arrastra el editor.** La banda de la landing lleva
`title_highlight_color` y seis `custom_*` de color guardados por el theme editor. Ninguno entra
acá: son `color_scheme: custom`, que no usamos, y D-002 y D-031 prohíben hexes en el JSON de
los templates. El `title_highlight_color` además es inerte — el bloque 3 de `cauce-brand.css`
lo pisa con `--hightlight-color: var(--cauce-acento) !important`, y un `!important` de hoja de
estilos le gana a un inline sin `!important`.

**Dos `[[PENDIENTE]]` heredados, no nuevos.** `plazo_envio` y `email_contacto` ya eran los
pendientes 10 y 11 de `COPY-DRAFT.md` §7; ahora aparecen también en la home y la tabla lo
anota. Salen los dos con `grep -rn "PENDIENTE" templates/`, que es justo para lo que existe la
convención de D-014.

---

## D-041 · 2026-08-29 · Cierre de la home: CTA en el manifiesto y FAQ de tres objeciones

**Decisión.** Se completan los dos últimos puntos del plan de la home. El `manifiesto` suma un
bloque `button` con el mismo destino que el resto de la página, y entra la sección `faq`
(`cauce-faq`) entre `banda` y `manifiesto` con tres preguntas. La home queda en seis secciones:
`hero`, `pilares`, `producto`, `banda`, `faq`, `manifiesto`.

**Ni una línea de copy nueva, salvo una pregunta.** Las tres respuestas son texto literal de
`product.cauce-landing.json`: la primera es la columna "Por qué la forma R" de `explicacion`, y
la segunda y la tercera son las preguntas `q3` y `q2` de la FAQ de cierre, que son de las pocas
partes de la landing ya reescritas y auditadas. Lo único redactado acá es el enunciado de la
primera pregunta, y es deliberadamente composicional: **en qué se diferencia**, no para qué
sirve. El encabezado de `cauce-faq` lo dice de frente — una pregunta del tipo "sirve para X"
convierte la sección entera en claim terapéutico.

**Las tres objeciones son las de alguien parado en la home, no en la landing.** Por qué esta
molécula y no cualquier ALA; cómo se verifica que la etiqueta dice la verdad; qué pasa si me
arrepiento. La cuarta candidata natural —cómo se toma— queda afuera a propósito: la posología
tiene que ser transcripción del rótulo aprobado y vive en los metafields de `cauce-tabs`, no en
una FAQ escrita por marketing.

**`emitir_schema` en false, al revés que en la landing.** Dos de las tres preguntas son las
mismas que la landing ya publica como `FAQPage`. Emitirlas en dos URLs duplica la misma entidad
de datos estructurados sin agregar nada; la landing es la página que tiene que ser dueña de ese
marcado. El HTML es idéntico igual — lo único que cambia es el JSON-LD.

**`producto` queda vacío y eso es una elección, no un olvido.** Con el campo vacío la sección
usa `product`, que en la home es nil, así que la fuente son los bloques. Si se le asignara el
SKU, el día que se cargue el metafield `cauce.faq` la home cambiaría sola a las preguntas del
metafield. Acá se quieren exactamente estas tres, en este orden.

**SEDIMENTO otra vez, pegada a la banda.** `banda` y `faq` comparten fondo y se leen como una
sola zona de "resolver dudas": condiciones de compra arriba, objeciones abajo. Para que no
quede una costura en el medio, el `padding_bottom` de la banda baja de 56 a 40 y la FAQ arranca
en 24. La home queda con el degradé de peso que fijó D-040 —tres bloques en blanco, dos en
sedimento, uno en tinta— con el manifiesto como único remate oscuro.

**El CTA de cierre repite etiqueta y destino, no los varía.** "Ver la fórmula", igual que el
hero. Tres botones en la página: dos de descubrimiento que abren y cierran, y el "Comprar" del
bloque de producto en el medio. Cambiarle las palabras al de cierre sonaría a una oferta
distinta cuando es la misma. Sobre TINTA el botón resuelve a ÓXIDO CLARO con etiqueta CAUCE
(4.27:1, AA para componentes), que es lo que ya hace el token contextual del bloque 0: no hubo
que tocar nada.

**Dos bloqueantes nuevos en `CLAIMS-AUDIT.md` §6, encontrados de paso.** Buscando copy auditado
para reusar aparecieron dos lugares de la landing que el checklist no listaba: los cuatro
`collapsible_tab` de `main-product` y la FAQ de entrada `cauce_faq_nNHY4y`. Los dos son copy de
referencia sin reescribir, con patología con nombre, plazos de resultado, comparación con
medicamentos de venta bajo receta y el nombre de la marca de referencia todavía en el texto. La
FAQ de entrada además tiene `emitir_schema: true`, así que publica esos claims como datos
estructurados. Quedan anotados con el mismo formato que los otros bloqueantes. Nada de esto
toca la home ni se modificó en este cambio.

---

## D-042 · 2026-08-29 · R7 cerrado: sale el `?view=cauce-landing` de los tres CTA

**Decisión.** Con la plantilla `cauce-landing` ya asignada al producto en el admin, los tres
CTA de la home dejan el parámetro y quedan en `/products/<handle>` limpio: el del `hero`, el
del bloque `producto` y el de cierre del `manifiesto`. R7 queda marcado como cerrado en
`CLAIMS-AUDIT.md` §5 y en el checklist de §6.

**Es la deuda que D-038 dejó anotada, cobrada.** El parámetro existía sólo porque el producto
figuraba con "Producto predeterminado" y un link limpio habría caído en `product.json` en vez
de la landing. Ese motivo ya no existe. Sacarlo importa por lo que D-038 advertía: el picker de
URL del editor de temas puede normalizar el valor si alguien abre la sección y vuelve a
guardar, y ahí el `?view=` se pierde en silencio y el link se rompe sin que nadie lo note. Un
link sin parámetro no tiene esa clase de falla.

**Si alguna vez hace falta volver atrás**, el parámetro sigue funcionando: `?view=` es un
mecanismo nativo de Shopify y es redundante-pero-inofensivo mientras la plantilla esté
asignada. Lo que no conviene es dejarlo puesto de forma permanente "por las dudas", porque
esconde el estado real de la configuración del producto.

---

## D-043 · 2026-08-30 · Los locales vuelven a `es.json`: el rename de fase-2 nunca llegó al tema

**Contexto.** Apareció un `Translation missing: es.cauce.legal.suplemento` en el disclaimer de
la PDP, dentro del editor. No era un pendiente de contenido: bajando el tema vivo y
consultando el storefront salieron **14 claves rotas en la PDP en producción** —la leyenda de
suplemento (×3), consulta médico (×2), botón de arrepentimiento (×2), defensa del consumidor,
libro de quejas, precio + IVA, consentimiento del newsletter, ver política y título de medios
de pago (×2)—. Todo el namespace `cauce.*` estaba caído, y con él la mitad de las leyendas
obligatorias del marco argentino.

**Causa raíz.** D-007 renombró `es.json` a `es.default.json` y borró los otros 50
locales de Shrine. **Shopify nunca aplicó ese cambio.** El tema vivo sigue teniendo los 52
archivos, con `en.default.json` como default y `es.json` para castellano; `es.default.json` no
existe ahí. Un tema no admite dos `*.default.json`, así que el archivo del repo quedó
rechazado en silencio: ni error en el editor, ni fallo de sync, ni nada en `theme check` —que
audita el repo, donde el archivo sí estaba—. La tienda corre en `es`, leía `es.json`, y ese
archivo nunca tuvo una sola clave `cauce`.

Lo demás sí sincroniza: `snippets/cauce-disclaimer.liquid` del tema vivo es idéntico al del
repo. El agujero era exclusivamente de `locales/`.

**Decisión.** Se revierte la parte de D-007 que renombraba el default. La alternativa que
D-007 había descartado —`en.default.json` de default y `es.json` de traducción— resulta ser la
única que la plataforma acepta, y es la que el tema tuvo puesta todo este tiempo.

- `locales/es.default.json` → `locales/es.json`
- `locales/es.default.schema.json` → `locales/es.schema.json`
- entran `locales/en.default.json` y `locales/en.default.schema.json`, los del tema vivo, con
  el namespace `cauce` y `settings_schema.cauce` fusionados adentro.

**El rename es sin pérdida, y se verificó antes de tocar nada.** Comparación hoja por hoja del
archivo del repo contra el del tema vivo: 334 claves compartidas, **0 con valor distinto**, 0
que existieran sólo en el vivo. El del repo era un superconjunto exacto —las 334 más 43 de
`cauce.*` y 8 de `shopify.checkout.*`—. En los schema, lo mismo: 1069 claves compartidas, 35
propias de `cauce` y 6 nombres de sección que habíamos acortado a propósito y se conservan.

**Por qué el texto castellano también va en `en.default.json`.** El locale default es el
fallback de toda clave que falte en el idioma activo. Poniendo `cauce.*` ahí, una leyenda legal
no puede volver a renderizar "Translation missing" aunque mañana se publique otro idioma o
Shopify resuelva un locale inesperado. Y no hay nada que traducir: son textos que exige la ley
argentina —CAA art. 1381, Res. SCI 424/2020, Ley 24.240— y se publican en castellano en
cualquier idioma que muestre la tienda.

**El motivo por el que D-007 quería el default en castellano no se materializa.** El temor era
que cualquier string que Shrine no hubiera traducido cayera en inglés. Se midió: `es.json`
cubre **las 375 claves** de `en.default.json` y tiene 10 propias encima. Claves que hoy caigan
al fallback inglés: **cero**. Si alguna vez aparece una, se agrega a `es.json` y listo.

**Por qué no se completa el plan original borrando `en.default.json`.** Sería dejar al tema en
vivo sin locale default para ganar una discusión de prolijidad. Además el repo no versiona los
otros 48 archivos y los borrados de `locales/` demostraron no sincronizar, así que el resultado
sería un tema a medio migrar. La prolijidad que sí se puede tener es que el repo llame a los
archivos como el tema los llama.

**Se conserva el banner `auto-generated` de Shopify** en los cuatro archivos. Es el que escribe
el editor de idiomas del admin cuando alguien guarda desde ahí; tenerlo puesto evita que el
próximo sync genere un diff de una línea contra nosotros.

**Regla para adelante.** El archivo de textos es `locales/es.json`. Una clave `cauce.*` nueva
va en `es.json` **y** en `en.default.json`. La regla 1 de `CLAIMS-AUDIT.md` no cambia: ningún
claim se escribe en un `.liquid`.

---

## D-044 · 2026-08-30 · La leyenda de suplemento se edita desde el admin, en un solo campo

**Pedido.** Poder editar `{% render 'cauce-disclaimer' %}` desde el admin sin tocar código.

**Decisión.** Dos settings nuevos en **Configuración del tema → CAUCE → Legales**:
`cauce_disclaimer_texto` y `cauce_disclaimer_consulta`, ambos `textarea`, cargados con el
texto que ya estaba vigente. El snippet los lee con esta prioridad:

1. el parámetro que le pase quien renderiza (`texto:` / `consulta:`)
2. el setting global
3. `locales/es.json → cauce.legal.*`

**Alternativa descartada: hacerlo editable bloque por bloque.** Era lo más literal —convertir
el `custom_liquid` en una sección con settings, o directamente escribir el texto adentro de la
caja de Liquid personalizado— y es lo peor para este texto en particular. La leyenda se
renderiza en **tres lugares**: el bloque `disclaimer` de la PDP, el bloque `cierre` de la
landing y la barra legal del footer. Editable por instancia, nada impide que queden tres
redacciones distintas de una leyenda que exige la Disp. ANMAT 4980/05, y el día que haya que
cambiar una palabra hay que acordarse de los tres lugares. Un campo global las alimenta a las
tres y el cambio es atómico.

**Por qué el locale sigue estando debajo, y no se borró.** Es una red de contención: si alguien
vacía el campo en el admin, vuelve el texto por defecto en vez de desaparecer la leyenda. Una
leyenda obligatoria no puede quedar sujeta a un borrado accidental en un panel. El costo es
tener el texto en dos archivos; la alternativa era que un campo vacío publicara un producto sin
su advertencia legal, que no es un costo, es un riesgo.

**No cambia la regla 1 de `CLAIMS-AUDIT.md`.** No se escribió ningún claim en el `.liquid`: el
snippet resuelve variables, el texto sigue viviendo en `config/settings_data.json` o en
`locales/es.json`, los dos greppables. Lo que sí cambió es que la lista de lugares auditables
pasa de tres a cuatro, y el §7 quedó actualizado con el grep que faltaba.

**De paso, el §7 tenía un comando roto.** El one-liner que volcaba `cauce.*` hacía
`json.load` directo sobre `locales/es.json`, y desde D-043 ese archivo empieza con el banner
`auto-generated` de Shopify. Ahora lo saca con un `re.sub` antes de parsear. Los dos comandos
de la sección se corrieron después de editarlos: una receta de auditoría que no se ejecuta no
sirve de nada.

**Qué queda igual.** El número de RNPA sigue saliendo de `settings.cauce_rnpa` y su
placeholder visible sigue apareciendo mientras esté vacío. Y la versión compacta —la del pie—
sigue mostrando sólo la primera frase, sin la de consulta médica.

**Actualizada por D-046 (2026-08-31).** Los lugares donde se renderiza la leyenda pasan de
tres a **cinco**: se suman el bloque `legal_note` del carrito lateral y el mismo bloque en
`/cart`. El argumento de esta decisión se refuerza —cinco instancias editables por separado
serían cinco redacciones posibles de una leyenda obligatoria— y no cambia nada más: siguen
saliendo del mismo campo global. La lista completa está en el §7 de `CLAIMS-AUDIT.md`.

---

## D-045 · 2026-08-30 · El pie se cierra: una sola banda oscura, y los datos salen de los settings

**Contexto.** La barra legal estaba hecha desde la fase 5 (D-004) pero el pie que va arriba
seguía siendo el de Shrine tal cual salió de la caja: esquema `background-2`, columna de
marca vacía, contacto escrito a mano dentro del JSON y la tira de medios de pago nativa.
Ninguna sección `cauce-*` del cuerpo quedó así; el pie era la última pieza sin pasar por el
sistema.

**Lo que se veía.** En la home el orden de bandas era manifiesto (`inverse`, CAUCE) → pie
(`background-2`, SEDIMENTO) → barra legal (CAUCE). Oscuro, claro, oscuro: dos pies distintos
apilados. En la landing el problema era el opuesto —el newsletter también es `background-2`,
así que el pie se fundía con la sección de arriba y no existía como pieza.

### Las seis decisiones

**1. El pie pasa a `inverse`.** `inverse` resuelve a `colors_text`, que es CAUCE, o sea
exactamente el fondo que ya tenía la barra legal. Las dos piezas comparten fondo y se leen
como un solo bloque de cierre, separadas por un filete claro. Se agrega el token
`--cauce-linea-clara`, que es la regla fina del bloque 2 vista del otro lado, y se usa en las
tres juntas del cierre.

Los `custom_colors_*` de `footer-group.json` quedan como estaban: son los defaults del schema
de Shrine, sólo se aplican con `color_scheme: custom` y hoy son inertes. Borrarlos sería un
diff que el theme editor vuelve a escribir en el próximo guardado.

**2. La columna de marca dibuja el lockup, no una imagen.** `brand_information` depende de
`settings.brand_image`, que está vacío, y de `brand_headline` / `brand_description`, también
vacíos: la columna renderizaba un `<div>` con nada adentro. Ahora, sin imagen cargada, cae en
`{% render 'cauce-logo' %}` —el mismo lockup del header— en vez de quedar muda. Es coherente
con la regla de marca: el wordmark es texto en Archivo Expanded, no un archivo que alguien
tiene que acordarse de subir.

El aire del logo se compensa con un margin negativo. `--cauce-logo-aire` es una zona de
respeto contra otros elementos, no un margen contra el borde de la columna; sin compensar, la
C quedaba 32px adentro y desalineada de las cabeceras de las columnas vecinas.

**3. La columna de contacto lee los settings.** El email y el teléfono estaban escritos a mano
en un `richtext` dentro de `footer-group.json`, mientras `settings.cauce_email` y
`settings.cauce_telefono` estaban vacíos. O sea que el pie publicaba un email y la barra legal
—que publica el mismo dato por obligación de la Ley 24.240 art. 4— imprimía
`{{ PENDIENTE: email }}` **en todas las páginas del sitio**. Dos fuentes para el mismo dato,
y la que faltaba era la legal.

Entra un block `cauce_contacto` que lee los settings globales, con el mismo pendiente visible
que usa la barra legal, y los tres valores se cargan en `settings_data.json`. La duplicación
visual se mantiene a propósito —columna legible arriba, letra chica legal abajo— pero ahora
las dos salen del mismo campo y no pueden divergir.

**Alternativa descartada: sacar email y teléfono de la barra legal** para no repetirlos. Es
justo lo que D-004 evita: la barra legal tiene que ser completa y auditable sola, sin depender
de que arriba haya un block que nadie borró.

**4. Los medios de pago se dibujan con `cauce-medios-pago`.** Esto **actualiza D-028**, que
ponía `payment_enable: false`. El motivo de aquella decisión no era que los medios de pago no
van en el pie, era que el block nativo renderiza con `payment_type_svg_tag` y ese filtro no
conoce Mercado Pago, Cabal ni Naranja X (D-012). Cambiado el renderizador por el snippet que
ya usan la PDP y el cierre, el motivo desaparece y el checkbox vuelve a `true`. El campo
nativo `enabled_payment_types` queda sin efecto y el schema lo dice.

Sobre CAUCE los tres logos propios son ilegibles: el azul #0a0080 de Mercado Pago y el violeta
#50007f de Naranja X sobre un fondo #10262A son casi negro sobre negro. Se les pone placa
blanca, que además es como esas marcas piden usarse. La placa va en el `<li>` y no en la
imagen, así los SVG nativos de Shopify —que ya traen su propia tarjeta clara— quedan a la
misma altura y la tira se lee pareja.

**5. Las redes se dibujan en un solo lugar.** `footer.liquid` tiene **dos** puntos de render de
`social-icons`: uno en el block de marca (`block.settings.show_social`) y otro en la fila de
abajo (`section.settings.show_social`). Los dos estaban en `true`. Como no hay ninguna red
cargada todavía, `has_social_icons` da `false` y no se veía nada; el día que se cargue la
primera red aparecían **dos filas de íconos**. El de sección pasa a `false`: los íconos van bajo
el lockup, que es donde los pone el layout de la columna de marca.

**6. El domicilio entra a la barra legal.** El comentario de `cauce-legal-bar.liquid` lo listaba
desde el principio entre lo que la sección cubre —es parte de la identificación del vendedor
que exige la Ley 24.240 art. 4, igual que la razón social y el CUIT— pero el markup nunca lo
imprimió. Ahora sale, con pendiente visible mientras `settings.cauce_domicilio` esté vacío,
que es el estado de hoy.

**Cabeceras de columna en DM Mono.** “Ayuda” y “Contacto” no son títulos de sección, son
etiquetas: toman el lenguaje del antetítulo (`.cauce-eyebrow`) en vez del Newsreader que la
regla global le da a todo `h2`. Blanco al 70% sobre CAUCE da 8.35:1, holgado para 1.1rem.

**Se edita `footer.liquid`, que es una sección de Shrine.** Con el mismo criterio de D-030: un
`theme pull` puede pisar los tres parches, y por eso los tres llevan comentario adentro que
dice qué hacen y a qué decisión responden. La alternativa —un `cauce-footer.liquid` propio—
era reescribir columnas, grilla, selectores y newsletter que ya funcionan, para no tocar tres
lugares.

**Lo que sigue faltando, y sale como pendiente visible.** El domicilio legal
(`cauce_domicilio`), la URL y la imagen de Data Fiscal, el RNPA, y las redes sociales, que las
carga el comercio desde Configuración del tema.

## D-046 · 2026-08-31 · El carrito se rehace con el diseño de Numen sobre la sección de bloques de Shrine

**Decisión.** El carrito de CAUCE —drawer y `/cart`— se reescribe entero. Se conserva de
Shrine **una sola cosa**: que el carrito sea una sección con bloques reordenables desde el
theme editor, con su configuración en `settings_data.json → current.sections["cart-drawer"]`.
Todo lo demás —layout, línea de producto, reaseguro, barra de envío, empujón, beneficio de
pago, CTA, empty state— sale del carrito de **Numen** (`Haspert-Theme`), portado al sistema
CAUCE: sin un solo color de Numen, sin su prefijo `.nc-`, y con los textos en los locales.

**Alternativa descartada.** Copiar la arquitectura de Numen, donde el drawer es un snippet con
un orden fijo de `{% render %}`. Es más simple de leer y es un downgrade: el comercio pierde
la posibilidad de prender, apagar y reordenar piezas del carrito sin abrir código, que es
justo lo que Shrine hace mejor y lo único que valía la pena conservar de él.

**Cómo queda el drawer.** Nueve bloques, en dos regiones que se reordenan por separado
(cuerpo y pie, que es como Shrine recorre `section.blocks` dos veces):

| # | Bloque | Estado | Qué dibuja |
|---|---|---|---|
| 1 | `trust_line` | **nuevo** | reaseguro de una línea |
| 2 | `progress_bar` | reescrito | barra de envío gratis |
| 3 | `cart_items` | reescrito | la línea compartida con `/cart` |
| 4 | `product_upsells` | reescrito | empujón de envío gratis |
| 5 | `legal_note` | **nuevo** | `cauce-disclaimer` compacto |
| 6 | `subtotals` | reescrito | total, ahorro y nota de impuestos |
| 7 | `payment_benefit` | **nuevo** | cuotas (ver más abajo) |
| 8 | `checkout_btn` | reescrito | CTA etiqueta · separador · monto |
| 9 | `payment_badges` | reescrito | `cauce-medios-pago` (D-045, D-012) |

Los demás tipos de bloque de Shrine (`checkpoints_bar`, `countdown_timer`, `gift`,
`discount_field`, `cart_note`, `tnc_checkbox`, `image`, `icon_with_text`, `text_with_icon`,
`custom_liquid`) **quedan disponibles con su render original**, sin instanciar. Se conservaron
sus ramas del `case` para que agregarlos desde el editor siga funcionando; no toman el sistema
CAUCE y eso está dicho en el comentario del archivo.

---

### 1. Lo que cambió porque el JS de este tema no es el de Dawn

El brief pedía verificar los hooks contra el `cart.js` / `cart-drawer.js` **de este repo**.
Esos archivos no existen: la lógica del carrito está adentro de `assets/main.js`, que está
ofuscado con string-array (mismo problema de D-003). Se desofuscó para poder leerla. Cinco
cosas salieron de ahí, y dos simplifican el trabajo:

**a. Shrine re-renderiza el drawer entero.** `CartDrawerItems.getSectionsToRender()` devuelve
`{id:'CartDrawer', section:'cart-drawer', selector:'.drawer__inner'}`. Dawn y Numen
re-renderizan dos regiones sueltas y por eso el comentario de `cart-transfer-benefit` insiste
en vivir "dentro de la región re-renderizada del footer". Acá **todo** el drawer se recalcula,
así que cualquier bloque en cualquier posición se actualiza solo. En `/cart` sí importa: ahí
el re-render sigue siendo por región y el beneficio de pago tiene que ir adentro de
`#main-cart-footer .js-contents`.

**b. El `<a>` de remove funciona y degrada.** `CartRemoveButton` escucha `click` en el propio
custom element y hace `preventDefault()`; no busca `<a>` ni `<button>` adentro. O sea que el
`<a href="{{ item.url_to_remove }}">` de Numen es compatible: con JS elimina por AJAX, sin JS
elimina por navegación. Shrine usaba un `<button>`, que sin JS no hace nada.

**c. El spinner es otro.** Acá es `.loading-overlay.hidden` + `.loading-overlay__spinner`, que
es lo que togglean `enableLoading` y `disableLoading`. El `.loading__spinner` de Numen no
existe en este tema.

**d. El error de línea del drawer estaba muerto, y es un bug de Shrine.** `updateLiveRegions`
busca `getElementById('CartDrawer-LineItemError` **`k`** `-' + linea)`, con una `k` de más,
mientras el markup escribía `CartDrawer-LineItemError-N`. `getElementById` devolvía `null`, el
guarda lo tragaba en silencio y el mensaje nunca aparecía. En `/cart` no pasa: ahí el id es
`Line-item-error-N` y matchea.

Se arregla anidando los dos ids: el contenedor externo lleva el que el JS busca hoy y el
interno el correcto, y los dos resuelven al mismo `.cart-item__error-text`. Funciona ahora y
va a seguir funcionando el día que Shrine corrija el typo. El wrapper se abre y se cierra
siempre y lo condicional es sólo el atributo, porque un `<div>` abierto adentro de un
`{% if %}` corta el parser de theme-check en ese punto (D-008).

**e. El empty state necesita un `<a>` sí o sí.** Cuando el carrito se vacía, el JS hace
`trapFocus(cartDrawer.querySelector('.drawer__inner-empty'), cartDrawer.querySelector('a'))`
y `trapFocus` llama `.focus()` sin chequear `null`. Sin un `<a>` en el drawer eso tira
`TypeError` y corta el resto del update. Además `querySelector('a')` busca en todo el
`<cart-drawer>`, así que el bloque vacío tiene que ir **primero en el DOM** y su CTA tiene que
ser el primer link. Está anotado en `cauce-carrito-vacio.liquid` y en el markup.

**Consecuencia de (a):** no se portó `assets/numen-cart-add.js` (128 líneas de `DOMParser` y
`replaceWith`). Este tema ya expone el re-render correcto en sus propios custom elements
(`cart-drawer-items.updateCart()` en el drawer, `cart-items.updateCart()` en `/cart`), así que
el AJAX del empujón son ~60 líneas dentro de `assets/cauce.js` en vez de un asset nuevo. Y si
Shrine cambia sus regiones, el empujón se entera solo.

---

### 2. El `countdown_timer` se apaga, y se apaga borrando la instancia

Estaba **prendido**, diciendo *"Cart reserved for [timer]"*. El carrito no reserva stock: es
urgencia falsa. En Argentina es exponible ante Defensa del Consumidor (Ley 24.240 art. 8 y
Res. SC 270/2020) y además contradice el criterio de todo este tema, que publica leyendas
legales por obligación y muestra pendientes en vez de esconderlos. No hay argumento para
conservarlo.

**Se borra la instancia en vez de dejarla `disabled`.** Un bloque apagado con copy en inglés
sin auditar es exactamente lo que alguien vuelve a prender un martes. El tipo de bloque sigue
en el schema, así que re-agregarlo son dos clics; lo que no queda es el texto.

Por el mismo criterio salen las otras dos instancias de la demo: `checkpoints_bar` (metas
*Free Shipping / 20% OFF / Free Gift* con montos en dólares — son tres promesas escalonadas y
CAUCE tiene un solo umbral, ningún descuento y ningún regalo configurado) y `discount_field`
(apagado, con copy en inglés).

---

### 3. Con un solo SKU no hay cross-sell: hay escalón de envío

**Consultado y resuelto.** Un cross-sell con un solo producto en catálogo sólo puede ofrecer
el producto que la persona ya tiene en el carrito, a dos centímetros del botón "+" del
stepper. Las otras dos opciones tampoco existen hoy: el segundo frasco al precio del escalón
choca con R6 de `CLAIMS-AUDIT.md` mientras no haya un descuento automático que lo respalde, y
la suscripción necesita un `selling_plan_group` que el producto no tiene
(`cauce_suscripcion_activa` está apagado).

Lo que sí existe y es verdad es el **escalón de envío**. El bloque `product_upsells` pasa a ser
un empujón que aparece **sólo cuando sumar una unidad más alcanza para cruzar el umbral de
envío gratis**, y desaparece solo cuando no aplica. Tres reglas lo mantienen honesto:

- Si falta más que una unidad no se muestra: la barra de progreso ya dice cuánto falta, y
  repetirlo en una card sería presión sin información nueva.
- El monto es el **precio de lista** de esa unidad, porque es exactamente lo que se le va a
  sumar a `cart.items_subtotal_price`, que es la base de la barra. Con el precio con descuento
  de línea, el número de la card y el de la barra no cerrarían.
- Entre varias líneas candidatas gana la más barata: la que menos le cuesta al cliente, no la
  que más factura.

**Lo que se toma de Numen es el comportamiento** (agregar por AJAX sin salir del carrito) y
**no** el criterio de match (familia olfativa) ni el gancho (la variante decant más barata).
El handle de la demo de Shrine (`thedogface-designer-dog-jacket`) se borra junto con los otros
16 settings de carrito huérfanos.

---

### 4. No hay beneficio por transferencia, y no se inventan settings

**Consultado y resuelto:** CAUCE no tiene definido un beneficio por pago con transferencia. El
bloque `payment_benefit` se implementa igual y queda **sólo con cuotas**, que salen de
`settings.cauce_cuotas` y de `cauce.pdp.cuotas` — el mismo par que ya usa `cauce-medios-pago`,
para que la PDP, el pie y el carrito no puedan decir números distintos.

**No se crearon settings de transferencia "por las dudas".** Un campo vacío en el admin es una
invitación a llenarlo con un número que nadie acordó. El comentario de cabecera de
`cauce-carrito-pago.liquid` dice exactamente dónde y cómo se enchufa el día que exista: dos
settings, el ahorro calculado sobre `cart.items_subtotal_price`, y las cuatro reglas de Numen
que se respetan (mostrar el ahorro y no un segundo precio, nunca tachar un precio, no
autoaplicar y comunicar que baja en el checkout, y una sola card para las dos cosas).

**Hoy el bloque no dibuja nada**, porque `cauce_cuotas` vale 0. Ver el punto 6.

> **Superado el 2026-09-13 por D-052:** el beneficio existe (10 %, código `TRANSFERENCIA10`) y se
> enchufó en el lugar que este punto había dejado previsto.

---

### 5. `cauce_umbral_envio_gratis` pasa de `text` a `number`

El brief pedía elegir entre resolverlo con `| plus: 0` o migrar el setting, y decir cuál.
**Se migra el setting.**

Primero, porque salió gratis: se verificó que el campo **no tiene valor guardado** en
`settings_data.json` y que **no lo consume ningún archivo** del tema — estaba definido desde la
fase 5 y nunca se usó. No hay nada que migrar hoy y hay más que migrar cada día que pase.

Segundo, y es el motivo de fondo: con `text` alguien escribe `45.000` o `$45000`, `| plus: 0`
lo convierte en `45` en silencio y la barra le dice al cliente **"te faltan $44.955"**. Un
número equivocado en pantalla es la clase de falla que este repo evita mostrando pendientes en
vez de escondiéndolos; `| plus: 0` no la previene, la disimula. Con `number` el editor no deja
escribirlo.

---

### 6. Un dato comercial que falta no se publica como pendiente visible

Acá hay un choque de reglas que había que resolver. La regla 3 del proyecto dice que todo dato
faltante se muestra como **pendiente visible** (D-004). `METAFIELDS.md` dice lo contrario para
los metafields: si falta uno, la pieza **no renderiza**.

Las dos son correctas y no hablan de lo mismo. **D-004 es sobre datos que la ley obliga a
publicar** —CUIT, domicilio, email, RNPA—: ahí esconder el hueco es esconder un
incumplimiento, y por eso grita. Un umbral de envío gratis o un número de cuotas no son eso:
son datos comerciales, y publicar `[[PENDIENTE: umbral]]` en el carrito de un cliente sería
peor que no decir nada.

**Se resuelve con la tercera vía que el repo ya usa:** nada para el cliente, y un aviso que se
renderiza sólo con `request.design_mode`, o sea sólo para quien puede cargarlo. Es el mismo
patrón del aviso de `ss-glow-testimonial` (D-030). Hoy lo usan tres bloques:

| Bloque | Espera | Mientras tanto |
|---|---|---|
| `progress_bar` | `cauce_umbral_envio_gratis` | nada en la tienda, aviso en el editor |
| `product_upsells` | el mismo umbral | ídem |
| `payment_benefit` | `cauce_cuotas > 0` | ídem |

Los tres están implementados y prendidos. El día que se carguen los dos campos aparecen solos,
sin tocar código.

---

### 7. `/cart` es el mismo archivo, no un segundo diseño

`main-cart-items` y `main-cart-footer` renderizan **los mismos snippets** que el drawer, con
`.cauce-carrito` de contenedor y un modificador `--pagina` para el layout. Sale la tabla de
Shrine: el `<tr role="row">` no aportaba nada —el carrito no es una tabla de datos, es una
lista de items editables, y `role="row"` fuera de una tabla ni siquiera es ARIA válida— y era
lo único que impedía compartir la línea.

La nota "instrucciones especiales" queda **sólo en `/cart`**. En el drawer comía altura y
empujaba el primer ítem abajo del fold; es la decisión de Numen y se replica. El bloque
`cart_note` del drawer queda disponible, sin instanciar.

**Las dos secciones de la demo salen de `templates/cart.json`:**

- `featured-collection` *"You may also like"* sobre la colección `all`. Con un solo SKU
  recomienda el producto que la persona ya tiene en el carrito. No es un problema de copy: es
  una grilla sin nada que grillar, que es el mismo razonamiento de D-038 para la home.
- `newsletter` nativo. No pide consentimiento y viola la Ley 25.326 (D-024). **No se reemplaza
  por `cauce-newsletter`**: el trabajo de `/cart` es cerrar la compra, y un alta de correo
  entre el total y el botón compite con el checkout. El newsletter ya vive en la landing y en
  el pie, que es donde tiene sentido.

---

### 8. El CSS, los tokens y el contraste

Todo el CSS del carrito es el **bloque 17 de `assets/cauce-brand.css`** (regla 4: nada de un
`component-*.css` nuevo). Una sola hoja para las dos superficies. Ningún hex: los colores salen
de los tokens contextuales del bloque 0 y de `rgba(var(--color-foreground), a)` para las reglas
finas, que se adapta sola al esquema en vez de pedir una regla por esquema.

**Entran cuatro colores a la paleta y dos tokens contextuales al bloque 0**, cada uno con su
segundo valor para banda oscura, igual que el acento:

| Token | Sobre BLANCO | Sobre SEDIMENTO | Sobre SEDIMENTO-2 | Sobre CAUCE |
|---|---|---|---|---|
| `--cauce-verde` (éxito) | 7.47 AAA | 5.98 AA | 5.39 AA | — |
| `--cauce-verde-claro` | — | — | — | 6.24 AA |
| `--cauce-carmin` (error) | 8.52 AAA | 6.83 AA | 6.15 AA | — |
| `--cauce-carmin-claro` | — | — | — | 6.26 AA |

**El error es carmín (matiz 350) y no un rojo anaranjado.** ÓXIDO está en matiz 10 y es el
color del botón de compra: dos rojos casi iguales que significan cosas distintas —comprá y
algo salió mal— es peor que no tener un color de error.

**El CTA sube a 2.4rem cuando el esquema es `inverse`.** Ahí el acento vale ÓXIDO CLARO con
etiqueta CAUCE, que da 4.27:1 — AA para texto grande y no para texto chico (el límite que
D-031 dejó anotado). En vez de prohibir el esquema, la regla sube el cuerpo justo en ese
esquema hasta el umbral de texto grande. Se aplica sola, como la prohibición de VADO sobre
SEDIMENTO del bloque 0. En el esquema por defecto (`background-1`) el CTA da 6.04:1 a
cualquier tamaño.

**El relleno de la barra de envío va en VADO, no en el acento**, y las tildes tampoco son
óxido: el único óxido de la pieza es el botón de pago. Es la misma resolución de D-036.

**El texto muteado va en `opacity: 0.78`** y no en un color propio: 7.70 sobre blanco, 6.77
sobre sedimento y 10.02 sobre CAUCE. Es el recurso del bloque 8, con un punto más de opacidad.

---

### 9. Un hallazgo colateral: `.cauce-page` no existe en el markup

El brief daba por hecho que el foco visible ya estaba resuelto porque
`.cauce-page :focus-visible` existe en el bloque 3. La regla existe; **la clase no la pone
ningún archivo del tema.** `grep -rn "cauce-page"` sólo la encuentra en la documentación. O sea
que esa regla —y la del bloque 1 que impide que un `h1/h2/h3` quede en óxido— nunca aplicaron.

El carrito declara su propio `.cauce-carrito :focus-visible` y queda cubierto. **El arreglo
general queda pendiente** y es de una línea (agregar `cauce-page` al `<body>` en
`theme.liquid`), pero toca todas las páginas del sitio y hay que mirar qué títulos cambian de
color cuando la regla del bloque 1 empiece a aplicarse de verdad. No se hizo acá porque no es
del carrito.

---

**Verificación.** `theme check`: 59 warnings antes y 59 después, ninguno nuevo en los archivos
tocados. Dos snippets quedaron huérfanos por el cambio y se borraron
(`cart-progress-bar.liquid`, que reemplaza `cauce-carrito-envio`, e `icon-remove.liquid`, que
reemplaza el ícono `tacho` del set CAUCE); dejarlos habría subido el número a 61. Contraste
medido con la misma calculadora que reprodujo exactamente los valores documentados en D-031 y
D-045 antes de usarla para los colores nuevos.

**Pendiente de vos.**
1. Cargar `cauce_umbral_envio_gratis` y `cauce_cuotas` en Configuración del tema → CAUCE.
   Hasta que estén, tres bloques del carrito no dibujan nada en la tienda (punto 6).
2. Decidir si existe un beneficio por transferencia (punto 4).
3. El arreglo de `.cauce-page` (punto 9).

---

## D-047 · 2026-09-09 · Los escalones dejan de ser display neutro: precios reales y el 2 como estrella

**Decisión.** El bloque `ofertas` de `product.cauce-landing.json` pasa de descuento 0 (D-017) a
los tres precios comerciales, cargados como `fixed_amount_off` sobre el precio de la variante:

| Escalón | Cant. | `fixed_amount_off` | Total | Por frasco | Tachado |
|---|---|---|---|---|---|
| 1 | 1 | `0` | $49.900 | $49.900 | — (queda oculto: compare = price) |
| 2 | 2 | `39900` | **$59.900** | **$29.950** | $99.800 |
| 3 | 3 | ~~`67800`~~ | ~~$81.900~~ | ~~$27.300~~ | $149.700 |

> El escalón 3 cambió el 2026-09-10: `71800` / **$77.900** / $25.966,67 por frasco, y los
> escalones 2 y 3 volvieron a cambiar el 2026-09-12: `37900` / **$61.900** / $30.950 y `76800` /
> **$72.900** / $24.300. La fila de arriba queda como registro de lo que se decidió acá. Los
> valores vivos están en **D-050**.

Se usa **monto fijo y no porcentaje** porque los porcentajes reales son 39,98 % y 45,29 %:
redondear a 40 % y 45 % sobredeclara el descuento, y eso es art. 8 de la Ley 24.240. El monto
en pesos es exacto y además es el número grande en ARS.

**Cómo se señala el escalón 2 sin inventar datos.** El §4 de CLAIMS-AUDIT descartó el badge
*"el más elegido"* por ser un dato de comportamiento que no tenemos. Sigue descartado. El 2
gana por tres vías que son todas verificables contra la tabla de precios:

1. **`preselected: option_2`** más el indicador de seleccionado (ya venía así).
2. **El badge dice la aritmética marginal:** `EL 2º FRASCO POR $10.000`. Es literal —
   $59.900 − $49.900 = $10.000— y es la frase más fuerte que permite esta grilla.
3. **La caption es la misma columna en las tres filas:** `[price_each] por frasco`. El salto
   real vive ahí: −$19.950 del 1 al 2, y sólo −$2.650 del 2 al 3. La asimetría *es* el
   argumento, y no hay que afirmarla porque se lee.

**El `[duracion]` se muda de la caption al pill de beneficio.** `snippets/text-with-price.liquid`
es una cadena `if/elsif`: **resuelve un solo token por campo**. La caption no podía tener a la
vez la duración y el precio por unidad, y el precio por unidad es lo que hace comparable la
grilla. El pill mantiene el guarda de D-003 (si faltan los metafields de dosis, `[duracion]`
queda en blanco y el pill no renderiza) porque el token sigue solo en su campo.

**Los pills bajan de `accent-2` a `text`.** Con los badges nuevos en VADO, dejar también los
pills en VADO ponía dos acentos por fila. Jerarquía: cinta VADO > pill TINTA contorneado >
ÓXIDO sólo en el botón (regla de D-016/D-031, intacta).

**Bloque nuevo `nota_precios`.** `.quantity-break__compare-price` lleva `text-decoration:
line-through` sobre todo el elemento, así que aclarar dentro del campo tacharía también la
aclaración. La nota va abajo, una sola vez para los tres escalones: *"El precio tachado es lo
que te costaría llevar esa misma cantidad de a un frasco."* Sin eso, $99.800 tachado se lee
como precio anterior, y nunca lo fue — es el mismo problema que R1 le marca al badge de
*"COMPRA 1 LLEVA 1 GRATIS"* de las imágenes de Noverly.

**Lo que queda hardcodeado, a propósito.** El `$10.000` del badge del escalón 2 es el único
precio escrito a mano del bloque; todo lo demás lo calcula el tema. No hay token para el costo
marginal de la unidad siguiente. **Si cambia cualquiera de los dos primeros precios, ese badge
miente hasta que alguien lo edite.** Vive en `templates/`, así que lo levanta el grep del §7 de
CLAIMS-AUDIT.

**Advertencia de D-017 y R6, sin cambios y ahora urgente.** Los escalones siguen siendo
**display**. Con esto cargado, la PDP promete $59.900 y $81.900 y el carrito cobra $99.800 y
$149.700 hasta que existan los **descuentos automáticos de Shopify** por cantidad con los
mismos montos. Antes de este cambio la discrepancia era de $0 y no había nada que romper; ahora
es de $39.900 y $67.800. Es art. 7 y 8 de la Ley 24.240, no UX.

**El envío gratis del escalón 3 tiene el mismo problema.** El badge lo promete y hoy
`cauce_umbral_envio_gratis` está vacío y no hay tarifa de envío gratis configurada. O existe la
tarifa real por encima de $81.900 — con el umbral cargado, que además enciende la barra de
progreso del carrito (D-046) —, o el badge sale.

**Tensión comercial que dejo anotada.** El envío gratis exclusivo del escalón 3 empuja en
contra del escalón 2, que es el que se quiso destacar, y es la palanca más fuerte de la grilla.
Es una decisión del negocio, no del tema: se pidió así y así quedó. Si el 3 termina
canibalizando al 2 no es un bug del bloque.

---

## D-047b · 2026-09-09 · La cinta del escalón 2 pasa a "El más elegido", y eso reabre lo que el §4 había cerrado

**Qué cambió.** A pedido, para previsualizar:

| Slot | Antes (D-047) | Ahora |
|---|---|---|
| `option_2_badge` | `EL 2º FRASCO POR $10.000` | `EL MÁS ELEGIDO` |
| `option_2_benefit` | `[duracion]` | `El 2º sale $10.000` |

**Por qué el costo marginal baja al pill y no se borra.** El slot de cinta es uno solo, y la
aritmética del segundo frasco es el argumento más fuerte y verificable de la grilla. El pill se
apila debajo del label (`.quantity-break__label` es `flex-direction: column`) y lleva
`white-space: nowrap`, así que tiene renglón propio y entra completo en mobile. El escalón 2
queda como el único con dos slots ocupados, lo que lo destaca más que antes.

**Lo que se pierde.** El `[duracion]` del escalón 2. Los escalones 1 y 3 lo conservan, así que la
columna de pills queda dispareja; el 2 se lee como la fila distinta, que es el efecto buscado. Si
los metafields de dosis siguen vacíos, los pills de 1 y 3 no renderizan y el del 2 sí, y el
contraste es todavía mayor.

**Lo que hay que mirar.** El §4 de CLAIMS-AUDIT había descartado este badge por ser un dato de
comportamiento que no tenemos, y es la misma razón por la que las reseñas están apagadas (D-019) y
por la que no se emite `AggregateRating` (D-006). Con la cinta puesta, la página afirma algo sobre
la conducta de otros compradores por primera vez. Si hay pedidos que lo respalden, se sostiene y
esta decisión pasa a firme; si no, es Res. SC 270/2020. **Queda como bloqueante en el §6**, no
como decisión cerrada, porque se pidió para ver cómo quedaba y no como resolución del punto.

**Cómo se revierte.** Dos campos del bloque `ofertas` en `templates/product.cauce-landing.json`:
`option_2_badge` vuelve a `EL 2º FRASCO POR $10.000` y `option_2_benefit` a `[duracion]`.

---

## D-047c · 2026-09-09 · La cinta "Envío gratis" del escalón 3 era exclusividad falsa

**Qué pasó.** Al traer `origin/main` antes de pushear aparecieron siete commits del theme
editor. Dos settings nuevos: `cauce_umbral_envio_gratis: 50000` y `cauce_cuotas: 3`. El
umbral no existía cuando se escribió D-047, y lo invalida.

**La cuenta.** `snippets/cauce-carrito-nudge.liquid` y `cauce-carrito-envio.liquid` leen el
umbral como `settings.cauce_umbral_envio_gratis | times: 100`, o sea **$50.000** contra
`cart.items_subtotal_price`:

| Escalón | Total | ¿Cruza los $50.000? |
|---|---|---|
| 1 frasco | $49.900 | **No**, por $100 |
| 2 frascos | $59.900 | Sí |
| 3 frascos | $81.900 | Sí |

El escalón 2 también tiene envío gratis. Anunciarlo como cinta sólo en el 3 le atribuía al
escalón 3 un beneficio exclusivo que no lo es — publicidad engañosa por omisión, y encima en
contra del escalón que se quiso destacar.

**Decisión.** La cinta sale del escalón 3 y la regla se dice una sola vez, completa, en la
nota al pie del bloque: *"Envío gratis en pedidos desde $50.000."* Con eso el escalón 2 queda
como **la única fila con cinta**, que es exactamente lo que se pidió, y el lector ve solo que
$49.900 no llega al umbral por $100.

**Efecto lateral que conviene mirar.** El escalón 1 se queda a $100 del envío gratis. Es la
distancia más corta posible y empuja fuerte del 1 al 2 sin que la página tenga que afirmar
nada. No lo diseñé así —el umbral lo cargó el comercio— pero es la razón por la que la nota
va en el bloque de oferta y no sólo en el carrito.

**Sigue abierto.** El setting del tema sólo dibuja. La tarifa real de envío sin cargo desde
$50.000 tiene que existir en Configuración → Envíos, o cuatro superficies prometen algo que
el checkout no cumple. Está en el §6 de CLAIMS-AUDIT.

> **Superado el 2026-09-10.** El comercio subió el umbral a **$80.000** y bajó el escalón 3 a
> $77.900. Con esos dos números ya no hay ningún escalón que cruce, así que la tabla de acá
> arriba no describe la tienda de hoy. Ver **D-049**.

---

## D-048 · 2026-09-10 · El CTA de pago dice "Pago seguro", y el botón del checkout no se toca desde acá

**Decisión.** `sections.cart.checkout` pasa de "Pagar pedido" a **"Pago seguro"**, y los dos
botones que la usan con diseño CAUCE —`snippets/cart-drawer.liquid` y
`sections/main-cart-footer.liquid`— la envuelven entre dos iconos del set: `candado` antes y
`flecha` después. La flecha es nueva en `snippets/cauce-iconos.liquid`.

**Dónde queda la flecha.** Al final del botón, **después** del monto, no pegada al texto. El
pedido literal era "candado · Pago seguro · flecha", y así se ve exacto en el drawer cuando
`mostrar_monto` está apagado. Con el monto prendido la flecha igual cierra el botón, porque la
flecha significa *avanzar con esto*, y lo que avanza es el botón entero, no la palabra. Pegada
al texto queda `Pago seguro → | $59.900`, con la punta entrando en el separador.

**Los iconos se salen del set en dos cosas, a propósito** (regla en `cauce-brand.css`, bloque
"CTA de pago"): el tamaño va en `em` y no en `rem`, para que los glifos sigan solos el salto de
1.8 a 2.4rem que el CTA hace sobre esquema oscuro; y el color se fuerza a `currentColor` en vez
de `var(--cauce-icono)`, que está calibrado contra SEDIMENTO y acá el fondo es OXIDO. El trazo
sube de 1.4 a 2: a 20px sobre fondo lleno el trazo del set se lava.

**Lo que NO se pudo hacer desde el repo.** El botón de pagar del checkout. Se cambió
`shopify.checkout.general.pay_now_button_label` a "🔒 Pago seguro" para que el archivo no
contradiga la intención, **pero esa clave es inerte**: Shopify guarda las traducciones de
checkout y de los mails fuera de los locale files del tema, en el editor de idiomas. El lugar
real es **Configuración → Idiomas → Pago y sistema** (o Translate & Adapt). Y ahí el candado
sólo puede ser el emoji 🔒, porque es un string plano: no entra SVG, y el glifo lo dibuja cada
sistema operativo distinto.

**Esto corrige D-007.** Ese D dice que a `es` "le faltaban 8 claves, todas bajo
`shopify.checkout.*`" y que "se completaron a mano", dando a entender que gobiernan el
checkout. No lo hacen. Las 8 claves pueden quedarse —no molestan— pero no son el lugar donde
se edita el checkout.

**Sigue abierto.** Confirmar en el admin que el botón del checkout diga lo mismo que el
carrito. Mientras no se toque, el carrito promete "Pago seguro" y el checkout sigue diciendo
"Pagar ahora": no es una promesa falsa, pero es un corte de tono en el paso más delicado.

---

## D-049 · 2026-09-10 · El escalón 3 baja a $77.900, y con eso ningún escalón llega al envío gratis

**Decisión.** `option_3_fixed_amount_off` pasa de `67800` a `71800`. Es un solo campo del bloque
`ofertas` de `templates/product.cauce-landing.json`; el resto de la grilla lo recalcula el tema.

| Escalón | Cant. | `fixed_amount_off` | Total | Por frasco | Tachado | Ahorro | % real |
|---|---|---|---|---|---|---|---|
| 1 | 1 | `0` | $49.900 | $49.900 | — | — | — |
| 2 | 2 | `39900` | **$59.900** | **$29.950** | $99.800 | $39.900 | 39,98 % |
| 3 | 3 | `71800` | $77.900 | $25.966,67 | $149.700 | $71.800 | 47,96 % |

Se mantiene el monto fijo y no el porcentaje por lo mismo que en D-047: 47,96 % redondeado a
"48 % OFF" sobredeclara, y eso es art. 8 de la Ley 24.240.

**El precio por frasco del escalón 3 deja de ser redondo.** $77.900 no es divisible por 3.
`quantity-breaks.liquid` hace `option_3_price_each = option_3_price | divided_by: 3`, y como
`option_3_price` es float —sale de `times: percentage_left`, que vale `1.00`— la división no
trunca: da 2.596.666,67 centavos, y `money_without_trailing_zeros` no tiene ceros que sacar. La
caption queda **"$25.966,67 por frasco"** al lado de los `$49.900` y `$29.950` limpios de las
otras dos filas. Es exacto y no miente, sólo rompe la prolijidad de la columna. Si molesta, el
precio más cercano que divide justo es **$77.700**, que da $25.900 por frasco.

**El escalón 2 sigue siendo la estrella, pero por menos margen.** El argumento de D-047 era el
acantilado del precio unitario, y se achicó:

| | 3 a $81.900 | 3 a $77.900 |
|---|---|---|
| Salto por frasco del 1 al 2 | −$19.950 | −$19.950 |
| Salto por frasco del 2 al 3 | −$2.650 | −$3.983 |
| Porción del acantilado que captura el 2 | 88,3 % | 83,4 % |
| Costo del 2º frasco | $10.000 | $10.000 |
| Costo del 3º frasco | $22.000 | **$18.000** |

El 2 conserva lo único que el 3 no puede replicar —el segundo frasco a la quinta parte del
precio de lista, que es lo que dice el pill— y sigue preseleccionado. Pero el tercero se abarató
$4.000 y el 3 quedó más competitivo. Es la misma tensión comercial anotada al final de D-047, un
escalón más apretada. Decisión del negocio, no del tema.

**Lo que este cambio rompe: el envío gratis.** `cauce_umbral_envio_gratis` está en **$80.000**
desde el 2026-09-10 (lo subió el comercio desde el editor, de $50.000 a $80.000, y de paso
completó los `[[PENDIENTE:]]` de la barra de anuncio y del acordeón de envíos con ese número).
Contra ese umbral:

| Escalón | Total | ¿Cruza los $80.000? |
|---|---|---|
| 1 frasco | $49.900 | No, por $30.100 |
| 2 frascos | $59.900 | No, por $20.100 |
| 3 frascos | $77.900 | **No, por $2.100** |

Con el 3 a $81.900 el escalón grande cruzaba por $1.900 y la nota al pie del bloque cerraba la
grilla con un beneficio alcanzable. A $77.900 **ninguna de las tres ofertas llega**, y el
catálogo tiene un solo producto, así que el cliente no tiene con qué completar los $2.100 que le
faltan salvo comprando un cuarto frasco. La nota sigue siendo cierta como regla —no es publicidad
engañosa— pero pasó de ser un cierre a ser una puerta cerrada, y la barra de anuncio la repite
arriba de todas las páginas.

**Y hay un efecto cruzado con los descuentos automáticos.** Hoy, sin los descuentos cargados, el
carrito de 3 frascos suma $149.700 reales y **sí** cruza los $80.000: la barra de progreso del
carrito (D-046) dice "tenés el envío gratis". El día que se carguen los descuentos automáticos
—que es obligatorio, R6 del §6— el subtotal real baja a $77.900 y el envío gratis se apaga solo.
O sea que arreglar la discrepancia de precios, que es lo urgente, va a romper el envío gratis de
paso. Las dos cosas hay que resolverlas juntas.

**Resuelto el mismo día en D-049b:** el umbral baja a $75.000. **Superado el 2026-09-12 por
D-050:** los escalones 2 y 3 pasan a $61.900 y $72.900, y el umbral a $60.000.

**Lo que no se tocó.** La cinta `EL MÁS ELEGIDO` y el pill `El 2º sale $10.000` del escalón 2
siguen igual: ninguno de los dos depende del precio del escalón 3. El `$10.000` sigue siendo el
único precio hardcodeado del bloque.

---

## D-049b · 2026-09-10 · El umbral de envío gratis baja a $75.000 y el pack de 3 vuelve a cruzarlo

**Decisión.** `cauce_umbral_envio_gratis` pasa de `80000` a **`75000`**, y con él los tres textos
que lo escriben a mano:

| Superficie | Archivo | Antes | Ahora |
|---|---|---|---|
| Barra de anuncio | `sections/header-group.json` | `Envío gratis en compras desde $80000` | `…desde $75.000` |
| Nota del bloque de oferta | `templates/product.cauce-landing.json` | `Envío gratis en pedidos desde $80.000.` | `…desde $75.000.` |
| Acordeón de envíos | `templates/product.cauce-landing.json` | `Envío sin cargo en compras desde $80000.` | `…desde $75.000.` |
| Barra de progreso y empujón del carrito | `config/settings_data.json` | `80000` | `75000` |

De paso se corrige la tipografía: dos de esos textos decían **$80000** sin separador de miles,
contra el `$80.000` de la nota. Los cuatro dicen ahora el mismo número con el mismo formato.

**Por qué $75.000 y no $77.900 exacto.** $77.900 dejaba el pack de 3 justo en el borde, sin un
peso de margen: cualquier baja futura de precio, o un cupón que reduzca el subtotal, lo tiraba
abajo del umbral sin que nadie se enterara. $75.000 es redondo, deja **$2.900 de aire** y se lee
mejor en la barra de anuncio.

**Quién cruza ahora:**

| Escalón | Total | ¿Cruza los $75.000? |
|---|---|---|
| 1 frasco | $49.900 | No, por $25.100 |
| 2 frascos | $59.900 | No, por $15.100 |
| 3 frascos | $77.900 | **Sí, por $2.900** |

**Esto cancela el efecto cruzado que preocupaba en D-049.** Con el umbral en $80.000 el carrito
de 3 frascos cruzaba hoy —$149.700 sin descuentos— y dejaba de cruzar el día que se cargaran los
descuentos automáticos, con lo cual arreglar R6 apagaba el envío gratis de rebote. Con el umbral
en $75.000 el pack de 3 cruza en los dos estados, $149.700 y $77.900. El beneficio ya no depende
de cuándo se carguen los descuentos.

**El escalón 3 vuelve a ser el único con envío gratis, y la cinta no se puso.** D-047c sacó la
cinta `ENVÍO GRATIS` del escalón 3 porque con el umbral en $50.000 el escalón 2 también cruzaba y
anunciarlo sólo en el 3 era exclusividad falsa. Ese motivo ya no existe: a $75.000 el 3 es el
único que llega. La cinta sería verdadera si volviera. **No la puse igual**, porque el slot está
libre pero el argumento de D-047 no cambió: el envío gratis exclusivo del 3 es la palanca más
fuerte de la grilla y empuja en contra del 2, que es el escalón que se quiso destacar y el único
que hoy tiene cinta. Reponerla es una decisión comercial, no técnica; si se pide, es un campo
(`option_3_badge`).

**Sigue abierto.** El setting del tema **sólo dibuja**. La tarifa real de envío sin cargo desde
$75.000 tiene que existir en Configuración → Envíos, o las cuatro superficies prometen algo que
el checkout no cumple (Ley 24.240 art. 7 y 8). Está en el §6 de CLAIMS-AUDIT.

> **Superado el 2026-09-12 por D-050:** el umbral baja a $60.000. Las cuatro superficies y el
> pendiente de la tarifa real siguen siendo los mismos, con ese número.

---

## D-050 · 2026-09-12 · Precios nuevos en los escalones 2 y 3, y el umbral de envío gratis baja a $60.000

**Decisión.** Los precios comerciales de la grilla los fija el comercio; acá se registran los que
entraron el 2026-09-12 y todo lo que arrastran. El escalón 1 no se toca.

| Escalón | Cant. | `fixed_amount_off` | Total | Por frasco | Tachado | Ahorro | % real |
|---|---|---|---|---|---|---|---|
| 1 | 1 | `0` | $49.900 | $49.900 | — | — | — |
| 2 | 2 | `37900` | **$61.900** | **$30.950** | $99.800 | $37.900 | 37,98 % |
| 3 | 3 | `76800` | **$72.900** | **$24.300** | $149.700 | $76.800 | 51,30 % |

Sigue siendo monto fijo y no porcentaje, por lo mismo de D-047 y D-049: 37,98 % redondeado a
"38 % OFF" sobredeclara, y eso es art. 8 de la Ley 24.240.

**Los campos que cambiaron.** Siete, en tres archivos:

| Qué | Archivo | Antes | Ahora |
|---|---|---|---|
| `option_2_fixed_amount_off` | `templates/product.cauce-landing.json` | `39900` | `37900` |
| `option_3_fixed_amount_off` | idem | `71800` | `76800` |
| `option_2_benefit` (pill) | idem | `El 2º sale $10.000` | `El 2º sale $12.000` |
| Nota del bloque de oferta | idem | `…desde $75.000.` | `…desde $60.000.` |
| Acordeón de envíos | idem | `…desde $75.000.` | `…desde $60.000.` |
| Barra de anuncio | `sections/header-group.json` | `…desde $75.000` | `…desde $60.000` |
| `cauce_umbral_envio_gratis` | `config/settings_data.json` | `75000` | `60000` |

Los totales y los precios por frasco de la grilla no están escritos en ningún lado: los calcula
`quantity-breaks.liquid` desde los dos `fixed_amount_off`. El pill del escalón 2 **sí** está
hardcodeado y por eso se reescribió a mano: $61.900 − $49.900 = $12.000.

**El precio por frasco del 3 vuelve a ser redondo.** $72.900 ÷ 3 = $24.300 exacto, así que se
termina el `$25.966,67` que D-049 había dejado en la caption del escalón 3. Las tres filas vuelven
a mostrar montos limpios: $49.900, $30.950, $24.300.

**El tercer frasco pasó a costar menos que el segundo, y eso da vuelta el argumento de D-047.**

| | 2 a $59.900 / 3 a $77.900 | 2 a $61.900 / 3 a $72.900 |
|---|---|---|
| Por frasco 1 / 2 / 3 | $49.900 / $29.950 / $25.966,67 | $49.900 / $30.950 / $24.300 |
| Salto por frasco del 1 al 2 | −$19.950 | −$18.950 |
| Salto por frasco del 2 al 3 | −$3.983 | −$6.650 |
| Porción del acantilado que captura el 2 | 83,4 % | **74,0 %** |
| Costo del 2º frasco | $10.000 | $12.000 |
| Costo del 3º frasco | $18.000 | **$11.000** |

El argumento de D-047 era que el 2 se lleva casi todo el acantilado del precio unitario y que el
pill dice la aritmética marginal más barata de la página. Las dos cosas se debilitaron: el 2
captura 74 % en vez de 83 %, y **el tercer frasco ($11.000) ahora sale más barato que el segundo
($12.000)**. Es la primera vez que la grilla se invierte. Ninguno de los dos números es falso
—son restas exactas— pero el pill `El 2º sale $12.000` deja de ser el mejor argumento de la
página: el mismo pill en el escalón de al lado diría `El 3º sale $11.000`.

No se cambió nada por esto. La cinta `EL MÁS ELEGIDO` y `preselected: option_2` siguen en el 2, y
cuál escalón se empuja es decisión comercial, no del tema. **Si se quiere que el 2 vuelva a ganar
por aritmética y no sólo por cinta, el pack de 3 tiene que valer $73.900 o más** —$61.900 +
$12.000—, que son $1.000 arriba del precio de hoy.

**Envío gratis: ahora cruzan dos escalones.**

| Escalón | Total | ¿Cruza los $60.000? |
|---|---|---|
| 1 frasco | $49.900 | No, por $10.100 |
| 2 frascos | $61.900 | **Sí, por $1.900** |
| 3 frascos | $72.900 | **Sí, por $12.900** |

Sigue valiendo lo que cerró D-049b: los dos cruzan en los dos estados —con los descuentos
automáticos cargados ($61.900 y $72.900) y sin ellos ($99.800 y $149.700)—, así que cargar R6 no
apaga el envío gratis de rebote.

**Y vuelve a caerse la cinta `ENVÍO GRATIS` del escalón 3.** D-049b la había dejado disponible
porque con el umbral en $75.000 el 3 era el único que cruzaba. Con dos escalones cruzando,
ponerla sólo en el 3 es otra vez la exclusividad falsa que D-047c descartó. Queda cerrada por el
motivo original.

**El riesgo nuevo: el pack de 2 cruza por $1.900 de aire.** D-049b había elegido $75.000 en vez
de $77.900 justamente para no dejar un escalón al borde del umbral; el precio de hoy vuelve a
dejarlo ahí, un escalón más abajo. Cualquier descuento de más de $1.900 sobre un pedido de dos
frascos lo tira abajo de los $60.000 y apaga el envío gratis sin que nadie lo note. **El caso
concreto ya existe:** el 10 % de bienvenida del newsletter deja el pack de 2 en **$55.710**, que
no llega —el de 3 queda en $65.610 y sí llega—. O sea que el cupón de bienvenida le saca el envío
gratis justo al escalón preseleccionado y con cinta.

Peor: la **barra de progreso del carrito** (D-046) lee `cart.items_subtotal_price`, que no
incluye los descuentos de código a nivel carrito. Con el 10 % aplicado, la barra sigue diciendo
"tenés el envío gratis" mientras el checkout cobra el envío. Las salidas son tres, y las tres son
decisión comercial: bajar el umbral a $55.000, excluir el envío gratis del cupón de bienvenida, o
subir el pack de 2. Queda anotado en el §6 de CLAIMS-AUDIT.

**Lo que no se tocó.** El escalón 1 ($49.900, `fixed_amount_off: 0`), la cinta del 2, la
preselección, y los pendientes de siempre: los descuentos automáticos de Shopify (R6) tienen que
pasar a **−$37.900** y **−$76.800**, y la tarifa real de envío sin cargo tiene que existir desde
**$60.000**. Los dos son bloqueantes del §6 y los dos cambiaron de número con esta decisión.

> **Superado el 2026-09-13 por D-052:** el umbral baja a $55.000, para que un 10 % —el de
> bienvenida o el de transferencia— no le saque el envío gratis al pack de 2.

---

## D-050b · 2026-09-12 · El titular del bloque de oferta deja de hablar de precio y pasa a hablar de duración

**Decisión.** El `headline` del bloque `ofertas` pasa de `Cuantos más frascos, más barato cada
uno` a **`Elegí cuántos meses querés cubrir`**. Es un solo campo de
`templates/product.cauce-landing.json`.

**Por qué.** El titular anterior anunciaba lo que la grilla ya demuestra sola tres veces: el
total, el tachado y el `[price_each] por frasco` de cada fila. Era redundante, y encima ponía el
precio como eje de la decisión justo arriba de un selector cuya variable real es cuánto tiempo
querés estar cubierto. El titular nuevo nombra esa variable y deja el precio donde ya estaba
dicho.

**Lo que esto engancha: el titular ahora depende del token `[duracion]`.** Los tres pills salen
de `[duracion]`, que `snippets/cauce-duracion.liquid` resuelve desde dos metafields —
`cauce.unidades_envase` y `cauce.dosis_diaria`— y que **si falta cualquiera de los dos no
renderiza nada** (el guarda de D-003: antes que inventar un número, no muestra ninguno). Hoy los
dos están vacíos, así que los pills no se dibujan.

Con el titular viejo eso era una carencia. Con el nuevo es una contradicción: el encabezado
pregunta cuántos **meses** querés cubrir y la grilla de abajo sólo muestra frascos y precios, sin
un solo dato de duración con el cual contestar la pregunta. **Cargar los dos metafields deja de
ser cosmético y pasa a sostener el titular.** Está en el §6 de CLAIMS-AUDIT, bajo el pendiente de
los metafields `cauce.*`.

**Y hay un desfasaje de unidad.** El texto de los pills sale de `locales/es.json` >
`cauce.pdp.duracion_dias`, que dice **`{{ dias }} días de uso`**. Con un envase de 60 cápsulas y
2 por día, los tres pills van a decir *30 / 60 / 90 días de uso* mientras el titular habla de
meses. No es falso —30 días es un mes— pero obliga al cliente a hacer la conversión que el
titular le prometió resuelta. Dos salidas, las dos de una línea y ninguna aplicada acá:

1. Agregar una clave `cauce.pdp.duracion_meses` y usarla cuando los días sean múltiplo de 30.
2. Dejar el titular en meses y los pills en días, y aceptar el salto.

**Lo que no se tocó.** El pill del escalón 2 sigue siendo de precio (`El 2º sale $12.000`,
D-050), así que el titular tira para duración y el pill más visible de la grilla tira para
precio. No se contradicen, pero tampoco empujan juntos. Si se quiere alinear, el pill del 2 es
el campo `option_2_benefit` — y es el único de los tres que hoy no usa `[duracion]`.

---

## D-050c · 2026-09-12 · El precio por frasco sube a contraste pleno, y el envío gratis se dibuja solo en la tarjeta que lo cumple

**Dos cambios en el mismo bloque, por el mismo motivo: lo que decide la compra tiene que verse.**

### 1. El precio por frasco deja de estar en gris

`.quantity-break__caption` tenía `opacity: 0.72` sobre el color de texto de la tarjeta. La regla
venía de tratar la caption como una nota al pie —era el slot de `[duracion]`— pero desde D-047 ahí
vive **`[price_each] por frasco`**, que es el único número de la grilla que baja mientras el total
sube: $49.900 → $30.950 → $24.300. Es el argumento de volumen entero, y estaba dibujado como letra
chica.

| | Compone a | Contraste |
|---|---|---|
| `opacity: .72` sobre blanco | `#536366` | 6,28:1 |
| `opacity: .72` sobre SEDIMENTO | `#4D5C5C` | 5,60:1 |
| **CAUCE pleno sobre blanco** | `#10262A` | **15,76:1** |
| **CAUCE pleno sobre SEDIMENTO** | `#10262A` | **12,62:1** |

Pasa a `color: var(--cauce-cauce)` —que es `#10262A`— y se saca la opacidad. Se toca el color y
nada más: **DM Mono se queda**, porque el precio por frasco es un dato duro y el brandboard manda
mono para datos. Se usa el token y no el hex suelto por la regla del propio archivo: ningún color
de marca se decide con un hex en una regla.

### 2. El envío gratis aparece dentro de cada escalón que lo cumple

Hasta acá el envío gratis se prometía en cuatro superficies que hablan del pedido en general
—barra de anuncio, nota al pie del bloque, acordeón de envíos, barra de progreso del carrito— pero
en ninguna tarjeta. El cliente tenía que hacer la cuenta contra el umbral él mismo, con el número
escrito tres renglones más abajo.

Ahora cada tarjeta cuyo total cruza `cauce_umbral_envio_gratis` muestra un chip **"Envío gratis"**
abajo del precio por frasco. Con los precios de D-050:

| Escalón | Total | Chip |
|---|---|---|
| 1 frasco | $49.900 | no |
| 2 frascos | $61.900 | **sí** |
| 3 frascos | $72.900 | **sí** |

**Se calcula, no se carga.** `snippets/cauce-envio-escalon.liquid` recibe el `option_N_price` ya
descontado que calcula `quantity-breaks.liquid` y lo compara contra el umbral. No es un token de
`block.settings` ni un `option_N_badge`: no hay nada que escribir en el editor y **no puede quedar
desfasado del precio**. Esto importa porque es exactamente lo que pasó tres veces en cuatro días:
D-047c sacó la cinta porque dejó de ser exclusiva, D-049 la habilitó de nuevo sin reponerla, y
D-050 la volvió a invalidar. Un texto a mano habría estado mintiendo en dos de esas tres vueltas.

**Y cierra la discusión de la cinta.** D-047c la sacó porque anunciarla sólo en el 3 cuando el 2
también cruzaba era exclusividad falsa. La respuesta correcta no era elegir una tarjeta: era
mostrarla en todas las que corresponde. `option_3_badge` sigue libre para lo que haga falta.

**Archivos.**

| Qué | Archivo |
|---|---|
| Cálculo y guarda del umbral | `snippets/cauce-envio-escalon.liquid` *(nuevo)* |
| Render en las cuatro tarjetas | `snippets/quantity-breaks.liquid` |
| Texto | `locales/es.json` y `locales/en.default.json` → `cauce.pdp.envio_gratis_escalon` |
| Estilo del chip y color del caption | `assets/cauce-brand.css` |

El chip va en el `quantity-break__left`, después del caption, en el mismo DM Mono a cuerpo chico
para no abrir una tercera tipografía adentro de la tarjeta. El borde es SEDIMENTO-2 y no CAUCE a
propósito: no tiene que competir con el precio por frasco, que es lo que se acaba de subir.

**Límite conocido.** El chip se resuelve en el servidor. El JS del tema recalcula los precios de
las tarjetas al cambiar de variante leyendo `data-percentage-left` y `data-fixed-discount`, pero no
toca este span. Hoy da igual —`update_prices` está en `false` y el producto tiene una sola
variante—, pero si alguna vez se activan variantes de distinto precio, el chip hay que moverlo al
mismo mecanismo de `variant-price-update` o queda pegado al precio de la primera variante. Está
anotado en el encabezado del snippet.

**Lo que sigue igual.** Sigue siendo `settings.cauce_umbral_envio_gratis` **sólo dibujando**: la
tarifa real de envío sin cargo desde $60.000 tiene que existir en Configuración → Envíos. Con este
cambio la promesa pasó de cuatro superficies a cinco, y la quinta es la que está pegada al botón de
compra. El bloqueante del §6 pesa más, no menos.

---

## D-051 · 2026-09-12 · El bloque de packs se reordena alrededor del escalón de 3, y el destaque deja de seguir a la selección

**Decisión.** Pedido comercial completo sobre el bloque `ofertas` de la PDP: el default, el
badge y el fondo destacado se mudan del escalón 2 al 3, cada tarjeta suma ahorro y envío, el
escalón 3 suma cuotas, el encabezado pasa a dos renglones y el CTA dice lo que se está por
agregar. Los precios no se tocaron: son los de D-050.

| | Antes | Ahora |
|---|---|---|
| Preseleccionado | escalón 2 | **escalón 3** |
| Cinta | `EL MÁS ELEGIDO` en el 2 | **`LA TOMA COMPLETA · 90 DÍAS` en el 3** |
| Fondo destacado | el que estuviera elegido | **fijo en el 3, SEDIMENTO** |
| Pill del 2 | `El 2º sale $12.000` | — |
| Títulos | `1 frasco` / `2 frascos` / `3 frascos` | `… · 30 días` / `· 60 días` / `· 90 días` |
| Caption del 1 | `$49.900 por frasco` | `+ envío` |
| Líneas nuevas | — | ahorro en los tres; cuotas en el 3 |
| CTA | `Agregar al carrito` | **`Agregar 3 frascos · $72.900`**, vivo |

### El destaque deja de ser el estado de selección

Es el cambio con más consecuencias y el menos visible en un diff. Shrine dibuja la tarjeta
elegida con fondo: `.quantity-break` arranca en 2 % del color de acento y `:checked` salta a
10 %. O sea que "destacado" y "elegido" eran la misma cosa, y el peso visual viajaba de tarjeta
en tarjeta con cada click.

Ahora son dos cosas distintas: las tres tarjetas van en **BLANCO**, el escalón 3 va **siempre**
en SEDIMENTO, y la selección se lee por el borde —que pasa de 30 % de alpha a pleno— más el
punto indicador. Click en el escalón 1 y el fondo SEDIMENTO sigue donde estaba.

El selector es `[for="quantity3"]` y no `[data-quantity="3"]` a propósito: engancha el **tercer
escalón**, no "el escalón que lleva 3 frascos". Si mañana el pack grande pasa a 4 frascos, el
destaque se queda donde tiene que estar. Lo que sí queda atado a CSS es *cuál* escalón se
destaca: moverlo es editar esa regla, no un setting.

### Lo que se calcula y lo que se escribe a mano

Los tres renglones nuevos de cada tarjeta salen de `snippets/cauce-escalon-extras.liquid`, que
recibe el total ya descontado y el `option_N_price_difference` que el tema ya calculaba para el
token `[amount_saved]`:

| Renglón | De dónde sale | Dónde aparece hoy |
|---|---|---|
| `Ahorrás $X` | `compare_price − price`. Si da 0 no se dibuja | escalones 2 y 3 |
| `Envío gratis` | `cauce-envio-escalon.liquid` contra el umbral (D-050c) | escalones 2 y 3 |
| `3 cuotas de $X` | `settings.cauce_cuotas` dividiendo el total | sólo donde lo mande `cauce_cuotas_escalon` |

El escalón 1 no muestra ahorro porque tachado y precio son el mismo número: la línea se calla
sola en vez de decir "Ahorrás $0". Y las cuotas necesitaron un campo nuevo
(`cauce_cuotas_escalon`, un select en el schema del bloque) porque **en qué escalón conviene
anunciar financiación es decisión comercial, no del tema** — el tema no tiene cómo deducirlo.

Contra eso, lo que quedó escrito a mano y hay que mantener: los **días** de los tres títulos, el
**"cada frasco, un mes"** del encabezado y los **dos precios de la letra chica 1**. Los días
podrían salir del token `[duracion]`, pero los metafields de dosis siguen vacíos (D-003, D-050b)
y el bloque los pedía ahora. Está anotado en el §6.

### El CTA

Cada tarjeta trae el texto ya armado en `data-cauce-cta`, con el money y la pluralización
resueltos **en el servidor**; `assets/cauce.js` sólo lo copia al botón cuando cambia el radio.
Duplicar el formateo de plata en JS es exactamente como se desincronizan los precios, y este
bloque ya tuvo tres cambios de precio en cuatro días.

El botón agotado no se toca: ahí el texto es "Sin stock", que no es una promesa de compra. El
sticky ATC tampoco: es otro elemento, con su propio label, y está fuera del bloque.

**Límite conocido, el mismo del chip de envío:** todo esto se resuelve en el servidor. Con
`update_prices` activado y variantes de distinto precio, el JS del tema recalcula los precios de
las tarjetas pero no el ahorro, ni las cuotas, ni el `data-cauce-cta`. Hoy `update_prices` está
en `false` y el producto tiene una sola variante.

### Tres cosas que este cambio deja abiertas

1. **La bajada cita ensayos clínicos.** *"Los ensayos clínicos con R-ALA evalúan tomas diarias
   sostenidas de 8 a 12 semanas."* No promete un resultado, pero afirma algo sobre literatura
   científica y hay que poder mostrarla. Bloqueante nuevo en el §6. Es un campo del editor
   (`cauce_subtitulo`): sacarlo no toca código.
2. **"3 cuotas de $24.300" promete financiación sin interés.** La división es exacta, pero si la
   pasarela cobra CFT el número miente. Bloqueante nuevo en el §6.
3. **La cinta en VADO con texto blanco da 3,20:1.** Es lo que había y lo que se pidió mantener,
   pero a 15 px en negrita no llega ni al 4,5:1 de AA ni al 3:1 de texto grande. CAUCE sobre
   VADO da **4,93:1** y pasa. Es cambiar `--color-foreground` de la cinta; no se hizo porque el
   pedido decía "texto blanco, como está hoy".

### Lo que se cerró

La cinta `EL MÁS ELEGIDO` era el bloqueante más viejo del §6: afirmaba la conducta de otros
compradores sin ventas que la respaldaran (D-047b, Res. SC 270/2020). Ya no existe, y el texto
que la reemplaza habla del producto y no de terceros. El pill `El 2º sale $12.000` también salió,
y no se hizo el equivalente para el 3: con los precios de D-050 el tercer frasco sale $11.000 y
el segundo $12.000, así que el pill era el peor argumento de la grilla, no el mejor.

**Lo que no se tocó.** Ninguna otra sección de la PDP, ningún precio, ninguna variante. La barra
de anuncio y el acordeón de envíos siguen diciendo "desde $60.000": es verdad, el umbral no
cambió, y son superficies de otra sección.

---

## D-052 · 2026-09-13 · 10 % OFF pagando con transferencia, con código y control a mano, y el umbral de envío gratis baja a $55.000

**Decisión.** CAUCE suma un beneficio por pago con transferencia bancaria: **10 %** sobre el
pedido, con el código **`TRANSFERENCIA10`**. Esto supera el punto 4 de D-046 ("No hay beneficio
por transferencia"): el dato comercial ahora existe, y el tema lo enchufa donde ese punto lo había
dejado previsto. En la misma decisión el umbral de envío gratis baja de $60.000 a **$55.000**.

### 1. Cómo se aplica el descuento, y por qué con control a mano

Shopify no tiene descuento por medio de pago: un código de descuento no sabe con qué se paga el
pedido. Había tres caminos:

| Camino | Qué hace | Por qué sí o por qué no |
|---|---|---|
| **Código + control a mano** | Método de pago manual "Transferencia bancaria" + código que el cliente carga en el checkout | **Elegido.** El cliente ve el descuento antes de confirmar. Es el "Camino A" de Numen, y el carrito de D-046 ya estaba armado para él. El riesgo —usar el código y pagar con Mercado Pago— se controla pedido por pedido, que con el volumen de hoy se puede |
| Código + app que oculta medios | Lo mismo, y una app de reglas de pago esconde Mercado Pago cuando el código está aplicado | Descartado por ahora: costo mensual para un abuso que todavía no pasó. Es la salida si el control a mano deja de alcanzar |
| Sin código, ajuste manual | Se paga a precio lleno en el checkout y después se manda el total con 10 % menos | Descartado: el descuento no se ve en el momento de decidir, y el mail de confirmación dice un total que no es el que se cobra |

### 2. Qué dibuja el tema

Dos settings nuevos en **Configuración del tema → CAUCE → Pagos**: `cauce_transferencia_pct`
(range 0–30, cargado en 10) y `cauce_transferencia_codigo` (texto, cargado en `TRANSFERENCIA10`).
**Las piezas calculadas se dibujan sólo con los dos cargados**: un porcentaje sin código es una
promesa sin mecanismo para cumplirla.

| Superficie | Archivo | Qué dice | De dónde sale |
|---|---|---|---|
| Card de pago del carrito (drawer y `/cart`) | `snippets/cauce-carrito-pago.liquid` | "Con transferencia ahorrás $X · 10 % OFF" y el código | `cart.items_subtotal_price` × pct |
| Cada escalón de la PDP | `snippets/cauce-escalon-extras.liquid` | "$X con transferencia" | total del escalón − pct |
| Barra de anuncio | `sections/header-group.json` | "10 % OFF pagando con transferencia", ícono `payments` | **escrito a mano** |
| Tira de medios de pago | `cauce_medios_pago` en `config/settings_data.json` | chip "Transferencia bancaria" | la lista, que ya soportaba `transferencia` |

Con los precios de D-050:

| Escalón | Total | Con transferencia |
|---|---|---|
| 1 frasco | $49.900 | $44.910 |
| 2 frascos | $61.900 | $55.710 |
| 3 frascos | $72.900 | $65.610 |

**En el carrito se muestra el ahorro y en los escalones el precio.** Parece chocar con la regla 2
de Numen ("el ahorro, nunca un segundo precio") y no choca: esa regla existe porque en el carrito
el total está dos renglones más arriba. En la tarjeta del escalón el renglón de arriba ya es
"Ahorrás $X" por el pack, y un segundo "Ahorrás" en la misma tarjeta se lee como el mismo número.
Ninguno de los dos tacha nada.

**La base del carrito está verificada.** `cart.items_subtotal_price` es, según la documentación de
Shopify, el subtotal "después de los descuentos de línea": trae aplicados los descuentos
automáticos de los packs y no los códigos. Es la misma base sobre la que Shopify aplica un
descuento de pedido, así que el ahorro del carrito coincide con el del checkout. El comentario
anterior del snippet la llamaba "subtotal de LISTA", y no lo es.

**El ícono no es `account_balance`.** `snippets/material-icon.liquid` dibuja un set cerrado de
paths (`docs/ICONOS.md`) y un nombre que no está en el set no renderiza nada. `payments` ya
estaba.

**Límite conocido, el mismo de las cuotas:** la línea del escalón se resuelve en el servidor; con
`update_prices` activado y variantes de distinto precio no se recalcula. Hoy `update_prices` está
en `false`.

### 3. El umbral baja a $55.000

Es la salida que D-050 había dejado anotada para el cupón de bienvenida, y con la transferencia
deja de ser opcional: el 10 % deja el pack de 2 en $55.710, que con el umbral en $60.000 perdía el
envío gratis en el checkout mientras la barra del carrito —que lee `items_subtotal_price`, sin
códigos— seguía diciendo "Tenés el envío gratis".

| Escalón | Sin código | Con un 10 % | ¿Cruza los $55.000? |
|---|---|---|---|
| 1 frasco | $49.900 | $44.910 | No, en ningún caso |
| 2 frascos | $61.900 | $55.710 | Sí: por $6.900 sin código y por **$710** con código |
| 3 frascos | $72.900 | $65.610 | Sí, por $10.610 con código |

**Vale sólo porque los dos 10 % no se combinan entre sí.** Juntos dejan el pack de 2 abajo de
$55.000 y el problema de D-050 vuelve entero. Y $710 es poco aire: cualquier baja de precio del
pack de 2 hay que revisarla contra el umbral.

Cambian de número `cauce_umbral_envio_gratis` (60000 → 55000), la barra de anuncio y el acordeón
de envíos de la landing. Los chips "Envío gratis" de los escalones y la barra del carrito se
recalculan solos.

### 4. Lo que hay que hacer en Shopify antes del merge

El merge a `main` publica todo esto. Si va antes, la tienda promete un precio que el checkout no
cobra:

1. Configuración → Pagos → métodos manuales → **Transferencia bancaria**, con los datos de la
   cuenta y, en las instrucciones, el código y qué pasa si se usa con otro medio de pago.
2. Descuentos → código `TRANSFERENCIA10`: 10 % sobre el pedido, **combinable con descuentos de
   producto** y no con otros descuentos de pedido.
3. Los descuentos automáticos de los packs (R6), con la combinación con descuentos de pedido
   activada. Sin eso, al cargar el código el cliente pierde el precio del pack.
4. La tarifa de envío sin cargo pasa a $55.000.

Queda como bloqueante en el §6 de `CLAIMS-AUDIT.md`.

**Alternativa descartada.** Dejar `cauce_transferencia_pct` en 0 en el repo y prenderlo desde el
editor después de configurar Shopify. Parece más seguro, pero la barra de anuncio y el umbral no
tienen interruptor y se publican con el merge igual, así que el merge queda condicionado de todos
modos. Con dos momentos de publicación en vez de uno hay dos oportunidades de dejar la tienda a
medias.

---

## D-054 · 2026-09-16 · Hormify: segundo SKU, línea mujer, con PDP propia inspirada en hormify.com

**Decisión.** El primer testeo (R-ALA, `product.cauce-landing`) no funcionó y el siguiente es un
producto nuevo de la línea CAUCE: **Hormify**, un frasco de **60 cápsulas** para el equilibrio
hormonal de la mujer. Se arma su PDP como template alterno, **`templates/product.hormify.json`**,
tomando como referencia la página de hormify.com. El template sale del de la landing del R-ALA
(se hereda cada setting de Shrine tal como lo dejó el editor) y se le reescribe el copy, el orden
y dos secciones nuevas.

Cuatro definiciones las tomó el comercio el 2026-09-16, con las alternativas a la vista:

| Pregunta | Respuesta | Alternativas que se descartaron |
|---|---|---|
| Cuán directo habla sobre síntomas y resultados | **Directo, como hormify.com**, más los síntomas del ciclo (hinchazón, cansancio, humor, ciclo irregular) | "Síntomas sí, promesas no" (la recomendada) y "sólo composición" (la línea original de CLAIMS-AUDIT) |
| El nombre | **Queda Hormify** | Usarlo como nombre de trabajo y cambiarlo antes de publicar |
| Toma y packs | **2 cápsulas por día · 1, 2 y 3 frascos** (1 frasco = 30 días) | 1, 3 y 6 frascos como la referencia; 1 cápsula por día |
| Estética | **CAUCE con acento propio** | CAUCE sin cambios; identidad propia rosa/magenta |

La primera respuesta **da vuelta la regla de §1–§3 de `CLAIMS-AUDIT.md` para este SKU**. Lo que
eso implica está en el §8 nuevo de ese archivo. Acá sólo se anota que fue una decisión comercial
explícita, tomada después de ver el riesgo ANMAT y el de Meta Ads, y que la del nombre también
lo fue: *Hormify* es el nombre de la marca de referencia.

### 1. Qué se tomó de la referencia y dónde quedó

| hormify.com | En la PDP | Estado |
|---|---|---|
| Hero con la pregunta de síntomas | bloque `subtitulo` del `main` | activo |
| "Choose your bundle", 3 tarjetas con precio por frasco | bloque `ofertas` (el selector de D-051), con los mismos cálculos | activo, precios **provisorios** (§4) |
| Cinta "Most popular" / "Best value" | cinta del escalón 3: `RESULTADOS ÓPTIMOS · 90 DÍAS` | activo. No se copió "Más elegido": sin ventas es la afirmación falsa que D-047b sacó |
| "Life with hormonal imbalance / with healthy balance" | **`cauce-contraste`**, sección nueva | activo |
| "Support Hormone Balance", 4 beneficios | `cauce-solucion` | activo, sin packshot |
| "8 Ingredients in 1 Powerful Formula" + sellos | **`cauce-ingredientes`**, sección nueva | activo, **sin dosis** |
| Comparativa contra "other supplements" | `comparison-table` | activo |
| Plazos de resultado (en su FAQ) | `cauce-progreso` y la bajada del selector | activo |
| FAQ | `cauce-faq`, ocho preguntas adaptadas | activo |
| "98,325 reviews", 4.8 estrellas | bloque `resenas` (rating) del `main` | **apagado** |
| "Confirmed by 11,327+ women in our internal study", 93 % / 92 % / … | `cauce-resultados` | **apagado** |
| Reseñas | `ss-glow-testimonial` | **apagado** |
| Logos de prensa, "Made in FDA registered facility" | — | no se hizo |
| Regalos digitales por pack, quiz | — | no se hizo (ver §6) |

**Lo apagado no es por prolijidad.** Son las tres piezas de prueba social de la referencia y no
hay un solo dato real detrás: el producto no existe todavía en Shopify. Se dejan armadas con
`[[PENDIENTE]]` para que prenderlas sea cargar números reales, y no se escribe ningún número
inventado. La landing del R-ALA sí tiene cargados desde el editor un "1574+ reseñas", una
"encuesta a +700 clientes" y siete testimonios; eso está abierto en el §6 de `CLAIMS-AUDIT.md` y
esta PDP no lo repite.

### 2. Dos secciones nuevas, no multicolumn

**`cauce-contraste`.** `cauce-dolor` tiene una sola lista, y el argumento de la referencia es poner
las dos listas lado a lado. Cada bloque es un **par** (`sin` + `con`) para que nadie tenga que
mantener dos listas sincronizadas; se dibujan dos `<ul>`, no una tabla, porque un lector de
pantalla tiene que leer primero el problema entero y después la solución entera. La tarjeta
positiva lleva `color-background-1` propio: reinicia los tokens del bloque 0 y el acento vale su
versión sobre claro aunque la sección sea TINTA. Las dos columnas arrancan en 750 px y no en 990
como `cauce-dolor`: acá el argumento *es* verlas juntas.

**`cauce-ingredientes`.** `cauce-datos` es una ficha para un activo y no tiene dónde decir qué hace
cada uno. Dos tipos de bloque (`ingrediente` y `sello`) en el mismo editor y dos listas en el
markup. La dosis va aparte, en DM Mono, y **si está vacía no se dibuja**: hoy están vacías las
ocho, porque la única fuente válida es el rótulo aprobado. En mobile cada activo es una fila con
el ícono al costado (ocho tarjetas paradas en un teléfono son cuatro pantallas de scroll).

`multicolumn` quedó descartado por lo mismo que en D-033 y D-034: no resuelve los tokens
contextuales y la dosis necesitaba su propio renglón.

Cinco íconos nuevos en `snippets/cauce-iconos.liquid` (`flor`, `luna`, `corazon`, `llama`, `ola`),
sumados también al select de `cauce-solucion`.

### 3. La paleta: una clase en `<html>` y un bloque de tokens

| Token | CAUCE | Hormify | Rol |
|---|---|---|---|
| `--cauce-oxido` | `#B03A22` | **`#9A3F6B`** MALVA | acento sobre claro |
| `--cauce-oxido-claro` | `#D9603F` | **`#E48AB2`** MALVA CLARO | acento sobre TINTA |
| `--cauce-sedimento` | `#E9E6DC` | **`#F3E6E9`** RUBOR | superficie |
| `--cauce-sedimento-2` | `#DFDBCE` | **`#ECD8DE`** RUBOR 2 | tarjeta sobre superficie |

TINTA, BLANCO, VADO, la tipografía y la estructura no cambian: se lee como línea de CAUCE. Los
contrastes están medidos en el bloque 20 de `cauce-brand.css`; los que importan son blanco sobre
MALVA **6.37:1** (la etiqueta del botón sigue blanca) y VADO-TEXTO sobre RUBOR **4.64:1**.

`layout/theme.liquid` agrega `plantilla--<sufijo>` al `<html>` de cualquier template alterno, y
`cauce-brand.css` pisa los tokens bajo `:root.plantilla--hormify`, junto con las variables de
Shrine que salen de los mismos settings (`--color-base-accent-1`, `--color-base-background-2` y
sus gradientes).

**Por qué en `<html>` y no en `<body>`.** `base.css` deriva `--color-button` y `--accent-color`
sobre `:root`. Una regla sobre el mismo elemento con más especificidad los recalcula; una sobre
`body` deja esos dos con el óxido heredado.

**Alternativa descartada: `sections/colors-changer.liquid`.** Shrine trae una sección que pisa
los colores "on this page only", y es la vía nativa (D-001). No alcanza: pisa sólo las
`--color-base-*`, así que el título en acento, el precio y el fondo del escalón destacado —que
leen `--cauce-oxido` y `--cauce-sedimento`— seguirían en óxido y sedimento. Y obliga a cargar los
ocho hex de la marca dentro del template, que es lo que D-002 prohíbe.

**Consecuencia aceptada.** El header, el carrito lateral y el pie también toman el acento MALVA
mientras se está en esta página. Es coherente con la página y no toca ninguna otra.

**Límite anotado.** MALVA (matiz 331) y el CARMIN de error (matiz 350) quedan a 19°. El error
sólo aparece como texto, pero no conviene usarlo como relleno grande en esta página.

### 4. La oferta: mismo selector, precios provisorios

Se reusa el bloque `ofertas` de D-051 sin tocar código: títulos `1 frasco · 30 días` /
`2 frascos · 60 días` / `3 frascos · 90 días`, el 3 preseleccionado y destacado, y el encabezado
**`2 CÁPSULAS AL DÍA · CADA FRASCO, UN MES`** (con "DOS" cortaba "UN / MES" a 390 px). Las cintas
van en `accent-1` (MALVA, blanco encima 6.37:1) y no en VADO: el límite de 3.20:1 que D-051 dejó
anotado para la cinta del R-ALA acá no se repite.

**Los montos son los del R-ALA** (`fixed_amount_off` 37.900 y 76.800, o sea $49.900 / $61.900 /
$72.900) porque el precio de Hormify **no está definido**. Son un placeholder que se ve como un
precio real, así que cambiarlos es condición para publicar. Contra el umbral de $55.000, con
esos números: el frasco suelto queda a **$5.100** (lo mismo que hoy con el R-ALA, ya aceptado), el
pack de 2 cruza por $6.900 y el de 3 por $17.900. Con cualquier otro precio hay que volver a medir
las tres distancias antes de cargarlo (la lección del revert `dc6201a`).

**Los descuentos automáticos tienen que quedar atados a cada producto.** Hasta hoy había un solo
SKU y un descuento por "cantidad 2" no necesitaba saber de cuál. Con dos, un carrito de
1 R-ALA + 1 Hormify no tiene que activar el precio de pack de ninguno de los dos.

El empujón de envío del carrito (D-046 §3) no necesitó cambios: elige entre las líneas que ya
están en el carrito, así que con dos SKU sugiere uno de los que la clienta ya eligió.

### 5. El ancla `#comprar`, y un ancla rota en la landing del R-ALA

Los CTA del cuerpo ("Quiero recuperar mi equilibrio", "Ver precios") vuelven al selector con
**`#comprar`**, un bloque `custom_liquid` puesto justo antes de `ofertas`
(`<span id="comprar" class="cauce-ancla">`, bloque 21 de `cauce-brand.css`).

Dos cosas que salieron de probarlo:

1. **Tiene que ser `<span>`.** `base.css` oculta `div:empty` (y `a`, `p`, `h1`–`h6`, `ul` vacíos).
   Con un `<div>` el hash cambiaba y la página no se movía: un elemento con `display:none` no
   tiene posición a la que saltar.
2. **`#shopify-section-main` no existe.** En un template JSON el wrapper se llama
   `shopify-section-template--<id>__main`, con un id que asigna Shopify y que cambia por
   template. La landing del R-ALA tiene ese href en el botón de `resultados` ("Ver la fórmula y
   el precio") y **hoy ese botón no lleva a ningún lado** (verificado en caucearg.com el
   2026-09-16). El `info` del schema de `cauce-resultados` lo recomendaba; se corrigió. El
   template del R-ALA no se tocó en esta rama: arreglarlo es sumarle el mismo bloque ancla y
   cambiar el link, y ese template lo reescribe el editor seguido.

### 6. Lo que queda fuera de esta rama

- **El producto en Shopify.** No existe. Hay que crearlo, asignarle la plantilla `hormify`, cargar
  fotos propias (el packshot de `solucion` está vacío y dibuja el placeholder) y los metafields
  `cauce.*` (§5 de `METAFIELDS.md`).
- **La fórmula real.** Los ocho activos son los que publica la referencia, cargados como
  borrador. Si la fórmula de CAUCE es otra, cambian `ingredientes`, la pestaña Ingredientes, la
  primera respuesta de la FAQ y la comparativa.
- **La home.** Vende el único SKU (D-038). Hormify no aparece hasta que se decida cómo conviven
  los dos productos.
- **Regalos por pack y quiz.** Son dos de las palancas más fuertes de la referencia (una guía
  descargable que sube con el pack, y un quiz como CTA principal). No se armaron porque no existe
  el material; un regalo que no se entrega es una promesa incumplida bajo Ley 24.240.
- **Suscripción.** La referencia la preselecciona; acá sigue apagada hasta instalar una app
  (`cauce-suscripcion`, D-024).

### 7. Cómo se verificó

`theme check` sobre la rama y sobre una copia limpia de `HEAD`: **59 contra 59 offenses, 0
errores, ninguna nueva**. Cada setting y cada bloque de `product.hormify.json` se validó contra el
schema de su sección (theme check no lo hace). La página se miró con `theme dev` sobre el
producto del R-ALA con `?view=hormify` a 1440 px y a 390 px: sin scroll horizontal, las dos
secciones nuevas, la paleta, el selector y el ancla. El ancla se probó con scroll instantáneo: en
la pestaña automatizada, que estaba en segundo plano, Chrome no anima el `scroll-behavior:
smooth` del tema y ningún salto por hash se movía, ni siquiera a una sección.

---

## D-055 · 2026-09-18 · La banda de solución de Hormify pasa a foto de fondo con el texto encima

**Decisión.** El bloque `solucion` de la PDP de Hormify replica la sección de la referencia
("Support Hormone Balance…"): la foto del producto ocupa una banda a sangre y el texto se apoya
encima, en una columna a la izquierda, con la grilla de cuatro beneficios debajo. No se escribió
una sección nueva: `cauce-solucion` suma una **disposición** (`apilado`, el default de siempre, y
`fondo`). El contenido, los bloques y los claims son los mismos, y dos secciones para el mismo
bloque significarían el mismo copy en dos lugares del editor.

**Contexto del día.** Entre el 2026-09-17 y el 2026-09-18 el comercio creó el producto Hormify en
Shopify con la plantilla `hormify` asignada, cargó fotos en el bloque de contraste
(`capsulero130cc.jpg` e `image2.jpg`) y **borró el producto del R-ALA**: su URL da 404 y
`product.cauce-landing.json` queda en el repo sin ningún producto que lo use. La PDP de Hormify ya
se ve en caucearg.com.

### 1. Lo que hace la variante

| | |
|---|---|
| Markup | La foto es un `<img>` en una capa propia, hermana del contenido, no un `background-image`: así entra al `srcset` del tema, el browser elige el ancho y hay un `alt` de verdad |
| Texto | Columna de ancho propio (`ancho_columna`, 520 px), a izquierda o derecha, centrada vertical con `min-height` |
| Packshot | **No se dibuja.** La foto del fondo ya es la foto del producto |
| Color | El texto y los íconos dejan sus tokens (VADO, secundario) y pasan al primer plano del esquema: encima de una foto no hay contraste calculable, y ahí el color no distingue nada |
| Teléfono | La foto **no** va de fondo: se parte en dos, la foto arriba con su propio encuadre y el texto abajo sobre el color de la sección |

Siete settings nuevos, todos bajo dos encabezados (`Disposición` y `Foto de fondo`): imagen, alt,
lado de la columna, ancho de la columna, alto mínimo, velo y dos encuadres (escritorio y teléfono).

### 2. El velo no es decoración, y el número salió de medir el render

Sobre esta foto, el blanco **no se lee sin velo**: medido sobre la página renderizada, el peor
píxel bajo la columna da **1.95:1 a 1440 px y 1.50:1 a 900 px**. El pliegue rosa claro cruza toda
la columna, y el recorte de `cover` se cierra a medida que la ventana se angosta, así que **cuanto
más chica la pantalla, más clara la zona del texto**. Por eso el velo es un setting y no una
constante: cada foto necesita el suyo.

Dos versiones antes de llegar al número:

| Versión | Qué hacía | Medido |
|---|---|---|
| Rampa desde 70 % | Arrancaba fuerte en el borde y se apagaba al 65 % del ancho | 5.81:1 al principio de la columna y **2.57:1 al final**: el degradado se terminaba adentro del texto |
| Meseta al 55 % | Parejo bajo el texto, desvanecido después | 5.78:1 a 1440 px, pero **4.36:1 a 760 px** |
| **Meseta al 65 %** (queda) | Ídem, más oscuro | **7.3:1 a 1440 px · 6.4:1 a 900 px · 5.8:1 a 760 px** |

El final de la meseta **se calcula**, no se estima: aire que deja `.page-width` + el padding de
5 rem + el ancho de la columna + 2 rem, con un `max()` que lo sostiene cuando la ventana es más
angosta que el bloque. Con un porcentaje fijo, a 760 px el velo se cortaba 65 px antes que el
texto. El desvanecido lleva un punto intermedio porque con una rampa lineal sola se veía el borde
recto donde terminaba la meseta.

**Lo que esto implica para otra foto:** si mañana se cambia la imagen, hay que volver a mirar el
velo. Una foto oscura del lado del texto puede bajar a 30 % y una más clara que esta puede
necesitar más de 65 %.

### 3. Dos cosas que solo aparecieron probándolo

1. **Las variables no llegaban a la foto.** Estaban declaradas en el `style` de `__inner`, que es
   **hermano** de la capa de la imagen, y una custom property solo baja a los descendientes. El
   velo y los dos encuadres usaban siempre su valor por defecto: mover los tres sliders en el
   editor no habría hecho nada. Ahora se declaran en el contenedor de la sección. Se detectó
   midiendo `object-position` en el navegador, no mirando el CSS: tres capturas con encuadres
   distintos habían salido idénticas byte a byte.
2. **El flex se mudó de `__inner` a un `__cuerpo` nuevo.** La variante de fondo necesita una
   columna de ancho propio adentro de la banda, y el padding de sección tiene que quedar en
   `__inner`. Para la disposición apilada son las mismas propiedades un nivel más adentro.

### 4. Lo que falta

- **Subir la foto.** El template apunta a `shopify://shop_images/image3.jpg` y ese archivo **no
  está** en Archivos de Shopify (sí están `image1.jpg`, `image2.jpg` y `capsulero130cc.jpg`).
  Hasta que se suba con ese nombre —o se elija otra desde el editor— la banda se dibuja sin foto,
  en TINTA, y el texto se lee igual.
- El encuadre de teléfono quedó en 70 % probando tres valores contra esta foto. Con otra foto hay
  que volver a mirarlo.

---

## D-056 · 2026-09-19 · En Hormify la banda de solución es CIRUELA, no TINTA

**Decisión.** La paleta de Hormify suma un color: **CIRUELA `#523444`**. Es el fondo de la banda
de solución con foto (`cauce-solucion`, disposición `fondo`, esquema TINTA) en todos los anchos.
El velo de escritorio no cambia: sigue siendo TINTA al 65 %.

**Por qué.** En escritorio el texto se apoya en el velo encima de la foto rosa, y lo que se ve
detrás del texto no es verde sino ciruela. En teléfono la foto se parte y el texto baja al color
liso de la sección, que era TINTA: la misma banda se leía ciruela en un tamaño y verde oscuro en el
otro. El comercio pidió que en teléfono el fondo tomara los colores de Hormify.

**De dónde sale el número.** No es un tono elegido a ojo: es el promedio medido sobre una captura
de escritorio de la página viva, en zonas sin texto de la columna (`#523444` bajo el título,
`#513544` entre los beneficios). Con eso el teléfono muestra el mismo color que el escritorio ya
tenía.

| Opción probada a 390 px | Fondo | Texto | Por qué no |
|---|---|---|---|
| **CIRUELA** (queda) | `#523444` | blanco 10.86:1 | — |
| MALVA | `#9A3F6B` | blanco 6.37:1 | Es el color del botón de compra y de la barra fija, que queda justo abajo: el botón pierde protagonismo |
| RUBOR | `#F3E6E9` | TINTA 9.95:1 | Se pierde la banda oscura del escritorio y repite el fondo de la sección de arriba |

**Cómo está hecho.** Un token nuevo en el bloque 20 de `cauce-brand.css` (`--cauce-ciruela`) y una
regla que pisa las dos variables del esquema (`--color-background` y `--gradient-background`) solo
en `.plantilla--hormify .cauce-solucion--fondo.color-inverse`. Queda atada a TINTA: si en el editor
se elige un esquema claro para esa sección, la regla no aplica y no queda texto oscuro sobre
ciruela. Ninguna otra banda TINTA de la página (la barra de íconos, el pie) cambia.

| Sobre CIRUELA | Contraste | Uso |
|---|---|---|
| Blanco | 10.86 AAA | título y beneficios |
| Blanco al 92 % | 9.49 AAA | bajada |
| Blanco al 75 % | 6.90 AA | pie |
| MALVA CLARO | 4.44 | acento del título y relleno del botón: texto grande y componente |
| VADO | 3.40 | no se usa: en la variante de fondo íconos y bajada van en el primer plano |

**Contexto.** `image3.jpg` ya está en Archivos de Shopify y la foto se ve en la tienda: queda
resuelto el primer pendiente de D-055. El commit de Shopify del mismo día sumó fotos a dos
ingredientes (`ashawanda.webp`, `zinc.webp`) y desactivó la sección "Qué esperar, mes a mes".

---

## D-057 · 2026-09-19 · Ingredientes de Hormify: la foto de cada activo pasa a ser el fondo de su tarjeta

**Decisión.** `cauce-ingredientes` suma un **estilo de tarjeta** (`estilo_tarjeta`: `icono`, el de
siempre, y `foto`). Con `foto`, la imagen de cada ingrediente ocupa toda la tarjeta, un velo oscuro
la cubre del lado del texto y el nombre y la descripción van en blanco encima. Es la tarjeta de la
sección de ingredientes de hormify.com. La PDP de Hormify usa `foto` con velo al 75 %.

Igual que en D-055, no es una sección nueva: el contenido, los bloques y los claims son los mismos.

### 1. Lo que se decidió con el comercio

| | Queda | Descartado |
|---|---|---|
| Tarjeta sin foto (hoy 6 de 8) | **Ciruela liso, con el ícono** en una pastilla translúcida a la derecha, donde las otras muestran la foto. La grilla se lee pareja y cada tarjeta pasa a foto sola cuando se le carga la suya | Dejarlas en RUBOR con el círculo: la grilla quedaba mitad oscura y mitad clara hasta tener las 8 fotos |
| Teléfono | **Una columna de tarjetas apaisadas** (≈ 360 × 140 px), texto a 14 px | Dos columnas como hormify.com: con los textos en castellano cada tarjeta quedaba de ≈ 165 px de ancho, la descripción en 5 o 6 renglones y la foto tapada |

Tablet va a dos columnas y desktop a las del setting (4 en Hormify). La tarjeta es apaisada en todos
los anchos, así que en desktop deja de pasar de fila a columna.

### 2. El velo se calcula contra el peor caso, no contra una foto

En la banda de solución (D-055) había una foto sola y el velo salió de medirla. Acá son ocho fotos
que se cargan desde el editor, así que el número sale del peor caso posible: **una foto blanca
pura** debajo del texto. Con el velo en CIRUELA, el blanco da **4.51:1 al 70 %** y **5.18:1 al
75 %**. Por eso el default es 75 y el rango del editor **no baja de 70**: cualquier foto que se suba
deja el texto en AA sin que nadie tenga que medir.

Medido sobre el render, renglón por renglón, el píxel más claro debajo del texto:

| Ancho | Ashwagandha | Zinc (fondo blanco) |
|---|---|---|
| 390 | 5.32:1 | 5.15:1 |
| 820 | 5.39:1 | 5.15:1 |
| 1440 | 5.39:1 | 5.17:1 |

El velo es parejo hasta donde puede llegar el texto (el borde de la columna + 1 rem) y recién ahí se
desvanece, como en D-055. En el borde derecho **no llega a cero** (queda en 15 % del valor): con la
foto del zinc, de fondo blanco, la tarjeta se fundía con la sección y perdía el contorno.

El velo es TINTA en CAUCE y **CIRUELA en Hormify** (bloque 20), el mismo color de la banda de
solución de D-056: son las dos piezas de la página que ponen texto blanco sobre una foto.

### 3. Detalles de construcción

- La foto es un `<img>` con `srcset`, no un `background-image`, y el `sizes` sale del ancho del
  bloque dividido por las columnas (300 px en Hormify). El `alt` va vacío: el nombre del
  ingrediente ya está en el `<h3>` de la tarjeta.
- El recorte sigue el **punto focal** que se elige en Archivos de Shopify, foto por foto
  (`image.presentation.focal_point`). No hace falta un setting de encuadre por bloque.
- El texto toma el blanco pisando `--color-foreground` en la tarjeta, y la dosis pasa a blanco al
  85 % pisando `--cauce-secundario`. Ninguna regla nombra el nombre ni la descripción.
- Se probó sin `theme dev`: el DOM de la página viva se reescribió como lo dibuja el Liquid de la
  rama, con el `cauce-brand.css` local. `theme check` da lo mismo que `main` (80 avisos, el único
  error es el de `card-product.liquid:44`, de antes).

### 4. Lo que falta

- **Las otras 6 fotos** (maca, ginseng, jengibre, L-fenilalanina, B6 y pimienta).
- **Resolución.** `ashawanda.webp` y `zinc.webp` miden **400 × 266 px**. En un teléfono la tarjeta
  pide unos 720 px reales y la foto se ve blanda. Conviene subirlas de **800 px de ancho o más**
  (el `info` del bloque ya lo pide).
- **Origen de las fotos.** Si salen de hormify.com, reemplazarlas por fotos propias o de stock con
  licencia antes de pautar.

**Contexto.** El commit de Shopify del mismo día cambió la foto "con" del bloque de contraste de
`image2.jpg` a `image4.jpg`.

**Actualización (D-060).** El acento de la línea pasó a MAGENTA y con él cambiaron los números de
esta sección: la columna termina en 30 % y no en 60 %, la tilde da 2.72 contra ese final y el nombre
de la columna dejó el acento. Los valores vigentes están en el bloque 22 de `cauce-brand.css`.

---

## D-058 · 2026-09-19 · La comparativa de Hormify pasa a una sección propia, con la tabla de hormify.com

**Decisión.** El bloque `comparativa` de la PDP de Hormify deja `comparison-table` de Shrine y pasa a
**`cauce-comparativa`**, una sección nueva (`sections/cauce-comparativa.liquid` + el snippet
`cauce-comparativa-marca` + el bloque 22 de `cauce-brand.css`). Replica el diseño y los colores de la
tabla de hormify.com: título centrado arriba, beneficios a la izquierda, la columna propia pintada
de un degradado con las puntas redondeadas, tildes llenas en el acento, cruces finas en la columna
de los otros y una fila de precio al final.

**Por qué una sección nueva y no ajustar la de Shrine.** `comparison-table` no permite tres cosas de
la referencia: el título arriba de la tabla (la pone siempre al costado desde 900 px), una columna
con un degradado continuo (cada celda pinta su color de esquema) y una fila de precio. Las dos
primeras se podían forzar con CSS atado a la plantilla; la tercera no, y el resultado habría sido
una sección de Shrine que ya no hace lo que dicen sus settings. Las 7 filas pasaron tal cual; la sección
vieja sigue en el tema y en `product.cauce-landing.json`.

### 1. Cómo está hecha

| | |
|---|---|
| Markup | `<table>` real: el beneficio es el `<th scope="row">`, las columnas llevan `<th scope="col">`, el título va de `<caption>` oculto y cada ícono lleva "Sí" / "No" oculto. Un lector de pantalla lee una tabla, no catorce dibujos |
| Degradado | Uno solo aunque cada celda pinte el suyo: la celda recibe su índice (`--i`) y el total (`--n`), estira el degradado a `n` veces su alto y lo corre hasta su tramo. Si las filas miden distinto, cada tramo se estira distinto, pero el borde de abajo de una celda tiene siempre el color del de arriba de la siguiente |
| Colores | Ninguno es propio de la sección. Va de la superficie (SEDIMENTO; RUBOR en Hormify) al acento claro mezclado con blanco (`color-mix`; sin soporte queda SEDIMENTO-2). Lo único que cambia por línea es cuánto acento lleva el final: 45 % en CAUCE, **60 % en Hormify** |
| Anchos | `table-layout: fixed`: la columna propia mide lo mismo con o sin la fila de precio. Teléfono 26 / 22 %, desktop 24 / 24 %; las tres columnas se quedan en teléfono, como en la referencia |
| Imagen | Opcional. Asoma por arriba de la columna, como el frasco de hormify.com. Tiene que ser un PNG sin fondo: una foto con fondo deja un recuadro. Sin imagen, la cabecera dice **Hormify** con el trazo del logo |

### 2. El límite del rosa lo pone la tilde

La tilde MALVA tiene que pasar 3:1 (componente) contra el tramo más oscuro de la columna:

| Final del degradado | Hormify (tilde MALVA) | CAUCE (tilde OXIDO) |
|---|---|---|
| 45 % | 4.33 | **3.45** (queda) |
| 55 % | 3.98 | 3.03 |
| **60 %** (queda en Hormify) | **3.80** | 2.83, falla |

Con el 45 % de los dos la columna de Hormify quedaba bastante más pálida que la de la referencia. Por
eso la intensidad es un token (`--cauce-comparativa-intensidad`) y el bloque 20 la sube solo para
Hormify. El resto: trazo blanco sobre la tilde 6.37, cruz MALVA sobre blanco 6.37, precio blanco
sobre MALVA 6.37, texto CAUCE sobre el final 9.40.

### 3. La fila de precio

Se eligió con el comercio: **costo por día**, no el precio del frasco. La pastilla muestra el precio
de la variante dividido por los días que dura un frasco (30, setting), redondeado al peso: hoy
**$1.663/día**. No se escribe en ningún lado: si cambia el precio en Shopify, cambia la tabla. Fuera
de una página de producto la fila no se dibuja. En la otra columna va un texto corto del editor, hoy
*Según la marca*, que no afirma el precio de nadie; un precio de la competencia sería un claim a
probar (CLAIMS-AUDIT §8.1, H14).

Con una sola variante el precio no cambia al elegir otra; si Hormify suma variantes con precio
propio, la fila muestra el de la variante con que carga la página.

### 4. Cómo se probó

Sin `theme dev`: sobre la página viva se reemplazó la tabla por el HTML que dibuja el Liquid nuevo y
se cargó el `cauce-brand.css` local, a 390 y 1440 px. Sin desborde horizontal; la pastilla de precio
entra en la columna a 390 (76 px en 94). `theme check` da lo mismo que `main`.

### 5. Lo que falta

- **El frasco en PNG sin fondo** para la cabecera de la columna (setting "Imagen de la columna
  destacada"). Hasta entonces dice Hormify.
- H12 sigue igual de expuesta que antes: la tabla cambió de forma, no de contenido.

**Contexto.** El commit de Shopify del mismo día cargó las seis fotos de ingredientes que faltaban
(D-057) y movió `contraste` debajo de `ingredientes`.

---

## D-059 · 2026-09-19 · El bloque de resultados suma la disposición de tarjetas, y sigue apagado

**Decisión.** `cauce-resultados` suma una **disposición** (`lista`, la de siempre, y `tarjetas`).
Con `tarjetas` replica la banda de resultados de hormify.com: fondo rosa, encabezado centrado, una
tarjeta blanca por cifra con un gráfico de torta, la cifra grande y abajo lo que la produjo. La PDP
de Hormify queda configurada así, **y la sección sigue apagada**: no hay encuesta.

**Por qué apagada.** Los números de la referencia —93 %, 92 %, 83 %, 97 % y "11.327+ mujeres en
nuestro estudio interno"— son de hormify.com. Copiarlos es publicidad engañosa (Ley 24.240 art. 9,
Res. SC 270/2020), y ya estaba anotado como bloqueante en CLAIMS-AUDIT §8.2. El comercio eligió
armar el diseño y dejar la sección apagada con los valores en `[[PENDIENTE]]` hasta tener una
encuesta propia. Cuando la tenga: carga los porcentajes, el campo **Metodología** —quiénes
respondieron, cuántas, cuándo y la pregunta textual— y la prende. Nada más.

### 1. Lo que hace la disposición

| | |
|---|---|
| Encabezado | Centrado. La bajada, que es la línea que dice de dónde salen las cifras, pasa al acento |
| Cifras | Una tarjeta blanca cada una, dos columnas en teléfono y las que entren desde 750 px |
| Torta | Un `conic-gradient` y no un SVG: la dibuja el mismo número que dibuja la barra en la disposición de lista (`barra`), sin markup nuevo. Decorativa y con `aria-hidden`, como la barra: la cifra ya está escrita al lado |
| Imagen | No se dibuja, aunque esté cargada |

### 2. La banda no sale del esquema

La sección pisa `--gradient-background` con el acento claro mezclado con blanco: el mismo rosa donde
termina la columna de la comparativa (D-058). Cuánto acento lleva es un token por línea, 45 % en
CAUCE y **60 % en Hormify**. Se pisa `--gradient-background` y no `--color-background` porque
`color-mix` devuelve un color y esa variable guarda una terna de canales.

Sobre esa banda (`#EFB9D1` en Hormify) el secundario **no se usa**: da 3.36:1. Por eso la metodología
—que es lo que sostiene las cifras— va en el color de texto al 80 % (5.96) y la volanta también sube
al 80 %. La bajada en acento da 3.80:1, así que va a **1.9rem y 700**: ahí es texto grande y el
mínimo es 3:1. Dentro de la tarjeta blanca, la cifra da 15.76, el detalle 5.63 y la torta 6.37.

### 3. Cómo se probó

Sin `theme dev` y con la sección apagada: se inyectó en la página viva el HTML que dibuja el Liquid,
con el `cauce-brand.css` local, a 390 y 1440 px. Las cifras se vieron con **"00 %"** de relleno, para
medir el ancho real sin escribir un número que no existe. `theme check` da lo mismo que `main`.

El botón "Ver precios" queda oscuro y no en el acento: sobre los esquemas de color, Shrine pasa el
botón al color de texto (`.color-background-2 { --color-button: var(--color-foreground) }`). Es el
mismo botón que en las otras bandas de superficie de la página. **Resuelto en D-064:** sobre la
superficie el botón vuelve al acento.

**Actualización (D-060).** Con el acento en MAGENTA, la bajada dejó el acento y pasó al color de
texto al 90 %: sobre la banda —que es un tinte del propio acento— MAGENTA daba 2.07.

---

## D-060 · 2026-09-19 · El acento de Hormify pasa a MAGENTA #FF00B4, con contraste por debajo de AA

**Decisión del comercio.** El acento de la línea Hormify deja MALVA `#9A3F6B` y pasa a **MAGENTA
`#FF00B4`**, el color exacto del botón de hormify.com, medido sobre la captura que pasó el comercio.
Su par para las bandas oscuras es **MAGENTA CLARO `#FF73D6`** (tinte del mismo color, 6.51 sobre
TINTA y 4.49 sobre CIRUELA, casi lo mismo que daba MALVA CLARO). Los íconos de la página dejan VADO
y pasan al acento. RUBOR, RUBOR 2 y CIRUELA no cambian.

**Lo que esto cuesta, con los números a la vista.** MAGENTA es un color de luminosidad media: nada
se lee bien encima. Se le ofrecieron al comercio tres opciones y eligió el color exacto:

| | Blanco encima | Como ícono sobre blanco | Como ícono sobre RUBOR |
|---|---|---|---|
| MALVA, el de antes | 6.37 | 6.37 | 5.25 |
| #C20089, mismo tono más oscuro | 5.76 | 5.76 | 4.74 |
| #E0009E | 4.49 | 4.49 | 3.70 |
| **#FF00B4** (queda) | **3.55** | **3.55** | **2.93** |

El mínimo de WCAG AA es 4.5 para texto normal, 3.0 para texto grande (≥18.66 px en negrita) y 3.0
para objetos gráficos. Entonces, **en la etiqueta blanca de los botones de compra el contraste queda
por debajo del mínimo** (3.55), y también como ícono sobre las bandas RUBOR (2.93). TINTA encima
tampoco resuelve: da 4.44. Queda anotado como decisión comercial.

**Si se quisiera cumplir sin cambiar el color:** subir la etiqueta de los botones a 1.9rem en
negrita la convierte en texto grande, donde el mínimo baja a 3.0 y 3.55 alcanza. Es un cambio de
tipografía, no de color, y está sin hacer.

### 1. Dónde NO se usó el acento, justamente por esto

| Pieza | Antes | Ahora | Por qué |
|---|---|---|---|
| Nombre de la columna en la comparativa (bloque 22) | acento | color de texto | Texto chico sobre RUBOR: MAGENTA daba 2.93, el color de texto da 12.99 |
| Bajada de las tarjetas de resultados (bloque 14) | acento | color de texto al 90 % | Sobre la banda, que es un tinte del propio acento, MAGENTA daba 2.07; ahora 7.47 |
| Final de la columna de la comparativa | 60 % del acento claro | 30 % | Con el rosa fuerte la tilde MAGENTA caía a 2.07 y el círculo se perdía. Con 30 % da 2.72, y lo que lleva el dato es el trazo blanco de adentro, que da 3.55 |

El resto sigue igual: la tilde y la cruz son objetos gráficos con su trazo blanco adentro, la torta
de resultados va sobre tarjeta blanca (3.55) y el precio del bloque de compra es texto grande.

### 2. Cómo se aplicó

- **Bloque 20** de `cauce-brand.css`: los dos hexes del acento y la terna `--color-base-accent-1`,
  que es de donde salen los botones de las secciones nativas de Shrine.
- **Íconos:** se pisa el token contextual `--cauce-icono` esquema por esquema, con los mismos
  selectores del bloque 0. Los dos esquemas de acento quedan afuera: dentro de una sección rellena
  con el acento, el ícono no puede ser del mismo color.
- **Template:** cinco bloques nativos tenían los íconos en "Accent 2" (VADO) y pasaron a "Accent 1":
  los dos de beneficios del hero y tres de la sección de garantía. Los íconos de los bloques de texto
  ya salían del token, así que no hubo que tocarlos.
- Los íconos de las pestañas del hero siguen en el color de texto: son parte del título de cada
  pestaña, no un ícono de acento.

---

## D-061 · 2026-09-19 · Las tarjetas de UGC suman el texto encima de la foto, y siguen vacías

**Decisión.** `cauce-ugc` suma una **disposición** (`debajo`, la de siempre, y `encima`). Con
`encima` replica la tira de reseñas de hormify.com: foto vertical, el texto apoyado sobre la foto
con un velo que lo sostiene, una línea de qué compró con la foto del pack, el nombre, y la tarjeta
cierra con una cinta de **clienta verificada** en el acento. La sección suma además un botón al pie.
La PDP de Hormify queda configurada así, **y sigue sin dibujarse**: las cuatro tarjetas están vacías.

**Por qué vacía.** No hay UGC real. Las tres fotos que pasó el comercio son de hormify.com: muestran
**otro frasco** (etiqueta en inglés) y a mujeres identificables. Publicarlas sería, a la vez,
testimonio inventado (Ley 24.240 art. 9, Res. SC 270/2020), foto ajena y uso de la imagen de una
persona sin su consentimiento (Ley 11.723 art. 31). La sección no dibuja nada mientras una tarjeta
no tenga foto o video, así que el bloqueo es por construcción y no por acordarse.

**Qué hace falta para prenderla:** foto o video de una clienta real con el frasco de CAUCE, permiso
escrito de esa persona para publicar su imagen, y que la frase y el "compró X frascos" sean ciertos
y se puedan mostrar. El texto sigue sin poder mencionar patologías, plazos ni profesionales de la
salud (ANMAT 4980/05), que ya estaba en la cabecera de la sección.

### 1. Construcción

| | |
|---|---|
| Pie | Se arma una sola vez y se dibuja adentro de la foto o abajo, según la disposición: el mismo contenido en los dos lados, sin duplicar el markup |
| Velo | Plano debajo del texto, desvanecido hacia arriba, como en D-055 y D-057. No hay una foto para medir —las carga el comercio— así que sale del peor caso, una foto blanca: con CIRUELA al 88 % el blanco da 7.4:1 |
| Cinta | En el acento, con su etiqueta. En Hormify eso es blanco sobre MAGENTA, 3.55:1: el mismo límite que el botón de compra (D-060) |
| Orden | Qué compró, la frase, el nombre. La disposición de abajo también cambió a ese orden: la frase antes que la firma |

**Un número que salió de medir el render:** con el desvanecido cruzando el texto —la primera versión
tenía la meseta al 62 % de la caja— el primer renglón, el de la compra, caía a **4.06:1** sobre una
foto clara. Ahora la meseta cubre el bloque de texto entero y el desvanecido vive en el padding de
arriba, que está vacío: medido sobre el render, el peor píxel queda en **8.37:1**.

### 2. Cómo se probó

Sin `theme dev` y sin UGC: se inyectó en la página viva el HTML que dibuja el Liquid, con el
`cauce-brand.css` local, a 390 y 1440 px. Las fotos de las tarjetas fueron **fotos del producto de
la tienda**, de relleno, y el texto de ejemplo: no se usó ninguna de las imágenes de hormify.com, ni
siquiera para maquetar. `theme check` da lo mismo que `main`.

---

## D-062 · 2026-09-19 · Sale el chip de "Transferencia bancaria" y los íconos de las pestañas toman el acento

**Dos cambios chicos pedidos por el comercio, sobre el bloque de compra.**

**1. El chip de transferencia sale de la tira de medios de pago.** La tira sale de
`settings.cauce_medios_pago`, que es un setting del tema, así que el cambio es de toda la tienda y
no solo de Hormify: la lista queda `mercadopago, visa, mastercard, amex, cabal, naranja`. Las marcas
tienen logo y la transferencia caía al chip tipográfico (`.cauce-pagos__chip`), que es lo único que
se leía como texto en una fila de logos y además empujaba la tira a dos renglones en teléfono.

No se pierde el dato: el beneficio por transferencia sigue en el precio de cada escalón
("$44.910 con transferencia"), en la tarjeta del carrito y en el checkout. Lo que sale es el sello,
no el medio de pago. Si algún día se quiere de vuelta, se agrega `transferencia` a esa lista desde
Configuración del tema → CAUCE → Pagos.

**2. Los íconos de las pestañas van en el acento.** Shrine los dibuja con `fill="currentColor"`
dentro del título, así que heredaban el color de texto y eran los únicos íconos de la página que no
estaban en el acento (D-060). La regla toma solo el ícono de la izquierda: la flecha de abrir y
cerrar se queda en el color de texto, porque es un control y no una viñeta. En Hormify el ícono
queda en MAGENTA sobre blanco, 3.55:1, que es lo que pide un objeto gráfico.

**Contexto.** En el mismo día, desde el editor, el comercio movió el bloque de UGC arriba del de
contraste, sacó la pestaña "Ingredientes" del bloque de compra —la que tenía la composición en
`[[PENDIENTE]]`— y apagó la barra de íconos.

---

## D-063 · 2026-09-19 · Los botones van en mayúscula, por CSS y no escritos así

**Decisión del comercio.** Todos los CTA del tema se dibujan en mayúscula: los de la PDP, los del
carrito y los de cualquier página que se arme después. Es un cambio de toda la tienda, no de la
plantilla de Hormify.

**Por CSS y no escribiendo el texto en mayúscula.** El contenido sigue guardado como se lee
("Agregar al carrito"), que es lo que anuncia un lector de pantalla —varios deletrean las palabras
todo en mayúscula— y lo que se ve en el theme editor. Escribirlo a mano además obliga a acordarse en
cada botón nuevo. La lista de selectores es la misma que usa `base.css` para el botón, así entran
todas sus variantes sin enumerarlas.

**Dos números que salieron de probarlo a 390 px:**

- El tracking quedó en **0.02em** y no en el 0.04em que usan la volanta y los sellos: con 0.04 la
  etiqueta del botón más largo ("Agregar 3 frascos · $72.900") se iba a dos renglones.
- Por lo mismo, el botón a todo el ancho afloja el aire lateral a 1.6rem en teléfono. Con los 3rem
  de cada lado que trae el tema quedaban 300 px útiles y la etiqueta no entraba.

**De paso.** Cuatro etiquetas estaban escritas en mayúscula desde el editor ("VER PRECIOS",
"COMPRAR AHORA", "QUIERO RECUPERAR MI EQUILIBRIO" y el "AGREGAR AL CARRITO" del cierre). Vuelven a
su forma normal: se ven igual, y así el dato queda limpio para quien lo lea o lo escuche. Coinciden
otra vez con COPY-DRAFT.

---

## D-064 · 2026-09-19 · La foto del contraste lleva regla fina, y el botón sobre la superficie vuelve al acento

Dos correcciones que salieron de mirar la PDP ya publicada.

**1. La foto de las tarjetas de contraste tenía borde invisible.** La tarjeta positiva es blanca y la
otra toma el fondo de la sección, así que un packshot sobre fondo blanco —los dos que hay cargados lo
son— se funde con la tarjeta y se lee como un hueco, no como una foto. La imagen suma una regla fina
(`--cauce-linea`, y la clara sobre TINTA): así tiene borde aunque la foto no lo traiga.

Es una corrección de construcción, no un reemplazo del arreglo de fondo, que es **cargar una foto
que no sea blanca**. La del lado "sin equilibrio" hoy es un frasco genérico blanco: dice poco de lo
que ese lado tiene que contar.

**2. El botón primario sobre la superficie volvió al acento.** `base.css` manda el botón al color de
texto en todos los esquemas que no son el blanco:

```
.color-accent-1, .color-accent-2, .color-background-2, .color-inverse {
  --color-button: var(--color-foreground);
  --color-button-text: var(--color-background);
}
```

En una banda de superficie eso dejaba el CTA en TINTA al lado de los botones de compra, que van en el
acento: el mismo botón cambiaba de color según en qué sección cayó. Se restituye el mapeo del esquema
blanco, solo para `background-2`. Los dos esquemas de acento quedan afuera —un botón del color del
fondo no se ve— y TINTA también: ahí el par correcto es el del token contextual, acento claro con
etiqueta oscura, y no este.

En la PDP toca tres bandas: el contraste, la marquesina y la suscripción. El carrito no usa ese
esquema. En Hormify el relleno es MAGENTA y arrastra lo de D-060: la etiqueta blanca da 3.55:1 y el
relleno contra RUBOR 2.93:1.

---
## D-065 · 2026-09-19 · La home pasa a vender Hormify, con las secciones de su PDP

**Decisión.** `templates/index.json` se reescribe entero: deja de vender el R-ALA y pasa a ser la
página de venta de Hormify, con trece secciones. La home ya no es una portada corta que empuja a
la ficha; hace casi todo el argumento, como la referencia.

D-054 §6 había dejado esto afuera —*"la home vende el único SKU (D-038); Hormify no aparece hasta
que se decida cómo conviven los dos productos"*—. La tienda lo resolvió sola: el 2026-09-19
`caucearg.com/collections/all` lista **un solo producto publicado**, Hormify, a $49.900. No hay dos
productos que hacer convivir.

### 1. Qué hay, en orden

| # | Sección | Tipo | Esquema | De dónde sale |
|---|---|---|---|---|
| 1 | `hero` | `cauce-hero` | blanco | nueva; el packshot y el subtítulo de la PDP |
| 2 | `marquee` | `horizontal-ticker` | superficie | copiada de la PDP |
| 3 | `contraste` | `cauce-contraste` | blanco | copiada (en la PDP va sobre superficie) |
| 4 | `solucion` | `cauce-solucion` | TINTA | copiada, + CTA |
| 5 | `ingredientes` | `cauce-ingredientes` | blanco | copiada |
| 6 | `progreso` | `cauce-progreso` | TINTA | copiada, **encendida** |
| 7 | `comparativa` | `cauce-comparativa` | superficie | copiada, sin fila de precio |
| 8 | `producto` | `featured-product` | blanco | la de la home vieja, con el SKU nuevo |
| 9 | `banda` | `icon-bar` | TINTA | copiada, **encendida** |
| 10 | `garantia` | `custom-columns` | superficie | copiada |
| 11 | `faq` | `cauce-faq` | blanco | cinco preguntas de las ocho |
| 12 | `cierre` | `custom-columns` | TINTA | copiada, sin el botón de carrito |
| 13 | `suscripcion` | `cauce-newsletter` | superficie | copiada |

Los esquemas alternan blanco → superficie → TINTA sin que dos iguales queden pegados.

**Las secciones se copiaron con sus settings, no se escribieron a mano.** Cada una arrastra el
objeto entero de `product.hormify.json`, y encima se pisan las claves que cambian. Así ninguna
queda con un setting fuera del schema de su sección, que es lo que `theme check` no mira.

**Nada de copy nuevo.** Cada línea de la home ya existía en la PDP o en `COPY-DRAFT.md` §10. No se
abre ningún claim que no esté en el inventario de `CLAIMS-AUDIT.md` §8.1.

### 2. Lo que la referencia hace y esta home tampoco

Vale igual que §8.2 de `CLAIMS-AUDIT.md`, y por los mismos motivos: sin reseñas, sin porcentajes de
un estudio que no existe, sin logos de prensa, sin quiz y sin regalos por pack. La home larga que
pidió el comercio se sostiene con composición, contraste, plazos y comparativa —lo que sí se puede
escribir—, no con prueba social inventada.

### 3. La paleta: la home también entra en `plantilla--hormify`

`layout/theme.liquid` derivaba la clase de `template.suffix`. La home no tiene sufijo, así que
quedaba en ÓXIDO mientras el producto —a un clic— se ve en MAGENTA. Ahora hay un paso intermedio:

```liquid
assign cauce_plantilla = template.suffix
if template.name == 'index'
  assign cauce_plantilla = 'hormify'
endif
```

Es a mano y a propósito: no es que la home "sea" la plantilla de Hormify, es que hoy vende ese SKU.
Si mañana vuelve a haber dos productos, se borran esas tres líneas y la home vuelve a ÓXIDO sola.

### 4. Los CTA siguen yendo a la ficha

D-038 no se reabre. Los seis botones de la home —hero, contraste, solución, ingredientes, producto y
cierre— llevan a `/products/hormify-favorece-un-equilibrio-hormonal-saludable`. El bloque `cierre`
de la PDP trae un `atc_button`: acá se reemplazó por un `buttons` con el mismo destino. En la home se
ve el precio y no se puede comprar sin haber pasado por la composición, las dosis y el plazo de
devolución.

**La fila de precio de la comparativa se apaga.** `cauce-comparativa` calcula el costo por día con
`product.selected_or_first_available_variant`, y fuera de una página de producto no hay variante que
leer: con `mostrar_precio` prendido la fila no se dibuja igual. Queda apagada para que el editor
diga lo mismo que la página. El `$1.663/día` contra "Según la marca" sigue solo en la PDP.

### 5. La FAQ toma el texto de COPY-DRAFT, no el de la PDP

Las cinco preguntas de la home salen de `COPY-DRAFT.md` §10.9. Tres respuestas de la PDP —menopausia,
embarazo y anticonceptivos— están escritas en **"usted"** y son bastante más largas que el borrador
aprobado; el resto de las dos páginas vosea. La home usa las del borrador. La PDP no se tocó en esta
rama, pero esas tres respuestas habría que emparejarlas.

`emitir_schema` queda apagado: el `FAQPage` lo emite la PDP y no conviene que dos URLs del mismo
sitio declaren el mismo bloque. `producto` queda vacío a propósito: si mañana se cargan los
metafields `cauce.faq`, la PDP los toma y la home sigue mostrando estas cinco.

### 6. Un hallazgo: en la PDP hay dos secciones apagadas que no debían estarlo

Copiar las secciones trajo el flag `"disabled": true` pegado, y por eso en la primera vuelta la home
salió con once de trece. Buscando por qué apareció esto: **en `product.hormify.json`, `progreso` y
`banda` están apagadas**, además de `resultados` y `resenas`, que sí lo están a propósito (§8.2).

Ninguna decisión dice que tengan que estarlo. Al contrario: D-054 §2 lista los plazos de resultado
como **activos**, y la banda de condiciones de compra es D-040. Se verificó contra el server de
`theme dev`: la PDP de Hormify hoy se sirve **sin** "Qué esperar, mes a mes" y **sin** "Comprar acá".
En la home las dos van encendidas. **La PDP no se tocó** —el flag lo escribe el editor de temas y no
se sabe si fue a propósito—, pero hay que mirarlo.

### 7. Cómo se verificó

- Cada setting y cada bloque de las trece secciones, validado contra el schema de su sección: **0
  claves fuera de schema, 0 opciones de `select` inválidas**.
- `theme check` sobre la rama y sobre una copia limpia de `HEAD`, con el mismo CLI 4.8.0 y sin
  `carpetalocal/`: **80 contra 80 offenses, 0 errores, ninguna nueva**.
- La página, con `theme dev` a 1440 px: las trece secciones dibujan, la paleta MAGENTA llega a la
  home, el packshot del hero entra, la banda de solución muestra su CTA nuevo y el cierre sobre
  TINTA queda legible. El marcador cuadrado de `progreso` es el de D-036, no un ícono que falta.
- **A 390 px no se miró.** La ventana del navegador automatizado no acepta el resize y el iframe de
  prueba lo bloquea el `X-Frame-Options` de Shopify. Las trece secciones son las mismas que ya se
  revisaron a 390 px en D-054, D-055 y D-057, pero el orden nuevo no se vio en un teléfono.

### 8. Lo que queda afuera

- **El umbral de envío gratis.** La barra de anuncio dice desde $55.000 (D-052) y el frasco sale
  $49.900: la unidad suelta queda a $5.100 del envío sin cargo y no hay escalones de pack cargados
  con precio real. Con un solo SKU el número hay que rehacerlo.
- **El producto está agotado.** `collections/all` lo marca así, y el bloque `producto` de la home
  muestra el precio igual.
- Todo lo de `CLAIMS-AUDIT.md` §8.3 sigue en pie: fórmula real, dosis, RNPA, COA, y el nombre en
  INPI.

---

## D-066 · 2026-09-27 · Hormify: fase 2 de la auditoría CRO — bloque de compra, promesa por ángulo, confianza y orden nuevo

**Decisión.** Se aplica en `templates/product.hormify.json` la fase 2 de la auditoría CRO del
2026-09-26 y la estructura de su fase 4, con el alcance que fijó el comercio:

- **Cambian:** barra de anuncio, above the fold, bloque de compra, acordeones, marquesina,
  garantía, cierre, newsletter y pie.
- **Se reordenan sin tocar el contenido:** contraste, solución, ingredientes, UGC y comparativa.
- **No se toca:** la FAQ.

El informe de la auditoría quedó en la conversación, no en el repo. Lo que importa de él para
entender esta entrada está acá y en `CLAIMS-AUDIT.md` §8.

El comercio confirmó cuatro datos el 2026-09-27, con las alternativas a la vista:

| Pregunta | Respuesta | Se descartó |
|---|---|---|
| Garantía | **30 días para devolverlo, con el frasco cerrado** | 30 días aunque esté abierto (la recomendada) · solo los 10 días legales |
| Cuotas | **3 cuotas sin interés**, plan activo en Mercado Pago | con interés · "todavía no sé" |
| WhatsApp | el +54 3406 46-1636 tiene WhatsApp; **lunes a viernes de 9 a 18 h** | — |
| Envío | **no hay código de seguimiento** | seguimiento con despacho en 24–48 h · seguimiento sin plazo |

### 1. Qué cambió, por zona

| Zona | Antes | Ahora |
|---|---|---|
| Barra de anuncio (global) | envío · transferencia · "Producción nacional. Análisis por laboratorio externo." | envío · **3 cuotas sin interés** · transferencia · **30 días para devolverlo** |
| Arriba del título | — | volanta `Suplemento dietario para mujeres · 60 cápsulas` |
| Bajada | un bloque `text` con peso, hinchazón y sofocos | `snippets/cauce-angulo.liquid`: tres variantes por ángulo (§3) |
| Íconos | cuatro efectos (peso, hinchazón, hormonas, estrés) | cuatro hechos: sin hormonas · 2 cápsulas, 30 días · B6, B5, B12 y zinc · 30 días para devolverlo |
| Selector | "La mayoría de las mujeres nota…" · cinta `RESULTADOS ÓPTIMOS` · 5–6 renglones por tarjeta | sin bajada · cinta `EL MÁS ELEGIDO` en el 2 y `MEJOR PRECIO POR DÍA` en el 3 · tarjeta compacta con `[precio_dia]` (§4) |
| Debajo del botón | medios de pago | `30 días para devolverlo` · `Envío a todo el país` · línea de WhatsApp · medios de pago |
| Acordeones | Beneficios · Para quién · Cuándo · Cómo se toma · Envíos · Cambios | **Ingredientes** (rótulo transcripto) · Cómo se toma · **¿Quién no debería tomarlo?** · Envíos · **Devoluciones: 30 días** |
| Barra fija | "Agregar al carrito" con precio | "Elegir mi pack", sin precio, lleva al selector (`scroll_#quantity-breaks-id`) |
| Marquesina | síntomas (peso, hinchazón, sofocos, estrés) | hechos: sin hormonas · cuotas · transferencia · devolución · envío · WhatsApp |
| Garantía | "Si te arrepentís, se devuelve" · 10 días | "Tenés 30 días para devolverlo" + botón a `#comprar` |
| Cierre | viñetas con claims · botón que agregaba al carrito sin decir qué | viñetas de hechos · botón "Elegir mi pack" a `#comprar` |
| Newsletter | — | aclara que el código no se suma al de transferencia |
| Pie | horario "06:00 a 00:00" | WhatsApp en la columna de contacto · "lunes a viernes de 9 a 18 h" |
| Sección nueva | — | `rutina` (`cauce-progreso`): "Una rutina, no un tratamiento" |

Salen del template tres acordeones (Beneficios, Para quién y Cuándo) y el bloque de bajada viejo.
No se apagaron: se borraron. El texto está en la historia de git.

**La pestaña "Ingredientes" arregla una referencia rota.** La sección `ingredientes` y la FAQ
remitían a "la pestaña Ingredientes", que no existía. Ahora existe y transcribe el rótulo completo:
nueve componentes con dosis y la mezcla de 15 plantas de 802 mg. Por decisión de esta misma
entrada, la sección `ingredientes` sigue diciendo "8 activos": la contradicción queda a la vista y
anotada en `CLAIMS-AUDIT.md` §8.3.

### 2. "Garantía" no: 30 días para devolverlo

Con el frasco cerrado, lo que se ofrece es **un plazo de devolución más largo que el legal**, no
una garantía de satisfacción: nadie puede evaluar un suplemento sin abrirlo. Por eso ninguna
superficie dice "garantía" ni "probalo". Dicen "30 días para devolverlo" y, donde hay lugar, "con
el frasco cerrado". La sección de garantía resolvió de paso la contradicción que tenía: decía
"sin condiciones escondidas" mientras el acordeón pedía "sin abrir". Ahora la condición está en el
título de uno de sus tres puntos.

Condiciones publicadas: 30 días corridos desde la recepción, frasco cerrado (en un pack se
devuelven los que no se abrieron y se reintegra lo pagado por ellos), envío de vuelta a cargo de
CAUCE y sin pedir motivo. Los primeros 10 días siguen siendo el arrepentimiento de la Res. SCI
424/2020, y la barra legal del pie los sigue citando así.

**La barra de anuncio es global, así que la promesa vale para toda la tienda**, no solo para
Hormify. Hoy hay un solo producto publicado (D-065) y no cambia nada, pero si vuelve el R-ALA, la
regla también es suya. Es una oferta que obliga (Ley 24.240, art. 7 y 8): tiene que estar escrita
en los Términos del servicio antes de la primera devolución.

### 3. La bajada por ángulo: una página y `?angulo=`

Cada anuncio entra con un gancho distinto, y la PDP tiene que repetirlo. Se descartaron **tres
templates alternos** porque cada cambio del bloque de compra habría que hacerlo tres veces, y el
editor de temas los desincroniza en una semana. Queda una sola página, y el anuncio elige la
variante por URL:

| URL | Variante |
|---|---|
| `/products/<handle>` | `identidad` — "Para cuando sentís que dejaste de ser vos" |
| `?angulo=energia` | `energia` — "¿Cansada todo el día, aunque duermas?" |
| `?angulo=transparencia` | `transparencia` — "Sin hormonas. Sin promesas mágicas. Con la etiqueta a la vista." |

Las tres van en el HTML y una sola sin `hidden`. El script inline del snippet corre cuando el
parser llega a él, antes del primer pintado, así que nadie ve la de defecto y después el cambio. Un
valor desconocido cae en la de defecto. El copy está en el bloque `custom_liquid` del template,
como parámetros del `render`, y no en el snippet (regla 1 de `CLAIMS-AUDIT.md`).

**Límite anotado.** Si Shrine re-renderiza el bloque de compra (pasa al cambiar de variante), el
script no vuelve a correr y queda la de defecto. Hormify tiene una sola variante, así que hoy no
pasa. **Para medir por ángulo**, los anuncios tienen que llevar además sus `utm_content`: el
parámetro `angulo` elige el texto, pero no aparece en los reportes de Shopify.

### 4. El selector compacto y `[precio_dia]`

Dos settings nuevos en el bloque `quantity_selector`, los dos apagados por defecto, así que la
landing del R-ALA no cambia:

- **`cauce_compacto`.** La tarjeta muestra días, precio por día, total, tachado y un solo chip (el
  de envío gratis). "Ahorrás $X" sale, porque lo dice el tachado. Transferencia y cuotas bajan a un
  renglón debajo de las tarjetas (`snippets/cauce-escalones-pie.liquid`), calculado con las mismas
  condiciones que las líneas que reemplaza. El caption sube a 2 rem, por encima del total, porque el
  precio por día es lo que se compara entre tarjetas.
- **`[precio_dia]`**, un token nuevo en badge, label, benefit y caption. Es el total del escalón
  ya descontado dividido por los días que cubre, redondeado al peso, con el mismo redondeo que la
  fila de precio de `cauce-comparativa`. Los días salen de los metafields
  `cauce.unidades_envase / cauce.dosis_diaria` si están cargados, y si no del setting
  `cauce_dias_frasco` (30). Con los precios de hoy da $1.663, $1.032 y $810.

Se resuelve en el servidor, dentro de cada escalón, antes de escribir `data-text`: es el mismo
motivo por el que `[duracion]` se resuelve arriba del archivo (el JS del tema re-renderiza desde
`data-text`). Tiene el mismo límite que las líneas de extras: con `update_prices` activado y
variantes de distinto precio no se recalcularía. Hoy `update_prices` está en `false`.

**"Sin interés".** `settings.cauce_cuotas` siempre significó cuotas sin interés: así se llama en el
editor y así lo pide su texto de ayuda. Lo que faltaba era decirlo. `cauce.pdp.cuotas` y
`cauce.pdp.cuotas_escalon` ahora dicen "sin interés", en la PDP y en el carrito. Si el plan de
Mercado Pago se da de baja, `cauce_cuotas` vuelve a 0 y todas las superficies se apagan juntas.

### 5. WhatsApp

`settings.cauce_whatsapp` es nuevo, en Configuración del tema → CAUCE, y está cargado como
`5493406461636`: un celular argentino en `wa.me` lleva 549 y la característica sin el 15. Un solo
snippet (`cauce-whatsapp`) lo dibuja de tres formas: botón flotante en todas las páginas, línea
debajo del botón de compra y renglón del pie. Si el setting está vacío, no se dibuja ninguna de las
tres.

- El verde es **#168A41**, no el #25D366 de WhatsApp: el blanco sobre el de la marca daba 1,98:1 y
  el botón contra RUBOR 1,63:1. Con #168A41 son 4,42:1 y 3,65:1.
- El flotante va **apilado sobre el botón de volver arriba** de Shrine, que ya ocupa la esquina
  inferior derecha. No se lo movió.
- Cuando aparece la barra fija de compra, el flotante sube lo que la barra tapa. `main.js` está
  ofuscado y no expone el estado de la barra, así que `cauce.js` la mide directamente: remide en
  `transitionend` y ante cualquier cambio de atributo de la barra.

### 6. "El más elegido" vuelve, a pedido

La cinta del escalón 2 dice `EL MÁS ELEGIDO` porque lo pidió el comercio el 2026-09-27. Es la
misma afirmación que D-047b agregó y D-051 sacó: habla de la conducta de otras compradoras, y
todavía no hay ventas que la respalden (Res. SC 270/2020, Ley 24.240 art. 8). Vuelve a figurar
como bloqueante en `CLAIMS-AUDIT.md` §8.3. Cuando haya pedidos, se confirma contra ellos o se saca.

### 7. El orden nuevo

`main` → `marquee` → **`contraste`** → `solucion` → `ingredientes` → `ugc` → *(resenas, resultados:
apagadas)* → **`rutina`** → *(progreso: apagada)* → `comparativa` → `garantia` → *(banda: apagada)*
→ `faq` → `cierre` → `suscripcion`.

El cambio de fondo es `contraste`: pasa del sexto lugar al primero después del bloque de compra.
El tráfico frío de Meta llega consciente del problema, y la página le vendía la solución antes de
que reconociera el problema como suyo. Después viene cómo funciona (`solucion`), qué tiene
(`ingredientes`), quiénes lo toman (`ugc`), cómo se usa (`rutina`) y contra qué se compara
(`comparativa`); los 30 días para devolverlo van justo antes de la FAQ.

### 8. Lo que no se pudo hacer desde el tema

- **El título.** El bloque `title` imprime `product.title`, así que para que diga solo "Hormify"
  había que cambiar el nombre en el admin (lo ven también el carrito, el checkout y los mails).
  **Hecho por el comercio antes del merge:** `/products.json` ya lo da como "Hormify". El handle
  sigue siendo `hormify-favorece-un-equilibrio-hormonal-saludable`, y así tiene que quedar: si se
  cambia, se rompen los links de los anuncios.
- **El menú "Ayuda" del pie** es la navegación `footer` del admin y hoy solo tiene "Buscar".
  Faltan Envíos, Devoluciones, Preguntas frecuentes y Términos, y las políticas correspondientes en
  Configuración → Políticas.
- **Datos que faltan:** la ciudad del domicilio (`cauce_domicilio`) y, como el CUIT es de persona
  física, el nombre del titular en `cauce_razon_social`.
- **"Quién está detrás"**, la sección nueva de la fase 4, necesita una persona real y fotos. No se
  armó una vacía.

### 9. Cómo se verificó

- Cada setting y cada bloque de `product.hormify.json`, `header-group.json` y `footer-group.json`,
  validado contra el schema de su sección: **0 claves fuera de schema, 0 valores de `range` o
  `select` inválidos**.
- `theme check` sobre la rama y sobre una copia limpia de `main`, con el mismo CLI 4.8.0 y sin
  `carpetalocal/`, comparando offenses distintas (archivo + check + mensaje): **62 contra 63, 0
  errores**. Hay dos warnings nuevos:
  `OrphanedSnippet` en `cauce-angulo` (lo llama el JSON del template, y theme check no lo ve) y
  la complejidad de `quantity-breaks.liquid`, que ya pasaba el límite (175) y sube a 188.
- **En la tienda viva, después del push** (`e03aca9`), leyendo el HTML de
  `/products/hormify-favorece-un-equilibrio-hormonal-saludable` y no solo el CSS: un archivo que
  Shopify rechaza no da ningún error desde el repo, simplemente queda viejo en la tienda.
  - Los captions calculados dicen **$1.663, $1.032 y $810 por día**, y el renglón de abajo dice
    *"10 % menos pagando por transferencia · 3 cuotas sin interés de $24.300 en el pack de 3"*.
  - Adentro de las tarjetas quedaron solo los dos chips de envío: 0 líneas de ahorro y 0 de
    transferencia.
  - Las tres variantes de la bajada están en el HTML, con `energia` y `transparencia` en `hidden`.
  - Las cintas, los acordeones nuevos, `rutina`, la garantía, "Elegir mi pack" (tres veces:
    garantía, cierre y barra fija) y el horario del pie aparecen.
  - Lo que salió no aparece: `RESULTADOS ÓPTIMOS`, "La mayoría de las mujeres", "Beneficios de
    Hormify" y "Producción nacional. Análisis…".
  - El link de WhatsApp sale como `wa.me/5493406461636?text=Hola%2C%20tengo%20una%20consulta%20sobre%20Hormify.`
  - El orden de secciones coincide con §7.
  - `cauce-brand.css` y `cauce.js` servidos traen las reglas y la función nuevas.
  - La barra de anuncio nueva también se ve en la home.
- El nombre del producto ya es "Hormify": el comercio lo cambió en el admin antes del merge (§8).
- **Sin mirar con los ojos.** `theme dev` pidió login interactivo y no se completó, así que la
  página no se vio renderizada ni a 1440 ni a 390 px. Lo verificado es el HTML y los assets
  servidos, no cómo se ven.

---

## D-067 · 2026-09-27 · El menú "Ayuda": tres políticas y una página de preguntas de compra

**Decisión.** Los cuatro ítems nuevos del menú "Ayuda" del pie (D-066 §8) no son cuatro páginas.
Envíos, Devoluciones y Términos enlazan a **políticas de Shopify** (`/policies/shipping-policy`,
`/policies/refund-policy` y `/policies/terms-of-service`), que se escriben en Configuración →
Políticas. Solo "Preguntas frecuentes" es una página, y su contenido vive en el tema:
`templates/page.faq.json` pasa de la demo de Shrine (en inglés, filas vacías) a `cauce-faq` con
once preguntas de compra.

**Alternativa descartada:** crear páginas "Envíos", "Devoluciones" y "Términos" con el texto
adentro. Duplicarían las políticas y el checkout no las enlaza. Una política con texto, en cambio,
Shopify la muestra sola en el pie del checkout, y el pie del tema la lista en su renglón de abajo
(`show_policy`).

Los textos de las tres políticas están en `docs/POLITICAS.md`, con qué sostiene cada dato y dos
`[[PENDIENTE]]` en los Términos (el titular del CUIT y el domicilio completo). Ahí queda también el
orden de carga: primero las políticas, porque la página de preguntas enlaza a la de reembolso;
después la página, con la plantilla `faq`; y al final el menú.

Las preguntas son de compra y ninguna es de salud. Lo que tiene el producto se contesta
enlazando a la PDP, por la misma regla que el comentario de `sections/cauce-faq.liquid`.

**Datos del titular.** El comercio pasó los datos el 2026-09-27: Matias Haspert, CUIT
20-44526051-8, Vera Mujica 431, Rosario (2000), Santa Fe. Quedaron en los Términos y en
`cauce_razon_social` / `cauce_domicilio`, que publica la barra legal del pie. En el mismo mensaje
confirmó dos criterios de los textos: que el plazo de entrega corre desde que se acredita el pago y
que una devolución dentro de los 10 días de arrepentimiento reintegra también el envío. "Un solo
código por pedido" salió de los Términos: no se verificó, y TRANSFERENCIA10 sí se combina con los
descuentos automáticos de los packs.

**Cómo se cargó.** Todo desde el admin, en el navegador y con la sesión del comercio:

- Las tres políticas, en Configuración → Políticas (`/settings/legal`). El editor tiene un modo HTML
  que es un CodeMirror y no un textarea, así que `form_input` no le escribe: se pegó con un
  `ClipboardEvent('paste')` sobre `.cm-content` y se volvió a la vista normal para guardar.
- La página "Preguntas frecuentes": visible, con la plantilla `faq`, y el handle quedó
  `preguntas-frecuentes`. Se creó **después** del push de la plantilla (`7e62116`), para que nunca
  se sirviera la demo en inglés.
- El menú `footer` ya tenía los cuatro ítems, cargados por el comercio, pero los cuatro apuntaban a
  `/pages/arrepentimiento`. Se reapuntaron a las tres políticas y a la página. "Buscar" quedó como
  estaba: sacarlo era una sugerencia y no se confirmó.

**Cómo se verificó.** `page.faq.json` validado contra el schema de `cauce-faq` (0 claves fuera de
schema). Antes de cargar nada, en la tienda `/pages/preguntas-frecuentes` y las tres políticas
daban 404; solo existían `/pages/contact`, `/pages/arrepentimiento` y `/policies/privacy-policy`.
Después, leyendo el HTML público:

- Las tres políticas responden 200 con su texto: "Tenés 30 días para devolverlo", "Matias
  Haspert", "TRANSFERENCIA10" y "no tienen código de seguimiento".
- La página de preguntas sale con `cauce-faq`, las once preguntas y su `FAQPage`.
- En el pie, el menú "Ayuda" enlaza a `/policies/shipping-policy`, `/policies/refund-policy`,
  `/pages/preguntas-frecuentes` y `/policies/terms-of-service`, y el renglón de abajo lista las
  cuatro políticas.
- La barra legal muestra "Matias Haspert" y "Vera Mujica 431, Rosario (2000), Santa Fe".

---

## D-068 · 2026-09-27 · Hormify: una sola PDP para todos los dolores — bloque de dolores y mecanismo

**Decisión.** La PDP unifica los dolores de los tres sub-avatares en el cuerpo, no en el titular.
Son tres cambios en `templates/product.hormify.json`, pedidos por el comercio:

1. **`contraste` sale y en su lugar entra `dolor`** (`cauce-dolor`, la sección del R-ALA de D-033).
   Es una sola lista, sin nombrar etapas (ni SOP ni menopausia), con cinco situaciones que tocan
   a los tres sub-avatares: cansancio al levantarse, el jean que aprieta a la tarde,
   irritabilidad, despertarse de madrugada y menos ganas. Cierra con la causa común ("tus hormonas
   cambian… se nota en todo") y un botón "Quiero probarlo" a `#comprar`. Va sobre RUBOR, sin
   imagen, a 920 px.
2. **`solucion` pasa a ser el mecanismo** ("Nutrientes que tu cuerpo ya usa, todos los días"). La
   bajada da las dosis de B6, B5, B12 y zinc, y los cuatro beneficios dicen la función de cada
   uno en pocas palabras. La mezcla de 15 plantas y la leyenda de suplemento van al pie. La foto de
   fondo, la disposición y los colores no cambian.
3. **La variante `identidad` de la bajada** suma "te levantás cansada", así que el paraguas cubre
   también el ángulo de energía para quien llega sin `?angulo=`.

**Por qué en el cuerpo y no en el titular.** Un titular que junta todos los dolores es lo que
hacía la bajada vieja ("¿Peso que no baja, hinchazón, sofocos o cambios de humor?"): le habla a
todas y no le habla a ninguna, y un producto que resuelve seis cosas se lee como "cura todo". El
titular sigue al anuncio (D-066 §3). El cuerpo hace el argumento único: una causa, muchas
situaciones, una rutina. El mecanismo es lo que vuelve creíble la lista; sin él, la lista es un
catálogo de promesas.

El ángulo `transparencia` no es un dolor sino la respuesta a la desconfianza. Lo cubren la pestaña
Ingredientes, el rótulo y los 30 días para devolverlo, así que no necesita un bloque propio.

**Alternativa descartada:** reescribir `contraste`. Su columna derecha está hecha para resultados
("Con Hormify: tu peso vuelve a responder"), que es justo lo que no se puede escribir. Y dos
secciones de problema seguidas se pisan.

**Claims.** El texto nuevo no atribuye efectos al producto:

- La lista de `dolor` describe situaciones (H20 en `CLAIMS-AUDIT.md`). El riesgo es la
  yuxtaposición con el producto, igual que en D-033.
- Las funciones del mecanismo son las de H15: nutrientes en cantidad significativa, con la
  redacción de las declaraciones autorizadas. Las etiquetas son la versión corta ("Vitamina B6:
  actividad hormonal") y la bajada las presenta como "cada una contribuye a una función normal de
  tu cuerpo".
- Con esto salen de la PDP H1–H6 en `contraste` y `solucion`. **La home no se tocó** y sigue con
  su propio `contraste` y su `solucion` viejos (D-065).

`contraste` se borró del template, no se apagó: el texto está en la historia de git. Antes de
editar se integró `8639f5d`, un commit del editor de temas. Además de reordenar las claves del
JSON, el comercio había cambiado el margen inferior del título de 9 a 0, y ese valor se conservó.

**Cómo se verificó.**

- `product.hormify.json` validado contra los schemas de sus secciones: 0 claves fuera de schema, 0
  valores inválidos.
- `cauce-dolor` dibuja el pie y el botón sin imagen (`posicion_imagen: sin`), según su markup.
- `boton_link` es de tipo `url` en `cauce-dolor` y en `cauce-contraste`, y el de `contraste` ya
  aceptaba `#comprar` en la tienda.
- **En la tienda viva, después del push** (`cf21aac`), leyendo el HTML de la PDP:
  - `dolor` va tercera, después de la marquesina, con las cinco situaciones y el botón a
    `#comprar`.
  - `solucion` muestra el mecanismo, los cuatro beneficios nuevos y el pie con las 15 plantas.
  - La variante `identidad` dice "te levantás cansada".
  - Ya no aparecen "Tu peso vuelve a responder", "Menos peso hormonal", "Cómo te ves y cómo te
    sentís" ni "combatí el peso hormonal".
- **No se miró renderizada**, ni a 1440 ni a 390 px: es el mismo límite de D-066 §9.

---

## D-069 · 2026-09-28 · Precios nuevos de Hormify y envío gratis en todas las compras

**Decisión.** El comercio cambió la oferta el 2026-09-28:

| Pack | Antes | Ahora | Descuento del escalón | Por día | Con transferencia (10 %) |
|---|---|---|---|---|---|
| 1 frasco | $49.900 | **$52.900** | — | $1.763 | $47.610 |
| 2 frascos | $61.900 | **$64.900** | $40.900 (era $37.900) | $1.082 | $58.410 |
| 3 frascos | $72.900 | **$77.500** | $81.200 (era $76.800) | $861 | $69.750 |

Y el envío pasa a ser **gratis en todas las compras**, incluido el frasco suelto. El umbral de
$55.000 (D-052) desaparece. El comercio lo eligió el 2026-09-28 frente a dejarlo solo para los
packs de 2 y 3: con el frasco a $52.900 y el umbral en $55.000, el carrito le habría dicho a quien
compra uno "Te faltan $2.100 para el envío gratis", el mismo caso que descartó el umbral de $50.000.

La planilla del comercio trae además el CPA y el ROAS de equilibrio de cada pack. Son datos
internos para las campañas y no van a ninguna superficie.

### 1. Qué cambió en el tema

- **`product.hormify.json`, bloque `ofertas`:** `option_2_fixed_amount_off` 37900 → **40900** y
  `option_3_fixed_amount_off` 76800 → **81200**. Son `2 × 52.900 − 64.900` y
  `3 × 52.900 − 77.500`. Total, tachado, precio por día, CTA y cuotas salen de ahí y del precio
  de la variante: no hay otro número de precio escrito a mano en la PDP.
- **`cauce_umbral_envio_gratis`: 55000 → 1.** Con 1 el chip "Envío gratis" sale en las tres
  tarjetas, la barra del carrito dice siempre "Tenés el envío gratis" y el empujón de "sumá uno
  más" no aparece nunca. Se descartó dejarlo vacío: apaga el chip, que es la marca de envío pegada
  al botón de compra. El texto de ayuda del setting ahora explica las dos cosas.
- **Textos escritos a mano:**

  | Dónde | Antes | Ahora |
  |---|---|---|
  | Barra de anuncio (global) | Envío gratis en compras desde $55.000 | Envío gratis a todo el país |
  | Nota del bloque de compra | Los packs de 2 y 3 frascos van con envío sin cargo. | El envío es gratis en todas las compras. |
  | Línea bajo el botón, marquesina, íconos de confianza (PDP y home), cierre (PDP y home), reaseguro del carrito | Envío a todo el país | Envío **gratis** a todo el país |
  | Acordeón de envíos | …el costo se calcula en el checkout según tu código postal. / Sin cargo desde $55.000. | 3 a 10 días hábiles. / Gratis en todas las compras. |
  | Íconos de confianza, bajada (PDP y home) | El costo se calcula en el checkout según tu código postal. | Sin costo en todas las compras. |
  | FAQ de compra (`page.faq.json`) | ¿Cuándo el envío es gratis? — desde $55.000 | ¿Cuánto cuesta el envío? — Nada, sin monto mínimo |

  "El costo se calcula según tu código postal" tenía que salir aunque nadie lo pidiera: con envío
  gratis para todos, pasó a ser falso.
- **`docs/POLITICAS.md`**, sección de envío: el texto nuevo de "Costo" para pegar en el admin.

**No se tocó `product.cauce-landing.json`** (la landing del R-ALA): el producto no está publicado
(D-065). Sus descuentos y su acordeón de envíos siguen con los números viejos. Si vuelve, hay que
revisarla entera.

### 2. Lo que no se ve desde el repo, y lo carga el comercio

El comercio eligió cargarlo él. Todo esto tiene que estar **el mismo día del merge**, porque el
tema ya promete los precios y el envío gratis:

1. **Precio de la variante** de Hormify: $49.900 → **$52.900**. Sin eso, el tema calcula todo
   sobre $49.900 y los packs se ven a $58.900 y $68.500.
2. **Descuentos automáticos de R6** (`CLAIMS-AUDIT.md`): cantidad 2 → **−$40.900** y cantidad 3 →
   **−$81.200**, con la combinación con descuentos de pedido activada (para `TRANSFERENCIA10`).
3. **Tarifa de envío:** $0 para todo el país, sin mínimo, en Configuración → Envíos. Sacar la
   tarifa paga y la condición de $55.000.
4. **Política de envío** (Configuración → Políticas, `/settings/legal`): reemplazar el párrafo de
   "Costo" por el de `docs/POLITICAS.md`. La publicada todavía dice "sin cargo desde $55.000".

**Estado al merge (2026-09-28).** El comercio cargó el precio, los montos de los descuentos y la
política de envío. Desde el navegador se hicieron la tarifa y la reactivación:

- **Los dos descuentos automáticos estaban vencidos desde el 17/9 a las 16:03.** Shopify los
  desactivó porque "se eliminaron productos, variantes o colecciones" a los que se aplicaban, y les
  puso esa fecha de fin. Durante once días el checkout cobró los packs a precio lleno aunque la PDP
  mostrara el descuento. Se les sacó la fecha de fin y quedaron activos. Producto (Hormify), monto
  fijo, una vez por pedido, mínimo de unidades y la combinación con descuentos de pedido se
  revisaron y estaban bien. **Si se vuelve a borrar o recrear el producto, revisar que sigan
  activos**: el estado no se ve desde el tema.
- **Tarifa:** "Envío sin cargo" pasó a $0 sin mínimo, sin la condición de envío gratis desde
  $55.000, y se eliminó "Envío a domicilio" ($5.000 hasta $54.999,99). La zona Argentina queda con
  una sola opción.

### 3. Las cuotas quedan con centavos

$77.500 no se divide en tres: el renglón bajo las tarjetas va a decir **3 cuotas sin interés de
$25.833,33**. Es el monto exacto y así se deja: redondearlo hacia abajo prometería una cuota que
Mercado Pago no cobra. `MEJOR PRECIO POR DÍA` (H17) sigue siendo verdadera: $861 contra $1.082 y
$1.763.

---

## D-070 · 2026-10-03 · Vuelve el R-ALA: la home y la paleta dejan de vender Hormify

**Decisión.** El comercio volvió a cargar el Ácido R-Alfa Lipoico para retestearlo y Hormify dejó de
estar publicado: el 2026-10-03 `caucearg.com/products.json` lista un solo producto, el R-ALA, a
$49.900, y la URL de Hormify da 404. La tienda vuelve a venderlo, con dos criterios que fijó el
comercio ese día:

| Pregunta | Respuesta | Se descartó |
|---|---|---|
| Envío | **gratis en todas las compras** (D-069 sigue en pie) | volver al umbral de $55.000 del diseño original |
| Lo global de la etapa Hormify | **se queda**: 30 días para devolverlo, cuotas sin interés en la barra, WhatsApp, página de preguntas, botones en mayúscula | revertir todo al estado del 17/9 |

O sea: no es un revert a `95ea859`. Vuelve lo que era de Hormify y se queda lo que es de la tienda.

### 1. Qué cambió

- **`templates/index.json`** vuelve a la home de D-038, tal como estaba en `e970ad3^`: hero,
  pilares, producto, banda, FAQ y manifiesto. Tres ajustes encima:
  - **El handle.** El producto recargado es
    `acido-r-alfa-lipoico-de-maxima-potencia-apoyo-para-el-azucar-en-sangre`; el anterior
    (`…-capsulas-de-600-mg-en-forma-r-pura`) da 404 y no redirige. Se cambió en los cuatro lugares:
    los tres botones y el `product` de `featured-product`.
  - La banda dice "Envío gratis a todo el país", con el texto de D-069.
  - La pregunta de devolución de la FAQ toma el texto de `page.faq.json` (30 días).
- **`layout/theme.liquid`** pierde las tres líneas que forzaban `plantilla--hormify` en la home
  (D-065 §3). La home vuelve a ÓXIDO. La clase por sufijo sigue: `product.hormify.json` no se tocó
  y, si el producto vuelve, toma su paleta sola.
- **`templates/product.cauce-landing.json`**, lo que D-069 había dejado pendiente ("si vuelve, hay
  que revisarla entera"). Los precios no cambian: $49.900 / $61.900 / $72.900
  (`fixed_amount_off` 37.900 y 76.800).

  | Dónde | Antes | Ahora |
  |---|---|---|
  | Escalón 1, caption | + envío | *(vacío)* |
  | Nota del bloque de compra | Los packs de 2 y 3 frascos van con envío sin cargo. | El envío es gratis en todas las compras. |
  | Acordeón de envíos | …el costo se calcula en el checkout según tu código postal. Envío sin cargo en compras desde $55.000. | …3 a 10 días hábiles sujetos a la disponibilidad de stock. / El envío es gratis en todas las compras. |
  | Acordeón de devoluciones | Cambios y devoluciones · 10 días | Devoluciones: 30 días, con el texto de Hormify |
  | Banda y marquesina | Envío a todo el país · 10 días de arrepentimiento | Envío gratis a todo el país · 30 días para devolverlo |
  | Garantía | Si te arrepentís, se devuelve · 10 días corridos | Tenés 30 días para devolverlo, con los tres puntos de D-066 §2 |
  | Cierre | envío a todo el país · 10 días para arrepentirte, sin costo | envío gratis a todo el país · 30 días para devolverlo, con el frasco cerrado |

  Todo el texto nuevo ya estaba aprobado en la PDP de Hormify o en `page.faq.json`: no se abre
  ningún claim. "10 días para arrepentirte" de la banda queda, igual que en la home: es el derecho
  legal y sigue siendo cierto.
- **El ancla rota de D-054 §5.** El botón de `resultados` ("Ver la fórmula y el precio") apuntaba a
  `#shopify-section-main`, que no existe. Ahora hay un bloque `ancla_comprar` antes de `ofertas` y
  el botón va a `#comprar`.
- **`templates/page.faq.json`:** la pregunta "¿Dónde veo qué tiene Hormify…?" enlazaba a una URL
  que da 404. Ahora nombra al R-ALA y enlaza a su ficha, sin citar pestañas que esa ficha no tiene.

### 2. Lo que no se tocó

- `product.hormify.json`, sus secciones y el bloque 20 de `cauce-brand.css` siguen en el repo.
- Los bloques apagados de la landing (`faq`, `fichas`, `comparativa`…) quedan con su texto viejo.
  El `faq` apagado todavía dice "el costo se calcula según tu código postal" y "10 días": hay que
  corregirlo antes de prenderlo.
- Lo que el §6 de `CLAIMS-AUDIT.md` tiene abierto sobre la landing ("1574+ reseñas", la encuesta,
  los testimonios) sigue abierto.

### 3. Lo que no se ve desde el repo, y lo revisa el comercio

- **Los descuentos automáticos de los packs.** Estaban atados a Hormify, que ya no existe, y el
  R-ALA recargado tiene un ID nuevo (`15403123048660`). Es el mismo caso de D-069 §2: Shopify los
  desactiva solo y la PDP sigue mostrando el precio de pack. Tienen que quedar sobre el producto
  nuevo: cantidad 2 → **−$37.900**, cantidad 3 → **−$76.800**, una vez por pedido, activos, sin
  fecha de fin y combinables con descuentos de pedido (`TRANSFERENCIA10`).
- La plantilla ya está asignada: la ficha viva sale con `plantilla--cauce-landing`.
- **Los metafields `cauce.*`.** No se verificó si el producto recargado los tiene. Los bloques que
  los leen (`datos`, `fichas`) están apagados en la landing.

---

## D-071 · 2026-10-03 · R-ALA: baja el precio, el frasco suelto muestra el anterior tachado y la cinta pasa al pack de 2

**Decisión.** Oferta nueva para el retesteo, pedida por el comercio:

| Pack | Antes | Ahora | Tachado | Ahorro | Por frasco | Con transferencia (10 %) |
|---|---|---|---|---|---|---|
| 1 frasco | $49.900 | **$45.900** | $49.900 | $4.000 | $45.900 | $41.310 |
| 2 frascos | $61.900 | **$56.900** | $99.800 | $42.900 | $28.450 | $51.210 |
| 3 frascos | $72.900 | **$67.900** | $149.700 | $81.800 | $22.633,33 | $61.110 |

### 1. El precio anterior es el precio de comparación de Shopify, no un texto

El tachado del frasco suelto no se escribe en el tema. El bloque `ofertas` ya lo dibuja solo cuando
la variante tiene un precio de comparación mayor que el precio (`option_N_compare_price:
compare_price`, que es como estaba). Así que la rebaja se carga en el admin: **precio $45.900,
precio de comparación $49.900**. La home, el carrito, el checkout y el feed toman el mismo número.

**Alternativa descartada:** dejar la variante en $49.900 y ponerle `fixed_amount_off` 4.000 al
escalón 1. El tachado saldría igual, pero haría falta un descuento automático también para un
frasco, y la home y el carrito seguirían mostrando $49.900 hasta el checkout.

Los packs se calculan desde el precio nuevo: `option_2_fixed_amount_off` 37.900 → **34.900**
(`2 × 45.900 − 56.900`) y `option_3_fixed_amount_off` 76.800 → **69.800** (`3 × 45.900 − 67.900`).
El tachado de los packs sigue saliendo del precio de comparación: 2 × y 3 × $49.900. Por eso la
nota del bloque cambia: decía "lo que costarían esos frascos comprados de a uno", que con el
frasco a $45.900 ya no es cierto, y ahora dice "el precio anterior de esa misma cantidad de
frascos".

### 2. La cinta

| | Antes | Ahora |
|---|---|---|
| Escalón 2 | — | **`EL MÁS ELEGIDO · 43 % OFF`** |
| Escalón 3 | `LA TOMA COMPLETA · 90 DÍAS` | — |

La cinta junta la prueba social con la magnitud del descuento, que es el único dato de la tarjeta
que no estaba dicho: el ahorro ya figura en pesos, el porcentaje no. 43 % es $42.900 sobre $99.800
(42,99 %). **Es un número escrito a mano** y "el más elegido" es la afirmación de D-047b: los dos
quedan anotados en `CLAIMS-AUDIT.md` §6.

No se movieron ni el preseleccionado ni el fondo destacado: siguen en el escalón 3 (D-051), que es
el de ticket más alto. Es la misma combinación que tuvo Hormify desde D-066: cinta de popularidad
en el 2, destaque en el 3. El fondo es una regla de CSS (`[for='quantity3']`) compartida con la
plantilla de Hormify.

### 3. Centavos

$67.900 no se divide en tres: el pack de 3 dice **$22.633,33 por frasco** y **3 cuotas sin interés
de $22.633,33**. Es el mismo criterio de D-069 §3: el monto exacto, sin redondear.

### 4. Lo que no se ve desde el repo, y lo carga el comercio

1. **Variante:** precio $45.900 y precio de comparación $49.900.
2. **Descuentos automáticos** sobre el producto nuevo: cantidad 2 → **−$34.900**, cantidad 3 →
   **−$69.800**, una vez por pedido, sin fecha de fin y combinables con `TRANSFERENCIA10`.

El tema y el admin tienen que cambiar juntos. Con el tema nuevo y el precio viejo, los packs se ven
a $64.900 y $79.900; con el precio nuevo y el tema viejo, a $53.900 y $60.900.

---

## D-072 · 2026-10-03 · R-ALA: el preseleccionado y el fondo destacado pasan al pack de 2

**Decisión.** A pedido del comercio, el pack de 2 queda como el centro de la oferta: además de la
cinta (D-071) lleva el fondo destacado y entra elegido. D-071 §2 había dejado las dos cosas en el
escalón 3.

| | Antes | Ahora |
|---|---|---|
| Preseleccionado | escalón 3 | **escalón 2** |
| Fondo destacado | escalón 3, fijo por CSS | **escalón 2**, por setting |
| CTA al cargar | `Agregar 3 frascos · $67.900` | `Agregar 2 frascos · $56.900` |
| Cuotas | escalón 3 | escalón 3 (no se pidió moverlas) |

**El destaque deja de estar atado a CSS.** D-051 lo había fijado con `[for='quantity3']` y había
anotado el límite: "moverlo es editar esa regla, no un setting". Esa regla la comparte la plantilla
de Hormify, que tiene que seguir destacando el 3. Ahora hay un select en el bloque,
**`cauce_destacado`** (default `option_3`), y `snippets/quantity-breaks.liquid` le pone la clase
`quantity-break--cauce-destacado` a esa tarjeta. `cauce-brand.css` pinta la clase. Sigue siendo
fijo en el sentido de D-051: no viaja con la selección.

`product.hormify.json` no carga el setting y toma el default, así que no cambia.
`featured-product` no lo tiene en su schema: el snippet cae en `option_3`, que es lo que hacía la
regla vieja.

---

## D-073 · 2026-10-03 · R-ALA: las cuotas van en los tres packs y sale la línea "Ahorrás $X"

**Decisión.** A pedido del comercio: las 3 cuotas sin interés se anuncian en las tres tarjetas, no
solo en una, y la línea de ahorro en pesos sale porque cada tarjeta ya cargaba demasiado.

| Tarjeta | Antes | Ahora |
|---|---|---|
| 1 frasco | Ahorrás $4.000 · envío · transferencia | envío · transferencia · **3 cuotas de $15.300** |
| 2 frascos | por frasco · Ahorrás $42.900 · envío · transferencia | por frasco · envío · transferencia · **3 cuotas de $18.966,67** |
| 3 frascos | por frasco · Ahorrás $81.800 · envío · transferencia · cuotas | por frasco · envío · transferencia · 3 cuotas de $22.633,33 |

Son dos settings del bloque `ofertas`, así que Hormify no cambia:

- **`cauce_cuotas_escalon` suma el valor `todos`.** D-051 lo había hecho de un solo escalón porque
  dónde anunciar financiación es decisión comercial; ahora la decisión es "en los tres". En modo
  compacto `todos` no dibuja cuotas: el renglón de abajo anuncia las de un solo escalón.
- **`cauce_sin_ahorro`** (checkbox, apagado por defecto) saca la línea `Ahorrás $X` de
  `snippets/cauce-escalon-extras.liquid`. El tachado sigue, y la cinta del 2 sigue diciendo 43 %.

**Las cuotas del pack de 2 quedan con centavos.** $56.900 no se divide en tres: la tarjeta dice
$18.966,67, verificado en la tienda viva. Es el mismo caso de D-069 §3 y del pack de 3
($22.633,33).

**Del editor de temas.** Antes de este cambio se integraron `d19a151` y `d3c589f`: el comercio vació
la bajada del bloque (la de los ensayos clínicos, que era un bloqueante del §6 de
`CLAIMS-AUDIT.md`) y la nota del precio tachado.

---

## D-074 · 2026-10-06 · Aditivo dental para perros: PDP propia, verde y en DM Sans, sobre una rama sin publicar

**Decisión.** Producto nuevo a testear: un aditivo líquido para el agua del bebedero. La página
toma la secuencia de bloques de la PDP de una marca colombiana que vende lo mismo (estructura,
orden y ritmo; ningún texto, imagen, nombre ni número de ellos) y la arma con el sistema de CAUCE.
Vive en `templates/product.aditivo-dental.json`, en la rama `feature/aditivo-dental`, conectada
como tema en borrador (`188903424212`). `main` no se tocó.

### 1. Qué se reutilizó y qué es nuevo

| Bloque | Pieza |
|---|---|
| Banda en movimiento | `horizontal-ticker` |
| Bloque de compra | `main-product` con el selector de packs de siempre (`quantity_selector`) |
| Pestañas del bloque de compra | **`snippets/cauce-pestanas.liquid`**, sobre el `<cauce-tabs>` que ya existía |
| Problema · rutina · pasos · beneficios | **`sections/cauce-media-lista.liquid`**, una sección con cuatro formas de lista |
| Respaldo (registro y fórmula) | **`sections/cauce-respaldo.liquid`** |
| Ingredientes | **`sections/cauce-fichas.liquid`**, carrusel de scroll-snap |
| Garantía | `custom-columns` |
| Preguntas | `cauce-faq` |
| Pie | el del tema, sin cambios |

Las fotos todavía no existen. Donde falta una, `snippets/cauce-foto-pendiente.liquid` dibuja un
recuadro del tamaño de la foto final con el pedido de producción escrito adentro.

**Alternativa descartada:** armar los cuatro bloques de foto y lista con `cauce-dolor`,
`cauce-progreso`, `cauce-etapas` y `cauce-solucion`. Ninguna tiene la disposición de la referencia
(foto de un lado, lista del otro, con el título de cualquiera de los dos lados) y las cuatro están
escritas para un suplemento: sus advertencias de claims citan a ANMAT, y este producto lo regula
SENASA.

### 2. La paleta y la tipografía son de la plantilla, no del tema

Bloque 26 de `cauce-brand.css`, con el mismo mecanismo que Hormify (D-054): la clase
`plantilla--aditivo-dental` en `<html>` pisa los tokens. VERDE BOSQUE `#0F3D24`, VERDE HOJA
`#2E7D4F`, VERDE CLARO `#DDF0E2`, fondo `#F6F8F4`, texto `#14201A` y botón NARANJA `#E8590C`.

- **El acento y el botón se separan.** En CAUCE y en Hormify son el mismo color. Acá el acento de
  marca (`--cauce-acento`) es VERDE HOJA y el botón sale de `--color-base-accent-1`, que pasa a
  NARANJA.
- **Blanco sobre NARANJA da 3,58:1.** No llega a AA para texto chico. Queda solo en la etiqueta del
  botón, que va en negrita y mayúscula. Es el color pedido por el comercio.
- **DM Sans se carga solo en esta plantilla** (`layout/theme.liquid`).
- **El encabezado pasa a VERDE BOSQUE por CSS**, y el logo —un PNG de un solo color— se lleva a
  blanco con un filtro. No se subió otro archivo ni se tocó `header-group.json`.
- **La barra de anuncios del tema no se muestra en esta plantilla.** Uno de sus cuatro mensajes
  ("30 días para devolverlo") no es la garantía de este producto, y la página lleva su propia banda.

### 3. Lo que cambió fuera de la plantilla

Todo es opt-in o está condicionado al sufijo: las otras páginas no cambian.

- **`cauce_redondear`** (checkbox del bloque `quantity_selector`, apagado por defecto). Muestra el
  precio por unidad y la cuota redondeados al peso: $71.900 / 3 = **$23.967**, no $23.966,66. Es lo
  contrario del criterio de D-069 §3 y D-073 (monto exacto, con centavos), y por eso es un setting
  y no un cambio de criterio: el R-ALA sigue como estaba.
- **`cauce_cta_fijo`** (ídem). El botón no se reescribe con "Agregar N frascos · $total": queda
  "Agregar al carrito". El texto de `cauce.pdp.cta_agregar` dice "frascos" y este producto es una
  botella.
- **`sections/cauce-legal-bar.liquid`** no dibuja la leyenda de suplemento dietario en esta
  plantilla. Diría algo falso del producto.
- **`assets/cauce.js`** envuelve cada `[COMPLETAR: …]` de la página con `.cauce-pendiente`. En esta
  plantilla esa clase es un resaltador amarillo.

### 4. La oferta

| Pack | Precio | Por unidad | Tachado | Ahorro | Transferencia | 3 cuotas |
|---|---|---|---|---|---|---|
| 1 botella | $49.900 | — | — | — | $44.910 | $16.633 |
| 2 botellas | $59.900 | $29.950 | $99.800 | $39.900 | $53.910 | $19.967 |
| 3 botellas | $71.900 | $23.967 | $149.700 | $77.800 | $64.710 | $23.967 |

`option_2_fixed_amount_off` 39.900 y `option_3_fixed_amount_off` 77.800. El pack de 2 entra
elegido y lleva el fondo destacado. Sin cinta: "el más elegido" no se puede sostener en un producto
que todavía no vendió, y el porcentaje de descuento se pidió afuera.

### 5. Claims

El marco es el de SENASA para productos veterinarios, no el de ANMAT. La página dice que ayuda a
mantener el aliento fresco y a reducir la placa que después se vuelve sarro, que se usa sin
cepillado y con una tapita en el agua. No dice que elimina el sarro, no da plazos ni porcentajes,
no nombra enfermedades y no cita veterinarios. El registro se enuncia como "Registrado en SENASA,
certificado N.º …". La función de cada ingrediente (bloque de ingredientes) la escribió el tema y
**la tiene que confirmar el laboratorio** antes de publicar.

### 6. Lo que queda pendiente

- **Datos sin cargar**, marcados `[COMPLETAR: …]` en la página: nombre del producto, certificado de
  SENASA, elaborador, edad mínima y contacto.
- **Fotos.** Once: cinco de la galería (hoy son imágenes de marcador cargadas en el producto) y
  seis en las secciones.
- **Descuentos automáticos: creados y activos**, con la misma forma que los del R-ALA (solo este
  producto, una vez por pedido, combinables con descuentos de pedido): `Aditivo dental 2 unidades`,
  cantidad mínima 2 → **−$39.900**, y `Aditivo dental 3 unidades`, cantidad mínima 3 →
  **−$77.800**. Si el producto se borra y se vuelve a cargar, Shopify los desactiva (D-069 §2).
- **Plantilla del producto.** El admin solo ofrece las plantillas del tema publicado, así que el
  producto (`aditivo-dental-perros`, en borrador) no la tiene asignada. Se asigna después de
  mergear.
- **El carrito no se probó.** Un producto en borrador no se puede agregar: falta comprobar, con el
  producto activo, que cada pack cobra $49.900, $59.900 y $71.900 y lo que muestra el checkout.

### 7. Dos cosas que conviene saber para la próxima plantilla

- **Shopify rechaza un `templates/*.json` entero, sin avisar, si un `range` lleva un valor fuera de
  paso.** Pasó con cuatro paddings del `horizontal-ticker` (10 y 14 con `step` 4): las secciones y
  los assets subieron y la plantilla no. `theme check` no lo marca. Es el mismo silencio de D-058.
- **El editor de temas sí muestra productos en borrador y tiene vista de celular.** Es la única
  forma de ver un producto en borrador con una plantilla de un tema sin publicar: el enlace de
  vista previa del producto ignora `preview_theme_id`.

---

## D-075 · 2026-10-06 · Aditivo dental: el bloque de reseñas se arma, y no se puede llenar con relleno

**Decisión.** D-074 había dejado afuera el bloque de reseñas porque no hay ninguna real. A pedido
del comercio se arma igual, como `sections/cauce-resenas.liquid`, último bloque de
`product.aditivo-dental.json`: un resumen (promedio, cantidad y barras por puntaje) y una grilla de
tarjetas con foto, estrellas, nombre, título y texto. Sigue sin haber reseñas: la sección queda
lista y vacía.

### 1. De dónde salen las reseñas

La tienda no tiene una app de reseñas y no se instaló ninguna. Cada reseña es un bloque de la
sección, cargado a mano desde el editor cuando un cliente la manda y autoriza a publicarla. El tope
de Shopify es de 50 bloques por sección.

**Alternativa descartada por ahora:** una app (Judge.me, Shopify Product Reviews). Pide el mail al
comprador y verifica la compra sola, que es lo correcto cuando haya volumen; hoy es instalar y
configurar una app para un producto que todavía no vendió. Cuando se instale, esta sección se apaga
y va el bloque de la app.

### 2. Lo que la sección no deja hacer

- **El promedio, la cantidad y las barras se calculan** de las reseñas cargadas. No hay un campo
  para escribirlos.
- **Una reseña cuenta solo si está completa:** texto, nombre y puntaje, sin `[COMPLETAR`. El puntaje
  arranca en "sin puntaje" y no en 5: un bloque recién agregado no suma cinco estrellas.
- **Una reseña incompleta se dibuja solo en el editor de temas** (`request.design_mode`). En la
  tienda no sale, y sin ninguna completa la sección entera no se dibuja. Es la regla de D-074 ("si
  no hay reseñas, el bloque no va") cumplida por el código y no por acordarse de apagar la sección.
- **"Compra verificada" es una casilla por reseña**, apagada por defecto.
- **No emite `AggregateRating`.** Google no lo toma para reseñas que el comercio carga sobre su
  propio producto.

Las tres tarjetas que trae la plantilla son huecos (`[COMPLETAR: reseña real…]`), para ver el
bloque maquetado en el editor.

### 3. La estrella es un color nuevo

`--cauce-estrella`. Vale el acento de la marca salvo que la plantilla lo pise; en el aditivo dental
es ámbar `#C77700`, elegido para pasar 3:1 como objeto gráfico sobre la tarjeta blanca (3,46) y
sobre el fondo de página (3,24). El ámbar habitual de las estrellas, `#F2A900`, da 2,01.

### 4. Lo que sigue pendiente

- **Las reseñas.** Reales, con permiso, y sin fotos de antes y después. El texto de una reseña
  también es un claim: una que diga que el producto curó algo no se publica tal cual.
- **La línea de estrellas del bloque de compra** ("4,7 · N reseñas") no se armó. `main-product` no
  ve los bloques de otra sección, así que habría que escribir el número a mano, que es justo lo que
  esta decisión evita.
- **Con reseñas reales no se vio en el tema.** La lógica se probó renderizando la sección con datos
  de prueba fuera de Shopify (promedio, barras, "ver más", pendientes); en el tema solo se vio el
  estado vacío.

---

## D-076 · 2026-10-06 · Aditivo dental: se llama Hocico Fresh, y la página deja de nombrar a SENASA

**Decisión.** El comercio completó los datos que D-074 había dejado como `[COMPLETAR]` y
`[A CONFIRMAR]`. La página queda sin huecos, salvo las tarjetas del bloque de reseñas (D-075), que
se ven solo en el editor.

| Dato | Antes | Ahora | De dónde sale |
|---|---|---|---|
| Nombre | `[COMPLETAR: nombre propio]` | **Hocico Fresh** | Lo eligió el comercio entre cuatro propuestas |
| Registro | "Registrado en SENASA, certificado N.º `[COMPLETAR]`" en tres lugares | No se nombra | No hay certificado |
| Elaborador | `[COMPLETAR: establecimiento, razón social, CUIT]` | No se nombra | El comercio eligió no dejar el hueco |
| Edad | "Edad mínima: `[COMPLETAR]`" | Cachorros, adultos y perros mayores | La página de la referencia |
| Uso diario | "Está pensado para usarse todos los días…" + registro | "Sí. Está formulado para usarse todos los días, en la dosis indicada" | La página de la referencia |
| Sabor, olor, color | "Sin sabor, sin olor y sin color" | "Sin sabor, sin olor y no cambia el color del agua" | Sabor: confirmado por el comercio. Olor y color: como la referencia |
| Entrega | 3 a 5 días hábiles | **3 a 10 días hábiles** | Confirmado por el comercio |
| Cuotas y transferencia | A confirmar | 3 cuotas sin interés · 10 % por transferencia | Confirmado por el comercio |
| Contacto | `[COMPLETAR: WhatsApp o mail]` | WhatsApp o cauce@caucearg.com | El de la tienda. La referencia no muestra ninguno |

### 1. Sin certificado, la página no dice que está registrado

Salió de los tres lugares donde estaba: el bloque de respaldo, la pestaña "Ingredientes" y la
pregunta 6. El generador de la plantilla ahora falla si el texto contiene "SENASA".

El bloque de respaldo se había armado alrededor del registro (D-074 §1), en el lugar donde la
referencia pone a un veterinario. Sin registro pasa a ser una ficha del producto: presentación,
dosis, cuánto rinde y para quién, con "qué lleva" y "qué no lleva" al lado. Se llama "La fórmula, a
la vista".

**Lo que esta decisión no resuelve.** El producto sigue siendo un producto veterinario (Res.
SENASA 1642/2019) y la publicidad de uno sin registrar está prohibida (art. 36 b). Sacar el número
de la página evita afirmar algo falso; no cambia esa situación. Pautar sin registro es una decisión
del comercio, anotada como abierta en su investigación (sección 5).

### 2. El color

El líquido es verde, como el de la referencia. "Sin color" al lado de la foto de una botella verde
se contradice, así que la página dice lo que importa para quien compra: **no cambia el color del
agua**. "Color" salió de la lista "qué no lleva". Olor y color quedan a confirmar con la muestra:
el comercio confirmó solo el sabor.

### 3. Lo que sale de la página de la referencia, y hay que confirmar con el laboratorio

La edad ("cachorros, adultos y perros mayores") y que es para uso diario son afirmaciones de otra
marca sobre otra fórmula. Se usaron a pedido del comercio, reescritas. Cuando haya laboratorio y
fórmula propia, son los dos primeros datos a confirmar, junto con los tres ingredientes, "sin
xilitol", el olor y el color.

### 4. Hocico Fresh

Es el más parecido a la referencia de los cuatro propuestos (una palabra chica y "Fresh" grande),
que es lo que el comercio busca para rehacer los anuncios con su envase. No se revisó el registro
de marcas del INPI: una búsqueda web no encontró otro producto para perros con ese nombre, y eso no
alcanza para darlo por libre.

---

## D-077 · 2026-10-06 · Aditivo dental: la pestaña "Ingredientes clave" pasa a ser una tabla comparativa

**Decisión.** La pestaña del medio de la columna de compra deja de ser dos renglones de texto y pasa
a ser una tabla como la de la referencia: una fila por ingrediente (foto redonda, nombre y una
línea con lo que hace), la columna de Hocico Fresh pintada con la tilde y la columna "Otros" con la
cruz. La pestaña se llama "Ingredientes clave". El carrusel de fichas de más abajo no cambia.

### 1. Cómo está hecha

| | |
|---|---|
| Filas | Bloques nuevos de `main-product`, tipo **`cauce_ingrediente_clave`**: nombre, texto, foto, alt, pedido de foto y una casilla por columna. No dibujan nada en su lugar de la columna |
| Tabla | **`snippets/cauce-ingredientes-clave.liquid`** recorre `section.blocks`, junta esos bloques y arma una `<table>` real, con "Sí" / "No" oculto en cada ícono |
| Pestaña | El bloque `custom_liquid` de las pestañas captura la tabla y se la pasa a `cauce-pestanas` como `contenido_2` |
| Estilos | `cauce-brand.css`, bloque 26, a continuación de las pestañas. Ningún hex: cabecera `--cauce-cauce`, banda `--cauce-sedimento`, tilde `--cauce-exito`, cruz `--cauce-error` |
| Editor | `<cauce-tabs>` escucha `shopify:block:select`: al elegir una fila en el editor se abre su pestaña |

**Por qué bloques de `main-product` y no parámetros de texto, como las otras dos pestañas.** Cada
fila lleva una foto, y un `custom_liquid` no tiene selector de imágenes. Con bloques, las filas se
agregan, se sacan y se reordenan desde el editor. **Alternativa descartada:** un metaobjeto por
ingrediente colgado del producto; saca el copy de `templates/*.json`, que es donde vive todo el
resto.

**Dos formas, y la angosta es la de base.** Desde 990 px la foto, el nombre y el texto van en fila.
Por debajo, el texto baja y ocupa todo el ancho de la celda: a 320 px, al lado de la foto le
quedaban 88 px y cada fila medía 224 a 280 px. Queda en 149 a 185 px. No es un corte de teléfono:
entre 750 y 989 px la columna de compra es más angosta que en un teléfono.

### 2. Las seis filas, y lo que se cambió de la referencia

El comercio pidió las seis filas de la referencia. Tres son ingredientes de la fórmula (té verde,
cloruro de cetilpiridinio, gluconato de zinc) y llevan el copy de las fichas. Las otras tres son
rótulos de la referencia que no se podían pasar tal cual:

| Referencia | Queda | Por qué |
|---|---|---|
| Complejo de ingredientes naturales | Tres ingredientes, una fórmula | El cetilpiridinio no es de origen natural |
| Agentes antibacterianos, "hasta por 12 horas" | Acción sobre las bacterias | D-074 §5: sin plazos |
| Sin colorantes ni químicos, "100 % natural" | Sin xilitol, sin sabor ni olor | El líquido es verde y lleva cetilpiridinio. La fila dice lo que la página ya afirma en otros bloques |

Ninguna dice "elimina". Los títulos de estas tres filas son del tema, no del comercio: se cambian
desde el editor.

### 3. La cruz en "Otros" es decisión del comercio

Las seis filas llevan cruz en "Otros", como en la referencia. Es publicidad comparativa, y en las
filas de ingredientes afirma que ningún otro aditivo lleva té verde, cetilpiridinio o zinc: la
propia referencia los lleva. Se le planteó al comercio con dos alternativas (cruz solo donde se
sostiene, o sin columna "Otros") y eligió dejarla. Cada fila tiene su casilla, así que se puede
corregir por fila sin tocar código.

### 4. Lo que queda pendiente

- **Las seis fotos.** Sin foto la fila dibuja un círculo punteado. Las tres de ingredientes son las
  mismas que pide el carrusel de fichas: se cargan una vez en Archivos y se eligen en los dos
  lugares.
- **Con foto no se vio, y en un teléfono tampoco.** Se verificó en un tema de desarrollo con el
  producto real, en escritorio. La forma angosta se midió ahí mismo, achicando la caja a 294 y
  360 px con el corte de 990 px anulado: el editor del admin no terminó de cargar.
- **El texto de las filas** lo tiene que confirmar el laboratorio, igual que el de las fichas
  (D-074 §5).

---

## D-078 · 2026-10-06 · Aditivo dental: "Qué esperar" pasa a "Beneficios del producto", con el texto de la referencia

**Decisión.** La tercera pestaña de la columna de compra deja de ser "Qué esperar" y pasa a ser
"Beneficios del producto", con el armado de la referencia: un título y seis renglones separados por
una línea, sin viñetas. Arriba de la caja de pestañas va un título, "Conocé más sobre Hocico
Fresh:".

- `snippets/cauce-pestanas.liquid` acepta un parámetro `titulo`, opcional.
- La lista es HTML en `contenido_3`, como las otras pestañas de texto: `.cauce-beneficios__titulo`
  y `.cauce-beneficios`, en el bloque 26 de `cauce-brand.css`.

### 1. El texto es el de la referencia, por decisión del comercio

D-074 dice que la página no toma "ningún texto, imagen, nombre ni número" de la referencia y que no
da plazos, no dice "elimina" y no nombra enfermedades. Esta pestaña es la excepción: el comercio
pidió que fuera idéntica a la captura y, con dos alternativas reescritas a la vista, eligió el
texto tal cual, cambiando solo el nombre del producto.

| Renglón | Qué contradice |
|---|---|
| "Dientes más limpios en 30 días o menos" | D-074 §5, sin plazos. La pestaña que reemplaza decía "no hay un plazo garantizado" |
| "Elimina placa y controla las bacterias que causan enfermedades orales" | D-074 §5: "ayuda a reducir", y sin enfermedades |
| "Refresca el aliento hasta por 12 horas" | D-074 §5, sin plazos |
| "100% ingredientes naturales. Seguro para perros adultos…" | La pestaña de al lado lista cloruro de cetilpiridinio. El resto de la página dice cachorros, adultos y mayores (D-076) |
| "Previene enfermedades que pueden afectar corazón, pulmón e hígado" | Es una indicación terapéutica en un producto veterinario sin registro (D-076 §1) |

El título de adentro y los renglones están en tuteo ("temes", "añade"); el resto de la página, en
voseo.

### 2. Lo que salió con "Qué esperar"

Tres cosas que la pestaña decía y ya no están en la columna de compra: que no hay un plazo
garantizado, que el sarro ya formado lo saca el veterinario (sigue en el bloque del problema) y la
garantía de 30 días (sigue en las fichas de abajo del botón y en su bloque).

---

## D-079 · 2026-10-07 · Aditivo dental: la rutina pasa a ser la línea de tiempo de la referencia, con su texto

**Decisión.** El bloque `rutina` (`cauce-media-lista`, forma "línea de tiempo") toma el armado y el
texto de la referencia: cinco hitos en vez de tres, el del medio destacado, cada texto como una
viñeta y el recuadro final colgado de la misma línea. El título pasa a "Lo que pasa dentro de tu
mascota *en los primeros 60 días*". La foto es la que ya había cargado el comercio.

### 1. Lo que cambió en la sección

Todo es de la forma `linea`; las otras tres formas no cambian.

| | |
|---|---|
| Hito destacado | Casilla nueva por item, **"Destacar este item"**: pastilla y marcador en `--cauce-destacado` y una estrella pegada al título |
| Línea | Ya no es continua: son tramos, con un hueco arriba y abajo de cada marcador. El marcador va centrado en la pastilla |
| Recuadro final | Se corre lo mismo que los hitos y lleva un ícono (`infinito`, nuevo en `cauce-iconos`) centrado sobre la línea. El último tramo baja hasta casi tocarlo |
| Texto del hito | Si es una lista, la viñeta queda al filo de la pastilla y es llena (un `<ul>` adentro de un `<ol>` sale hueca por defecto) |
| Título | El cierre en acento va en cursiva, solo en esta plantilla |

Cinco variables atan las medidas (`--cauce-linea-x`, `-sangria`, `-centro`, `-paso`, `-corte`), en
el bloque de la forma 2 de `cauce-brand.css`.

**El título del hito no baja de renglón entero.** Con `flex-wrap`, a 345 px "Resultados visibles"
caía debajo de la pastilla y la estrella quedaba sola en un tercer renglón. Ahora el título se
parte al lado de la pastilla y la estrella va pegada a la última palabra (`&#8288;`).

### 2. DORADO

Color nuevo, solo en esta plantilla: `--cauce-destacado: #D9A514`. Da 5,45 sobre VERDE BOSQUE
(marcador y estrella) y 5,45 con el texto VERDE BOSQUE encima (pastilla). **No es igual a la
referencia:** allá la pastilla lleva el texto amarillo claro sobre mostaza, que acá daría menos de
3:1. Fuera de esta plantilla el token cae en el acento.

El fondo tampoco es el de la referencia (casi negro): es el VERDE BOSQUE de los demás bloques
oscuros de la página.

### 3. El texto es el de la referencia

Palabra por palabra, por decisión del comercio, con tres erratas corregidas ("aliento-", "visibles
encías", "dias") y "Botella terminada" en lugar de "Frasco terminado". Igual que en D-078, va
contra D-074 §5:

| Hito | Qué contradice |
|---|---|
| "Semana 2 · Resultados visibles", "Día 30 · Dientes más limpios" | Plazos de resultado |
| "Mejoras visibles en encías y placa" | Efecto sobre las encías: no estaba en ningún otro bloque |
| "Reducción significativa de placa y sarro" | El bloque del problema dice que el sarro ya formado lo saca el veterinario |
| "continuar el tratamiento", "se interrumpe el tratamiento" | "Tratamiento" es vocabulario terapéutico; la página decía "rutina" |

El recuadro está en tuteo ("Agrega"); el resto de la página, en voseo.

### 4. Lo que no se vio

En un teléfono. Se verificó en un tema de desarrollo con el producto real, en escritorio, y la
columna de la lista achicada a 290 y 345 px.

---

## D-080 · 2026-10-13 · Aditivo dental: bloque "Una boca más sana, mes a mes", como en la referencia

**Decisión.** Sección nueva, `sections/cauce-meses.liquid`, entre `beneficios` y `garantia`: un
título, una pestaña por mes y una fila de fotos, una por mes. El mes elegido lleva la foto cuadrada
y, debajo, su título y su texto; los demás muestran la foto en 4:3 y nada más. Se armó midiendo la
captura de la referencia.

**Alternativa descartada:** `cauce-tabs`. Ahí el panel que no está elegido desaparece, y acá las
tres fotos se ven siempre.

### 1. Lo que salió de la captura

| | Referencia | Acá |
|---|---|---|
| Pestañas | 3 de 233 px sobre un bloque de 1168: 20 % cada una | 20 % del bloque cada una |
| Etiqueta de la pestaña | DM Sans 16 px negrita, 16 px de sangría | Igual |
| Subrayado | El mes elegido, línea llana y tenue; los demás, guiones del color del texto | Igual. Es al revés de lo habitual |
| Fotos | 16 px adentro del título, 16 px entre sí, radio 12 px | Igual |
| Foto elegida / las demás | 1:1 / 4:3, mismo ancho | Igual |
| Título del mes | 17 px negrita, 8 px debajo de la foto | Igual |
| Texto del mes | 14 px, interlínea 18,5 px | Igual |

### 2. Lo que no es igual

- **El título va en negrita**, como todos los de esta página (D-074 §2). En la referencia es de
  peso medio.
- **La paleta es la de la plantilla**: fondo `#F6F8F4` y VERDE BOSQUE, no el `#F6F7FF` y el
  `#002C0B` de la captura.
- **El bloque mide 1100 px útiles y no 1168.** Es el ancho de las demás secciones de la página
  (`page_width` 1200). En una pantalla de 1888 px cada foto mide 345 px en vez de 368, y el texto
  del mes 1 corta un renglón antes.

### 3. Lo que la captura no muestra, y se decidió acá

- **Cómo se cambia de mes.** Con la pestaña o tocando la foto. No avanza solo: el comercio
  confirmó que en la referencia tampoco.
- **El teléfono.** Debajo de 750 px es un carrusel de scroll-snap, como el de las fichas: cada mes
  es una tarjeta completa (foto cuadrada y texto), la siguiente asoma, y las pestañas marcan cuál
  se está viendo. Tocar una pestaña desplaza la fila.
- **Nada salta al cambiar de mes.** Cada foto vive en un casillero cuadrado fijo y pasa de 75 % a
  100 % de alto ahí adentro; el texto de los otros meses se apaga con `opacity` y sigue ocupando su
  lugar. La sección mide siempre lo que mide el texto más largo.

Las pestañas son `<button aria-pressed>` y no `role="tab"`: en teléfono los tres textos están a la
vista a la vez. Sin JS no se dibujan y quedan las tres tarjetas abiertas. El comportamiento es
`<cauce-meses>`, en `assets/cauce.js`; los estilos, el bloque 28 de `cauce-brand.css`.

### 4. El espaciado

`meses` lleva 8 px arriba y 72 abajo. Con los 72 que `beneficios` ya tenía abajo quedan 80 px entre
las dos, lo mismo que entre las otras secciones vecinas del mismo fondo (`respaldo` e
`ingredientes`, `pasos` y `beneficios`, 40 + 40). Así ninguna sección ya publicada cambia. Si el
bloque se mueve de lugar, ese 8 hay que revisarlo.

### 5. El texto

El del mes 1 es el de la captura, palabra por palabra. "Aliento fresco desde el día 1" es un plazo
de resultado (D-074 §5), como los de D-078 y D-079, y además no coincide con dos lugares de la
misma página: la línea de tiempo pone las primeras mejoras del aliento en "Días 3 – 7", y la
pregunta 3 (que el comercio reescribió el mismo día desde el editor) habla de "las primeras dos
semanas".

### 6. Lo que queda pendiente

- **La sección entra apagada** (`"disabled": true` en la plantilla), por decisión del comercio: se
  prende desde el editor del tema cuando estén los textos y las fotos. Hasta entonces la página
  publicada no cambia.
- **El texto de los meses 2 y 3+.** La captura muestra solo el mes 1. Están como `[COMPLETAR: …]`
  y los carga el comercio desde el editor.
- **Las tres fotos.** Cuadradas, con lo importante en el centro: sin elegir se ven en 4:3 y pierden
  una franja arriba y otra abajo.
- **Con fotos cargadas no se vio en Shopify.** Se verificó en un tema de desarrollo con el producto
  real, a 1888 px y con un teléfono de 390 px emulado, con los recuadros de foto pendiente. Con
  fotos se vio solo en una maqueta local (la sección renderizada fuera de Shopify con el CSS y el JS
  del tema). En un teléfono de verdad no se vio.

---

## D-081 · 2026-10-16 · Migración a Horizon: sale Shrine entero y quedan solo las piezas de CAUCE

**Decisión.** El tema deja de ser Shrine Pro y pasa a ser **Horizon 4.1.4** (el tema gratuito de
Shopify), en el repo `Cauce-Theme`, rama `feature/migracion-horizon`. Se migra todo lo propio que
usa el testeo de Hocico Fresh: la PDP del aditivo, el carrito CAUCE completo, el pie con la barra
legal, las páginas de preguntas, arrepentimiento y contacto, el WhatsApp y los ajustes de CAUCE. **No
se migran** las plantillas del R-ALA (`product.cauce-landing`) ni de Hormify (`product.hormify`):
esos productos no están validados. Tampoco hay home durante el testeo.

**Por qué.** Tres razones, y cualquiera alcanzaba:

1. **La licencia.** `layout/theme.liquid` de Shrine escondía todo el `<main>` si el token de
   `settings.animations_type` no validaba (AUDIT-SHRINE §5.1). Sin licencia para la tienda, la PDP
   no se ve.
2. **Código de terceros que no se puede auditar.** Shrine cargaba en todas las páginas
   `https://shopify.jsdeliver.cloud/js/config.js`, un dominio que no es de Shopify ni de jsDelivr,
   y su lógica vivía en `assets/main.js`, ofuscado. Un script remoto que nadie controla corriendo en
   la tienda es un riesgo, no solo un problema de licencia. En Horizon no queda nada de eso.
3. **Todo lo que se hizo para CAUCE ya era propio**: secciones `cauce-*`, snippets, CSS y JS. Lo
   que dependía de Shrine (el selector de packs, la barra fija, el carrito) se reescribió.

**Alternativa descartada:** comprar la licencia de Shrine y seguir. Resuelve la razón 1 y no la 2.

### 1. Qué se copió, qué se reescribió y qué salió

| Pieza | En Shrine | En Horizon |
|---|---|---|
| Foto y lista, respaldo, fichas, mes a mes, preguntas, reseñas, legales, suscripción | `sections/cauce-*` | las mismas, con los ajustes de §2 |
| Selector de packs + botón | `quantity_selector` + `buy_buttons` de `main-product` (código de Shrine con agregados CAUCE) | **`blocks/cauce-comprar.liquid`**, propio |
| Pestañas del bloque de compra | snippet llamado desde un `custom_liquid`; las filas, bloques sueltos de `main-product` | **`blocks/cauce-pestanas.liquid`** con las filas como bloques hijos (`_cauce-ingrediente-clave`) |
| Barra fija "Elegir mi pack" | `sticky_atc` de Shrine | **`blocks/cauce-barra-compra.liquid`** + `<cauce-barra-compra>` |
| Banda en movimiento | `horizontal-ticker` | **`sections/cauce-banda.liquid`**, que además respeta `prefers-reduced-motion` |
| Garantía | `custom-columns` | **`sections/cauce-garantia.liquid`** |
| Pie | `footer` de Shrine con tres bloques agregados | **`sections/cauce-pie.liquid`** + `cauce-legal-bar` |
| Carrito (drawer y `/cart`) | `cart-drawer` y `main-cart-*` de Shrine con los snippets `cauce-carrito-*` | **`snippets/cauce-carrito.liquid`**, compartido, adentro de los componentes de Horizon (§4) |
| Arrepentimiento y contacto | `rich-text`, `contact-form` y `custom-liquid` de Shrine | **`sections/cauce-texto.liquid`** y **`sections/cauce-formulario.liquid`** |
| Home | la del R-ALA | **`sections/cauce-redireccion.liquid`**: la raíz va a la ficha de Hocico Fresh (§6) |
| Íconos de Shrine (`icon-caret`, `material-icon`, `icon-error`…) | snippets de Shrine | íconos nuevos en `cauce-iconos`: `caret`, `info`, `pago`, `persona`, `instagram`, `facebook`, `tiktok` |

**Salieron, porque solo las usaban el R-ALA, Hormify o la home:** `cauce-hero`, `cauce-dolor`,
`cauce-solucion`, `cauce-etapas`, `cauce-progreso`, `cauce-resultados`, `cauce-ugc`,
`cauce-comparativa`, `cauce-contraste`, `cauce-ingredientes`, `cauce-datos`, `cauce-tabs`,
`cauce-acordeon-detalle`, los snippets `cauce-angulo`, `cauce-comparativa-marca`,
`cauce-escalones-pie` y `cauce-suscripcion`, `<cauce-ugc>` y `<cauce-hero>` de `cauce.js`, y los
bloques 9 a 15, 18 a 20, 22, 23 y 25 de `cauce-brand.css`. Siguen en el historial del repo de
Shrine: si se valida alguno de esos productos, se portan con el mismo método. `cauce-acordeon` ya
estaba huérfano en Shrine.

**Tampoco se migraron:** `page.track-order` (era el contenido de demo de Shrine, en inglés, y la
FAQ dice que los envíos no tienen seguimiento) ni `product.testeo` (una copia de la plantilla de
demo).

### 2. Lo que cambió para que las piezas CAUCE funcionen en Horizon

- **1rem pasó de 10 px a 16 px.** Shrine fijaba `html { font-size: 62.5% }`; Horizon no. Todos los
  `rem` de `cauce-brand.css` y de los Liquid se multiplicaron por 0,625: el mismo tamaño en
  píxeles y siguen escalando con la fuente del navegador.
- **Los esquemas de color pasan a ser de CAUCE** (bloque 0b). Horizon 4 no tiene esquemas por
  sección. Las clases (`.color-background-1`, `.color-inverse`…) y los valores de los settings
  quedaron iguales, así que las plantillas no cambian; lo que cambia es que ahora las define
  `cauce-brand.css` con `--cauce-esq-fondo` / `--cauce-esq-texto`, y desde ahí le pasan a Horizon
  sus variables de fondo, texto y botón. Ojo: `--cauce-fondo` y `--cauce-texto` ya eran colores de
  la paleta del aditivo (bloque 26); por eso los del esquema llevan otro nombre.
- **`rgba(var(--color-foreground), a)` pasó a `color-mix()`** sobre el color del esquema: en Horizon
  `--color-foreground` es un color entero y no un triplete RGB.
- **La base tipográfica y de botones de Shrine se reconstruyó adentro de `.cauce-seccion`**
  (títulos `.h0`–`.h5`, cuerpo de 15/16 px con interlínea 1,8, `.page-width`, `.rte`, `.button`),
  con la misma especificidad que tenía en Shrine para que las reglas de cada pieza le sigan ganando.
- **El `class` del schema de las secciones dejó de incluir `section`.** En Horizon `.section` es
  una grilla de tres columnas: el fondo de cada sección CAUCE quedaba recortado al ancho central.
- **`cauce-brand.css` carga después de `content_for_header`**, donde Shopify inyecta los
  `{% stylesheet %}` de Horizon, para pisar sin `!important`. La única excepción son los colores
  del encabezado en el aditivo, que Horizon escribe en un `style` inline.
- **Fuentes.** Las de Horizon (Configuración del tema → Tipografía) quedan en la fuente de sistema
  `sans-serif`, que no se descarga; las familias reales las ponen los tokens de CAUCE, que ahora
  también le dan la fuente a las piezas de Horizon. Se cargan como en Shrine: Archivo, Newsreader y
  DM Mono en el sitio, y en la PDP del aditivo solo DM Sans.

  > **Superado el 2026-10-16 por D-082:** todo el sitio pasa a DM Sans, y se corrige un ciclo entre
  > `--font-body--family` y los tokens de fuente que dejaba la página en la fuente del navegador.
- **Locales.** Las claves `cauce.*` pasaron a `es.json` y `en.default.json`, solo las que se usan.
  Se borraron los 32 idiomas que trae Horizon y la tienda no publica, como D-007 en Shrine.

### 3. El bloque de compra

`buy-buttons` de Horizon trae su selector de cantidad como bloque estático, que no se puede sacar:
con los packs al lado, el formulario mandaría dos campos `quantity`. `cauce-comprar` arma el mismo
formulario que Horizon —mismo `<product-form-component>`, mismo id de form, el bloque estático
`add-to-cart` de Horizon para el botón— y la cantidad la ponen los radios de los packs. El add al
carrito, la animación y la apertura del drawer son los de Horizon.

Diferencias con Shrine:

- **Los tokens se reemplazan todos.** En Shrine un texto podía llevar un solo token de plata
  (AUDIT §3.1, advertencia B). Ahora `[quantity] [price] [compare_price] [price_each]
  [compare_price_each] [amount_saved] [amount_saved_rounded] [duracion] [precio_dia]` funcionan
  juntos en el mismo texto.
- **Sale el texto dinámico del botón** ("Agregar 2 frascos · $X", D-051). El aditivo lo tenía
  apagado (`cauce_cta_fijo`), y en Horizon el texto del botón lo redibuja su JS al cambiar de
  variante.
- **Sale el modo compacto de las tarjetas** (D-066). Lo usaba solo Hormify.
- **Sale la cinta "por variante"**: los packs no tienen selector de variante adentro, igual que
  como estaba configurado (`enable_variant_selectors` apagado).
- El encabezado del grupo es un `<legend>` de un `<fieldset>`, en vez de un `<p>` nombrado con
  `aria-labelledby`.

Los precios siguen siendo de vitrina: los cobran los descuentos automáticos de D-074 §6.

### 4. El carrito

Se conserva lo que D-046 había defendido: el carrito es una sección con bloques que se prenden,
apagan y reordenan desde el editor. Para eso `sections/cart-drawer-section.liquid` (el destino que
Horizon pide por la Section Rendering API) pasa a renderizarse como **sección estática** desde
`layout/theme.liquid`, con los mismos nueve tipos de bloque y la misma configuración que tenía el
drawer en Shrine (legal y beneficio de pago apagados). `/cart` es `sections/cauce-carrito-pagina.liquid`
con los mismos tipos de bloque.

El HTML es el de CAUCE; quien hace los cambios de cantidad y vuelve a dibujar es
`<cart-items-component>` de Horizon. La línea respeta su contrato (`ref="cartItemRows[]"`, el
selector de cantidad de Horizon, `on:click="/onLineItemRemove/N"`, las refs de error) y el resto
del carrito el de `cart-drawer.js` (`.cart-drawer--empty`, `.cart-drawer__summary`). El empujón de
envío gratis agrega por AJAX y avisa con el mismo `CartLinesUpdateEvent` que usa el formulario de
producto, así se actualizan el drawer, `/cart` y el contador del encabezado.

Lo que cambió: quitar una línea es un `<button>` y no un `<a>` (sin JS no quita; el carrito de
Horizon no funciona sin JS de todos modos), y el carrito vacío ya no necesita que su link sea el
primero del DOM (D-046 §1e era un requisito del JS de Shrine). El destino de "Ver los productos"
con el carrito vacío es un setting nuevo, `cauce_carrito_vacio_url`.

### 5. La ficha del aditivo en Horizon

La columna de compra es `product-information` de Horizon: el título y la descripción son bloques
`text` de Horizon, la pastilla, el ancla, los medios de pago y las fichas siguen siendo
`custom-liquid`, y después vienen los tres bloques propios. La galería es el carrusel de Horizon con
miniaturas abajo en escritorio y puntos en teléfono. La barra de anuncios se esconde en esta
plantilla y el encabezado pasa a VERDE BOSQUE con el logo en blanco, como en Shrine, ahora sobre el
markup de Horizon.

### 6. Sin home durante el testeo

`templates/index.json` tiene una sola sección, `cauce-redireccion`, que manda la raíz (y el logo)
a `/products/aditivo-dental-perros` con `location.replace`, y con `<meta refresh>` sin JS. En el
editor no redirige. Shopify no permite una redirección de URL desde `/`, por eso va en el tema.

### 7. La leyenda de suplemento dietario, ahora configurable

`cauce-legal-bar` suma un setting, "Leyenda de suplemento dietario": en todas las páginas menos la
del aditivo (lo de Shrine, por defecto), en todas o en ninguna. Con el R-ALA fuera del testeo, la
leyenda diría algo falso en el carrito y en las páginas de ayuda; queda para que el comercio lo
elija.

> **Resuelto el 2026-10-16 en D-082:** la leyenda no va en ninguna página.

### 8. Cómo se verificó

- `shopify theme check`: **0 errores**. Las advertencias que quedan son de archivos de Horizon y
  las de Google Fonts, que ya estaban en Shrine.
- Un validador propio contrastó cada valor de `templates/*.json`, `sections/*.json` y
  `settings_data.json` con el schema de su sección o bloque (claves, `range` dentro de min/max y de
  paso, opciones de `select`): 0 problemas. Es el silencio de D-074 §7, chequeado antes de subir.
- El bloque de compra y el carrito se renderizaron fuera de Shopify con LiquidJS, con la división
  entera de Shopify: los tres packs dan exactamente la tabla de D-074 §4, y el drawer y `/cart`
  traen todas las refs que necesita el JS de Horizon.
- **No se vio en Shopify.** Ni en escritorio ni en teléfono, ni con el producto real.

### 9. Lo que queda pendiente

- Subir la rama como tema sin publicar, asignarle `product.aditivo-dental` al producto y recorrerlo
  en el editor y en un teléfono: el verde del encabezado y el logo en blanco, la galería, la barra
  fija y el carrito son lo primero a mirar.
- Confirmar que el handle del producto es `aditivo-dental-perros` (redirección de la home y botón
  del carrito vacío).
- Probar el carrito con el producto activo: que cada pack cobre $49.900, $59.900 y $71.900.
- Elegir dónde va la leyenda de suplemento (§7) y revisar la FAQ: la pregunta 10 lleva a la página
  del R-ALA y varias respuestas hablan de "frascos". La suscripción de `collection.json` ofrece el
  10 % de bienvenida y habla de frascos.
- Si el R-ALA y Hormify siguen activos en la tienda, se ven con la plantilla de producto de
  Horizon, sin las secciones CAUCE.

---

## D-082 · 2026-10-16 · Todo el sitio en DM Sans, sin leyenda de suplemento y textos sin el R-ALA

**Decisión.** Tres pedidos del comercio después de D-081, y la corrección de un error de D-081.

### 1. La tipografía de la PDP del aditivo pasa a todo el sitio

DM Sans en títulos, texto y datos, en todas las páginas: el carrito, el pie, la barra legal, las
preguntas, el arrepentimiento y las páginas de Horizon (políticas, 404, búsqueda). Es lo que hacía
el bloque 26 solo en `plantilla--aditivo-dental`, ahora en los tokens del principio de
`cauce-brand.css`:

| | Antes (Shrine y D-081) | Ahora |
|---|---|---|
| Títulos | Newsreader 400 | DM Sans 700, tracking −0.015em |
| Texto | Archivo | DM Sans |
| Datos (precios, chips) | DM Mono | DM Sans con números de ancho fijo |
| Carga | Google Fonts: Archivo + Newsreader + DM Mono (DM Sans solo en la PDP) | Google Fonts: solo DM Sans, el mismo pedido de la PDP (400–700, cursivas, tamaño óptico) |

La regla de los títulos en negrita se movió tal cual estaba en el bloque 26, con la misma
especificidad (0,2,0) y en el mismo lugar del archivo, así cada página se comporta igual que la PDP.
El color VERDE BOSQUE de los títulos sigue siendo solo de la plantilla del aditivo: se pidió la
tipografía, no la paleta.

**Las fuentes de Horizon** (Configuración del tema → Tipografía) quedan en la fuente de sistema
`sans-serif`. **Alternativa descartada:** elegir DM Sans ahí. Horizon la bajaría de la CDN de
Shopify (400, 500 y 700) además de la de Google, que es la que tiene el 600 que usa la PDP: dos
descargas de la misma fuente. Para que el editor no confunda, esa pantalla lleva un aviso.

### 2. El error de D-081: un ciclo entre variables

En D-081 los tokens de fuente terminaban en `var(--font-body--family, system-ui)`, y el bloque 0b
apuntaba `--font-body--family` de Horizon a esos mismos tokens. Dos variables que se referencian
entre sí son inválidas las dos, aunque la referencia esté en el respaldo, y la página cae en la
fuente por defecto del navegador. Ahora los respaldos son literales (`system-ui, -apple-system,
'Segoe UI', sans-serif`) y quedó un chequeo que busca ciclos en todas las variables de
`cauce-brand.css`: sin ciclos.

### 3. La leyenda de suplemento dietario no va en ninguna página

`cauce-legal-bar` → "Leyenda de suplemento dietario": **En ninguna página** (D-081 §7). La leyenda
del carrito ya estaba apagada.

**Lo que esto no resuelve.** El R-ALA sigue activo en la tienda: su ficha (con la plantilla de
producto de Horizon) queda sin la leyenda que exige la Disp. ANMAT 4980/05. Si sigue a la venta
durante el testeo, la leyenda tiene que volver ahí; si no, conviene pasarlo a borrador.

### 4. Textos sin el R-ALA

- **Preguntas, 7:** "con el frasco cerrado" y "los frascos que no abriste" pasan a "botella". La
  política (30 días, envase cerrado, reintegro de lo que se devuelve) no cambia.
- **Preguntas, 10:** "¿Dónde veo qué tiene Hocico Fresh y cómo se usa?", con el link a
  `/products/aditivo-dental-perros` en vez de a la página del R-ALA.
- **Suscripción** (`collection.json`): "fórmulas nuevas" y "el frasco" pasan a "novedades" y "la
  botella". **El 10 % de bienvenida se dejó:** es una oferta comercial y la pregunta 6 la nombra.
  Si el código no existe en Shopify → Descuentos, hay que sacarla de los dos lugares.

### 5. Datos de la tienda

El handle del producto se confirmó en la tienda: `aditivo-dental-perros`. Con eso quedan la
redirección de la home y el botón del carrito vacío (`cauce_carrito_vacio_url`, que ahora va a la
ficha y no a todos los productos, que incluyen el R-ALA).

Se revisaron los ajustes de Shrine contra los de Horizon: logo, favicon, logo del pie, redes,
datos legales y de contacto, medios de pago, cuotas, transferencia y envío ya estaban migrados
(D-081). Lo que no se migró es contenido de demostración de Shrine en inglés: la página de
contraseña, el popup de promoción (estaba apagado) y las etiquetas de las tarjetas de producto
("BEST DEAL"). Los productos, sus fotos y metafields, las páginas, las políticas, los menús, los
descuentos y los archivos son de la tienda y no del tema: no se migran porque no se movieron.

### 6. Cómo se verificó

`theme check` sin errores, el validador de settings sin problemas, el chequeo de ciclos sin ciclos,
y los renders de prueba del bloque de compra y del carrito dan lo mismo que en D-081. **No se vio en
Shopify.**

---

## D-083 · 2026-10-16 · Repaso de la migración: lo que se había editado en Shrine y los textos de Horizon

**Decisión.** Se repasó todo lo que podía haber quedado afuera de D-081. Dos cosas faltaban.

### 1. Cambios hechos desde el editor de Shrine después de la copia

El repo de Shrine tenía en `origin/main` un "Update from Shopify" del 2026-10-14 que no estaba en
la copia local usada para migrar. Toca solo `product.aditivo-dental.json`, y se pasó igual:

- "La fórmula, a la vista" (`respaldo`) queda **apagada**.
- "Una boca más sana, mes a mes" (`meses`) queda **prendida**. Los meses 2 y 3 siguen con
  `[COMPLETAR: …]` y sin fotos, así que en la tienda se ven resaltados en amarillo (D-074 §3) y con
  los recuadros de foto pendiente.
- El aviso del editor de las reseñas queda vacío.

El resto de la plantilla es idéntico a lo migrado.

### 2. Textos de demostración de Horizon en inglés

Las plantillas de Horizon que no se tocaron traían texto fijo en inglés, que en Shrine salía en
español: la 404, la página de contraseña, la lista de colecciones y la plantilla de producto por
defecto (que es la que usa el R-ALA mientras esté activo). Se tradujeron.

### 3. Lo que se revisó y no hacía falta migrar

| | Por qué no |
|---|---|
| Apps embebidas y bloques de apps | Shrine no tenía ninguna |
| Ramas del repo de Shrine | Todas mergeadas en `main` |
| Agregados CAUCE en `logo-list`, `bundle-offer`, `upsell-block` | Eran arreglos de theme-check sobre código de Shrine |
| Prioridad alta de la primera foto (`product-thumbnail`) | Horizon ya la pide con `fetchpriority="high"` |
| `track-order` (17track), `password.liquid`, `material-icon` | Demo de Shrine, layout de Shrine y su sistema de íconos |
| Colores del checkout | Eran los de demo de Shrine (`#dd1d1d`); el checkout se configura en su propio editor |
| Mails de notificación (`carpetalocal/`) | Usan imágenes de Archivos de la tienda, no del tema: no se rompen si se borra Shrine |
| Plantillas de cuenta de cliente | Sin cambios de CAUCE. Horizon no las trae: funciona con las cuentas de cliente nuevas de Shopify |

---

## D-084 · 2026-10-16 · La galería de la PDP en el teléfono pasa a ser la de la referencia

**Decisión.** El comercio pidió para el testeo de Hocico Fresh la galería de fotos que usa en el
teléfono `https://ruffitos.com/products/formula-probioticos-perro-alergias`. Se armó **sobre el
carrusel de Horizon**, sin copiarla: la referencia corre Shrine PRO 1.3.2 (el tema del que se salió
en D-081) y su galería es el `media-gallery` + `slider-component` de Dawn con el JS de Shrine. Se
tomaron la forma y las medidas; ningún código, foto ni texto de ellos.

### 1. Cómo queda

Medido en la referencia en un teléfono de 390 px:

| | Referencia | CAUCE |
|---|---|---|
| Foto | A 19,5 px de cada borde, esquinas de 20 px | Al margen de la página (16 px), para que alinee con el texto de abajo; esquinas de 20 px |
| Flechas | Un círculo casi negro de 30 px al 70 %, con chevron blanco, a 10 px del borde, sobre la foto | Igual, en el color de texto (`--color-foreground`) con el chevron en el de fondo. El botón mide 44 px para el dedo; el círculo dibujado, 30 |
| Puntos | Debajo de la foto: 6 px al 50 %, el elegido de 9 px y lleno | Igual |
| Miniaturas | Cinco a la vista, 8 px entre sí, esquinas de 20 px, la elegida con un filete oscuro; un chevron fino a cada lado corre la tira de a tres | Igual. Los chevrones de la tira aparecen solo cuando la tira no entra entera |
| Pasar de foto | Scroll-snap nativo | El de Horizon, que también es scroll-snap |
| Tocar la foto | No hace nada | Abre el zoom de Horizon, como antes |

**En escritorio no cambia nada:** sigue la galería de Horizon con miniaturas abajo y flechas al pasar
el mouse.

Dos diferencias que quedan, a propósito:

- **El carrusel da la vuelta.** En Horizon la galería de producto es infinita: en la primera foto
  la flecha de la izquierda lleva a la última y nunca se apaga. En la referencia se frena en las
  puntas y la flecha baja al 30 %. Lo infinito viene fijo en `product-media-gallery-content` y vale
  también para escritorio; el CSS ya tiene el estado apagado por si algún día se cambia.
- **Fotos de distinto formato.** Horizon estira todos los slides al alto de la foto más alta, para
  que la galería no salte al pasar; la foto va arriba y las más bajas dejan aire debajo. La
  referencia hace lo mismo (tiene una foto vertical entre las cuadradas). Con las cinco fotos de
  Hocico Fresh en el mismo formato no pasa.

### 2. Cómo se prende

Dos ajustes nuevos en el bloque **Multimedia del producto**, grupo Carrusel:

- **Paginación en móviles → "Puntos y miniaturas"** (`dots_thumbnails`): la foto con margen y
  esquinas redondas, los puntos debajo y las miniaturas abajo.
- **Flechas en móviles** (`cauce_flechas_movil`).

`product.aditivo-dental` los tiene prendidos. La plantilla de producto por defecto no cambia.

Las miniaturas del teléfono **son las de escritorio**, que ya están en la página y dejan de
esconderse. No se dibuja un segundo juego: el slideshow de Horizon junta las miniaturas en
`ref="thumbnails[]"` y marca la elegida por posición, así que dos juegos se pisarían. Por eso hace
falta "Miniaturas" en Paginación en escritorio (lo dice la ayuda del ajuste); si no, el teléfono
muestra los puntos y las flechas sin la tira.

### 3. Qué se tocó

| Archivo | Cambio |
|---|---|
| `blocks/_product-media-gallery.liquid` (Horizon) | La opción y el checkbox |
| `snippets/product-media-gallery-content.liquid` (Horizon) | Con "Puntos y miniaturas" las miniaturas de escritorio no llevan `mobile:hidden` y los puntos de teléfono van fuera de la foto. Clases `media-gallery--cauce-movil` y `media-gallery--cauce-miniaturas`. Con el checkbox, las flechas sin `mobile:hidden` |
| `snippets/slideshow-arrows.liquid`, `snippets/slideshow-arrow.liquid` (Horizon) | Parámetro opcional `icon_style_mobile`: el botón lleva un ícono para cada pantalla. El teléfono tiene chevron y la flecha de escritorio no cambia |
| `snippets/slideshow-controls.liquid` (Horizon) | Parámetro opcional `cauce_flechas_miniaturas`: envuelve la tira en `<cauce-miniaturas>` con un chevron a cada lado |
| `assets/cauce-brand.css` | Bloque 30, todo dentro de `max-width: 749px` |
| `assets/cauce.js` | `<cauce-miniaturas>` |
| `locales/es.json`, `locales/en.default.json` | Las etiquetas de los dos chevrones de la tira |

Los cambios en archivos de Horizon son parámetros opcionales y llevan "CAUCE" y "D-084" en un
comentario: sin los ajustes nuevos, la galería se dibuja igual que antes.

**Un arreglo de paso.** Horizon centra la miniatura elegida cuando se toca una o cuando se arrastra
la foto con el mouse, pero no cuando se pasa con el dedo: eso es scroll nativo, y con las
miniaturas solo en escritorio no hacía falta. En el teléfono la elegida quedaba fuera de la tira.
`<cauce-miniaturas>` escucha el evento `slideshow:select` de Horizon y, si la elegida no se ve
entera, la centra.

**Alternativas descartadas:**

- *Traer la galería de Shrine/Dawn.* Sería un segundo carrusel con JS propio al lado del de Horizon,
  que también maneja el zoom, el cambio de variante y el editor. Y es el código del que se salió.
- *Solo CSS sobre Horizon.* Las miniaturas y las flechas se esconden en teléfono con
  `mobile:hidden`, que es `display: none !important`: había que pisarlo con más `!important`, y no
  resolvía el chevron ni los chevrones de la tira.
- *Pasar "Íconos" a chevrones en el bloque.* Cambia también la flecha de escritorio, y el pedido era
  el teléfono.

### 4. Cómo se verificó

- Un banco de prueba con LiquidJS dibujó el bloque real de la galería dentro de
  `product-information-content`, con todos los `{% stylesheet %}` del tema, sus variables,
  `cauce-brand.css` y los módulos JS de Horizon, en un marco de 390 px al lado de la referencia.
  Las fotos de prueba fueron las ocho de la referencia (siete cuadradas y una vertical), cargadas
  de su CDN solo en ese banco local: nada de eso entra al tema.
- Medidas: foto a 16 px del borde con esquinas de 20; flechas de 30 px; puntos de 6 y 9 px;
  miniaturas de 59 px en un marco de 380 px útiles (en 390 dan 61; la referencia, 62,7).
- Comportamiento: la flecha pasa a la foto 2 y mueve el punto y la miniatura; tocar la quinta
  miniatura lleva a la foto 5 y la tira la centra; los chevrones de la tira corren de a tres y se
  apagan en cada punta; al pasar las fotos con scroll la tira sigue a la elegida; tocar la foto
  abre el zoom; tocar una flecha no lo abre.
- Con 1, 3 y 5 fotos: con 1 no hay controles; con 3 las miniaturas se centran; con 5 llenan la
  tira y no aparecen los chevrones.
- Escritorio: los 55 elementos visibles de la galería tienen la misma posición y el mismo tamaño
  antes y después; solo cambian dos nombres de clase.
- `theme check`: 0 errores y las mismas advertencias que antes del cambio. Validador de settings:
  0 problemas.
- **No se vio en Shopify ni en un teléfono.** El paso de fotos se probó con scroll programático (la
  galería sin tocar responde igual a eso); el gesto con el dedo hay que probarlo en el teléfono.

### 5. Lo que queda pendiente

- Recorrerlo en un teléfono con el producto real: el gesto, que la tira siga a la foto y cómo se ven
  las cinco fotos de Hocico Fresh, que hoy son marcadores (D-074).
- El zoom al tocar la foto: la referencia no lo tiene. Si se prefiere sin zoom, se apaga en el
  bloque ("Activar zoom"), pero eso lo saca también de escritorio.

---
## D-085 · 2026-10-16 · Vuelven los ajustes del tema que se perdieron al conectar `main` con Shopify

**Qué pasó.** `main` está conectada con la integración de GitHub al tema **Cauce-Theme/main** de la
tienda: un push a `main` llega a ese tema, y cada vez que se guarda en el editor, Shopify sube un
commit "Update from Shopify for theme Cauce-Theme/main" (`shopify[bot]`). El primero, a las 9:02
(hora argentina), dejó `config/settings_data.json` con los valores de fábrica de Horizon:

- Sin ninguno de los ajustes `cauce_*`: razón social, CUIT, domicilio, email, teléfono, WhatsApp,
  horario, link de arrepentimiento, leyendas, cuotas, transferencia (porcentaje y código), medios de
  pago, umbral de envío gratis y destino del carrito vacío. El pie y la barra legal quedaban sin los
  datos de la Ley 24.240 y el botón de WhatsApp no se dibujaba.
- El carrito (`cart-drawer-section`, D-081 §4) sin sus nueve bloques.
- La paleta, las fuentes (Inter, que se descarga), los radios, el favicon y los botones en
  mayúscula, de fábrica.

Los guardados siguientes fueron cambios del comercio: el logo del pie (`footer-group.json`) y el
alto del logo del encabezado.

**Decisión.** Con el visto bueno del comercio, `settings_data.json` vuelve a ser el de D-082 con dos
excepciones, que se dejan como están en la tienda: el alto del logo (100 px en escritorio y 28 en
teléfono, ajustado desde el editor) y `content_for_index`, que agrega Shopify. El logo del pie no
está en este archivo y no se tocó.

**Para lo que sigue:** antes de subir a `main` hay que traer lo que haya guardado el editor (`git
fetch` y rebase), porque un push con una copia vieja pisaría los cambios del comercio. El editor
además reescribe las plantillas JSON (pone `settings` al final de cada sección y completa valores
por defecto); un conflicto de texto ahí suele ser solo de forma.

**Cómo se verificó.** Comparado contra D-082 clave por clave: solo difieren el alto del logo y
`content_for_index`. `theme check` sin errores; el validador de settings solo marca
`content_for_index`, que es de Shopify.

---


## D-086 · 2026-10-16 · El carrito lateral no mostraba productos: Shopify rechazaba `settings_data.json`

**Qué pasaba.** En caucearg.com, al agregar el aditivo el carrito se abría sin ningún producto. El
agregado funcionaba (`/cart/add.js` devolvía la línea y `/cart` la mostraba), pero el drawer llegaba
con el cuerpo y el pie vacíos: la sección `cart-drawer-section` no tenía bloques.

**La causa.** Shopify nunca aceptó el `config/settings_data.json` del repo, ni el de D-081/D-082 ni
el de D-085. Las cuatro fuentes estaban en `sans-serif_n4` / `sans-serif_n7`, un handle que no
existe: el de la fuente de sistema es **`sans_serif_n4`** / **`sans_serif_n7`**, con guion bajo
([documentación de fuentes de Shopify](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts)).
La integración de GitHub descarta sin avisar en el repo el archivo que no valida, así que el tema
publicado se quedó con el `settings_data.json` de fábrica de Horizon. Eso corrige lo que D-085
creyó: el commit del bot de las 9:02 no *borró* los ajustes, exportó lo único que Shopify tenía.

Se comprobó bajando el tema publicado (`shopify theme pull`): es idéntico al repo salvo
`settings_data.json` (sin los 9 bloques del carrito, sin ningún `cauce_*`, sin favicon, sin
`auto_open_cart_drawer`) y un comentario de cabecera en `locales/es.schema.json`. O sea que además
del carrito, en la tienda faltaban los datos de la Ley 24.240 del pie y la barra legal, el botón de
WhatsApp, la paleta, los radios y los botones en mayúscula.

**Decisión.**

1. Las cuatro fuentes pasan a `sans_serif_n4` / `sans_serif_n7`. Es la misma fuente de sistema que
   se buscaba en D-081; las familias reales las siguen poniendo los tokens de CAUCE (DM Sans, D-082).
2. **Respaldo en `snippets/cauce-carrito.liquid`.** Si la sección llega sin bloques, el carrito usa
   las piezas de siempre (reaseguro, barra de envío, productos, empujón, totales, botón de pago y
   medios de pago) con los valores por defecto del schema. Pasó dos veces que los bloques del drawer
   desaparecieran de `settings_data.json`, y sin ellos el carrito cobra pero no muestra qué. En el
   editor sigue el aviso, ahora diciendo que se ven las piezas por defecto. Con bloques no cambia
   nada: se recorren en el orden del editor y los apagados no se dibujan.
3. **El selector de cantidad tapaba el precio de la línea.** Apareció recién cuando el drawer volvió
   a dibujar productos: los botones − y + de Horizon llevan la clase `.button`, y la base de botones
   de `.cauce-seccion` (D-081 §2) les da `min-width: 7.5rem`. El stepper medía 274 px y el precio
   quedaba en 17. El bloque 17 de `cauce-brand.css` ahora anula `min-width` y `min-height` en esos
   botones: el stepper mide 114 px y el precio entra entero. Vale también para `/cart`.

**Alternativa descartada:** mover el drawer a un grupo de secciones JSON (sus bloques quedarían en un
archivo propio y no en `settings_data.json`). Es más robusto, pero cambia el id de la sección que
pide el JS de Horizon por la Section Rendering API y hoy no hacía falta.

**Para lo que sigue:** después de cada push a `main` que toque `config/`, confirmar que llegó
(`shopify theme pull --only config/settings_data.json` del tema publicado, o mirar los errores de la
integración en el admin). `shopify theme check` no valida los handles de fuente.

**Cómo se verificó.** Reproducido en la tienda con un carrito de prueba: `/cart/add.js` con
`sections=cart-drawer-section` devolvía 1 producto y una sección con 0 líneas. `shopify theme
check`: 0 errores. Después del push, el `settings_data.json` del tema publicado quedó idéntico al
del repo (esta vez Shopify lo aceptó), el mismo pedido devolvió la línea dibujada con total, botón
de pago y medios de pago, y la ficha volvió a tener CUIT, WhatsApp y apertura automática del
drawer. En Chrome, en caucearg.com: "Agregar al carrito" abre el drawer con el producto, el
subtotal, el ahorro y "Tenés el envío gratis". El arreglo del stepper se probó inyectando la regla
en esa misma página antes de subirlo.

---
