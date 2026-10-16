# CLAIMS-AUDIT.md — auditoría de afirmaciones

Inventario de **todo texto orientado a beneficio** que publica el tema: dónde vive, con qué
redacción quedó y qué hace falta para poder sostenerlo.

Marco: CAA art. 1381 · Disp. ANMAT 4980/05 · Ley 24.240 · Res. SCI 424/2020 ·
Res. SC 270/2020 · Ley 25.326.

**Esto no es asesoramiento legal.** Es el registro de las decisiones de redacción que tomé
y de la evidencia que cada una necesita. Antes de sacar la tienda del modo contraseña
tiene que revisarlo alguien con criterio legal, con la lista de la sección 6 en la mano.

---

## 1. Regla operativa

**Ningún claim está escrito en un `.liquid`.** Todos viven en uno de cuatro lugares
auditables:

| Lugar | Qué contiene | Cómo se audita |
|---|---|---|
| `locales/es.json` → `cauce.*` | textos de sistema y legales | un archivo, un grep |
| `templates/*.json` y `sections/*-group.json` | copy de campaña por sección | `grep -rn` en `templates/` |
| Metafields del producto (`cauce.*`) | composición, uso, análisis | admin de Shopify, por SKU |
| `config/settings_data.json` → `cauce_*` | legales editables desde el admin | un grep por `cauce_` |

Consecuencia práctica: cambiar una redacción en toda la tienda es editar un archivo, y
listar todo lo que afirma la tienda es leer cuatro lugares. Si mañana ANMAT observa una
palabra, no hay que abrir secciones una por una.

---

## 2. Lo prohibido, y qué se puso en su lugar

| Prohibido (§3.1) | Dónde lo pedía la estructura de la referencia | Qué se hizo |
|---|---|---|
| Claim terapéutico, de prevención o de cura | hero, cards, timeline | Todo el eje argumental es **composición y trazabilidad**. La página nunca dice para qué sirve. |
| Cifras de eficacia o porcentajes de resultado | bloque de porcentajes | Reemplazado por `cauce-datos`: ficha técnica verificable contra el rótulo (bloque 7). |
| Mención o comparación con medicamentos | comparativa | La comparación es contra **mezcla racémica**, un formato, no un producto ni un fármaco. |
| Sugerir reemplazo o reducción de medicación | — | No aparece. La leyenda de suplemento y "consultá a tu médico" están en todas las páginas. |
| Testimonios con patologías, plazos o profesionales | UGC y reseñas | UGC vacío con la prohibición escrita en el editor. Reseñas `testimonials` **desactivadas**: no hay reales. **PENDIENTE:** la marquesina `ss_glow_testimonial_3jmxKc` (D-030) sí tiene 7 testimonios cargados desde el editor y los 7 caen en esta prohibición. Ver §6. |
| Sellos de aval oficial | hero | No hay ninguno. Tampoco los genéricos tipo *gluten free* o *lab tested* (regla 5 del brandboard). |
| Plazos de resultado | timeline | El bloque 12 habla de **hábito y reposición**. Título: "Una rutina, no un tratamiento". |

---

## 3. Inventario de claims

Tipo: **C** = composición · **P** = proceso o trazabilidad · **O** = origen ·
**L** = legal u operativo.

### 3.1 Se repiten en varios lugares

Estos cuatro son el eje de la marca y aparecen en home, hero y pilares. Se auditan una vez.

| # | Afirmación | Tipo | Dónde | Evidencia que necesita |
|---|---|---|---|---|
| A1 | Isómero R puro, sin mezcla racémica | C | home, hero, pilares, datos, comparativa | COA que declare identidad R |
| A2 | 600 mg por cápsula | C | home, hero, pilares, datos, cards | COA con contenido por unidad |
| A3 | Analizado por laboratorio externo, por lote | P | home, hero, pilares, cards, comparativa, FAQ | COA por lote, de un tercero, **publicado** |
| A4 | Producción nacional | O | home, hero, pilares, datos, marquee | RNE del elaborador |

> **A3 es el más exigente.** La página no dice "analizamos", dice que el certificado **se
> publica** y que el lote del certificado **coincide con el del envase**. Eso obliga a un
> proceso, no a un documento suelto. Si no se va a publicar por lote, hay que bajar la
> redacción a "cada lote se analiza" y sacar la promesa de publicación de cuatro lugares.

### 3.2 Específicos por sección

| # | Afirmación | Tipo | Dónde | Evidencia |
|---|---|---|---|---|
| B1 | Sin mezclas propietarias, en ningún SKU | C | home (manifiesto), detalle | Compromiso de marca. Aplica al roadmap completo. |
| B2 | Un solo activo, excipientes declarados | C | cards, detalle | Rótulo |
| B3 | La materia prima llega con su propio certificado | P | cards | Certificado del proveedor |
| B4 | Trazabilidad de lote | P | pilares, comparativa | Registro interno de lotes |
| B5 | El ácido alfa lipoico se describió en la década del cincuenta | — | explicación | Histórico verificable (aislado en 1951) |
| B6 | Sintetizado da mezcla R/S en partes iguales; el R es el natural | C | explicación, comparativa | Química básica, no controvertido |
| B7 | Separar los isómeros encarece la producción | — | explicación | Afirmación de mercado, razonable |
| B8 | 10 días de arrepentimiento, sin costo, sin motivo | L | hero, banda, garantía, FAQ, legal, página propia | Res. SCI 424/2020 |
| B9 | Pago procesado por Mercado Pago; no guardamos datos de tarjeta | L | banda | Cierto con MP. Revisar si se suma otro medio. |
| B10 | Un frasco cubre un mes de uso diario | C | rutina | Depende de `cauce.dosis_diaria` |

### 3.3 Lo que la página deliberadamente **no** dice

Vale registrarlo: la ausencia es una decisión, no un olvido.

- Para qué sirve el ácido alfa lipoico.
- Cualquier mención a glucemia, neuropatía, nervios, energía, antioxidación o metabolismo.
- Cuánto tarda en "hacer efecto".
- Comparaciones con marcas o con medicamentos.
- Cantidad de clientes, unidades vendidas o reseñas.

> **Esta lista dejó de ser cierta.** Se escribió cuando el copy de la landing salía entero
> de este repo. Desde entonces el template `product.cauce-landing` se editó desde el theme
> editor y hoy contradice cuatro de los cinco puntos: la descripción del producto habla de
> "sacar el azúcar de la sangre", "energía estable" y "protección antioxidante"; una FAQ
> promete resultados "en 3 a 5 semanas"; otra compara con la berberina; el bloque de reseñas
> declara "1574+ Reseñas" y 4.8 de calificación. La sección `dolor` (D-033) se suma a eso, no
> lo inaugura. **La lista queda como estaba a propósito**: es el estado al que hay que volver
> si la revisión legal decide sostener el criterio original. Lo que hay que auditar hoy es el
> template, no este documento.

---

