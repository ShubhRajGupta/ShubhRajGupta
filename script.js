/* ══════════ HEATMAP GENERATION ══════════ */
(function generateHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;
  const levels = ['#0a0e17', '#003d1f', '#006633', '#00994d', '#00ff88'];
  for (let i = 0; i < 182; i++) { // 26 weeks * 7 days
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    // Weighted random: more likely to have contributions
    const r = Math.random();
    let level;
    if (r < 0.15) level = 0;
    else if (r < 0.35) level = 1;
    else if (r < 0.55) level = 2;
    else if (r < 0.8) level = 3;
    else level = 4;
    cell.style.background = levels[level];
    grid.appendChild(cell);
  }
})();

/* ══════════ RADAR ANIMATION ══════════ */
(function drawRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 100, cy = 100, maxR = 90;
  let angle = 0;

  // Signal dots
  const dots = [];
  const colors = ['#06b6d4', '#f59e0b', '#00ff88', '#8b5cf6', '#ec4899'];
  for (let i = 0; i < 25; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 20 + Math.random() * 65;
    dots.push({
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.3 + Math.random() * 0.7,
      size: 2 + Math.random() * 3
    });
  }

  function draw() {
    ctx.clearRect(0, 0, 200, 200);

    // Rings
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * i / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,255,136,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Cross lines
    ctx.strokeStyle = 'rgba(0,255,136,0.07)';
    ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();

    // Sweep
    const grad = ctx.createConicalGradient ? null : null;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxR, angle, angle + 0.5);
    ctx.closePath();
    const sweepGrad = ctx.createLinearGradient(cx, cy, cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
    sweepGrad.addColorStop(0, 'rgba(0,255,136,0.3)');
    sweepGrad.addColorStop(1, 'rgba(0,255,136,0)');
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Dots
    dots.forEach(d => {
      const dotAngle = Math.atan2(d.y - cy, d.x - cx);
      let diff = angle - dotAngle;
      while (diff < 0) diff += Math.PI * 2;
      const brightness = diff < 1 ? 1 : Math.max(0.2, 1 - diff / 3);

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.alpha * brightness;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff88';
    ctx.fill();

    angle += 0.02;
    if (angle > Math.PI * 2) angle -= Math.PI * 2;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════ PROJECT CONSTELLATION ══════════ */
(function drawConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width - 40;
  canvas.height = 260;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;

  const projects = [
    { name: 'Community\nIntelligence\nNetwork', x: cx, y: cy, r: 28, color: '#00ff88', sub: '(Center Hub)' },
    { name: 'Numis AI', x: cx + 120, y: cy - 80, r: 16, color: '#06b6d4', sub: '(Knowledge Extraction)' },
    { name: 'TerraChain', x: cx - 140, y: cy + 50, r: 16, color: '#8b5cf6', sub: '(Decentralized Infra)' },
    { name: 'Internet\nComplaint Miner', x: cx - 150, y: cy - 60, r: 16, color: '#ec4899', sub: '(Problem Discovery)' },
    { name: 'Opportunity\nGraph', x: cx + 100, y: cy + 20, r: 16, color: '#f59e0b', sub: '(Opportunity Mapping)' },
    { name: 'Universal Event\nHarvester', x: cx + 20, y: cy + 100, r: 16, color: '#06b6d4', sub: '(Event Intelligence)' },
    { name: 'Digital Presence\nOS', x: cx - 80, y: cy + 100, r: 16, color: '#3b82f6', sub: '(Personal OS)' }
  ];

  // Background stars
  const stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.5, a: Math.random() });
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      const flicker = 0.3 + Math.sin(t * 2 + s.x) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a * flicker})`;
      ctx.fill();
    });

    // Connections
    for (let i = 1; i < projects.length; i++) {
      const p = projects[i];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(0,255,136,${0.15 + Math.sin(t + i) * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Data flow particles
      const progress = (t * 0.3 + i * 0.5) % 1;
      const px = cx + (p.x - cx) * progress;
      const py = cy + (p.y - cy) * progress;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Nodes
    projects.forEach((p, i) => {
      // Glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
      glow.addColorStop(0, p.color + '30');
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = i === 0 ? 2 : 1.5;
      ctx.fill();
      ctx.stroke();

      // Icon (center dot)
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Label
      ctx.font = `${i === 0 ? '600 11px' : '500 9px'} Inter, sans-serif`;
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      const lines = p.name.split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, p.x, p.y + p.r + 14 + li * 12);
      });
      if (p.sub) {
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(p.sub, p.x, p.y + p.r + 14 + lines.length * 12);
      }
    });

    t += 0.01;
    requestAnimationFrame(draw);
  }
  draw();

  // Resize handler
  window.addEventListener('resize', () => {
    const r2 = canvas.parentElement.getBoundingClientRect();
    canvas.width = r2.width - 40;
    // Recalculate center
    projects[0].x = canvas.width / 2;
    projects[0].y = H / 2;
  });
})();

/* ══════════ BUTTON INTERACTIONS ══════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => { this.style.transform = ''; }, 150);
  });
});

/* ══════════ CARD ENTRANCE ANIMATION ══════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

/* ══════════ YEAR UPDATE ══════════ */
document.getElementById('year').textContent = new Date().getFullYear();
