import {createAppData} from './appData';
import type {ServiceStorage} from './demo';
import type {AppDataAccess,Sessao} from './types';
export type DataMode='api'|'demo';
export type ModeSession={mode:DataMode;api:AppDataAccess;session?:Sessao};
/** Trocar modo cria outra sessão, sem transferir credenciais ou registros. */
export async function openAppMode(storage:ServiceStorage,mode:DataMode,config:{url?:string;fetcher?:typeof fetch}={}):Promise<ModeSession>{
 const api=createAppData(storage,{...config,mode,url:config.url??process.env.EXPO_PUBLIC_API_URL});
 const session=mode==='demo'?await api.login({login:'demo',senha:'merenda-demo'}):undefined;
 return {mode,api,session};
}
