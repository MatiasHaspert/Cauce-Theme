# COPY-DRAFT.md — propuesta de textos, **sin aprobar**

Todo lo que sigue es un **borrador** cargado como valor por defecto en settings y locales
para poder ver la página armada. **Nada de esto está aprobado.** Revisalo antes de que la
tienda salga de modo contraseña.

Cobertura: fases 2 a 4 (home mínima, barra de anuncio, hero de la PDP y cuerpo de la
landing, bloques 4 a 14). El cierre y los legales (bloques 15 a 20) se agregan en la fase 5.

Convenciones:

- **Riesgo** — qué habría que verificar antes de publicarlo.
  - `dato` = afirma un hecho verificable; hay que poder respaldarlo con un documento.
  - `forma` = solo redacción, sin exposición legal.
  - `pendiente` = tiene un placeholder sin resolver.
- La auditoría legal por claim vive en `docs/CLAIMS-AUDIT.md`. Acá está el texto crudo.

---

## 1. Barra de anuncio · `sections/header-group.json`

| # | Texto | Riesgo |
|---|---|---|
| 1 | Envío gratis en compras desde $ `[[PENDIENTE: umbral_envio_gratis]]` | `pendiente` — el umbral tiene que existir como envío gratis real configurado |
| 2 | 10 % OFF pagando con transferencia | `dato` — exige el método manual Transferencia bancaria y el código `TRANSFERENCIA10` cargados en Shopify (D-052, §6). Escrito a mano: si cambia `cauce_transferencia_pct` hay que reescribirlo |
| 3 | Producción nacional. Análisis por laboratorio externo. | `dato` — exige que la producción sea nacional y que exista COA de un tercero |

---

## 2. Home · `templates/index.json` — **reemplazada (D-065)**

> Lo que sigue es la home del R-ALA y **ya no está publicada**. Desde D-065 `index.json` vende
> Hormify reusando las secciones de su PDP, así que el copy de la home vive en el §10 de este
> archivo, no acá. Se deja el texto viejo porque el R-ALA puede volver.

### Hero

| Campo | Texto | Riesgo |
|---|---|---|
| Volanta | Fórmulas de uso diario | `forma` |
| Título | Lo que tomás todos los días debería explicarse en una sola línea. | `forma` |
| Texto | Cada fórmula lleva la lista completa de lo que contiene y en qué cantidad. Sin mezclas propietarias, sin letra chica y sin promesas que no podamos sostener. | `dato` — compromete a no usar *proprietary blends* en ningún SKU futuro |
| Botón | Ver la fórmula | `forma` |

### Pilares

| Título | Texto | Riesgo |
|---|---|---|
| Forma R pura | El isómero R, no la mezcla racémica que se usa por defecto porque sale más barata. | `dato` — afirma que el producto es R puro; el COA lo tiene que decir |
| 600 mg por cápsula | La cantidad está en la etiqueta y coincide con el análisis. Una cápsula, una dosis. | `dato` — el análisis tiene que dar 600 mg |
| Análisis por laboratorio externo | Cada lote se analiza en un laboratorio que no es el nuestro. Publicamos el COA. | `dato` — compromete a publicar el COA **de cada lote**, no de uno |
| Producción nacional | Se produce en Argentina. Trazabilidad de lote y tiempos de entrega reales. | `dato` |

### Manifiesto

| Campo | Texto | Riesgo |
|---|---|---|
| Título | Hecho para todos los días | `forma` |
| Texto | CAUCE es una marca argentina de fórmulas de uso diario. Elegimos contar la composición completa, publicar los análisis y no prometer resultados. Si algo no lo podemos sostener con un documento, no lo escribimos. | `forma` |

> Nota: "no prometer resultados" es una promesa de marca que conviene sostener. Si más
> adelante alguna sección afirma un resultado, este párrafo la contradice en la misma web.

---

## 3. Hero de la PDP · `templates/product.cauce-landing.json`

### Encabezado

| Campo | Texto | Riesgo |
|---|---|---|
| Título | *(sale del título del producto en Shopify)* | — |
| Subtítulo | Isómero R puro, sin mezcla racémica. 30 cápsulas de producción nacional. | `dato` |

Deliberadamente dice **qué es**, no para qué sirve. No hay ninguna referencia a
neuropatía, glucemia, dolor, energía ni antioxidación: todas caen en claim terapéutico
bajo Disp. ANMAT 4980/05.

### Bullets

| Ícono | Texto | Riesgo |
|---|---|---|
| `science` | Forma R pura, no racémica | `dato` |
| `medication` | 600 mg por cápsula | `dato` |
| `biotech` | Analizado por laboratorio externo | `dato` |
| `factory` | Producción nacional | `dato` |

Los cuatro son los mismos pilares de la home, a propósito: es el eje argumental de la
marca y conviene que se repita.

### Selector de oferta

Actualizado en D-051: el destaque pasó del escalón 2 al 3 y la grilla sumó tres renglones por
tarjeta (ahorro, envío, cuotas). Los precios son los de D-050.

**D-052 suma un renglón más en las cuatro tarjetas:** el precio con transferencia, calculado desde
el total del escalón y `cauce_transferencia_pct`. Sin porcentaje o sin código cargados en
Configuración del tema → CAUCE → Pagos, la línea no se dibuja.

