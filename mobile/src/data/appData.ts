import {createApprovedData} from './approvedData';
import {createHttpData} from './http';
import {DataError,type AppDataAccess} from './types';
import type {ServiceStorage} from './demo';

type Config={mode?:string;url?:string;fetcher?:typeof fetch};
/** Expo substitui estas referências no bundle; API e sensores têm URLs independentes. */
export function createAppData(storage:ServiceStorage,config:Config={
 mode:process.env.EXPO_PUBLIC_DATA_MODE,
 url:process.env.EXPO_PUBLIC_API_URL,
}):AppDataAccess{
 if(config.mode==='demo')return createApprovedData(storage);
 if(config.mode&&config.mode!=='api')throw new DataError('CONFIGURACAO_INVALIDA','Modo de dados inválido. Use api ou demo.');
 return createHttpData(config.url??'http://localhost:8080',{fetcher:config.fetcher});
}
