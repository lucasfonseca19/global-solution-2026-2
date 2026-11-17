import {DataError,type AppDataAccess,type Previa,type RegistroPesagem,type Servico,type Sessao} from './types';

type Options={fetcher?:typeof fetch;timeoutMs?:number};
const categories=['SOBRA_DESCARTADA','RESTO_PRATO'] as const;
const invalid=()=>new DataError('RESPOSTA_INVALIDA','A API retornou uma resposta inválida. Tente novamente.');
function object(value:unknown):value is Record<string,unknown>{return typeof value==='object'&&value!==null;}
function weight(value:unknown):boolean{return typeof value==='number'&&Number.isFinite(value)&&value>=0;}
function reading(value:unknown):boolean{
 return object(value)&&Number.isSafeInteger(value.lixeiraId)&&typeof value.codigoRfid==='string'&&
  weight(value.taraKg)&&weight(value.pesoBrutoKg)&&weight(value.pesoLiquidoKg);
}
function preview(value:unknown):Previa{
 if(!reading(value)||!object(value)||!categories.includes(value.categoria as typeof categories[number]))throw invalid();
 return value as Previa;
}
function service(value:unknown):Servico{
 if(!object(value)||!Number.isSafeInteger(value.id)||typeof value.data!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value.data)||
  typeof value.tipoRefeicao!=='string'||!['PENDENTE','COMPLETO'].includes(value.status as string)||!weight(value.totalKg)||
  !object(value.pesagens)||!categories.every(c=>value.pesagens&&object(value.pesagens)&&(value.pesagens[c]===null||reading(value.pesagens[c])))||
  !Array.isArray(value.registros))throw invalid();
 const records=value.registros.map(r=>{
  preview(r);if(!object(r)||typeof r.id!=='string'||!r.id)throw invalid();
  return r as RegistroPesagem;
 });
 if(new Set(records.map(r=>r.id)).size!==records.length)throw invalid();
 return value as Servico;
}

/** A API é a autoridade: não há persistência local nem fallback de dados neste adaptador. */
export function createHttpData(baseUrl:string,{fetcher=fetch,timeoutMs=10000}:Options={}):AppDataAccess{
 if(!/^https?:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(baseUrl))throw new DataError('CONFIGURACAO_INVALIDA','Informe uma URL HTTP válida para a API.');
 const base=baseUrl.replace(/\/+$/,'');
 async function request(path:string,method:string,token?:string,body?:unknown):Promise<unknown>{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const response=await fetcher(`${base}${path}`,{
    method,headers:{Accept:'application/json',...(body===undefined?{}:{'Content-Type':'application/json'}),...(token?{Authorization:`Bearer ${token}`}:{})},
    ...(body===undefined?{}:{body:JSON.stringify(body)}),signal:controller.signal,
   });
   if(response.status===204)return undefined;
   let data:unknown;
   try{data=await response.json();}catch{throw invalid();}
   if(!response.ok){
    if(object(data)&&typeof data.codigo==='string'&&typeof data.mensagem==='string')throw new DataError(data.codigo,data.mensagem);
    throw new DataError('ERRO_HTTP',`A API não conseguiu realizar a operação (${response.status}). Tente novamente.`);
   }
   return data;
  }catch(error){
   if(error instanceof DataError)throw error;
   throw new DataError('API_INDISPONIVEL','Não foi possível comunicar com a API. Confira a conexão e tente novamente.');
  }finally{clearTimeout(timeout);}
 }
 return {
  async login(credentials){
   const data=await request('/auth/login','POST',undefined,credentials);
   if(!object(data)||typeof data.token!=='string'||!data.token||!object(data.usuario)||!Number.isSafeInteger(data.usuario.id)||typeof data.usuario.nome!=='string')throw invalid();
   return data as Sessao;
  },
  async listar(token){const data=await request('/servicos','GET',token);if(!Array.isArray(data))throw invalid();return data.map(service);},
  async detalhar(token,id){return service(await request(`/servicos/${id}`,'GET',token));},
  async avaliar(token,leitura){return preview(await request('/leituras/avaliar','POST',token,leitura));},
  async confirmarPesagem(token,entrada){return service(await request('/pesagens','POST',token,entrada));},
  async concluirServico(token,id){return service(await request(`/servicos/${id}/conclusao`,'PUT',token));},
  async excluir(token,id){await request(`/servicos/${id}`,'DELETE',token);},
 };
}
