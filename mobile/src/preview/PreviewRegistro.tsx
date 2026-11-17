import {useCallback,useEffect,useRef,useState} from 'react';
import {StyleSheet,View} from 'react-native';
import {useNavigation,usePreventRemove,useIsFocused} from '@react-navigation/native';
import {useReducedMotion} from 'react-native-reanimated';
import {useScaleSimulator} from '../iot/useScaleSimulator';
import type {Leitura,Previa,RegistroPesagem,Servico,Sessao,AppDataAccess} from '../data/types';
import {individualRecords} from '../data/weighing';
import {newWeighingCycle as nextCycle} from '../data/cycle';
import {localServiceDay,requireCurrentServiceDay,READ_ONLY_DAY} from '../data/serviceDay';
import {useServiceDay} from '../useServiceDay';
import {identifierType} from '../typography';
import {Button} from '../rnr/button';
import {Text} from '../rnr/text';
import {WeightMotion} from '../WeightMotion';
import {Action,CATEGORIES,COLORS,ErrorNotice,Field,Header,Shell,categoryLabel,dateLabel,errorMessage,kg,s} from './PreviewUi';

type Phase='idle'|'identifying'|'weighing'|'ready'|'saved';
const TIMING={identify:900};



export function PreviewRegistro({api,session,initialService,initialContext,onBack,onDetails}:{
 api:AppDataAccess;session:Sessao;initialService?:Servico;initialContext?:{data:string;tipoRefeicao:string};onBack:()=>void;onDetails:(id:number)=>void;
}){
 const today=useServiceDay(),navigation=useNavigation(),reduced=useReducedMotion(),focused=useIsFocused();
 const [serviceDate]=useState(initialService?.data??initialContext?.data??localServiceDay());
 const [meal,setMeal]=useState(initialService?.tipoRefeicao??initialContext?.tipoRefeicao??'Almoço');
 const [service,setService]=useState(initialService);
 const [setup,setSetup]=useState(!initialService&&!initialContext);
 const [phase,setPhase]=useState<Phase>('idle');
 const [preview,setPreview]=useState<Previa>();
 const [correction,setCorrection]=useState<RegistroPesagem>();
 const [cycle,setCycle]=useState(nextCycle);
 const [expanded,setExpanded]=useState(initialService?.status==='COMPLETO');
 const [details,setDetails]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [exitAction,setExitAction]=useState<()=>void>(),[allowExit,setAllowExit]=useState(false);
 const generation=useRef(0),operation=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const resolveDelay=useRef<(()=>void)|undefined>(undefined);
 useEffect(()=>()=>{generation.current++;clearTimeout(timer.current);resolveDelay.current?.();},[]);
 const pending=phase==='identifying'||phase==='weighing'||phase==='ready'||(!!correction&&phase!=='saved');
 usePreventRemove(!allowExit&&serviceDate===today&&(pending||busy),({data})=>{
  if(!operation.current)setExitAction(()=>()=>navigation.dispatch(data.action));
 });
 useEffect(()=>{if(allowExit&&exitAction)exitAction();},[allowExit,exitAction]);
 const settle=useCallback(()=>setPhase(value=>value==='weighing'?'ready':value),[]);
 const records=service?individualRecords(service):[];
 const completed=service?.status==='COMPLETO';
 const showingResult=completed&&!correction;
 const connection=useScaleSimulator(focused&&!setup&&serviceDate===today&&phase==='idle'&&!showingResult,reading=>void read(reading));
 const locked=busy||phase==='identifying'||phase==='weighing';
 const canFinish=!!service&&!completed&&!pending&&CATEGORIES.every(c=>records.some(r=>r.categoria===c));
 function clearReading(){generation.current++;clearTimeout(timer.current);resolveDelay.current?.();resolveDelay.current=undefined;operation.current=false;setPreview(undefined);setPhase('idle');setCorrection(undefined);setDetails(false);setError('');setCycle(nextCycle());}
 function correct(record:RegistroPesagem){clearReading();setCorrection(record);}
 async function search(){
  if(operation.current)return;operation.current=true;setBusy(true);setError('');
  try{requireCurrentServiceDay(serviceDate);if(!meal.trim())throw new Error('Informe o tipo de refeição.');const rows=await api.listar(session.token);setService(rows.find(r=>r.data===serviceDate&&r.tipoRefeicao.toLocaleLowerCase('pt-BR')===meal.trim().toLocaleLowerCase('pt-BR')));setSetup(false);}
  catch(e){setError(errorMessage(e));}finally{operation.current=false;setBusy(false);}
 }
 async function read(reading:Leitura){
  if(operation.current||phase!=='idle'||showingResult||setup||serviceDate!==today)return;
  operation.current=true;const version=++generation.current;setPhase('identifying');setError('');setPreview(undefined);setDetails(false);
  try{
   requireCurrentServiceDay(serviceDate);
   const next=await api.avaliar(session.token,reading);
   if(correction&&correction.codigoRfid!==next.codigoRfid)throw new Error('Use a mesma lixeira para corrigir este registro.');
   if(!reduced)await new Promise<void>(resolve=>{resolveDelay.current=resolve;timer.current=setTimeout(()=>{resolveDelay.current=undefined;resolve();},TIMING.identify);});
   if(version!==generation.current)return;
   requireCurrentServiceDay(serviceDate);setPreview(next);setPhase('weighing');
  }catch(e){if(version===generation.current){setPhase('idle');setError(errorMessage(e));}}
  finally{if(version===generation.current)operation.current=false;}
 }
 async function confirm(){
  if(operation.current||phase!=='ready'||!preview)return;
  operation.current=true;setBusy(true);setError('');
  try{requireCurrentServiceDay(serviceDate);const saved=await api.confirmarPesagem(session.token,{data:serviceDate,tipoRefeicao:meal.trim(),cicloId:cycle,substituirId:correction?.id,leitura:{codigoRfid:preview.codigoRfid,pesoBrutoKg:preview.pesoBrutoKg}});setService(saved);setPhase('saved');}
  catch(e){setError(errorMessage(e));}finally{operation.current=false;setBusy(false);}
 }
 async function finish(){
  if(!service||!canFinish||operation.current)return;
  operation.current=true;setBusy(true);setError('');
  try{requireCurrentServiceDay(serviceDate);setService(await api.concluirServico(session.token,service.id));setPreview(undefined);setPhase('idle');}
  catch(e){setError(errorMessage(e));}finally{operation.current=false;setBusy(false);}
 }
 if(serviceDate!==today)return <Shell><Header onBack={onBack} title="Registro"/><Text accessibilityRole="header" style={s.title}>Somente consulta</Text><Text style={s.intro}>{READ_ONLY_DAY}</Text>{service?<Action label="Ver detalhes" onPress={()=>onDetails(service.id)}/>:null}<Action label="Voltar ao início" variant="link" onPress={()=>{setAllowExit(true);onBack();}}/></Shell>;
 const status=phase==='identifying'?'Identificando lixeira…':phase==='weighing'?'Pesando…':phase==='ready'?'Peso estável':phase==='saved'?(correction?'Correção salva':'Pesagem registrada'):connection!=='connected'?(connection==='offline'?'Balança indisponível':'Conectando à balança…'):correction?'Recoloque a lixeira para corrigir':'Coloque a lixeira na balança';
 return <Shell>
  <Header onBack={onBack} title="Pesagem"/>
  {exitAction?<View style={s.notice}><Text style={s.noticeText}>Descartar a leitura e sair? As pesagens confirmadas serão preservadas.</Text><Action label="Descartar e sair" onPress={()=>{clearReading();setAllowExit(true);}}/><Action label="Continuar aqui" variant="link" onPress={()=>setExitAction(undefined)}/></View>:null}
  {setup?<>
   <Text accessibilityRole="header" style={s.title}>Registrar descarte</Text>
   <View style={s.form}><Text style={s.muted}>{dateLabel(serviceDate)} · hoje</Text><Field label="Tipo de refeição" value={meal} onChangeText={setMeal} editable={!busy}/><Action label={busy?'Procurando serviço…':'Continuar'} disabled={busy} onPress={search}/></View>
   <ErrorNotice message={error}/>
  </>:<>
   <View style={p.context}><View style={p.contextCopy}><Text accessibilityRole="header" style={p.meal}>{meal}</Text><Text style={p.date}>{dateLabel(serviceDate)} · hoje</Text></View><Text style={p.badge}>{completed?'Concluído':'Em andamento'}</Text></View>
   <View style={p.identity}>{preview&&!showingResult?<Text selectable style={p.identityText}><Text style={[p.identityText,identifierType]}>{preview.codigoRfid}</Text> · {preview.categoria==='SOBRA_DESCARTADA'?'Lixeira da cozinha':'Lixeira dos pratos'}</Text>:!showingResult&&phase==='idle'?<Text style={p.identityText}>{connection==='connected'?'Balança conectada':connection==='offline'?'Aguardando reconexão':'Aguardando conexão'}</Text>:null}</View>
   {showingResult?<View style={p.result}><Text accessibilityRole="header" style={p.resultTitle}>Serviço concluído</Text><Text style={p.amount}>{kg(service.totalKg)}</Text><Text style={s.small}>de descarte monitorado</Text><Action label="Ver detalhes do serviço" variant="link" onPress={()=>onDetails(service.id)}/></View>:<>
    <View style={p.scale}><WeightMotion key={cycle} target={preview?.pesoLiquidoKg} onSettled={settle} color={COLORS.accent} style={p.amount}/></View>
    <Text style={p.stage} accessibilityLiveRegion="polite">{status}</Text>
    <View style={p.meta}>{preview?<><Button variant="link" style={p.detailToggle} onPress={()=>setDetails(!details)} accessibilityState={{expanded:details}}><Text style={s.small}>Detalhes do peso</Text></Button>{details?<Text style={p.calculation}>{categoryLabel(preview.categoria)}{'\n'}Bruto {kg(preview.pesoBrutoKg)} − tara {kg(preview.taraKg)}</Text>:null}</>:null}</View>
    <ErrorNotice message={error}/>
    <View style={p.action}>
     {phase==='ready'?<Action label={busy?'Confirmando…':correction?'Salvar correção':'Confirmar pesagem'} disabled={busy} onPress={confirm}/>:phase==='saved'?<Action label={completed?'Voltar ao resultado':'Nova pesagem'} onPress={clearReading}/>:locked?<Action label={phase==='identifying'?'Identificando…':'Aguarde estabilizar'} disabled onPress={()=>{}}/>:<Text style={p.hint}>{connection!=='connected'?'Aguardando conexão.':correction?'Somente este registro será substituído.':'A identificação é automática.'}</Text>}
     {pending?<Action label={phase==='ready'?'Descartar leitura':'Cancelar pesagem'} variant="link" disabled={busy} onPress={clearReading}/>:null}
    </View>

   </>}
   <View style={p.summary}>
    <Button variant="ghost" style={p.summaryToggle} disabled={locked} onPress={()=>setExpanded(!expanded)} accessibilityLabel="Pesagens registradas" accessibilityState={{expanded}}><View style={p.summaryCopy}><Text style={p.summaryTitle}>Neste serviço</Text><Text style={s.small}>{records.length} {records.length===1?'pesagem':'pesagens'}</Text></View><Text style={p.total}>{kg(service?.totalKg??0)}</Text><Text style={s.muted}>{expanded?'−':'+'}</Text></Button>
    {expanded?records.length?records.map((record,index)=><View key={record.id} style={p.record}><View style={p.recordCopy}><Text style={p.recordName}>{categoryLabel(record.categoria)}</Text><Text style={p.recordId}>{record.codigoRfid} · registro {index+1}</Text></View><Text style={p.recordWeight}>{kg(record.pesoLiquidoKg)}</Text><Button variant="link" style={p.correct} disabled={locked||pending} accessibilityLabel={`Corrigir registro ${index+1}`} onPress={()=>correct(record)}><Text style={p.correctText}>Corrigir</Text></Button></View>):<Text style={p.hint}>Nenhuma pesagem registrada.</Text>:null}
    <View style={p.categories}>{CATEGORIES.map(c=>{const confirmed=records.some(r=>r.categoria===c);return <Text key={c} style={[s.small,confirmed?p.confirmed:undefined]}>{confirmed?'✓':'○'} {c==='SOBRA_DESCARTADA'?'Sobras':'Restos'}</Text>;})}</View>
   </View>
   {!completed?<><Action label={busy?'Salvando…':'Concluir serviço'} variant="secondary" disabled={!canFinish||busy} onPress={finish}/>{records.length&&!canFinish&&!pending?<Text style={p.finishHint}>Falta registrar {records.some(r=>r.categoria==='SOBRA_DESCARTADA')?'restos':'sobras'}.</Text>:null}</>:null}
   {showingResult?<ErrorNotice message={error}/>:null}
  </>}
 </Shell>;
}
const p=StyleSheet.create({
 context:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},contextCopy:{flex:1,gap:5},meal:{fontSize:24,lineHeight:31,fontWeight:'500',color:COLORS.ink},date:{fontSize:12,lineHeight:19,color:COLORS.muted},badge:{fontSize:11,lineHeight:18,color:'#78229e',backgroundColor:COLORS.soft,paddingVertical:6,paddingHorizontal:8,borderRadius:6},identity:{minHeight:36,justifyContent:'center'},identityText:{fontSize:11,lineHeight:18,color:COLORS.muted},scale:{paddingTop:20},amount:{fontSize:54,lineHeight:76,fontWeight:'500',color:COLORS.ink,textAlign:'center',width:'100%',fontVariant:['tabular-nums']},stage:{fontSize:14,lineHeight:22,textAlign:'center',color:COLORS.ink,marginTop:8},meta:{minHeight:34},detailToggle:{minHeight:44,paddingHorizontal:8},calculation:{fontSize:11,lineHeight:19,color:COLORS.muted,textAlign:'center'},action:{minHeight:100,marginTop:10,justifyContent:'center'},hint:{fontSize:12,lineHeight:20,color:COLORS.muted,textAlign:'center',paddingVertical:16},simulation:{alignItems:'stretch'},simulationText:{fontSize:12,color:'#744189'},panel:{padding:14,borderWidth:1,borderColor:COLORS.line,borderRadius:12,gap:8,marginBottom:16},summary:{borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:12,marginTop:12},summaryToggle:{minHeight:60,flexDirection:'row',justifyContent:'space-between',gap:12,paddingHorizontal:0},summaryCopy:{flex:1,gap:3},summaryTitle:{fontSize:13,fontWeight:'500',color:COLORS.ink},total:{fontSize:22,lineHeight:30,fontWeight:'500',color:COLORS.ink,fontVariant:['tabular-nums']},categories:{flexDirection:'row',gap:20,paddingTop:10,paddingBottom:22},confirmed:{color:'#78229e'},record:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:10,borderBottomWidth:1,borderBottomColor:COLORS.line},recordCopy:{flex:1,gap:3},recordName:{fontSize:12,lineHeight:19,color:COLORS.ink},recordId:{...identifierType,fontSize:10,lineHeight:17,color:COLORS.muted},recordWeight:{fontSize:14,fontWeight:'500',color:COLORS.ink,fontVariant:['tabular-nums']},correct:{minHeight:44,paddingHorizontal:0},correctText:{fontSize:11,color:'#78229e'},finishHint:{fontSize:11,lineHeight:18,color:COLORS.muted,textAlign:'center',marginTop:8},result:{alignItems:'center',paddingTop:24,paddingBottom:16,gap:10},resultTitle:{fontSize:23,lineHeight:30,fontWeight:'500',color:COLORS.ink},
});
