const scenarios = [
  {id:"privileged-pod",code:"KGOAT-01",name:"Privileged Container",description:"Break out through a privileged workload and hostPath mount.",mitre:"T1611 · Escape to Host",payload:"kubectl exec -it api-7d9c -- nsenter -t 1 -m -u -n -i sh",resource:"Deployment/api-gateway",risk:"CRITICAL"},
  {id:"exposed-dashboard",code:"KGOAT-02",name:"Exposed Dashboard",description:"Reach an unauthenticated Kubernetes dashboard service.",mitre:"T1190 · Exploit Public-Facing App",payload:"curl -sk https://dashboard.ops.svc/api/v1/secrets",resource:"Service/kubernetes-dashboard",risk:"HIGH"},
  {id:"weak-rbac",code:"KGOAT-03",name:"Over-permissive RBAC",description:"Escalate via a wildcard ClusterRoleBinding.",mitre:"T1098 · Account Manipulation",payload:"kubectl auth can-i create pods --as=system:serviceaccount:apps:runner",resource:"ClusterRoleBinding/runner-admin",risk:"HIGH"},
  {id:"secret-env",code:"KGOAT-04",name:"Secret in Environment",description:"Harvest credentials exposed to a container environment.",mitre:"T1552.007 · Container API",payload:"cat /proc/1/environ | tr '\\0' '\\n' | grep TOKEN",resource:"Deployment/checkout-worker",risk:"HIGH"},
  {id:"hostpath-mount",code:"KGOAT-05",name:"Host Path Exposure",description:"Read host filesystem through an unsafe volume mount.",mitre:"T1611 · Escape to Host",payload:"find /mnt/host/etc/kubernetes -maxdepth 2 -type f",resource:"Pod/metrics-sidecar",risk:"CRITICAL"}
];
const initialLog=[
  ["09:42:18.204","BLUE","Admission policy baseline loaded · 42 controls"],
  ["09:41:54.819","JUDGE","Verification suite passed · 4/4 gates"],
  ["09:41:52.117","BLUE","Patched deployment/api-gateway securityContext"],
  ["09:41:49.602","RED","Probe blocked · host namespace access denied"],
  ["09:41:43.091","SYSTEM","Clone isolated · namespace warden-lab-7"],
  ["09:40:16.443","JUDGE","Variant probe rejected · privilege escalation"],
  ["09:40:12.334","BLUE","Iteration 2 · dropped ALL capabilities"],
  ["09:40:09.128","RED","T1611 payload · privileged container pivot"],
  ["09:39:58.016","SYSTEM","Round 2841 completed · deterministic replay"],
  ["09:39:44.632","BLUE","No-op verified · application health 200"]
];
const defaultMetrics={cycles:2841,hardened:936,active:3,learning:87.4,delta:"+12.8%",lastRun:"4 min ago"};
export function getScenarios(){return scenarios}
export function getMetrics(){return {...defaultMetrics}}
export function getActivity(){return [...initialLog]}
export function getEpisodes(){try{return JSON.parse(localStorage.getItem("warden-episodes")||"[]")}catch{return []}}
export function saveEpisode(episode){const all=getEpisodes();all.unshift(episode);localStorage.setItem("warden-episodes",JSON.stringify(all.slice(0,250)));return episode}
export function clearEpisodes(){localStorage.removeItem("warden-episodes")}
export function makeEpisode(scenario,mode="AUTO-PILOT",verdict="VERIFIED SECURE",humanAction="AUTO VERIFIED"){
  return {id:`WD-${Date.now().toString(36).toUpperCase()}`,timestamp:new Date().toISOString(),scenario:scenario.name,scenarioId:scenario.id,technique:scenario.mitre,payload:scenario.payload,resource:scenario.resource,patch:"securityContext:\n  privileged: false\n  allowPrivilegeEscalation: false\n  capabilities:\n    drop: [ALL]",verdict,humanAction,mode,iteration:2,gateResults:["RE-ATTACK BLOCKED","OLD ATTACKS BLOCKED","APP HEALTHY","VARIANTS BLOCKED"]};
}
export function runDemo(scenario,onEvent,onComplete){
  const events=[
    {at:0,type:"state",text:"CLONING ephemeral namespace · warden-lab-7"},
    {at:1,type:"log",agent:"SYSTEM",text:"Cluster clone ready · snapshot sha256:7fa2…c91e"},
    {at:2,type:"state",text:"RED + BLUE agents initialized · deterministic seed 0x7A31"},
    {at:3,type:"gate",index:0,state:"active"},
    {at:4,type:"red",text:`T1611 probe · ${scenario.payload}`},
    {at:7,type:"clash"},
    {at:8,type:"blue",text:`Iteration 1 · drafting patch for ${scenario.resource}`},
    {at:10,type:"patch",text:"privileged: true  →  privileged: false\nallowPrivilegeEscalation: true  →  false"},
    {at:12,type:"gate",index:0,state:"fail",text:"Re-attack still succeeds · patch rejected"},
    {at:14,type:"log",agent:"JUDGE",text:"RE-ATTACK GATE · FAIL · pod can still reach host namespace"},
    {at:16,type:"blue",text:"Iteration 2 · dropping ALL capabilities · readOnlyRootFilesystem: true"},
    {at:18,type:"patch",text:"capabilities:\n  drop: [ALL]\nrunAsNonRoot: true\nreadOnlyRootFilesystem: true"},
    {at:20,type:"gate",index:0,state:"pass",text:"Re-attack blocked · privilege boundary holds"},
    {at:22,type:"gate",index:1,state:"pass",text:"Historical payload corpus · 17/17 blocked"},
    {at:24,type:"gate",index:2,state:"active"},
    {at:25,type:"log",agent:"JUDGE",text:"APP HEALTH GATE · probing /healthz and readiness"},
    {at:27,type:"gate",index:2,state:"pass",text:"Application healthy · readiness 200 · p95 42ms"},
    {at:28,type:"gate",index:3,state:"active"},
    {at:29,type:"gate",index:3,state:"pass",text:"Variant probes blocked · 12/12"},
    {at:30,type:"complete",text:"VERIFIED SECURE · 4 ordered judge gates passed"}
  ];
  let start=Date.now(),handles=[];
  events.forEach(e=>handles.push(setTimeout(()=>onEvent(e),e.at*1000)));
  handles.push(setTimeout(()=>onComplete(makeEpisode(scenario)),30000));
  return {cancel(){handles.forEach(clearTimeout)},startedAt:start};
}
