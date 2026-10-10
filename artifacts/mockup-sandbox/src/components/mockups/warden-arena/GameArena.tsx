import { useEffect, useRef, useState } from "react";
import {
  Box, Database, House, LayoutDashboard, PanelLeftClose, Scale,
  SlidersHorizontal, Swords, Zap,
} from "lucide-react";
import "./_group.css";
import "./GameArena.css";

const scenarios = [
  { id: "privileged-pod", code: "KGOAT-01", name: "Privileged Container", description: "Break out through a privileged workload and hostPath mount.", mitre: "T1611 · Escape to Host", payload: "kubectl exec -it api-7d9c -- nsenter -t 1 -m -u -n -i sh", resource: "Deployment/api-gateway", risk: "CRITICAL" },
  { id: "exposed-dashboard", code: "KGOAT-02", name: "Exposed Dashboard", description: "Reach an unauthenticated Kubernetes dashboard service.", mitre: "T1190 · Exploit Public-Facing App", payload: "curl -sk https://dashboard.ops.svc/api/v1/secrets", resource: "Service/kubernetes-dashboard", risk: "HIGH" },
  { id: "weak-rbac", code: "KGOAT-03", name: "Over-permissive RBAC", description: "Escalate via a wildcard ClusterRoleBinding.", mitre: "T1098 · Account Manipulation", payload: "kubectl auth can-i create pods --as=system:serviceaccount:apps:runner", resource: "ClusterRoleBinding/runner-admin", risk: "HIGH" },
  { id: "secret-env", code: "KGOAT-04", name: "Secret in Environment", description: "Harvest credentials exposed to a container environment.", mitre: "T1552.007 · Container API", payload: "cat /proc/1/environ | tr '\\0' '\\n' | grep TOKEN", resource: "Deployment/checkout-worker", risk: "HIGH" },
  { id: "hostpath-mount", code: "KGOAT-05", name: "Host Path Exposure", description: "Read host filesystem through an unsafe volume mount.", mitre: "T1611 · Escape to Host", payload: "find /mnt/host/etc/kubernetes -maxdepth 2 -type f", resource: "Pod/metrics-sidecar", risk: "CRITICAL" },
];
const gates = ["Re-attack blocked", "Historical attacks blocked", "Application remains healthy", "Variant probes blocked"];
const script = [
  { at: 1, beat: "red-strike", red: "PROBING", redText: "RED STRIKE", log: "Red commits the selected probe against the isolated target." },
  { at: 2, beat: "clash-impact", redText: "BOUNDARY HIT", blueText: "HOLDING LINE", log: "Impact · adversarial probe meets the policy boundary." },
  { at: 3, beat: "blue-block", blue: "PATCHING", blueText: "PATCH / ITERATION 1", patch: "privileged: true  →  privileged: false\nallowPrivilegeEscalation: true  →  false", log: "Blue braces the boundary and proposes a first patch." },
  { at: 4, beat: "judge-fail", gate: 0, fail: true, log: "JUDGE · RE-ATTACK STILL SUCCEEDS · patch rejected." },
  { at: 5, beat: "blue-block", blue: "PATCH PROPOSED", blueText: "COUNTERMEASURE / ITERATION 2", patch: "capabilities:\n  drop: [ALL]\nrunAsNonRoot: true\nreadOnlyRootFilesystem: true", log: "Blue reinforces the defense with a tighter policy." },
  { at: 6, beat: "judge-pass", gate: 0, log: "JUDGE · RE-ATTACK BLOCKED · privilege boundary holds." },
  { at: 7, beat: "judge-pass", gate: 1, log: "JUDGE · HISTORICAL PAYLOADS BLOCKED." },
  { at: 8, beat: "judge-pass", gate: 2, log: "JUDGE · APPLICATION HEALTHY · readiness preserved." },
  { at: 9, beat: "judge-pass", gate: 3, log: "JUDGE · VARIANT PROBES BLOCKED." },
  { at: 10, beat: "secure", blue: "VERIFIED", red: "CONTAINED", blueText: "SECURE / DEMO RESULT", log: "VERIFIED SECURE · four ordered gates passed. Simulation only." },
];

