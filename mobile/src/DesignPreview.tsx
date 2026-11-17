import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppData } from './data/appData';
import { individualRecords } from './data/weighing';
import type { AppDataAccess, Sessao } from './data/types';
import type { Servico } from './data/types';
import { Text } from './rnr/text';
import { useServiceDay } from './useServiceDay';
import { READ_ONLY_DAY } from './data/serviceDay';
import { identifierType } from './typography';
import { PreviewHome, HomeNavigation } from './preview/PreviewHome';
import { PreviewRegistro } from './preview/PreviewRegistro';
import { PreviewHistory } from './preview/PreviewHistory';
import { Action, CATEGORIES, COLORS, Chevron, ErrorNotice, Field, Header, Loading, Shell, Status, categoryLabel, dateLabel, errorMessage, kg, s } from './preview/PreviewUi';

type Routes={Login:undefined;Home:undefined;Historico:undefined;Registro:{servico?:Servico;context?:{data:string;tipoRefeicao:string}}|undefined;Detalhes:{id:number}};
const Stack=createNativeStackNavigator<Routes>();

/** Interface aprovada: API por padrão, demo explícita e sensores externos simulados. */
export function DesignPreview() {
 const [api]=useState(()=>createAppData(AsyncStorage));
 const [session,setSession]=useState<Sessao>();
 return <>
  <NavigationContainer>
   <Stack.Navigator screenOptions={{headerShown:false,animation:'none',contentStyle:{backgroundColor:'#fff'}}}>
    {session ? <>
     <Stack.Screen name="Home">{props=><PreviewHome api={api} session={session} onHistory={()=>props.navigation.navigate('Historico')} onMeal={(data,tipoRefeicao,servico)=>servico?.status==='COMPLETO'?props.navigation.navigate('Detalhes',{id:servico.id}):props.navigation.navigate('Registro',{servico,context:{data,tipoRefeicao}})}/>}</Stack.Screen>
     <Stack.Screen name="Historico">{props=><View style={{flex:1}}><History {...props} api={api} session={session} onLogout={()=>setSession(undefined)}/><HomeNavigation active="history" onHome={()=>props.navigation.popTo('Home')} onHistory={()=>{}}/></View>}</Stack.Screen>
     <Stack.Screen name="Registro">{props=><PreviewRegistro key={props.route.key} api={api} session={session} initialService={props.route.params?.servico} initialContext={props.route.params?.context} onBack={()=>props.navigation.goBack()} onDetails={id=>props.navigation.replace('Detalhes',{id})}/>}</Stack.Screen>
     <Stack.Screen name="Detalhes">{props=><Details {...props} api={api} session={session}/>}</Stack.Screen>
    </> : <Stack.Screen name="Login">{()=> <Login api={api} onLogin={setSession}/>}</Stack.Screen>}
   </Stack.Navigator>
  </NavigationContainer>
 </>;
}

function Login({api,onLogin}: {api:AppDataAccess;onLogin:(session:Sessao)=>void}) {
 const [login,setLogin]=useState('');
 const [password,setPassword]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 async function submit() {
  if(busy)return;
  setBusy(true);setError('');
  try {onLogin(await api.login({login:login.trim(),senha:password}));}
  catch(e){setError(errorMessage(e));}
  finally{setBusy(false);}
 }
 return <KeyboardAvoidingView style={p.flex} behavior={Platform.OS==='ios'?'padding':undefined}>
  <Shell>
   <Header/>
   <View style={p.loginIntro}>
    <Text accessibilityRole="header" style={p.loginTitle}>Cada pesagem{'\n'}conta.</Text>
    <Text style={s.intro}>Registre o descarte de alimentos e acompanhe cada serviço da escola.</Text>
   </View>
   <View style={s.form}>
    <Field label="Login" value={login} onChangeText={setLogin} autoCapitalize="none" autoCorrect={false} editable={!busy} autoComplete="off"/>
    <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry editable={!busy} autoComplete="off" returnKeyType="go" onSubmitEditing={submit}/>
    <ErrorNotice message={error}/>
    <Action label={busy?'Entrando…':'Entrar'} disabled={busy} onPress={submit}/>
   </View>
  </Shell>
 </KeyboardAvoidingView>;
}

