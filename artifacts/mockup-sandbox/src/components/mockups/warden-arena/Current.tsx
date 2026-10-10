import {
  Box,
  Database,
  House,
  LayoutDashboard,
  PanelLeftClose,
  SlidersHorizontal,
  Swords,
  Zap,
} from "lucide-react";

import "./_group.css";

const scenarios = [
  {
    id: "privileged-pod",
    code: "KGOAT-01",
    name: "Privileged Container",
    description: "Break out through a privileged workload and hostPath mount.",
    mitre: "T1611 · Escape to Host",
    payload: "kubectl exec -it api-7d9c -- nsenter -t 1 -m -u -n -i sh",
    resource: "Deployment/api-gateway",
    risk: "CRITICAL",
  },
  {
    id: "exposed-dashboard",
    code: "KGOAT-02",
    name: "Exposed Dashboard",
    description: "Reach an unauthenticated Kubernetes dashboard service.",
    mitre: "T1190 · Exploit Public-Facing App",
    payload: "curl -sk https://dashboard.ops.svc/api/v1/secrets",
    resource: "Service/kubernetes-dashboard",
    risk: "HIGH",
  },
  {
    id: "weak-rbac",
    code: "KGOAT-03",
    name: "Over-permissive RBAC",
    description: "Escalate via a wildcard ClusterRoleBinding.",
    mitre: "T1098 · Account Manipulation",
    payload:
      "kubectl auth can-i create pods --as=system:serviceaccount:apps:runner",
    resource: "ClusterRoleBinding/runner-admin",
    risk: "HIGH",
  },
  {
    id: "secret-env",
    code: "KGOAT-04",
    name: "Secret in Environment",
    description: "Harvest credentials exposed to a container environment.",
    mitre: "T1552.007 · Container API",
    payload: "cat /proc/1/environ | tr '\\0' '\\n' | grep TOKEN",
    resource: "Deployment/checkout-worker",
    risk: "HIGH",
  },
  {
    id: "hostpath-mount",
    code: "KGOAT-05",
    name: "Host Path Exposure",
    description: "Read host filesystem through an unsafe volume mount.",
    mitre: "T1611 · Escape to Host",
    payload: "find /mnt/host/etc/kubernetes -maxdepth 2 -type f",
    resource: "Pod/metrics-sidecar",
    risk: "CRITICAL",
  },
];

const navItems = [
  { label: "Home", icon: House },
  { label: "Command Dashboard", icon: LayoutDashboard },
  { label: "Live Arena", icon: Swords, active: true },
  { label: "Episodic Memory", icon: Database },
  { label: "Settings", icon: SlidersHorizontal },
];

const gates = [
  "Re-attack blocked",
  "Historical attacks blocked",
  "Application remains healthy",
  "Variant probes blocked",
];

