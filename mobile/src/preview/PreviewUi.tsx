import type { PropsWithChildren } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../rnr/button';
import { Text } from '../rnr/text';
import type { Categoria, Servico } from '../data/types';
import { allo } from '../typography';
import {ModeControl,ModeBadge} from './AppMode';

export const COLORS = { ink:'#211b27', muted:'#706a77', faint:'#f7f5f8', line:'#eae6ee', accent:'#9226d5', soft:'#f7effc', danger:'#a12646' };
export const CATEGORIES = ['SOBRA_DESCARTADA','RESTO_PRATO'] as const;
export const categoryLabel = (category: Categoria) => category === 'SOBRA_DESCARTADA' ? 'Sobra descartada' : 'Resto comestível do prato';
const kilograms = new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
export const kg = (value: number) => `${kilograms.format(value)} kg`;
export const dateLabel = (value: string) => value.split('-').reverse().join('/');
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Não foi possível concluir. Tente novamente.';

export function Action({label,onPress,variant='primary',disabled=false}: {label:string;onPress:()=>void;variant?:'primary'|'secondary'|'link'|'danger';disabled?:boolean}) {
 return <Button variant={variant === 'primary' || variant === 'danger' ? 'default' : variant === 'secondary' ? 'outline' : 'link'} onPress={onPress} disabled={disabled} accessibilityState={{disabled}} style={[s.action,variant==='link'?s.linkAction:undefined,variant==='primary'?s.primary:variant==='danger'?s.danger:variant==='secondary'?s.secondary:undefined]}>
  <Text style={[s.actionText,variant==='primary'||variant==='danger'?s.actionLight:variant==='link'?s.actionLink:undefined]}>{label}</Text>
 </Button>;
}

export function Chevron({back=false}: {back?:boolean}) {
 return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[s.chevron,back?s.chevronBack:undefined]}/>;
}

export function Shell({children,tabbed=false}: PropsWithChildren<{tabbed?:boolean}>) {
 return <SafeAreaView style={s.safe} edges={tabbed?['top']:['top','bottom']}>
  <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
   <View style={s.page}>{children}</View>
  </ScrollView>
 </SafeAreaView>;
}

export function Header({onBack,onLogout,title}: {onBack?:()=>void;onLogout?:()=>void;title?:string}) {
 return <View style={s.header}>
  {onBack ? <Button variant="link" onPress={onBack} style={s.back} accessibilityLabel="Voltar"><Chevron back/><Text style={s.backText}>Voltar</Text></Button>
   : <Text style={s.brand}>merenda<Text style={s.brandDot}>.</Text></Text>}
  {title ? <View><Text style={s.headerTitle}>{title}</Text><ModeBadge/></View> : null}
  {!onBack?<ModeControl/>:null}
  {onLogout ? <Button variant="link" onPress={onLogout} style={s.headerAction}><Text style={s.muted}>Sair</Text></Button> : null}
 </View>;
}

export function Field({label,...props}: {label:string}&TextInputProps) {
 return <View style={s.field}><Text style={s.fieldLabel}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#8a8291" style={s.input} {...props}/></View>;
}

export function ErrorNotice({message}: {message:string}) {
 return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.error}>{message}</Text> : null;
}

export function Loading({label}: {label:string}) {
 return <View style={s.loading}><ActivityIndicator color={COLORS.accent}/><Text style={s.muted}>{label}</Text></View>;
}

export function Status({complete}: {complete:boolean}) {
 return <View style={[s.badge,complete?s.badgeComplete:undefined]}><Text style={[s.badgeText,complete?s.badgeCompleteText:undefined]}>{complete?'Completo':'Pendente'}</Text></View>;
}

export function ServiceSummary({service}: {service?:Servico}) {
 const count = CATEGORIES.filter(c=>service?.pesagens[c]).length;
 return <View style={s.summary}>
  <View style={s.summaryHeading}><Text style={s.sectionTitle}>Neste serviço</Text><Text style={s.small}>{count} de 2 confirmadas</Text></View>
  {CATEGORIES.map(c=><View key={c} style={s.summaryRow}>
   <Text style={s.summaryCategory}>{categoryLabel(c)}</Text>
   <Text style={[s.summaryValue,!service?.pesagens[c]?s.pending:undefined]}>{service?.pesagens[c] ? kg(service.pesagens[c]!.pesoLiquidoKg) : 'Aguardando pesagem'}</Text>
  </View>)}
  {service ? <View style={s.totalRow}><Text style={s.small}>{service.status==='COMPLETO'?'Total confirmado':'Total parcial'}</Text><Text style={s.totalValue}>{kg(service.totalKg)}</Text></View> : <Text style={s.summaryHint}>Só a confirmação registra o peso.</Text>}
 </View>;
}