## 4. Claims que se descartaron, y por qué

| Lo que pedía el brief o la referencia | Por qué no se puso | Qué ocupa su lugar |
|---|---|---|
| Bloque de porcentajes de resultado | Cifra de eficacia | `cauce-datos`, ficha técnica (bloque 7) |

> **La primera fila volvió.** Desde el theme editor se cargó un bloque de porcentajes de
> encuesta (88 / 91 / 90) que hoy vive en `cauce-landing` como la sección `resultados`. La
> decisión de descartarlo sigue siendo la correcta mientras no exista la encuesta detrás: el
> bloqueante está abierto en §6 y la sección se puede vaciar desde el editor. Ver D-037.
| Card de **biodisponibilidad** | "Se absorbe mejor" es eficacia comparativa, y el COA no lo dice | Card "Origen del ingrediente" (D-021) |
| Badge "el más elegido" en el escalón de 2 | Dato de comportamiento que no tenemos | ~~Descartado~~ · **VOLVIÓ el 2026-09-09** a pedido, como previsualización. Es un claim de popularidad sin dato detrás: bloqueante abierto en §6 (D-047b) |
| `AggregateRating` en el JSON-LD | No hay reseñas reales | No se emite (D-006) |
| Reseñas de clientes | Ídem | Sección desactivada (D-019) |
| Sellos *gluten free* / *lab tested* | Regla 5 del brandboard y sellos sin certificación | Nada |

---

## 5. Riesgos abiertos — **bloqueantes para publicar**

### R1 · Las imágenes del producto son de otra marca y llevan claims

Las cinco imágenes cargadas en Shopify son de **Noverly** y tienen impreso:

- *"Apoyo Para un Azúcar Saludable"* y *"Apoya el Metabolismo de la Glucosa"*
- *"Energía Estable Todo el Día"*, *"NERVE HEALTH"*, *"ANTIOXIDANT SUPPORT"*, *"CELLULAR PROTECTION"*
- Sellos *GMO FREE / GLUTEN FREE / LAB TESTED*
- Un badge *"COMPRA 1 LLEVA 1 GRATIS — Sale ends soon"*

Los dos primeros grupos son claim terapéutico bajo Disp. ANMAT 4980/05; la §3.1 aplica
**también a imágenes y alt**. El badge de oferta es una promoción que no existe en ningún
descuento configurado y contradice el selector de 1/2/3 frascos (Ley 24.240 art. 7 y 8).
Y la marca visible es de un tercero.

**Toda la copy de esta página evita esos claims y las imágenes los dicen igual, en cuerpo 40.**
No hay redacción que compense eso. Se reemplazan las cinco.

### R2 · El JSON-LD publica "Vitalab" como marca

El tema emite `Product` con `"brand": product.vendor`, y el proveedor del producto en
Shopify es **Vitalab**. Google recibe una marca que no es la nuestra. Se arregla en el
admin del producto, campo Proveedor → `CAUCE`. No es un cambio de tema.

### R3 · La descripción del producto entra al JSON-LD aunque no se vea

Hoy está **vacía**, así que no hay riesgo actual. Pero el tema la emite en
`"description"` del `Product` aunque ninguna sección de la landing la muestre: cualquier
texto que se escriba ahí se publica como dato estructurado sin pasar por la página. Regla:
lo que vaya en ese campo se audita igual que el resto.

### R4 · Metafields de categoría de Shopify

El producto tiene 12 metacampos de la taxonomía estándar, entre ellos **"Enfoque de salud
del suplemento"** y "Uso nutricional". Shopify los usa para feeds y filtros. Si se
completan con un enfoque de salud, se está publicando un claim por un canal que no pasa por
el tema. Dejarlos vacíos o revisarlos uno por uno.

### R5 · La tabla comparativa es la sección de mayor exposición

`comparison-table` marca cruces en la columna "Suplemento genérico". Está redactada para no
nombrar marcas ni medicamentos, y tiene una aclaración al pie de que compara contra la
mezcla racémica como categoría. Aun así es publicidad comparativa y le corresponde el
estándar de veracidad y verificabilidad de la Ley 24.240. **Es la sección que primero le
mostraría a un abogado.** Si hay dudas, las filas 1 y 2 (que son verdaderas por definición
química) se sostienen solas; las filas 3 a 6 son las discutibles.

### R6 · Los escalones de cantidad son solo display

Ya está en D-017 y se repite acá porque es legal, no de UX: el precio de los escalones lo
calcula el tema, pero el descuento real lo tiene que aplicar un **descuento automático de
Shopify** con las mismas cantidades. Si no coinciden, la PDP muestra un precio y el carrito
cobra otro.

> **Dejó de ser teórico el 2026-09-09.** Hasta D-047 los tres escalones estaban en descuento 0:
> mostraban el precio multiplicado, que es exactamente lo que cobra el carrito, y la
> discrepancia era de $0. Ahora la PDP promete **$61.900** por dos y **$72.900** por tres, y sin
> los descuentos automáticos cargados el carrito cobra **$99.800** y **$149.700**. La diferencia
> es de $37.900 y $76.800 por pedido, en contra del cliente. Es lo primero que hay que cargar o
> lo primero que hay que revertir; no hay estado intermedio publicable.
>
> Montos actualizados el 2026-09-12 (D-050), cuando el escalón 2 subió de $59.900 a $61.900 y el
> 3 de $77.900 a $72.900.

### R7 · El producto no tiene asignado el template — **CERRADO 2026-08-29**

Figuraba con "Producto predeterminado" y la landing solo se veía agregando
`?view=cauce-landing` a la URL. La plantilla ya está asignada en el admin del producto
(panel Plantilla de tema → `cauce-landing`), así que los tres CTA de la home quedaron con el
link limpio `/products/<handle>` (ver D-038 y D-042).

---

## 6. Checklist antes de publicar

**Contenido**

- [ ] R1 · Reemplazar las cinco imágenes del producto por fotos propias sin claims ni sellos
- [ ] R2 · Proveedor del producto = CAUCE
- [x] R7 · Plantilla del producto = `cauce-landing` — cerrado 2026-08-29
- [ ] R4 · Revisar los 12 metacampos de categoría, en especial "Enfoque de salud"
- [ ] Cargar los metafields `cauce.*` con transcripción textual del rótulo. **`cauce.unidades_envase`
      y `cauce.dosis_diaria` siguen vacíos, y desde D-051 eso tiene otra consecuencia:** los
      "30 / 60 / 90 días" de los títulos de fila y el "una cápsula por día · cada frasco, un mes"
      del encabezado están **escritos a mano** en el editor, no calculados. Son verdaderos si el
      envase trae 30 cápsulas y la toma es una por día — que es justamente lo que esos dos campos
      deberían decir. Cargarlos deja el dato auditable en un solo lugar y permite volver los
      títulos al token `[duracion]` (D-003). Mientras tanto, cualquier cambio de conteo del envase
      obliga a reescribir cuatro textos del bloque.