export function GameArena() {
  const [selected, setSelected] = useState(scenarios[0]);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState("");
  const [round, setRound] = useState(0);
  const [redStatus, setRedStatus] = useState("STANDBY");
  const [blueStatus, setBlueStatus] = useState("STANDBY");
  const [redText, setRedText] = useState("Waiting for the opening move.");
  const [blueText, setBlueText] = useState("Defense ready · patch remains a proposal.");
  const [patch, setPatch] = useState("Awaiting Blue agent proposal…");
  const [iteration, setIteration] = useState("NO PATCH");
  const [gateStates, setGateStates] = useState<string[]>([]);
  const [log, setLog] = useState(["Awaiting local preview. No cluster connected."]);
  const timers = useRef<number[]>([]);

  const replay = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setRunning(true); setRound(0); setBeat("opening");
    setRedStatus("STANDBY"); setBlueStatus("STANDBY");
    setRedText("Waiting for the opening move."); setBlueText("Defense ready · patch remains a proposal.");
    setPatch("Awaiting Blue agent proposal…"); setIteration("NO PATCH"); setGateStates([]);
    setLog(["LOCAL PREVIEW · isolated simulation sequence initialized."]);
    script.forEach((item) => timers.current.push(window.setTimeout(() => {
      setRound(item.at * 3);
      setBeat(item.beat);
      if (item.red) setRedStatus(item.red);
      if (item.blue) setBlueStatus(item.blue);
      if (item.redText) setRedText(item.redText);
      if (item.blueText) setBlueText(item.blueText);
      if (item.patch) { setPatch(item.patch); setIteration(item.at < 5 ? "ITERATION 1" : "ITERATION 2"); }
      if (item.gate !== undefined) setGateStates((previous) => {
        const next = [...previous];
        next[item.gate!] = item.fail ? "fail" : "pass";
        return next;
      });
      setLog((previous) => [item.log, ...previous].slice(0, 7));
      if (item.at === 10) setRunning(false);
    }, item.at * 850)));
  };
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  return (
    <div className="warden-arena ga">
      <div className="shell">
        <aside className="sidebar" aria-label="Primary navigation">
          <div className="brand"><div className="brand-mark"><span>W</span></div><div className="brand-copy"><div className="brand-name">WARDEN</div><div className="brand-caption">SECURITY COMMAND</div></div></div>
          <div className="nav-label">OPERATIONS</div>
          <nav className="nav-list" aria-label="Primary navigation">
            {[[House, "Home"], [LayoutDashboard, "Command Dashboard"], [Swords, "Live Arena"], [Database, "Episodic Memory"], [SlidersHorizontal, "Settings"]].map(([Icon, label]: any) => <button className={`nav-item${label === "Live Arena" ? " active" : ""}`} aria-current={label === "Live Arena" ? "page" : "false"} key={label}><Icon aria-hidden="true" /><span>{label}</span></button>)}
          </nav>
          <div className="side-footer"><span className="side-footer-copy">WARDEN v0.9.7 // DEMO BUILD<br />ISOLATED SIMULATION ENVIRONMENT<br /><b>NO CLUSTER CONNECTED</b></span></div>
        </aside>
        <main className="main">
          <header className="topbar"><div className="top-left"><button className="icon-button desktop-collapse" aria-label="Collapse sidebar"><PanelLeftClose aria-hidden="true" /></button><div className="crumb">WARDEN <span>/</span> LIVE ARENA</div></div><div className="top-right"><div className="status-pill"><span className="dot" /> ISOLATED DEMO</div><div className="demo-pill">DEMO MODE · NO REAL CLUSTER</div></div></header>
          <div className="content">
            <div className="page-heading"><div><div className="eyebrow">WARDEN / ARENA</div><h1>Live Arena</h1><p>A simulated fight. A proposed patch. A deterministic Judge.</p></div><span className="demo-pill">SIMULATED ONLY</span></div>
            <div className="stage-grid">
              <section className="panel">
                <div className="panel-head"><div><div className="section-title">01 / SELECT ATTACK SURFACE</div><div className="tiny muted mono" style={{ marginTop: 5 }}>Five isolated Kubernetes lab scenarios</div></div><span className="tiny mono ga-risk">{selected.code} · {selected.risk}</span></div>
                <div className="panel-body"><div className="scenario-grid">{scenarios.map((scenario) => <button key={scenario.id} className={`scenario-option${scenario.id === selected.id ? " selected" : ""}`} aria-pressed={scenario.id === selected.id} disabled={running} onClick={() => setSelected(scenario)}><span className="scenario-code">{scenario.code} · {scenario.risk}</span><strong>{scenario.name}</strong><small>{scenario.description}</small></button>)}</div>
                  <div className="stage-status"><div className="status-orb"><Box /></div><div><strong>{beat === "secure" ? "VERIFIED SECURE" : running ? "ISOLATED DUEL IN PROGRESS" : "ISOLATED WORKSPACE READY"}</strong><br /><span className="tiny">Local visual demo only · no real cluster connected · no manifest applied.</span></div></div>
                  <div className="action-row ga-startrow"><button className="btn btn-red" type="button" onClick={replay} disabled={running}><Swords />{running ? "DUEL IN PROGRESS" : beat === "secure" ? "REPLAY 30S DUEL" : "INITIALIZE & RUN 30S DUEL"}</button><span className="tiny mono muted">SEED 0x7A31 · LOCAL PREVIEW</span></div>
                </div>
              </section>
              <aside className="panel"><div className="panel-head"><div className="section-title">TARGET INTEL</div></div><div className="panel-body"><div className="eyebrow">MITRE ATT&amp;CK · {selected.mitre.split(" · ")[0]}</div><h3 className="ga-intel-title">{selected.name}</h3><p className="muted ga-description">{selected.description}</p><div className="field"><span className="field-label">TARGET RESOURCE</span><div className="mono ga-resource">{selected.resource}</div></div><div className="field"><span className="field-label">RED PAYLOAD</span><div className="diff">{selected.payload}</div></div><div className="warning-panel">Browser-only simulation. No cluster is connected and no manifest is applied.</div></div></aside>
            </div>
            <section className="panel ga-exchange">
              <div className="panel-head"><div><div className="section-title">02 / ADVERSARIAL EXCHANGE</div><div className="ga-roundlabel">ROUND {String(round).padStart(2, "0")} <span>·</span> LOCAL SIMULATION</div></div><div className="run-top"><span className="countdown">00:{String(Math.max(0, 30 - round)).padStart(2, "0")}</span></div></div>
              <div className="panel-body"><div className="progress"><span style={{ width: `${round / 30 * 100}%` }} /></div>
                <div className={`arena ga-stage ${beat ? `beat-${beat}` : "beat-idle"}`} aria-label="Simulated Red versus Blue combat stage">
                  <div className="ga-lane ga-redlane"><span>ATTACK VECTOR</span><i /><i /><i /></div><div className="ga-lane ga-bluelane"><span>POLICY BARRIER</span><i /><i /><i /></div>
                  <article className="agent-card panel red-side" aria-label="Red attacker">
                    <div className="ga-fighter ga-fighter-red" aria-hidden="true"><i className="fighter-crest" /><i className="fighter-core" /><i className="fighter-arm" /><i className="fighter-blade" /></div>
                    <div className="agent-head"><div className="agent-name">RED <small>ATTACKER</small></div><div className="agent-status">{redStatus}</div></div>
                    <div className="ga-callout ga-callout-red">{redText}</div><div className="agent-content">Objective: expose the selected boundary.</div>
                  </article>
                  <div className="arena-bolt"><Zap aria-hidden="true" /></div><div className="ga-impact" aria-hidden="true" /><div className="ga-judge"><span><Scale aria-hidden="true" /></span><b>JUDGE</b><small>4 GATES</small></div>
                  <article className="agent-card panel blue-side" aria-label="Blue defender">
                    <div className="ga-fighter ga-fighter-blue" aria-hidden="true"><i className="fighter-crest" /><i className="fighter-core" /><i className="fighter-arm" /><i className="fighter-shield" /></div>
                    <div className="agent-head"><div className="agent-name">BLUE <small>DEFENDER</small></div><div className="agent-status">{blueStatus}</div></div>
                    <div className="ga-callout ga-callout-blue">{blueText}</div><div className="agent-content">Objective: contain without breaking service.</div>
                  </article>
                  <div className="ga-footnote">SIMULATION ONLY <span>·</span> NO WORKLOADS TOUCHED</div>
                </div>
                <div className="ga-evidence">
                  <div className="panel"><div className="panel-head"><div className="section-title">PROPOSED MANIFEST DIFF</div><span className="tiny mono muted">{iteration}</span></div><div className="panel-body"><div className="diff">{patch}</div><p className="ga-proposal-note">Proposal preview only · nothing is applied.</p></div></div>
                  <div className="panel"><div className="panel-head"><div className="section-title">JUDGE / ORDERED GATES</div><span className="tiny mono ga-judge-label">DETERMINISTIC</span></div><div className="panel-body"><div className="gates">{gates.map((gate, index) => <div className={`gate ${gateStates[index] || ""}`} key={gate}><span className="gate-mark">{gateStates[index] === "pass" ? "✓" : gateStates[index] === "fail" ? "×" : String(index + 1).padStart(2, "0")}</span>{gate}</div>)}</div><div className="ga-referee"><Scale aria-hidden="true" /><span><b>THE JUDGE</b><small>Rejects failed fixes. Four ordered checks decide the simulated result.</small></span></div></div></div>
                </div>
              </div>
            </section>
            <section className="panel ga-log"><div className="panel-head"><div className="section-title">ARENA EVENT STREAM</div><span className="tiny mono muted">LIVE · SIMULATION</span></div><div className="panel-body activity-scroll"><div className="terminal" aria-live="polite" aria-relevant="additions">{log.map((line, index) => <div className="terminal-row" key={`${line}-${index}`}><span className="term-time">{index ? "LOCAL" : "NOW"}</span><span className={`term-agent ${line.includes("JUDGE") ? "judge" : line.includes("Red") ? "red" : "blue"}`}>{line.includes("JUDGE") ? "JUDGE" : "SYSTEM"}</span><span>{line}</span></div>)}</div></div></section>
          </div>
        </main>
      </div>
    </div>
  );
}