export function DemoFootnote() {
 return <Text style={s.footnote}>Prévia interativa · dados simulados em memória</Text>;
}

export const s = StyleSheet.create({
 safe: {flex:1,backgroundColor:'#fff'},
 scroll: {flexGrow:1},
 page: {width:'100%',maxWidth:480,alignSelf:'center',paddingHorizontal:28,paddingTop:20,paddingBottom:32,flexGrow:1},
 header: {minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:34},
 brand: {fontSize:24,fontWeight:'600',color:COLORS.ink},
 brandDot: {color:COLORS.accent},
 headerTitle: {fontSize:13,color:COLORS.muted},
 headerAction: {minHeight:44,paddingHorizontal:0},
 back: {minHeight:44,paddingHorizontal:0,gap:12},
 backText: {fontSize:13,color:COLORS.ink},
 chevron: {width:7,height:7,borderTopWidth:1.5,borderRightWidth:1.5,borderColor:COLORS.muted,transform:[{rotate:'45deg'}]},
 chevronBack: {transform:[{rotate:'-135deg'}]},
 title: {fontSize:32,lineHeight:39,fontWeight:'500',color:COLORS.ink},
 intro: {fontSize:14,lineHeight:22,color:COLORS.muted,marginTop:12},
 muted: {fontSize:13,lineHeight:20,color:COLORS.muted},
 small: {fontSize:11,lineHeight:18,color:COLORS.muted},
 action: {height:'auto',minHeight:50,borderRadius:12,paddingVertical:14,paddingHorizontal:20},
 primary: {backgroundColor:COLORS.accent},
 secondary: {backgroundColor:'#fff',borderWidth:1,borderColor:COLORS.line},
 danger: {backgroundColor:COLORS.danger},
 actionText: {fontSize:14,lineHeight:20,fontWeight:'500',color:COLORS.ink},
 actionLight: {color:'#fff'},
 actionLink: {color:COLORS.muted,fontSize:12},
 linkAction: {minHeight:44,paddingVertical:10,paddingHorizontal:12},
 field: {gap:9},
 fieldLabel: {fontSize:13,fontWeight:'500',color:COLORS.ink},
 input: {...allo(15),minHeight:52,borderWidth:1,borderColor:COLORS.line,borderRadius:10,paddingHorizontal:15,paddingVertical:13,fontSize:15,lineHeight:22,color:COLORS.ink,backgroundColor:'#fff'},
 form: {gap:22,marginTop:36},
 formActions: {gap:10,marginTop:10},
 error: {fontSize:13,lineHeight:20,color:COLORS.danger,marginVertical:12},
 loading: {flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,paddingVertical:36},
 badge: {alignSelf:'flex-start',paddingHorizontal:9,paddingVertical:4,borderRadius:6,backgroundColor:COLORS.faint},
 badgeText: {fontSize:10,lineHeight:15,fontWeight:'500',color:COLORS.muted},
 badgeComplete: {backgroundColor:COLORS.soft},
 badgeCompleteText: {color:'#7e269f'},
 summary: {marginTop:34},
 summaryHeading: {flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:8},
 sectionTitle: {fontSize:13,fontWeight:'500',color:COLORS.ink},
 summaryRow: {flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:16,paddingVertical:17,borderBottomWidth:1,borderBottomColor:COLORS.line},
 summaryCategory: {fontSize:13,lineHeight:20,color:COLORS.ink,flex:1},
 summaryValue: {fontSize:15,lineHeight:21,fontWeight:'500',fontVariant:['tabular-nums'],color:COLORS.ink,textAlign:'right'},
 pending: {fontSize:11,lineHeight:18,fontWeight:'400',color:COLORS.muted,maxWidth:112},
 totalRow: {flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:16,paddingTop:18},
 totalValue: {fontSize:15,fontWeight:'500',fontVariant:['tabular-nums'],color:COLORS.ink},
 summaryHint: {fontSize:11,lineHeight:18,color:COLORS.muted,marginTop:16},
 footnote: {fontSize:10,lineHeight:17,color:COLORS.muted,textAlign:'center',marginTop:38},
 notice: {backgroundColor:COLORS.faint,borderRadius:12,padding:18,gap:12,marginTop:20},
 noticeText: {fontSize:13,lineHeight:21,color:COLORS.ink},
 noticeActions: {flexDirection:'row',flexWrap:'wrap',gap:10},
});
