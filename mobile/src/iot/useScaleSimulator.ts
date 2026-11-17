import {useEffect,useRef,useState} from 'react';
import {AppState,Platform} from 'react-native';
import type {Leitura} from '../data/types';
import {connectScale,type ScaleConnection} from './scaleSource';
const hostname=Platform.OS==='web'&&typeof window!=='undefined'?window.location.hostname:'localhost';
const SIMULATOR_URL=process.env.EXPO_PUBLIC_SIMULATOR_URL??`http://${hostname}:8095`;
export function useScaleSimulator(enabled:boolean,onReading:(reading:Leitura)=>void){
 const [connection,setConnection]=useState<ScaleConnection>('connecting');
 const [active,setActive]=useState(Platform.OS==='web'||AppState.currentState==='active');
 const callback=useRef(onReading);callback.current=onReading;
 useEffect(()=>{if(Platform.OS==='web')return;const subscription=AppState.addEventListener('change',state=>setActive(state==='active'));return()=>subscription.remove();},[]);
 useEffect(()=>{
  if(!enabled||!active)return;
  return connectScale({url:SIMULATOR_URL,onStatus:setConnection,onReading:reading=>callback.current(reading)});
 },[enabled,active]);
 return connection;
}
