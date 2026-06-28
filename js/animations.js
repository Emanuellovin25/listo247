/* ============================================================
   Listo247 — Animaciones (tarea 03)
   Cargado con `defer`. Todo gated por prefers-reduced-motion y
   lazy-init (IntersectionObserver) para no bloquear el LCP.
   Cada bloque es independiente: si un elemento no existe en la
   página, simplemente no hace nada.
   ============================================================ */
'use strict';

(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COARSE  = window.matchMedia('(pointer: coarse)').matches;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

  /* ---------- Nav móvil (hamburguesa) ---------- */
  (function navToggle() {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#primary-nav');
    if (!btn || !nav) return;
    const close = () => { btn.setAttribute('aria-expanded', 'false'); nav.dataset.open = 'false'; };
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      nav.dataset.open = String(!open);
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  })();

  /* ---------- Header: transparente → sólido al hacer scroll ---------- */
  (function headerScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ---------- Reveal on scroll ---------- */
  (function reveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (REDUCED || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  })();

  /* ---------- Parallax suave (solo transform) ---------- */
  (function parallax() {
    const els = document.querySelectorAll('.parallax');
    if (!els.length || REDUCED || COARSE) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '0.12');
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.setProperty('--parallax', offset.toFixed(1) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ---------- Flywheel: click en canal → muestra su conversación ---------- */
  (function flywheel() {
    const wheel = document.querySelector('.flywheel');
    if (!wheel) return;
    const nodes = wheel.querySelectorAll('.flywheel__node-inner[data-channel]');
    const panels = document.querySelectorAll('[data-channel-panel]');
    if (!nodes.length) return;
    const show = (channel) => {
      nodes.forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.channel === channel)));
      panels.forEach((p) => { p.hidden = p.dataset.channelPanel !== channel; });
    };
    nodes.forEach((n) => {
      n.addEventListener('click', () => show(n.dataset.channel));
      n.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n.dataset.channel); }
      });
    });

    // Pausar la rueda (1 giro + 5 contra-giros) cuando no está en pantalla.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        wheel.classList.toggle('is-paused', !entries[0].isIntersecting);
      }, { threshold: 0.01 });
      io.observe(wheel);
    }
  })();

  /* ---------- Click Spark: chispas teal al pulsar los CTA ---------- */
  (function clickSpark() {
    const targets = document.querySelectorAll('[data-spark]');
    if (!targets.length || REDUCED) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fx-spark';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let sparks = [];
    let raf = null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const emit = (x, y) => {
      const n = 12;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
        const sp = 2.2 + Math.random() * 2.6;
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1 });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      sparks = sparks.filter((s) => s.life > 0);
      sparks.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.vy += 0.06; s.life -= 0.035;
        ctx.globalAlpha = Math.max(s.life, 0);
        ctx.fillStyle = '#0FB5A6';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.4 * s.life + 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = sparks.length ? requestAnimationFrame(tick) : null;
    };

    targets.forEach((t) => {
      t.addEventListener('click', (e) => emit(e.clientX, e.clientY));
    });
  })();

  /* ---------- Light Rays: rayos teal sutiles sobre fondo claro ----------
     Canvas 2D (sin dependencias). Lazy-init al entrar en viewport.
     Apagado en reduced-motion, móvil/coarse y CPUs de pocos núcleos. */
  (function lightRays() {
    const hosts = document.querySelectorAll('[data-light-rays]');
    if (!hosts.length || REDUCED || COARSE || lowPower) return;

    const init = (host) => {
    let started = false;
    const start = () => {
      if (started) return; started = true;

      const canvas = document.createElement('canvas');
      canvas.className = 'fx-rays';
      canvas.setAttribute('aria-hidden', 'true');
      host.prepend(canvas);
      const ctx = canvas.getContext('2d');
      let w, h, dpr;
      const rays = Array.from({ length: 7 }, (_, i) => ({
        base: (-0.5 + i * 0.16),       // posición horizontal relativa
        width: 0.06 + Math.random() * 0.05,
        speed: 0.00015 + Math.random() * 0.0002,
        phase: Math.random() * Math.PI * 2,
      }));

      // El degradado vertical es idéntico para los 7 rayos y solo depende de h.
      // Lo calculamos una vez por resize en vez de 7 veces por frame.
      let grad = null;
      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = host.clientWidth; h = host.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(15,181,166,0.16)');
        grad.addColorStop(1, 'rgba(15,181,166,0)');
      };
      resize();
      window.addEventListener('resize', resize);

      let tabVisible = !document.hidden;   // pestaña en primer plano
      let inView = true;                    // host dentro del viewport
      let rafId = null;
      let last = 0;
      const FRAME = 1000 / 30;              // tope ~30fps: mitad de trabajo, igual de fluido

      const loop = (t) => {
        rafId = null;
        if (!tabVisible || !inView) return; // si no se ve, ni dibujamos ni reprogramamos
        if (t - last >= FRAME) {
          last = t;
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'lighter';
          rays.forEach((r) => {
            const sway = Math.sin(t * r.speed + r.phase) * 0.12;
            const cx = (r.base + sway + 0.5) * w;
            const halfW = r.width * w;
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(cx - halfW * 0.4, 0);
            ctx.lineTo(cx + halfW * 0.4, 0);
            ctx.lineTo(cx + halfW, h);
            ctx.lineTo(cx - halfW, h);
            ctx.closePath();
            ctx.fill();
          });
          ctx.globalCompositeOperation = 'source-over';
        }
        rafId = requestAnimationFrame(loop);
      };
      const kick = () => { if (rafId == null && tabVisible && inView) rafId = requestAnimationFrame(loop); };

      // Exponemos el control de visibilidad para que el IO lo pause/reanude
      host._raysSetInView = (v) => { inView = v; kick(); };

      // Pausar cuando la pestaña no está visible (ahorro de batería)
      document.addEventListener('visibilitychange', () => {
        tabVisible = !document.hidden;
        kick();
      });
      kick();
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) start();
          if (host._raysSetInView) host._raysSetInView(e.isIntersecting);
        });
      }, { threshold: 0.01 });
      io.observe(host);
    } else {
      start();
    }
    };

    hosts.forEach(init);
  })();
})();
