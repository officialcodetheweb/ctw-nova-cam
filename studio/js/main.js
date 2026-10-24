/* Nova Studio website — Code The Web */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = '233551918658';
  const EMAIL = 'officialcodetheweb@gmail.com';

  // ---------- mobile menu ----------
  const menu = $('.menu'), mnav = $('#mobileNav');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', open); mnav.classList.toggle('open', open); });
  mnav.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.setAttribute('aria-expanded', 'false'); mnav.classList.remove('open'); } });

  // ---------- hero: the Program monitor, with a working T-bar ----------
  const mon = $('#heroMonitor'), shot = $('#heroShot'), tbar = $('#tbar'), tText = $('#heroTallyText'), tLabel = $('#tbarLabel');
  function setMix(p) {                       // p: 0 = colour bars (preview) … 100 = the studio on air
    shot.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    tbar.value = p; tbar.style.setProperty('--p', p + '%');
    const live = p >= 100; mon.classList.toggle('on-air', live); tText.textContent = live ? 'ON AIR' : p > 0 ? 'TRANSITION' : 'PREVIEW';
  }
  let anim = null;
  function auto(to, ms = 1100) {
    cancelAnimationFrame(anim); const from = +tbar.value, t0 = performance.now();
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const step = now => { const k = Math.min(1, (now - t0) / ms); setMix(from + (to - from) * ease(k)); if (k < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  tbar.addEventListener('input', () => { cancelAnimationFrame(anim); setMix(+tbar.value); tLabel.textContent = 'T-bar'; });
  $('#heroCut').addEventListener('click', () => { cancelAnimationFrame(anim); setMix(+tbar.value >= 100 ? 0 : 100); });
  setMix(0);
  const start = () => { if (reduce) { setMix(100); return; } setTimeout(() => auto(100), 700); };
  if (shot.complete) start(); else { shot.addEventListener('load', start, { once: true }); shot.addEventListener('error', () => setMix(100), { once: true }); }

  const clock = $('#heroClock');
  const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); };
  tick(); setInterval(tick, 1000);

  // ---------- screens: pick a tile, it cuts to the monitor (like an input in Nova Studio) ----------
  const SCREENS = [
    ['multiview', 'Multiview', 'Multiview — every input, Preview and Program on one screen, with on-air and preview borders. Click to preview, double-click to cut.'],
    ['console', 'Mixing Console', 'Mixing Console — channel strips with gate, compressor, de-esser and EQ, mute groups, DCAs and saved scenes.'],
    ['program', 'Program output', 'Program output — what the stream and the projector show: animated church graphics with the lower third.'],
    ['addinput', 'Add Input', 'Add Input — cameras, phones, phone microphones, screens, videos, NDI, SRT, guests, slides, web pages and more.'],
    ['color', 'Colour Corrector', 'Colour Corrector — colour wheels, waveform, vectorscope and one-click matching so every camera looks the same.'],
    ['stream', 'Streaming', 'Streaming — YouTube, Facebook, TikTok and Twitch at once, wide 16:9 or upright 9:16.'],
    ['hotkeys', 'Hotkey Studio', 'Hotkey Studio — a live keyboard map with layers, profiles and a conflict checker.'],
    ['micform', 'Phone microphone', 'Phone microphone — scan the QR code with a phone that has a lavalier plugged in, and it becomes a wireless mic. No internet needed.'],
    ['report', 'Service report', 'Service report — every problem explained in plain words, with what to do, saved as PDF after the service.']
  ];
  const box = $('#inputs'), view = $('#viewImg'), cap = $('#viewCap'), wipe = $('#viewWipe');
  let cur = 0;
  const tiles = SCREENS.map(([key, name], i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tile'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `${i + 1}: ${name}`);
    b.innerHTML = `<img src="img/${key}.webp" alt="" loading="lazy" width="320" height="180"><span class="num">${i + 1}</span><span class="nm">${name}</span>`;
    b.addEventListener('click', () => cutTo(i));
    b.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = (i + (e.key === 'ArrowRight' ? 1 : SCREENS.length - 1)) % SCREENS.length; tiles[n].focus(); cutTo(n); } });
    box.append(b); return b;
  });
  function show(i) {
    cur = i; const [key, name, text] = SCREENS[i];
    view.src = `img/${key}.webp`; view.alt = text;
    const rest = text.slice(text.indexOf('—') + 2); cap.innerHTML = `<b>${name}.</b> ${rest[0].toUpperCase() + rest.slice(1)}`;
    tiles.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
  }
  function cutTo(i) {
    if (i === cur) return;
    tiles[i].classList.add('preview');                                 // green: in Preview…
    setTimeout(() => {                                                 // …then cut to the monitor
      tiles[i].classList.remove('preview'); show(i);
      if (!reduce) { wipe.classList.remove('go'); void wipe.offsetWidth; wipe.classList.add('go'); }
    }, reduce ? 0 : 180);
  }
  show(0);
  document.addEventListener('keydown', e => {                          // keys 1–9, as in Nova Studio
    if (e.ctrlKey || e.metaKey || e.altKey || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    const n = +e.key; if (n >= 1 && n <= SCREENS.length) { const r = $('#screens').getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) cutTo(n - 1); }
  });
  // preload the full-size screens once the gallery is close
  new IntersectionObserver((es, o) => { if (es.some(e => e.isIntersecting)) { SCREENS.forEach(([k]) => { const im = new Image(); im.src = `img/${k}.webp`; }); o.disconnect(); } }, { rootMargin: '400px' }).observe($('#screens'));

  // ---------- screenshots come in with a wipe when they reach the screen ----------
  const rev = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) rev.forEach(el => el.classList.add('in'));
  else {   // watch the (unclipped) container: a fully clipped element does not count as visible
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.reveal').forEach(r => r.classList.add('in')); io.unobserve(e.target); } }), { threshold: 0.2 });
    new Set([...rev].map(el => el.parentElement)).forEach(p => io.observe(p));
  }

  // ---------- book a demo ----------
  const form = $('#demoForm'), F = form.elements, err = $('#formErr'), done = $('#formDone');
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  F.date.min = today.toISOString().slice(0, 10);
  $('#year').textContent = new Date().getFullYear();
  let via = 'whatsapp';
  form.querySelectorAll('button[type=submit]').forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('input', e => e.target.classList.remove('bad'));
  form.addEventListener('submit', e => {
    e.preventDefault(); err.textContent = '';
    const need = [['name', 'your name'], ['church', 'your church'], ['phone', 'a WhatsApp or phone number'], ['city', 'your town'], ['date', 'a date']];
    const missing = need.filter(([k]) => !F[k].value.trim());
    need.forEach(([k]) => F[k].classList.toggle('bad', !F[k].value.trim()));
    if (F.phone.value.trim() && F.phone.value.replace(/\D/g, '').length < 9) { F.phone.classList.add('bad'); missing.push(['phone', 'a full phone number']); }
    if (F.email.value.trim() && !F.email.checkValidity()) { F.email.classList.add('bad'); missing.push(['email', 'a correct email address']); }
    if (missing.length) { err.textContent = 'Please add ' + missing.map(m => m[1]).join(', ') + '.'; F[missing[0][0]].focus(); return; }
    const f = Object.fromEntries(new FormData(form));
    const uses = [...form.querySelectorAll('input[name=use]:checked')].map(x => x.value);
    const d = new Date(f.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lines = ['Hello Code The Web, I would like to book a Nova Studio demo.', '', `Name: ${f.name}`, `Church: ${f.church}`, `Phone / WhatsApp: ${f.phone}`];
    if (f.email) lines.push(`Email: ${f.email}`);
    lines.push(`Town: ${f.city}`, `Demo: ${f.mode}`, `Preferred: ${d}, ${f.time}`);
    if (uses.length) lines.push(`We use today: ${uses.join(', ')}`);
    if (f.note && f.note.trim()) lines.push('', f.note.trim());
    const text = lines.join('\n');
    const url = via === 'email'
      ? `mailto:${EMAIL}?subject=${encodeURIComponent('Nova Studio demo — ' + f.church)}&body=${encodeURIComponent(text)}`
      : `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
    if (via === 'email') location.href = url; else window.open(url, '_blank', 'noopener');
    $('#formDoneText').textContent = via === 'email'
      ? 'Your email app opened with the details filled in. Press Send to book — we will reply to confirm the time.'
      : 'WhatsApp opened with your details filled in. Press Send to book — we will reply to confirm the time.';
    done.hidden = false; done.querySelector('button').focus();
  });
  $('#formAgain').addEventListener('click', () => { done.hidden = true; form.reset(); F.name.focus(); });
})();
