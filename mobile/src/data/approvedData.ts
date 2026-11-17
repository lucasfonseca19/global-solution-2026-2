import {createDemoData,type ServiceStorage} from './demo';
export const APP_STORAGE_KEY='merenda.servicos.aprovado.v1';
/** Instalação vazia e chave própria: não importa nem apaga os exemplos/dados do cliente legado. */
export function createApprovedData(storage:ServiceStorage){
 return createDemoData([],{getItem:()=>storage.getItem(APP_STORAGE_KEY),setItem:(_key,value)=>storage.setItem(APP_STORAGE_KEY,value)});
}
