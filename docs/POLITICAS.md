# POLITICAS.md — textos de las políticas de la tienda

Las políticas **no son páginas del tema**: se escriben en el admin, en **Configuración →
Políticas**, y Shopify las publica en `/policies/...`. **Las tres de este archivo están cargadas desde
el 2026-09-27** (D-067), igual que la página de preguntas y los links del menú. Este archivo guarda el texto que va en cada
una, para que lo que publica la tienda sea auditable como el resto (`CLAIMS-AUDIT.md` §1). Si se
cambia una política en el admin, se cambia también acá.

**Esto no es asesoramiento legal.** Son borradores hechos con las condiciones comerciales que
confirmó el comercio (D-052, D-066, D-067). Conviene que los lea alguien con criterio legal.

---

## 1. El menú "Ayuda" del pie

El bloque "Ayuda" del pie lee el menú `footer` (Contenido → Menús). Cada ítem se enlaza desde el
selector de links del menú:

| Ítem | Enlaza a | URL | Qué hay que crear antes |
|---|---|---|---|
| Preguntas frecuentes | Páginas → Preguntas frecuentes | `/pages/preguntas-frecuentes` | la página, con la plantilla `faq` (§5) |
| Envíos | Políticas → Política de envío | `/policies/shipping-policy` | la política (§2) |
| Devoluciones | Políticas → Política de reembolso | `/policies/refund-policy` | la política (§3) |
| Contacto | Páginas → Contact | `/pages/contact` | nada: ya existe |
| Términos | Políticas → Términos del servicio | `/policies/terms-of-service` | la política (§4) |

"Buscar", que es lo único que tiene hoy, conviene sacarlo: el header tiene la búsqueda apagada y en
"Ayuda" no aporta.

**Orden de carga.** Primero las tres políticas, después la página y al final el menú. La página
de preguntas enlaza a `/policies/refund-policy`, y una política vacía da 404. Una vez que tienen
texto, las políticas aparecen además solas en dos lugares: en el renglón de abajo del pie (el
footer tiene `show_policy` activado) y en el pie del checkout, que es donde más se las mira.

