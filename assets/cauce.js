/*
  CAUCE — comportamiento de las piezas cauce-*.
  Vanilla, sin dependencias propias. Se carga con defer (layout/theme.liquid).

  Todo lo que se puede resolver en CSS o con HTML nativo esta resuelto ahi:
  los acordeones son <details>, los carruseles son scroll-snap. Este archivo
  solo cubre lo que el navegador no da gratis.

  Migracion a Horizon (D-081): salen <cauce-ugc> y <cauce-hero>, que eran de
  la landing del R-ALA y la home, y el texto dinamico del boton de compra;
  el empujon del carrito pasa a los eventos de Horizon y entra
  <cauce-barra-compra>.

  Galeria en el telefono (D-084): entra <cauce-miniaturas>.
*/
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     <cauce-tabs> — patron tabs del APG: aria-selected, roving tabindex y
     navegacion por flechas. Sin JS los paneles quedan todos visibles, que es
     la degradacion correcta: se ve todo el contenido, solo sin pestanas.
     -------------------------------------------------------------------- */
  class CauceTabs extends HTMLElement {
    connectedCallback() {
      this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
      if (this.tabs.length < 2) return;

      this.panels = this.tabs.map(function (tab) {
        return document.getElementById(tab.getAttribute('aria-controls'));
      });

      this.addEventListener('click', this.onClick.bind(this));
      this.addEventListener('keydown', this.onKeydown.bind(this));
      // Editor de temas: al elegir un bloque que vive en un panel oculto (una
      // fila de la tabla de ingredientes), se abre su pestana.
      this.addEventListener('shopify:block:select', this.onBlockSelect.bind(this));
    }

    onBlockSelect(e) {
      for (let i = 0; i < this.panels.length; i++) {
        if (this.panels[i] && this.panels[i].contains(e.target)) this.select(i);
      }
    }

    onClick(e) {
      const tab = e.target.closest('[role="tab"]');
      if (!tab) return;
      this.select(this.tabs.indexOf(tab));
    }

    onKeydown(e) {
      if (this.tabs.indexOf(document.activeElement) === -1) return;

      const last = this.tabs.length - 1;
      const i = this.tabs.indexOf(document.activeElement);
      let next = -1;

      if (e.key === 'ArrowRight') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      else return;

      e.preventDefault();
      this.select(next);
      this.tabs[next].focus();
    }

    select(index) {
      if (index < 0 || index >= this.tabs.length) return;
      for (let i = 0; i < this.tabs.length; i++) {
        const on = i === index;
        this.tabs[i].setAttribute('aria-selected', String(on));
        this.tabs[i].tabIndex = on ? 0 : -1;
        if (this.panels[i]) this.panels[i].hidden = !on;
      }
    }
  }

  /* ----------------------------------------------------------------------
     <cauce-meses> — una pestana y una foto por mes
     (sections/cauce-meses.liquid, D-080).

     Elegir un mes es cambiar una clase y un aria-pressed: el tamano de la foto
     y el texto que se ve los resuelve CSS. Se elige con la pestana, tocando la
     foto o llegando con el foco a un enlace del texto.

     En telefono la fila es un carrusel de scroll-snap y el mes elegido es el
     que esta a la vista: lo decide la posicion del scroll, no el clic. La
     pestana solo desplaza la fila. Si ademas marcara el mes, el desplazamiento
     suave lo devolveria al de partida antes de llegar.

     Carrusel o grilla no se pregunta con un media query repetido aca: es
     carrusel si el CSS dejo la fila con scroll y el contenido no entra. Las
     dos cosas: en la grilla (overflow visible) una palabra larga puede
     desbordar una columna angosta, y eso no la vuelve carrusel.
     -------------------------------------------------------------------- */
  class CauceMeses extends HTMLElement {
    connectedCallback() {
      this.lista = this.querySelector('.cauce-meses__lista');
      this.items = Array.from(this.querySelectorAll('[data-cauce-mes]'));
      this.botones = Array.from(this.querySelectorAll('[data-cauce-mes-boton]'));
      if (!this.lista || this.items.length < 2) return;

      this.activo = 0;
      this.cuadro = 0;

      this.addEventListener('click', this.onElegir.bind(this));
      this.addEventListener('focusin', this.onElegir.bind(this));
      // Editor de temas: al elegir el bloque de un mes, se abre ese mes.
      this.addEventListener('shopify:block:select', this.onElegir.bind(this));
      this.lista.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    }

    disconnectedCallback() {
      if (this.cuadro) cancelAnimationFrame(this.cuadro);
    }

    esCarrusel() {
      return (
        getComputedStyle(this.lista).overflowX !== 'visible' &&
        this.lista.scrollWidth > this.lista.clientWidth + 1
      );
    }

    onElegir(e) {
      const boton = e.target.closest('[data-cauce-mes-boton]');
      // El foco sobre una pestana no elige: con Tab se pasa por las tres.
      if (boton && e.type === 'focusin') return;

      const i = boton
        ? this.botones.indexOf(boton)
        : this.items.indexOf(e.target.closest('[data-cauce-mes]'));
      if (i === -1) return;

      if (!this.esCarrusel()) {
        this.marcar(i);
        return;
      }

      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.lista.scrollTo({
        left: this.items[i].offsetLeft - this.items[0].offsetLeft,
        behavior: reducido ? 'auto' : 'smooth',
      });
    }

    onScroll() {
      if (this.cuadro) return;
      this.cuadro = requestAnimationFrame(
        function () {
          this.cuadro = 0;
          if (this.esCarrusel()) this.marcar(this.aLaVista());
        }.bind(this)
      );
    }

    // El mes cuyo borde izquierdo quedo mas cerca del inicio de la fila. La
    // ultima tarjeta no llega a alinearse a la izquierda (la fila se termina
    // antes), asi que el final del scroll es siempre el ultimo mes.
    aLaVista() {
      const x = this.lista.scrollLeft;
      if (x >= this.lista.scrollWidth - this.lista.clientWidth - 2) return this.items.length - 1;

      const origen = this.items[0].offsetLeft;
      let cerca = 0;
      let minimo = Infinity;
      for (let i = 0; i < this.items.length; i++) {
        const d = Math.abs(this.items[i].offsetLeft - origen - x);
        if (d < minimo) {
          minimo = d;
          cerca = i;
        }
      }
      return cerca;
    }

    marcar(index) {
      if (index === this.activo) return;
      this.activo = index;
      for (let i = 0; i < this.items.length; i++) {
        const on = i === index;
        this.items[i].classList.toggle('cauce-meses__item--activo', on);
        if (this.botones[i]) this.botones[i].setAttribute('aria-pressed', String(on));
      }
    }
  }

  /* ----------------------------------------------------------------------
     <cauce-barra-compra> — barra fija de compra
     (blocks/cauce-barra-compra.liquid, D-081).

     Se muestra mientras el bloque de compra esta por encima de la pantalla,
     o sea cuando ya se lo paso scrolleando, y se esconde cuando vuelve a
     verse o cuando todavia no se llego a el. No mira el scroll de window: en
     escritorio Horizon scrollea .page-wrapper y no la ventana; el
     IntersectionObserver no depende de quien scrollee.

     Escondida queda inert, asi su boton no recibe el foco fuera de pantalla.
     -------------------------------------------------------------------- */
  class CauceBarraCompra extends HTMLElement {
    connectedCallback() {
      this.objetivo = document.getElementById(this.dataset.objetivo || '');
      if (!this.objetivo || !('IntersectionObserver' in window)) return;

      this.hidden = false;
      this.mostrar(false);

      this.observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              const yaPaso = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
              this.mostrar(yaPaso);
            }.bind(this)
          );
        }.bind(this)
      );
      this.observer.observe(this.objetivo);
    }

    disconnectedCallback() {
      if (this.observer) this.observer.disconnect();
    }

    mostrar(si) {
      this.classList.toggle('cauce-barra--oculta', !si);
      this.inert = !si;
      this.setAttribute('aria-hidden', String(!si));
      document.dispatchEvent(new CustomEvent('cauce:barra-compra'));
    }
  }

  /* ----------------------------------------------------------------------
     Empujon de envio gratis del carrito: agrega una unidad sin salir del
     carrito (snippets/cauce-carrito-nudge.liquid).

     En Shrine esto llamaba a updateCart() de los custom elements del tema. En
     Horizon el carrito se actualiza por eventos (D-081): el add pide las
     secciones de cada <cart-items-component> abierto y avisa con el mismo
     CartLinesUpdateEvent que dispara el formulario de producto. Con eso el
     drawer y /cart se vuelven a dibujar con el HTML que devolvio el add, y el
     contador del encabezado se actualiza solo.

     El boton vive adentro de lo que se vuelve a dibujar, asi que despues del
     add la tarjeta desaparece sola (el umbral ya esta cruzado). Si el add
     falla, el mensaje va a #cauce-carrito-errores.

     La URL del add sale del Liquid del boton (routes.cart_add_url).
     -------------------------------------------------------------------- */
  function cauceRutaCarrito() {
    const rutas = window.Theme && window.Theme.routes;
    return (rutas && rutas.cart_url) || '/cart';
  }

  function cauceCarritoError(mensaje) {
    document.querySelectorAll('#cauce-carrito-errores').forEach(function (caja) {
      caja.textContent = mensaje || '';
    });
  }

  function cauceCarritoSumar(boton) {
    const id = boton.dataset.cauceSumar;
    const url = boton.dataset.cauceUrl;
    if (!id || !url) return;

    const etiqueta = boton.querySelector('.cauce-carrito__nudge-label');
    const original = etiqueta ? etiqueta.textContent : '';
    if (etiqueta && boton.dataset.cauceSumando) etiqueta.textContent = boton.dataset.cauceSumando;
    boton.setAttribute('aria-busy', 'true');
    boton.disabled = true;
    cauceCarritoError('');

    function fallar(mensaje) {
      if (etiqueta) etiqueta.textContent = original;
      boton.removeAttribute('aria-busy');
      boton.disabled = false;
      cauceCarritoError(mensaje);
    }

    const secciones = Array.from(document.querySelectorAll('cart-items-component'))
      .map(function (el) {
        return el.dataset.sectionId;
      })
      .filter(Boolean);

    const cuerpo = new FormData();
    cuerpo.append('id', id);
    cuerpo.append('quantity', 1);
    if (secciones.length) cuerpo.append('sections', secciones.join(','));

    import('@shopify/events')
      .then(function (eventos) {
        const Evento = eventos.CartLinesUpdateEvent;
        const diferido = Evento.createPromise();

        boton.dispatchEvent(
          new Evento({
            action: 'add',
            context: 'cart',
            lines: [{ merchandiseId: id, quantity: 1 }],
            promise: diferido.promise,
          })
        );

        return fetch(url, {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/javascript' },
          body: cuerpo,
        })
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            // El endpoint de Shopify devuelve `status` solo cuando el add
            // fallo (sin stock, limite por pedido).
            if (data && data.status) {
              diferido.reject(new Error(data.description || data.message || 'add'));
              fallar(data.description || data.message || '');
              return;
            }
            return fetch(cauceRutaCarrito() + '.js', { headers: { Accept: 'application/json' } })
              .then(function (r) {
                return r.json();
              })
              .then(function (carrito) {
                diferido.resolve({
                  cart: Evento.createCartFromAjaxResponse(carrito),
                  detail: {
                    items: carrito.items,
                    itemCount: 1,
                    source: 'cauce-carrito-nudge',
                    sections: data.sections,
                    didError: false,
                  },
                });
              });
          })
          .catch(function (error) {
            diferido.reject(error);
            throw error;
          });
      })
      .catch(function () {
        fallar((window.Theme && window.Theme.translations && window.Theme.translations.cart_error) || '');
      });
  }

  document.addEventListener('click', function (e) {
    const boton = e.target.closest('[data-cauce-sumar]');
    if (!boton) return;
    e.preventDefault();
    if (boton.disabled) return;
    cauceCarritoSumar(boton);
  });

  /* ----------------------------------------------------------------------
     El boton flotante de WhatsApp (snippets/cauce-whatsapp.liquid) sube
     cuando aparece la barra fija de compra, para que no se tapen.

     Se mide la barra misma: lo que tapa de la ventana es lo que el boton
     sube. Se remide cuando la barra termina su transicion y cuando avisa que
     cambio (cauce:barra-compra). Una barra con display:none mide 0 de alto y
     no tapa nada. Sin barra -el resto de las paginas- no hace nada.
     -------------------------------------------------------------------- */
  function cauceWhatsappSobreBarra() {
    const boton = document.querySelector('.cauce-wa--flotante');
    const barra = document.querySelector('.cauce-barra');
    if (!boton || !barra) return;

    function medir() {
      let tapa = 0;
      if (!barra.classList.contains('cauce-barra--oculta')) {
        const r = barra.getBoundingClientRect();
        if (r.height > 0) tapa = Math.min(r.height, Math.max(0, window.innerHeight - r.top));
      }
      boton.style.setProperty('--cauce-wa-offset', Math.round(tapa) + 'px');
    }

    barra.addEventListener('transitionend', function (e) {
      if (e.target === barra) medir();
    });
    document.addEventListener('cauce:barra-compra', function () {
      requestAnimationFrame(medir);
    });
    window.addEventListener('resize', medir);
    medir();
  }

  /* ----------------------------------------------------------------------
     Los datos que faltan se marcan solos (D-074).

     Una pagina que se arma antes de tener todos los datos lleva el hueco
     escrito en el texto: "[COMPLETAR: numero de certificado]". Vive en
     settings de texto plano y en richtext, donde no se puede poner una clase,
     asi que se envuelve aca con .cauce-pendiente para que se vea desde lejos.
     Solo recorre el DOM si el texto aparece: en una pagina sin huecos no hace
     nada. No toca <script>, <style> ni campos de formulario.
     -------------------------------------------------------------------- */
  function caucePendientes() {
    const raiz = document.getElementById('MainContent') || document.body;
    if (!raiz || raiz.textContent.indexOf('[COMPLETAR') === -1) return;

    const patron = /\[COMPLETAR[^\]]*\]/g;
    const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: function (nodo) {
        const padre = nodo.parentElement;
        if (!padre || padre.closest('script, style, textarea, noscript, .cauce-pendiente')) {
          return NodeFilter.FILTER_REJECT;
        }
        return nodo.nodeValue.indexOf('[COMPLETAR') === -1
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodos = [];
    while (walker.nextNode()) nodos.push(walker.currentNode);

    nodos.forEach(function (nodo) {
      const texto = nodo.nodeValue;
      const trozo = document.createDocumentFragment();
      let desde = 0;
      let hallado;
      patron.lastIndex = 0;
      while ((hallado = patron.exec(texto))) {
        if (hallado.index > desde) {
          trozo.appendChild(document.createTextNode(texto.slice(desde, hallado.index)));
        }
        const marca = document.createElement('span');
        marca.className = 'cauce-pendiente';
        marca.textContent = hallado[0];
        trozo.appendChild(marca);
        desde = hallado.index + hallado[0].length;
      }
      if (desde < texto.length) trozo.appendChild(document.createTextNode(texto.slice(desde)));
      nodo.parentNode.replaceChild(trozo, nodo);
    });
  }

  /* ----------------------------------------------------------------------
     <cauce-miniaturas> — las flechas de la tira de miniaturas de la galeria
     en el telefono (snippets/slideshow-controls.liquid, D-084).

     Corren la tira de a tres miniaturas, como en la galeria de referencia, y
     no cambian la foto: eso lo hace el slideshow de Horizon cuando se toca una
     miniatura. Aparecen solo si la tira no entra entera, y cada una se apaga
     al llegar a su punta. Sin JS quedan escondidas y la tira se corre con el
     dedo igual.

     Ademas la tira sigue a la foto. Horizon centra la miniatura elegida
     cuando se toca una o se arrastra con el mouse, pero no cuando la foto se
     pasa con el dedo (es scroll nativo, y en computadora no hacia falta): en
     el telefono la elegida quedaba fuera de la tira. Se escucha su evento
     slideshow:select y, si la elegida no se ve entera, se la centra.
     -------------------------------------------------------------------- */
  class CauceMiniaturas extends HTMLElement {
    connectedCallback() {
      this.tira = this.querySelector('.slideshow-controls__thumbnails-container');
      this.flechas = Array.from(this.querySelectorAll('[data-paso]'));
      this.slideshow = this.closest('slideshow-component');
      if (!this.tira || this.flechas.length !== 2) return;

      this.actualizar = this.actualizar.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onSelect = this.onSelect.bind(this);
      this.tira.addEventListener('scroll', this.actualizar, { passive: true });
      this.flechas.forEach(function (flecha) {
        flecha.addEventListener('click', this.onClick);
      }, this);
      if (this.slideshow) this.slideshow.addEventListener('slideshow:select', this.onSelect);
      this.observador = new ResizeObserver(this.actualizar);
      this.observador.observe(this.tira);
      this.actualizar();
    }

    disconnectedCallback() {
      if (!this.tira || !this.observador) return;
      this.tira.removeEventListener('scroll', this.actualizar);
      this.flechas.forEach(function (flecha) {
        flecha.removeEventListener('click', this.onClick);
      }, this);
      if (this.slideshow) this.slideshow.removeEventListener('slideshow:select', this.onSelect);
      this.observador.disconnect();
    }

    comportamiento() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    }

    onSelect(e) {
      const indice = e.detail ? e.detail.index : -1;
      const item = this.tira.querySelectorAll('.slideshow-controls__thumbnail')[indice];
      if (!item || this.tira.scrollWidth <= this.tira.clientWidth) return;

      const caja = this.tira.getBoundingClientRect();
      const r = item.getBoundingClientRect();
      if (r.left >= caja.left && r.right <= caja.right) return;

      this.tira.scrollTo({
        left: this.tira.scrollLeft + (r.left - caja.left) - (caja.width - r.width) / 2,
        behavior: this.comportamiento()
      });
    }

    // Tres miniaturas con su espacio: la distancia entre dos seguidas, por 3.
    paso() {
      const items = this.tira.querySelectorAll('.slideshow-controls__thumbnail');
      if (items.length < 2) return this.tira.clientWidth;
      return (items[1].offsetLeft - items[0].offsetLeft) * 3;
    }

    onClick(e) {
      const sentido = Number(e.currentTarget.getAttribute('data-paso'));
      this.tira.scrollBy({ left: sentido * this.paso(), behavior: this.comportamiento() });
    }

    actualizar() {
      const tira = this.tira;
      const tope = tira.scrollWidth - tira.clientWidth;
      const desborda = tope > 1;
      this.flechas.forEach(function (flecha) {
        flecha.hidden = !desborda;
      });
      if (!desborda) return;
      this.flechas[0].disabled = tira.scrollLeft <= 1;
      this.flechas[1].disabled = tira.scrollLeft >= tope - 1;
    }
  }

  caucePendientes();

  if (!customElements.get('cauce-tabs')) customElements.define('cauce-tabs', CauceTabs);
  if (!customElements.get('cauce-miniaturas')) customElements.define('cauce-miniaturas', CauceMiniaturas);
  if (!customElements.get('cauce-meses')) customElements.define('cauce-meses', CauceMeses);
  if (!customElements.get('cauce-barra-compra')) customElements.define('cauce-barra-compra', CauceBarraCompra);

  // Despues de definir <cauce-barra-compra>, que es quien la deja escondida
  // o visible: recien ahi la medida de la barra es la real.
  cauceWhatsappSobreBarra();
})();