function useResource<T>(load:()=>Promise<T>,dependencies:unknown[]) {
 const [value,setValue]=useState<T>();
 const [error,setError]=useState('');
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let active=true;
  setValue(undefined);setError('');
  load().then(result=>{if(active)setValue(result);}).catch(e=>{if(active)setError(errorMessage(e));});
  return ()=>{active=false;};
 },[...dependencies,attempt]);
 return {value,error,retry:()=>setAttempt(n=>n+1)};
}

function History({api,session,navigation,onLogout}: {api:AppDataAccess;session:Sessao;onLogout:()=>void}&NativeStackScreenProps<Routes,'Historico'>) {
 const focused=useIsFocused();
 const {value,error,retry}=useResource(()=>api.listar(session.token),[api,session.token,focused]);
 const today=useServiceDay();
 return <Shell>
  <Header onLogout={onLogout}/>
  <Text accessibilityRole="header" style={s.title}>Histórico</Text>
  {error?<><ErrorNotice message={error}/><Action label="Tentar novamente" variant="secondary" onPress={retry}/></>:value===undefined?<Loading label="Carregando histórico…"/>:<PreviewHistory services={value} today={today} onDetails={id=>navigation.push('Detalhes',{id})} onContinue={servico=>navigation.push('Registro',{servico})}/>}
 </Shell>;
}

function Details({api,session,route,navigation}: {api:AppDataAccess;session:Sessao}&NativeStackScreenProps<Routes,'Detalhes'>) {
 const today=useServiceDay();
 const focused=useIsFocused();
 const {value:service,error,retry}=useResource(()=>api.detalhar(session.token,route.params.id),[api,session.token,route.params.id,focused]);
 const [deleting,setDeleting]=useState(false);
 const [busy,setBusy]=useState(false);
 const [actionError,setActionError]=useState('');
 async function remove() {
  if(busy)return;
  setBusy(true);setActionError('');
  try{await api.excluir(session.token,route.params.id);navigation.popTo('Historico');}
  catch(e){setActionError(errorMessage(e));setBusy(false);}
 }
 return <Shell>
  <Header onBack={()=>{if(!busy)navigation.popTo('Historico');}} title="Detalhes"/>
  {error ? <><ErrorNotice message={error}/><Action label="Tentar novamente" variant="secondary" onPress={retry}/></> : !service ? <Loading label="Carregando serviço…"/> : <>
   <View style={p.detailsHeading}><View><Text accessibilityRole="header" style={s.title}>{service.tipoRefeicao}</Text><Text style={s.intro}>{dateLabel(service.data)}</Text></View><Status complete={service.status==='COMPLETO'}/></View>
   <View style={p.detailsTotal}>
    <Text style={s.muted}>{service.status==='COMPLETO'?'Total de descarte monitorado':'Total parcial do descarte'}</Text>
    <Text style={p.totalAmount}>{kg(service.totalKg)}</Text>
    {service.status==='PENDENTE'?<Text style={s.small}>Soma apenas das categorias confirmadas.</Text>:null}
   </View>
   <View style={p.readings}>
    {CATEGORIES.map(category=>{
     const rows=individualRecords(service).filter(r=>r.categoria===category);
     return <View key={category} style={p.reading}>
      <Text style={p.readingCategory}>{categoryLabel(category)}</Text>
      {rows.length ? <>
       <Text style={p.readingWeight}>{kg(service.pesagens[category]!.pesoLiquidoKg)}</Text>
       {rows.map((reading,index)=><View key={reading.id} style={{gap:3,paddingTop:8}}>
        <Text style={s.small}>Registro {index+1} · {kg(reading.pesoLiquidoKg)}</Text>
        <Text style={s.small}>Bruto {kg(reading.pesoBrutoKg)} · Tara {kg(reading.taraKg)}</Text>
        <Text style={p.rfid}>{reading.codigoRfid} · peso confirmado</Text>
       </View>)}
      </> : <Text style={p.awaiting}>Aguardando pesagem</Text>}
     </View>;
    })}
   </View>
   {service.data===today?<View style={p.detailActions}><Action label={service.status==='PENDENTE'?'Continuar pesagens':'Corrigir pesagens'} disabled={busy||deleting} onPress={()=>navigation.push('Registro',{servico:service})}/></View>:<Text style={[s.muted,{marginTop:24}]}>{READ_ONLY_DAY}</Text>}
   <ErrorNotice message={actionError}/>
   {service.data===today ? deleting ? <View style={s.notice}>
    <Text style={s.noticeText}>Excluir este serviço e suas pesagens? Esta ação não pode ser desfeita.</Text>
    <Action label={busy?'Excluindo…':'Excluir serviço'} variant="danger" disabled={busy} onPress={remove}/>
    <Action label="Cancelar" variant="link" disabled={busy} onPress={()=>setDeleting(false)}/>
   </View> : <View style={p.deleteAction}><Action label="Excluir serviço" variant="link" onPress={()=>setDeleting(true)}/></View>:null}
  </>}
 </Shell>;
}

