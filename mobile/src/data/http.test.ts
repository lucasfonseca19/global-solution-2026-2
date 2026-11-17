import {afterEach,expect,test,vi} from 'vitest';
import {createHttpData} from './http';
import {createAppData} from './appData';

const record={id:'42',categoria:'SOBRA_DESCARTADA',lixeiraId:1,codigoRfid:'RFID-SIM-001',taraKg:1,pesoBrutoKg:4,pesoLiquidoKg:3};
const service={id:7,data:'2026-11-17',tipoRefeicao:'Almoço',status:'PENDENTE',totalKg:3,registros:[record],pesagens:{SOBRA_DESCARTADA:record,RESTO_PRATO:null}};
const entry={data:service.data,tipoRefeicao:'Almoço',cicloId:'retry-1',leitura:{codigoRfid:'RFID-SIM-001',pesoBrutoKg:4}};
const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
afterEach(()=>vi.useRealTimers());

test('login envia credenciais à API; listar usa Bearer e preserva IDs individuais',async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce(json({token:'jwt',usuario:{id:1,nome:'Operador'}})).mockResolvedValueOnce(json([service]));
 const api=createHttpData('http://api:8080/',{fetcher});
 expect(await api.login({login:'operador',senha:'merenda123'})).toMatchObject({token:'jwt'});
 expect(await api.listar('jwt')).toEqual([service]);
 expect(fetcher.mock.calls[0][0]).toBe('http://api:8080/auth/login');
 expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({login:'operador',senha:'merenda123'});
 expect(fetcher.mock.calls[1][1].headers).toMatchObject({Authorization:'Bearer jwt'});
});

test('prévia não confirma; confirmação conserva ciclo e payload após resposta perdida',async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce(json(record)).mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(json(service));
 const api=createHttpData('http://api',{fetcher});
 await api.avaliar('jwt',entry.leitura);
 await expect(api.confirmarPesagem('jwt',entry)).rejects.toMatchObject({codigo:'API_INDISPONIVEL'});
 expect(await api.confirmarPesagem('jwt',entry)).toEqual(service);
 expect(fetcher.mock.calls.map(c=>c[0])).toEqual(['http://api/leituras/avaliar','http://api/pesagens','http://api/pesagens']);
 expect(fetcher.mock.calls[1][1].body).toBe(fetcher.mock.calls[2][1].body);
});

test('correção envia ID e conclusão usa PUT explícito; exclusão aceita 204 sem JSON',async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce(json(service)).mockResolvedValueOnce(json({...service,status:'COMPLETO'})).mockResolvedValueOnce(new Response(null,{status:204}));
 const api=createHttpData('http://api',{fetcher});
 await api.confirmarPesagem('jwt',{...entry,substituirId:'42'});
 await api.concluirServico('jwt',7);
 await api.excluir('jwt',7);
 expect(JSON.parse(fetcher.mock.calls[0][1].body).substituirId).toBe('42');
 expect(fetcher.mock.calls[1][0]).toBe('http://api/servicos/7/conclusao');
 expect(fetcher.mock.calls[1][1].method).toBe('PUT');
 expect(fetcher.mock.calls[2][1].method).toBe('DELETE');
});

test.each([400,401,409,429,500])('HTTP %s propaga erro sem retornar dados locais',async status=>{
 const api=createHttpData('http://api',{fetcher:vi.fn().mockResolvedValue(json({codigo:'FALHA',mensagem:'Operação rejeitada.'},status))});
 await expect(api.listar('jwt')).rejects.toMatchObject({codigo:'FALHA',message:'Operação rejeitada.'});
});

test('resposta HTML e serviço sem registros são rejeitados como protocolo inválido',async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce(new Response('<html>erro</html>')).mockResolvedValueOnce(json([{...service,registros:undefined}]));
 const api=createHttpData('http://api',{fetcher});
 await expect(api.listar('jwt')).rejects.toMatchObject({codigo:'RESPOSTA_INVALIDA'});
 await expect(api.listar('jwt')).rejects.toMatchObject({codigo:'RESPOSTA_INVALIDA'});
});

test('timeout encerra requisição pendente sem sucesso ou fallback',async()=>{
 vi.useFakeTimers();
 const fetcher=vi.fn((_url,options)=>new Promise<Response>((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('abort','AbortError')))));
 const api=createHttpData('http://api',{fetcher:fetcher as typeof fetch,timeoutMs:50});
 const result=expect(api.listar('jwt')).rejects.toMatchObject({codigo:'API_INDISPONIVEL'});
 await vi.advanceTimersByTimeAsync(51);await result;
});

test('modo integrado não lê AsyncStorage, demo é explícito e configuração inválida falha',async()=>{
 const storage={getItem:vi.fn(),setItem:vi.fn()};
 const api=createAppData(storage,{mode:'api',url:'http://api',fetcher:vi.fn().mockResolvedValue(json([]))});
 expect(await api.listar('jwt')).toEqual([]);expect(storage.getItem).not.toHaveBeenCalled();expect(storage.setItem).not.toHaveBeenCalled();
 expect(()=>createAppData(storage,{mode:'typo'})).toThrow(/Modo de dados inválido/);
 expect(()=>createHttpData('')).toThrow(/URL/);
});
