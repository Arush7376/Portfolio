const config = window.PORTFOLIO_CONFIG || {};
const profile = config.profile || {};
const heroConfig = config.hero || {};
const githubConfig = config.github || {};

const progressBar = document.getElementById("progressBar");
const preloader = document.getElementById("preloader");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const avatarStage = document.getElementById("avatarStage");
const bgCanvas = document.getElementById("bgCanvas");

const typedRole = document.getElementById("typedRole");
const roleWords = heroConfig.typedRoles || [
  "Cybersecurity Enthusiast",
  "Ethical Hacking Learner",
  "Problem Solver",
];

const projectFilters = document.getElementById("projectFilters");
const projectsGrid = document.getElementById("projectsGrid");
const projectCount = document.getElementById("projectCount");
const heroName = document.querySelector(".hero-copy h1 span");

let allRepos = [];
let activeFilter = "All";

function hidePreloader() {
  if (!preloader) return;
  window.setTimeout(() => preloader.classList.add("hide"), 580);
}

hidePreloader();

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typedRole) return;
  const current = roleWords[wordIndex] || "Cybersecurity Enthusiast";
  charIndex += deleting ? -1 : 1;
  typedRole.textContent = current.slice(0, charIndex);

  let delay = deleting ? 46 : 78;
  if (!deleting && charIndex === current.length) {
    deleting = true;
    delay = 920;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % roleWords.length;
    delay = 220;
  }

  window.setTimeout(typeLoop, delay);
}

typeLoop();

if (heroName) {
  heroName.classList.add("glitch-title");
  heroName.setAttribute("data-text", heroName.textContent || "Arush Mishra");
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    menuBtn.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      menuBtn.classList.remove("open");
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
  revealObserver.observe(item);
});

