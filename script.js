window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loader-progress');
  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 28;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => { loader.classList.add('hidden'); initSite(); }, 350);
    }
    progress.style.width = width + '%';
  }, 90);
});

function initSite() {
  initCursor();
  initTheme();
  initLang();
  initMagnetic();
  initScroll();
  initThree();
  initAnimations();
  initFilters();
  initLightbox();
  initConfigurator();
  initForm();
  initMobileMenu();
  initCounters();
  initCopy();
  initFab();
}

function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });
  (function anim() {
    followerX += (mouseX - followerX - 20) * 0.14;
    followerY += (mouseY - followerY - 20) * 0.14;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(anim);
  })();
  document.querySelectorAll('a, button, .magnetic, .work-card, .skill, .config-opt, summary').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });
}

function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.className = saved;
  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    document.body.className = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

function initLang() {
  const toggle = document.querySelector('.lang-toggle');
  let current = localStorage.getItem('lang') || 'ru';
  function applyLang(lang) {
    current = lang;
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-ru]').forEach(el => {
      const val = el.getAttribute(`data-${lang}`);
      if (val !== null) el.textContent = val;
    });
    document.querySelector('.lang-ru').classList.toggle('active', lang === 'ru');
    document.querySelector('.lang-en').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
  }
  applyLang(current);
  toggle.addEventListener('click', () => applyLang(current === 'ru' ? 'en' : 'ru'));
}

function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });
}

function initScroll() {
  const header = document.querySelector('.header');
  const bar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  });
}

