import {useEffect,useState} from 'react';
import {AppState} from 'react-native';
import {localServiceDay,serviceDayCheckDelay} from './data/serviceDay';
/** Atualiza na virada do dia da escola e ao retornar ao app. O servidor revalida escritas. */
export function useServiceDay(){
 const [day,setDay]=useState(localServiceDay);
 useEffect(()=>{
  let timer:ReturnType<typeof setTimeout>;
  function refresh(){
   clearTimeout(timer);setDay(localServiceDay());
   timer=setTimeout(refresh,serviceDayCheckDelay());
  }
  refresh();const subscription=AppState.addEventListener('change',state=>{if(state==='active')refresh();});
  return()=>{clearTimeout(timer);subscription.remove();};
 },[]);
 return day;
}
