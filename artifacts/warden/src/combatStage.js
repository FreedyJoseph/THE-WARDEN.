// WARDEN Cyber-Arcade Fighting Arena Engine
// High-octane Red (Zero-Day) vs Blue (Aegis-9) animated duel stage
import { sfx } from './audioSynth.js';

class CombatStage {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.floatingTexts = [];
    this.animId = null;
    this.redHp = 100;
    this.blueHp = 25;
    this.lastTime = 0;
  }

  init(container) {
    if (!container) return;
    this.container = container;
    this.canvas = container.querySelector('#combatCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    this.startLoop();
    this.setIdle();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  startLoop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const loop = (timestamp) => {
      this.update(timestamp);
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  update(timestamp) {
    const dt = (timestamp - this.lastTime) / 1000 || 0.016;
    this.lastTime = timestamp;

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating arcade texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.scale = Math.min(1.2, ft.scale + 0.04);
      ft.life -= dt;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.glow || 8;
      ctx.beginPath();
      if (p.type === 'slash') {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      } else if (p.type === 'spark') {
        ctx.rect(p.x, p.y, p.size, p.size * (p.streak || 2));
      } else if (p.type === 'hex') {
        this.drawHex(ctx, p.x, p.y, p.size);
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }

    // Draw floating arcade texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = `900 ${Math.floor(ft.size * ft.scale)}px 'Orbitron', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 14;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  drawHex(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + r * Math.cos(angle);
      const hy = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  }

  // --- Particle Emitter Helpers ---
  spawnSparks(x, y, count = 20, color = '#EF4444') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        gravity: 0.18,
        size: 2 + Math.random() * 3,
        streak: 1.5 + Math.random() * 2,
        color,
        glow: 12,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        alpha: 1,
      });
    }
  }

  spawnShieldRipples(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'hex',
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 15 + Math.random() * 25,
        color: '#06B6D4',
        glow: 16,
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
        alpha: 1,
      });
    }
  }

  spawnShockwave(x, y, color = '#F59E0B') {
    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28;
      const speed = 6 + Math.random() * 5;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0,
        size: 3,
        color,
        glow: 15,
        life: 0.4,
        maxLife: 0.4,
        alpha: 1,
      });
    }
  }

  spawnFloatingText(text, x, y, color = '#EF4444', size = 18) {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -1.8,
      size,
      scale: 0.6,
      color,
      life: 1.1,
      maxLife: 1.1,
      alpha: 1,
    });
  }

  shakeStage(intensity = 8) {
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;
    stage.classList.remove('shake-sm', 'shake-lg');
    void stage.offsetWidth;
    stage.classList.add(intensity > 5 ? 'shake-lg' : 'shake-sm');
    setTimeout(() => {
      stage.classList.remove('shake-sm', 'shake-lg');
    }, 400);
  }

  // --- High Level Combat Actions ---
  setIdle() {
    const red = document.querySelector('#fighterRed');
    const blue = document.querySelector('#fighterBlue');
    const judge = document.querySelector('#fighterJudge');
    if (red) red.className = 'fighter-box fighter-red-box state-idle';
    if (blue) blue.className = 'fighter-box fighter-blue-box state-idle';
    if (judge) judge.className = 'judge-drone state-scan';
    this.updateHealthUI();
  }

  redAttack(payloadName = 'T1611 PROBE') {
    const red = document.querySelector('#fighterRed');
    const blue = document.querySelector('#fighterBlue');
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;

    sfx.strike();

    if (red) red.className = 'fighter-box fighter-red-box state-strike';
    if (blue) blue.className = 'fighter-box fighter-blue-box state-hit';

    const stageRect = stage.getBoundingClientRect();
    const clashX = stageRect.width * 0.52;
    const clashY = stageRect.height * 0.58;

    setTimeout(() => {
      this.spawnSparks(clashX, clashY, 28, '#EF4444');
      this.spawnFloatingText(`CRITICAL PROBE! [${payloadName}]`, clashX - 40, clashY - 60, '#EF4444', 16);
      this.shakeStage(6);
    }, 240);

    setTimeout(() => {
      if (red && red.classList.contains('state-strike')) {
        red.className = 'fighter-box fighter-red-box state-idle';
      }
      if (blue && blue.classList.contains('state-hit')) {
        blue.className = 'fighter-box fighter-blue-box state-idle';
      }
    }, 900);
  }

  blueDefend(label = 'POLICY PATCH') {
    const blue = document.querySelector('#fighterBlue');
    const red = document.querySelector('#fighterRed');
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;

    sfx.shield();

    if (blue) blue.className = 'fighter-box fighter-blue-box state-shield-up';
    if (red) red.className = 'fighter-box fighter-red-box state-recoil';

    const stageRect = stage.getBoundingClientRect();
    const shieldX = stageRect.width * 0.56;
    const shieldY = stageRect.height * 0.55;

    this.spawnShieldRipples(shieldX, shieldY, 14);
    this.spawnFloatingText(`HEX SHIELD DEPLOYED! [${label}]`, shieldX, shieldY - 70, '#06B6D4', 16);
    this.shakeStage(4);

    this.blueHp = Math.min(100, this.blueHp + 25);
    this.updateHealthUI();

    setTimeout(() => {
      if (blue && blue.classList.contains('state-shield-up')) {
        blue.className = 'fighter-box fighter-blue-box state-idle';
      }
      if (red && red.classList.contains('state-recoil')) {
        red.className = 'fighter-box fighter-red-box state-idle';
      }
    }, 1100);
  }

  clashImpact() {
    const red = document.querySelector('#fighterRed');
    const blue = document.querySelector('#fighterBlue');
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;

    sfx.clash();

    if (red) red.className = 'fighter-box fighter-red-box state-clash';
    if (blue) blue.className = 'fighter-box fighter-blue-box state-clash';

    const stageRect = stage.getBoundingClientRect();
    const midX = stageRect.width * 0.5;
    const midY = stageRect.height * 0.56;

    this.spawnShockwave(midX, midY, '#F59E0B');
    this.spawnSparks(midX, midY, 35, '#EF4444');
    this.spawnShieldRipples(midX, midY, 18);
    this.spawnFloatingText('CLASH! ADVERSARIAL COLLISION!', midX, midY - 80, '#F59E0B', 20);
    this.shakeStage(12);

    setTimeout(() => {
      if (red) red.className = 'fighter-box fighter-red-box state-idle';
      if (blue) blue.className = 'fighter-box fighter-blue-box state-idle';
    }, 1000);
  }

  gateFailure(gateIndex) {
    const red = document.querySelector('#fighterRed');
    const blue = document.querySelector('#fighterBlue');
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;

    sfx.gateFail();

    if (red) red.className = 'fighter-box fighter-red-box state-combo';
    if (blue) blue.className = 'fighter-box fighter-blue-box state-shield-break';

    const stageRect = stage.getBoundingClientRect();
    const midX = stageRect.width * 0.55;
    const midY = stageRect.height * 0.55;

    this.spawnSparks(midX, midY, 40, '#EF4444');
    this.spawnFloatingText(`GATE 0${gateIndex + 1} REJECTED! SHIELD BROKEN!`, midX, midY - 70, '#EF4444', 18);
    this.shakeStage(10);

    setTimeout(() => {
      if (red) red.className = 'fighter-box fighter-red-box state-idle';
      if (blue) blue.className = 'fighter-box fighter-blue-box state-idle';
    }, 1200);
  }

  gateSuccess(gateIndex) {
    const blue = document.querySelector('#fighterBlue');
    const red = document.querySelector('#fighterRed');
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;

    sfx.gatePass();

    if (blue) blue.className = 'fighter-box fighter-blue-box state-counter-bash';
    if (red) red.className = 'fighter-box fighter-red-box state-knockback';

    const stageRect = stage.getBoundingClientRect();
    const midX = stageRect.width * 0.48;
    const midY = stageRect.height * 0.55;

    this.spawnShockwave(midX, midY, '#10B981');
    this.spawnShieldRipples(midX + 60, midY, 20);
    const gateLabels = ['RE-ATTACK BLOCKED', 'REGRESSION PROOF', 'APP 200 HEALTHY', 'VARIANTS DENIED'];
    this.spawnFloatingText(`GATE 0${gateIndex + 1} PASSED! [${gateLabels[gateIndex] || 'VERIFIED'}]`, midX, midY - 70, '#10B981', 18);
    this.shakeStage(8);

    this.blueHp = Math.min(100, 25 * (gateIndex + 1));
    this.redHp = Math.max(10, 100 - 22 * (gateIndex + 1));
    this.updateHealthUI();

    setTimeout(() => {
      if (blue) blue.className = 'fighter-box fighter-blue-box state-idle';
      if (red) red.className = 'fighter-box fighter-red-box state-idle';
    }, 1200);
  }

  matchVictory() {
    const blue = document.querySelector('#fighterBlue');
    const red = document.querySelector('#fighterRed');
    const stage = document.querySelector('.combat-stage-arena');
    if (!stage) return;

    sfx.victory();

    if (blue) blue.className = 'fighter-box fighter-blue-box state-victory';
    if (red) red.className = 'fighter-box fighter-red-box state-defeated';

    const stageRect = stage.getBoundingClientRect();
    const midX = stageRect.width * 0.5;
    const midY = stageRect.height * 0.4;

    this.spawnShockwave(midX, midY, '#10B981');
    this.spawnShockwave(midX, midY + 40, '#06B6D4');
    this.spawnFloatingText('K.O. - VERIFIED SECURE!', midX, midY - 60, '#F59E0B', 28);
    this.spawnFloatingText('4 OF 4 GATES HELD', midX, midY - 15, '#10B981', 20);
    this.shakeStage(14);

    this.blueHp = 100;
    this.redHp = 0;
    this.updateHealthUI();
  }

  updateHealthUI() {
    const redBar = document.querySelector('#redHpBar');
    const redGhost = document.querySelector('#redHpGhost');
    const redVal = document.querySelector('#redHpVal');

    const blueBar = document.querySelector('#blueHpBar');
    const blueGhost = document.querySelector('#blueHpGhost');
    const blueVal = document.querySelector('#blueHpVal');

    if (redBar) redBar.style.width = `${this.redHp}%`;
    if (redVal) redVal.textContent = `${this.redHp}%`;
    if (redGhost) {
      setTimeout(() => {
        if (redGhost) redGhost.style.width = `${this.redHp}%`;
      }, 350);
    }

    if (blueBar) blueBar.style.width = `${this.blueHp}%`;
    if (blueVal) blueVal.textContent = `${this.blueHp}%`;
    if (blueGhost) {
      setTimeout(() => {
        if (blueGhost) blueGhost.style.width = `${this.blueHp}%`;
      }, 350);
    }
  }

  reset() {
    this.redHp = 100;
    this.blueHp = 25;
    this.particles = [];
    this.floatingTexts = [];
    this.setIdle();
  }
}

export const combatStage = new CombatStage();