| Campo | Texto | Riesgo |
|---|---|---|
| Encabezado | UNA CÁPSULA POR DÍA · CADA FRASCO, UN MES | `dato` — exige que el envase rinda un mes a una cápsula por día. Es lo mismo que tendrían que decir los metafields de dosis |
| Bajada | Los ensayos clínicos con R-ALA evalúan tomas diarias sostenidas de 8 a 12 semanas. | `dato` — **BLOQUEANTE**. Afirmación sobre literatura científica: exige la cita de los ensayos. §6 |
| Escalón 1 | **1 frasco · 30 días** · *+ envío* · *$44.910 con transferencia* · **$49.900** | `forma`, salvo la línea de transferencia: `dato` — exige el código `TRANSFERENCIA10` en Shopify (§6) |
| Escalón 2 | **2 frascos · 60 días** · $30.950 por frasco · *Ahorrás $37.900* · *Envío gratis* · *$55.710 con transferencia* · **$61.900** ~~$99.800~~ | `dato` — exige el descuento automático de 2×$61.900 y el código `TRANSFERENCIA10` combinable con él |
| Escalón 3 | cinta **LA TOMA COMPLETA · 90 DÍAS** · **3 frascos · 90 días** · $24.300 por frasco · *Ahorrás $76.800* · *Envío gratis* · *$65.610 con transferencia* · *3 cuotas de $24.300* · **$72.900** ~~$149.700~~ | `dato` — exige el descuento automático de 3×$72.900, el código `TRANSFERENCIA10` combinable con él y la financiación real de las 3 cuotas (§6). Es el escalón preseleccionado y el único con fondo SEDIMENTO |
| CTA | Agregar 3 frascos · $72.900 | `forma` — se arma solo desde el escalón elegido. Cambia con el radio, sin recargar |
| Letra chica 1 | Cada frasco te sale $24.300 en vez de $49.900. Menos de la mitad. | `dato` — verdadera por $650, pero **depende de R6**: sin los descuentos automáticos el frasco sigue saliendo $49.900. §6 |
| Letra chica 2 | El precio tachado es lo que costarían esos frascos comprados de a uno. | `forma` |
| Letra chica 3 | Los packs de 2 y 3 frascos van con envío sin cargo. | `dato` — exige la tarifa real de envío sin cargo desde $55.000 (D-052). Ya no nombra el umbral: lo dice por escalón |

Lo que salió en D-051 y no vuelve sin datos: la cinta **EL MÁS ELEGIDO** del escalón 2 (era una
afirmación sobre otros compradores, §6) y el pill **El 2º sale $12.000** (con el pack de 3 a
$72.900 el tercer frasco salía más barato que el segundo, así que el pill era el peor argumento
de la grilla — ver D-050).

El único texto del bloque que sigue escrito a mano es la **letra chica 1**, porque nombra dos
precios. Los renglones nuevos de cada tarjeta —ahorro, envío, transferencia y cuotas— los calcula el tema
y no hay nada que mantener cuando cambie un precio.

"frasco" es un valor de setting del template en los títulos de fila, así que para un SKU en
polvo se cambia a "envase" desde el editor. **Desde D-051 la palabra también vive en el locale**,
en `cauce.pdp.cta_agregar`, porque el CTA la pluraliza ("1 frasco" / "3 frascos"). Son dos
lugares, no uno.

**La duración dejó de salir del token `[duracion]` y ahora está escrita en el título de cada
fila** (D-051). El token sigue existiendo y sigue guardado por D-003 —sin los metafields de
dosis no dibuja nada— pero ya no se usa acá: el bloque pedía "30 / 60 / 90 días" y los
metafields están vacíos. La consecuencia es que si el envase cambia de conteo, los tres títulos
hay que reescribirlos a mano. Anotado en el §6, junto al pendiente de los metafields.

La alternativa que ocupaba ese lugar y no depende de nadie es la aritmética marginal: el
segundo frasco cuesta $10.000, y el precio por frasco cae $19.950 del 1 al 2 contra $2.650 del
2 al 3. Hoy esa frase sigue en la página, corrida al pill.

**Los dos números escritos a mano.** `$10.000` en la cinta del escalón 2 y la palabra "gratis"
en la del 3. Todo lo demás lo calcula el tema desde el precio de la variante. Si cambian los
precios, esas dos cintas hay que reescribirlas a mano.

### Acordeones

| Acordeón | Origen del texto | Riesgo |
|---|---|---|
| Envíos y entrega | setting del template | `pendiente` ×3 |
| Cambios y devoluciones | setting del template | `dato` — refleja el derecho de arrepentimiento |

> Actualizado en la fase 4: composición, modo de uso y análisis salieron del hero y
> viven en las pestañas del bloque 14. Leían el mismo metafield y aparecían dos veces en
> la misma página. Ver `DECISIONS.md` D-020.

Texto actual de **Envíos y entrega**:

> Despachamos desde `[[PENDIENTE: ciudad_deposito]]`. El plazo estimado es de
> `[[PENDIENTE: plazo_envio]]` días hábiles y el costo se calcula en el checkout según tu
> código postal. Envío sin cargo en compras desde $ `[[PENDIENTE: umbral_envio_gratis]]`.

Texto actual de **Cambios y devoluciones**:

