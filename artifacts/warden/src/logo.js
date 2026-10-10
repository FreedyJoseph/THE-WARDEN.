// WARDEN Aegis Core - Next-Gen Duo-Tone Cyber-Defense Logo
// Disciplined Primary (Electric Cyan) & Secondary (Ice White / Platinum) aesthetic

export function renderWardenLogo(size = 38) {
  return `<svg class="warden-aegis-logo" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="WARDEN Aegis Core Emblem">
  <defs>
    <!-- Primary Cyan Gradient -->
    <linearGradient id="wPrimaryCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="60%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <!-- Secondary Platinum / Ice-White Gradient -->
    <linearGradient id="wSecondaryWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#7dd3fc" />
    </linearGradient>

    <!-- Core Deep Contrast Gradient -->
    <linearGradient id="wDarkFacet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1824" />
      <stop offset="100%" stop-color="#050c14" />
    </linearGradient>

    <!-- Ambient Cyan Energy Halo -->
    <radialGradient id="wAuraCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
      <stop offset="65%" stop-color="#06b6d4" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Ambient Energy Halo -->
  <circle class="aegis-ambient-aura" cx="50" cy="50" r="44" fill="url(#wAuraCyan)" />

  <!-- Outer Hexagonal Cyber Frame & Corner Brackets (Primary Cyan) -->
  <polygon class="aegis-hex-boundary" points="50,8 86,29 86,71 50,92 14,71 14,29" stroke="#133649" stroke-width="1.5" stroke-dasharray="8,5" fill="none" />
  <path class="aegis-corner-bracket" d="M 44,6 L 50,3 L 56,6" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" />
  <path class="aegis-corner-bracket" d="M 44,94 L 50,97 L 56,94" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none" />

  <!-- Outer Orbital Ring with 4 Cyber Security Satellites (Primary Cyan + Secondary White) -->
  <g class="aegis-outer-ring">
    <circle cx="50" cy="50" r="38" stroke="#1b455b" stroke-width="1.2" stroke-dasharray="14,12,38,12" fill="none" />
    <!-- Secondary Platinum Satellites (North & South) -->
    <circle cx="50" cy="12" r="3.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
    <circle cx="50" cy="88" r="3.2" fill="#ffffff" filter="drop-shadow(0 0 5px #ffffff)" />
    <!-- Primary Cyan Satellites (East & West) -->
    <circle cx="88" cy="50" r="3" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
    <circle cx="12" cy="50" r="3" fill="#38bdf8" filter="drop-shadow(0 0 5px #38bdf8)" />
  </g>

  <!-- Inner Counter-Rotating Precision Reticle (Primary Cyan) -->
  <g class="aegis-inner-ring">
    <circle cx="50" cy="50" r="29" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="6,8,18,6" opacity="0.6" fill="none" />
    <line x1="50" y1="21" x2="50" y2="25" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" />
    <line x1="50" y1="75" x2="50" y2="79" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" />
    <line x1="21" y1="50" x2="25" y2="50" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" />
    <line x1="75" y1="50" x2="79" y2="50" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" />
  </g>

  <!-- Vanguard W Shield Facets (Unified Duo-tone Aesthetic) -->
  <g class="aegis-shield">
    <!-- Left Wing (Primary Cyan) -->
    <path class="aegis-wing-left" d="M 23,32 L 34,32 L 42,67 L 35,71 L 23,32 Z" fill="url(#wPrimaryCyan)" stroke="#7dd3fc" stroke-width="1" />
    
    <!-- Right Wing (Primary Cyan) -->
    <path class="aegis-wing-right" d="M 77,32 L 66,32 L 58,67 L 65,71 L 77,32 Z" fill="url(#wPrimaryCyan)" stroke="#7dd3fc" stroke-width="1" />
    
    <!-- Center Inverted Chevron (Deep Obsidian Glass) -->
    <path class="aegis-wing-center-left" d="M 37,34 L 45,34 L 50,56 L 44,59 Z" fill="url(#wDarkFacet)" stroke="#0284c7" stroke-width="1" />
    <path class="aegis-wing-center-right" d="M 63,34 L 55,34 L 50,56 L 56,59 Z" fill="url(#wDarkFacet)" stroke="#0284c7" stroke-width="1" />
    
    <!-- Keystone Apex (Secondary Ice-White / Platinum) -->
    <polygon class="aegis-keystone" points="50,26 58,37 50,48 42,37" fill="url(#wSecondaryWhite)" stroke="#ffffff" stroke-width="1" />
  </g>

  <!-- Central Quantum Reactor Core (Pulsing Platinum-Cyan) -->
  <g class="aegis-core">
    <circle cx="50" cy="50" r="7.5" fill="#ffffff" filter="drop-shadow(0 0 8px #38bdf8)" />
    <circle cx="50" cy="50" r="3" fill="#38bdf8" />
    <circle cx="50" cy="50" r="10.5" stroke="#7dd3fc" stroke-width="1" stroke-dasharray="3,3" opacity="0.8" />
  </g>
</svg>`;
}

export const WARDEN_BRAND = `WARDEN<span class="warden-dot" aria-hidden="true">.</span>`;