function initThree() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 6.5);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(4, 6, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0x93c5fd, 0.3);
  fill.position.set(-4, 2, -3); scene.add(fill);
  const rim = new THREE.PointLight(0x3b82f6, 0.5, 18);
  rim.position.set(0, -1, 4); scene.add(rim);

  const isDark = () => document.body.classList.contains('dark');
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  const centralMat = new THREE.MeshPhysicalMaterial({
    color: isDark() ? 0x1a1a1e : 0xe8e8ec, metalness: 0.75, roughness: 0.22,
    clearcoat: 0.85, clearcoatRoughness: 0.12, transparent: true, opacity: 0.88, side: THREE.DoubleSide
  });
  const central = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), centralMat);
  mainGroup.add(central);

  const wireMat = new THREE.MeshBasicMaterial({ color: isDark() ? 0x4a4a55 : 0xb0b0b8, wireframe: true, transparent: true, opacity: 0.3 });
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), wireMat);
  mainGroup.add(wire);

  const orbitGroup = new THREE.Group();
  mainGroup.add(orbitGroup);
  const cfgs = [
    { geo: new THREE.OctahedronGeometry(0.32, 0), dist: 2.7, speed: 0.38, y: 0.55 },
    { geo: new THREE.TetrahedronGeometry(0.36, 0), dist: 3.1, speed: -0.28, y: -0.7 },
    { geo: new THREE.DodecahedronGeometry(0.28, 0), dist: 2.4, speed: 0.5, y: 1.0 },
    { geo: new THREE.TorusGeometry(0.26, 0.07, 12, 24), dist: 3.3, speed: -0.22, y: -0.25 },
    { geo: new THREE.IcosahedronGeometry(0.22, 0), dist: 2.85, speed: 0.42, y: 0.15 },
    { geo: new THREE.BoxGeometry(0.3, 0.3, 0.3), dist: 3.0, speed: -0.32, y: -0.95 }
  ];
  const orbitMeshes = [];
  const orbitMats = [];
  cfgs.forEach((c, i) => {
    const m = new THREE.MeshPhysicalMaterial({
      color: isDark() ? 0x25252a : 0xe0e0e6, metalness: 0.65, roughness: 0.28, clearcoat: 0.55, transparent: true, opacity: 0.9
    });
    orbitMats.push(m);
    const mesh = new THREE.Mesh(c.geo, m);
    mesh.userData = { dist: c.dist, speed: c.speed, yBase: c.y, offset: (i / cfgs.length) * Math.PI * 2, rotSpeed: 0.007 + Math.random() * 0.01 };
    orbitGroup.add(mesh);
    orbitMeshes.push(mesh);
  });

  const ringMat = new THREE.MeshBasicMaterial({ color: isDark() ? 0x3b82f6 : 0x2563eb, transparent: true, opacity: 0.25 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.025, 8, 64), ringMat);
  ring.rotation.x = Math.PI / 2.3; mainGroup.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.018, 8, 64), new THREE.MeshBasicMaterial({ color: isDark() ? 0x333340 : 0xc0c0c8, transparent: true, opacity: 0.2 }));
  ring2.rotation.x = Math.PI / 1.7; ring2.rotation.y = 0.35; mainGroup.add(ring2);

  const pCount = 260;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 3 + Math.random() * 5.5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.035, color: isDark() ? 0x6b8aff : 0x6b7280, transparent: true, opacity: 0.5, sizeAttenuation: true, depthWrite: false });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  new MutationObserver(() => {
    const d = isDark();
    centralMat.color.set(d ? 0x1a1a1e : 0xe8e8ec);
    wireMat.color.set(d ? 0x4a4a55 : 0xb0b0b8);
    orbitMats.forEach(m => m.color.set(d ? 0x25252a : 0xe0e0e6));
    ringMat.color.set(d ? 0x3b82f6 : 0x2563eb);
    pMat.color.set(d ? 0x6b8aff : 0x6b7280);
    ambient.intensity = d ? 0.25 : 0.4;
    key.intensity = d ? 0.7 : 0.9;
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, scrollY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  document.addEventListener('touchmove', e => {
    if (e.touches[0]) {
      targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;
    central.rotation.x = t * 0.11 + mouseY * 0.14;
    central.rotation.y = t * 0.16 + mouseX * 0.18;
    wire.rotation.x = -t * 0.07; wire.rotation.y = t * 0.12;
    const pulse = 1 + Math.sin(t * 0.75) * 0.02;
    central.scale.setScalar(pulse); wire.scale.setScalar(pulse * 1.02);
    orbitMeshes.forEach(mesh => {
      const d = mesh.userData;
      const a = t * d.speed + d.offset;
      mesh.position.x = Math.cos(a) * d.dist;
      mesh.position.z = Math.sin(a) * d.dist;
      mesh.position.y = d.yBase + Math.sin(t * 1.1 + d.offset) * 0.22;
      mesh.rotation.x += d.rotSpeed; mesh.rotation.y += d.rotSpeed * 0.65;
    });
    ring.rotation.z = t * 0.12; ring2.rotation.z = -t * 0.08;
    particles.rotation.y = t * 0.025;
    camera.position.x = mouseX * 0.35;
    camera.position.y = -mouseY * 0.25 - scrollY * 0.0012;
    camera.lookAt(0, 0, 0);
    mainGroup.rotation.y = mouseX * 0.1;
    mainGroup.rotation.x = mouseY * 0.07;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  gsap.from('.hero-title .line', { y: 90, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.25 });
  gsap.from('.hero-badge, .hero-subtitle, .hero-cta', { y: 32, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.5 });
  gsap.utils.toArray('.section-header').forEach(h => {
    gsap.from(h, { scrollTrigger: { trigger: h, start: 'top 85%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  });
  gsap.utils.toArray('.work-card').forEach((c, i) => {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 90%' }, y: 50, opacity: 0, duration: 0.7, delay: (i % 2) * 0.08, ease: 'power3.out' });
  });
  gsap.utils.toArray('.service-card, .process-step').forEach((c, i) => {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 90%' }, y: 30, opacity: 0, duration: 0.6, delay: (i % 4) * 0.06, ease: 'power3.out' });
  });
}

function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        if (f === 'all' || card.dataset.category === f) {
          card.classList.remove('hidden');
          if (typeof gsap !== 'undefined') gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35 });
        } else card.classList.add('hidden');
      });
    });
  });
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const title = document.getElementById('lb-title');
  const desc = document.getElementById('lb-desc');
  const cards = [...document.querySelectorAll('.work-card')];
  let idx = 0;
  function open(i) {
    idx = i;
    const card = cards[idx];
    if (!card) return;
    img.src = card.querySelector('img').src.replace('w=900', 'w=1400');
    title.textContent = card.querySelector('.work-info h3').textContent;
    desc.textContent = card.querySelector('.work-info p').textContent;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('open'));
  }
  function close() {
    lb.classList.remove('open');
    setTimeout(() => { lb.hidden = true; }, 300);
  }
  cards.forEach((c, i) => c.addEventListener('click', () => open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => open((idx - 1 + cards.length) % cards.length));
  lb.querySelector('.lb-next').addEventListener('click', () => open((idx + 1) % cards.length));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open((idx - 1 + cards.length) % cards.length);
    if (e.key === 'ArrowRight') open((idx + 1) % cards.length);
  });
}

