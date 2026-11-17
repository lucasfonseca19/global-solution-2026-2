import {beforeEach,afterEach,vi} from 'vitest';
beforeEach(()=>{vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date(2026,10,15,12));});
afterEach(()=>vi.useRealTimers());
import { test, expect } from 'vitest';
import { createDemoData } from './demo';
const sobra = { codigoRfid: 'RFID-SIM-001', pesoBrutoKg: 4 };
const resto = { codigoRfid: 'RFID-SIM-002', pesoBrutoKg: 3.5 };
const body = { data: '2026-11-15', tipoRefeicao: 'Almoço', pesagens: [sobra] };
async function setup() { const api = createDemoData([]); const { token } = await api.login({login:'demo',senha:'merenda-demo'}); return {api,token}; }
test('prévia identifica e calcula sem criar serviço', async () => {
 const {api,token}=await setup();
 expect(await api.avaliar(token,sobra)).toMatchObject({categoria:'SOBRA_DESCARTADA',pesoLiquidoKg:3});
 expect(await api.listar(token)).toEqual([]);
});
test('confirmar cria pendente, PUT completo conclui e correção substitui preservando sobra', async () => {
 const {api,token}=await setup();
 const s=await api.criar(token,body);
 expect(s).toMatchObject({status:'PENDENTE',totalKg:3,pesagens:{RESTO_PRATO:null}});
 expect(await api.atualizar(token,s.id,{...body,pesagens:[sobra,resto]})).toMatchObject({status:'COMPLETO',totalKg:5});
 expect(await api.atualizar(token,s.id,{...body,pesagens:[sobra,{...resto,pesoBrutoKg:4}]})).toMatchObject({totalKg:5.5,pesagens:{SOBRA_DESCARTADA:{pesoLiquidoKg:3},RESTO_PRATO:{pesoLiquidoKg:2.5}}});
 await expect(api.criar(token,body)).rejects.toMatchObject({codigo:'SERVICO_JA_EXISTE'});
 expect(await api.listar(token)).toHaveLength(1);
});
test('salvar revalida e rejeita atomicamente RFID, peso, duplicação e data inválida', async () => {
 const {api,token}=await setup(); const s=await api.criar(token,body);
 for(const leitura of [{codigoRfid:'RFID-SIM-999',pesoBrutoKg:4},{...resto,pesoBrutoKg:0.5},{...resto,pesoBrutoKg:NaN}]) {
 await expect(api.avaliar(token,leitura)).rejects.toBeDefined();
 await expect(api.atualizar(token,s.id,{...body,pesagens:[sobra,leitura]})).rejects.toBeDefined();
 expect(await api.detalhar(token,s.id)).toEqual(s);
 }
 await expect(api.criar(token,{...body,data:'2026-02-30'})).rejects.toMatchObject({codigo:'DADOS_INVALIDOS'});
 await expect(api.atualizar(token,s.id,{...body,pesagens:[sobra,sobra]})).rejects.toMatchObject({codigo:'DADOS_INVALIDOS'});
 await expect(api.criar('',body)).rejects.toMatchObject({codigo:'NAO_AUTORIZADO'});
});
test('zero confirmado completa serviço e PUT omisso deixa categoria pendente', async () => {
 const {api,token}=await setup(); const s=await api.criar(token,{...body,pesagens:[sobra,{...resto,pesoBrutoKg:1.5}]});
 expect(s).toMatchObject({status:'COMPLETO',totalKg:3,pesagens:{RESTO_PRATO:{pesoLiquidoKg:0}}});
 expect(await api.atualizar(token,s.id,body)).toMatchObject({status:'PENDENTE',pesagens:{RESTO_PRATO:null}});
});
