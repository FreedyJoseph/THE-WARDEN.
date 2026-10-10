// WARDEN Combat Arena UI & Fighter Vector Visuals

export function renderCombatSection(scenario) {
  return `
  <section class="panel arcade-duel-panel" style="margin-top:14px" id="combatSection">
    <div class="panel-head">
      <div class="duel-panel-title">
        <span class="arcade-badge">ARCADE DUEL MODE</span>
        <div class="section-title">02 / ADVERSARIAL EXCHANGE · RED VS BLUE ARENA</div>
      </div>
      <div class="duel-quick-controls">
        <button class="duel-action-btn btn-red-action" data-combat-action="test-red" title="Trigger Red Strike animation">
          <span>⚔️</span> STRIKE
        </button>
        <button class="duel-action-btn btn-blue-action" data-combat-action="test-blue" title="Trigger Blue Shield animation">
          <span>🛡️</span> DEFEND
        </button>
        <button class="duel-action-btn btn-clash-action" data-combat-action="test-clash" title="Trigger Clash animation">
          <span>💥</span> CLASH
        </button>
      </div>
    </div>

    <!-- FIGHTING GAME TOP HUD -->
    <div class="arcade-hud-top">
      <!-- RED FIGHTER HUD (LEFT) -->
      <div class="fighter-hud-card red-hud">
        <div class="fighter-avatar-box red-avatar-border">
          <svg class="avatar-svg" viewBox="0 0 100 100">
            <!-- Red Cyber Ninja Avatar -->
            <defs>
              <linearGradient id="redAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff4444"/>
                <stop offset="100%" stop-color="#880000"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#150a0c" stroke="#ef4444" stroke-width="2"/>
            <polygon points="50,15 82,35 74,80 50,92 26,80 18,35" fill="url(#redAvatarGrad)" opacity="0.85"/>
            <!-- Cyber Visor -->
            <polygon points="32,44 68,44 64,52 36,52" fill="#fff" filter="drop-shadow(0 0 6px #ff0000)"/>
            <line x1="20" y1="48" x2="80" y2="48" stroke="#ff2222" stroke-width="2" stroke-dasharray="4,2"/>
            <!-- Antenna / Horns -->
            <polygon points="26,30 20,12 34,24" fill="#ef4444"/>
            <polygon points="74,30 80,12 66,24" fill="#ef4444"/>
          </svg>
          <span class="avatar-tag red-tag">P1</span>
        </div>
        <div class="fighter-info-block">
          <div class="fighter-name-row">
            <span class="fighter-character-name red-glow">ZERO-DAY</span>
            <span class="fighter-role-pill red-pill">RED / ATTACKER</span>
          </div>
          <div class="hp-gauge-wrapper">
            <div class="hp-gauge-label">
              <span>PENETRATION PRESSURE</span>
              <span class="hp-num red-text" id="redHpVal">100%</span>
            </div>
            <div class="hp-track red-track">
              <div class="hp-ghost" id="redHpGhost" style="width:100%"></div>
              <div class="hp-fill red-fill" id="redHpBar" style="width:100%"></div>
            </div>
          </div>
          <div class="sub-meter-row">
            <span class="sub-meter-label">EXPLOIT OVERDRIVE:</span>
            <div class="sub-meter-cells">
              <span class="cell active"></span>
              <span class="cell active"></span>
              <span class="cell active"></span>
              <span class="cell active"></span>
              <span class="cell"></span>
            </div>
            <span class="badge-status" id="redStatusBadge">READY</span>
          </div>
        </div>
      </div>

      <!-- CENTER ARCADE VS & TIMER -->
      <div class="arcade-center-core">
        <div class="arcade-round-label" id="roundCount">ROUND 01</div>
        <div class="arcade-timer-box">
          <span class="arcade-timer-display" id="countdown">30</span>
        </div>
        <div class="vs-crest-emblem">
          <span class="vs-bolt">⚡</span>
          <span class="vs-text">VS</span>
          <span class="vs-bolt">⚡</span>
        </div>
        <div class="judge-drone-indicator" id="fighterJudge">
          <span class="drone-eye"></span>
          <span class="drone-label">JUDGE SENTINEL</span>
        </div>
      </div>

      <!-- BLUE FIGHTER HUD (RIGHT) -->
      <div class="fighter-hud-card blue-hud">
        <div class="fighter-info-block text-right">
          <div class="fighter-name-row justify-end">
            <span class="fighter-role-pill blue-pill">BLUE / DEFENDER</span>
            <span class="fighter-character-name blue-glow">AEGIS-9</span>
          </div>
          <div class="hp-gauge-wrapper">
            <div class="hp-gauge-label">
              <span class="hp-num blue-text" id="blueHpVal">25%</span>
              <span>CLUSTER HARDENING</span>
            </div>
            <div class="hp-track blue-track">
              <div class="hp-ghost" id="blueHpGhost" style="width:25%"></div>
              <div class="hp-fill blue-fill" id="blueHpBar" style="width:25%"></div>
            </div>
          </div>
          <div class="sub-meter-row justify-end">
            <span class="badge-status" id="blueStatusBadge">READY</span>
            <div class="sub-meter-cells">
              <span class="cell active"></span>
              <span class="cell active"></span>
              <span class="cell"></span>
              <span class="cell"></span>
              <span class="cell"></span>
            </div>
            <span class="sub-meter-label">SHIELD MATRIX:</span>
          </div>
        </div>
        <div class="fighter-avatar-box blue-avatar-border">
          <svg class="avatar-svg" viewBox="0 0 100 100">
            <!-- Blue Cyber Paladin Avatar -->
            <defs>
              <linearGradient id="blueAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4"/>
                <stop offset="100%" stop-color="#083e58"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#08141d" stroke="#06b6d4" stroke-width="2"/>
            <!-- Heavy Helm -->
            <polygon points="50,12 84,30 78,82 50,94 22,82 16,30" fill="url(#blueAvatarGrad)" opacity="0.85"/>
            <!-- K8s Heptagon Crest -->
            <polygon points="50,18 64,25 70,39 64,52 36,52 30,39 36,25" fill="#02212d" stroke="#38bdf8" stroke-width="1.5"/>
            <!-- Visor -->
            <line x1="28" y1="56" x2="72" y2="56" stroke="#38bdf8" stroke-width="3" filter="drop-shadow(0 0 6px #06b6d4)"/>
            <circle cx="50" cy="56" r="3" fill="#ffffff"/>
          </svg>
          <span class="avatar-tag blue-tag">P2</span>
        </div>
      </div>
    </div>

    <!-- MAIN 2D FIGHTING STAGE -->
    <div class="combat-stage-arena" id="combatArena">
      <!-- Cyber Stage Environment Background -->
      <div class="arena-scenery">
        <div class="arena-horizon-glow"></div>
        <div class="arena-grid-floor"></div>
        <div class="arena-spotlight red-spot"></div>
        <div class="arena-spotlight blue-spot"></div>
        <div class="arena-pod-clusters">
          <span class="holo-pod pod-1"></span>
          <span class="holo-pod pod-2"></span>
          <span class="holo-pod pod-3"></span>
          <span class="holo-pod pod-4"></span>
        </div>
      </div>

      <!-- INTERACTIVE PARTICLE CANVAS -->
      <canvas id="combatCanvas" class="combat-canvas"></canvas>

      <!-- FIGHTER 1: RED ZERO-DAY -->
      <div class="fighter-box fighter-red-box state-idle" id="fighterRed">
        <div class="fighter-shadow"></div>
        <div class="fighter-figure">
          <svg class="fighter-sprite" viewBox="0 0 200 240">
            <defs>
              <linearGradient id="redBladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="50%" stop-color="#ef4444"/>
                <stop offset="100%" stop-color="#770000"/>
              </linearGradient>
              <filter id="redNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Energy Scarf / Cape (Animated) -->
            <path class="fighter-cape red-cape" d="M85,85 Q40,110 30,165 Q60,140 85,120 Z" fill="#b91c1c" opacity="0.8"/>
            <path class="fighter-cape red-cape-glow" d="M85,85 Q30,120 20,185 Q50,150 85,120 Z" fill="#ef4444" opacity="0.4"/>

            <!-- Legs / Lower Body -->
            <polygon class="fighter-leg leg-left" points="75,140 60,195 50,225 72,225 82,185 88,140" fill="#2d1216"/>
            <polygon class="fighter-leg leg-right" points="95,140 108,190 120,225 100,225 90,180 85,140" fill="#45181e"/>
            <!-- Boots with neon soles -->
            <polygon points="50,220 72,220 74,228 46,228" fill="#ef4444" filter="url(#redNeonGlow)"/>
            <polygon points="100,220 122,220 124,228 96,228" fill="#ef4444" filter="url(#redNeonGlow)"/>

            <!-- Torso / Exoskeleton -->
            <polygon class="fighter-torso" points="70,85 110,85 102,142 78,142" fill="#1e0a0d" stroke="#ef4444" stroke-width="1.5"/>
            <!-- Chest Reactor Core -->
            <circle cx="90" cy="105" r="7" fill="#ffffff" filter="url(#redNeonGlow)"/>
            <circle cx="90" cy="105" r="4" fill="#ef4444"/>

            <!-- Head / Cyber Visor -->
            <g class="fighter-head">
              <polygon points="80,50 100,50 105,78 75,78" fill="#2d1216" stroke="#ef4444" stroke-width="1"/>
              <!-- Glowing Visor Slit -->
              <polygon points="76,64 104,64 101,70 79,70" fill="#ffffff" filter="url(#redNeonGlow)"/>
              <!-- Horn Antennae -->
              <polygon points="78,50 70,30 84,45" fill="#ef4444"/>
              <polygon points="102,50 110,30 96,45" fill="#ef4444"/>
            </g>

            <!-- Dual Plasma Katanas -->
            <!-- Left Blade -->
            <g class="fighter-weapon weapon-left">
              <line x1="68" y1="105" x2="35" y2="155" stroke="#444" stroke-width="4"/>
              <polygon points="35,155 10,215 14,213 40,155" fill="url(#redBladeGrad)" filter="url(#redNeonGlow)"/>
            </g>
            <!-- Right Blade (Primary Strike) -->
            <g class="fighter-weapon weapon-right">
              <line x1="105" y1="100" x2="140" y2="80" stroke="#444" stroke-width="4"/>
              <polygon points="140,80 200,35 194,40 135,84" fill="url(#redBladeGrad)" filter="url(#redNeonGlow)"/>
            </g>
          </svg>
        </div>
        <div class="fighter-callout red-callout-bubble" id="redCombatCallout">
          PROBING CLUSTER...
        </div>
      </div>

      <!-- ARENA CENTER CLASH BURST -->
      <div class="arena-clash-core" id="arenaClashCore">
        <div class="clash-ring ring-1"></div>
        <div class="clash-ring ring-2"></div>
        <div class="clash-bolt-icon">⚡</div>
      </div>

      <!-- FIGHTER 2: BLUE AEGIS-9 -->
      <div class="fighter-box fighter-blue-box state-idle" id="fighterBlue">
        <div class="fighter-shadow"></div>
        <div class="fighter-figure">
          <svg class="fighter-sprite" viewBox="0 0 200 240">
            <defs>
              <linearGradient id="blueShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="50%" stop-color="#0284c7"/>
                <stop offset="100%" stop-color="#082f49"/>
              </linearGradient>
              <filter id="blueNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Thruster Steam / Aura -->
            <circle cx="115" cy="85" r="14" fill="#06b6d4" opacity="0.2" filter="url(#blueNeonGlow)"/>
            <circle cx="85" cy="85" r="14" fill="#06b6d4" opacity="0.2" filter="url(#blueNeonGlow)"/>

            <!-- Heavy Legs -->
            <polygon class="fighter-leg leg-left" points="85,142 75,190 65,225 85,225 95,185 98,142" fill="#0c2331"/>
            <polygon class="fighter-leg leg-right" points="115,142 128,190 140,225 120,225 110,185 105,142" fill="#14364c"/>
            <!-- Shield Boots -->
            <polygon points="65,220 85,220 87,228 62,228" fill="#06b6d4" filter="url(#blueNeonGlow)"/>
            <polygon points="120,220 140,220 142,228 117,228" fill="#06b6d4" filter="url(#blueNeonGlow)"/>

            <!-- Heavy Cyber Torso -->
            <polygon class="fighter-torso" points="75,82 125,82 118,145 82,145" fill="#0b1e2a" stroke="#06b6d4" stroke-width="1.8"/>
            <!-- K8s Heptagon Core -->
            <polygon points="100,95 110,102 113,114 107,122 93,122 87,114 90,102" fill="#0284c7" filter="url(#blueNeonGlow)"/>

            <!-- Mecha Head -->
            <g class="fighter-head">
              <polygon points="85,46 115,46 120,78 80,78" fill="#0c2331" stroke="#06b6d4" stroke-width="1.2"/>
              <!-- Glowing Cyan Visor -->
              <line x1="84" y1="62" x2="116" y2="62" stroke="#ffffff" stroke-width="3" filter="url(#blueNeonGlow)"/>
            </g>

            <!-- Massive Hexagonal Aegis Power Shield (Front Left) -->
            <g class="fighter-shield-group">
              <!-- Animated Hex Shield Barrier Dome -->
              <polygon class="aegis-shield-plate" points="50,45 85,30 98,75 88,145 52,165 25,120 22,65" fill="url(#blueShieldGrad)" stroke="#38bdf8" stroke-width="2" filter="url(#blueNeonGlow)"/>
              <!-- Internal Hex Circuit Grid -->
              <polyline points="45,65 60,60 75,75 70,120 50,135" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
              <circle cx="58" cy="95" r="8" fill="#ffffff" filter="url(#blueNeonGlow)"/>
            </g>

            <!-- Shock Lance / Ion Baton (Right Arm) -->
            <g class="fighter-weapon weapon-lance">
              <line x1="125" y1="95" x2="165" y2="135" stroke="#333" stroke-width="5"/>
              <polygon points="165,135 185,155 178,162 158,142" fill="#38bdf8" filter="url(#blueNeonGlow)"/>
            </g>
          </svg>
        </div>
        <div class="fighter-callout blue-callout-bubble" id="blueCombatCallout">
          SHIELD BARRIER READY
        </div>
      </div>

      <!-- ARCADE ANNOUNCEMENT BANNER -->
      <div class="arcade-banner-box" id="arcadeBannerBox">
        <span class="banner-sub">ADVERSARIAL MATCH</span>
        <h2 class="banner-title" id="combatBannerText">CHOOSE SCENARIO & ENGAGE</h2>
      </div>
    </div>

    <!-- DUAL COMBAT TELEMETRY DECKS -->
    <div class="combat-telemetry-grid">
      <!-- RED EXPLOIT STREAM -->
      <div class="telemetry-card red-telemetry">
        <div class="telemetry-header">
          <div class="telemetry-title">
            <span class="dot red-dot"></span>
            <b>RED EXPLOIT BUFFER</b>
          </div>
          <span class="telemetry-tag" id="redStatus">STANDBY</span>
        </div>
        <div class="telemetry-body code-body" id="redOutput">
Awaiting scenario initialization.
Target: ${scenario.resource}
Objective: Expose privilege boundary.
        </div>
      </div>

      <!-- DETERMINISTIC JUDGE 4-GATE MATRIX -->
      <div class="telemetry-card judge-telemetry">
        <div class="telemetry-header">
          <div class="telemetry-title">
            <span class="dot judge-dot"></span>
            <b>JUDGE · 4-GATE VERIFICATION</b>
          </div>
          <span class="telemetry-tag judge-tag">DETERMINISTIC</span>
        </div>
        <div class="telemetry-body gates-body">
          <div class="combat-gates-list" id="gates">
            ${[
              'Re-attack fails on patch',
              'Regression corpus blocked',
              'Application health /200 OK',
              'Variant probes contained',
            ]
              .map(
                (g, i) => `
              <div class="combat-gate-row" data-gate="${i}">
                <div class="gate-status-orb">0${i + 1}</div>
                <div class="gate-info">
                  <span class="gate-label">${g}</span>
                  <span class="gate-sub" id="gateSub-${i}">PENDING CHECK</span>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>

      <!-- BLUE POLICY MANIFEST DIFF -->
      <div class="telemetry-card blue-telemetry">
        <div class="telemetry-header">
          <div class="telemetry-title">
            <span class="dot blue-dot"></span>
            <b>BLUE POLICY DIFF ENGINE</b>
          </div>
          <span class="telemetry-tag" id="patchIteration">NO PATCH</span>
        </div>
        <div class="telemetry-body code-body" id="patchDiff">
Awaiting Blue agent proposal…
Policy engine loaded · 42 controls
        </div>
        <div id="decisionArea"></div>
      </div>
    </div>
  </section>
  `;
}
