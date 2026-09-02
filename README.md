# Monarca Pet Grooming — Tampa, FL

Sitio web de una sola página para **Monarca Pet Grooming**, servicio de grooming a domicilio en Tampa, Florida.
Sin frameworks, sin instalación: son 3 archivos que puedes abrir y editar directo.

```
index.html    → todo el contenido (textos en inglés y español)
styles.css    → colores, tipografía y diseño
script.js     → tus datos + idioma, carrusel, formulario
assets/img/   → aquí van tus fotos
```

---

## 1. Ver la página

Doble clic en `index.html`. Se abre en tu navegador. Eso es todo.

---

## 2. Poner tus datos reales (lo primero que debes hacer)

Abre **`script.js`**. Arriba de todo está este bloque — es el único lugar donde
tienes que cambiar teléfono, correo y redes. Se actualiza en toda la página automáticamente.

```js
const CONFIG = {
  phone:      "+18132124033",                 // ✅ ya puesto
  phonePretty:"+1 (813) 212-4033",            // ✅ ya puesto
  whatsapp:   "18132124033",                  // ✅ ya puesto
  email:      "monarcapetgrooming@gmail.com", // ✅ ya puesto
  instagram:  "#",                            // ← FALTA: https://instagram.com/tuusuario
  facebook:   "#",                            // ← FALTA: https://facebook.com/tupagina
  formspree:  "",                             // ← ver punto 4

  booking:    "",                             // ← FALTA: link de la app de citas
  bookingKeepForm: true
};
```

### Precios
Los precios están en `index.html`, en la sección de paquetes. Busca `$75`, `$110` y `$155`
y cámbialos por los tuyos. Los nombres de los paquetes (*Royal Bath*, *Monarca Full Groom*,
*Crown Spa Day*) están justo arriba de cada precio.

---

## 3. Poner tus fotos

Guarda tus imágenes en `assets/img/` con **exactamente** estos nombres:

| Archivo | Dónde aparece | Recomendado |
|---|---|---|
| `hero-1.jpg` | Portada, izquierda | vertical 600×800 |
| `hero-2.jpg` | Portada, centro (la van) | cuadrada 800×800 |
| `hero-3.jpg` | Portada, derecha | vertical 600×800 |
| `pkg-1.jpg` `pkg-2.jpg` `pkg-3.jpg` | Los 3 paquetes | cuadradas 500×500 |
| `gal-1.jpg` … `gal-7.jpg` | Galería | verticales 800×1000 |
| `og.jpg` | Vista previa al compartir el link | ✅ ya puesto (tu logo) |

El logo ya está instalado en `assets/img/logo.jpg` y aparece en la portada y el pie de página.
Viene con fondo negro, pero el CSS usa `mix-blend-mode: screen` para que ese negro
desaparezca sobre los fondos oscuros — por eso el logo solo se usa en secciones oscuras.
Si algún día consigues el logo en **PNG con fondo transparente**, reemplaza el archivo
y borra las dos líneas `mix-blend-mode:screen` de `styles.css`.

Mientras no haya fotos, la página muestra siluetas doradas de perro/gato —
así se ve completa desde el primer día. Cuando pongas los archivos, aparecen solas.

