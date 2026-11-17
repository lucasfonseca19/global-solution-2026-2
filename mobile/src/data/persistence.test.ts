import {beforeEach,afterEach,vi} from 'vitest';
beforeEach(()=>{vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date(2026,10,15,12));});
afterEach(()=>vi.useRealTimers());
import {test,expect} from 'vitest';
import {createDemoData} from './demo';
const credentials={login:'demo',senha:'merenda-demo'};
const data='2026-11-15';
const sobra={codigoRfid:'RFID-SIM-001',pesoBrutoKg:4};
const restos={codigoRfid:'RFID-SIM-002',pesoBrutoKg:3.5};
const input=(cicloId:string,tipoRefeicao='Almoço',leitura=sobra)=>({data,tipoRefeicao,cicloId,leitura});
function storage() {
 let value: string|null=null;
 return {getItem:async()=>value,setItem:async(_key:string,v:string)=>{value=v;}};
}
test('reabrir carrega serviços existentes antes de exemplos',async()=>{
 const disk=storage();
 const a=createDemoData([],disk); const {token}=await a.login(credentials);
 const s=await a.confirmarPesagem(token,input('a'));
 const b=createDemoData(undefined,disk); const session=await b.login(credentials);
 expect(await b.listar(session.token)).toEqual([s]);
});
test('excluir remove somente alvo e pesagens e persiste inclusive lista vazia',async()=>{
 const disk=storage(); const a=createDemoData([],disk); const {token}=await a.login(credentials);
 const s=await a.confirmarPesagem(token,input('a'));
 const other=await a.confirmarPesagem(token,input('b','Jantar',restos));
 await a.excluir(token,s.id);
 await expect(a.detalhar(token,s.id)).rejects.toMatchObject({codigo:'SERVICO_NAO_ENCONTRADO'});
 expect(await a.listar(token)).toEqual([other]);
 await a.excluir(token,other.id);
 const b=createDemoData(undefined,disk); const session=await b.login(credentials);
 expect(await b.listar(session.token)).toEqual([]);
});
test('falhas de escrita não publicam confirmação ou exclusão; fila se recupera',async()=>{
 const disk=storage(); const original=disk.setItem;
 const a=createDemoData([],disk); const {token}=await a.login(credentials);
 const s=await a.confirmarPesagem(token,input('a'));
 disk.setItem=async()=>{throw new Error('Armazenamento indisponível');};
 for(const operation of [
  ()=>a.confirmarPesagem(token,input('b','Jantar')),
  ()=>a.excluir(token,s.id)
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
 const first=a.confirmarPesagem(token,input('a')).then(s=>{done=true;return s;});
 await new Promise(resolve=>setTimeout(resolve,0));
 expect(done).toBe(false);
 const second=a.confirmarPesagem(token,input('b','Jantar',restos));
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
