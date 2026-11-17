import {expect,test} from 'vitest';
import {createShowcaseData,DEMO_STORAGE_KEY} from './showcase';
import {APP_STORAGE_KEY} from './approvedData';
import {localServiceDay} from './serviceDay';
test('demonstração inicia com histórico e serviço atual, persiste sem alterar dados anteriores',async()=>{
 const values=new Map([[APP_STORAGE_KEY,'dados anteriores'],['merenda.servicos.v1','legado']]);
 const storage={getItem:async(k:string)=>values.get(k)??null,setItem:async(k:string,v:string)=>{values.set(k,v);}};
 let api=createShowcaseData(storage);let {token}=await api.login({login:'demo',senha:'merenda-demo'});
 const rows=await api.listar(token),today=localServiceDay();
 expect(rows.filter(s=>s.data<today&&s.status==='COMPLETO')).toHaveLength(6);
 const current=rows.find(s=>s.data===today&&s.tipoRefeicao==='Almoço')!;expect(current.totalKg).toBe(3);expect(current.status).toBe('PENDENTE');expect(current.registros).toHaveLength(1);
 await api.confirmarPesagem(token,{data:today,tipoRefeicao:'Almoço',cicloId:'teste-local',leitura:{codigoRfid:'RFID-SIM-002',pesoBrutoKg:3.5}});
 api=createShowcaseData(storage);({token}=await api.login({login:'demo',senha:'merenda-demo'}));expect((await api.detalhar(token,current.id)).totalKg).toBe(5);
 expect(values.has(DEMO_STORAGE_KEY)).toBe(true);expect(values.get(APP_STORAGE_KEY)).toBe('dados anteriores');expect(values.get('merenda.servicos.v1')).toBe('legado');
});
