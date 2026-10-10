# WARDEN. Security Command

> **Autonomous Multi-Agent Kubernetes Security Simulation**  
> Red attacks. Blue patches. The Judge proves the boundary holds.

---

## Overview

**WARDEN.** is an autonomous Kubernetes security validation platform and simulation environment. It models adversarial security duels between AI agents in an isolated, safe sandbox:

- **Red Agent (Attacker)**: Probes vulnerabilities, executes adversarial vectors (RBAC privilege escalation, container escapes, SSRF, hostPath volume mounts).
- **Blue Agent (Defender)**: Synthesizes minimal, targeted security policies and hardening manifests.
- **The Judge (Yellow Referee)**: Runs deterministic, ordered 4-gate verification before any workload reaches production:
  1. **Policy Replay** — Re-executes the attack vector against the patched workload.
  2. **Workload Health** — Validates liveness, readiness, and service functionality.
  3. **Variant Resistance** — Evaluates mutation and bypass vectors.
  4. **Drift Containment** — Verifies zero regressions across cluster boundaries.

---

## Core Operations Deck

| View | Route | Description |
|---|---|---|
| **Adversarial Nexus** | `/#` | Interactive holographic cyberspace with real-time particle physics, radar sweep, and duel clash simulator. |
| **Command Dashboard** | `/#dashboard` | Live security telemetry, active kill switches, system resource meters, policy drift radar, and real-time execution terminals. |
| **Live Arena** | `/#arena` | Cyber-arcade combat duel with pixel-art agent animations, health bars, gate progression, and adversarial exchange replay. |
| **Episodic Memory** | `/#memory` | Searchable, filterable archive of past adversarial encounters, manifests diffs, and proof logs. |
| **Settings** | `/#settings` | System-wide configuration, CRT scanline toggles, and global 8-bit Web Audio synthesizer toggle. |

---

## Quickstart & Local Development

### Prerequisites
- Node.js (v18+)
- pnpm or npm

### Run Local Development Server
```bash
# Start the WARDEN frontend (serves on port 5173)
npm run dev
# or
node scripts/serve-warden.mjs
```

Open your browser to:
```
http://localhost:5173/
```

### Type Checking & Workspace Builds
```bash
# Typecheck workspace packages
pnpm run typecheck

# Build production assets
pnpm run build
```

---

## Technology Stack

- **Core Frontend**: HTML5 Semantic markup, Modern Modular JavaScript (ES6+).
- **Styling**: Vanilla CSS design system with Cyber-Arcade aesthetics, CRT scanlines, glassmorphism, and responsive layouts.
- **Audio Synthesizer**: Web Audio API cyber synthesizer generating pure procedural 8-bit sound effects (zero external audio files).
- **Data Visualization**: Chart.js for live metrics and policy drift radar.
- **Typography**: Google Fonts (*Orbitron*, *JetBrains Mono*, *Inter*).
- **Icons**: Lucide Icons.

---

## Safety & Isolation Guarantee

All simulations, exploits, and duel sequences run strictly within the client browser sandbox or isolated simulation mocks. **No active workloads or production Kubernetes clusters are ever touched.**

---

© 2026 THE WARDEN. ALL RIGHTS RESERVED.
