/*
 * Balearic Works · Consentimiento de cookies y medición con Google Analytics 4.
 *
 * - No se carga nada de Google hasta que el usuario pulsa "Aceptar".
 * - "Rechazar" y "Aceptar" tienen el mismo peso visual.
 * - La elección se guarda en el navegador (localStorage) y se puede cambiar
 *   desde "Configurar cookies" en el pie de página.
 *
 * Para activar la medición, sustituye GA_ID por el ID de medición de la
 * propiedad GA4 de balearicworks.es (formato G-XXXXXXXXXX).
 */
(function () {
  'use strict';

  var GA_ID = 'G-SXQL8TMJB2';
  var CLAVE = 'bw_cookies';
  var gaCargado = false;

  function medicionConfigurada() {
    return /^G-[A-Z0-9]{8,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  }

  function leer() {
    try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
  }
  function guardar(valor) {
    try { localStorage.setItem(CLAVE, valor); } catch (e) { /* sin almacenamiento */ }
  }

  function cargarAnalytics() {
    if (gaCargado || !medicionConfigurada()) { return; }
    gaCargado = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function borrarCookiesGA() {
    var host = location.hostname;
    var dominios = [host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (c) {
      var nombre = c.split('=')[0].trim();
      if (nombre === '_ga' || nombre.indexOf('_ga_') === 0 || nombre === '_gid') {
        dominios.forEach(function (d) {
          document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
        });
        document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    });
  }

  /* ---------- Aviso ---------- */
  var aviso = null;

  function cerrarAviso() {
    if (aviso && aviso.parentNode) { aviso.parentNode.removeChild(aviso); }
    aviso = null;
  }

  function elegir(valor) {
    guardar(valor);
    cerrarAviso();
    if (valor === 'si') {
      cargarAnalytics();
    } else if (gaCargado) {
      borrarCookiesGA();
      location.reload();
    } else {
      borrarCookiesGA();
    }
  }

  function mostrarAviso() {
    if (aviso) { return; }
    aviso = document.createElement('div');
    aviso.className = 'cookies';
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-labelledby', 'cookies-titulo');
    aviso.innerHTML =
      '<p id="cookies-titulo" class="cookies__titulo">Cookies de medición</p>' +
      '<p class="cookies__texto">Usamos Google Analytics, solo si lo aceptas, para saber cuántas personas visitan la web y qué botones de contacto se usan. ' +
      'Más información en la <a href="cookies.html">política de cookies</a>.</p>' +
      '<div class="cookies__acciones">' +
      '<button type="button" class="cookies__boton" data-cookies="no">Rechazar</button>' +
      '<button type="button" class="cookies__boton" data-cookies="si">Aceptar</button>' +
      '</div>';
    document.body.appendChild(aviso);
    aviso.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookies]');
      if (b) { elegir(b.getAttribute('data-cookies')); }
    });
  }

  /* ---------- Eventos de contacto ---------- */
  document.addEventListener('click', function (e) {
    var abrir = e.target.closest('[data-cookies-abrir]');
    if (abrir) { mostrarAviso(); return; }

    if (!gaCargado || typeof window.gtag !== 'function') { return; }
    var el = e.target.closest('[data-evento]');
    if (!el) { return; }
    var datos = { ubicacion: el.getAttribute('data-ubicacion') || '' };
    var servicio = el.getAttribute('data-servicio');
    if (servicio) { datos.servicio = servicio; }
    window.gtag('event', el.getAttribute('data-evento'), datos);
  });

  /* ---------- Arranque ---------- */
  var eleccion = leer();
  if (eleccion === 'si') {
    cargarAnalytics();
  } else if (eleccion !== 'no' && medicionConfigurada()) {
    // Solo se pregunta cuando hay una medición que activar.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mostrarAviso);
    } else {
      mostrarAviso();
    }
  }
})();