const p=StyleSheet.create({
 flex:{flex:1},
 loginIntro:{marginTop:26},
 loginTitle:{fontSize:44,lineHeight:50,fontWeight:'500',color:COLORS.ink},
 loginDemo:{gap:3,marginTop:24},
 registerAction:{marginTop:28},
 list:{marginTop:24},
 listTitle:{fontSize:19,lineHeight:26,fontWeight:'500',color:COLORS.ink,marginBottom:4},
 serviceRow:{flexDirection:'row',alignItems:'center',gap:18,paddingVertical:23,borderBottomWidth:1,borderBottomColor:COLORS.line},
 serviceCopy:{flex:1,gap:8},
 serviceMeal:{fontSize:16,lineHeight:22,fontWeight:'500',color:COLORS.ink},
 serviceDate:{fontSize:12,lineHeight:18,color:COLORS.muted},
 serviceAmount:{alignItems:'flex-end',gap:6},
 serviceWeight:{fontSize:22,lineHeight:29,fontWeight:'500',fontVariant:['tabular-nums'],color:COLORS.ink},
 listHint:{fontSize:11,lineHeight:19,color:COLORS.muted,marginTop:20},
 historyFooter:{marginTop:30},
 empty:{paddingVertical:24},
 emptyTitle:{fontSize:19,lineHeight:26,fontWeight:'500',color:COLORS.ink},
 detailsHeading:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:16},
 detailsTotal:{paddingTop:42,paddingBottom:28,borderBottomWidth:1,borderBottomColor:COLORS.line,gap:8},
 totalAmount:{fontSize:54,lineHeight:72,fontWeight:'500',fontVariant:['tabular-nums'],color:COLORS.ink},
 readings:{marginTop:6},
 reading:{paddingVertical:23,borderBottomWidth:1,borderBottomColor:COLORS.line,gap:7},
 readingCategory:{fontSize:13,lineHeight:21,fontWeight:'500',color:COLORS.ink},
 readingWeight:{fontSize:27,lineHeight:35,fontWeight:'500',fontVariant:['tabular-nums'],color:COLORS.ink},
 rfid:{...identifierType,fontSize:10,lineHeight:17,color:COLORS.muted},
 awaiting:{fontSize:14,lineHeight:22,color:COLORS.muted,paddingVertical:5},
 detailActions:{marginTop:30},
 deleteAction:{marginTop:8},
});