> Tenés 10 días corridos desde que recibís el pedido para arrepentirte de la compra y
> pedir la devolución del importe pagado, sin costo (Res. SCI 424/2020). El producto tiene
> que estar sin abrir.
>
> Para iniciarlo, entrá al botón de arrepentimiento del pie de página o escribinos a
> cauce@caucearg.com.

> **Revisar con criterio legal.** "El producto tiene que estar sin abrir" es una condición
> que la marca elige, y el derecho de arrepentimiento de la Res. SCI 424/2020 no la exige
> con esa amplitud. Si se sostiene, tiene que estar igual en la política de devoluciones,
> no solo acá.

---

## 4. Textos de sistema · `locales/es.json → cauce.*`

Estos no son copy de campaña, son textos que se repiten en toda la tienda. Están acá
porque también hay que leerlos antes de publicar.

| Clave | Texto |
|---|---|
| `marca.descriptor` | Fórmulas de uso diario |
| `legal.suplemento` | Este producto es un suplemento dietario. No reemplaza una alimentación variada. |
| `legal.consulta_medico` | Consultá a tu médico. |

> **`legal.suplemento` y `legal.consulta_medico` son ahora el valor por defecto, no el
> único.** Se editan desde **Configuración del tema → CAUCE → Legales** y el valor cargado
> queda en `config/settings_data.json` (`cauce_disclaimer_texto` y
> `cauce_disclaimer_consulta`). Si esos campos quedan vacíos vuelve el texto de acá, para que
> una leyenda obligatoria no pueda desaparecer por un borrado accidental. Ver D-044.
| `legal.arrepentimiento_texto` | Podés arrepentirte de tu compra dentro de los 10 días corridos de recibido el producto y pedir la devolución del importe pagado, sin costo. Res. SCI 424/2020. |
| `legal.precio_iva` | Precios en pesos argentinos con IVA incluido. |
| `pdp.duracion_dias` | {{ dias }} días de uso |
| `pdp.cuotas` | Hasta {{ cuotas }} cuotas con tarjeta |
| `pdp.transferencia_escalon` | {{ monto }} con transferencia |
| `carrito.transferencia_ahorro` | Con transferencia ahorrás {{ monto }} |
| `carrito.transferencia_off` | {{ pct }} % OFF |
| `carrito.transferencia_codigo_html` | Cargá el código {{ codigo }} al finalizar la compra y elegí Transferencia bancaria. |
| `newsletter.consentimiento` | Acepto recibir emails de CAUCE y que mis datos se traten según la Política de Privacidad (Ley 25.326). Puedo darme de baja cuando quiera. |
| `newsletter.exito` | Listo. Te vamos a escribir poco y sólo cuando valga la pena. |

---

## 6. Cuerpo de la landing (fase 4) · `templates/product.cauce-landing.json`

Orden real de la página: hero → pilares → videos → 4 cards → ficha técnica →
explicación → banda oscura → detalle → marquee → rutina → *(reseñas, desactivada)* →
pestañas.

### 6.1 Pilares (bloque 4) · `icon-bar`

Repiten los cuatro bullets del hero, ahora con una frase de fundamento cada uno. La
repetición es deliberada: el hero enuncia, esta sección sostiene.

| Título | Texto | Riesgo |
|---|---|---|
| Forma R pura | El ácido alfa lipoico se vende casi siempre como mezcla racémica: mitad isómero R, mitad S. Acá es solo el R. | `dato` — el COA lo tiene que confirmar |
| 600 mg por cápsula | La dosis diaria declarada entra en una cápsula. No hay que tomar tres para llegar al número de la etiqueta. | `dato` |
| Análisis por laboratorio externo | Cada lote se analiza en un laboratorio independiente y el certificado se publica junto al número de lote. | `dato` — compromete a publicar por lote |
| Producción nacional | Se elabora en Argentina. Eso define la trazabilidad del lote y los tiempos de entrega reales. | `dato` |

### 6.2 Videos (bloque 5) · `cauce-ugc`

Cuatro tarjetas vacías. La sección no renderiza nada hasta que se cargue al menos un
video o un poster. Título propuesto: **Quienes ya lo toman**.

> El texto de cada tarjeta no puede mencionar patologías, síntomas, plazos de resultado ni
> profesionales de la salud, **aunque lo diga un cliente**. La advertencia está escrita en
> el editor, arriba de los campos.

### 6.3 Cuatro cards (bloque 6) · `multicolumn`

Título: **Cuatro cosas que se pueden verificar**

| Card | Texto | Riesgo |
|---|---|---|
| Composición | Un solo activo. Ácido R-alfa lipoico y los excipientes necesarios para la cápsula, todos declarados en el rótulo. | `dato` |
| Dosis | 600 mg por cápsula, una por día. La cantidad que dice la etiqueta es la que mide el análisis. | `dato` |
| Origen del ingrediente | La materia prima llega con su propio certificado de análisis, que queda asociado al lote que se produce con ella. | `dato` — exige que ese certificado exista |
| Control de lote | Cada lote se analiza antes de salir: identidad del compuesto y contenido por cápsula, en laboratorio externo. | `dato` |

> Reemplacé la card de *biodisponibilidad* que pedía el brief. Ver `DECISIONS.md` D-021:
> cualquier redacción útil de esa card es un claim de eficacia comparativa.

### 6.4 Ficha técnica (bloque 7) · `cauce-datos`