function initConfigurator() {
  let step = 1;
  const panels = document.querySelectorAll('.config-panel');
  const stepBtns = document.querySelectorAll('.config-step-btn');
  function show(s) {
    step = s;
    panels.forEach(p => p.classList.toggle('active', +p.dataset.panel === s));
    stepBtns.forEach(b => b.classList.toggle('active', +b.dataset.step === s));
    if (s === 4) updateEstimate();
  }
  document.querySelectorAll('.config-next').forEach(b => b.addEventListener('click', () => { if (step < 5) show(step + 1); }));
  document.querySelectorAll('.config-prev').forEach(b => b.addEventListener('click', () => { if (step > 1) show(step - 1); }));
  stepBtns.forEach(b => b.addEventListener('click', () => show(+b.dataset.step)));

  ['cfg-count', 'cfg-views'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateEstimate);
  });
  document.querySelectorAll('input[name="service"], input[name="complexity"], input[name="opt"]').forEach(el => {
    el.addEventListener('change', updateEstimate);
  });

  function updateEstimate() {
    const service = document.querySelector('input[name="service"]:checked')?.value || 'product';
    const count = Math.max(1, +document.getElementById('cfg-count')?.value || 1);
    const views = Math.max(1, +document.getElementById('cfg-views')?.value || 1);
    const complexity = document.querySelector('input[name="complexity"]:checked')?.value || 'simple';
    const opts = [...document.querySelectorAll('input[name="opt"]:checked')].map(o => o.value);

    // Transparent relative units — ranges only, not fixed prices
    let base = { product: 1, arch: 1.4, character: 1.6, motion: 1.8 }[service] || 1;
    let mult = { simple: 1, medium: 1.5, complex: 2.2 }[complexity] || 1;
    let score = base * mult * count * (0.5 + views * 0.25);
    if (opts.includes('animation')) score *= 1.4;
    if (opts.includes('retouch')) score *= 1.15;
    if (opts.includes('rush')) score *= 1.3;

    let label;
    if (score < 3) label = 'от 30–80 тыс. ₽ · from ~$300–800';
    else if (score < 6) label = 'от 80–180 тыс. ₽ · from ~$800–1800';
    else if (score < 12) label = 'от 180–400 тыс. ₽ · from ~$1800–4000';
    else label = 'от 400 тыс. ₽+ · from ~$4000+';

    const el = document.getElementById('estimate-value');
    if (el) el.textContent = label;
  }

  document.getElementById('cfg-submit')?.addEventListener('click', () => {
    const name = document.getElementById('cfg-name')?.value.trim();
    const email = document.getElementById('cfg-email')?.value.trim();
    const tg = document.getElementById('cfg-tg')?.value.trim();
    const msg = document.getElementById('cfg-message')?.value.trim();
    if (!name || !email || !msg) {
      showToast(document.documentElement.lang === 'en' ? 'Please fill required fields' : 'Заполните обязательные поля');
      return;
    }
    const service = document.querySelector('input[name="service"]:checked')?.value;
    const estimate = document.getElementById('estimate-value')?.textContent || '—';
    const body = `Name: ${name}%0AEmail: ${email}%0ATelegram: ${tg}%0AService: ${service}%0AEstimate: ${estimate}%0A%0A${msg}`;
    window.location.href = `mailto:enemy1032@gmail.com?subject=Project request from ${encodeURIComponent(name)}&body=${body}`;
    showToast(document.documentElement.lang === 'en' ? 'Opening email client…' : 'Открываю почтовый клиент…');
  });
}

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return;
    window.location.href = `mailto:enemy1032@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\n' + email)}`;
    showToast(document.documentElement.lang === 'en' ? 'Opening email client…' : 'Открываю почтовый клиент…');
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
}

function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = target / 50;
      const tick = () => {
        cur += step;
        if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(tick); }
        else el.textContent = target + (target > 20 ? '+' : '');
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
}

function initCopy() {
  document.querySelectorAll('.copyable').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const text = el.dataset.copy || el.textContent;
      navigator.clipboard?.writeText(text).then(() => {
        showToast(document.documentElement.lang === 'en' ? 'Copied' : 'Скопировано');
      });
    });
  });
}

function initFab() {
  document.getElementById('fab-order')?.addEventListener('click', () => {
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 300);
  }, 2200);
}