**Evidencia documental**

- [ ] A1, A2 · COA con identidad R y contenido por cápsula
- [ ] A3 · Definir el proceso de publicación del COA **por lote**, o bajar la redacción
- [ ] A4 · RNE del elaborador
- [ ] B3 · Certificado de la materia prima
- [ ] RNPA/RNE del producto en `settings.cauce_rnpa`

**Legales de la tienda**

- [ ] Razón social, CUIT, domicilio, email y teléfono en Configuración → CAUCE
- [ ] URL del formulario de arrepentimiento (la página `page.arrepentimiento` ya existe)
- [ ] Imagen y URL de Data Fiscal AFIP
- [ ] Redactar las cuatro políticas en Configuración → Políticas (el footer las muestra solo si existen).
      **Privacidad ya está publicada.** Envío, reembolso y términos tienen borrador en
      `docs/POLITICAS.md` (2026-09-27, D-067), con dos `[[PENDIENTE]]` en los Términos: el nombre
      del titular y el domicilio completo.
- [ ] **BLOQUEANTE · R6 · Los descuentos automáticos de los escalones (D-047).** Dos descuentos
      automáticos de Shopify: cantidad 2 → precio final $64.900 (−$40.900) y cantidad 3 → precio
      final $77.500 (−$81.200), sobre el frasco a $52.900. Montos del 2026-09-28 (D-069); hasta
      entonces eran $61.900 (−$37.900) y $72.900 (−$76.800) sobre $49.900. Tienen que coincidir al peso con `option_2_fixed_amount_off` y
      `option_3_fixed_amount_off` del bloque `ofertas`. Si no se cargan, los escalones vuelven a
      `0` y las dos cintas salen.
- [x] ~~R6b · La cinta "ENVÍO GRATIS" del escalón 3~~ — **cerrado 2026-09-09 (D-047c) y resuelto
      de raíz el 2026-09-12 (D-050c).** Se sacó porque con el umbral en $50.000 el escalón 2
      también lo cruzaba y anunciarlo sólo en el 3 era exclusividad falsa; entre el 2026-09-10 y
      el 2026-09-12 el 3 volvió a ser el único que cruzaba y la cinta habría sido verdadera
      (D-049b), y con los precios de D-050 cruzan los dos otra vez. La respuesta dejó de ser
      elegir una tarjeta: **cada escalón que cruza el umbral muestra su propio chip "Envío
      gratis", calculado contra su total ya descontado.** No hay exclusividad que declarar ni
      texto que mantenga nadie, y el riesgo del art. 8 por esta vía queda cerrado.
- [ ] **BLOQUEANTE · La tarifa de envío gratis tiene que existir en Shopify.**
      **Desde el 2026-09-28 (D-069) el envío es gratis en todas las compras:** la tarifa de
      Configuración → Envíos tiene que ser $0 para todo el país, sin mínimo, y
      `cauce_umbral_envio_gratis` está en **1**, así que el chip sale en los tres escalones y la
      barra del carrito siempre dice "Tenés el envío gratis". Ya no hay umbral que un cupón pueda
      perforar: lo que sigue sobre el aire de cada pack es historia. Lo de abajo es el estado
      anterior. `cauce_umbral_envio_gratis` estaba cargado en **$55.000** y la promesa la publican **cinco**
      superficies: la barra de anuncio, el acordeón de envíos, la nota del bloque de oferta, la
      barra de progreso del carrito (D-046) y, desde el 2026-09-12, el chip "Envío gratis" dentro
      de los escalones 2 y 3 (D-050c) — que es la que está pegada al botón de compra. El setting
      del tema **sólo dibuja**: si no hay una tarifa real de envío sin cargo desde $55.000 en
      Configuración → Envíos, las cinco prometen algo que el checkout no cumple (Ley 24.240 art. 7
      y 8). Las cuatro primeras escriben el número a mano; el chip lo calcula el tema contra el
      total ya descontado del escalón, así que no puede quedar desfasado del precio.
      **Umbral bajado de $60.000 a $55.000 el 2026-09-13 (D-052):** la tarifa de Configuración →
      Envíos tiene que cambiar el mismo día que se mergea.
- [x] ~~Ningún escalón llega al envío gratis~~ — **cerrado 2026-09-10 (D-049b), y sigue cerrado
      con los precios del 2026-09-12 (D-050).** Con el umbral en $60.000 lo cruzan el pack de 2
      ($61.900, por $1.900) y el de 3 ($72.900, por $12.900), en los dos estados: con los
      descuentos automáticos cargados y sin ellos ($99.800 y $149.700). Cargar R6 no apaga el
      envío gratis. **El aire del pack de 2 es de $1.900:** un cupón que reste más que eso sobre
      un pedido de dos frascos lo deja abajo del umbral y apaga el beneficio en silencio.
      **Desde D-052 el umbral es $55.000** y el aire del pack de 2 sube a $6.900: un 10 % ($6.190)
      ya no lo tira abajo, queda en $55.710. Dos cupones de 10 % juntos sí.
- [x] ~~**El 10 % de bienvenida le saca el envío gratis al pack de 2 (D-050).**~~ — **cerrado
      2026-09-13 (D-052)** bajando el umbral a $55.000: con un 10 % el pack de 2 queda en $55.710
      y sigue cruzando. Vale porque el de bienvenida y el de transferencia **no se combinan**;
      combinados lo dejan abajo y esto se reabre. El diagnóstico original: con el umbral en
      $60.000, un 10 % sobre $61.900 deja el pedido en **$55.710** y el envío pasa a cobrarse; el
      pack de 3 queda en $65.610 y no se ve afectado. Y la barra de progreso del carrito lee
      `cart.items_subtotal_price`, que **no** descuenta los códigos a nivel carrito: sigue
      diciendo "tenés el envío gratis" mientras el checkout lo cobra. Es promesa incumplida en el
      escalón preseleccionado (Ley 24.240 art. 7 y 8). Tres salidas, todas comerciales: bajar el
      umbral a $55.000, excluir el envío gratis del cupón de bienvenida, o subir el pack de 2.