Volanta **Ficha técnica**, título **Los números que sí podemos publicar**.

| Etiqueta | Valor | Origen |
|---|---|---|
| Formato | 30 cápsulas blandas | metafield `cauce.formato`, con respaldo fijo |
| Activo por cápsula | 600 mg — *Ácido R-alfa lipoico* | valor fijo |
| Forma química | Isómero R — *Sin mezcla racémica* | valor fijo |
| Elaboración | Argentina | valor fijo |

Nota al pie: *Los valores corresponden al rótulo declarado. El resultado del análisis del
lote vigente está en la pestaña Análisis de laboratorio.*

> El título juega con que la referencia pone porcentajes de resultado en este lugar. Si te
> suena a que señala demasiado el hueco, cambialo por *La ficha, completa*.

### 6.5 Explicación (bloque 8) · `multicolumn`, 2 columnas

**Qué es el ácido alfa lipoico**

> Es un compuesto que el organismo produce en cantidades pequeñas y que también aparece en
> algunos alimentos. Se describió por primera vez en la década del cincuenta y desde
> entonces se usa como ingrediente de suplementos dietarios en buena parte del mundo.
>
> Como suplemento se presenta en cápsulas, y la cantidad por unidad es el dato que define
> de qué se está hablando. Por eso está en el frente del envase y no en la letra chica.

**Por qué la forma R**

> Sintetizado en laboratorio, el ácido alfa lipoico se obtiene como una mezcla de dos
> isómeros en partes iguales: R y S. El R es la forma que existe en la naturaleza; el S es
> su imagen especular y no aparece por fuera de la síntesis química.
>
> Separar los dos encarece la producción. Por eso la mayoría de los suplementos se venden
> como mezcla racémica, sin aclararlo. Esta fórmula usa únicamente el isómero R, y el
> análisis de lote lo verifica.

`dato` — *"década del cincuenta"* es verificable (el ácido lipoico se aisló en 1951). Es
recorrido de la molécula, no de la marca, que es lo que el brief habilita. **No dice para
qué sirve en ningún momento**, y esa ausencia es intencional.

### 6.6 Banda oscura (bloque 9) · `icon-bar` en TINTA

La única sección con fondo oscuro de la página. Título: **Comprar acá**.

| Ícono | Título | Texto | Riesgo |
|---|---|---|---|
| envío | Envío a todo el país | `[[PENDIENTE: plazo_envio]]` días hábiles. El costo se calcula en el checkout según tu código postal. | `pendiente` |
| devolución | 10 días para arrepentirte | Sin costo y sin explicar por qué, como marca la Res. SCI 424/2020. | `dato` |
| candado | Pago procesado por Mercado Pago | Nosotros no vemos ni guardamos los datos de tu tarjeta. | `dato` — cierto con MP, confirmá si se suma otro medio |
| mail | Te contestamos | cauce@caucearg.com | `dato` |

### 6.7 Detalle (bloque 10) · `cauce-acordeon-detalle`

Volanta **Letra chica, en grande**, título **En detalle**. Estos tres ítems son
**provisorios**: en cuanto cargues el metafield `cauce.beneficios`, la sección los ignora y
usa el metafield.

| Ítem | Texto | Riesgo |
|---|---|---|
| Qué lleva la cápsula | Ácido R-alfa lipoico como único activo, más los excipientes necesarios para la cápsula blanda. La lista completa, con sus cantidades, está en el rótulo y en la pestaña de composición. | `dato` |
| Qué no lleva | No lleva mezclas propietarias: no existe un «blend» donde no se sepa cuánto hay de cada cosa. Tampoco isómero S agregado para abaratar el gramaje. | `dato` |
| Cómo leer el análisis de lote | El certificado indica el número de lote, la fecha del ensayo, el laboratorio que lo hizo y dos resultados: identidad del compuesto y contenido por cápsula. El número de lote del certificado tiene que coincidir con el de tu envase. | `forma` |

### 6.8 Marquee (bloque 11) · `horizontal-ticker`

Producción nacional · Isómero R puro · Análisis por lote · Envío a todo el país · 10 días
de arrepentimiento

En SEDIMENTO 2, no en bronce: cinco marcas de confianza en un color de acento serían
demasiado peso para una tira decorativa. Se frena al pasar el mouse y respeta
`prefers-reduced-motion`.

### 6.9 Rutina (bloque 12) · `multicolumn`, 3 columnas

Título: **Una rutina, no un tratamiento**

| Columna | Texto |
|---|---|
| Los primeros días | Elegí un momento fijo y asociá la cápsula a algo que ya hacés: el desayuno, el café, lavarte los dientes. La constancia se sostiene mejor cuando no depende de acordarse. |
| Las primeras semanas | Un frasco cubre un mes de uso diario. Es el tiempo en el que la rutina deja de ser una decisión de todos los días y pasa a ser costumbre. |
| El uso sostenido | Si decidís seguir, tener el frasco siguiente antes de que se termine evita los cortes. Ante cualquier duda sobre continuidad o cantidad, consultá a tu médico. |

Esta es la sección de mayor riesgo del blueprint, porque en la referencia es donde va
*"a las 2 semanas vas a notar…"*. Acá **no hay ningún plazo de resultado, ningún síntoma y
ninguna sensación**: las tres columnas hablan de hábito y de reposición. El título lo dice
de frente y de paso diferencia a la marca.

