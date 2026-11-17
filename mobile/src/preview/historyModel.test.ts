import { describe, expect, it } from 'vitest';
import type { Servico } from '../data/types';
import { historyPeriod } from './historyModel';
const row=(id:number,data:string,totalKg:number,status:Servico['status']='COMPLETO',tipoRefeicao='Almoço'):Servico=>({id,data,totalKg,status,tipoRefeicao,pesagens:{SOBRA_DESCARTADA:null,RESTO_PRATO:null}});
describe('Histórico por refeição e período',()=>{
 it('compara médias por serviço, exclui parciais e outras refeições e mantém lacunas',()=>{
  const m=historyPeriod([row(1,'2026-11-17',2),row(2,'2026-11-15',4),row(3,'2026-11-16',100,'PENDENTE'),row(4,'2026-11-14',100,'COMPLETO','Jantar'),row(5,'2026-11-10',4),row(6,'2026-11-04',8)],'Almoço',7,'2026-11-17');
  expect(m.average).toBe(3);expect(m.previousAverage).toBe(6);expect(m.change).toEqual({direction:'down',unit:'percent',value:50});expect(m.points[5].service).toBeUndefined();expect(m.rows).toHaveLength(3);
 });
 it('inclui zero confirmado sem tratar falta de informação como zero',()=>{
  const m=historyPeriod([row(1,'2026-11-17',0),row(2,'2026-11-15',4)],'Almoço',7,'2026-11-17');
  expect(m.average).toBe(2);expect(m.points.filter(p=>p.service)).toHaveLength(2);expect(m.change).toBeNull();
 });
 it('não divide por zero e representa aumento em kg quando a base era zero',()=>{
  const m=historyPeriod([row(1,'2026-11-17',2),row(2,'2026-11-16',2),row(3,'2026-11-10',0),row(4,'2026-11-09',0)],'Almoço',7,'2026-11-17');
  expect(m.change).toEqual({direction:'up',unit:'kg',value:2});
 });
 it('não inventa média ou tendência quando não há dados',()=>{
  const m=historyPeriod([],'Almoço',30,'2026-11-17');expect(m.average).toBeNull();expect(m.previousAverage).toBeNull();expect(m.change).toBeNull();expect(m.points).toHaveLength(30);
 });
 it('usa janelas contíguas de calendário, ignora futuros e aceita variação de caixa',()=>{
  const m=historyPeriod([row(1,'2026-11-11',2,'COMPLETO','almoço'),row(2,'2026-11-18',9),row(3,'2026-11-03',10)],'Almoço',7,'2026-11-17');expect(m.average).toBe(2);expect(m.previousAverage).toBeNull();expect(m.rows).toHaveLength(1);
 });
 it('compara médias apesar de números diferentes de serviços e identifica estabilidade',()=>{
  const m=historyPeriod([row(1,'2026-11-17',2),row(2,'2026-11-16',4),row(3,'2026-11-10',3),row(4,'2026-11-09',3),row(5,'2026-11-08',3)],'Almoço',7,'2026-11-17');expect(m.change).toEqual({direction:'flat',unit:'percent',value:0});
 });
});