- [x] ~~**BLOQUEANTE · El 10 % por transferencia tiene que existir en Shopify antes del merge
      (D-052).**~~ — **cerrado 2026-09-14:** el comercio confirmó el método manual
      "Transferencia bancaria", el código `TRANSFERENCIA10` con sus combinaciones y la tarifa de
      envío sin cargo desde $55.000. Lo que sigue abierto está en el ítem de abajo. El texto
      original: lo publican cuatro superficies: la barra de anuncio (escrita a mano), la línea
      "$X con transferencia" de cada escalón, la card de pago del carrito y el chip
      "Transferencia bancaria" de los medios de pago. Las tres primeras prometen un precio que
      el checkout tiene que cobrar (Ley 24.240 art. 7 y 8). Antes de mergear a `main`:
      1. Configuración → Pagos → métodos manuales → **Transferencia bancaria**, con los datos de
         la cuenta y, en las instrucciones, el código y qué pasa si se usa con otro medio de pago.
      2. Descuentos → código **`TRANSFERENCIA10`**, 10 % sobre el pedido, **combinable con
         descuentos de producto** (si no, pisa el precio de los packs) y **no** con otros
         descuentos de pedido (el 10 % de bienvenida).
      3. Los descuentos automáticos de R6, con la combinación con descuentos de pedido activada.
      4. La tarifa de envío sin cargo desde $55.000.
      **El código es público y Shopify no lo puede atar a un medio de pago.** Un pedido con
      `TRANSFERENCIA10` pagado con Mercado Pago se cancela o se cobra la diferencia, y esa regla
      tiene que estar escrita en las instrucciones del método y en la política **antes** de
      aplicarla la primera vez. Si algo de la lista no está, `cauce_transferencia_pct` vuelve a 0
      —el carrito y los escalones se apagan solos— y el anuncio de la barra se borra a mano.
- [ ] **Transferencia: tres cosas que no se ven desde el repo (D-052).**
      1. **Los datos bancarios están escritos en dos lugares:** las instrucciones del método
         manual (Configuración → Pagos) y la plantilla de Confirmación de pedido
         (`carpetalocal/order-confirmation.liquid`, fuera de git). Shopify no expone esas
         instrucciones como variable de notificación. Si cambia la cuenta, cambian los dos.
      2. **La regla del código en Términos del servicio:** exclusivo para pagos por
         transferencia; usado con otro medio de pago, se cancela el pedido y se devuelve el
         total. Las instrucciones del método sólo las ve quien eligió transferencia, así que no
         alcanzan: sin la regla publicada, cancelar un pedido por esto no tiene respaldo.
      3. **Un pedido real pagado con Transferencia bancaria**, para confirmar que el mail muestra
         los datos. El bloque se prende por el nombre de la pasarela de la transacción, y eso
         sólo se ve con un pedido de verdad: los mails de prueba del admin usan uno de ejemplo.
- [ ] Reescribir a mano los dos precios que el tema no calcula en el bloque de oferta: el
      `$12.000` del pill del escalón 2 (si cambia el precio de 1 o de 2 frascos) y el `$55.000`
      de la nota (si cambia `cauce_umbral_envio_gratis`; el mismo número está escrito a mano
      también en la barra de anuncio y en el acordeón de envíos, o sea tres lugares). D-047,
      D-047c, D-049, D-049b y D-050. Los precios de los escalones 2 y 3 **no** están en esta
      lista: los calcula el tema desde `option_N_fixed_amount_off`. El chip "Envío gratis" de las
      tarjetas tampoco: lo decide `snippets/cauce-envio-escalon.liquid` contra el umbral (D-050c).
- [x] ~~**BLOQUEANTE · La cinta "EL MÁS ELEGIDO" del escalón 2 (D-047b).**~~ — **cerrado
      2026-09-12 (D-051).** Era una afirmación sobre la conducta de otros compradores sin ventas
      que la respaldaran: Res. SC 270/2020 y art. 8 de la Ley 24.240, el mismo motivo por el que
      el §4 la había descartado, por el que las reseñas están apagadas (D-019) y por el que no se
      emite `AggregateRating` (D-006). **La cinta ya no existe:** el escalón 2 quedó sin badge y
      el destaque se mudó al 3 con un texto que no habla de nadie más que del producto
      (`LA TOMA COMPLETA · 90 DÍAS`). No quedó nada que confirmar contra los pedidos reales.
- [ ] **BLOQUEANTE · `EL MÁS ELEGIDO · 43 % OFF` en el escalón 2 del R-ALA (D-071).** La cinta volvió el
      2026-10-03 a pedido del comercio. "El más elegido" es el mismo caso de D-047b: confirmarlo contra
      los pedidos del retesteo, o sacarlo (`option_2_badge` del bloque `ofertas`). **El 43 está escrito
      a mano:** es `(99.800 − 56.900) / 99.800`. Si cambia el precio del producto, el precio de
      comparación o el `option_2_fixed_amount_off`, hay que recalcularlo.
- [ ] **El precio tachado de $49.900 (D-071).** Es un precio anterior real: el R-ALA se vendió a ese
      valor hasta el 2026-10-03. Deja de poder llamarse "anterior" si la rebaja se vuelve permanente
      (Ley 24.240 art. 8: lo que se publica tiene que ser cierto).
- [ ] **BLOQUEANTE · La bajada del bloque de oferta cita ensayos clínicos (D-051).** El texto es
      *"Los ensayos clínicos con R-ALA evalúan tomas diarias sostenidas de 8 a 12 semanas."* No
      afirma un resultado ni un plazo de efecto —dice qué duración usan los estudios, no qué pasa
      a las 12 semanas—, pero **es una afirmación sobre literatura científica y el que la publica
      tiene que poder mostrarla**: art. 4 y 8 de la Ley 24.240, y Res. Conj. 148/2019 sobre
      publicidad de suplementos. Hace falta la cita de al menos dos ensayos con R-ALA (no
      racémico) cuyo protocolo esté en esa ventana, guardada con el resto de la evidencia
      documental. Si no se consigue, el renglón sale: es un campo del editor
      (`cauce_subtitulo`), no toca código.
- [x] ~~**BLOQUEANTE · "3 cuotas de $24.300" en el escalón 3 (D-051).**~~ — **cerrado 2026-09-27
      (D-066):** el comercio confirmó que el plan de 3 cuotas sin interés está activo en Mercado
      Pago, y los textos (`cauce.pdp.cuotas` y `cauce.pdp.cuotas_escalon`) ahora dicen "sin
      interés". Si el plan se da de baja, `cauce_cuotas` vuelve a 0. El texto original: sale de
      `settings.cauce_cuotas`, que está en 3, dividiendo el total del escalón. La aritmética es
      exacta ($72.900 ÷ 3), pero el número **promete financiación sin interés**: si el medio de
      pago real cobra CFT, el precio por cuota que ve el cliente no es el que va a pagar. Tiene
      que coincidir con lo que efectivamente ofrece la pasarela, o `cauce_cuotas` vuelve a 0 y la
      línea desaparece sola. Es el mismo pendiente que ya tenía la línea de cuotas del carrito
      (`snippets/cauce-carrito-pago.liquid`), ahora también en la PDP.
- [ ] **"Menos de la mitad" en la letra chica (D-051).** *"Cada frasco te sale $24.300 en vez de
      $49.900. Menos de la mitad."* Es verdadera y verificable: $24.300 es $650 menos que la
      mitad de $49.900. **Pero depende de R6:** sin los descuentos automáticos cargados el
      carrito cobra $149.700 por tres frascos, o sea $49.900 por frasco, y la frase pasa a ser
      falsa. No es un pendiente propio, es una consecuencia más de R6 — y la más explícita de
      todas, porque acá el número está escrito a mano en el editor y no lo calcula el tema.