### 6.10 Reseñas (bloque 13) — desactivada

Configurada pero apagada. No hay reseñas reales. Ver `DECISIONS.md` D-019.

### 6.11 Pestañas (bloque 14) · `cauce-tabs`

Título: **La ficha completa**. Tres pestañas que leen `cauce.composicion`,
`cauce.modo_uso` y `cauce.analisis`. Mientras los metafields estén vacíos muestran un
`[[PENDIENTE: …]]` con la instrucción de qué cargar.

**Estos tres textos no los puede escribir marketing**: tienen que ser transcripción del
rótulo aprobado y del certificado.

---

## 7. Pendientes que agregó la fase 4

| # | Dato | Dónde |
|---|---|---|
| 10 | Plazo de envío en días hábiles | banda oscura + acordeón del hero + banda `Comprar acá` de la home (D-040) |
| 11 | Email de contacto — resuelto el 2026-09-10: cauce@caucearg.com | banda oscura + acordeón del hero + banda `Comprar acá` de la home (D-040) |
| 12 | Videos UGC reales, o posters provisorios | bloque 5 |
| 13 | Metaobjetos de `cauce.beneficios` | bloque 10 |
| 14 | Confirmar que se publica el COA **de cada lote** | pilares + cards |
| 15 | Confirmar que la materia prima llega con certificado propio | card "Origen del ingrediente" |

---

## 8. Cierre y legales (fase 5)

### 8.1 Garantía (bloque 15) · `custom-columns`

Título: **Si te arrepentís, se devuelve**

> No es una promesa comercial: es un derecho que tenés por la Resolución SCI 424/2020 y
> que acá está escrito sin condiciones escondidas.

| Ítem | Texto |
|---|---|
| 10 días corridos | Se cuentan desde que recibís el pedido, no desde que lo comprás. |
| Sin costo para vos | Se devuelve el importe pagado. El costo de la devolución lo asumimos nosotros. |
| Sin explicar por qué | No hace falta que des un motivo. Basta con que nos avises dentro del plazo. |

> **Revisar.** "El costo de la devolución lo asumimos nosotros" va más allá del mínimo
> legal y es una decisión comercial, no una obligación. Si no se va a sostener, hay que
> sacarlo de acá **y** de la política de devoluciones.
>
> Además: el acordeón del hero dice *"El producto tiene que estar sin abrir"* y esta
> sección dice *"sin explicar por qué"*. No se contradicen, pero conviene que la política
> escrita diga exactamente lo mismo que las dos.

### 8.2 Comparativa (bloque 16) · `comparison-table`

Título: **Qué mirar antes de comparar precios**. Columnas: CAUCE / Suplemento genérico.

| Fila | Verdadera por |
|---|---|
| Declara si es isómero R o mezcla racémica | práctica de divulgación |
| 600 mg de forma R por cápsula | definición química |
| Certificado de análisis por lote, publicado | práctica |
| Analizado por un laboratorio que no es el propio | práctica |
| Trazabilidad del lote de materia prima | práctica |
| Lista completa de excipientes en el rótulo | práctica |

Al pie: *La comparación es contra el ácido alfa lipoico en mezcla racémica, que es el
formato más habitual de la categoría. No compara con ninguna marca ni con ningún
medicamento en particular.*

**Es la sección de mayor exposición legal de la página.** Ver `CLAIMS-AUDIT.md` R5.

### 8.3 Preguntas frecuentes (bloque 17) · `cauce-faq`

Volanta **Antes de comprar**. Seis preguntas, todas de compra. Emite `FAQPage` recorriendo
la misma fuente que el HTML, así que el marcado no puede declarar una pregunta invisible.

| Pregunta | Riesgo |
|---|---|
| ¿Cuánto tarda en llegar? | `pendiente` ×2 |
| ¿Puedo devolverlo si me arrepiento? | `dato` |
| ¿Cómo verifico que es la forma R? | `dato` — depende del COA por lote |
| ¿Cómo se conserva? | `forma` |
| ¿Puedo pagar en cuotas? | `pendiente` |
| ¿Emiten factura? | `pendiente` ×2 |

Ninguna es del tipo "sirve para X". La advertencia está escrita en el editor.

### 8.4 Cierre (bloque 18) · `custom-columns`

Título: **Una cápsula por día, y listo**. Checklist que repite el eje, botón de agregar al
carrito conectado al formulario principal (respeta el escalón elegido arriba), medios de
pago y la leyenda de suplemento en versión compacta.

- Isómero R puro, sin mezcla racémica
- 600 mg por cápsula, una por día
- Certificado de análisis por lote
- Producción nacional, envío a todo el país
- 10 días para arrepentirte, sin costo

### 8.5 Suscripción (bloque 19) · `cauce-newsletter`

Título **10 % en tu primer pedido**.

> Suscribite y te mandamos el código. Después, pocos mails: fórmulas nuevas y un aviso
> cuando se te esté por terminar el frasco.

Consentimiento (locale `cauce.newsletter.consentimiento`):

> Acepto recibir emails de CAUCE y que mis datos se traten según la Política de Privacidad
> (Ley 25.326). Puedo darme de baja cuando quiera.

Casilla obligatoria y sin premarcar. El formulario no se envía sin ella.

