import { exemplos } from '../data/fixtures';
import type { Servico } from '../data/types';
import { localDay, mealKey, shiftDay } from './historyModel';
/** Exemplos adicionais somente da prévia em memória. Nunca representam sensores reais. */
export function historyExamples(today=localDay()):Servico[]{
 const rows:Servico[]=JSON.parse(JSON.stringify(exemplos));
 const meals=['Almoço','Lanche da tarde','Jantar'];
 for(let ago=60;ago>=1;ago--){
  const date=shiftDay(today,-ago);
  if(ago===4||ago===12)continue; // Lacunas reais do conjunto demonstrativo.
  meals.forEach((meal,index)=>{
   if(rows.some(s=>s.data===date&&mealKey(s.tipoRefeicao)===mealKey(meal)))return;
   const total=Math.round((index===0?3+ago*.055+(ago%3)*.12:index===1?1.5+(ago%5)*.03:5-ago*.035+(ago%3)*.08)*100)/100;
   const sobra=Math.round(total*.6*100)/100,resto=Math.round((total-sobra)*100)/100;
   rows.push({id:1000+ago*3+index,data:date,tipoRefeicao:meal,status:'COMPLETO',totalKg:total,pesagens:{SOBRA_DESCARTADA:{lixeiraId:1,codigoRfid:'RFID-SIM-001',taraKg:1,pesoBrutoKg:sobra+1,pesoLiquidoKg:sobra},RESTO_PRATO:{lixeiraId:2,codigoRfid:'RFID-SIM-002',taraKg:1.5,pesoBrutoKg:resto+1.5,pesoLiquidoKg:resto}}});
  });
 }
 return rows;
}
