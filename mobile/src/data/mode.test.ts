import {expect,test,vi} from 'vitest';
import {openAppMode} from './mode';
import {DEMO_STORAGE_KEY} from './showcase';
import {localServiceDay} from './serviceDay';
test('demonstração usa sessão/dados locais; retorno à API exige novo login e preserva ambos',async()=>{
 const values=new Map([['merenda.servicos.v1','legado']]);
 const storage={getItem:async(k:string)=>values.get(k)??null,setItem:async(k:string,v:string)=>{values.set(k,v);}};
 const fetcher=vi.fn().mockResolvedValue(new Response('[]'));
 const config={url:'http://api',fetcher};
 const demo=await openAppMode(storage,'demo',config);
 expect(demo.session?.token).toBe('TOKEN_DEMONSTRATIVO');expect(fetcher).not.toHaveBeenCalled();
 await demo.api.confirmarPesagem(demo.session!.token,{data:localServiceDay(),tipoRefeicao:'Almoço',cicloId:'modo-1',leitura:{codigoRfid:'RFID-SIM-001',pesoBrutoKg:4}});
 const saved=values.get(DEMO_STORAGE_KEY);
 const real=await openAppMode(storage,'api',config);expect(real.session).toBeUndefined();
 expect(await real.api.listar('jwt-real')).toEqual([]);expect(values.get(DEMO_STORAGE_KEY)).toBe(saved);expect(values.get('merenda.servicos.v1')).toBe('legado');
 const resumed=await openAppMode(storage,'demo',config);expect((await resumed.api.listar(resumed.session!.token)).find(s=>s.data===localServiceDay()&&s.tipoRefeicao==='Almoço')!.totalKg).toBe(6);
 expect(fetcher).toHaveBeenCalledTimes(1);
});
