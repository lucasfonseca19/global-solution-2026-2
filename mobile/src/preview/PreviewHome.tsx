import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Text } from '../rnr/text';
import type { DataAccess, Servico, Sessao } from '../data/types';
import { COLORS, ErrorNotice, Loading, kg } from './PreviewUi';
import { allo } from '../typography';
import { useServiceDay } from '../useServiceDay';
export {localServiceDay as localDate} from '../data/serviceDay';

// Opções de demonstração. Configuração de refeições fica para uma próxima entrega.
const MEALS = ['Almoço', 'Lanche da tarde', 'Jantar'];
export function HomeNavigation({active,onHome,onHistory}: {active:'home'|'history';onHome:()=>void;onHistory:()=>void}) {
 return <View style={h.navigation}>{(['home','history'] as const).map(tab=><Pressable key={tab} accessibilityRole="button" accessibilityLabel={tab==='home'?'Hoje':'Histórico'} accessibilityState={{selected:active===tab}} onPress={tab==='home'?onHome:onHistory} style={({pressed})=>[h.tab,{opacity:pressed?0.6:1}]}>
  <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[h.icon,{borderColor:active===tab?COLORS.accent:COLORS.muted}]}>{tab==='home'?<><View style={[h.calendarLine,{backgroundColor:active===tab?COLORS.accent:COLORS.muted}]}/><View style={[h.calendarDot,{backgroundColor:active===tab?COLORS.accent:COLORS.muted}]}/></>:<View style={h.lines}>{[0,1,2].map(i=><View key={i} style={[h.line,{backgroundColor:active===tab?COLORS.accent:COLORS.muted}]}/>)}</View>}</View>
  <Text style={[h.tabLabel,active===tab?h.active:undefined]}>{tab==='home'?'Hoje':'Histórico'}</Text>
 </Pressable>)}</View>;
}
export function PreviewHome({api,session,onMeal,onHistory}: {api:DataAccess;session:Sessao;onMeal:(date:string,meal:string,service?:Servico)=>void;onHistory:()=>void}) {
 const focused=useIsFocused();
 const iso=useServiceDay();
 const date=new Date(iso+'T12:00:00');
 const [services,setServices]=useState<Servico[]>();
 const [error,setError]=useState('');
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{
  if(!focused)return;
  let active=true;
  setServices(undefined);setError('');
  api.listar(session.token).then(rows=>{if(active)setServices(rows);}).catch(e=>{if(active)setError(e instanceof Error?e.message:'Não foi possível carregar as refeições.');});
  return ()=>{active=false;};
 },[api,session.token,focused,attempt,iso]);
 const weekday=new Intl.DateTimeFormat('pt-BR',{weekday:'long'}).format(date);
 const day=new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long'}).format(date);
 const meals=Array.from(new Set([...MEALS,...(services??[]).filter(item=>item.data===iso).map(item=>item.tipoRefeicao)]));
 return <SafeAreaView style={h.safe} edges={['top','bottom']}>
  <ScrollView contentContainerStyle={h.scroll}>
   <View style={h.page}>
    <Text style={h.brand}>merenda<Text style={h.brandDot}>.</Text></Text>
    <View style={h.date}><Text accessibilityRole="header" style={h.weekday}>{weekday.charAt(0).toUpperCase()+weekday.slice(1)}</Text><Text style={h.day}>{day}</Text></View>
    {error?<><ErrorNotice message={error}/><Pressable accessibilityRole="button" onPress={()=>setAttempt(n=>n+1)} style={h.retry}><Text style={h.active}>Tentar novamente</Text></Pressable></>:services===undefined?<Loading label="Carregando refeições…"/>:<View style={h.meals}>{meals.map(meal=>{
     const service=services.find(item=>item.data===iso&&item.tipoRefeicao.toLocaleLowerCase('pt-BR')===meal.toLocaleLowerCase('pt-BR'));
     const complete=service?.status==='COMPLETO';
     const status=complete?'Concluída':service?'Em andamento':'Não iniciada';
     const inProgress=!!service&&!complete;
     const action=complete?'Ver resultado':inProgress?'Continuar pesagem':'Pesar';
     return <Pressable key={meal} accessibilityRole="button" accessibilityLabel={`${meal}, ${status}, ${action}`} onPress={()=>onMeal(iso,meal,service)} style={({pressed})=>[h.meal,{opacity:pressed?0.6:1}]}>
      {inProgress?<View pointerEvents="none" style={h.activeBackground}/>:null}
      <View style={h.mealCopy}><Text style={h.mealName}>{meal}</Text><View style={h.state}>
       <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[h.stateIcon,inProgress?h.startedIcon:complete?h.completeIcon:undefined]}>{complete?'✓':inProgress?'●':'○'}</Text>
       <Text style={[h.stateText,inProgress?h.startedText:undefined]}>{status}{complete?` · ${kg(service.totalKg)}`:''}</Text>
      </View></View>
      <Text style={[h.mealAction,inProgress?h.resumeAction:complete?h.completedAction:undefined]}>{action}</Text>
     </Pressable>;
    })}</View>}
   </View>
  </ScrollView>
  <HomeNavigation active="home" onHome={()=>{}} onHistory={onHistory}/>
 </SafeAreaView>;
}
const h=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#fff'},scroll:{flexGrow:1},page:{width:'100%',maxWidth:480,alignSelf:'center',paddingHorizontal:28,paddingTop:28,paddingBottom:24,flexGrow:1},
 brand:{...allo(20,70,650),fontSize:20,lineHeight:28,fontWeight:'600',color:COLORS.ink},brandDot:{color:COLORS.accent},
 date:{flexDirection:'row',alignItems:'baseline',flexWrap:'wrap',columnGap:10,rowGap:4,marginTop:36,marginBottom:28},weekday:{fontSize:24,lineHeight:32,fontWeight:'600',color:COLORS.ink},day:{fontSize:16,lineHeight:24,color:COLORS.muted},
 meals:{gap:0},meal:{minHeight:104,paddingVertical:24,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:14},mealCopy:{flex:1,gap:8},mealName:{...allo(20,50,550),fontSize:20,lineHeight:28,fontWeight:'500',color:COLORS.ink},state:{flexDirection:'row',gap:6,alignItems:'center'},stateIcon:{fontSize:14,lineHeight:20,width:15,textAlign:'center',color:'#8e8495'},startedIcon:{fontSize:10,color:COLORS.accent},completeIcon:{color:COLORS.ink},stateText:{fontSize:13,lineHeight:20,color:COLORS.muted,flexShrink:1,fontVariant:['tabular-nums']},startedText:{color:'#7220a4'},mealAction:{fontSize:14,lineHeight:20,fontWeight:'500',color:COLORS.accent,paddingVertical:14,maxWidth:116,flexShrink:1,textAlign:'right'},resumeAction:{fontWeight:'600',color:'#7220a4'},completedAction:{color:COLORS.muted},
 activeBackground:{position:'absolute',top:8,bottom:8,left:-12,right:-12,backgroundColor:COLORS.soft,borderRadius:14,borderCurve:'continuous'},
 demo:{fontSize:12,lineHeight:18,color:COLORS.muted,marginTop:'auto',paddingTop:48,textAlign:'center'},
 navigation:{width:'100%',maxWidth:480,alignSelf:'center',flexDirection:'row',borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:8,paddingBottom:8,paddingHorizontal:20,backgroundColor:'#fff'},tab:{flex:1,minHeight:56,alignItems:'center',justifyContent:'center',gap:5},tabLabel:{fontSize:13,lineHeight:18,color:COLORS.muted},active:{color:COLORS.accent},icon:{width:20,height:20,borderRadius:4,borderWidth:1.5,overflow:'hidden'},calendarLine:{height:1.5,width:'100%',marginTop:5},calendarDot:{width:3,height:3,borderRadius:1,marginTop:4,marginLeft:5},lines:{gap:3,padding:4},line:{height:1,width:10},retry:{minHeight:48,justifyContent:'center'},
});
