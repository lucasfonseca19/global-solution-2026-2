import {afterEach,beforeEach,expect,test,vi} from 'vitest';
import {createDemoData} from './demo';
import {exemplos} from './fixtures';
import {localServiceDay,serviceDayCheckDelay} from './serviceDay';
const credentials={login:'demo',senha:'merenda-demo'};
const sobra={codigoRfid:'RFID-SIM-001',pesoBrutoKg:4};
const today='2026-11-15';
const input=(cicloId:string,data=today,leitura=sobra,substituirId?:string)=>({data,tipoRefeicao:'Almoço',cicloId,leitura,substituirId});
beforeEach(()=>{vi.useFakeTimers();vi.setSystemTime(new Date(2026,10,15,12));});afterEach(()=>vi.useRealTimers());
async function setup(){const api=createDemoData();const {token}=await api.login(credentials);return {api,token};}
test('usa o calendário da escola, incluindo início e fim do dia',()=>{expect(localServiceDay(new Date('2026-11-15T00:00:00-03:00'))).toBe('2026-11-15');expect(localServiceDay(new Date('2026-11-15T23:59:59-03:00'))).toBe('2026-11-15');});
test('permite confirmar, corrigir e excluir no mesmo dia',async()=>{const {api,token}=await setup();let s=await api.confirmarPesagem(token,input('a'));const id=s.registros![0].id;s=await api.confirmarPesagem(token,input('b',today,{...sobra,pesoBrutoKg:5},id));expect(s.totalKg).toBe(4);await api.excluir(token,s.id);await expect(api.detalhar(token,s.id)).rejects.toMatchObject({codigo:'SERVICO_NAO_ENCONTRADO'});});
test('bloqueia confirmar no passado e futuro sem gravar',async()=>{const {api,token}=await setup();for(const data of ['2026-11-14','2026-11-16'])await expect(api.confirmarPesagem(token,input('a',data))).rejects.toMatchObject({codigo:'DIA_ENCERRADO'});expect(await api.listar(token)).toHaveLength(exemplos.length);});
test('bloqueia excluir serviço de outro dia, mesmo pendente',async()=>{const {api,token}=await setup();const before=await api.detalhar(token,102);await expect(api.excluir(token,102)).rejects.toMatchObject({codigo:'DIA_ENCERRADO'});expect(await api.detalhar(token,102)).toEqual(before);});
test('revalida o relógio ao confirmar ou excluir depois da meia-noite',async()=>{const {api,token}=await setup();const s=await api.confirmarPesagem(token,input('a'));vi.setSystemTime(new Date('2026-11-16T00:00:00-03:00'));await expect(api.confirmarPesagem(token,input('b'))).rejects.toMatchObject({codigo:'DIA_ENCERRADO'});await expect(api.excluir(token,s.id)).rejects.toMatchObject({codigo:'DIA_ENCERRADO'});expect(await api.detalhar(token,s.id)).toEqual(s);expect((await api.confirmarPesagem(token,input('c','2026-11-16'))).data).toBe('2026-11-16');});
test('dia da escola independe do fuso do dispositivo na meia-noite UTC',()=>{expect(localServiceDay(new Date('2026-11-18T01:00:00Z'))).toBe('2026-11-17');expect(localServiceDay(new Date('2026-11-18T03:00:00Z'))).toBe('2026-11-18');});
test('agenda virada da escola antes de 60 segundos e não a meia-noite do aparelho',()=>{expect(serviceDayCheckDelay(new Date('2026-11-18T02:59:59.500Z'))).toBe(550);expect(serviceDayCheckDelay(new Date('2026-11-18T00:00:00Z'))).toBe(60000);});
