/*==================================================================
  SPIDER-MAN 3D HERO CANVAS & EMBLEM VISUALIZER (spidey-3d style)
==================================================================*/

(function() {
  'use strict';

  function initSpidey3DHero() {
    const container = document.getElementById('spidey-3d-scene') || document.querySelector('.home__img')?.parentElement;
    if (!container) return;

    // Create 3D Hero Spidey Emblem Card if not existing
    let heroWrapper = document.getElementById('spidey-3d-wrapper');
    if (!heroWrapper) {
      heroWrapper = document.createElement('div');
      heroWrapper.id = 'spidey-3d-wrapper';
      heroWrapper.className = 'spidey-3d-card';
      heroWrapper.innerHTML = `
        <div class="spidey-3d-inner">
          <div class="spidey-spider-badge">
            <svg class="spidey-spider-svg" viewBox="0 0 100 100" width="120" height="120">
              <!-- Metallic Glowing Red/Blue Spider Emblem -->
              <defs>
                <linearGradient id="spideyRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff003c" />
                  <stop offset="50%" stop-color="#e50914" />
                  <stop offset="100%" stop-color="#800020" />
                </linearGradient>
                <linearGradient id="spideyBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00d2ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
                <filter id="spideyGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <!-- Outer Web Rings -->
              <circle cx="50" cy="50" r="45" stroke="url(#spideyBlueGrad)" stroke-width="1.5" fill="none" opacity="0.4" stroke-dasharray="4 2"/>
              <circle cx="50" cy="50" r="35" stroke="url(#spideyRedGrad)" stroke-width="1" fill="none" opacity="0.6"/>
              <!-- Spider Legs -->
              <!-- Top Left Legs -->
              <path d="M45 42 Q 25 20, 10 25 Q 20 35, 42 46" fill="url(#spideyRedGrad)" />
              <path d="M44 48 Q 20 35, 8 45 Q 18 52, 42 50" fill="url(#spideyRedGrad)" />
              <!-- Bottom Left Legs -->
              <path d="M44 54 Q 18 65, 12 78 Q 25 72, 43 56" fill="url(#spideyRedGrad)" />
              <path d="M46 58 Q 30 85, 25 95 Q 38 88, 48 62" fill="url(#spideyRedGrad)" />
              <!-- Top Right Legs -->
              <path d="M55 42 Q 75 20, 90 25 Q 80 35, 58 46" fill="url(#spideyRedGrad)" />
              <path d="M56 48 Q 80 35, 92 45 Q 82 52, 58 50" fill="url(#spideyRedGrad)" />
              <!-- Bottom Right Legs -->
              <path d="M56 54 Q 82 65, 88 78 Q 75 72, 57 56" fill="url(#spideyRedGrad)" />
              <path d="M54 58 Q 70 85, 75 95 Q 62 88, 52 62" fill="url(#spideyRedGrad)" />
              <!-- Spider Head & Body -->
              <ellipse cx="50" cy="40" rx="6" ry="8" fill="url(#spideyRedGrad)" filter="url(#spideyGlow)"/>
              <polygon points="50,44 43,58 50,75 57,58" fill="url(#spideyRedGrad)" filter="url(#spideyGlow)"/>
              <!-- Spider Eyes -->
              <polygon points="47,38 49,36 49,42" fill="#ffffff"/>
              <polygon points="53,38 51,36 51,42" fill="#ffffff"/>
            </svg>
          </div>
          <div class="spidey-hero-title">
            <span class="spidey-tag">SPIDER-MAN: ACROSS THE SPIDER-VERSE</span>
          </div>
        </div>
      `;

      // Insert adjacent to home__img or main banner
      const homeImg = document.querySelector('.home__img');
      if (homeImg && homeImg.parentElement) {
        homeImg.parentElement.appendChild(heroWrapper);
      }
    }

    // Add 3D Tilt Effect on mouse movement for the Hero Card
    const card = document.getElementById('spidey-3d-wrapper');
    if (card) {
      document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpidey3DHero);
  } else {
    initSpidey3DHero();
  }
})();
