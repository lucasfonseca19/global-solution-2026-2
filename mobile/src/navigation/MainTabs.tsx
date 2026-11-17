import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import type {MainTabRoutes,MainTabsProps} from './MainTabs.types';
import {COLORS} from '../preview/PreviewUi';
import {ALLO_FAMILY} from '../typography';
const Tabs=createBottomTabNavigator<MainTabRoutes>();
/** Web: mesma estrutura de rotas; renderização acessível da biblioteca. */
export function MainTabs({home,history}:MainTabsProps){
 return <Tabs.Navigator screenOptions={({route})=>({
  headerShown:false,tabBarActiveTintColor:COLORS.accent,tabBarInactiveTintColor:COLORS.muted,
  tabBarLabelPosition:'below-icon',tabBarLabelStyle:{fontFamily:ALLO_FAMILY,fontSize:12},
  tabBarStyle:{height:68,paddingTop:8,paddingBottom:8,borderTopColor:COLORS.line,maxWidth:480,width:'100%',alignSelf:'center'},
  sceneStyle:{backgroundColor:'#fff'},
  tabBarIcon:({color})=><Image source={route.name==='Hoje'?require('../../assets/navigation/calendar.png'):require('../../assets/navigation/history.png')} style={{width:23,height:23,tintColor:color}}/>,
 })}>
  <Tabs.Screen name="Hoje" options={{title:'Hoje',tabBarAccessibilityLabel:'Hoje'}}>{home}</Tabs.Screen>
  <Tabs.Screen name="Historico" options={{title:'Histórico',tabBarAccessibilityLabel:'Histórico'}}>{history}</Tabs.Screen>
 </Tabs.Navigator>;
}
