import { Pressable, StyleSheet, View } from 'react-native';
import type { Servico } from '../data/types';
import { Text } from '../rnr/text';
import { COLORS, dateLabel, kg } from './PreviewUi';

const REST_COLOR = '#c2a5d6';

/** Compara quantidades confirmadas; uma categoria pendente nunca entra como zero. */
export function DescarteChart({services,onDetails}: {services:Servico[];onDetails:(id:number)=>void}) {
 const complete = services.filter(s=>s.status==='COMPLETO')
  .sort((a,b)=>b.data.localeCompare(a.data)||b.id-a.id).slice(0,7).reverse();
 const maximum = Math.max(1,...complete.map(s=>s.totalKg));
 const pending = services.filter(s=>s.status==='PENDENTE');
 return <View style={c.section}>
  <Text accessibilityRole="header" style={c.title}>Descarte por serviço</Text>
  <Text style={c.caption}>Até 7 serviços completos · peso do alimento em kg</Text>
  <View style={c.legend}>
   <View style={c.legendItem}><View style={[c.swatch,{backgroundColor:COLORS.accent}]}/><Text style={c.legendText}>Sobra descartada</Text></View>
   <View style={c.legendItem}><View style={[c.swatch,{backgroundColor:REST_COLOR}]}/><Text style={c.legendText}>Resto comestível do prato</Text></View>
  </View>
  {complete.length ? <>
   {complete.map(service=>{
    const sobra=service.pesagens.SOBRA_DESCARTADA!.pesoLiquidoKg;
    const restos=service.pesagens.RESTO_PRATO!.pesoLiquidoKg;
    return <Pressable key={service.id} accessibilityRole="button" accessibilityLabel={`${dateLabel(service.data)}, ${service.tipoRefeicao}. Sobra descartada: ${kg(sobra)}. Resto comestível do prato: ${kg(restos)}. Total: ${kg(service.totalKg)}. Abrir detalhes.`} onPress={()=>onDetails(service.id)} style={({pressed})=>[c.row,{opacity:pressed?0.65:1}]}>
     <View style={c.rowHeading}><Text style={c.label}>{dateLabel(service.data)} · {service.tipoRefeicao}</Text><Text style={c.value}>{kg(service.totalKg)}</Text></View>
     <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={c.track}>
      <View style={{height:18,width:`${sobra/maximum*100}%`,backgroundColor:COLORS.accent}}/>
      <View style={{height:18,width:`${restos/maximum*100}%`,backgroundColor:REST_COLOR}}/>
     </View>
     <Text style={c.breakdown}>Sobra {kg(sobra)} · Pratos {kg(restos)}</Text>
    </Pressable>;
   })}
   <View style={c.axis}><Text style={c.axisLabel}>0 kg</Text><Text style={c.axisLabel}>{kg(maximum)}</Text></View>
  </> : <Text style={c.empty}>A comparação aparece ao confirmar as duas categorias de um serviço.</Text>}
  {pending.length ? <Pressable accessibilityRole="button" onPress={()=>onDetails(pending[0].id)} style={({pressed})=>[c.pending,{opacity:pressed?0.65:1}]}>
   <Text style={c.pendingTitle}>{pending.length===1?'1 serviço aguarda conclusão':`${pending.length} serviços aguardam conclusão`}</Text>
   <Text style={c.caption}>Faltam pesagens para entrar na comparação.</Text>
   <Text style={c.pendingLink}>Consultar pendência</Text>
  </Pressable> : null}
 </View>;
}

const c=StyleSheet.create({
 section:{marginTop:34,paddingBottom:26,borderBottomWidth:1,borderBottomColor:COLORS.line},
 title:{fontSize:19,lineHeight:26,fontWeight:'500',color:COLORS.ink},
 caption:{fontSize:11,lineHeight:18,color:COLORS.muted,marginTop:6},
 legend:{gap:7,marginTop:18,marginBottom:10},
 legendItem:{flexDirection:'row',alignItems:'center',gap:8},
 swatch:{width:9,height:9,borderRadius:2},
 legendText:{fontSize:11,lineHeight:18,color:COLORS.muted},
 row:{paddingVertical:14,minHeight:80},
 rowHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:10},
 label:{fontSize:12,lineHeight:19,color:COLORS.ink,flex:1},
 value:{fontSize:13,lineHeight:20,fontWeight:'500',fontVariant:['tabular-nums'],color:COLORS.ink},
 track:{height:18,borderRadius:3,backgroundColor:COLORS.faint,overflow:'hidden',flexDirection:'row'},
 breakdown:{fontSize:10,lineHeight:17,color:COLORS.muted,marginTop:6},
 axis:{flexDirection:'row',justifyContent:'space-between',marginTop:2},
 axisLabel:{fontSize:10,lineHeight:16,color:COLORS.muted},
 empty:{fontSize:13,lineHeight:21,color:COLORS.muted,paddingVertical:22},
 pending:{backgroundColor:COLORS.faint,borderRadius:12,padding:16,marginTop:22},
 pendingTitle:{fontSize:12,lineHeight:20,fontWeight:'500',color:COLORS.ink},
 pendingLink:{fontSize:12,lineHeight:20,color:'#744189',marginTop:10},
});