function updateScrollUI() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;

  const marker = window.scrollY + 130;
  sections.forEach((section) => {
    const id = section.getAttribute("id");
    if (!id) return;

    const start = section.offsetTop;
    const end = start + section.offsetHeight;
    if (marker >= start && marker < end) {
      navAnchors.forEach((a) => a.classList.remove("active"));
      document.querySelector(`.nav-links a[href="#${id}"]`)?.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("load", updateScrollUI);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && avatarStage) {
  window.addEventListener(
    "mousemove",
    (event) => {
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;
      avatarStage.style.transform = `rotateX(${yRatio * -8}deg) rotateY(${xRatio * 12}deg)`;
    },
    { passive: true }
  );
}

function attachTilt(card, strength = 6) {
  const onMove = (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = 0.5 - (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--spot-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--spot-y", `${(0.5 - y) * 100}%`);
    card.style.transform = `rotateX(${y * strength}deg) rotateY(${x * strength}deg)`;
  };

  const onLeave = () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
}

document.querySelectorAll("[data-tilt]").forEach((card) => attachTilt(card, 5.5));

function setupCardSpotlights() {
  if (reduceMotion) return;
  document.querySelectorAll(".card, .hero-panel").forEach((panel) => {
    panel.style.setProperty("--spot-x", "50%");
    panel.style.setProperty("--spot-y", "50%");

    panel.addEventListener("mousemove", (event) => {
      const rect = panel.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      panel.style.setProperty("--spot-x", `${x}%`);
      panel.style.setProperty("--spot-y", `${y}%`);
    });
  });
}

function setupHeroParallax() {
  if (reduceMotion || !heroName) return;
  const heroCopy = document.querySelector(".hero-copy");
  if (!heroCopy) return;

  window.addEventListener(
    "mousemove",
    (event) => {
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;
      heroName.style.transform = `translate(${xRatio * 14}px, ${yRatio * 7}px)`;
      heroCopy.style.setProperty("--hero-glow-x", `${(xRatio + 0.5) * 100}%`);
      heroCopy.style.setProperty("--hero-glow-y", `${(yRatio + 0.5) * 100}%`);
    },
    { passive: true }
  );
}

function setupMagneticElements() {
  if (reduceMotion) return;
  const targets = document.querySelectorAll(".btn, .quick-links a");
  targets.forEach((target) => {
    target.addEventListener("mousemove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      target.style.transform = `translate(${x}px, ${y}px)`;
    });

    target.addEventListener("mouseleave", () => {
      target.style.transform = "";
    });
  });
}

function setupCursorGlow() {
  if (reduceMotion) return;
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.append(glow);

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let running = true;

  const animate = () => {
    if (!running) return;
    currentX += (targetX - currentX) * 0.13;
    currentY += (targetY - currentY) * 0.13;
    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.classList.add("active");
    },
    { passive: true }
  );

  window.addEventListener("mouseout", () => glow.classList.remove("active"));
  animate();
}

setupMagneticElements();
setupCursorGlow();
setupCardSpotlights();
setupHeroParallax();

function animateCount(element, value) {
  if (!element || Number.isNaN(value)) return;
  const duration = 900;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.round(progress * value).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function repoTitle(name) {
  return String(name || "Untitled Project")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function formatDate(iso) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function hueFromText(text, seed) {
  let hash = 0;
  const source = `${text}:${seed}`;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

function makeProjectImage(repo) {
  const title = repoTitle(repo.name);
  const lang = repo.language || "Mixed Stack";
  const h1 = hueFromText(repo.name, 1);
  const h2 = hueFromText(repo.name, 2);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" role="img" aria-label="${escapeHtml(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#09162f"/>
      <stop offset="100%" stop-color="#0d2848"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="hsl(${h1} 80% 60%)"/>
      <stop offset="100%" stop-color="hsl(${h2} 86% 66%)"/>
    </linearGradient>
  </defs>
  <rect width="960" height="420" rx="22" fill="url(#bg)"/>
  <g opacity="0.16" stroke="#95c1ff">
    <path d="M0 70h960M0 140h960M0 210h960M0 280h960M0 350h960"/>
    <path d="M120 0v420M240 0v420M360 0v420M480 0v420M600 0v420M720 0v420M840 0v420"/>
  </g>
  <path d="M70 285L180 220L295 265L400 180L510 235L620 150L735 220L890 118" stroke="url(#line)" stroke-width="11" fill="none" stroke-linecap="round"/>
  <circle cx="400" cy="180" r="12" fill="hsl(${h1} 88% 66%)"/>
  <circle cx="620" cy="150" r="12" fill="hsl(${h2} 90% 70%)"/>
  <text x="54" y="56" fill="#d9ecff" font-size="38" font-family="JetBrains Mono, monospace">${escapeHtml(title)}</text>
  <text x="54" y="388" fill="#9cd3ff" font-size="25" font-family="JetBrains Mono, monospace">${escapeHtml(lang)}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeLanguage(repo) {
  return repo.language || "Other";
}

function createProjectFilters(repos) {
  if (!projectFilters) return;
  const languageSet = new Set(["All"]);
  repos.forEach((repo) => languageSet.add(normalizeLanguage(repo)));

  projectFilters.innerHTML = [...languageSet]
    .sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    })
    .map(
      (lang) =>
        `<button type="button" class="filter-btn ${
          lang === activeFilter ? "active" : ""
        }" data-filter="${escapeHtml(lang)}">${escapeHtml(lang)}</button>`
    )
    .join("");

  projectFilters.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter || "All";
      createProjectFilters(allRepos);
      renderProjects(allRepos);
    });
  });
}

function renderProjects(repos) {
  if (!projectsGrid || !Array.isArray(repos)) return;

  const visible = repos
    .filter((repo) => activeFilter === "All" || normalizeLanguage(repo) === activeFilter)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

  if (projectCount) projectCount.textContent = String(repos.length);

  if (visible.length === 0) {
    projectsGrid.innerHTML = `
      <article class="card reveal visible">
        <h3>No projects in this filter</h3>
        <p>Try selecting another technology filter.</p>
      </article>`;
    return;
  }

  projectsGrid.innerHTML = visible
    .map((repo) => {
      const name = repoTitle(repo.name);
      const desc = repo.description || "No description provided yet.";
      const lang = normalizeLanguage(repo);
      const stars = Number(repo.stargazers_count || 0);
      const updated = formatDate(repo.pushed_at || repo.updated_at);
      const image = makeProjectImage(repo);

      return `
        <article class="card project reveal" data-tilt>
          <img class="project-image" src="${image}" alt="${escapeHtml(name)} visual" loading="lazy" />
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(desc)}</p>
          <p><strong>Tech:</strong> ${escapeHtml(lang)}</p>
          <div class="project-meta"><span>Stars: ${stars}</span><span>Updated: ${escapeHtml(updated)}</span></div>
          <a class="btn btn-soft" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">Open Repository</a>
        </article>`;
    })
    .join("");

  projectsGrid.querySelectorAll(".project").forEach((card) => {
    revealObserver.observe(card);
    attachTilt(card, 5.5);
  });
}

async function fetchGithubData() {
  const reposMetric = document.getElementById("metricRepos");
  const followerMetric = document.getElementById("metricFollowers");
  const starsMetric = document.getElementById("metricStars");

  const githubUser = profile.githubUser || "Arush7376";
  const maxRepos = Number(githubConfig.maxRepos || 100);
  const sort = githubConfig.sort || "updated";

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUser}`),
      fetch(`https://api.github.com/users/${githubUser}/repos?per_page=${maxRepos}&sort=${sort}`),
    ]);

    if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API failed");

    const user = await userRes.json();
    const repos = await reposRes.json();
    const totalStars = repos.reduce((sum, repo) => sum + Number(repo.stargazers_count || 0), 0);

    allRepos = [...repos];
    createProjectFilters(allRepos);
    renderProjects(allRepos);

    animateCount(reposMetric, Number(user.public_repos || 0));
    animateCount(followerMetric, Number(user.followers || 0));
    animateCount(starsMetric, totalStars);
  } catch {
    [reposMetric, followerMetric, starsMetric].forEach((el) => {
      if (el) el.textContent = "N/A";
    });
    allRepos = [];
    createProjectFilters([]);
    renderProjects([]);
  }
}

fetchGithubData();

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button[type='submit']");
    if (!button) return;

    const original = button.textContent;
    button.textContent = "Message Sent";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
      contactForm.reset();
    }, 1600);
  });
}

function setupBackgroundCanvas() {
  if (!bgCanvas || reduceMotion) return;

  const ctx = bgCanvas.getContext("2d");
  if (!ctx) return;

  const points = [];
  let width = 0;
  let height = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = Math.floor(width * dpr);
    bgCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    points.length = 0;
    const count = Math.max(40, Math.floor((width * height) / 28000));
    for (let i = 0; i < count; i += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      });
    }
  };

  resize();
  window.addEventListener("resize", resize);

  const tick = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.fillStyle = "rgba(130, 185, 255, 0.38)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.25, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < points.length; j += 1) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 118) continue;

        const alpha = 1 - dist / 118;
        ctx.strokeStyle = `rgba(123, 172, 255, ${alpha * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

setupBackgroundCanvas();
