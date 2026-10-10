const API_ROOT="";
async function request(path,options={}){
  let response;
  try{response=await fetch(`${API_ROOT}${path}`,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}})}
  catch(error){throw new Error(`Endpoint unavailable: ${path}. No mock fallback was used. ${error.message}`)}
  if(!response.ok)throw new Error(`Endpoint ${path} returned ${response.status} ${response.statusText}. No mock fallback was used.`);
  return response;
}
export async function getDashboardMetrics(){const r=await request("/api/dashboard/metrics");return r.json()}
export async function startRound(scenario){const r=await request("/api/rounds/start",{method:"POST",body:JSON.stringify({scenario})});return r.json()}
export async function streamRound(onMessage,onError,signal){
  try{
    const response=await request("/api/rounds/stream",{signal});
    if(!response.body)throw new Error("Streaming response unavailable.");
    const reader=response.body.getReader(),decoder=new TextDecoder();
    let buffer="";
    while(true){const {done,value}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const chunks=buffer.split("\n\n");buffer=chunks.pop()||"";for(const chunk of chunks){const line=chunk.split("\n").find(x=>x.startsWith("data:"));if(line){try{onMessage(JSON.parse(line.slice(5).trim()))}catch{onMessage({type:"message",text:line.slice(5).trim()})}}}}
  }catch(error){if(!signal?.aborted)onError?.(error)}
}