**Revisión**

- [ ] **BLOQUEANTE · Los 7 testimonios de `ss_glow_testimonial_3jmxKc`.** Es el único
      lugar de la tienda que hoy afirma un beneficio. Entre los siete dicen: cifras de
      glucemia ("amanezco con 90 y 92", "atascado en los 110"), plazos de resultado
      ("seis semanas", "ocho semanas"), aval de un profesional ("mi doctor se
      sorprendió"), patología ("la diabetes de mi papá"), y comparación con otro
      producto más efecto adverso ("la berberina me destrozó el estómago"). Cada uno
      es claim terapéutico bajo Disp. ANMAT 4980/05 aunque lo firme un cliente, y si
      no hay clientes reales detrás es además Res. SC 270/2020. Reescribir o quitar.
- [ ] Verificar que existan la persona y el consentimiento detrás de cada testimonio
      que quede, y que la foto sea de quien lo firma
- [ ] **BLOQUEANTE · La sección `dolor` de `cauce-landing` (D-033).** Es una lista de
      síntomas puesta arriba de un suplemento: "un número matutino que no baja",
      "bajones de energía y antojos de azúcar en la tarde", "peso terco alrededor del
      abdomen", "esa sensación de «¿sigo yo?» en cada análisis", y una bajada que dice
      que la comida moderna quita "el compuesto que tu cuerpo usa para limpiar el
      azúcar de la sangre". Ninguna línea afirma que el producto lo resuelva, pero la
      yuxtaposición lo sugiere, que es lo que Disp. ANMAT 4980/05 mira. Contradice
      además el §3.3 de este documento (glucemia, energía y metabolismo estaban en la
      lista de lo que la página deliberadamente no decía). Aprobar con criterio legal,
      reescribir sin síntoma, o quitar la sección. La sección se puede vaciar entera
      desde el editor sin tocar código: sin título, bajada ni items no renderiza nada.
- [ ] **BLOQUEANTE · La sección `solucion` de `cauce-landing` (D-034).** Las cuatro
      etiquetas de la grilla —"Azúcar Saludable", "Energía Estable", "Metabolismo de
      Glucosa", "Apoyo Antioxidante"— son la traducción literal de los claims impresos
      en las imágenes de Noverly que R1 manda reemplazar. Pasarlos de la foto al HTML no
      los cambia: son funciones atribuidas al producto (Disp. ANMAT 4980/05). Se suman la
      bajada, que describe el mecanismo ("ayuda a sacar el azúcar de la sangre y llevarlo
      a los músculos"), y la volanta "La molécula alemana", que es un claim de origen y
      necesita el certificado de materia prima de A4/B3. Es la sección que dice más cosas
      por metro cuadrado de toda la landing. Aprobar con criterio legal, reescribir con
      funciones respaldables, o quitarla. Se vacía entera desde el editor sin tocar
      código: sin título, bajada, ítems ni imagen no renderiza nada.
- [ ] **BLOQUEANTE · La sección `etapas` de `cauce-landing` (D-035).** Es el caso más
      directo de los tres bloques nuevos. Dibuja una progresión en el tiempo con
      valores de laboratorio ("108. Luego 112"), síntomas por etapa y un final que es
      una consulta médica y una mención a medicamentos ("la cita que tanto temías — la
      de los medicamentos"). Puesta en la página de un suplemento, la secuencia dice sin
      decirlo que el suplemento la frena: es el tipo de sugerencia que mira la Disp.
      ANMAT 4980/05, y la mención a medicamentos suma el problema de comparar con un
      tratamiento. Contradice el §3.3 igual que `dolor`. Aprobar con criterio legal,
      reescribir sin valores ni medicamentos, o quitarla. Se vacía entera desde el
      editor sin tocar código: sin título de sección ni etapas no renderiza nada.
- [ ] **BLOQUEANTE · La sección `progreso` de `cauce-landing` (D-036).** Es el más
      grave de los cuatro bloques nuevos, porque no describe una situación: promete un
      resultado y le pone fecha. "Semana 5–8: El Número se Mueve", "Semana 3–4: energía
      más estable en la tarde, menos antojos", "Semana 9–12+: protección antioxidante
      para las células". Un suplemento dietario no puede afirmar un efecto, y menos con
      cronograma (Disp. ANMAT 4980/05); el §3.3 listaba "cuánto tarda en hacer efecto"
      como algo que la página deliberadamente no decía. Aparte, los tres asteriscos del
      texto no remiten a ninguna nota al pie: una remisión a nada es un problema por sí
      sola (Ley 24.240 art. 4), y se arregla llenando el campo "Texto al pie" o sacando
      los asteriscos. Aprobar con criterio legal, reescribir la sección como **rutina**
      (cómo se toma, con qué comida, cuánto dura el frasco) en vez de como resultado, o
      quitarla. Se vacía entera desde el editor sin tocar código.
- [ ] **BLOQUEANTE · La sección `resultados` de `cauce-landing` (D-037).** Es el
      bloqueante más grave del tema, por encima de `progreso`. Publica tres cifras de
      eficacia —88 % mejores números matutinos, 91 % energía más pareja, 90 % más en
      control— atribuidas a una encuesta propia. Un porcentaje de resultado es
      publicidad verificable: hay que poder mostrar el cuestionario, el universo, las
      fechas y la pregunta textual (Res. SC 270/2020 y Ley 24.240 art. 8), y encima
      recae sobre una función fisiológica, que es Disp. ANMAT 4980/05. Contradice
      además el §4 de este documento, donde un "bloque de porcentajes de resultado" ya
      figuraba como descartado por ser cifra de eficacia. **Si la encuesta no existe,
      no hay redacción que arregle esto: las cifras se sacan.** Los tres
      `[[PENDIENTE: ...]]` del campo "Metodología de la encuesta" y de la volanta
      marcan exactamente qué falta. La alternativa que ocupa el mismo lugar sin
      depender de nadie son las cifras del rótulo y del COA: 600 mg por cápsula, 30
      días de frasco, días de garantía.
- [ ] **BLOQUEANTE · Los cuatro `collapsible_tab` de `main-product` en `cauce-landing`.**
      No estaban en este checklist y son la fuente más explícita del tema, porque son
      copy de referencia que nunca se reescribió. `collapsible_tab_VtLRkn` se titula
      "Beneficios clínicamente comprobados" y lista cinco funciones atribuidas al
      producto ("Favorece la función nerviosa saludable", "Ayuda a mantener niveles
      saludables de azúcar en sangre dentro del rango normal", "apoyo antioxidante para
      la salud celular"). `collapsible_tab_FCtjKz` describe síntomas ("te arden los
      pies, no puedes dormir"), compara con medicamentos ("cansado de medicamentos que
      te hacen sentir como un zombi mientras tus nervios se van muriendo") y afirma que
      el compuesto "se utiliza en Alemania como tratamiento con receta para la
      neuropatía diabética desde 1966" — patología con nombre y equiparación con un
      medicamento de venta bajo receta. `collapsible_tab_6yhWGL` pone plazos de
      resultado ("entre 3 y 5 semanas", "2 o 3 meses"). `collapsible_tab_aqXdqx` mezcla
      la posología real con tres funciones y una promesa de resultado ("dormir mejor,
      moverse con confianza y pensar con claridad"). Los seis problemas que este
      documento persigue —función atribuida, patología, plazo, comparación con
      medicamento, aval clínico y síntoma— están los seis acá. Reescribir con la
      transcripción del rótulo o vaciar los cuatro bloques. Los otros dos acordeones del
      mismo bloque, `acordeon_envios` y `acordeon_garantia`, ya están reescritos y se
      quedan como están.
- [ ] **BLOQUEANTE · La FAQ de entrada `cauce_faq_nNHY4y` de `cauce-landing`.** Tampoco
      estaba listada. Cinco preguntas de copy de referencia sin auditar: "¿Cuándo veré
      resultados?" responde con un plazo ("un cambio en 3 a 5 semanas, con beneficio
      completo en 2 a 3 meses"), la comparación con la berberina describe mecanismos de
      acción ("ayuda a llevar el azúcar al músculo"), y la última repite el bloque
      entero de claims de la referencia ("apoyando un azúcar saludable dentro del rango
      normal, energía estable todo el día y protección antioxidante") **junto con el
      nombre de la marca de referencia, "Noverly", que quedó en el texto publicado**.
      Agrava el caso que la sección tiene `emitir_schema: true`: las cinco preguntas se
      publican además como datos estructurados `FAQPage`, o sea que los claims van al
      índice de Google en formato declarado por la marca. La FAQ de cierre de la misma
      página (`faq`) ya está reescrita y sirve de modelo. Reescribir con preguntas de
      compra, o vaciar la sección desde el editor.
- [ ] **El sello "Cliente verificado"** de `ss_glow_testimonial_3jmxKc` (D-032). Decir
      verificado sin poder probar la compra es Res. SC 270/2020 por sí solo, aparte de lo
      que diga el texto. Destildar `verificado` en cada reseña que no tenga pedido detrás,
      o vaciar `etiqueta_verificado` para sacarlo de toda la sección.
- [ ] Los cuatro `[[PENDIENTE: nombre_resena_*]]` del mismo bloque, y confirmar que
      Margaret E., Frank D. y Carol V. corresponden a personas reales o reemplazarlos
- [ ] R5 · Tabla comparativa revisada con criterio legal
- [ ] Leer `docs/COPY-DRAFT.md` completo y aprobar o corregir cada texto
- [ ] Confirmar que ninguna imagen nueva, alt o metafield introduce un claim

---

## 7. Cómo auditar de nuevo

```bash
# Todo el copy de campaña
grep -rn "PENDIENTE" templates/ sections/*-group.json snippets/

# Los textos de sistema y legales
python -c "import json,re,io;s=io.open('locales/es.json',encoding='utf-8-sig').read();print(json.dumps(json.loads(re.sub(r'^\s*/\*.*?\*/','',s,flags=re.S))['cauce'],ensure_ascii=False,indent=2))"

# Los legales que se editan desde Configuración del tema
grep -n '"cauce_' config/settings_data.json

# Dónde se publica la leyenda de suplemento
grep -rn "render 'cauce-disclaimer'" --include=*.liquid --include=*.json .

# Buscar palabras prohibidas en todo el tema
grep -rniE "cura|trata|previene|alivia|reduce el|mejora la|neuropat|glucem|diabet|gabapentin|pregabalin|dolor|ansiedad"   templates/ sections/cauce-*.liquid sections/*-group.json snippets/cauce-*.liquid   locales/es.json config/settings_data.json   | grep -viE "cauce-dolor|/dolor[0-9]|oscura|\"dolor\""
```

### Dónde se renderiza `cauce-disclaimer`

Son **siete** lugares. El texto sale de un solo campo (`settings.cauce_disclaimer_texto`,
con fallback al locale — ver D-044), así que cambiarlo es atómico; esta lista existe para
saber dónde se ve.

| Archivo | Qué instancia | Versión |
|---|---|---|
| `sections/cauce-legal-bar.liquid` | la barra legal del pie, en todas las páginas | compacta |
| `templates/product.cauce-landing.json` | bloque `disclaimer` de la PDP | completa |
| `templates/product.cauce-landing.json` | bloque `cierre` de la landing | compacta |
| `snippets/cart-drawer.liquid` | bloque `legal_note` del carrito lateral | compacta |
| `sections/main-cart-items.liquid` | el mismo bloque en `/cart` | compacta |
| `templates/product.hormify.json` | bloque `disclaimer` de la PDP de Hormify | completa |
| `templates/product.hormify.json` | bloque `cierre` de Hormify | compacta |

Los dos últimos entran con el carrito CAUCE (D-046). Son la misma pieza en las dos
superficies del carrito, no dos redacciones.

### El resultado esperado del último grep

Hoy son **ocho coincidencias: cinco inocuas y tres que ya están abiertas en el §6.**

| Coincidencia | Estado |
|---|---|
| `product.cauce-landing.json` → "Una rutina, no un **tratamiento**" | Inocua. Es una negación: dice explícitamente que el producto no es un tratamiento. |
| `cauce-newsletter.liquid` ×2 → "**trata**r datos personales" | Inocua. Comentario de código sobre Ley 25.326, no es texto de storefront. |
| `cauce-solucion.liquid` ×2 → "el bloque de **dolor**" | Inocua. Comentario y `info` del editor que nombran a la sección vecina. |
| `product.cauce-landing.json:296` → "te arden los pies… **neuropat**ía" | **Abierta.** Es `collapsible_tab_FCtjKz`, ya listado como bloqueante en el §6. |
| `product.cauce-landing.json:537` → "La **diabet**es de mi papá" | **Abierta.** Es un testimonio de `ss_glow_testimonial_3jmxKc`, §6. |
| `product.cauce-landing.json:822` → "a medida que **mejora la** absorción" | **Abierta.** Es la sección `progreso`, §6. |

El filtro `grep -v` del final saca dos familias de falsos positivos que aparecieron
después de escribir esta receta: `cura` matchea dentro de "os**cura**" y la sección
`cauce-dolor` (D-033) matchea por su propio nombre en cada una de sus clases. Sin ese
filtro el comando devuelve cuarenta líneas de ruido y deja de servir para lo único que
sirve, que es notar la coincidencia número nueve.

Desde D-054 el grep devuelve además **cuatro líneas de `product.hormify.json`** ("alivia",
"ansiedad", "mejora la" y "tratamiento"). Son decisión comercial y están en el §8.1; ese
template se audita con su propio grep (§8.4).

Cualquier coincidencia que no esté en esa tabla hay que mirarla. Si aparece en
`templates/`, `locales/es.json` o `config/settings_data.json`, es un claim que se coló.

---

## 8. Hormify (`templates/product.hormify.json`) — otra regla, por decisión comercial

Ver `DECISIONS.md` D-054. **Las §1 a §3 no aplican a este SKU.** El 2026-09-16 el comercio eligió
que la PDP de Hormify hable como la referencia (hormify.com): síntomas con nombre, funciones
atribuidas y plazos. Se le mostraron antes las dos alternativas (§2 de este archivo, o "síntomas
sí, promesas no") y el riesgo ANMAT y de rechazo en Meta Ads. Este apartado no reabre la decisión:
lista qué se publica, qué evidencia haría falta si alguien la pide, y qué **no** se hizo aunque la
referencia lo hace.

La regla 1 sí se mantiene: **ningún claim está en un `.liquid`**. `cauce-contraste` y
`cauce-ingredientes` traen la advertencia en su cabecera, igual que `cauce-dolor`.

### 8.1 Inventario

| # | Afirmación (resumida) | Tipo | Dónde | Qué lo sostendría |
|---|---|---|---|---|
| H1 | Ayuda a combatir el peso hormonal / "tu peso vuelve a responder" | eficacia | hero, contraste, solución y cierre (home) · comparativa, progreso | estudios de la fórmula, no de ingredientes sueltos |
| H2 | Reduce la hinchazón / "una panza más liviana" | eficacia | hero, contraste y solución (home) · ingredientes (jengibre), comparativa, progreso | ídem |
| H3 | Equilibra las hormonas; apoyo al estrógeno y la progesterona | eficacia hormonal | hero, contraste y solución (home) · ingredientes (maca), FAQ | ídem. Es el más cercano a un efecto farmacológico |
| H4 | Alivia sofocos y sudores nocturnos | síntoma de menopausia | contraste y cierre (home) · progreso, FAQ | ídem |
| H5 | Menos estrés y cortisol, mejor humor, más energía | eficacia | hero, contraste y solución (home) · ingredientes, progreso | ídem |
| H6 | "Un ciclo más predecible" | síntoma ginecológico | contraste (home) · progreso | ídem |
| H7 | Acompaña el SOP, la perimenopausia y la menopausia | **patología con nombre** (SOP) | comparativa, FAQ | — |
| H8 | Plazos: cambios en días, los más claros entre el mes 2 y el 3 | plazo de resultado | progreso, FAQ | datos propios de uso |
| H9 | Ocho activos y qué hace cada uno | composición + función | ingredientes, comparativa, FAQ | **el rótulo tiene 24 componentes, no 8** (§8.3). La pestaña Ingredientes lo transcribe entero desde D-066 |
| H10 | Sin hormonas · activos de origen natural | composición | hero y solución (home) · sellos, comparativa, FAQ | rótulo. "Origen natural" no es exacto para B6, B12 y el óxido de zinc (§8.3) |
| H11 | Analizado por laboratorio externo · producción nacional | proceso / origen | sellos, comparativa | COA de un tercero y RNE del elaborador **de este SKU** (A3 y A4 son del R-ALA) |
| H12 | "Otros suplementos" no tienen H1–H11 | comparativa | `comparativa` | que sea verdad para la categoría; con una sola X en contra de todo el resto, es la fila más expuesta de la página (mismo riesgo que R5) |
| H13 | ~~Cinta `RESULTADOS ÓPTIMOS · 90 DÍAS`~~ | eficacia + plazo | — | salió en D-066; en su lugar va H17 |
| H14 | Costo por día (`$1.763/día` desde D-069) contra "Según la marca" | precio | `comparativa`, fila de precio | se calcula del precio de la variante sobre 30 días, redondeado al peso: si cambia el precio, cambia la fila. El precio total sigue en el bloque de compra. "Según la marca" no afirma ningún precio ajeno; poner uno sería un claim que hay que poder probar (D-058) |
| H15 | La B6 contribuye a regular la actividad hormonal y a disminuir el cansancio; el ácido pantoténico, a la síntesis de hormonas esteroideas; la B12, a la función psicológica normal | función de nutriente | bajada por ángulo (`identidad`, `energia`), `solucion` (mecanismo, D-068) y pie de `dolor` | cantidad significativa en el rótulo (B6 224 %, B12 2.250 %, B5 50 %) y la redacción de las declaraciones autorizadas del Reg. UE 432/2012. En Argentina la tiene que validar quien tramite el RNPA |
| H16 | Cinta `EL MÁS ELEGIDO` | popularidad | escalón 2 | pedidos reales. **Bloqueante** (§8.3): es el mismo caso que D-047b |
| H17 | Cinta `MEJOR PRECIO POR DÍA` | precio | escalón 3 | verdadera por cálculo: $861 contra $1.082 y $1.763 con los precios de D-069 (antes $810, $1.032 y $1.663; `[precio_dia]`, D-066). Si cambia la escalera de precios, hay que revisarla |
| H18 | "30 días para devolverlo", con el frasco cerrado | condición comercial | barra de anuncio (global), íconos, línea bajo el botón, marquesina, garantía, acordeón Devoluciones, cierre, bajada `transparencia` | la regla escrita en los Términos del servicio (§8.3). Vale para toda la tienda porque la barra es global |
| H19 | 3 cuotas sin interés | condición comercial | barra, marquesina, renglón bajo los escalones, medios de pago, carrito, cierre | plan activo en Mercado Pago, confirmado por el comercio el 2026-09-27 |
| H20 | Cinco situaciones sin promesa: cansancio al levantarse, el jean que aprieta, irritabilidad, despertarse de madrugada, menos ganas | síntoma, sin efecto atribuido | `dolor` (D-068) | nada que probar: ninguna línea dice que el producto lo resuelva. El riesgo es la yuxtaposición con el producto (Disp. ANMAT 4980/05), el mismo que D-033 anotó para el R-ALA. Es la línea "síntomas sí, promesas no" |

**Desde D-065 la tabla vale también para `templates/index.json`.** La home dejó de vender el R-ALA y
pasó a vender Hormify reusando estas mismas secciones —hero, contraste, solución, ingredientes,
progreso, comparativa, FAQ y cierre—, con el texto copiado, así que H1 a H12 se publican además en
la portada. No hay ningún claim nuevo: lo que no está en esta tabla no entró. Las dos filas que
**no** viajaron son H13, que vive en el escalón de packs, y H14, que necesita una variante para
calcular el costo por día y fuera de una página de producto no se dibuja.

**Desde D-066 la PDP publica menos de esta tabla que la home, y desde D-068 todavía menos:** `contraste` salió de la PDP y `solucion` pasó a ser el mecanismo, así que H1–H6 ya no están en la PDP fuera de `ingredientes`, `comparativa`, `progreso` (apagada) y la FAQ. Salieron de la PDP la bajada y los
íconos del bloque de compra (H1, H2, H3, H5), las pestañas Beneficios, Para quién y Cuándo (H1–H5,
H7, H8), la bajada del selector (H8), la cinta H13, las viñetas del cierre (H1, H2, H4 y "de origen
natural") y los síntomas de la marquesina. **La home no se tocó** y sigue publicando todo eso en su
hero y en su cierre. Siguen en la PDP, por decisión del comercio del 2026-09-27: `contraste`,
`solucion`, `ingredientes`, `ugc`, `comparativa` y la FAQ, tal como estaban.

Los "*" de `progreso` remiten al pie: *"Los resultados varían de una persona a otra. Acompañá la
rutina con una alimentación equilibrada y actividad física."* La leyenda de suplemento
(`cauce-disclaimer`) sale en el bloque `disclaimer` del hero y en el `cierre`, igual que en el R-ALA
— y en la home, en el `cierre`.

### 8.2 Lo que la referencia hace y esta página no

| En hormify.com | Por qué no | Qué hay |
|---|---|---|
| "98,325 reviews", 4.8 estrellas | No hay reseñas. Un número inventado es publicidad engañosa (Ley 24.240 art. 9, Res. SC 270/2020) con o sin ANMAT | bloque `resenas` **apagado**, con `[[PENDIENTE]]` |
| "11,327+ women in our internal study", 93 % / 92 % / 83 % / 97 % | No hay estudio | `resultados` **apagada**, con `[[PENDIENTE]]` |
| Testimonios | No hay clientas | `resenas` (glow) **apagada**, sin nombres ni fotos. **`ugc` dejó de estar vacía el 2026-09-20** (`c68e91e`, desde el editor): tres tarjetas con los testimonios de hormify.com traducidos, un nombre copiado tal cual y el frasco con rótulo en inglés. Se quedan por decisión del comercio del 2026-09-27; ver §8.3 |
| Las fotos de clientas de hormify.com | Son de otra marca, muestran **otro frasco** y salen personas identificables. Publicarlas sería testimonio inventado (Ley 24.240 art. 9), foto ajena y uso de imagen sin consentimiento (Ley 11.723 art. 31) | nada: las tarjetas piden foto propia y permiso escrito |
| Logos de Women's Health, Forbes, Healthline | Sería afirmar una cobertura que no existe | nada |
| "Made in FDA registered facility" | No aplica en Argentina | nada |
| "Most popular" | Popularidad sin ventas (D-047b) | cinta de resultado |
| "Generally compatible with birth control" | Afirmación de seguridad sin respaldo. Ashwagandha y ginseng tienen interacciones descriptas | **dejó de ser cierto el 2026-09-20** (`eae3603`, desde el editor): la FAQ dice que es "generalmente compatible con la mayoría de los medicamentos, incluyendo muchos métodos anticonceptivos". La FAQ se dejó como estaba por decisión del 2026-09-27; ver §8.3 |

### 8.3 Bloqueantes para publicar Hormify

- [ ] **La fórmula real.** Se conoce desde el 2026-09-26: el rótulo trae 9 componentes con dosis y una
      "Mezcla Patentada" de 802 mg con 15 plantas, o sea 24, no 8. Los 8 de la PDP son los mismos que
      destaca hormify.com. La pestaña Ingredientes transcribe el rótulo entero (D-066); la sección
      `ingredientes`, la comparativa ("8 activos… en una cápsula": la porción es de 2) y la FAQ 1
      siguen con los 8 por decisión del comercio del 2026-09-27. Dos detalles del rótulo: los %VD están
      calculados con valores de la FDA y no con las IDR del CAA, y "Mezcla Patentada" traduce mal
      *proprietary blend*: habla de una patente.
- [ ] **Dosis por porción** en los ocho bloques `ingrediente` y el
      `[[PENDIENTE: composición completa…]]` de la pestaña Ingredientes, copiados del rótulo.
- [ ] **RNPA del producto** y RNE del elaborador de este SKU. Sin eso H11 no se puede publicar.
- [ ] **COA de este SKU**, si se mantiene "Analizado por laboratorio externo".
- [ ] **Advertencias del rótulo.** La página dice que no se recomienda en embarazo ni lactancia. Confirmar
      que el rótulo dice lo mismo y sumar cualquier otra advertencia que traiga.
- [ ] **Precio de Hormify** y los dos `fixed_amount_off` del bloque `ofertas` (hoy son los del
      R-ALA, D-054 §4), con sus descuentos automáticos **limitados a este producto**.
- [ ] **Fotos propias**, sin claims que no estén en esta tabla (R1 aplica igual).
- [ ] **Nombre.** "Hormify" es el nombre de la marca de referencia. Verificar en INPI antes de
      invertir en pauta.
- [ ] **Metafields de categoría de Shopify** (R4): "Enfoque de salud" con hormonas o menopausia
      puede disparar revisión en Google Merchant.
- [ ] Revisión con criterio legal de 8.1 completo, en especial **H3, H4, H6, H7 y H15**.
- [ ] **BLOQUEANTE · `EL MÁS ELEGIDO` en el escalón 2 (H16, D-066 §6).** Afirma algo sobre lo que eligen
      otras compradoras sin ventas que lo respalden. Confirmarlo contra los pedidos cuando los haya, o
      sacarlo: es `option_2_badge` del bloque `ofertas`.
- [ ] **La regla de los 30 días en los Términos del servicio (H18, D-066 §2)**, antes de la primera
      devolución: plazo desde la recepción, frasco cerrado, qué se reintegra en un pack y quién paga
      el envío de vuelta. Va junto con la regla de `TRANSFERENCIA10` que ya pedía el §6.
- [ ] **`¿Quién no debería tomarlo?`**, el acordeón nuevo (D-066), validado por un farmacéutico y
      contra el rótulo: embarazo y lactancia, fenilcetonuria (L-fenilalanina), anticoagulantes,
      antidepresivos, tiroides, diabetes, condiciones sensibles a hormonas y cirugías programadas.
- [ ] **Los testimonios de `ugc`** son de otra marca (§8.2). Siguen siendo testimonio inventado aunque
      la sección se haya quedado por decisión comercial: Ley 24.240 art. 9 y uso de imagen ajena.
- [ ] **La FAQ de anticonceptivos** (§8.2) afirma una compatibilidad que nadie estudió con esta fórmula,
      que lleva ginkgo, dong quai y ginseng. Es la frase más expuesta de la página.

### 8.4 Cómo auditar este SKU

El grep del §7 está pensado para el R-ALA y casi no ve a Hormify (4 coincidencias: "alivia",
"ansiedad", "mejora la" y "tratamiento", todas en 8.1). Para este template:

```bash
grep -niE "peso|hinchaz|panza|hormon|estr[oó]geno|progesterona|sofoco|sudor|ciclo|SOP|menopaus|cortisol|estr[eé]s|[aá]nimo|humor|antojo|d[ií]as|mes " templates/product.hormify.json templates/index.json
```

Cualquier coincidencia que no esté cubierta por una fila de 8.1 es un claim nuevo.
