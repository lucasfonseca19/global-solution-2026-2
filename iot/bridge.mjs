import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
import {cenarios} from './shared.ts';

/** Ponte local de sensores para demonstração. Não implementa a API acadêmica. */
export async function startBridge({port=8095,host='127.0.0.1',allowedOrigin}={}){
 const instance=randomUUID();let cursor=0;const events=[];
 const panel=await readFile(new URL('./simulator.html',import.meta.url),'utf8');
 const server=createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  const origin=req.headers.origin;
  const permitted=!origin||/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)||origin===allowedOrigin;
  if(!permitted){res.writeHead(403).end();return;}
  if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  const json=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'}).end(JSON.stringify(value));};
  if(req.method==='OPTIONS'){res.writeHead(204).end();return;}
  try{
   const url=new URL(req.url,'http://localhost');
   if(req.method==='GET'&&url.pathname==='/'){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(panel);return;
   }
   if(req.method==='GET'&&url.pathname==='/font.woff2'){
    const font=await readFile(new URL('../mobile/assets/fonts/AlloVariable.woff2',import.meta.url));
    res.writeHead(200,{'Content-Type':'font/woff2'}).end(font);return;
   }
   if(req.method==='GET'&&url.pathname==='/events'){
    const after=Number(url.searchParams.get('after'));
    const valid=url.searchParams.has('after')&&Number.isSafeInteger(after)&&after>=0&&url.searchParams.get('instance')===instance;
    json(200,{instance,cursor,events:valid?events.filter(e=>e.id>after):[]});return;
   }
   if(req.method==='POST'&&url.pathname==='/readings'){
    let body='';for await(const chunk of req){body+=chunk;if(body.length>2048){json(413,{message:'Envie somente um cenário.'});return;}}
    let input;try{input=JSON.parse(body);}catch{json(400,{message:'Envie um cenário válido.'});return;}
    if(!input||typeof input.scenario!=='string'||!Object.hasOwn(cenarios,input.scenario)){json(400,{message:'Cenário não encontrado.'});return;}
    const event={id:++cursor,reading:{...cenarios[input.scenario].leitura}};
    events.push(event);if(events.length>100)events.shift();
    json(201,{instance,...event});return;
   }
   json(404,{message:'Rota não encontrada.'});
  }catch{if(!res.headersSent)json(500,{message:'Não foi possível processar a leitura.'});else res.end();}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve);});
 return {url:`http://${host}:${server.address().port}`,close:()=>new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()))};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const bridge=await startBridge({port:Number(process.env.SIMULATOR_PORT??8095),host:process.env.SIMULATOR_HOST??'127.0.0.1',allowedOrigin:process.env.SIMULATOR_ALLOWED_ORIGIN});
 console.log(`Simulador de RFID e balança: ${bridge.url}`);
}