### 8.6 Barra legal (bloque 20) · `cauce-legal-bar`

Aparece en **todas** las páginas por estar en `footer-group`. Botón de arrepentimiento,
Libro de Quejas Online, Data Fiscal, razón social + CUIT + domicilio, email y teléfono,
leyenda de precio en pesos con IVA, y la leyenda de suplemento dietario con RNPA.

Lo que falte se muestra como **pendiente visible en la página**, no oculto. Es a propósito:
un CUIT vacío que se esconde solo es un incumplimiento que nadie ve en un QA.

### 8.7 Página de arrepentimiento · `templates/page.arrepentimiento.json`

> Si te arrepentiste de tu compra, tenés 10 días corridos desde que recibiste el pedido
> para pedir la devolución del importe pagado, sin costo. Es un derecho que te da la
> Resolución SCI 424/2020 y el artículo 34 de la Ley 24.240.
>
> No hace falta que expliques el motivo. Completá el formulario y te respondemos con las
> instrucciones para devolver el producto.

Formulario: nombre, email, número de pedido, teléfono opcional y un comentario **opcional**
que dice explícitamente que no hace falta dar un motivo.

**Falta crear la página en Shopify** (Contenido → Páginas, con la plantilla
`arrepentimiento`) y pegar su URL en Configuración → CAUCE.

---

## 9. Pendientes que agregó la fase 5

| # | Dato | Dónde |
|---|---|---|
| 16 | Tipo de factura que emiten (A / B / C) | FAQ |
| ~~17~~ | ~~Horario de atención~~ — resuelto en D-045: `cauce_horario` = 06:00 a 00:00 | footer |
| 18 | Crear la página de arrepentimiento y cargar su URL | Shopify + settings CAUCE |
| 19 | Escribir las cuatro políticas en Configuración → Políticas | Shopify |
| 20 | Decidir si el costo de la devolución lo paga la marca | garantía + política |
| 21 | Domicilio legal del vendedor (Ley 24.240 art. 4) | settings CAUCE → barra legal |
| 22 | Links de redes sociales | Configuración del tema → Redes sociales |

---

## 5. Lo que hay que decidir para poder publicar

| # | Dato | Dónde se carga |
|---|---|---|
| 1 | Umbral de envío gratis | `settings.cauce_umbral_envio_gratis` + descuento real de envío |
| 2 | % de descuento por 2 y por 3 frascos | template **y** descuento automático de Shopify |
| 3 | Ciudad de depósito y plazo de envío | acordeón Envíos |
| 4 | Email de contacto | `settings.cauce_email` |
| 5 | Dosis diaria de etiqueta | metafield `cauce.dosis_diaria` |
| 6 | Composición, modo de uso y análisis | metafields, textual de la etiqueta |
| 7 | RNPA/RNE | `settings.cauce_rnpa` |
| 8 | Razón social, CUIT, domicilio, teléfono | grupo CAUCE de theme settings |
| 9 | Cuotas sin interés, si el plan existe | `settings.cauce_cuotas` (0 = oculto) |

---

## 10. Hormify — PDP · `templates/product.hormify.json`

Ver `DECISIONS.md` D-054 y `CLAIMS-AUDIT.md` §8. **Este SKU habla distinto por decisión
comercial:** nombra síntomas, atribuye funciones y da plazos. El riesgo de cada texto ya no es
`forma` o `dato` como arriba, sino el número de claim del §8.1 (H1…H13). Todo es borrador:
ningún texto está aprobado y la fórmula es la de la referencia hasta que se confirme la real.

Esta sección se generó leyendo el template: si cambia el template, se regenera.

### 10.1 Hero

| Campo | Texto |
|---|---|
| Subtítulo | ¿Peso que no baja, hinchazón, sofocos o cambios de humor? Hormify reúne 8 activos de origen natural en una fórmula sin hormonas que ayuda a tu cuerpo a recuperar su equilibrio hormonal desde adentro. |
| Viñeta (`balance`) | Ayuda a combatir el peso hormonal |
| Viñeta (`water_drop`) | Menos hinchazón |
| Viñeta (`favorite`) | Equilibra tus hormonas, sin hormonas |
| Viñeta (`battery_android_frame_bolt`) | Menos estrés, más energía y mejor humor |
| Calificación | *apagada* — Calificación de [[PENDIENTE: puntaje real]] · [[PENDIENTE: cantidad real]] reseñas |

### 10.2 Selector de oferta

| Campo | Texto |
|---|---|
| Encabezado | 2 CÁPSULAS AL DÍA · CADA FRASCO, UN MES |
| Bajada | La mayoría de las mujeres nota los cambios más claros entre el segundo y el tercer mes de uso diario. |
| Escalón 1 | **1 frasco · 30 días** · caption `+ envío` · descuento $0 (provisorio, D-054 §4) |
| Escalón 2 | **2 frascos · 60 días** · caption `[price_each] por frasco` · descuento $40.900 (D-069; antes $37.900) |
| Escalón 3 | **3 frascos · 90 días** · cinta **RESULTADOS ÓPTIMOS · 90 DÍAS** · caption `[price_each] por frasco` · descuento $81.200 (D-069; antes $76.800) |
| Letra chica | El precio tachado es lo que costarían esos frascos comprados de a uno. / Los packs de 2 y 3 frascos van con envío sin cargo. |