export function Current() {
  const scenario = scenarios[0];

  return (
    <div className="warden-arena">
      <div className="shell">
        <aside className="sidebar" aria-label="Primary navigation">
          <div className="brand">
            <div className="brand-mark">
              <span>W</span>
            </div>
            <div className="brand-copy">
              <div className="brand-name">WARDEN</div>
              <div className="brand-caption">SECURITY COMMAND</div>
            </div>
          </div>
          <div className="nav-label">OPERATIONS</div>
          <nav className="nav-list" aria-label="Primary navigation">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                className={`nav-item${active ? " active" : ""}`}
                aria-current={active ? "page" : "false"}
                aria-label={label}
                key={label}
                type="button"
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="side-footer">
            <span className="side-footer-copy">
              WARDEN v0.9.7 // DEMO BUILD
              <br />
              ISOLATED SIMULATION ENVIRONMENT
              <br />
              <span style={{ color: "#e3b650" }}>NO CLUSTER CONNECTED</span>
            </span>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="top-left">
              <button
                className="icon-button desktop-collapse"
                aria-label="Collapse sidebar"
                aria-expanded="true"
                type="button"
              >
                <PanelLeftClose aria-hidden="true" />
              </button>
              <div className="crumb">
                WARDEN <span style={{ color: "#475966" }}>/</span> LIVE ARENA
              </div>
            </div>
            <div className="top-right">
              <div className="status-pill">
                <span className="dot" /> ISOLATED DEMO
              </div>
              <div className="demo-pill">DEMO MODE · NO REAL CLUSTER</div>
            </div>
          </header>

          <div className="content">
            <div className="page-heading">
              <div>
                <div className="eyebrow">WARDEN / ARENA</div>
                <h1>Live Arena</h1>
                <p>
                  Stage an isolated workload clone. Red attacks; Blue patches;
                  Judge verifies.
                </p>
              </div>
              <span className="demo-pill">SIMULATED ONLY</span>
            </div>

            <div className="stage-grid">
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <div className="section-title">
                      01 / SELECT ATTACK SURFACE
                    </div>
                    <div className="tiny muted mono" style={{ marginTop: 5 }}>
                      Kubernetes Goat scenario catalog · five lab cases
                    </div>
                  </div>
                  <span className="tiny mono" style={{ color: "#dd7373" }}>
                    {scenario.code}
                  </span>
                </div>
                <div className="panel-body">
                  <div className="scenario-grid">
                    {scenarios.map((item) => (
                      <button
                        className={`scenario-option${item.id === scenario.id ? " selected" : ""}`}
                        aria-pressed={item.id === scenario.id}
                        key={item.id}
                        type="button"
                      >
                        <span className="scenario-code">
                          {item.code} · {item.risk}
                        </span>
                        <strong>{item.name}</strong>
                        <small>{item.description}</small>
                      </button>
                    ))}
                  </div>
                  <div className="stage-status">
                    <div className="status-orb">
                      <Box aria-hidden="true" />
                    </div>
                    <div>
                      <strong style={{ color: "#c3d0d7" }}>
                        ISOLATED WORKSPACE READY
                      </strong>
                      <br />
                      <span className="tiny">
                        Select scenario and initialize a disposable clone. No
                        real cluster is connected.
                      </span>
                    </div>
                  </div>
                  <div className="action-row" style={{ marginTop: 13 }}>
                    <button className="btn btn-red" type="button">
                      <Swords aria-hidden="true" />
                      INITIALIZE &amp; RUN 30S DUEL
                    </button>
                    <span className="tiny mono muted">
                      SEED 0x7A31 · DETERMINISTIC REPLAY
                    </span>
                  </div>
                </div>
              </section>

              <aside className="panel">
                <div className="panel-head">
                  <div className="section-title">TARGET INTEL</div>
                </div>
                <div className="panel-body">
                  <div className="eyebrow">
                    MITRE ATT&amp;CK · {scenario.mitre.split(" · ")[0]}
                  </div>
                  <h3
                    style={{
                      font: "600 14px var(--mono)",
                      margin: "12px 0 8px",
                    }}
                  >
                    {scenario.name}
                  </h3>
                  <p
                    className="muted"
                    style={{ fontSize: 11, lineHeight: 1.65 }}
                  >
                    {scenario.description}
                  </p>
                  <div className="field" style={{ marginTop: 18 }}>
                    <span className="field-label">TARGET RESOURCE</span>
                    <div
                      className="mono"
                      style={{ fontSize: 11, color: "#80cfdb" }}
                    >
                      {scenario.resource}
                    </div>
                  </div>
                  <div className="field">
                    <span className="field-label">RED PAYLOAD</span>
                    <div className="diff">{scenario.payload}</div>
                  </div>
                  <div className="warning-panel">
                    All actions occur in a local visual simulation. No
                    workloads, cluster credentials, or Kubernetes API are
                    contacted.
                  </div>
                </div>
              </aside>
            </div>

            <section className="panel" style={{ marginTop: 14 }}>
              <div className="panel-head">
                <div className="section-title">02 / ADVERSARIAL EXCHANGE</div>
                <div className="run-top">
                  <span className="round-count">ROUND 00</span>
                  <span className="countdown">00:30</span>
                </div>
              </div>
              <div className="panel-body">
                <div className="progress">
                  <span />
                </div>
                <div className="arena">
                  <article className="agent-card panel red-side">
                    <div className="agent-head">
                      <div className="agent-name">RED / ATTACKER</div>
                      <div className="agent-status">STANDBY</div>
                    </div>
                    <div className="agent-content">
                      Awaiting scenario initialization.
                      <br />
                      Objective: expose a privilege boundary.
                    </div>
                  </article>
                  <div className="arena-bolt">
                    <Zap aria-hidden="true" />
                  </div>
                  <article className="agent-card panel blue-side">
                    <div className="agent-head">
                      <div className="agent-name">BLUE / DEFENDER</div>
                      <div className="agent-status">STANDBY</div>
                    </div>
                    <div className="agent-content">
                      Policy engine ready.
                      <br />
                      Objective: patch without breaking service.
                    </div>
                  </article>
                </div>
                <div
                  className="dashboard-grid"
                  style={{ gridTemplateColumns: "1fr 1fr", margin: "14px 0 0" }}
                >
                  <div className="panel">
                    <div className="panel-head">
                      <div className="section-title">
                        PROPOSED MANIFEST DIFF
                      </div>
                      <span className="tiny mono muted">NO PATCH</span>
                    </div>
                    <div className="panel-body">
                      <div className="diff">
                        Awaiting Blue agent proposal…
                      </div>
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-head">
                      <div className="section-title">JUDGE / ORDERED GATES</div>
                      <span
                        className="tiny mono"
                        style={{ color: "#efbd62" }}
                      >
                        DETERMINISTIC
                      </span>
                    </div>
                    <div className="panel-body">
                      <div className="gates">
                        {gates.map((gate, index) => (
                          <div className="gate" key={gate}>
                            <span className="gate-mark">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {gate}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel" style={{ marginTop: 14 }}>
              <div className="panel-head">
                <div className="section-title">ARENA EVENT STREAM</div>
                <span className="tiny mono muted">LIVE · SIMULATION</span>
              </div>
              <div className="panel-body activity-scroll">
                <div className="terminal">
                  <div className="terminal-row">
                    <span className="term-time">--:--:--</span>
                    <span className="term-agent system">SYSTEM</span>
                    <span>Awaiting run initialization.</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
