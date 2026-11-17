import {createDemoData,type ServiceStorage} from './demo';
import type {RegistroPesagem,Servico} from './types';
import {localServiceDay} from './serviceDay';
import {withRecords} from './weighing';
export const DEMO_STORAGE_KEY='merenda.servicos.demonstracao.v1';
/** Somente a demonstração recebe exemplos. Nunca lê/escreve a chave anterior ou a API. */
export function createShowcaseData(storage:ServiceStorage){
 const today=localServiceDay();
 function record(id:number,index:number,category:'SOBRA_DESCARTADA'|'RESTO_PRATO',net:number):RegistroPesagem{
  const sobra=category==='SOBRA_DESCARTADA',tara=sobra?1:1.5;
  return {id:`demo-${id}-${index}`,categoria:category,lixeiraId:sobra?1:2,codigoRfid:sobra?'RFID-SIM-001':'RFID-SIM-002',taraKg:tara,pesoBrutoKg:net+tara,pesoLiquidoKg:net};
 }
 function service(id:number,data:string,tipoRefeicao:string,status:Servico['status'],sobra:number,restos?:number):Servico{
  const records=[record(id,1,'SOBRA_DESCARTADA',sobra),...(restos===undefined?[]:[record(id,2,'RESTO_PRATO',restos)])];
  return withRecords({id,data,tipoRefeicao,status,totalKg:0,pesagens:{SOBRA_DESCARTADA:null,RESTO_PRATO:null},ciclosConfirmados:[]},records);
 }
 const previous=[6.4,5.8,7.2,4.6,5.2,4.2].map((total,index)=>{
  const date=new Date(today+'T12:00:00Z');date.setUTCDate(date.getUTCDate()-(6-index));
  const sobra=Math.round(total*0.6*1000)/1000,restos=Math.round((total-sobra)*1000)/1000;
  return service(2000+index,date.toISOString().slice(0,10),'Almoço','COMPLETO',sobra,restos);
 });
 const seed=[...previous,service(2010,today,'Almoço','PENDENTE',3),service(2011,today,'Jantar','COMPLETO',2,1)];
 return createDemoData(seed,{getItem:()=>storage.getItem(DEMO_STORAGE_KEY),setItem:(_key,value)=>storage.setItem(DEMO_STORAGE_KEY,value)});
}
