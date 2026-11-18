# balearicworks
Reformas integrales y mantenimiento de propiedades en Mallorca. Equipo y medios propios para viviendas, villas y espacios profesionales.

## Estructura

- `index.html` · página "Próximamente" (HTML y CSS estáticos, sin dependencias).
- `css/styles.css` · estilos. Diseño de escritorio de Figma (1440 px) y versión móvil responsive.
- `assets/` · logo, fotografía y fuente Figtree autoalojada. Ver `assets/README.md`: el logo y la foto son marcadores hasta que se sustituyan por los originales.

Para verla en local basta con abrir `index.html` en el navegador.

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
