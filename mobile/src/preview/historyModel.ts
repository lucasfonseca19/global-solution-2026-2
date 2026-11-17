import type { Servico } from '../data/types';
const DAY=86400000;
export {localServiceDay as localDay} from '../data/serviceDay';
export const shiftDay=(iso:string,days:number)=>new Date(Date.parse(iso+'T12:00:00Z')+days*DAY).toISOString().slice(0,10);
export const mealKey=(value:string)=>value.trim().toLocaleLowerCase('pt-BR');
export type Change={direction:'down'|'up'|'flat';unit:'percent'|'kg';value:number};
export function historyPeriod(services:Servico[],meal:string,days:7|30,end:string) {
 const start=shiftDay(end,1-days),previousStart=shiftDay(start,-days);
 const sameMeal=services.filter(s=>mealKey(s.tipoRefeicao)===mealKey(meal));
 const rows=sameMeal.filter(s=>s.data>=start&&s.data<=end).sort((a,b)=>b.data.localeCompare(a.data)||b.id-a.id);
 const complete=rows.filter(s=>s.status==='COMPLETO');
 const previous=sameMeal.filter(s=>s.status==='COMPLETO'&&s.data>=previousStart&&s.data<start);
 const mean=(values:Servico[])=>values.length?values.reduce((sum,s)=>sum+s.totalKg,0)/values.length:null;
 const average=mean(complete),previousAverage=mean(previous);
 let change:Change|null=null;
 // Dois registros por janela evitam uma indicação de tendência baseada em um único serviço.
 if(complete.length>=2&&previous.length>=2&&average!==null&&previousAverage!==null){
  const delta=previousAverage===0?average:Math.round((average-previousAverage)/previousAverage*100);
  change={direction:delta===0?'flat':delta<0?'down':'up',unit:previousAverage===0&&average!==0?'kg':'percent',value:Math.abs(delta)};
 }
 const points=Array.from({length:days},(_,i)=>{const date=shiftDay(start,i);return {date,service:complete.find(s=>s.data===date)};});
 return {start,end,rows,complete,previous,average,previousAverage,change,points};
}
