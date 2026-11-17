import {DataError} from './types';
export const localServiceDay=(now=new Date())=>`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
export const isCurrentServiceDay=(date:string,now=new Date())=>date===localServiceDay(now);
export const READ_ONLY_DAY='Pesagens e alterações são permitidas somente no dia atual. Este registro está disponível apenas para consulta.';
export function requireCurrentServiceDay(date:string){if(!isCurrentServiceDay(date))throw new DataError('DIA_ENCERRADO',READ_ONLY_DAY);}