**Tip:** comprime las fotos en [squoosh.app](https://squoosh.app) antes de subirlas.
Cada una debe pesar menos de 300 KB o la página cargará lenta en celular.

---

## 4. Conectar la app de citas

Esta es la parte más importante para el cliente. Pega el link público de su app de
agendamiento en `CONFIG.booking`:

```js
booking: "https://booksy.com/en-us/tu-negocio",
```

Funciona con cualquiera: **Booksy, MoeGo, Square Appointments, Vagaro, Acuity, Calendly,
Gingr, Setmore.** Solo necesitas el link público donde el cliente reserva.

En cuanto lo pegas, pasan cuatro cosas solas:

1. Los **ocho botones** de "Book Now" de toda la página llevan a la app, en pestaña nueva.
2. Aparece una **tarjeta dorada de "Reserva en línea"** arriba de los datos de contacto.
3. Google recibe el dato de que el negocio acepta reservas en línea (`ReserveAction`),
   que es lo que permite que salga el botón de reservar en los resultados de búsqueda.
4. El formulario se queda como alternativa, con una nota que dice
   *"¿Prefieres no usar la app? Mándanos tus datos"*.

### ¿Quitar el formulario?

Si el cliente prefiere que **todo** pase por la app:

```js
bookingKeepForm: false
```

Recomiendo dejarlo en `true`. Hay gente que abandona la reserva antes que crear una cuenta
en una app que no conoce, y ese cliente se pierde para siempre. Con el formulario, al menos
te deja su teléfono.

### Dónde encontrar el link

| App | Dónde está el link |
|---|---|
| Booksy | Perfil del negocio → Compartir → Copiar enlace |
| MoeGo | Settings → Online Booking → Booking Link |
| Square | Panel → Citas → Canales en línea → Sitio de reservas |
| Vagaro | Configuración → Widget/Enlace de reservas |
| Calendly | El enlace del evento (`calendly.com/tu-usuario/servicio`) |

> Si el cliente todavía no tiene app de citas, deja `booking: ""`.
> La página funciona igual y las reservas llegan por WhatsApp.

---

## 5. Recibir las reservas por correo (opcional pero recomendado)

El formulario ya funciona por WhatsApp sin configurar nada. Para recibir también un correo:

1. Entra a [formspree.io](https://formspree.io) y crea una cuenta gratis (50 reservas al mes).
2. Crea un formulario nuevo con tu correo.
3. Copia el endpoint que te dan, se ve así: `https://formspree.io/f/abcdwxyz`
4. Pégalo en `CONFIG.formspree` dentro de `script.js`.

Con eso, cada reserva llega a tu correo **y** el cliente puede mandarla por WhatsApp.

---

## 6. Idioma

La página es bilingüe. El botón **EN / ES** del menú cambia todos los textos.
Detecta solo el idioma del visitante la primera vez y recuerda su elección.

Para cambiar un texto: en `index.html` cada frase tiene sus dos versiones.

```html
<h3 data-en="Loving Care" data-es="Trato Amoroso">Loving Care</h3>
```

Edita `data-en` (inglés) y `data-es` (español). El texto entre las etiquetas debe
coincidir con el de `data-en`.

---

## 7. Cambiar los colores

Todo está en las primeras líneas de `styles.css`:

```css
:root{
  --black:      #0F0B08;   /* negro de fondo */
  --brown-900:  #2A1A10;   /* café oscuro */
  --brown-700:  #4A2C17;   /* café medio */
  --gold:       #D4A24C;   /* dorado de la marca */
  --gold-light: #F0CE8A;   /* dorado claro */
  --cream:      #F7F1E6;   /* fondo claro */
}
```

Cambia esos valores y la marca entera cambia con ellos.

---

## 8. Publicar en GitHub Pages (gratis)

Desde la Terminal, parado en esta carpeta:

```bash
git init
```

```bash
git add . && git commit -m "Monarca Mobile Grooming site"
```

```bash
git branch -M main && git remote add origin https://github.com/Hainrixz/the-architect.git
```

```bash
git push -u origin main
```

Después, en GitHub: **Settings → Pages → Source: `main` / `(root)` → Save**.
En 1–2 minutos tu sitio está en:

`https://hainrixz.github.io/the-architect/`

Para actualizar cualquier cambio más adelante:

```bash
git add . && git commit -m "actualizacion" && git push
```

### Dominio propio
Si compras `monarcamobilegrooming.com`, en **Settings → Pages → Custom domain**
pones el dominio y sigues las instrucciones de DNS que te muestra GitHub.

---

## 9. Antes de lanzar — lista de revisión

- [x] Teléfono y WhatsApp reales en `CONFIG` — +1 (813) 212-4033
- [x] Correo real en `CONFIG` — monarcapetgrooming@gmail.com
- [x] Logo instalado
- [ ] Instagram y Facebook reales en `CONFIG`
- [ ] Link de la app de citas en `CONFIG.booking`
- [ ] Precios reales en los 3 paquetes
- [ ] Fotos propias en `assets/img/`
- [ ] Reseñas reemplazadas por reseñas reales de clientes (sección `class="rev"` en `index.html`)
- [ ] Vecindarios de la sección "Where our van rolls" ajustados a tu zona real de cobertura
- [ ] Probado en tu celular, no solo en la computadora

> ⚠️ Las reseñas y los vecindarios que vienen puestos son de ejemplo.
> Cámbialos por información real antes de publicar el sitio.
