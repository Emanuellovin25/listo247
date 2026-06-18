/* ============================================================
   AISR — Calculadora «¿Cuánto se te escapa?»  (tarea 11)
   Lógica de la sección #calculadora del Home. Cargado con `defer`.
   Si la sección no existe en la página, no hace nada.
   Formato es-ES, count-up al cargar, respeta prefers-reduced-motion.

   Mejoras incluidas:
   · localStorage      → recuerda los valores al volver
   · aria-valuetext    → el lector de pantalla dice "350 euros", no solo "350"
   · presets por sector→ fijan ticket + no-shows + aceptación típicos
   · lead-capture WA   → "¿Te mando este desglose por WhatsApp?" prerellenado
   · comparativa       → neo-toggle sin/con AISR enlazado a Antes/Después
   ============================================================ */
'use strict';

(function () {
  var root = document.getElementById('calculadora');
  if (!root) return;

  var W = 4.33, PRESU_RATE = 0.35, LOW = 0.14, HIGH = 0.22, REACT = 0.05;
  var STORE_KEY = 'aisr-calc-v1';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nf0 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
  function num(n) { return nf0.format(Math.max(0, Math.round(n))); }
  function r10(n) { return Math.round(n / 10) * 10; }
  function r100(n) { return Math.round(n / 100) * 100; }

  var el = function (id) { return root.querySelector('#' + id); };
  var rangeIds = ['s-pac', 's-val', 's-after', 's-noshow', 's-presu', 'b-db', 'b-val'];
  var ranges = rangeIds.map(el);
  var bonus = root.querySelector('details.bonus');

  // Texto legible por slider para aria-valuetext (su idioma, no solo cifras).
  function valueText(id, v) {
    switch (id) {
      case 's-pac':    return num(v) + ' pacientes a la semana';
      case 's-val':    return num(v) + ' euros por paciente';
      case 's-after':  return num(v) + ' contactos fuera de horario a la semana';
      case 's-noshow': return v + ' de cada 10 citas';
      case 's-presu':  return v + ' de cada 10 presupuestos';
      case 'b-db':     return num(v) + ' pacientes en la base de datos';
      case 'b-val':    return num(v) + ' euros por paciente recuperado';
      default:         return String(v);
    }
  }

  function fill(r) {
    var p = (r.value - r.min) / (r.max - r.min) * 100;
    r.style.background = 'linear-gradient(to right, var(--primary) ' + p + '%, var(--line) ' + p + '%)';
    r.setAttribute('aria-valuetext', valueText(r.id, +r.value));
  }
  function range(lo, hi) { return num(r10(lo)) + ' – ' + num(r10(hi)); }

  // ---------- persistencia ----------
  function save() {
    try {
      var data = {};
      rangeIds.forEach(function (id) { data[id] = el(id).value; });
      data.bonus = bonus.open;
      var active = root.querySelector('.calc-chip.active');
      data.preset = active ? active.dataset.val : null;
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (_) { /* almacenamiento no disponible: no pasa nada */ }
  }
  function restore() {
    var data;
    try { data = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (_) { data = null; }
    if (!data) return;
    rangeIds.forEach(function (id) {
      if (data[id] != null && el(id)) el(id).value = data[id];
    });
    if (typeof data.bonus === 'boolean') bonus.open = data.bonus;
    if (data.preset) {
      var chip = root.querySelector('.calc-chip[data-val="' + data.preset + '"]');
      if (chip) chip.classList.add('active');
    }
  }

  // ---------- compartir por WhatsApp (lead-capture suave) ----------
  var waEl = root.querySelector('[data-calc-wa]');
  var waBase = waEl ? waEl.href.split('?')[0] : '';
  function updateShare(state) {
    if (!waEl) return;
    var lines = [
      'Hola, he usado vuestra calculadora para mi clínica. Estos son mis números:',
      '· Se me escapan ≈ ' + state.month + ' €/mes (≈ ' + state.year + ' €/año)',
      '· Fuera de horario: ' + state.hor + ' €/mes',
      '· Ausencias / no-shows: ' + state.no + ' €/mes',
      '· Presupuestos sin aceptar: ' + state.pre + ' €/mes'
    ];
    if (state.bonus) lines.push('· Base de datos dormida: + ' + state.bonus + ' € (una sola vez)');
    lines.push('¿Me ayudáis a recuperarlo?');
    waEl.href = waBase + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function compute(animate) {
    var A = +el('s-pac').value, V = +el('s-val').value, C = +el('s-after').value,
        N = +el('s-noshow').value, Q = +el('s-presu').value,
        DB = +el('b-db').value, BV = +el('b-val').value;

    el('o-pac').textContent = num(A);
    el('o-val').textContent = num(V) + ' €';
    el('o-after').textContent = num(C);
    el('o-noshow').textContent = N + ' de 10';
    el('o-presu').textContent = Q + ' de 10';
    el('o-db').textContent = num(DB);
    el('o-bval').textContent = num(BV) + ' €';
    ranges.forEach(fill);

    var fHor = C * W * V, fNo = A * (N / 10) * W * V, fPre = A * PRESU_RATE * (Q / 10) * W * V;
    var G = fHor + fNo + fPre;
    var mLow = G * LOW, mHigh = G * HIGH;

    setNum('r-low', r10(mLow), animate);
    setNum('r-high', r10(mHigh), animate);
    setNum('r-ylow', r100(mLow * 12), animate);
    setNum('r-yhigh', r100(mHigh * 12), animate);

    // traducción a pacientes (su idioma)
    var tl = V > 0 ? Math.round(mLow / V) : 0, th = V > 0 ? Math.round(mHigh / V) : 0;
    var t = (tl === th ? tl : tl + '–' + th);
    el('tangible').innerHTML = '≈ <b>' + t + ' paciente' + (th === 1 ? '' : 's') + '</b> al mes que hoy se quedan por el camino.';

    // breakdown (parte recuperable por fuga)
    var max = Math.max(fHor, fNo, fPre, 1);
    el('f-hor').style.width = (fHor / max * 100) + '%';
    el('f-no').style.width = (fNo / max * 100) + '%';
    el('f-pre').style.width = (fPre / max * 100) + '%';
    el('bd-hor').textContent = range(fHor * LOW, fHor * HIGH) + ' €/mes';
    el('bd-no').textContent = range(fNo * LOW, fNo * HIGH) + ' €/mes';
    el('bd-pre').textContent = range(fPre * LOW, fPre * HIGH) + ' €/mes';

    // resaltar la mayor fuga
    ['tag-hor', 'tag-no', 'tag-pre'].forEach(function (id) { el(id).style.display = 'none'; });
    var biggest = Math.max(fHor, fNo, fPre);
    if (biggest > 0) { el(biggest === fHor ? 'tag-hor' : (biggest === fNo ? 'tag-no' : 'tag-pre')).style.display = 'inline-block'; }

    // bonus
    var box = el('bonus-box'), open = bonus.open && DB > 0;
    box.hidden = !open;
    var bonusVal = open ? num(r10(DB * REACT * BV)) : '';
    if (open) { el('r-bonus').textContent = bonusVal; el('r-dbn').textContent = num(DB * REACT); }

    // mensaje de WhatsApp con los números actuales
    updateShare({
      month: range(mLow, mHigh), year: num(r100(mLow * 12)) + ' – ' + num(r100(mHigh * 12)),
      hor: range(fHor * LOW, fHor * HIGH), no: range(fNo * LOW, fNo * HIGH),
      pre: range(fPre * LOW, fPre * HIGH), bonus: bonusVal
    });

    save();
  }

  function setNum(id, target, animate) {
    var node = el(id);
    if (!animate || reduce) { node.textContent = num(target); return; }
    var start = performance.now(), dur = 650;
    function step(t) {
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      node.textContent = num(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- presets por sector → ticket + no-shows + aceptación ----------
  var chips = root.querySelectorAll('.calc-chip');
  function clearPreset() {
    chips.forEach(function (x) { x.classList.remove('active'); });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      clearPreset();
      c.classList.add('active');
      if (c.dataset.val)    el('s-val').value = c.dataset.val;
      if (c.dataset.noshow) el('s-noshow').value = c.dataset.noshow;
      if (c.dataset.presu)  el('s-presu').value = c.dataset.presu;
      compute(false);
    });
  });

  // mover a mano cualquiera de los valores que fija un preset lo deselecciona
  ['s-val', 's-noshow', 's-presu'].forEach(function (id) {
    el(id).addEventListener('input', clearPreset);
  });

  ranges.forEach(function (r) { r.addEventListener('input', function () { compute(false); }); });
  bonus.addEventListener('toggle', function () { compute(false); });

  // ---------- comparativa sin / con AISR (neo-toggle) ----------
  (function compare() {
    var sw = root.querySelector('#calc-switch');
    if (!sw) return;
    var result = root.querySelector('.result');
    var label = root.querySelector('[data-calc-label]');
    var recover = root.querySelector('[data-calc-recover]');
    var antes = root.querySelector('.calc-antes');
    var labOff = root.querySelector('[data-calc-off]');
    var labOn = root.querySelector('[data-calc-on]');

    function apply() {
      var con = sw.checked;
      result.setAttribute('data-mode', con ? 'con' : 'sin');
      label.textContent = con ? 'Con AISR, recuperas cada mes' : 'Ahora mismo se te escapan cada mes';
      recover.innerHTML = con
        ? 'El mismo dinero que hoy se escapa, <strong>trabajando para ti</strong>.'
        : 'Es justo lo que <strong>AISR</strong> te ayuda a recuperar.';
      if (antes) antes.hidden = !con;
      if (labOff) labOff.classList.toggle('neo-toggle__label--on', !con);
      if (labOn) labOn.classList.toggle('neo-toggle__label--on', con);
    }
    sw.addEventListener('change', apply);
    apply();

    // el enlace lleva a Antes/Después y deja esa sección ya en "Con AISR"
    var link = root.querySelector('[data-calc-antes]');
    if (link) link.addEventListener('click', function (e) {
      var target = document.getElementById('antes') || document.querySelector('.antes');
      var antesSwitch = document.getElementById('antes-switch');
      if (antesSwitch && !antesSwitch.checked) {
        antesSwitch.checked = true;
        antesSwitch.dispatchEvent(new Event('change'));
      }
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    });
  })();

  // ---------- arranque ----------
  restore();

  // count-up al entrar en viewport (o de inmediato si reduced-motion)
  if (reduce || !('IntersectionObserver' in window)) {
    compute(true);
  } else {
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      if (!done && entries.some(function (e) { return e.isIntersecting; })) {
        done = true; compute(true); io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(root);
    compute(false); // pinta valores iniciales sin animar por si entra tarde
  }
})();
