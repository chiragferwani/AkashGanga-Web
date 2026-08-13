/*==================================================================
  SPIDER-MAN THEME INTERACTIVE EFFECTS (WEBS, SOUND, SPIDER-SENSE, CURSOR)
==================================================================*/

(function() {
  'use strict';

  // 1. Audio Synthesizer for Web Shooter ("THWIP!") Sound Effect using Web Audio API
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playThwipSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Noise buffer for web burst
      const bufferSize = audioCtx.sampleRate * 0.12; // 120ms
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for web whip sound
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
      filter.Q.setValueAtTime(3, now);

      // High pitch whip whistle tone
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);

      osc.connect(oscGain);
      oscGain.connect(gain);

      gain.connect(audioCtx.destination);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.12);
      osc.stop(now + 0.1);
    } catch(e) {
      // Audio fallback silent
    }
  }

  // 2. Interactive Dynamic Spider Web Canvas
  function initWebCanvas() {
    let canvas = document.getElementById('spidey-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'spidey-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: width / 2, y: height / 2, active: false };
    const webStrands = [];
    const webShoots = [];

    // Ambient web nodes (nodes connecting like a spider web)
    const nodeCount = Math.min(Math.floor(width / 35), 45);
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1
      });
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Create subtle web trail
      if (Math.random() < 0.3) {
        webStrands.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1.0,
          color: Math.random() > 0.5 ? '#ff003c' : '#00d2ff'
        });
      }
    });

    window.addEventListener('click', (e) => {
      playThwipSound();

      // Create Web Shot animation effect radiating to corners
      const corners = [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: 0, y: height },
        { x: width, y: height },
        { x: width / 2, y: 0 }
      ];
      const targetCorner = corners[Math.floor(Math.random() * corners.length)];

      webShoots.push({
        startX: e.clientX,
        startY: e.clientY,
        endX: targetCorner.x,
        endY: targetCorner.y,
        progress: 0,
        life: 1.0,
        nodes: Array.from({ length: 6 }, () => ({
          offset: (Math.random() - 0.5) * 40
        }))
      });

      // Spider Web Burst particles on click
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        webStrands.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: i % 2 === 0 ? '#ff003c' : '#ffffff'
        });
      }
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw web nodes & web lines connecting them
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Draw connections to nearby nodes (Spiderweb pattern)
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw connection to mouse (Interactive web pulling)
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 0, 60, ${0.35 * (1 - mdist / 180)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw web shoots (web shooter lines fired on click)
      for (let i = webShoots.length - 1; i >= 0; i--) {
        const ws = webShoots[i];
        ws.progress += 0.08;
        ws.life -= 0.02;

        if (ws.life <= 0) {
          webShoots.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ws.startX, ws.startY);

        const currentX = ws.startX + (ws.endX - ws.startX) * Math.min(ws.progress, 1);
        const currentY = ws.startY + (ws.endY - ws.startY) * Math.min(ws.progress, 1);

        // Web curve strand
        const midX = (ws.startX + currentX) / 2 + ws.nodes[0].offset * ws.life;
        const midY = (ws.startY + currentY) / 2 + ws.nodes[1].offset * ws.life;

        ctx.quadraticCurveTo(midX, midY, currentX, currentY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ws.life * 0.9})`;
        ctx.shadowColor = '#00d2ff';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        // Draw spider web spiral at impact point
        if (ws.progress >= 0.8) {
          ctx.save();
          ctx.translate(ws.startX, ws.startY);
          ctx.beginPath();
          for (let r = 0; r < 5; r++) {
            const rad = r * 8 * (1.2 - ws.life);
            ctx.arc(0, 0, rad, 0, Math.PI * 2);
          }
          ctx.strokeStyle = `rgba(239, 68, 68, ${ws.life * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw web trail particles
      for (let i = webStrands.length - 1; i >= 0; i--) {
        const p = webStrands[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          webStrands.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 3. Spider-Sense Sound Toggle & Floating HUD Widget
  function injectSpideyHUD() {
    // Check if HUD already injected
    if (document.getElementById('spidey-hud')) return;

    const hud = document.createElement('div');
    hud.id = 'spidey-hud';
    hud.className = 'spidey-hud-container';
    hud.innerHTML = `
      <div class="spidey-sense-badge">
        <div class="spidey-sense-pulse"></div>
        <span class="spidey-sense-text">⚡ SPIDER-SENSE ENGAGED</span>
      </div>
      <button id="spidey-sound-btn" class="spidey-sound-btn" title="Toggle Web Shooter Audio">
        <span id="sound-icon">🕸️</span> <span id="sound-label">THWIP: ON</span>
      </button>
    `;

    document.body.appendChild(hud);

    const soundBtn = document.getElementById('spidey-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundEnabled = !soundEnabled;
        const icon = document.getElementById('sound-icon');
        const label = document.getElementById('sound-label');
        if (soundEnabled) {
          icon.textContent = '🕸️';
          label.textContent = 'THWIP: ON';
          soundBtn.classList.remove('muted');
          playThwipSound();
        } else {
          icon.textContent = '🔇';
          label.textContent = 'THWIP: OFF';
          soundBtn.classList.add('muted');
        }
      });
    }
  }

  // 4. Custom Spider-Man Reticle Cursor (Using assets/svgs/spider.svg)
  function initSpideyCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'spidey-custom-cursor';
    const basePath = window.location.pathname.includes('/exoplanets/') ? '../' : './';
    cursor.innerHTML = `
      <img src="${basePath}assets/svgs/spider.svg" style="width: 64px; height: 64px; filter: drop-shadow(0 0 12px #ff003c) drop-shadow(0 0 20px #00d2ff) brightness(0) invert(1); display: block;" alt="Spider Cursor" />
    `;
    cursor.style.position = 'fixed';
    cursor.style.top = '0';
    cursor.style.left = '0';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '99999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'transform 0.05s ease-out';
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, input, .travel__card, .history__card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.4) rotate(15deg)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
      });
    });
  }

  // Initialize all Spidey effects when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initWebCanvas();
      injectSpideyHUD();
      initSpideyCursor();
    });
  } else {
    initWebCanvas();
    injectSpideyHUD();
    initSpideyCursor();
  }

})();
