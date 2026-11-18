# balearicworks
Reformas integrales y mantenimiento de propiedades en Mallorca. Equipo y medios propios para viviendas, villas y espacios profesionales.

## Estructura

- `index.html` · página única: presentación, servicios, proyectos a medida (hoteles y locales), proceso y contacto.
- `aviso-legal.html` · borrador de aviso legal (identificación de la sociedad según LSSI). Revisar con el asesor antes de darlo por definitivo.
- `css/styles.css` · estilos. Diseño de escritorio de Figma (1440 px) y versión móvil responsive con barra fija Llamar / WhatsApp.
- `assets/` · logo, fotografía y fuente Figtree autoalojada. Ver `assets/README.md`.
- `robots.txt`, `sitemap.xml`, `CNAME` (dominio para GitHub Pages).

Para verla en local basta con abrir `index.html` en el navegador.

## Pendiente

- Cambiar `balearicworks@outlook.es` por `info@balearicworks.es` cuando esté activo (en `index.html` y `aviso-legal.html`).
- Formulario de contacto (requiere servicio de envío) y política de privacidad.
- Política de cookies y banner solo si se añade analítica u otros servicios que usen cookies.
- Confirmar con el asesor el cambio de denominación (AKKO Services Property Care, S.L.U. → Balearic Building Works, S.L. Unipersonal), pendiente de inscripción en el Registro Mercantil.
- Imágenes de los servicios (reformas integrales y mantenimiento).
- No subir a este repositorio (público) documentos con datos personales, como la copia del poder notarial.

## Publicación (GitHub Pages + cdmon)

Sitio estático servido desde la rama `main`, carpeta raíz. El archivo `CNAME` fija el dominio `balearicworks.es`.

1. **GitHub:** Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. En *Custom domain* escribir `balearicworks.es`. Cuando el DNS propague, marcar *Enforce HTTPS*.
2. **cdmon** (Dominios → balearicworks.es → Gestionar registros (zona)): mantener los DNS de cdmon y añadir:

| Tipo | Host | Valor |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | abp-tech.github.io |

DNSSEC puede seguir activado: los nameservers no cambian, solo se añaden registros a la zona.

## Medición (Google Analytics 4)

- `js/consentimiento.js`: aviso de cookies y carga de GA4 solo tras «Aceptar».
- Para activarla, `GA_ID` contiene el ID de medición de la propiedad GA4 de balearicworks.es (`G-SXQL8TMJB2`).
- Eventos (atributos `data-evento` en el HTML): `pedir_presupuesto`, `click_whatsapp`, `click_telefono`, `click_email`, `consultar_servicio`. Parámetros: `ubicacion` (cabecera, hero, servicios, proyectos, contacto, pie, barra_movil) y `servicio`.
- Marcar como eventos clave en GA4: `click_whatsapp`, `click_telefono`, `click_email`.
- `cookies.html`: política de cookies.
