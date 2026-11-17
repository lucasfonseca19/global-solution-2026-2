import {useEffect,useState} from 'react';
import {AppState} from 'react-native';
import {localServiceDay} from './data/serviceDay';
/** Atualiza na meia-noite local e ao retornar ao app. A gravação revalida o relógio. */
export function useServiceDay(){
 const [day,setDay]=useState(localServiceDay);
 useEffect(()=>{
  let timer:ReturnType<typeof setTimeout>;
  function refresh(){
   clearTimeout(timer);setDay(localServiceDay());
   const now=new Date(),midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
   timer=setTimeout(refresh,midnight.getTime()-now.getTime()+50);
  }
  refresh();const subscription=AppState.addEventListener('change',state=>{if(state==='active')refresh();});
  return()=>{clearTimeout(timer);subscription.remove();};
 },[]);
 return day;
}
