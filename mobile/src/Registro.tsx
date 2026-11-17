import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { AppText as Text } from './typography';
import { cenarios } from '../../iot/shared';
import type { DataAccess, Sessao, Servico, Previa, Leitura } from './data/types';
import { Button, Page, ErrorText, styles, peso, message } from './ui';
import {localServiceDay,requireCurrentServiceDay,READ_ONLY_DAY} from './data/serviceDay';
import {useServiceDay} from './useServiceDay';
const categories = ['SOBRA_DESCARTADA', 'RESTO_PRATO'] as const;
const label = (c: string) => c === 'SOBRA_DESCARTADA' ? 'Sobra descartada' : 'Resto comestível do prato';
export function Registro({api, session, onDetails, initialService}: {initialService?: Servico; api: DataAccess; session: Sessao; onDetails: (id: number) => void}) {
 const currentDay=useServiceDay();
 const [date] = useState(initialService?.data ?? localServiceDay());
 const [tipo,setTipo] = useState(initialService?.tipoRefeicao ?? 'Almoço');
 const [ready,setReady] = useState(!!initialService);
 const [service,setService] = useState<Servico | undefined>(initialService);
 const [preview,setPreview] = useState<Previa>();
 const [panel,setPanel] = useState(false);
 const [busy,setBusy] = useState(false);
 const [error,setError] = useState('');
 const [notice,setNotice] = useState('');
 const generation = useRef(0);
 function invalidate() { generation.current++; setReady(false); setService(undefined); setPreview(undefined); setNotice(''); setError(''); }
 async function search() {
  if(busy) return;
  setPreview(undefined); setNotice(''); setError(''); setReady(false); setBusy(true);
  const version = ++generation.current;
  try {
   requireCurrentServiceDay(date);
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date || !tipo.trim()) throw new Error('Informe uma data válida em AAAA-MM-DD e o tipo de refeição.');
   const rows=await api.listar(session.token);
   if(version !== generation.current) return;
   const existing=rows.find(s=>s.data===date && s.tipoRefeicao.toLocaleLowerCase('pt-BR')===tipo.trim().toLocaleLowerCase('pt-BR'));
   setService(existing); setReady(true); setNotice(existing ? 'Serviço encontrado. Continue suas pesagens.' : 'Novo serviço. Será criado somente na primeira confirmação.');
  } catch(e) { if(version === generation.current) {setService(undefined);setError(message(e));} }
  finally {setBusy(false);}
 }
 async function read(leitura: Leitura) {
  if(busy || !ready) return;
  const version=++generation.current;
  setPreview(undefined);setError('');setNotice('');setBusy(true);
  try { requireCurrentServiceDay(date); const p=await api.avaliar(session.token,leitura); if(version===generation.current) setPreview(p); }
  catch(e) {if(version===generation.current) setError(message(e));}
  finally {setBusy(false);}
 }
 async function confirm() {
  if(!preview || busy || !ready) return;
  const version=++generation.current;
  setBusy(true);setError('');setNotice('');
  try {
   requireCurrentServiceDay(date);
   // PUT envia o conjunto completo, substituindo somente a categoria da leitura ativa.
   const readings: Leitura[] = categories.flatMap(c => {
    const p=c===preview.categoria ? preview : service?.pesagens[c];
    return p ? [{codigoRfid:p.codigoRfid,pesoBrutoKg:p.pesoBrutoKg}] : [];
   });
   const input={data:date,tipoRefeicao:tipo.trim(),pesagens:readings};
   const saved=service ? await api.atualizar(session.token,service.id,input) : await api.criar(session.token,input);
   if(!saved?.id) throw new Error('Gravação não confirmada. Procure o serviço e tente novamente.');
   if(version===generation.current) {setService(saved);setPreview(undefined);setNotice('Pesagem confirmada e salva na demonstração.');}
  } catch(e) {if(version===generation.current) {setPreview(undefined);setError(message(e));}}
  finally {setBusy(false);}
 }
 if(date!==currentDay)return <Page><Text accessibilityRole="header" style={styles.title}>Somente consulta</Text><Text style={styles.text}>{READ_ONLY_DAY}</Text>{initialService?<Button title="Ver detalhes do serviço" onPress={()=>onDetails(initialService.id)}/>:null}</Page>;
 return <Page>
  <Text accessibilityRole="header" style={styles.title}>Registrar descarte</Text>
  <Text style={styles.text}>Informe o serviço e confira o alimento pesado antes de confirmar.</Text>
  <Text style={styles.strong}>Data do serviço</Text>
  <Text style={styles.text}>{date.split('-').reverse().join('/')} · hoje</Text>
  <Text style={styles.strong}>Tipo de refeição</Text>
  <TextInput accessibilityLabel="Tipo de refeição" value={tipo} editable={!busy} onChangeText={v=>{invalidate();setTipo(v);}} style={styles.input}/>
  <Button title="Procurar serviço" onPress={search} disabled={busy}/>
  {notice ? <Text accessibilityLiveRegion="polite" style={styles.text}>{notice}</Text> : null}
  {error ? <ErrorText text={error}/> : null}
  {ready ? <>
   <View style={styles.notice}>
    <Text style={styles.strong}>{service?.status==='COMPLETO' ? 'Total confirmado' : 'Total parcial'}: {peso(service?.totalKg ?? 0)}</Text>
    {categories.map(c=><Text key={c} style={styles.text}>{label(c)}: {service?.pesagens[c] ? peso(service.pesagens[c]!.pesoLiquidoKg) : 'Aguardando pesagem'}</Text>)}
   </View>
   {preview ? <View style={styles.card}>
    <Text style={styles.strong}>Prévia simulada · {label(preview.categoria)}</Text>
    <Text style={styles.title}>{peso(preview.pesoLiquidoKg)}</Text>
    <Text style={styles.text}>Alimento · ainda não gravado</Text>
    <Text style={styles.caption}>{preview.codigoRfid} · Bruto {peso(preview.pesoBrutoKg)} − Tara {peso(preview.taraKg)}</Text>
    {service?.pesagens[preview.categoria] ? <Text style={styles.text}>Esta confirmação substituirá o peso anterior desta categoria.</Text> : null}
    <Button title={service?.pesagens[preview.categoria] ? "Atualizar pesagem" : "Confirmar pesagem"} disabled={busy} onPress={confirm}/>
   </View> : <Text style={styles.text}>Aguardando leitura da lixeira na balança.</Text>}
   <Button title={panel ? 'Recolher simulação' : 'Abrir simulação'} onPress={()=>setPanel(v=>!v)} disabled={busy}/>
   {panel ? <View style={styles.card}>
    <Text style={styles.strong}>Controles de demonstração · sensores simulados</Text>
    <Text style={styles.text}>RFID identifica a lixeira automaticamente; a balança fornece o peso bruto.</Text>
    {Object.entries(cenarios).map(([key,c])=><Button key={key} title={`Simular: ${c.nome}`} onPress={()=>read(c.leitura)} disabled={busy}/>)}
   </View> : null}
   {service?.status==='COMPLETO' ? <Button title="Ver detalhes do serviço" onPress={()=>onDetails(service.id)} disabled={busy}/> : null}
  </> : null}
  {busy ? <Text accessibilityLiveRegion="polite" style={styles.text}>Processando…</Text> : null}
 </Page>;
}
