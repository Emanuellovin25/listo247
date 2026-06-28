// main.js — JS base del sitio Listo247. Cargado con `defer`, no bloquea el render.
// Las animaciones pesadas (WebGL light rays, etc.) se inicializan aparte y gated
// por prefers-reduced-motion. Aquí solo lo esencial y transversal.

'use strict';

/* ---------- Chat widget (botón "Probar ahora") ----------
   El cliente facilitará el script/iframe del widget. Hasta entonces, openChatWidget()
   es un placeholder claro. Conectar aquí cuando llegue el enlace.
   TODO(cliente): widget link. */
window.openChatWidget = function openChatWidget(){
  // TODO: reemplazar por la apertura real del widget cuando se integre.
  console.warn('[Listo247] openChatWidget(): pendiente del enlace del widget de chat.');
  alert('El chat de demostración se conectará en breve.');
};

document.addEventListener('click', function(e){
  const trigger = e.target.closest('[data-open-chat]');
  if(trigger){ e.preventDefault(); window.openChatWidget(); }
});

/* ---------- Año dinámico en el footer ---------- */
document.querySelectorAll('[data-year]').forEach(function(el){
  el.textContent = new Date().getFullYear();
});

/* ---------- Antes / Después (neo-toggle) ---------- */
(function antesToggle(){
  var sw = document.getElementById('antes-switch');
  if(!sw) return;
  var off = document.querySelector('[data-antes-panel="off"]');
  var on  = document.querySelector('[data-antes-panel="on"]');
  var labOff = document.querySelector('[data-toggle-off]');
  var labOn  = document.querySelector('[data-toggle-on]');
  function apply(){
    var isOn = sw.checked;
    if(off) off.hidden = isOn;
    if(on)  on.hidden = !isOn;
    if(labOff) labOff.classList.toggle('neo-toggle__label--on', !isOn);
    if(labOn)  labOn.classList.toggle('neo-toggle__label--on', isOn);
  }
  sw.addEventListener('change', apply);
  apply();
})();

/* ---------- Voice AI: reproductor de demostración ----------
   Reproduce el clip de voz real (es-ES) y anima la onda mientras suena.
   La onda arranca al reproducir y se detiene al pausar o terminar el audio. */
(function vozPlayer(){
  var btn = document.querySelector('[data-voz-play]');
  if(!btn) return;
  var card = btn.closest('.voz');
  var audio = card.querySelector('[data-voz-audio]');
  var iconPlay = btn.querySelector('[data-voz-icon-play]');
  var iconPause = btn.querySelector('[data-voz-icon-pause]');
  if(!audio) return;

  function showPlaying(on){
    card.classList.toggle('is-playing', on);
    iconPlay.hidden = on; iconPause.hidden = !on;
    btn.setAttribute('aria-label', on ? 'Pausar muestra de voz' : 'Reproducir muestra de voz');
  }
  audio.addEventListener('play',  function(){ showPlaying(true);  });
  audio.addEventListener('pause', function(){ showPlaying(false); });
  audio.addEventListener('ended', function(){ showPlaying(false); audio.currentTime = 0; });

  btn.addEventListener('click', function(){
    if(audio.paused){
      var p = audio.play();
      if(p && p.catch) p.catch(function(){ showPlaying(false); });
    } else {
      audio.pause();
    }
  });
})();

/* ---------- FAQ: acordeón (un solo panel abierto a la vez) ----------
   Usa <details data-faq>. Al abrir uno, cierra los demás del mismo grupo. */
(function faqAccordion(){
  var items = document.querySelectorAll('details[data-faq]');
  if(!items.length) return;
  items.forEach(function(item){
    item.addEventListener('toggle', function(){
      if(!item.open) return;
      items.forEach(function(other){
        if(other !== item) other.open = false;
      });
    });
  });
})();

/* ---------- Banner de cookies (RGPD/LOPD-GDD) ----------
   Se inyecta en todas las páginas si aún no hay decisión guardada.
   Bloquea cookies no esenciales hasta el consentimiento (aquí no se
   carga ningún script de terceros sin "accept"). 1 año de validez.
   El estado se expone en window.Listo247_COOKIES para futuras integraciones. */
(function cookieBanner(){
  var KEY = 'listo247-cookie-consent';
  var stored;
  try{ stored = JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(_){ stored = null; }

  // Botón "volver a mostrar el aviso" (página de política de cookies).
  document.addEventListener('click', function(e){
    if(e.target.closest('[data-cookie-reset]')){
      e.preventDefault();
      try{ localStorage.removeItem(KEY); }catch(_){}
      location.reload();
    }
  });

  window.Listo247_COOKIES = {
    accepted: stored && stored.value === 'accept',
    decision: stored ? stored.value : null
  };

  // Si ya hay decisión vigente (< 1 año), no mostramos el banner.
  if(stored && stored.ts && (Date.now() - stored.ts) < 365 * 24 * 60 * 60 * 1000) return;

  function save(value){
    try{ localStorage.setItem(KEY, JSON.stringify({ value: value, ts: Date.now() })); }catch(_){}
    window.Listo247_COOKIES = { accepted: value === 'accept', decision: value };
    // TODO(cliente): al aceptar, inicializar aquí analytics/píxeles no esenciales.
  }

  var overlay = document.createElement('div');
  overlay.className = 'cookie-modal';

  var card = document.createElement('aside');
  card.className = 'cookie-card';
  card.setAttribute('role','dialog');
  card.setAttribute('aria-modal','true');
  card.setAttribute('aria-label','Aviso de cookies');
  card.innerHTML =
    '<div class="cookie-card__head">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><path d="M8.5 8.5h.01M16 11h.01M11 15h.01"/></svg>' +
      '<h3>Usamos cookies</h3>' +
    '</div>' +
    '<p>Utilizamos cookies propias y de terceros para mejorar tu experiencia. ' +
      'Las no esenciales solo se activan si las aceptas. ' +
      'Más información en nuestra <a href="/politica-cookies.html">política de cookies</a>.</p>' +
    '<div class="cookie-card__actions">' +
      '<button type="button" class="btn btn--ghost" data-cookie="decline">Rechazar</button>' +
      '<button type="button" class="btn btn--primary" data-cookie="accept">Aceptar</button>' +
    '</div>';

  overlay.appendChild(card);

  function close(value){
    save(value);
    overlay.classList.remove('is-in');
    document.documentElement.style.overflow = '';
    setTimeout(function(){ overlay.remove(); }, 400);
  }
  overlay.addEventListener('click', function(e){
    var b = e.target.closest('[data-cookie]');
    if(b) close(b.getAttribute('data-cookie'));
  });

  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ overlay.classList.add('is-in'); });
    });
  });
})();
