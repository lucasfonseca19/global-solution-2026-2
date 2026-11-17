import type {Categoria, RegistroPesagem, Servico} from './types';
const categories:Categoria[]=['SOBRA_DESCARTADA','RESTO_PRATO'];
/** Compatibilidade dos exemplos: cada categoria antiga representa uma contribuição. */
export function individualRecords(service:Servico):RegistroPesagem[]{
 return service.registros??categories.flatMap(categoria=>{
  const peso=service.pesagens[categoria];
  return peso?[{...peso,categoria,id:`anterior-${service.id}-${categoria}`}]:[];
 });
}
/** A projeção alimenta as telas existentes; identidade e tara individuais ficam nos registros. */
export function withRecords(service:Servico,registros:RegistroPesagem[]):Servico{
 const sum=(values:number[])=>Math.round(values.reduce((a,b)=>a+b,0)*1e6)/1e6;
 const pesagens={...service.pesagens};
 for(const categoria of categories){
  const rows=registros.filter(r=>r.categoria===categoria);
  pesagens[categoria]=rows.length?{...rows[0],pesoLiquidoKg:sum(rows.map(r=>r.pesoLiquidoKg)),pesoBrutoKg:sum(rows.map(r=>r.pesoBrutoKg)),taraKg:sum(rows.map(r=>r.taraKg))}:null;
 }
 return {...service,registros,pesagens,totalKg:sum(registros.map(r=>r.pesoLiquidoKg))};
}
