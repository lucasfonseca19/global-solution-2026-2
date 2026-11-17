import {createContext,useContext,useState} from 'react';
import {Alert,Modal,Platform,Pressable,StyleSheet,View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '../rnr/text';
import type {DataMode} from '../data/mode';
export const AppModeContext=createContext<{mode:DataMode;onChange:(next:DataMode)=>Promise<void>}|undefined>(undefined);
/** A troca só é oferecida fora da pesagem: não abandona prévias nem gravações em andamento. */
export function ModeControl(){
 const context=useContext(AppModeContext),[confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 if(!context)return null;
 const demo=context.mode==='demo';
 const title=demo?'Voltar à API?':'Abrir demonstração?';
 const message=demo?'A sessão de demonstração será encerrada. Entre novamente para acessar os registros da escola. Os dados locais serão preservados.':'Você usará as mesmas telas com dados locais separados, sem alterar os registros da escola.';
 async function change(){
  if(busy)return;setBusy(true);setError('');
  try{await context!.onChange(demo?'api':'demo');setConfirm(false);}catch(e){setError(e instanceof Error?e.message:'Não foi possível trocar o modo.');}finally{setBusy(false);}
 }
 function ask(){
  if(Platform.OS==='web')setConfirm(true);
  else Alert.alert(title,message,[{text:'Cancelar',style:'cancel'},{text:demo?'Voltar à API':'Abrir demonstração',onPress:()=>void change()}]);
 }
 return <View style={styles.control}>
  <Pressable cssInterop={false} accessibilityRole="button" disabled={busy} onPress={ask} style={styles.trigger}>
   <Text style={styles.link}>{busy?'Abrindo…':demo?'Voltar à API':'Demonstração'}</Text>
  </Pressable>
  {demo?<Text style={styles.badge}>Dados locais · demonstração</Text>:null}
  {error?<Text accessibilityRole="alert" style={styles.error}>{error}</Text>:null}
  {Platform.OS==='web'?<Modal visible={confirm} transparent animationType="fade" onRequestClose={()=>{if(!busy)setConfirm(false);}}>
   <SafeAreaView style={styles.backdrop}><View accessibilityViewIsModal style={styles.dialog}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text>
    <View style={styles.actions}><Pressable cssInterop={false} accessibilityRole="button" disabled={busy} onPress={()=>setConfirm(false)} style={styles.trigger}><Text style={styles.link}>Cancelar</Text></Pressable><Pressable cssInterop={false} accessibilityRole="button" disabled={busy} onPress={()=>void change()} style={styles.trigger}><Text style={styles.link}>{demo?'Voltar à API':'Abrir demonstração'}</Text></Pressable></View>
    {error?<Text accessibilityRole="alert" style={styles.error}>{error}</Text>:null}
   </View></SafeAreaView>
  </Modal>:null}
 </View>;
}
export function ModeBadge(){const context=useContext(AppModeContext);return context?.mode==='demo'?<Text style={styles.badge}>Demonstração · dados locais</Text>:null;}
const styles=StyleSheet.create({
 control:{alignItems:'flex-end',maxWidth:180},trigger:{minHeight:44,minWidth:44,paddingHorizontal:8,justifyContent:'center',alignItems:'center'},link:{fontSize:12,lineHeight:18,color:'#706a77'},badge:{fontSize:10,lineHeight:16,color:'#78229e'},error:{fontSize:12,color:'#a12646'},
 backdrop:{flex:1,backgroundColor:'#211b2766',justifyContent:'center',padding:24},dialog:{width:'100%',maxWidth:380,alignSelf:'center',backgroundColor:'#fff',padding:24,borderRadius:16,gap:14},title:{fontSize:22,lineHeight:28,color:'#211b27'},message:{fontSize:14,lineHeight:22,color:'#706a77'},actions:{flexDirection:'row',justifyContent:'flex-end',gap:12},
});
