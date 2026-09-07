/* ============================================================
   MONARCA PET GROOMING — Tampa, FL
   ------------------------------------------------------------
   👉 EDITA SOLO ESTE BLOQUE PARA PONER TUS DATOS REALES 👈
   ============================================================ */
const CONFIG = {
  phone:     "+18132124033",                  // ← tu teléfono real
  phonePretty:"+1 (813) 212-4033",            // ← cómo se muestra en pantalla
  whatsapp:  "18133308027",                   // ← WhatsApp SIN + ni espacios
  email:     "monarcapetgrooming@gmail.com",  // ← tu correo
  instagram: "#",                             // ← https://instagram.com/tuusuario
  facebook:  "#",                             // ← https://facebook.com/tupagina
  formspree: "",                              // ← ej: "https://formspree.io/f/xxxxxxx" (vacío = solo WhatsApp)

  // --- Reservas en línea ---
  // Pega aquí el link de la app de citas (Booksy, MoeGo, Square, Vagaro, Calendly...).
  // Con esto, TODOS los botones de "Book Now" llevan directo a la app.
  // Si lo dejas vacío, los botones bajan al formulario y todo sigue funcionando igual.
  booking: "https://www.raykota.app/book/monarca-pet-grooming-d7f9",

  // ¿Dejar también el formulario como alternativa para quien no quiera usar la app?
  // true  = se queda (recomendado: no pierdes al cliente que no quiere crear cuenta)
  // false = se oculta y solo queda la app, el teléfono y WhatsApp
  bookingKeepForm: false
};

