// dev.armid.in — theme, project ledger, the typed record, reveals, copy email.

// Theme: dark by default, remembered per visitor.
(() => {
  const root = document.documentElement;
  const btn = document.getElementById('theme');
  const sync = () => {
    const light = root.getAttribute('data-theme') === 'light';
    btn.textContent = light ? 'Dark' : 'Light';
    btn.setAttribute('aria-pressed', String(light));
    btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  };
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('dev-theme', next); } catch (e) {}
    sync();
  });
  sync();
})();

// Ledger: hovering or focusing a row shows its project in the pane.
(() => {
  const rows = [...document.querySelectorAll('.row')];
  const panels = [...document.querySelectorAll('.panel')];
  const show = (id) => {
    rows.forEach((r) => { const on = r.dataset.p === id; r.classList.toggle('is-on', on); r.setAttribute('aria-pressed', String(on)); });
    panels.forEach((p) => p.classList.toggle('is-on', p.id === 'p-' + id));
  };
  rows.forEach((r) => {
    r.addEventListener('click', () => show(r.dataset.p));
    r.addEventListener('focus', () => show(r.dataset.p));
    r.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(r.dataset.p); });
  });
})();

// The record: fifteen years of work, searchable by what you need built.
(() => {
  const record = [
    { t: 'Indoor positioning platform', d: 'BLE beacons and triangulation logic to plot beacons and people on an indoor floor plan.', m: 'Android, BLE · 2020',
      k: 'indoor positioning position location locate beacon beacons ble bluetooth triangulation trilateration iot map floor rssi' },
    { t: 'CEATEC 2019 official app', d: 'A Flutter front end over native Android and iOS SDKs; number one on both stores for the whole event.', m: 'Flutter, native SDKs · 2019',
      k: 'event conference expo flutter ios iphone cross platform native sdk store ranking ceatec tokyo japan launch' },
    { t: 'Customer identity for a super app', d: 'The Flutter front end for customer identity in the Tata Neu super app: authentication, address and profile.', m: 'Flutter · 2021–24',
      k: 'sign signin login log auth authentication otp identity account profile address user users super app ecommerce e-commerce shop flutter team lead' },
    { t: 'Lounge management and meet and greet', d: 'Android apps for airport ground staff and crew: lounge check-in, occupancy, and who to meet at which gate.', m: 'Android · 2021–24',
      k: 'airport airline lounge staff crew ground travel tourism hospitality check checkin guest guests gate flight android kiosk' },
    { t: 'Airline and travel platforms', d: 'Architecture for airline mobile solutions, from booking to boarding.', m: 'Architecture · 2024–now',
      k: 'architecture architect system design solution airline airlines travel booking boarding platform scale scalable enterprise' },
    { t: 'ScoreEase', d: 'A free, open-source Flutter score keeper, built with AI-assisted tools and polished to production.', m: 'Flutter · live and on GitHub', link: 'https://scoreease.armid.in/',
      k: 'score scores game games flutter open source web pwa side project ai assisted copilot claude' },
    { t: 'Build pipelines and quality gates', d: 'Continuous integration with Jenkins and TeamCity, and SonarQube gates that stop bad code before review.', m: 'Jenkins, TeamCity, SonarQube',
      k: 'ci cd continuous integration delivery pipeline pipelines build builds jenkins teamcity sonarqube sonar quality gate gates static analysis release automation devops utilities tooling tools' },
    { t: 'Offline data and persistence', d: 'Local-first storage with Room and SQLite on Android, and sqflite helpers on Flutter, written up for students.', m: 'Room, SQLite, SQL',
      k: 'offline local data database db sqlite room sql sqflite storage persistence cache sync migration' },
    { t: 'Networking and REST APIs', d: 'Clients for REST APIs with Retrofit and Volley, and reactive flows with RxAndroid.', m: 'Retrofit, Volley, RxAndroid',
      k: 'rest api apis network networking http retrofit volley rx rxandroid rxjava reactive backend json client' },
    { t: 'Android for global clients', d: 'Java and Kotlin apps for clients across many domains, from first sketch to store release.', m: 'Java, Kotlin · 2011–2020',
      k: 'android java kotlin native app apps client clients outsourcing lead tech mobile phone' },
    { t: 'Teams, process and version control', d: 'Scrum teams run on Jira, Backlog and Slack, with code in Git, SVN and Bitbucket.', m: 'Scrum, Agile, Git',
      k: 'team teams process scrum agile sprint jira backlog slack git svn bitbucket version control code review mentoring lead leadership' },
    { t: 'Teaching Flutter', d: 'Beginner and intermediate tutorials on widgets, state management and databases, published on Medium.', m: 'Medium · for students', link: 'https://medium.com/@midhunarmid',
      k: 'teach teaching learn learning tutorial tutorials student students beginner mentor mentoring flutter widgets state management medium blog' },
  ];
  const input = document.getElementById('q');
  const out = document.getElementById('results');
  if (!input || !out) return;
  const words = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 1);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const render = () => {
    const q = words(input.value);
    const scored = record.map((r) => {
      const keys = r.k.split(' ');
      let s = 0;
      q.forEach((w) => { keys.forEach((k) => { if (k === w) s += 3; else if (w.length > 2 && (k.startsWith(w) || w.startsWith(k))) s += 1; }); });
      return { r, s };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3);
    if (!scored.length) {
      const mail = 'mailto:midhunarmid@gmail.com?subject=' + encodeURIComponent('Question: ' + input.value.trim());
      out.innerHTML = q.length
        ? '<li><b>Nothing on the record for that yet</b><span>Ask directly and you will get a straight answer.</span><small><a class="link-plain" href="' + esc(mail) + '">Email the question</a></small></li>'
        : '<li><b>Type what you need built</b><span>A domain, a library, a problem.</span></li>';
      return;
    }
    out.innerHTML = scored.map(({ r }, n) =>
      '<li style="--n:' + n + '"><b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span><small>' + esc(r.m) +
      (r.link ? ' · <a class="link-plain" href="' + r.link + '" target="_blank" rel="noopener">open</a>' : '') + '</small></li>').join('');
  };
  let timer;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 120); });
  document.querySelectorAll('.ex').forEach((b) => b.addEventListener('click', () => {
    input.value = b.textContent; render(); input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  }));
  render();
})();

// Reveal once on entering the viewport; never leaves content hidden.
(() => {
  const targets = document.querySelectorAll('[data-reveal], .c-row');
  const showAll = () => targets.forEach((el) => el.classList.add('is-in'));
  if (!('IntersectionObserver' in window)) { showAll(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// Copy the email address.
(() => {
  const btn = document.getElementById('copy');
  if (!btn) return;
  const addr = 'midhunarmid@gmail.com';
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(addr); btn.textContent = 'Copied'; }
    catch (e) { btn.textContent = addr; }
    setTimeout(() => { btn.textContent = 'Copy the address'; }, 1800);
  });
  document.getElementById('yr').textContent = new Date().getFullYear();
})();
