import {DataError} from './types';
export const SCHOOL_TIME_ZONE='America/Sao_Paulo';
const calendar=new Intl.DateTimeFormat('en-CA',{timeZone:SCHOOL_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'});
const clock=new Intl.DateTimeFormat('en-GB',{timeZone:SCHOOL_TIME_ZONE,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
/** Nome preservado para os clientes existentes; o calendário é sempre o da escola. */
export const localServiceDay=(now=new Date())=>calendar.format(now);
/** Checagem leve com atualização precisa na virada; não depende da meia-noite do aparelho. */
export function serviceDayCheckDelay(now=new Date()){
 const [hour,minute,second]=clock.format(now).split(':').map(Number);
 return Math.min(60000,((24-hour)*3600-minute*60-second)*1000-now.getMilliseconds()+50);
}
export const isCurrentServiceDay=(date:string,now=new Date())=>date===localServiceDay(now);
export const READ_ONLY_DAY='Pesagens e alterações são permitidas somente no dia atual. Este registro está disponível apenas para consulta.';
export function requireCurrentServiceDay(date:string){if(!isCurrentServiceDay(date))throw new DataError('DIA_ENCERRADO',READ_ONLY_DAY);}
