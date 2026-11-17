const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
const evidence={};
(async()=>{
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:390,height:844}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:8094');await p.getByRole('button',{name:'Entrar',exact:true}).click();
await expect(p.getByRole('button',{name:'Almoço, Não iniciada, Pesar',exact:true})).toBeVisible();
await expect(p.getByRole('button',{name:'Lanche da tarde, Não iniciada, Pesar',exact:true})).toBeVisible();
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(300);
await p.screenshot({path:'../docs/evidencias/home-preview/mobile.png'});
const fontEvidence=await p.getByRole('button',{name:'Almoço, Não iniciada, Pesar',exact:true}).evaluate(row=>{const c=getComputedStyle(row.querySelector('[style*=font-variation-settings]')||row.firstElementChild);return {family:c.fontFamily,axes:c.fontVariationSettings,faces:[...document.fonts].filter(f=>f.family.includes('Allo')).map(f=>({family:f.family,weight:f.weight,status:f.status}))};});
expect(fontEvidence.family).toContain('Allo');expect(fontEvidence.faces.some(f=>f.status==='loaded'&&f.weight==='100 900')).toBe(true);
evidence.homeFont=fontEvidence;console.log('Allo carregada:',JSON.stringify(fontEvidence));
await p.setViewportSize({width:1280,height:900});await p.waitForTimeout(300);await p.screenshot({path:'../docs/evidencias/home-preview/desktop.png'});
await p.setViewportSize({width:390,height:844});
await p.getByRole('button',{name:'Lanche da tarde, Não iniciada, Pesar',exact:true}).click();
await expect(p.getByText('Lanche da tarde',{exact:true}).last()).toBeVisible();
await expect(p.getByRole('button',{name:'Continuar',exact:true})).toHaveCount(0);
await p.getByRole('button',{name:'Simular pesagem',exact:true}).click();
await p.getByRole('button',{name:'Colocar lixeira de sobras',exact:true}).click();
await expect(p.getByRole('button',{name:'Confirmar pesagem',exact:true})).toBeEnabled();
if(!evidence.weightFont){
 evidence.weightFont=await p.getByTestId('animated-weight').evaluate(el=>{
  const c=getComputedStyle(el),host=document.createElement('div');
  Object.assign(host.style,{position:'absolute',visibility:'hidden',whiteSpace:'nowrap',fontFamily:c.fontFamily,fontSize:c.fontSize,fontWeight:c.fontWeight,fontVariationSettings:c.fontVariationSettings,fontVariant:c.fontVariant,letterSpacing:c.letterSpacing});
  document.body.append(host);
  host.textContent='11111111';
  // inline-block mede o texto, não a largura da página.
  host.style.display='inline-block';host.style.width='max-content';
  const one=host.getBoundingClientRect().width;host.textContent='88888888';const eight=host.getBoundingClientRect().width;host.remove();
  return {family:c.fontFamily,axes:c.fontVariationSettings,numerals:c.fontVariantNumeric,one,eight};
 });
 expect(evidence.weightFont.family).toContain('Allo');expect(evidence.weightFont.axes).toContain('32');expect(evidence.weightFont.numerals).toBe('tabular-nums');expect(Math.abs(evidence.weightFont.one-evidence.weightFont.eight)).toBeLessThan(0.1);
 await p.screenshot({path:'../docs/evidencias/home-preview/pesagem-allo.png'});
}
await p.getByRole('button',{name:'Confirmar pesagem',exact:true}).click();
await p.getByRole('button',{name:'Voltar',exact:true}).click();
await expect(p.getByRole('button',{name:'Lanche da tarde, Em andamento, Continuar pesagem',exact:true})).toBeVisible();
await p.screenshot({path:'../docs/evidencias/home-preview/mobile-em-andamento.png'});
await p.setViewportSize({width:320,height:740});await p.waitForTimeout(200);
const activeRow=p.getByRole('button',{name:'Lanche da tarde, Em andamento, Continuar pesagem',exact:true});
evidence.smallHome=await activeRow.evaluate(row=>({viewport:innerWidth,right:row.getBoundingClientRect().right,children:[...row.querySelectorAll('div')].filter(e=>e.textContent==='Continuar pesagem').map(e=>({right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left}))}));
expect(evidence.smallHome.right).toBeLessThanOrEqual(320);expect(evidence.smallHome.children.every(c=>c.right<=320&&c.left>=0)).toBe(true);
await p.screenshot({path:'../docs/evidencias/home-preview/mobile-320.png'});
await p.setViewportSize({width:390,height:844});
await p.getByRole('button',{name:'Lanche da tarde, Em andamento, Continuar pesagem',exact:true}).click();
await p.getByRole('button',{name:'Simular pesagem',exact:true}).click();
await p.getByRole('button',{name:'Colocar lixeira de restos',exact:true}).click();
await expect(p.getByRole('button',{name:'Confirmar pesagem',exact:true})).toBeEnabled();
if(!evidence.weightFont){
 evidence.weightFont=await p.getByTestId('animated-weight').evaluate(el=>{
  const c=getComputedStyle(el),host=document.createElement('div');
  Object.assign(host.style,{position:'absolute',visibility:'hidden',whiteSpace:'nowrap',fontFamily:c.fontFamily,fontSize:c.fontSize,fontWeight:c.fontWeight,fontVariationSettings:c.fontVariationSettings,fontVariant:c.fontVariant,letterSpacing:c.letterSpacing});
  document.body.append(host);
  host.textContent='11111111';
  // inline-block mede o texto, não a largura da página.
  host.style.display='inline-block';host.style.width='max-content';
  const one=host.getBoundingClientRect().width;host.textContent='88888888';const eight=host.getBoundingClientRect().width;host.remove();
  return {family:c.fontFamily,axes:c.fontVariationSettings,numerals:c.fontVariantNumeric,one,eight};
 });
 expect(evidence.weightFont.family).toContain('Allo');expect(evidence.weightFont.axes).toContain('32');expect(evidence.weightFont.numerals).toBe('tabular-nums');expect(Math.abs(evidence.weightFont.one-evidence.weightFont.eight)).toBeLessThan(0.1);
 await p.screenshot({path:'../docs/evidencias/home-preview/pesagem-allo.png'});
}
await p.getByRole('button',{name:'Confirmar pesagem',exact:true}).click();
await p.getByRole('button',{name:'Voltar',exact:true}).click();
await expect(p.getByRole('button',{name:'Lanche da tarde, Concluída, Ver resultado',exact:true})).toBeVisible();
await p.screenshot({path:'../docs/evidencias/home-preview/mobile-concluida.png'});
await p.getByRole('button',{name:'Histórico',exact:true}).click();await expect(p.getByRole('heading',{name:'Histórico',exact:true})).toBeVisible();
await p.getByRole('button',{name:'Hoje',exact:true}).click();await expect(p.getByRole('button',{name:'Lanche da tarde, Concluída, Ver resultado',exact:true})).toBeVisible();
await p.getByRole('button',{name:'Lanche da tarde, Concluída, Ver resultado',exact:true}).click();await expect(p.getByRole('heading',{name:'Lanche da tarde',exact:true})).toBeVisible();
evidence.identifierFont=await p.getByText(/peso confirmado$/).first().evaluate(el=>{const c=getComputedStyle(el);return {family:c.fontFamily,features:c.fontFeatureSettings,numerals:c.fontVariantNumeric};});
expect(evidence.identifierFont.features).toContain('ss02');expect(evidence.identifierFont.numerals).toBe('tabular-nums');
evidence.pageErrors=errors;fs.writeFileSync('../docs/evidencias/home-preview/allo-qa.json',JSON.stringify(evidence,null,2)+'\n');
expect(errors).toEqual([]);console.log('PASS Home: refeições, contexto direto, retomada, estados refletidos do adaptador, navegação Hoje/Histórico e detalhes; sem pageerror.');
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