### 10.3 Pestañas del hero

| Pestaña | Texto |
|---|---|
| Beneficios de Hormify | Ayuda a combatir el aumento de peso de origen hormonal y los antojos. · Reduce la hinchazón y favorece una digestión más liviana. · Apoya el equilibrio natural del estrógeno y la progesterona. · Alivia los sofocos, los sudores nocturnos y los cambios de humor. · Ayuda a bajar el estrés y el cortisol. · Más energía y claridad mental durante el día. / Los resultados pueden variar de una persona a otra. |
| ¿Para quién es Hormify? | Para mujeres que sienten que su cuerpo cambió: el peso que antes bajaba ahora no se mueve, la hinchazón aparece todos los días, el ciclo se volvió irregular y el humor sube y baja sin aviso. / Acompaña cada etapa de cambio hormonal —el ciclo menstrual, el SOP, la perimenopausia y la menopausia— con una fórmula sin hormonas. / No se recomienda durante el embarazo ni la lactancia. |
| ¿Cuándo voy a notar cambios? | Cada cuerpo tiene su tiempo. Algunas mujeres notan los primeros cambios en pocos días —menos hinchazón, más energía— y otras necesitan unas semanas. / Los cambios más claros suelen aparecer entre el segundo y el tercer mes de uso diario. Por eso recomendamos la rutina completa de 90 días. |
| Cómo se toma | Dos cápsulas por día con un vaso de agua. Podés tomarlas juntas a la mañana o repartirlas: una a la mañana y otra a la noche. / Cada frasco trae 60 cápsulas y rinde un mes. |
| Ingredientes | Ashwagandha, raíz de maca, ginseng (Panax ginseng), raíz de jengibre, L-fenilalanina, zinc, vitamina B6 y extracto de pimienta negra (piperina). / [[PENDIENTE: composición completa y dosis por porción, copiadas del rótulo aprobado]] |
| Envíos y entrega | Despachamos desde Buenos Aires. El plazo estimado es de 3 a 10 días habiles sujetos a la disponibilidad de stock y el costo se calcula en el checkout según tu código postal. Envío sin cargo en compras desde $55.000. |
| Cambios y devoluciones | Tenés 10 días corridos desde que recibís el pedido para arrepentirte de la compra y pedir la devolución del importe pagado, sin costo (Res. SCI 424/2020). El producto tiene que estar sin abrir. / Para iniciarlo, entrá al botón de arrepentimiento del pie de página o escribinos a cauce@caucearg.com. |

### 10.4 Contraste · `cauce-contraste`

Volanta **Equilibrio hormonal** · título **Cómo te ves y cómo te sentís empieza en tus _hormonas_** · bajada: Cuando tus hormonas se desordenan, lo notás en todo el cuerpo: en la balanza, en la digestión, en el humor y en el descanso.

| Con las hormonas en desequilibrio | Con Hormify · Con tus hormonas en equilibrio |
|---|---|
| Peso que sube y no baja | Tu peso vuelve a responder |
| Antojos que no podés frenar | Mejor control del apetito |
| Hinchazón todos los días | Una panza más liviana |
| Cansancio, ansiedad y cambios de humor | Más energía y un ánimo estable |
| Sofocos y sudores nocturnos | Menos sofocos y noches tranquilas |
| Ciclos irregulares | Un ciclo más predecible |

Botón **Quiero recuperar mi equilibrio** → `#comprar` · pie: Los resultados pueden variar de una persona a otra.

### 10.5 Beneficios · `cauce-solucion`

Desde D-055 esta banda va con **foto de fondo y el texto encima**, a la izquierda. Texto alternativo de la foto: *Dos frascos de Hormify de CAUCE, de 60 cápsulas cada uno, sobre un fondo de papel rosa.*

Volanta **Sin hormonas** · título **Apoyá tu equilibrio hormonal y combatí el peso hormonal** · bajada: Hormify ayuda a tu cuerpo a recuperar el equilibrio desde adentro, con 8 activos de origen natural que trabajan juntos.

Grilla: Menos peso hormonal (`balanza`) · Menos hinchazón (`ola`) · Hormonas en equilibrio (`flor`) · Menos estrés, mejor humor (`corazon`)

### 10.6 Ingredientes · `cauce-ingredientes`

Volanta **La fórmula** · título **8 activos en _una sola fórmula_** · bajada: Cada ingrediente está elegido por lo que aporta al equilibrio hormonal, y juntos trabajan mejor que por separado.

| Activo | Dosis | Para qué está |
|---|---|---|
| Ashwagandha | *pendiente* | Planta adaptógena que ayuda a bajar el estrés y el cortisol, y acompaña el metabolismo. |
| Raíz de maca | *pendiente* | Apoyo natural para el estrógeno y la progesterona. Suma energía y resistencia. |
| Ginseng | *pendiente* | Más energía y claridad mental, y una mejor respuesta al estrés del día. |
| Raíz de jengibre | *pendiente* | Reduce la hinchazón, favorece la digestión y tiene propiedades antiinflamatorias. |
| L-fenilalanina | *pendiente* | Aminoácido que ayuda a controlar el apetito y los antojos, y a estabilizar el ánimo. |
| Zinc | *pendiente* | Mineral esencial para el equilibrio hormonal, el metabolismo y la piel. |
| Vitamina B6 | *pendiente* | Contribuye a regular la actividad hormonal y a reducir el cansancio. |
| Pimienta negra | *pendiente* | Su extracto, la piperina, mejora la absorción del resto de los activos. |

