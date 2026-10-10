let attackChart,distributionChart;
const defaults={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:"#101923",borderColor:"#344752",borderWidth:1,titleColor:"#dce5eb",bodyColor:"#9aabb5",padding:10}},scales:{x:{grid:{color:"#1b2933"},ticks:{color:"#71818d",font:{family:"JetBrains Mono",size:9}},border:{display:false}},y:{grid:{color:"#1b2933"},ticks:{color:"#71818d",font:{family:"JetBrains Mono",size:9}},border:{display:false}}}};
export function renderCharts(){
  if(!window.Chart)return;
  attackChart?.destroy();distributionChart?.destroy();
  const a=document.querySelector("#attackChart"),d=document.querySelector("#distributionChart");
  if(a)attackChart=new Chart(a,{type:"line",data:{labels:["-12h","-10h","-8h","-6h","-4h","-2h","NOW"],datasets:[{label:"Attack success",data:[71,64,62,49,44,31,22],borderColor:"#EF4444",backgroundColor:"rgba(239,68,68,.12)",fill:true,tension:.35,pointRadius:2,pointHoverRadius:5,borderWidth:2},{label:"Blocked",data:[29,36,38,51,56,69,78],borderColor:"#06B6D4",backgroundColor:"rgba(6,182,212,.06)",fill:false,tension:.35,pointRadius:2,borderWidth:1.5}]},options:{...defaults,scales:{...defaults.scales,y:{...defaults.scales.y,min:0,max:100,ticks:{...defaults.scales.y.ticks,callback:v=>`${v}%`}}}}});
  if(d)distributionChart=new Chart(d,{type:"doughnut",data:{labels:["Red exploits","Blue patches","Judge rejections"],datasets:[{data:[34,49,17],backgroundColor:["#EF4444","#06B6D4","#F59E0B"],borderColor:"#101923",borderWidth:4,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:"70%",plugins:{legend:{position:"bottom",labels:{color:"#91a1ac",padding:14,boxWidth:8,boxHeight:8,font:{family:"JetBrains Mono",size:9}}},tooltip:defaults.plugins.tooltip}}});
}
