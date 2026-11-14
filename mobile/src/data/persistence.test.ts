import {test,expect} from 'vitest';
import {createDemoData} from './demo';
const credentials={login:'demo',senha:'merenda-demo'};
const input={data:'2026-11-15',tipoRefeicao:'Almoço',pesagens:[{codigoRfid:'RFID-SIM-001',pesoBrutoKg:4}]};
function storage() {
 let value: string|null=null;
 return {getItem:async()=>value,setItem:async(_key:string,v:string)=>{value=v;}};
}
test('reabrir carrega serviços existentes antes de exemplos',async()=>{
 const disk=storage();
 const a=createDemoData([],disk); const {token}=await a.login(credentials);
 const s=await a.criar(token,input);
 const b=createDemoData(undefined,disk); const session=await b.login(credentials);
 expect(await b.listar(session.token)).toEqual([s]);
});
test('excluir remove somente alvo e pesagens e persiste inclusive lista vazia',async()=>{
 const disk=storage(); const a=createDemoData([],disk); const {token}=await a.login(credentials);
 const s=await a.criar(token,input);
 const other=await a.criar(token,{...input,data:'2026-11-16'});
 await a.excluir(token,s.id);
 await expect(a.detalhar(token,s.id)).rejects.toMatchObject({codigo:'SERVICO_NAO_ENCONTRADO'});
 expect(await a.listar(token)).toEqual([other]);
 await a.excluir(token,other.id);
 const b=createDemoData(undefined,disk); const session=await b.login(credentials);
 expect(await b.listar(session.token)).toEqual([]);
});
test('restaurar substitui alterações pelos exemplos e sobrevive a reabrir',async()=>{
 const disk=storage(); const a=createDemoData([],disk); const {token}=await a.login(credentials);
 await a.criar(token,input); await a.restaurarExemplos(token);
 const b=createDemoData([],disk); const session=await b.login(credentials);
 expect((await b.listar(session.token)).map(s=>s.id)).toEqual([103,102,101]);
});
test('falhas de escrita não publicam criação, correção, exclusão ou restauração; fila se recupera',async()=>{
 const disk=storage(); const original=disk.setItem;
 const a=createDemoData([],disk); const {token}=await a.login(credentials);
 const s=await a.criar(token,input);
 disk.setItem=async()=>{throw new Error('Armazenamento indisponível');};
 for(const operation of [
 ()=>a.criar(token,{...input,data:'2026-11-16'}),
 ()=>a.atualizar(token,s.id,{...input,pesagens:[{codigoRfid:'RFID-SIM-001',pesoBrutoKg:8}]}),
 ()=>a.excluir(token,s.id),()=>a.restaurarExemplos(token)
 ]) {
  await expect(operation()).rejects.toThrow('Armazenamento indisponível');
  expect(await a.listar(token)).toEqual([s]);
 }
 disk.setItem=original;
 await a.excluir(token,s.id);
 expect(await a.listar(token)).toEqual([]);
});
test('escritas simultâneas aguardam disco sem perder serviços',async()=>{
 const disk=storage(); const a=createDemoData([],disk); const {token}=await a.login(credentials);
 await a.listar(token);
 let release!:()=>void;
 disk.setItem=async()=>new Promise<void>(resolve=>{release=resolve;});
 let done=false;
 const first=a.criar(token,input).then(s=>{done=true;return s;});
 await new Promise(resolve=>setTimeout(resolve,0));
 expect(done).toBe(false);
 const second=a.criar(token,{...input,data:'2026-11-16'});
 release(); await first;
 await new Promise(resolve=>setTimeout(resolve,0));
 release(); await second;
 expect(await a.listar(token)).toHaveLength(2);
});
test('falha de leitura não substitui dados existentes por exemplos e permite tentar novamente',async()=>{
 const disk=storage(); const get=disk.getItem; disk.getItem=async()=>{throw new Error('Leitura falhou');};
 const a=createDemoData(undefined,disk); const {token}=await a.login(credentials);
 await expect(a.listar(token)).rejects.toThrow('Leitura falhou');
 disk.getItem=get;
 expect(await a.listar(token)).toHaveLength(3);
});