Los títulos de las políticas los pone Shopify según el idioma de la tienda ("Política de
reembolso", "Términos del servicio") y no se pueden cambiar. El texto del ítem del menú sí:
por eso dice "Devoluciones" y no "Política de reembolso".

---

## 2. Política de envío

> **Enviamos a todo el país**
>
> Despachamos desde Buenos Aires a cualquier punto de Argentina.
>
> **Plazo**
>
> La entrega tarda entre 3 y 10 días hábiles desde que se acredita el pago. Si pagás con
> transferencia, el plazo empieza a correr cuando la transferencia se acredita.
>
> **Costo**
>
> El envío es gratis en todas las compras, sin monto mínimo y a cualquier punto del país.
>
> **Seguimiento**
>
> Por ahora los envíos no tienen código de seguimiento. Si querés saber en qué anda tu pedido,
> escribinos por WhatsApp al +54 9 3406 46-1636 o a cauce@caucearg.com con tu número de pedido.
>
> **Dirección de entrega**
>
> Revisá la dirección antes de confirmar la compra. Si necesitás cambiarla, avisanos antes de que
> despachemos el pedido.
>
> **Si el pedido llega dañado o equivocado**
>
> Escribinos apenas lo recibas, con una foto del paquete y del producto. Te mandamos uno nuevo o te
> devolvemos el dinero, sin costo para vos.

Qué sostiene cada dato:

- **3 a 10 días hábiles y "desde Buenos Aires":** es lo que ya publica el acordeón de envíos de la
  PDP. "Desde que se acredita el pago" lo confirmó el comercio el 2026-09-27.
- **Gratis en todas las compras:** lo decidió el comercio el 2026-09-28 con los precios nuevos
  (D-069). Exige que la tarifa de envío del admin sea $0 para todo el país. Es la misma promesa que
  la barra de anuncio, el acordeón, la nota del bloque de compra y la FAQ: si vuelve un umbral,
  cambia acá también. Hasta el 2026-09-28 decía "sin cargo desde $55.000 con los descuentos
  aplicados".
- **Sin seguimiento:** lo confirmó el comercio el 2026-09-27 (D-066).
- **Dañado o equivocado:** reponer o devolver el dinero es lo que exige igual la Ley 24.240 cuando
  lo que llega no es lo que se compró. Está escrito como promesa, así que hay que cumplirlo.

---

## 3. Política de reembolso (devoluciones)

> **Tenés 30 días para devolverlo**
>
> Podés devolver tu compra dentro de los 30 días corridos desde que la recibís, sin explicar por
> qué. El plazo se cuenta desde la entrega, no desde la compra.
>
> **Condición**
>
> El frasco tiene que estar cerrado, tal como lo recibiste. Si compraste un pack, podés devolver los
> frascos que no abriste: te devolvemos lo que pagaste por cada uno, que es el precio del pack
> dividido por la cantidad de frascos.
>
> **Envío de vuelta**
>
> Lo pagamos nosotros. Cuando nos avises, coordinamos con vos cómo mandarlo.
>
> **Derecho de arrepentimiento**
>
> Los primeros 10 días corridos desde la entrega son, además, tu derecho de arrepentimiento por ley
> (art. 34 de la Ley 24.240 y Res. SCI 424/2020). Si te arrepentís dentro de esos 10 días, te
> devolvemos todo lo que pagaste, incluido el envío.
>
> **Cómo pedir una devolución**
>
> Usá el botón de arrepentimiento que está al pie de todas las páginas, o escribinos por WhatsApp al
> +54 9 3406 46-1636 o a cauce@caucearg.com con tu número de pedido.
>
> **Cómo te devolvemos el dinero**
>
> Por el mismo medio con el que pagaste, cuando recibimos los frascos. Si pagaste con tarjeta, el
> reintegro lo procesa Mercado Pago y puede tardar en verse reflejado según tu banco. Si pagaste por
> transferencia, te pedimos un CBU o alias para devolvértelo.
>
> **Productos dañados o equivocados**
>
> Si te llegó un producto dañado, vencido o distinto del que pediste, no hace falta que esté
> cerrado: escribinos y te mandamos uno nuevo o te devolvemos el dinero, sin costo para vos.

Qué sostiene cada dato:

- **30 días, frasco cerrado, envío de vuelta a cargo de CAUCE, sin motivo:** D-066 §2. Es la regla
  que CLAIMS-AUDIT §8.3 pide escribir antes de la primera devolución.
- **Reintegro proporcional en un pack:** es lo que dicen la sección de garantía y el acordeón
  ("te devolvemos lo que pagaste por ellos"). Acá se hace explícito el cálculo.
- **"Incluido el envío" en los primeros 10 días:** la revocación del art. 34 obliga a restituir lo
  pagado. Lo confirmó el comercio el 2026-09-27.
- **"Coordinamos con vos cómo mandarlo":** no hay logística de devolución definida. Si después se
  arma una (etiqueta prepaga, punto de entrega), se reemplaza esta frase.

---

## 4. Términos del servicio

> **1. Quiénes somos**
>
> Esta tienda es operada por Matias Haspert, CUIT 20-44526051-8, con domicilio en Vera Mujica 431,
> Rosario (2000), provincia de Santa Fe, bajo el nombre comercial CAUCE. Contacto: cauce@caucearg.com · WhatsApp +54 9 3406 46-1636 · lunes a
> viernes de 9 a 18 h.
>
> **2. Los productos**
>
> Los productos de CAUCE son suplementos dietarios. No son medicamentos ni reemplazan una
> alimentación variada. Consultá a tu médico antes de consumirlos, sobre todo si estás embarazada o
> amamantando, si tomás medicación o si tenés una condición de salud. Las indicaciones y
> advertencias de cada producto están en su página y en su rótulo.
>
> **3. Precios**
>
> Los precios están en pesos argentinos e incluyen IVA. El precio que vale es el que ves al
> confirmar la compra. Los precios de los packs y el precio tachado (lo que costarían esos frascos
> comprados de a uno) se muestran en la página de cada producto.
>
> **4. Medios de pago**
>
> Aceptamos tarjetas de crédito y débito a través de Mercado Pago, con hasta 3 cuotas sin interés
> con tarjeta de crédito, y transferencia bancaria. No vemos ni guardamos los datos de tu tarjeta.
>
> **5. Descuento por transferencia**
>
> El código TRANSFERENCIA10 da un 10 % de descuento y es exclusivo para pagos por transferencia
> bancaria. Si se aplica en un pedido pagado con otro medio de pago, cancelamos el pedido y
> devolvemos el total pagado. Los pedidos pagados por transferencia se despachan cuando el pago se
> acredita.
>
> **6. Otros descuentos**
>
> El 10 % de bienvenida que enviamos a quienes se suscriben al newsletter no se combina con el
> descuento por transferencia.
>
> **7. Envíos**
>
> Plazos, costos y condiciones: ver la Política de envío.
>
> **8. Devoluciones y arrepentimiento**
>
> Tenés 30 días corridos desde la entrega para devolver tu compra, con el frasco cerrado. Los
> primeros 10 días son, además, tu derecho de arrepentimiento (Ley 24.240 y Res. SCI 424/2020), que
> podés ejercer desde el botón de arrepentimiento del pie de la página. Detalle: ver la Política de
> reembolso.
>
> **9. Datos personales**
>
> Tratamos tus datos según la Ley 25.326 de Protección de Datos Personales. Ver la Política de
> privacidad.
>
> **10. Defensa del consumidor**
>
> Estos términos no limitan los derechos que te da la Ley 24.240 de Defensa del Consumidor. Podés
> hacer reclamos por el Libro de Quejas Online, que está enlazado al pie de la página.
>
> **11. Cambios en estos términos**
>
> Podemos actualizar estos términos. Cada compra se rige por los que estaban publicados al momento de
> hacerla.
>
> **12. Jurisdicción**
>
> Para cualquier conflicto son competentes los tribunales ordinarios correspondientes a tu
> domicilio, conforme a la Ley 24.240.

Qué sostiene cada dato:

- **§1:** el CUIT empieza con 20, o sea que es de una persona física: la razón social es el nombre
  del titular y "CAUCE" va como nombre comercial. Datos del comercio del 2026-09-27, los mismos que
  quedaron en `cauce_razon_social` y `cauce_domicilio` (la barra legal del pie los publica).
- **§5:** es la regla de TRANSFERENCIA10 que CLAIMS-AUDIT §6 pide publicar en los Términos: sin ella,
  cancelar un pedido por esto no tiene respaldo (D-052).
- **§6:** que el de bienvenida y el de transferencia no se combinan está en D-052. Se descartó
  agregar "un solo código por pedido": no se verificó contra la configuración de los descuentos, y
  TRANSFERENCIA10 sí se combina con los descuentos automáticos de los packs.
- **§12:** la Ley 24.240 no admite que el vendedor elija su propio fuero contra el consumidor.

---

## 5. La página de preguntas frecuentes

Esta sí es una página, y su contenido vive en el tema: `templates/page.faq.json`, con la sección
`cauce-faq` y once preguntas **de compra**: envíos, envío gratis, seguimiento, medios de pago,
cuotas, transferencia, devoluciones, arrepentimiento, pedido dañado, dónde ver la composición y
contacto. No hay ninguna pregunta de salud. Las del producto están en la PDP y esta página enlaza
ahí, porque una pregunta del tipo "¿sirve para X?" vuelve claim toda la sección (ver el
comentario de `sections/cauce-faq.liquid`).

Para publicarla: **Tienda online → Páginas → Agregar página**, título "Preguntas frecuentes",
contenido vacío y plantilla **`faq`**. El handle queda `preguntas-frecuentes`.

La sección emite `FAQPage` en JSON-LD con las mismas preguntas que se ven. Hay tres datos escritos
a mano que se repiten en otros lugares: el envío gratis en todas las compras (D-069; antes, el
umbral de $55.000), el horario de atención y el número de
WhatsApp del último link. Si cambia alguno, hay que cambiarlo acá también.
