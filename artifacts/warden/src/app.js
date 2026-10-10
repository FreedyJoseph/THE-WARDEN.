import {getScenarios,getMetrics,getActivity,getEpisodes,saveEpisode,makeEpisode,runDemo,clearEpisodes} from "./mockSimulation.js";
import {getDashboardMetrics,startRound,streamRound} from "./api.js";
import {renderCharts} from "./charts.js";
import {renderCombatSection} from "./combatRenderer.js";
import {combatStage} from "./combatStage.js";
import {renderHomeSidebarDrawer, initHomeInteractiveNexus} from "./homeNexus.js";
import {sfx} from "./audioSynth.js";
import {renderWardenLogo, WARDEN_BRAND} from "./logo.js";

const app=document.querySelector("#app"),scenarios=getScenarios();
const read=(key,fallback)=>{try{const v=localStorage.getItem(`warden-${key}`);return v===null?fallback:JSON.parse(v)}catch{return fallback}};
const state={view:"home",sidebar:false,collapsed:read("collapsed",false),mock:read("mock",true),mode:read("mode","AUTO"),scanlines:read("scanlines",true),metrics:getMetrics(),activity:getActivity(),selected:scenarios[0],running:false,launching:false,launchTimers:[],seconds:30,round:0,episodePage:1,search:"",filter:"all",toastTimer:null,simulation:null,apiController:null,runToken:0,decision:null,pendingEpisode:null,apiError:"",episodes:getEpisodes()};
if(state.scanlines)document.body.classList.add("scanlines");
const ico=(name)=>`<i data-lucide="${name}" aria-hidden="true"></i>`;
const esc=(s="")=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function iconify(){window.lucide?.createIcons?.({attrs:{width:16,height:16,"stroke-width":1.8}})}
function toast(msg,error=false){document.querySelector(".toast")?.remove();const t=document.createElement("div");t.className=`toast${error?" error":""}`;t.setAttribute("role","status");t.textContent=msg;document.body.append(t);clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>t.remove(),4000)}
const navItems=[["home","house","Home"],["dashboard","layout-dashboard","Command Dashboard"],["arena","swords","Live Arena"],["memory","database","Episodic Memory"],["settings","sliders-horizontal","Settings"]];
function shell(){
  if(state.view==="home"){
    app.innerHTML=home();
    initHomeInteractiveNexus();
    iconify();
    return;
  }
  app.innerHTML=`<div class="shell">
<aside class="sidebar ${state.collapsed?"collapsed":""} ${state.sidebar?"mobile-open":""}" aria-label="Primary navigation">
<div class="brand"><div class="brand-mark">${renderWardenLogo(36)}</div><div class="brand-copy"><div class="brand-name">${WARDEN_BRAND}</div><div class="brand-caption">SECURITY COMMAND</div></div></div>
<div class="nav-label">OPERATIONS</div><nav class="nav-list">${navItems.map(([id,ic,title])=>`<button class="nav-item ${state.view===id?"active":""}" data-nav="${id}" aria-current="${state.view===id?"page":"false"}" aria-label="${title}" data-testid="nav-${id}">${ico(ic)}<span>${title}</span></button>`).join("")}</nav>
<div class="side-footer"><span class="side-footer-copy">© 2026 THE WARDEN<span class="warden-dot" aria-hidden="true">.</span> ALL RIGHTS RESERVED</span></div>
</aside>${state.sidebar?'<button class="sidebar-backdrop" data-action="close-mobile" aria-label="Close navigation"></button>':""}
<main class="main"><header class="topbar"><div class="top-left"><button class="icon-button mobile-nav-toggle" data-action="mobile-nav" aria-label="Open navigation">${ico("menu")}</button><button class="icon-button desktop-collapse" data-action="collapse" aria-label="Collapse sidebar" aria-expanded="${!state.collapsed}">${ico(state.collapsed?"panel-left-open":"panel-left-close")}</button><div class="crumb">${WARDEN_BRAND} <span style="color:#475966">/</span> ${navItems.find(x=>x[0]===state.view)?.[2].toUpperCase()}</div></div><div class="top-right"><button class="sound-toggle-btn ${sfx.enabled ? 'active' : ''}" data-action="toggle-sfx" title="Toggle cyber audio synthesizer">${ico(sfx.enabled ? 'volume-2' : 'volume-x')}<span>SFX ${sfx.enabled ? 'ON' : 'OFF'}</span></button><div class="status-pill"><span class="dot"></span> ISOLATED DEMO</div><div class="demo-pill">DEMO MODE · NO REAL CLUSTER</div></div></header>
<div class="content" id="view-content"></div></main></div>`;
  renderView();
  iconify();
}
function heading(title,copy,extra=""){return `<div class="page-heading"><div><div class="eyebrow">${WARDEN_BRAND} / ${state.view.toUpperCase()}</div><h1>${title}</h1><p>${copy}</p></div>${extra}</div>`}
function home(){
 const m=state.metrics,verified=state.episodes.filter(x=>x.verdict==="VERIFIED SECURE").length,scenario=state.selected;
 return `<main class="home-screen" aria-label="WARDEN. security simulation home">
 ${renderHomeSidebarDrawer(navItems, state.view, ico)}
 <header class="home-header">
   <div class="home-header-left">
     <button class="home-sidebar-toggle" data-action="toggle-home-drawer" aria-label="Open Operations Navigation">
       ${ico("menu")} <span>OPS DECK</span>
     </button>
     <button class="home-brand" data-nav="home" aria-label="WARDEN. home">
       <span class="home-brand-mark" aria-hidden="true">${renderWardenLogo(38)}</span>
       <span><b>${WARDEN_BRAND}</b><small>SECURITY COMMAND</small></span>
     </button>
   </div>
   <nav class="home-nav" aria-label="Home navigation">
     <button data-nav="dashboard">COMMAND CENTER <span>↗</span></button>
     <button data-nav="arena">LIVE ARENA</button>
     <button data-nav="memory">LOCAL ARCHIVE</button>
     <button data-nav="settings">SETTINGS</button>
   </nav>
   <div class="home-header-right">
     <button class="sound-toggle-btn ${sfx.enabled ? 'active' : ''}" data-action="toggle-sfx" title="Toggle 8-bit cyber audio synthesizer">
       ${ico(sfx.enabled ? 'volume-2' : 'volume-x')}
       <span>SFX ${sfx.enabled ? 'ON' : 'OFF'}</span>
     </button>
     <div class="home-live"><span class="home-live-dot"></span> BROWSER-ISOLATED <span class="home-nav-sep">/</span> DEMO BUILD</div>
   </div>
 </header>
 <section class="home-hero">
   <div class="home-hero-copy">
     <div class="home-kicker"><span class="kicker-line"></span> ADVERSARIAL VALIDATION / KUBERNETES</div>
     <h1 class="glitch-title">DON’T TRUST<br>THE PATCH.<br><em data-text="PROVE IT.">PROVE IT.</em></h1>
     <p class="home-intro">Red finds the way in. Blue closes the gap. A deterministic Judge tries to break through again.</p>
     <p class="home-subcopy">One disposable scenario. Four ordered gates. Evidence you can inspect before anything gets near production.</p>
     <div class="home-actions">
       <button class="home-cta" data-nav="dashboard">
         <span class="cta-icon">${ico("layout-dashboard")}</span>
         <span><b>ENTER COMMAND</b><small>Open security dashboard</small></span>
         ${ico("arrow-up-right")}
       </button>
       <button class="home-stage" data-action="stage">
         <span class="stage-cross">${ico("crosshair")}</span>
         <span><b>STAGE A SCENARIO</b><small>Choose a target · start a duel</small></span>
       </button>
     </div>
     <div class="home-boundary">
       <span class="boundary-shield">${ico("shield-alert")}</span>
       <span><b>DEMO ONLY · NO REAL CLUSTER CONNECTED</b><small>Runs in this browser. No manifest is applied. No infrastructure is touched.</small></span>
     </div>
   </div>
   <div class="home-visual" aria-label="Interactive Cyberspace Adversarial Nexus">
     <canvas id="nexusCanvas" class="nexus-canvas"></canvas>
     <div class="visual-topline">
       <span>${WARDEN_BRAND} // ADVERSARIAL NEXUS</span>
       <span class="tiny mono" style="color:#f59e0b">INTERACTIVE SIMULATOR</span>
     </div>
     <div class="visual-grid"></div>
     <div class="visual-orbit orbit-one"></div>
     <div class="visual-orbit orbit-two"></div>
     <div class="visual-axis axis-x"></div>
     <div class="visual-axis axis-y"></div>

     <div class="agent-node red-node interactive-node" data-nexus-action="red" title="Click to simulate Red Exploit Probe">
       <span class="node-symbol">${ico("crosshair")}</span>
       <b>RED</b><small>ATTACK</small><i></i>
       <span class="node-action-tag">STRIKE</span>
     </div>

     <div class="agent-node blue-node interactive-node" data-nexus-action="blue" title="Click to deploy Blue Policy Shield">
       <span class="node-symbol">${ico("shield")}</span>
       <b>BLUE</b><small>PATCH</small><i></i>
       <span class="node-action-tag">HARDEN</span>
     </div>

     <div class="judge-core interactive-node" data-nexus-action="judge" title="Click to verify deterministic 4 gates">
       <div class="judge-rings"></div>
       <div class="judge-mark">${ico("scale")}</div>
       <b>JUDGE</b><small>4 GATES</small>
       <span class="node-action-tag" style="bottom:-24px">VERIFY</span>
     </div>

     <button class="clash-trigger-btn" data-nexus-action="clash" title="Simulate dual agent collision">
       <span>⚡</span> TEST NEXUS CLASH
     </button>

     <div class="visual-footer">
       <span><i class="signal-red"></i> EXPLOIT VECTOR</span>
       <span><i class="signal-blue"></i> POLICY BOUNDARY</span>
     </div>
     <div class="visual-stamp">SIMULATION<br>ONLY</div>
   </div>
   <div class="hero-index"><span>01</span><i></i> THE PROOF LOOP</div>
 </section>

 <!-- INTERACTIVE K8S RADAR LAB SECTION -->
 <section class="home-radar-lab-section">
   <div class="lab-section-header">
     <div>
       <div class="eyebrow">INTERACTIVE LAB // KUBERNETES GOAT SUITE</div>
       <h2>K8S ATTACK SURFACE & REPLAY LAB</h2>
     </div>
     <button class="btn btn-red" data-action="stage">${ico("swords")} LAUNCH ARENA DUEL</button>
   </div>
   <div class="lab-grid">
     <div class="lab-targets-card">
       <div class="field-label">SELECT WORKLOAD SCENARIO</div>
       <div class="lab-scenario-tabs">
         ${scenarios.map((s) => `
           <button class="lab-scenario-tab ${s.id === scenario.id ? 'active' : ''}" data-home-scenario="${s.id}">
             <span class="tab-code">${s.code} · ${s.risk}</span>
             <strong class="tab-title">${s.name}</strong>
             <span class="tab-mitre">${s.mitre}</span>
           </button>
         `).join('')}
       </div>
     </div>
     <div class="lab-proof-console">
       <div class="console-header">
         <span>INTERACTIVE TARGET: <b style="color:#67d5e0">${esc(scenario.resource)}</b></span>
         <span class="status-pill"><span class="dot"></span> READY TO SIMULATE</span>
       </div>
       <div class="console-body">
         <div class="console-split">
           <div class="console-box">
             <span class="console-label red-console-label">RED PROBE PAYLOAD</span>
             <pre class="console-pre">${esc(scenario.payload)}</pre>
           </div>
           <div class="console-box">
             <span class="console-label blue-console-label">BLUE HARDENING SPEC</span>
             <pre class="console-pre">securityContext:
  privileged: false
  allowPrivilegeEscalation: false
  capabilities:
    drop: [ALL]
  readOnlyRootFilesystem: true</pre>
           </div>
         </div>
         <div class="console-gates-strip">
           <div class="mini-gate-card passed"><span class="mini-gate-num">G01</span><span class="mini-gate-name">RE-ATTACK</span>✓ PASS</div>
           <div class="mini-gate-card passed"><span class="mini-gate-num">G02</span><span class="mini-gate-name">REGRESSION</span>✓ PASS</div>
           <div class="mini-gate-card passed"><span class="mini-gate-num">G03</span><span class="mini-gate-name">HEALTH 200</span>✓ PASS</div>
           <div class="mini-gate-card passed"><span class="mini-gate-num">G04</span><span class="mini-gate-name">VARIANTS</span>✓ PASS</div>
         </div>
         <div class="console-actions-row">
           <span class="tiny mono muted">DETERMINISTIC VERIFICATION SEED 0x7A31</span>
           <button class="btn btn-primary btn-sm" data-action="stage">${ico("play")} RUN LIVE DUEL NOW</button>
         </div>
       </div>
     </div>
   </div>
 </section>

 <section class="proof-strip" aria-label="WARDEN. process">
   <div class="proof-caption">ONE CLOSED LOOP.<br><span>NO HAND-WAVING.</span></div>
   <div class="proof-step"><span class="proof-num">01</span><b>ISOLATE</b><p>Stage a disposable workload clone from a known scenario.</p></div>
   <div class="proof-arrow">${ico("arrow-right")}</div>
   <div class="proof-step red-proof"><span class="proof-num">02</span><b>ATTACK</b><p>Red probes the exact weakness you need to contain.</p></div>
   <div class="proof-arrow">${ico("arrow-right")}</div>
   <div class="proof-step blue-proof"><span class="proof-num">03</span><b>PATCH</b><p>Blue proposes a fix. The patch stays a proposal.</p></div>
   <div class="proof-arrow">${ico("arrow-right")}</div>
   <div class="proof-step judge-proof"><span class="proof-num">04</span><b>VERIFY</b><p>Judge replays attacks, checks health, tests variants.</p></div>
 </section>
 <section class="home-lower">
   <div class="scenario-tease">
     <div class="lower-eyebrow">SCENARIO FILE / ${esc(scenario.code)} <span>· ${esc(scenario.risk)} RISK</span></div>
     <h2>${esc(scenario.name)}</h2>
     <p>${esc(scenario.description)}</p>
     <div class="scenario-meta">
       <span>${ico("box")} ${esc(scenario.resource)}</span>
       <span>${ico("crosshair")} ${esc(scenario.mitre)}</span>
     </div>
     <button data-action="stage" class="text-link">SELECT FROM THE SCENARIO CATALOG ${ico("arrow-up-right")}</button>
     <div class="scenario-index">${String(scenarios.findIndex(s=>s.id===scenario.id)+1).padStart(2,"0")} <span>/ 0${scenarios.length}</span></div>
   </div>
   <div class="evidence-card">
     <div class="evidence-top"><span>LOCAL DEMO TELEMETRY</span><span class="evidence-lock">${ico("lock-keyhole")} BROWSER ONLY</span></div>
     <div class="evidence-stats">
       <div><b>${m.cycles.toLocaleString()}</b><span>SIMULATED CYCLES</span></div>
       <div><b>${m.hardened.toLocaleString()}</b><span>VERIFIED FIXES*</span></div>
       <div><b>${state.episodes.length}</b><span>LOCAL RUN RECORDS</span></div>
     </div>
     <div class="evidence-rule"></div>
     <div class="evidence-note"><span>*</span> Displayed telemetry is seeded demo data${verified?` plus ${verified} locally verified run${verified===1?"":"s"}`:""}. It does not represent a live cluster or production activity.</div>
     <button class="evidence-link" data-nav="dashboard">INSPECT COMMAND DASHBOARD ${ico("arrow-up-right")}</button>
   </div>
 </section>
 <footer class="home-footer">
   <span>${WARDEN_BRAND} <i>—</i> SECURITY COMMAND</span>
   <span>SIMULATED WORKFLOWS ONLY <i>·</i> NO REAL CLUSTER <i>·</i> NOTHING APPLIED</span>
 </footer>
 </main>`;
}
function dashboard(){
 const m=state.metrics;return `${heading("Command Dashboard","Autonomous adversarial validation · isolated simulation telemetry",`<div class="action-row"><button class="btn btn-red" data-action="reset" data-testid="button-reset-demo">${ico("rotate-ccw")} RESET DEMO</button><button class="btn btn-primary" data-action="stage">${ico("play")} LAUNCH SCENARIO</button></div>`)}
 <section class="metrics" aria-label="Simulation metrics">${[
 ["TOTAL CYCLES",m.cycles.toLocaleString(),"rounds simulated","activity"],
 ["HARDENED VULNERABILITIES",m.hardened.toLocaleString(),"verified fixes","shield-check"],
 ["ACTIVE EXPLOITS",String(m.active).padStart(2,"0"),"under active review","target"],
 ["LEARNING RATE",`${m.learning}%`,`${m.delta} this cycle`,"trending-up"]].map(([l,v,f,i],n)=>`<article class="metric panel" data-testid="metric-${n}"><div class="metric-label">${l}</div><div class="metric-icon">${ico(i)}</div><div class="metric-value">${v}</div><div class="metric-foot">${f}</div></article>`).join("")}</section>
 <div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><div class="section-title">ATTACK SUCCESS DECAY</div><div class="tiny muted mono" style="margin-top:5px">Red agent success rate · trailing 12h</div></div><div class="chart-legend"><span><i class="legend-dot" style="background:#ef4444"></i>SUCCESS</span><span><i class="legend-dot" style="background:#06b6d4"></i>BLOCKED</span></div></div><div class="panel-body"><div class="chart-box"><canvas id="attackChart" aria-label="Line chart showing declining attacker success" role="img"></canvas></div></div></section>
 <section class="panel"><div class="panel-head"><div><div class="section-title">AGENT ACTION MIX</div><div class="tiny muted mono" style="margin-top:5px">Distribution · last 100 cycles</div></div>${ico("chart-pie")}</div><div class="panel-body"><div class="chart-box" style="height:245px"><canvas id="distributionChart" aria-label="Doughnut chart showing agent action distribution" role="img"></canvas></div></div></section></div>
 <div class="ops-row"><section class="panel"><div class="panel-head"><div class="section-title">CONTROL MODE</div><span class="tiny mono muted">${state.mode==="AUTO"?"AUTONOMOUS":"OPERATOR GATED"}</span></div><div class="mode-box"><div><div class="mode-title">${state.mode==="AUTO"?"AUTO-PILOT":"HUMAN-IN-THE-LOOP"}</div><div class="mode-copy">${state.mode==="AUTO"?"Agents run, verify, and record without blocking.":"Every proposed patch pauses for operator review."}</div></div><button class="switch" role="switch" aria-checked="${state.mode==="AUTO"}" data-action="toggle-mode" aria-label="Toggle Auto-Pilot or Human-in-the-Loop" data-testid="switch-mode"></button></div><div class="launch-card"><div><strong>READY TO HARDEN?</strong><p>Run an adversarial exercise against a staged workload clone.</p></div><button class="btn btn-primary" data-action="stage">${ico("crosshair")} QUICK LAUNCH</button></div></section>
 <section class="panel"><div class="panel-head"><div><div class="section-title">TACTICAL FEED</div><div class="tiny muted mono" style="margin-top:5px">Latest 10 simulation events</div></div><button class="btn btn-quiet btn-sm" data-nav="arena">OPEN ARENA ${ico("arrow-up-right")}</button></div><div class="panel-body activity-scroll"><div class="terminal">${activityRows(state.activity)}</div></div></section></div>${state.apiError?`<div class="warning-panel" role="alert" style="margin-top:14px">LIVE API UNAVAILABLE — ${esc(state.apiError)}</div>`:""}`;
}
function activityRows(rows){return rows.slice(0,10).map(([time,agent,text],i)=>`<div class="terminal-row" data-testid="activity-${i}"><span class="term-time">${esc(time)}</span><span class="term-agent ${agent.toLowerCase()}">${esc(agent)}</span><span>${esc(text)}</span></div>`).join("")}
function renderView(){
  if(state.view==="home"){shell();return}
  const target=document.querySelector("#view-content");
  if(!target)return;
  target.innerHTML=state.view==="dashboard"?dashboard():state.view==="arena"?arena():state.view==="memory"?memory():settings();
  if(state.view==="arena"){
    combatStage.init(document.querySelector("#combatSection"));
  }
  iconify();
  if(state.view==="dashboard")renderCharts();
}
function arena(){
 const scenario=state.selected;
 return `${heading("Live Arena","Stage an isolated workload clone. Red attacks; Blue patches; Judge verifies.",`<span class="demo-pill">SIMULATED ONLY</span>`)}
 <div class="stage-grid"><section class="panel"><div class="panel-head"><div><div class="section-title">01 / SELECT ATTACK SURFACE</div><div class="tiny muted mono" style="margin-top:5px">Kubernetes Goat scenario catalog · five lab cases</div></div><span class="tiny mono" style="color:#dd7373">${scenario.code}</span></div><div class="panel-body"><div class="scenario-grid">${scenarios.map(s=>`<button class="scenario-option ${s.id===scenario.id?"selected":""}" data-scenario="${s.id}" aria-pressed="${s.id===scenario.id}" data-testid="scenario-${s.id}"><span class="scenario-code">${s.code} · ${s.risk}</span><strong>${s.name}</strong><small>${s.description}</small></button>`).join("")}</div><div class="stage-status" id="stageStatus"><div class="status-orb">${ico("box")}</div><div><strong style="color:#c3d0d7">ISOLATED WORKSPACE READY</strong><br><span class="tiny">Select scenario and initialize a disposable clone. No real cluster is connected.</span></div></div><div class="action-row" style="margin-top:13px"><button class="btn btn-red" data-action="start-run" ${state.running?"disabled":""}>${ico("swords")} ${state.running?"DUEL IN PROGRESS":"INITIALIZE & RUN 30S DUEL"}</button><span class="tiny mono muted">SEED 0x7A31 · DETERMINISTIC REPLAY</span></div></div></section>
 <aside class="panel"><div class="panel-head"><div class="section-title">TARGET INTEL</div></div><div class="panel-body"><div class="eyebrow">MITRE ATT&CK · ${scenario.mitre.split(" · ")[0]}</div><h3 style="font:600 14px var(--mono);margin:12px 0 8px">${scenario.name}</h3><p class="muted" style="font-size:11px;line-height:1.65">${scenario.description}</p><div class="field" style="margin-top:18px"><span class="field-label">TARGET RESOURCE</span><div class="mono" style="font-size:11px;color:#80cfdb">${scenario.resource}</div></div><div class="field"><span class="field-label">RED PAYLOAD</span><div class="diff">${esc(scenario.payload)}</div></div><div class="warning-panel">All actions occur in a local visual simulation. No workloads, cluster credentials, or Kubernetes API are contacted.</div></div></aside></div>
 ${renderCombatSection(scenario)}
 <section class="panel" style="margin-top:14px"><div class="panel-head"><div class="section-title">ARENA EVENT STREAM</div><span class="tiny mono muted">LIVE · SIMULATION</span></div><div class="panel-body activity-scroll"><div class="terminal" id="arenaLog"><div class="terminal-row"><span class="term-time">--:--:--</span><span class="term-agent system">SYSTEM</span><span>Awaiting run initialization.</span></div></div></div></section>${state.apiError?`<div class="warning-panel" role="alert" style="margin-top:14px">LIVE API UNAVAILABLE — ${esc(state.apiError)}. Mock fallback is disabled.</div>`:""}`;
}
function memory(){
 const items=state.episodes.filter(e=>(state.filter==="all"||e.verdict.includes(state.filter))&&(`${e.scenario} ${e.technique} ${e.payload} ${e.id}`).toLowerCase().includes(state.search.toLowerCase()));
 const pages=Math.max(1,Math.ceil(items.length/8)),page=Math.min(state.episodePage,pages),shown=items.slice((page-1)*8,page*8);
 return `${heading("Episodic Memory","Auditable archive of deterministic adversarial runs and recorded decisions.",`<div class="action-row"><button class="btn" data-action="csv">${ico("file-down")} EXPORT CSV</button><button class="btn" data-action="pdf">${ico("printer")} PRINT / PDF</button></div>`)}
 <div class="memory-tools"><input class="form-control" type="search" placeholder="Search scenario, technique, payload…" value="${esc(state.search)}" data-input="memory-search" aria-label="Search episodes" data-testid="input-memory-search"><select class="form-control" data-input="memory-filter" aria-label="Filter verdict" data-testid="filter-memory"><option value="all" ${state.filter==="all"?"selected":""}>All verdicts</option><option value="VERIFIED" ${state.filter==="VERIFIED"?"selected":""}>Verified secure</option><option value="REJECTED" ${state.filter==="REJECTED"?"selected":""}>Rejected patch</option></select><span class="tiny mono muted">${items.length} RECORD${items.length===1?"":"S"} · RETAINED LOCALLY</span></div>
 <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Timestamp / ID</th><th>Scenario</th><th>MITRE technique</th><th>Payload</th><th>Patch diff</th><th>Judge verdict</th><th>Human action</th></tr></thead><tbody>${shown.length?shown.map(e=>`<tr data-testid="episode-${e.id}"><td class="mono">${new Date(e.timestamp).toLocaleString()}<br><span class="muted">${esc(e.id)}</span></td><td>${esc(e.scenario)}<br><span class="muted mono tiny">${esc(e.resource||"")}</span></td><td class="mono">${esc(e.technique)}</td><td class="mono" style="max-width:190px;word-break:break-word;color:#a9bac4">${esc(e.payload)}</td><td><button class="btn btn-sm btn-quiet" data-action="show-diff" data-id="${esc(e.id)}">${ico("file-code-2")} VIEW PATCH</button></td><td><span class="verdict ${e.verdict.includes("REJECTED")?"rejected":""}">${esc(e.verdict)}</span></td><td>${esc(e.humanAction)}</td></tr>`).join(""):`<tr><td colspan="7"><div class="empty-state">${ico("archive")}<br>NO EPISODES MATCH<br><span class="tiny">Complete a simulated duel to populate the local archive.</span></div></td></tr>`}</tbody></table></div><div class="pagination"><span>PAGE ${page} / ${pages} · ${items.length} TOTAL</span><div class="action-row"><button class="btn btn-sm" data-action="page-prev" ${page<=1?"disabled":""}>${ico("chevron-left")} PREV</button><button class="btn btn-sm" data-action="page-next" ${page>=pages?"disabled":""}>NEXT ${ico("chevron-right")}</button></div></div></section>
 <p class="tiny muted mono" style="margin-top:12px">DEMO RECORDS PERSIST IN THIS BROWSER'S LOCAL STORAGE. EXPORTS CONTAIN SIMULATION DATA ONLY.</p>`;
}
function settings(){return `${heading("Settings","Configure local simulation behavior and operator decision policy.")}
 <div class="settings-grid"><section class="panel"><div class="panel-head"><div class="section-title">SIMULATION & CONTROL</div><span class="tiny mono muted">PERSISTED ON THIS DEVICE</span></div><div class="panel-body">
 <div class="setting-row"><div><strong>Mock simulation engine</strong><p>When enabled, runs deterministic demo events. Disable to use configured API endpoints; errors are surfaced without fallback.</p></div><button class="switch" role="switch" aria-checked="${state.mock}" data-action="toggle-mock" aria-label="Toggle mock simulation" data-testid="switch-mock"></button></div>
 <div class="setting-row"><div><strong>Decision policy</strong><p>Auto-Pilot records completion automatically. HITL pauses at the patch gate for an explicit demo approval.</p></div><div class="radio-group"><button class="radio-chip ${state.mode==="AUTO"?"active":""}" data-mode="AUTO" data-testid="mode-auto">AUTO-PILOT</button><button class="radio-chip ${state.mode==="HITL"?"active":""}" data-mode="HITL" data-testid="mode-hitl">HUMAN-IN-LOOP</button></div></div>
 <div class="setting-row"><div><strong>Cyber Audio Synthesizer (SFX)</strong><p>Real-time synthesized Web Audio effects for button clicks, duels, strikes, shields, and clashes. Stays persistent site-wide.</p></div><button class="switch" role="switch" aria-checked="${sfx.enabled}" data-action="toggle-sfx" aria-label="Toggle Sound Effects" data-testid="switch-sfx"></button></div>
 <div class="setting-row"><div><strong>Display scanlines</strong><p>Subtle CRT texture overlay. Respects the operating system reduced-motion preference.</p></div><button class="switch" role="switch" aria-checked="${state.scanlines}" data-action="toggle-scanlines" aria-label="Toggle scanlines" data-testid="switch-scanlines"></button></div>
 <div class="setting-row"><div><strong>Local episode archive</strong><p>${state.episodes.length} demo episode${state.episodes.length===1?"":"s"} saved in browser storage. Reset removes only these demo records.</p></div><button class="btn btn-red btn-sm" data-action="reset">${ico("trash-2")} RESET DEMO DATA</button></div>
 </div></section><aside class="panel"><div class="panel-head"><div class="section-title">ENVIRONMENT BOUNDARY</div></div><div class="panel-body"><div class="warning-panel"><strong>DEMO MODE · NO REAL CLUSTER</strong><br>${WARDEN_BRAND} currently simulates a Kubernetes security workflow in your browser. No cluster is connected. Approvals, patches, resets, metrics, and outcomes do not modify infrastructure.</div><div style="margin-top:18px"><div class="field-label">API ENDPOINTS WHEN MOCK OFF</div><div class="diff">GET  /api/dashboard/metrics<br>POST /api/rounds/start<br>GET  /api/rounds/stream  (SSE)</div></div><div style="margin-top:17px" class="tiny mono muted">${WARDEN_BRAND} FRONTEND · DEMO BUILD<br>SESSION: LOCAL / ISOLATED</div></div></aside></div>`}

