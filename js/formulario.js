/*
 * Balearic Works · Envío del formulario de contacto (Web3Forms).
 *
 * - Sin JavaScript el formulario sigue funcionando: se envía directamente a Web3Forms.
 * - Con JavaScript: validación en español, comprobación anti-spam y envío sin recargar.
 * - hCaptcha (script de Web3Forms) solo se carga cuando la persona empieza a usar el formulario.
 */
(function () {
  'use strict';

  var form = document.getElementById('formulario');
  if (!form) { return; }

  var estado = document.getElementById('formulario-estado');
  var boton = form.querySelector('button[type="submit"]');
  var cargadaEn = Date.now();
  var captchaCargado = false;

  form.noValidate = true;

  /* ---------- hCaptcha bajo demanda ---------- */
  function cargarCaptcha() {
    if (captchaCargado) { return; }
    captchaCargado = true;
    var s = document.createElement('script');
    s.src = 'https://web3forms.com/client/script.js';
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }
  form.addEventListener('focusin', cargarCaptcha, { once: true });
  form.addEventListener('pointerdown', cargarCaptcha, { once: true });

  /* ---------- Mensajes ---------- */
  function mostrar(texto, esError, html) {
    estado.hidden = false;
    estado.className = 'campo--ancho formulario__estado' + (esError ? ' formulario__estado--error' : '');
    if (html) { estado.innerHTML = texto; } else { estado.textContent = texto; }
    if (esError) { estado.setAttribute('role', 'alert'); } else { estado.setAttribute('role', 'status'); }
  }
  function limpiar() {
    estado.hidden = true;
    estado.textContent = '';
    Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (c) { c.removeAttribute('aria-invalid'); });
  }

  var etiquetas = {
    nombre: 'el nombre', apellidos: 'los apellidos', telefono: 'el teléfono', email: 'el correo electrónico',
    proyecto: 'el tipo de proyecto', municipio: 'el municipio', mensaje: 'el proyecto'
  };

  function validar() {
    limpiar();
    var primerError = null;
    var mensaje = '';

    ['nombre', 'apellidos', 'telefono', 'email', 'proyecto', 'municipio', 'mensaje'].forEach(function (n) {
      var c = form.elements[n];
      var vacio = !c.value || !c.value.trim();
      var malo = vacio || (c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value.trim())) ||
                 (n === 'telefono' && c.value.replace(/\D/g, '').length < 9);
      if (malo) {
        c.setAttribute('aria-invalid', 'true');
        if (!primerError) {
          primerError = c;
          mensaje = vacio ? 'Falta ' + etiquetas[n] + '.' :
            (n === 'email' ? 'Revisa el correo electrónico.' : 'Revisa el teléfono: debe tener al menos 9 cifras.');
        }
      }
    });

    var enlaces = (form.elements.mensaje.value.match(/https?:\/\/|www\./gi) || []).length;
    if (!primerError && enlaces > 1) {
      form.elements.mensaje.setAttribute('aria-invalid', 'true');
      primerError = form.elements.mensaje;
      mensaje = 'Por seguridad, el mensaje no puede incluir enlaces. Describe el proyecto con texto.';
    }

    if (!primerError && !form.elements.privacidad.checked) {
      form.elements.privacidad.setAttribute('aria-invalid', 'true');
      primerError = form.elements.privacidad;
      mensaje = 'Para enviar la solicitud debes aceptar la política de privacidad.';
    }

    if (!primerError) {
      var token = form.querySelector('textarea[name="h-captcha-response"]');
      if (!token || !token.value) {
        primerError = form.querySelector('.h-captcha');
        mensaje = 'Marca la casilla de verificación («No soy un robot») antes de enviar.';
      }
    }

    if (primerError) {
      mostrar(mensaje, true);
      if (primerError.focus && primerError.tagName) {
        try { primerError.focus(); } catch (e) { /* sin foco */ }
      }
      return false;
    }
    return true;
  }

  /* ---------- Confirmación ---------- */
  function confirmar() {
    var contenedor = document.createElement('div');
    contenedor.className = 'formulario__gracias';
    contenedor.setAttribute('role', 'status');
    contenedor.innerHTML =
      '<h3 tabindex="-1">Solicitud enviada</h3>' +
      '<p>Gracias. Hemos recibido tu solicitud y te contactaremos en horario de atención, de lunes a viernes de 09:00 a 21:00 y los sábados de 09:00 a 15:00.</p>' +
      '<p>Si es urgente, llámanos al <a href="tel:+34621210483">+34 621 210 483</a>.</p>';
    form.innerHTML = '';
    form.appendChild(contenedor);
    form.classList.remove('is-enviando');
    contenedor.querySelector('h3').focus();
  }

  /* ---------- Envío ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validar()) { return; }

    // Trampa 1: el campo oculto solo lo marca un robot. Se simula éxito sin enviar nada.
    if (form.elements.botcheck && form.elements.botcheck.checked) { confirmar(); return; }

    // Trampa 2: envío antes de 3 s desde la carga. Una persona real vuelve a pulsar y no pierde nada.
    if ((Date.now() - cargadaEn) < 3000) {
      mostrar('Un segundo… vuelve a pulsar «Enviar solicitud».', false);
      return;
    }

    var ahora = new Date().toISOString();
    form.elements.consentimiento.value = 'Ha aceptado la política de privacidad el ' + ahora;
    form.elements.subject.value = 'Solicitud web · ' + form.elements.proyecto.value + ' · ' +
      form.elements.nombre.value.trim() + ' ' + form.elements.apellidos.value.trim();

    var datos = {};
    new FormData(form).forEach(function (v, k) { if (k !== 'botcheck') { datos[k] = v; } });

    form.classList.add('is-enviando');
    boton.disabled = true;
    mostrar('Enviando…', false);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(datos)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.status === 200 && j.success !== false, status: r.status }; });
    }).then(function (res) {
      if (res.ok) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { ubicacion: 'formulario', servicio: datos.proyecto || '' });
        }
        confirmar();
      } else {
        throw new Error('estado ' + res.status);
      }
    }).catch(function (err) {
      form.classList.remove('is-enviando');
      boton.disabled = false;
      var limite = err && /429/.test(String(err.message));
      mostrar(
        (limite ? 'Hay demasiadas solicitudes en este momento. ' : 'No hemos podido enviar la solicitud. ') +
        'Inténtalo de nuevo en unos minutos o escríbenos por <a href="https://wa.me/34621210483" target="_blank" rel="noopener">WhatsApp</a> o llama al <a href="tel:+34621210483">+34 621 210 483</a>.',
        true, true);
      if (window.hcaptcha && typeof window.hcaptcha.reset === 'function') {
        try { window.hcaptcha.reset(); } catch (e) { /* sin captcha */ }
      }
    });
  });
})();
