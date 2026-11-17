import "./global.css";
import { useFonts } from 'expo-font';
import { fontSources } from './src/fontSources';
import { DesignPreview } from "./src/DesignPreview";
import { ActivityIndicator, Text as NativeText, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontSources);
  if (!fontsLoaded && !fontError) return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}><ActivityIndicator accessibilityLabel="Carregando interface" color="#9226d5" /></View>;
  return <View style={{flex:1}}>
    {fontError ? <NativeText accessibilityRole="alert" style={{padding:12,color:'#a12646',fontSize:14}}>A fonte não carregou. Exibindo a fonte do sistema.</NativeText> : null}
    <SafeAreaProvider><DesignPreview /></SafeAreaProvider>
  </View>;
}
