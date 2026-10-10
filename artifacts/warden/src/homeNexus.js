// WARDEN Interactive Holographic Nexus & Landing Page Engine
import { sfx } from './audioSynth.js';
import { renderWardenLogo, WARDEN_BRAND } from './logo.js';

export function renderHomeSidebarDrawer(navItems, currentView, ico) {
  return `
    <div class="home-sidebar-backdrop" id="homeSidebarBackdrop"></div>
    <aside class="home-sidebar-drawer" id="homeSidebarDrawer" aria-label="Operations Navigation Drawer">
      <div class="drawer-header">
        <div class="brand">
          <div class="brand-mark">${renderWardenLogo(36)}</div>
          <div class="brand-copy">
            <div class="brand-name">${WARDEN_BRAND}</div>
            <div class="brand-caption">SECURITY COMMAND</div>
          </div>
        </div>
        <button class="icon-button close-drawer-btn" data-action="close-home-drawer" aria-label="Close navigation drawer">
          ${ico('x')}
        </button>
      </div>

      <div class="nav-label">OPERATIONS DECK</div>
      <nav class="drawer-nav-list">
        ${navItems
          .map(
            ([id, ic, title]) => `
          <button class="nav-item ${currentView === id ? 'active' : ''}" data-nav="${id}" aria-label="${title}">
            ${ico(ic)}
            <span>${title}</span>
            <span class="nav-arrow">→</span>
          </button>
        `,
          )
          .join('')}
      </nav>

      <div class="drawer-quick-telemetry">
        <div class="drawer-telemetry-header">QUICK TELEMETRY</div>
        <div class="drawer-stat-row">
          <span>SIMULATED RUNS:</span>
          <strong class="text-cyan">2,841</strong>
        </div>
        <div class="drawer-stat-row">
          <span>HARDENED POLICIES:</span>
          <strong class="text-emerald">936</strong>
        </div>
        <div class="drawer-stat-row">
          <span>VERIFICATION GATES:</span>
          <strong class="text-amber">4/4 ORDERED</strong>
        </div>
      </div>

      <div class="drawer-footer">
        <span class="side-footer-copy">© 2026 THE WARDEN<span class="warden-dot" aria-hidden="true">.</span> ALL RIGHTS RESERVED</span>
      </div>
    </aside>
  `;
}

export function initHomeInteractiveNexus() {
  const canvas = document.querySelector('#nexusCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: 1 + Math.random() * 2,
      color: Math.random() > 0.5 ? '#06B6D4' : '#EF4444',
      alpha: 0.2 + Math.random() * 0.5,
    });
  }

  // Energy pulses
  const energyPulses = [];
  window.triggerNexusPulse = function (type = 'clash') {
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.5;
    if (type === 'red') {
      sfx.laser();
      for (let i = 0; i < 20; i++) {
        energyPulses.push({
          x: canvas.width * 0.22,
          y: canvas.height * 0.35,
          targetX: cx,
          targetY: cy,
          progress: 0,
          speed: 0.025 + Math.random() * 0.03,
          color: '#EF4444',
        });
      }
    } else if (type === 'blue') {
      sfx.shield();
      for (let i = 0; i < 20; i++) {
        energyPulses.push({
          x: canvas.width * 0.78,
          y: canvas.height * 0.65,
          targetX: cx,
          targetY: cy,
          progress: 0,
          speed: 0.025 + Math.random() * 0.03,
          color: '#06B6D4',
        });
      }
    } else {
      sfx.clash();
      // Dual clash
      window.triggerNexusPulse('red');
      window.triggerNexusPulse('blue');
    }
  };

  let radarAngle = 0;
  let animId = null;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.5;

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw radar sweep in center
    radarAngle += 0.02;
    ctx.save();
    ctx.translate(cx, cy);
    const sweepRadius = Math.min(canvas.width, canvas.height) * 0.42;

    // Concentric radar circles
    [0.3, 0.6, 0.9].forEach((frac) => {
      ctx.beginPath();
      ctx.arc(0, 0, sweepRadius * frac, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Radar line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(radarAngle) * sweepRadius, Math.sin(radarAngle) * sweepRadius);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // Floating particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Energy pulses traveling towards Judge
    for (let i = energyPulses.length - 1; i >= 0; i--) {
      const ep = energyPulses[i];
      ep.progress += ep.speed;
      const px = ep.x + (ep.targetX - ep.x) * ep.progress;
      const py = ep.y + (ep.targetY - ep.y) * ep.progress;

      ctx.save();
      ctx.fillStyle = ep.color;
      ctx.shadowColor = ep.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (ep.progress >= 1) {
        energyPulses.splice(i, 1);
      }
    }

    animId = requestAnimationFrame(animate);
  }

  animId = requestAnimationFrame(animate);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}
