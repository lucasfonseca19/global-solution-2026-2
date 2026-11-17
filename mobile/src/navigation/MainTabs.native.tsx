import {createNativeBottomTabNavigator} from '@react-navigation/bottom-tabs/unstable';
import {Platform} from 'react-native';
import type {MainTabRoutes,MainTabsProps} from './MainTabs.types';
import {COLORS} from '../preview/PreviewUi';
const Tabs=createNativeBottomTabNavigator<MainTabRoutes>();
/** iOS/Android: tab bar do sistema, com insets e acessibilidade nativos. */
export function MainTabs({home,history}:MainTabsProps){
 return <Tabs.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:COLORS.accent,tabBarLabelVisibilityMode:'labeled'}}>
  <Tabs.Screen name="Hoje" options={{title:'Hoje',tabBarIcon:Platform.OS==='ios'?{type:'sfSymbol',name:'calendar'}:{type:'image',source:require('../../assets/navigation/calendar.png')}}}>{home}</Tabs.Screen>
  <Tabs.Screen name="Historico" options={{title:'Histórico',tabBarIcon:Platform.OS==='ios'?{type:'sfSymbol',name:'clock'}:{type:'image',source:require('../../assets/navigation/history.png')}}}>{history}</Tabs.Screen>
 </Tabs.Navigator>;
}