function appendArena(agent,text){const area=document.querySelector("#arenaLog");if(!area)return;area.setAttribute("aria-live","polite");area.setAttribute("aria-relevant","additions");area.setAttribute("role","log");const time=new Date().toLocaleTimeString("en-US",{hour12:false});area.insertAdjacentHTML("afterbegin",`<div class="terminal-row"><span class="term-time">${time}</span><span class="term-agent ${agent.toLowerCase()}">${esc(agent)}</span><span>${esc(text)}</span></div>`)}
function setGate(index,mode,text){
  const el=document.querySelector(`[data-gate="${index}"]`);
  if(el){
    el.classList.remove("active","pass","fail");
    el.classList.add(mode);
    const orb=el.querySelector(".gate-status-orb, .gate-mark");
    if(orb) orb.textContent=mode==="pass"?"✓":mode==="fail"?"×":String(index+1).padStart(2,"0");
    const sub=document.querySelector(`#gateSub-${index}`);
    if(sub){
      sub.textContent=mode==="pass"?"PASSED · VERIFIED SECURE":mode==="fail"?"REJECTED · BREACH OPEN":"CHECKING GATE...";
    }
  }
  if(text)appendArena("JUDGE",text);
}
function startPreflight(){
 if(state.running||state.launching)return;
 state.launching=true;
 const overlay=document.createElement("div");
 overlay.className="launch-overlay";
 overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","launchTitle");
 overlay.innerHTML=`<section class="launch-glass"><div class="launch-kicker">${WARDEN_BRAND} / ISOLATED RUN SEQUENCE</div><div class="launch-reticle">${ico("crosshair")}</div><h2 id="launchTitle">CLONE INITIALIZATION</h2><p class="launch-warning">DEMO SIMULATION · NO REAL CLUSTER CONNECTED</p><div class="launch-phases"><div class="launch-phase current" data-phase="clone"><span>01</span><b>CLONE WORKSPACE</b><i>WAITING</i></div><div class="launch-phase" data-phase="agents"><span>02</span><b>START AGENTS</b><i>WAITING</i></div><div class="launch-phase" data-phase="ready"><span>03</span><b>READY CHECK</b><i>WAITING</i></div></div><div class="launch-countdown" id="launchCountdown" aria-live="assertive">CLONING</div><div class="launch-sub" id="launchSub">Creating disposable namespace · warden-lab-7</div><div class="launch-scan"></div><button class="btn btn-quiet launch-reset" data-action="reset">${ico("rotate-ccw")} RESET LOCAL DEMO</button></section>`;
 app.append(overlay);iconify();
 const phase=(name,label)=>{overlay.querySelectorAll(".launch-phase").forEach(x=>{x.classList.remove("current","done");const status=x.querySelector("i");if(x.dataset.phase===name){x.classList.add("current");status.textContent=name==="ready"?"READY":"IN PROGRESS"}else if(["clone","agents","ready"].indexOf(x.dataset.phase)<["clone","agents","ready"].indexOf(name)){x.classList.add("done");status.textContent="COMPLETE"}else status.textContent="WAITING"});overlay.querySelector("#launchCountdown").textContent=label};
 const schedule=(ms,fn)=>state.launchTimers.push(setTimeout(fn,ms));
 schedule(850,()=>{if(!state.launching)return;phase("agents","AGENT STARTUP");overlay.querySelector("#launchSub").textContent="Red attacker + Blue defender · deterministic seed 0x7A31"});
 schedule(1650,()=>{if(!state.launching)return;phase("ready","READY");overlay.querySelector("#launchSub").textContent="Isolated target snapshot verified · no external connection"});
 [3,2,1].forEach((n,i)=>schedule(2250+i*720,()=>{if(!state.launching)return;phase("ready",String(n));sfx.countdownTick();overlay.querySelector("#launchSub").textContent="All agents standing by"}));
 schedule(4410,()=>{if(!state.launching)return;phase("ready","FIGHT");sfx.fightHorn();overlay.querySelector("#launchSub").textContent="Adversarial exchange beginning"});
 schedule(5100,()=>{if(!state.launching)return;state.launching=false;state.launchTimers=[];overlay.remove();executeDuel()});
}
function executeDuel(){
 state.running=true;state.round=0;state.seconds=30;state.decision=null;state.pendingEpisode=null;renderView();
 combatStage.reset();
 const banner=document.querySelector("#combatBannerText");
 if(banner)banner.textContent="FIGHT! ADVERSARIAL EXCHANGE COMMENCED";
 const status=document.querySelector("#stageStatus");if(status)status.innerHTML=`<div class="status-orb">${ico("loader-circle")}</div><div><strong style="color:#50d9e8">CLONING EPHEMERAL WORKSPACE</strong><br><span class="tiny">Creating isolated namespace · no real cluster access</span></div>`;
 appendArena("SYSTEM","Initializing isolated clone · namespace warden-lab-7");
 if(!state.mock){liveRun();return}
 state.simulation=runDemo(state.selected,e=>onSimEvent(e),()=>{});
 window.runTicker=setInterval(()=>{if(!state.running)return;state.seconds=Math.max(0,state.seconds-1);state.round=Math.min(30,30-state.seconds);const c=document.querySelector("#countdown"),r=document.querySelector("#roundCount"),p=document.querySelector("#runProgress");if(c)c.textContent=String(state.seconds).padStart(2,"0");if(r)r.textContent=`ROUND ${String(state.round).padStart(2,"0")}`;if(p)p.style.width=`${state.round/30*100}%`},1000);
}
function onSimEvent(e){
 const red=document.querySelector("#redOutput"),blue=document.querySelector("#blueOutput");
 if(e.type==="state"){let status=document.querySelector("#stageStatus");if(status)status.innerHTML=`<div class="status-orb">${ico("radio")}</div><div><strong style="color:#50d9e8">${esc(e.text)}</strong><br><span class="tiny">Disposable workload clone · demo simulation</span></div>`;appendArena("SYSTEM",e.text)}
 if(e.type==="log")appendArena(e.agent,e.text);
 if(e.type==="red"){
   if(red)red.innerHTML=`<span class="hot">${esc(e.text)}</span>`;
   const status=document.querySelector("#redStatus"),sb=document.querySelector("#redStatusBadge"),callout=document.querySelector("#redCombatCallout"),banner=document.querySelector("#combatBannerText");
   if(status)status.textContent="STRIKING";
   if(sb)sb.textContent="STRIKING";
   if(callout)callout.textContent="RED STRIKE · PROBING";
   if(banner)banner.textContent=`RED STRIKE: ${esc(e.text)}`;
   combatStage.redAttack(state.selected.code);
   appendArena("RED",e.text);
 }
 if(e.type==="blue"){
   if(blue)blue.innerHTML=`<span class="cool">${esc(e.text)}</span>`;
   const status=document.querySelector("#blueStatus"),sb=document.querySelector("#blueStatusBadge"),callout=document.querySelector("#blueCombatCallout"),banner=document.querySelector("#combatBannerText");
   if(status)status.textContent="PATCHING";
   if(sb)sb.textContent="PATCHING";
   if(callout)callout.textContent=e.text.includes("Iteration 2")?"COUNTERMEASURE · DROP ALL":"BRACING · DRAFTING PATCH";
   if(banner)banner.textContent=`BLUE COUNTER: ${esc(e.text)}`;
   combatStage.blueDefend(e.text.includes("Iteration 2")?"DROP ALL CAPABILITIES":"PATCH DRAFT");
   appendArena("BLUE",e.text);
 }
 if(e.type==="patch"){
   const iteration=document.querySelector("#patchIteration"),diff=document.querySelector("#patchDiff"),status=document.querySelector("#blueStatus"),callout=document.querySelector("#blueCombatCallout"),banner=document.querySelector("#combatBannerText");
   if(iteration)iteration.textContent=e.text.includes("capabilities")?"ITERATION 2":"ITERATION 1";
   if(diff)diff.innerHTML=e.text.split("\n").map(line=>`<span class="${line.includes("→")?(line.includes("false")?"plus":"minus"):line.includes("drop:")||line.includes("true")?"plus":""}">${esc(line)}</span>`).join("\n");
   if(status)status.textContent="PATCH PROPOSED";
   if(callout)callout.textContent=e.text.includes("capabilities")?"PATCH LOCKED · ITERATION 2":"PATCH PROPOSED · ITERATION 1";
   if(banner)banner.textContent=e.text.includes("capabilities")?"BLUE COUNTER · HARDENED PATCH PROPOSED":"BLUE BLOCK · FIRST PATCH PROPOSED";
   combatStage.blueDefend(e.text.includes("capabilities")?"DROP ALL":"PATCH 1");
   appendArena("BLUE",`Manifest patch proposed · ${e.text.replace(/\n/g," / ")}`);
 }
 if(e.type==="clash"){
   combatStage.clashImpact();
   const banner=document.querySelector("#combatBannerText");
   if(banner)banner.textContent="💥 ADVERSARIAL CLASH · ATTACK MEETS POLICY BARRIER";
   appendArena("SYSTEM","Agent exchange · adversarial probe meets policy boundary");
 }
 if(e.type==="gate"){
   setGate(e.index,e.state,e.text);
   const banner=document.querySelector("#combatBannerText");
   if(e.state==="fail"){
     combatStage.gateFailure(e.index);
     const callout=document.querySelector("#redCombatCallout");
     if(callout)callout.textContent="BREACH STILL OPEN!";
     if(banner)banner.textContent=`JUDGE VERDICT: GATE 0${e.index+1} REJECTED · ITERATE`;
   }else if(e.state==="pass"){
     combatStage.gateSuccess(e.index);
     const callout=document.querySelector("#blueCombatCallout");
     if(callout)callout.textContent=`GATE 0${e.index+1} HELD · VERIFIED`;
     if(banner)banner.textContent=`JUDGE VERDICT: GATE 0${e.index+1} PASSED · HELD`;
   }
 }
 if(e.type==="complete"){
   state.running=false;clearInterval(window.runTicker);state.simulation=null;
   combatStage.matchVictory();
   const rs=document.querySelector("#redStatus"),bs=document.querySelector("#blueStatus"),ss=document.querySelector("#stageStatus"),banner=document.querySelector("#combatBannerText");
   if(rs)rs.textContent="CONTAINED";
   if(bs)bs.textContent="VERIFIED";
   if(banner)banner.textContent="🏆 K.O. — VERIFIED SECURE · 4 ORDERED GATES PASSED";
   if(ss)ss.innerHTML=`<div class="status-orb" style="color:#10b981;border-color:#16805d">${ico("shield-check")}</div><div><strong style="color:#63dbad">VERIFIED SECURE</strong><br><span class="tiny">Four ordered Judge gates complete. Demo result only.</span></div>`;
   const redCallout=document.querySelector("#redCombatCallout"),blueCallout=document.querySelector("#blueCombatCallout");
   if(redCallout)redCallout.textContent="CONTAINED · BOUNDARY HOLDS";
   if(blueCallout)blueCallout.textContent="FOUR GATES HELD · VERIFIED";
   appendArena("JUDGE",e.text);
   if(state.mode==="HITL"){state.pendingEpisode=makeEpisode(state.selected,"HUMAN-IN-THE-LOOP","VERIFIED SECURE","PENDING OPERATOR");showDecision()}else finishRun(makeEpisode(state.selected));
 }
}
function showDecision(){
 const ep=state.pendingEpisode;if(!ep)return;
 sfx.shield();
 const resource=esc(ep.resource||"apps/demo-workload"),name=esc(ep.scenario);
 const patchedSecurity=String(ep.patch||"").split("\n").map((line,index)=>`${index===0?"        ":"          "}${line}`).join("\n");
 const original=`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${resource.split("/").pop()}\nspec:\n  template:\n    spec:\n      containers:\n      - name: workload\n        securityContext:\n          privileged: true\n          allowPrivilegeEscalation: true`;
 const patched=`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${resource.split("/").pop()}\nspec:\n  template:\n    spec:\n      containers:\n      - name: workload\n${patchedSecurity}`;
 const overlay=document.createElement("div");overlay.className="modal-backdrop decision-backdrop";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","decisionTitle");overlay.setAttribute("aria-describedby","decisionSafety");
 overlay.innerHTML=`<section class="modal decision-modal"><div class="modal-head"><div><div class="eyebrow">HUMAN-IN-THE-LOOP / GATE 04 OF 04</div><h2 id="decisionTitle" style="margin-top:7px">OPERATOR DECISION REQUIRED</h2></div><span class="verdict">4 / 4 GATES PASSED</span></div><div class="modal-content"><div class="decision-alert" id="decisionSafety"><strong>DEMO ONLY — NO REAL CLUSTER IS CONNECTED.</strong> These actions record an operator choice in this browser. Approving or delegating does not apply a manifest or modify infrastructure.</div><p class="mono tiny muted" style="margin:15px 0 9px">SCENARIO · ${name} &nbsp; / &nbsp; TARGET · ${resource}</p><div class="manifest-compare"><section><div class="manifest-label original-label"><span>01 / ORIGINAL · VULNERABLE</span><span>RED TARGET</span></div><pre class="diff manifest-code">${esc(original)}</pre></section><section><div class="manifest-label patched-label"><span>02 / BLUE PROPOSAL</span><span>NOT APPLIED</span></div><pre class="diff manifest-code">${esc(patched)}</pre></section></div><p class="decision-note">The 30-second run is paused and complete. Choose an action to resume. Your choice is stored as demo evidence only.</p></div><div class="modal-footer decision-actions"><button class="btn btn-safe" data-action="approve-demo" data-testid="decision-approve">${ico("check")} APPROVE · DEMO ONLY</button><button class="btn btn-primary" data-action="delegate-demo" data-testid="decision-delegate">${ico("users")} DELEGATE TO AGENTS · DEMO</button><button class="btn btn-red" data-action="reject-rerun" data-testid="decision-reject">${ico("rotate-cw")} REJECT & RE-RUN</button></div></section>`;
 app.append(overlay);overlay.querySelector('[data-action="approve-demo"]')?.focus();
}
function finishRun(ep){
 if(!ep)return;state.running=false;clearInterval(window.runTicker);
 if(state.pendingEpisode){ep=state.pendingEpisode;state.pendingEpisode=null}
 if(state.mode==="AUTO")ep.humanAction="AUTO VERIFIED";
 saveEpisode(ep);state.episodes=getEpisodes();state.metrics.cycles++;
 if(ep.verdict==="VERIFIED SECURE")state.metrics.hardened++;
 state.metrics.active=Math.max(1,state.metrics.active-1);
 state.activity.unshift([new Date().toLocaleTimeString("en-US",{hour12:false}),"JUDGE",`${ep.verdict} · ${ep.scenario} · demo record`]);
 document.querySelector(".decision-backdrop")?.remove();
 toast(ep.humanAction==="DELEGATED (DEMO)"?"Delegation recorded for this demo only.":"Demo result recorded locally; no manifest was applied.");
 renderView()
}
function rejectAndRerun(){
 const ep=state.pendingEpisode;if(!ep)return;
 sfx.gateFail();
 ep.verdict="REJECTED BY OPERATOR";ep.humanAction="REJECTED & RE-RUN (DEMO)";
 saveEpisode(ep);state.episodes=getEpisodes();state.metrics.cycles++;state.activity.unshift([new Date().toLocaleTimeString("en-US",{hour12:false}),"SYSTEM",`Operator rejected ${ep.scenario} patch · re-run requested (demo)`]);
 state.pendingEpisode=null;state.running=false;document.querySelector(".decision-backdrop")?.remove();renderView();toast("Demo patch rejected. Re-running from a fresh simulated clone.");
 state.launchTimers.push(setTimeout(()=>startPreflight(),450))
}
function cancelActiveRun(){
 state.runToken++;state.apiController?.abort();state.apiController=null;
 state.simulation?.cancel?.();state.simulation=null;
 state.launchTimers.forEach(clearTimeout);state.launchTimers=[];
 state.launching=false;state.running=false;state.pendingEpisode=null;
 clearInterval(window.runTicker);document.querySelector(".launch-overlay")?.remove();document.querySelector(".decision-backdrop")?.remove();
}
function liveRun(){
 const token=state.runToken,controller=new AbortController();state.apiController=controller;
 startRound({id:state.selected.id,name:state.selected.name}).then(data=>{if(token!==state.runToken)return;appendArena("SYSTEM",`Live API round started · ${JSON.stringify(data)}`);streamRound(event=>{if(token===state.runToken)onSimEvent(event)},err=>{if(token!==state.runToken)return;state.running=false;clearInterval(window.runTicker);state.apiError=err.message;toast(err.message,true);renderView()},controller.signal)}).catch(err=>{if(token!==state.runToken)return;state.running=false;clearInterval(window.runTicker);state.apiError=err.message;appendArena("SYSTEM",err.message);toast(err.message,true);renderView()});
}
function openModal(title,content,footer="",onClose=null){document.querySelector(".modal-backdrop")?.remove();const b=document.createElement("div");b.className="modal-backdrop";b.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><h2 id="modalTitle">${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Close">${ico("x")}</button></div><div class="modal-content">${content}</div>${footer?`<div class="modal-footer">${footer}</div>`:""}</section>`;b.addEventListener("click",e=>{if(e.target===b)b.remove()});app.append(b);iconify();b.querySelector("[data-action=close-modal]")?.addEventListener("click",()=>b.remove());b._close=onClose}
function confirmReset(){openModal("RESET LOCAL DEMO DATA",`<div class="warning-panel">This permanently removes ${state.episodes.length} locally stored demo episode${state.episodes.length===1?"":"s"} and resets visible demo telemetry. It does not change a real cluster. This action cannot be undone.</div>`,`<button class="btn" data-action="close-modal">CANCEL</button><button class="btn btn-red" data-action="confirm-reset">${ico("trash-2")} CONFIRM RESET</button>`)}
function exportCsv(){const rows=[["timestamp","scenario","MITRE technique","payload","patch diff","judge verdict","human action"],...state.episodes.map(e=>[e.timestamp,e.scenario,e.technique,e.payload,e.patch,e.verdict,e.humanAction])];const csv=rows.map(row=>row.map(x=>`"${String(x??"").replaceAll('"','""')}"`).join(",")).join("\r\n");download(new Blob([csv],{type:"text/csv"}),"warden-episodes.csv");toast("CSV archive downloaded.")}
function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function refreshLiveMetrics(){if(!state.mock){try{state.metrics=await getDashboardMetrics();state.apiError="";renderView()}catch(e){state.apiError=e.message;renderView()}}}

app.addEventListener("click",async e=>{
 if (e.target.matches("#homeSidebarBackdrop") || e.target.closest("[data-action='close-home-drawer']")) {
   document.querySelector("#homeSidebarDrawer")?.classList.remove("active");
   document.querySelector("#homeSidebarBackdrop")?.classList.remove("active");
   return;
 }
 const nexusBtn = e.target.closest("[data-nexus-action]");
 if (nexusBtn) {
   const act = nexusBtn.dataset.nexusAction;
   if (window.triggerNexusPulse) window.triggerNexusPulse(act);
   return;
 }
 const homeScen = e.target.closest("[data-home-scenario]");
 if (homeScen) {
   state.selected = scenarios.find(s => s.id === homeScen.dataset.homeScenario);
   if (sfx.enabled) sfx.beep(580, 0.06);
   shell();
   return;
 }
 const combatBtn = e.target.closest("[data-combat-action]");
 if (combatBtn) {
   const action = combatBtn.dataset.combatAction;
   if (action === "test-red") combatStage.redAttack(state.selected.code);
   if (action === "test-blue") combatStage.blueDefend("MANUAL TEST");
   if (action === "test-clash") combatStage.clashImpact();
   return;
 }
 const nav=e.target.closest("[data-nav]");if(nav){if(state.pendingEpisode){toast("Resolve the pending operator decision before leaving the arena.");document.querySelector(".decision-backdrop [data-action='approve-demo']")?.focus();return}if(state.launching&&nav.dataset.nav!=="arena"){toast("Launch sequence is in progress.");return}if(state.running&&nav.dataset.nav!=="dashboard"){toast("The active duel is running. Use Dashboard to reset the local demo if needed.");return}state.view=nav.dataset.nav;state.sidebar=false;state.apiError="";shell();if(state.view==="dashboard")refreshLiveMetrics();return}
 const scenario=e.target.closest("[data-scenario]");if(scenario){state.selected=scenarios.find(s=>s.id===scenario.dataset.scenario);renderView();return}
 const mode=e.target.closest("[data-mode]");if(mode){state.mode=mode.dataset.mode;localStorage.setItem("warden-mode",JSON.stringify(state.mode));renderView();toast(`Control mode set to ${state.mode==="AUTO"?"Auto-Pilot":"Human-in-the-Loop"}.`);return}
 const b=e.target.closest("[data-action]");if(!b)return;
 switch(b.dataset.action){
 case"toggle-home-drawer":
   document.querySelector("#homeSidebarDrawer")?.classList.toggle("active");
   document.querySelector("#homeSidebarBackdrop")?.classList.toggle("active");
   break;
 case"toggle-sfx":
   sfx.toggle();
   document.querySelectorAll(".sound-toggle-btn").forEach(btn => {
     btn.classList.toggle("active", sfx.enabled);
     btn.innerHTML = `${ico(sfx.enabled ? "volume-2" : "volume-x")}<span>SFX ${sfx.enabled ? "ON" : "OFF"}</span>`;
   });
   document.querySelectorAll('[data-action="toggle-sfx"].switch').forEach(sw => {
     sw.setAttribute("aria-checked", String(sfx.enabled));
   });
   toast(`Sound synthesizer ${sfx.enabled ? "enabled" : "muted"}.`);
   iconify();
   break;
 case"collapse":state.collapsed=!state.collapsed;localStorage.setItem("warden-collapsed",JSON.stringify(state.collapsed));shell();break;
 case"mobile-nav":state.sidebar=true;shell();break;case"close-mobile":state.sidebar=false;shell();break;
 case"stage":sfx.engage();state.view="arena";shell();break;
 case"toggle-mode":state.mode=state.mode==="AUTO"?"HITL":"AUTO";localStorage.setItem("warden-mode",JSON.stringify(state.mode));renderView();toast(`Control mode set to ${state.mode==="AUTO"?"Auto-Pilot":"Human-in-the-Loop"}.`);break;
 case"toggle-mock":state.mock=!state.mock;localStorage.setItem("warden-mock",JSON.stringify(state.mock));renderView();toast(`Mock simulation ${state.mock?"enabled":"disabled"}.`);break;
 case"toggle-scanlines":state.scanlines=!state.scanlines;localStorage.setItem("warden-scanlines",JSON.stringify(state.scanlines));document.body.classList.toggle("scanlines",state.scanlines);renderView();break;
  case"start-run":sfx.engage();startPreflight();break;
  case"approve-demo":sfx.gatePass();if(state.pendingEpisode){state.pendingEpisode.humanAction="APPROVED (DEMO)";state.pendingEpisode.verdict="VERIFIED SECURE";finishRun(state.pendingEpisode)}break;
  case"delegate-demo":sfx.gatePass();if(state.pendingEpisode){state.pendingEpisode.humanAction="DELEGATED (DEMO)";state.pendingEpisode.verdict="VERIFIED SECURE";finishRun(state.pendingEpisode)}break;
  case"reject-rerun":rejectAndRerun();break;
 case"reset":confirmReset();break;
  case"confirm-reset":cancelActiveRun();clearEpisodes();state.episodes=[];state.metrics=getMetrics();state.activity=getActivity();document.querySelector(".modal-backdrop")?.remove();renderView();toast("Local demo data reset. No cluster was touched.");break;
 case"csv":exportCsv();break;case"pdf":window.print();break;
 case"page-prev":state.episodePage=Math.max(1,state.episodePage-1);renderView();break;case"page-next":state.episodePage++;renderView();break;
 case"show-diff":{const ep=state.episodes.find(x=>x.id===b.dataset.id);if(ep)openModal(`PATCH · ${esc(ep.scenario)}`,`<div class="eyebrow">${esc(ep.id)} · ${esc(ep.timestamp)}</div><pre class="diff" style="margin-top:14px">${esc(ep.patch)}</pre><div class="warning-panel" style="margin-top:12px">Archived manifest is simulation evidence only; it was not applied to a real cluster.</div>`,`<button class="btn" data-action="close-modal">CLOSE</button>`);break}
 case"close-modal":document.querySelector(".modal-backdrop")?.remove();break;
 }
 iconify();
});
app.addEventListener("input",e=>{if(e.target.matches('[data-input="memory-search"]')){state.search=e.target.value;state.episodePage=1;const pos=e.target.selectionStart;renderView();const next=document.querySelector('[data-input="memory-search"]');next?.focus();next?.setSelectionRange(pos,pos)}});
app.addEventListener("change",e=>{if(e.target.matches('[data-input="memory-filter"]')){state.filter=e.target.value;state.episodePage=1;renderView()}});
document.addEventListener("keydown",e=>{
 const decision=document.querySelector(".decision-backdrop .decision-modal");
 if(state.pendingEpisode&&decision){
  if(e.key==="Escape"){e.preventDefault();e.stopPropagation();return}
  if(e.key==="Tab"){const controls=[...decision.querySelectorAll("button:not([disabled])")],first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  return
 }
 if(e.key==="Escape"){document.querySelector(".modal-backdrop")?.remove();if(state.sidebar){state.sidebar=false;shell()}}
});
window.addEventListener("beforeunload",cancelActiveRun);
document.addEventListener("click", e => {
  const target = e.target.closest("button, .btn, [role='button'], [data-nav], [data-action], [data-scenario], [data-mode], [data-home-scenario], [data-combat-action], .radio-chip, .switch, .scenario-option, .lab-scenario-tab");
  if (!target) return;
  if (target.matches('[data-action="toggle-sfx"]') || target.closest('[data-action="toggle-sfx"]')) return;
  if (target.matches("[data-nav]") || target.closest("[data-nav]")) {
    sfx.navSwitch();
  } else {
    sfx.uiClick();
  }
}, true);
 shell();
 if(state.view==="dashboard")refreshLiveMetrics();