Sellos: Sin hormonas · Activos de origen natural · Analizado por laboratorio externo · Producción nacional

Botón **Ver precios** → `#comprar` · pie: La composición completa y las dosis por porción están en el rótulo y en la pestaña Ingredientes.

### 10.7 Comparativa · `cauce-comparativa`

Título **Por qué Hormify es distinto** · Comparado con los multivitamínicos y suplementos para mujeres más habituales de la categoría. · columnas **Hormify** / **Otros suplementos**

- 8 activos para el equilibrio hormonal en una cápsula
- Ayuda con el peso hormonal y la hinchazón
- Acompaña el SOP, la perimenopausia y la menopausia
- Sin hormonas y con activos de origen natural
- Con piperina para absorber mejor cada activo
- Analizado por laboratorio externo
- Producción nacional
- **Precio** · en Hormify, el costo por día: sale del precio del producto dividido por 30 días, no se escribe (hoy **$1.763/día**, D-069) · en Otros: *Según la marca*

### 10.8 Qué esperar · `cauce-progreso`

Título **Qué esperar, mes a mes** · pie: *Los resultados varían de una persona a otra. Acompañá la rutina con una alimentación equilibrada y actividad física.

| Etiqueta | Hito | Texto | Ítems |
|---|---|---|---|
| Semana 1–2: | Primeros cambios | Tu cuerpo empieza a recibir los 8 activos todos los días. | Dos cápsulas, una rutina simple · Menos hinchazón para muchas mujeres |
| Semana 3–4: | Más energía, menos estrés | El día se siente más parejo y el estrés pesa menos. | Más energía durante el día · Menos antojos |
| Mes 2: | El equilibrio se nota | El ánimo se estabiliza y el cuerpo empieza a responder. | Cambios de humor más suaves · Menos sofocos y mejor descanso* |
| Mes 3: | Resultados completos | Con la rutina completa, los cambios se sostienen. | Tu peso vuelve a responder* · Un ciclo más predecible* |

### 10.9 Preguntas frecuentes · `cauce-faq`

Título **Lo que más nos preguntan sobre Hormify**

| Pregunta | Respuesta |
|---|---|
| ¿Qué tiene Hormify? | Ocho activos: ashwagandha, raíz de maca, ginseng, raíz de jengibre, L-fenilalanina, zinc, vitamina B6 y extracto de pimienta negra (piperina). No contiene hormonas. / La composición completa y las dosis por porción están en el rótulo. |
| ¿Cómo ayuda Hormify al equilibrio hormonal? | Combina plantas adaptógenas, vitaminas, un mineral y un aminoácido que acompañan los procesos naturales con los que tu cuerpo regula sus hormonas. Por eso ayuda con el peso, la hinchazón, el estrés y el ánimo al mismo tiempo. |
| ¿Cómo y cuándo lo tomo? | Dos cápsulas por día con un vaso de agua. Podés tomarlas juntas a la mañana o repartirlas: una a la mañana y otra a la noche. Repartirlas ayuda a que el efecto sea más parejo durante el día. |
| ¿Cuándo voy a notar los cambios? | Algunas mujeres notan los primeros cambios en pocos días y otras necesitan unas semanas. Los cambios más claros suelen aparecer entre el segundo y el tercer mes de uso diario. |
| ¿Sirve en la menopausia? | Sí. Hormify está pensado para acompañar el equilibrio hormonal y ayuda con los sofocos, el ánimo, la energía y el estrés, que son de lo que más cambia en esa etapa. |
| ¿Lo puedo tomar si tengo SOP? | Hormify acompaña el equilibrio hormonal y el control del apetito, dos puntos clave cuando hay SOP. Si estás en tratamiento, consultalo con tu médico antes de empezar. |
| ¿Lo puedo tomar si estoy embarazada o dando la teta? | No. Hormify no está recomendado durante el embarazo ni la lactancia. |
| ¿Lo puedo tomar con anticonceptivos u otra medicación? | Si tomás anticonceptivos, terapia hormonal o cualquier otra medicación, consultá con tu médico antes de empezar. |

### 10.10 Cierre · `custom-columns`

Título **Dos cápsulas por día para volver a sentirte vos**

8 activos de origen natural, sin hormonas · Ayuda con el peso hormonal, la hinchazón y los sofocos · Dos cápsulas por día: cada frasco rinde un mes · Envío a todo el país · 10 días para arrepentirte, sin costo

Marquesina: Sin hormonas · Peso hormonal · Hinchazón · Sofocos · Estrés y cambios de humor · Envío a todo el país

`banda`, `garantia` y `suscripcion` son las mismas del R-ALA. `resultados` y `resenas` están
apagadas y sólo tienen `[[PENDIENTE]]` (D-054 §1). `resultados` ya tiene armada la disposición de
tarjetas de la referencia (D-059): lo único que falta para prenderla son los números de una encuesta
propia, con su metodología. `ugc` tiene armada la tarjeta con el texto encima y la cinta de clienta
verificada (D-061), con las cuatro tarjetas en `[[PENDIENTE]]` y sin foto: falta UGC real.
