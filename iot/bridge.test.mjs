import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startBridge} from './bridge.mjs';
test('ponte mantém somente leituras explícitas, cursor não repete e ignora eventos anteriores',async()=>{
 const bridge=await startBridge({port:0});const base=bridge.url;
 try{
  let r=await fetch(base+'/events').then(r=>r.json());assert.deepEqual(r.events,[]);assert.equal(r.cursor,0);
  const snapshot=r;
  const emit=async scenario=>fetch(base+'/readings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario})});
  assert.equal((await emit('sobra')).status,201);
  assert.deepEqual((await fetch(base+'/events').then(r=>r.json())).events,[]);
  r=await fetch(base+`/events?after=0&instance=${snapshot.instance}`).then(r=>r.json());assert.equal(r.events.length,1);assert.deepEqual(r.events[0].reading,{codigoRfid:'RFID-SIM-001',pesoBrutoKg:4});
  assert.equal((await fetch(base+`/events?after=${r.cursor}&instance=${r.instance}`).then(r=>r.json())).events.length,0);
  const invalid=await emit('desconhecido');assert.equal(invalid.status,201); // Validação de domínio pertence ao app consumidor.
  assert.equal((await emit('toString')).status,400);
  assert.equal((await fetch(base+'/events?after=0&instance=antiga').then(r=>r.json())).events.length,0);
 }finally{await bridge.close();}
});
test('painel separado, corpo inválido e origem externa',async()=>{
 const bridge=await startBridge({port:0});try{
  assert.match(await fetch(bridge.url).then(r=>r.text()),/Simulador de RFID e balança/);
  assert.equal((await fetch(bridge.url+'/readings',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
  assert.equal((await fetch(bridge.url+'/events',{headers:{Origin:'https://example.com'}})).status,403);
  assert.equal((await fetch(bridge.url+'/events',{headers:{Origin:'http://localhost:8094'}})).headers.get('access-control-allow-origin'),'http://localhost:8094');
 }finally{await bridge.close();}
});
