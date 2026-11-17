import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, type TextStyle } from 'react-native';
import Animated, { cancelAnimation, Easing, runOnJS, useAnimatedProps, useAnimatedStyle, useDerivedValue, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { allo } from './typography';
/* STORYBOARD — uma leitura simulada dirige o número e a régua; não grava dados.
 *    0ms  número em 0 e régua na origem, indicador central fixo
 *  850ms  número alcança o alvo; régua acompanha e acomoda
 * 1350ms  ambos terminam no mesmo peso exato; libera conferência
 * Movimento reduzido: estado final imediato, sem espera artificial.
 */
const TIMING = { rise: 850, settled: 1350 };
const COUNTER = { overshoot: 0.025 };
const RULER = { tickKg: 0.1, tickWidth: 8, beforeZero: 30, minimumTicks: 90, tailTicks: 40 };
const AnimatedInput = Animated.createAnimatedComponent(TextInput);
export function WeightMotion({ target, onSettled, style, color }: { target?: number; onSettled: () => void; style: TextStyle; color: string }) {
 const progress = useSharedValue(0);
 const reduced = useReducedMotion();
 const value = useDerivedValue(() => {
  const elapsed = progress.value * TIMING.settled;
  const weight = target ?? 0;
  if (elapsed < TIMING.rise) return weight * elapsed / TIMING.rise;
  const settle = (elapsed - TIMING.rise) / (TIMING.settled - TIMING.rise);
  return Math.max(0, weight * (1 + COUNTER.overshoot * Math.sin(settle * Math.PI * 2) * (1 - settle)));
 });
 const props = useAnimatedProps(() => {
  const text = target === undefined ? '— kg' : `${value.value.toFixed(2).replace('.', ',')} kg`;
  return { text, defaultValue: text };
 });
 const trackStyle = useAnimatedStyle(() => ({
  transform: [{translateX: -value.value / RULER.tickKg * RULER.tickWidth}],
 }));
 useEffect(() => {
  if (target === undefined) { progress.value = 0; return; }
  let active = true;
  const finish = () => { if (active) onSettled(); };
  progress.value = 0;
  if (reduced) { progress.value = 1; finish(); }
  else progress.value = withTiming(1, {duration: TIMING.settled, easing: Easing.linear}, done => { if (done) runOnJS(finish)(); });
  return () => { active = false; cancelAnimation(progress); };
 }, [target, reduced, progress, onSettled]);
 const lastTick = Math.max(RULER.minimumTicks, Math.ceil((target ?? 0) / RULER.tickKg) + RULER.tailTicks);
 return <View>
  <AnimatedInput testID="animated-weight" accessibilityLabel="Peso líquido simulado" editable={false} pointerEvents="none" underlineColorAndroid="transparent" animatedProps={props} defaultValue={target === undefined ? '— kg' : '0,00 kg'} style={[style, styles.number]} />
  <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.ruler}>
   <Animated.View testID="weight-ruler-track" style={[styles.track, {width:(lastTick + RULER.beforeZero + 1) * RULER.tickWidth,marginLeft:-RULER.beforeZero * RULER.tickWidth}, trackStyle]}>
    {Array.from({length:lastTick + RULER.beforeZero + 1},(_,index)=>{
     const tick = index - RULER.beforeZero;
     const major = tick % 10 === 0;
     return <View key={tick} style={[styles.tickSlot,{left:index * RULER.tickWidth}]}>
      <View style={[styles.tick,{height:major?44:tick%5===0?30:18,opacity:tick<0?0.25:1}]}/>
      {major && tick >= 0 ? <Text style={styles.tickLabel}>{tick / 10}</Text> : null}
     </View>;
    })}
   </Animated.View>
   <View style={[styles.pointer,{backgroundColor:color}]}/>
   <View style={[styles.dot,{backgroundColor:color}]}/>
  </View>
 </View>;
}

const styles = StyleSheet.create({
 number: {...allo(54,35),padding:0,borderWidth:0,fontVariant:['tabular-nums']},
 ruler: {height:106,marginTop:24,overflow:'hidden'},
 track: {position:'absolute',left:'50%',top:0,height:100},
 tickSlot: {position:'absolute',top:12,width:1,height:74,alignItems:'center',justifyContent:'flex-start'},
 tick: {width:1,backgroundColor:'#cfcad5'},
 tickLabel: {...allo(10,35),position:'absolute',top:55,width:32,textAlign:'center',fontSize:10,color:'#78717f',fontVariant:['tabular-nums']},
 pointer: {position:'absolute',left:'50%',marginLeft:-1,top:0,width:2,height:66,borderRadius:1},
 dot: {position:'absolute',left:'50%',top:72,marginLeft:-3,width:6,height:6,borderRadius:3},
});