/* ============================================================
   A partir de aquí no necesitas cambiar nada
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- 1. Inyectar datos de CONFIG ---------- */
  function applyConfig() {
    $$('a[href^="tel:"]').forEach(a => {
      a.href = "tel:" + CONFIG.phone;
      const label = $("span", a) || a;
      if (label.textContent.trim().startsWith("+")) label.textContent = CONFIG.phonePretty;
    });
    $$('a[href^="mailto:"]').forEach(a => {
      a.href = "mailto:" + CONFIG.email;
      a.textContent = CONFIG.email;
    });
    // wa.me solo acepta digitos: se limpia por si alguien pega "+1 (813) 330-8027"
    const wa = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    $$('a[href*="wa.me"]').forEach(a => { a.href = "https://wa.me/" + wa; });
    const ig = $('.socials a[aria-label="Instagram"]');
    const fb = $('.socials a[aria-label="Facebook"]');
    if (ig) ig.href = CONFIG.instagram;
    if (fb) fb.href = CONFIG.facebook;

    // Reservas en línea: si hay app configurada, todos los botones llevan a ella
    if (CONFIG.booking) {
      $$("[data-book]").forEach(a => {
        a.href = CONFIG.booking;
        a.target = "_blank";
        a.rel = "noopener";
      });

      const card = $("#bookOnline");
      if (card) { card.href = CONFIG.booking; card.hidden = false; }

      const intro = $("#formIntro");
      const form = $("#bookingForm");
      if (CONFIG.bookingKeepForm === false) {
        if (form) form.remove();
        const grid = $(".contact-grid");
        if (grid) grid.classList.add("no-form");
      } else if (intro) {
        intro.hidden = false;
      }
    }

    const jsonLd = $('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd.textContent);
        data.telephone = CONFIG.phone;
        data.email = CONFIG.email;
        if (CONFIG.booking) {
          data.potentialAction = {
            "@type": "ReserveAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": CONFIG.booking,
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            },
            "result": { "@type": "Reservation", "name": "Grooming appointment" }
          };
        }
        jsonLd.textContent = JSON.stringify(data);
      } catch (e) { /* si el JSON se edita a mano y falla, no rompe la página */ }
    }
  }

  /* ---------- 2. Idioma EN / ES ---------- */
  const STORE_KEY = "monarca-lang";
  let lang = "en";

  function readStored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function writeStored(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* modo privado */ }
  }

  function setLang(next) {
    lang = next === "es" ? "es" : "en";
    document.documentElement.lang = lang;

    $$("[data-en]").forEach(el => {
      const text = el.dataset[lang];
      if (text === undefined) return;
      if (el.children.length && !el.matches("summary, option, cite, h1 span, span")) {
        // el nodo tiene hijos: sólo reemplaza el primer nodo de texto
        const node = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
        if (node) { node.textContent = text; return; }
      }
      el.textContent = text;
    });

    const toggle = $("#langToggle");
    if (toggle) {
      $(".lang-on", toggle).textContent = lang === "en" ? "EN" : "ES";
      $(".lang-off", toggle).textContent = lang === "en" ? "ES" : "EN";
      toggle.setAttribute("aria-label", lang === "en" ? "Ver en español" : "View in English");
    }
    writeStored(lang);
  }

  function initLang() {
    const stored = readStored();
    let start = stored;
    if (!start) {
      const nav = (navigator.language || "en").toLowerCase();
      start = nav.startsWith("es") ? "es" : "en";
    }
    setLang(start);
    const toggle = $("#langToggle");
    if (toggle) toggle.addEventListener("click", () => setLang(lang === "en" ? "es" : "en"));
  }

  const t = (en, es) => (lang === "es" ? es : en);

  /* ---------- 3. Header: sombra al hacer scroll ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 4. Menú móvil ---------- */
  function initMenu() {
    const burger = $("#burger");
    const nav = $("#nav");
    if (!burger || !nav) return;

    const close = () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };

    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) close(); });
  }

  /* ---------- 5. Carrusel de reseñas ---------- */
  function initReviews() {
    const track = $("#revTrack");
    const dots  = $("#revDots");
    if (!track || !dots) return;

    const slides = $$(".rev", track);
    if (!slides.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0, timer = null, pages = 1;

    // ancho de un "paso" = distancia entre el inicio de dos reseñas
    const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
    // cuántas posiciones distintas tiene el carrusel según el ancho de pantalla
    const lastIndex = () => {
      const visible = Math.max(1, Math.round(track.clientWidth / step()));
      return Math.max(0, slides.length - visible);
    };

    function buildDots() {
      const last = lastIndex();
      if (pages === last + 1 && dots.children.length) return;
      pages = last + 1;
      dots.textContent = "";
      for (let i = 0; i < pages; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", (lang === "es" ? "Reseña " : "Review ") + (i + 1));
        b.addEventListener("click", () => { stop(); go(i); });
        dots.appendChild(b);
      }
      if (index > last) index = last;
      sync();
    }

    function go(i) {
      const last = lastIndex();
      index = ((i % (last + 1)) + (last + 1)) % (last + 1);
      track.scrollTo({ left: index * step(), behavior: reduce.matches ? "auto" : "smooth" });
      sync();
    }
    function sync() {
      Array.from(dots.children).forEach((d, i) =>
        d.setAttribute("aria-selected", String(i === index))
      );
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reduce.matches || slides.length < 2) return;
      timer = setInterval(() => { if (!document.hidden) go(index + 1); }, 7000);
    }

    $("#revNext").addEventListener("click", () => { stop(); go(index + 1); });
    $("#revPrev").addEventListener("click", () => { stop(); go(index - 1); });
    track.addEventListener("pointerdown", stop);
    track.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { stop(); go(index + 1); }
      if (e.key === "ArrowLeft")  { stop(); go(index - 1); }
    });
    track.addEventListener("scroll", () => {
      const near = Math.round(track.scrollLeft / step());
      if (near !== index && near >= 0 && near < pages) { index = near; sync(); }
    }, { passive: true });

    let rid;
    window.addEventListener("resize", () => {
      clearTimeout(rid);
      rid = setTimeout(buildDots, 180);
    });

    track.tabIndex = 0;
    buildDots();
    start();
  }

  /* ---------- 6. FAQ: abrir uno cierra los demás ---------- */
  function initFaq() {
    const items = $$("#faqList details");
    items.forEach(d => {
      d.addEventListener("toggle", () => {
        if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
      });
    });
  }

  /* ---------- 7. Formulario de reserva ---------- */
  function initForm() {
    const form = $("#bookingForm");
    const note = $("#formNote");
    if (!form) return;

    form.addEventListener("submit", async e => {
      e.preventDefault();
      note.className = "form-note";
      note.textContent = "";

      const data = Object.fromEntries(new FormData(form).entries());
      const required = ["name", "phone"];
      let ok = true;

      $$("input, select", form).forEach(el => el.classList.remove("invalid"));
      required.forEach(k => {
        if (!String(data[k] || "").trim()) {
          ok = false;
          const el = form.elements[k];
          if (el) el.classList.add("invalid");
        }
      });
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ok = false;
        form.elements.email.classList.add("invalid");
      }

      if (!ok) {
        note.className = "form-note err";
        note.textContent = t(
          "Please add your name and a valid phone or email.",
          "Por favor agrega tu nombre y un teléfono o correo válido."
        );
        return;
      }

      const msg = t("New booking request", "Nueva solicitud de cita") + " — Monarca Pet Grooming\n" +
        "\n" + t("Name", "Nombre") + ": " + data.name +
        "\n" + t("Phone", "Teléfono") + ": " + data.phone +
        (data.email ? "\n" + t("Email", "Correo") + ": " + data.email : "") +
        (data.zip ? "\nZIP: " + data.zip : "") +
        "\n" + t("Pet", "Mascota") + ": " + data.pet +
        "\n" + t("Package", "Paquete") + ": " + data.package +
        (data.notes ? "\n" + t("Notes", "Notas") + ": " + data.notes : "");

      const waUrl = "https://wa.me/" + String(CONFIG.whatsapp||"").replace(/\D/g,"") + "?text=" + encodeURIComponent(msg);

      // Envío por correo (Formspree) si está configurado
      if (CONFIG.formspree) {
        note.className = "form-note";
        note.textContent = t("Sending…", "Enviando…");
        try {
          const res = await fetch(CONFIG.formspree, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form)
          });
          if (!res.ok) throw new Error("bad status");
          form.reset();
          note.className = "form-note ok";
          note.innerHTML = t(
            'Thank you! We received your request and reply the same day. ',
            '¡Gracias! Recibimos tu solicitud y respondemos el mismo día. '
          ) + '<a href="' + waUrl + '" target="_blank" rel="noopener">' +
            t("Send it by WhatsApp too", "Envíalo también por WhatsApp") + "</a>";
          return;
        } catch (err) {
          note.className = "form-note err";
          note.innerHTML = t(
            "We couldn't send the email. ", "No se pudo enviar el correo. "
          ) + '<a href="' + waUrl + '" target="_blank" rel="noopener">' +
            t("Send by WhatsApp instead", "Envíalo por WhatsApp") + "</a>";
          return;
        }
      }

      // Sin Formspree: WhatsApp directo
      window.open(waUrl, "_blank", "noopener");
      note.className = "form-note ok";
      note.innerHTML = t(
        "Opening WhatsApp with your request. ", "Abriendo WhatsApp con tu solicitud. "
      ) + '<a href="' + waUrl + '" target="_blank" rel="noopener">' +
        t("Didn't open? Tap here", "¿No abrió? Toca aquí") + "</a>";
    });
  }

  /* ---------- 8. Placeholders de foto ---------- */
  const PH = {
    dog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.5 6.5 7 4v4.2C7 5.9 9.2 4 12 4s5 1.9 5 4.2V4l2.5 2.5c.9.9 1.5 2.1 1.5 3.4V13c0 .8-.7 1.5-1.5 1.5H19v3a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5v-3h-.5C3.7 14.5 3 13.8 3 13V9.9c0-1.3.6-2.5 1.5-3.4Zm5 5.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 16c-1.2 0-2 .6-2 1.2 0 .5.9.8 2 .8s2-.3 2-.8c0-.6-.8-1.2-2-1.2Z"/></svg>',
    cat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3.5 8 7.2a8.6 8.6 0 0 1 8 0L20 3.5V12c0 4.7-3.6 8.5-8 8.5S4 16.7 4 12V3.5Zm5.2 8.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm5.6 0a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 15.4c-.9 0-1.6.5-1.6 1s.7.9 1.6.9 1.6-.4 1.6-.9-.7-1-1.6-1Z"/></svg>',
    van: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M2 16V7h11v9M13 10h4.5l3.5 4v2"/><circle fill="currentColor" cx="6" cy="17.5" r="2"/><circle fill="currentColor" cx="17" cy="17.5" r="2"/></svg>'
  };

  function initPlaceholders() {
    $$("img[data-ph]").forEach(img => {
      const swap = () => {
        if (img.dataset.swapped) return;
        img.dataset.swapped = "1";
        const div = document.createElement("div");
        div.className = "ph";
        div.innerHTML = PH[img.dataset.ph] || PH.dog;
        img.replaceWith(div);
      };
      img.addEventListener("error", swap);
      if (img.complete && img.naturalWidth === 0) swap();
    });
  }

  /* ---------- 9. Año del footer ---------- */
  function initYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initLang();
    initHeader();
    initMenu();
    initReviews();
    initFaq();
    initForm();
    initPlaceholders();
    initYear();
  });
})();
