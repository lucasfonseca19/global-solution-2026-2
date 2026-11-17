import type {Leitura} from '../data/types';
export type ScaleConnection='connecting'|'connected'|'offline';
type Packet={instance:string;cursor:number;events:{id:number;reading:Leitura}[]};
const INTERVAL=400,TIMEOUT=2500;
function packet(value:unknown):Packet{
 const data=value as Packet;
 if(!data||typeof data.instance!=='string'||!Number.isSafeInteger(data.cursor)||data.cursor<0||!Array.isArray(data.events)||data.events.some(e=>!e||!Number.isSafeInteger(e.id)||e.id<1||e.id>data.cursor||typeof e.reading?.codigoRfid!=='string'||!Number.isFinite(e.reading.pesoBrutoKg)))throw new Error('Leitura inválida.');
 return data;
}
/** Cada assinatura estabelece primeiro um cursor: entrar/retomar nunca reproduz o peso anterior. */
export function connectScale({url,onReading,onStatus,fetcher=fetch}:{url:string;onReading:(reading:Leitura)=>void;onStatus:(status:ScaleConnection)=>void;fetcher?:typeof fetch}){
 let active=true,cursor:number|undefined,instance:string|undefined;
 let timer:ReturnType<typeof setTimeout>,request:AbortController|undefined;
 onStatus('connecting');
 async function poll(){
  request=new AbortController();const timeout=setTimeout(()=>request?.abort(),TIMEOUT);
  try{
   const suffix=cursor===undefined?'':`?after=${cursor}&instance=${encodeURIComponent(instance!)}`;
   const response=await fetcher(`${url.replace(/\/$/,'')}/events${suffix}`,{signal:request.signal});
   if(!response.ok)throw new Error('Balança indisponível.');
   const next=packet(await response.json());if(!active)return;
   const fresh=cursor===undefined||instance!==next.instance;
   const previous=cursor??next.cursor;instance=next.instance;cursor=next.cursor;
   onStatus('connected');
   if(!fresh)for(const e of next.events.filter(e=>e.id>previous).sort((a,b)=>a.id-b.id)){
    if(!active)return;onReading(e.reading);
   }
  }catch{if(active){cursor=undefined;instance=undefined;onStatus('offline');}}
  finally{clearTimeout(timeout);if(active)timer=setTimeout(poll,INTERVAL);}
 }
 void poll();
 return ()=>{active=false;clearTimeout(timer);request?.abort();};
}
