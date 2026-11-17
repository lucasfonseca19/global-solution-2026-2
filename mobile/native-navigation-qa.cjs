const {chromium,expect}=require('@playwright/test');const fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../docs/evidencias/native-navigation');
const url=process.env.QA_APP_URL??'http://localhost:18096',api=process.env.QA_API_URL??'http://192.168.15.6:18080',sim=process.env.QA_SIMULATOR_URL??'http://127.0.0.1:18097';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const evidence=[],errors=[];fs.mkdirSync(out,{recursive:true});
 const pass=cenario=>{evidence.push({cenario,status:'PASS'});console.log('PASS:',cenario);};
 try{
 const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/Sao_Paulo'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const button=name=>page.getByRole('button',{name,exact:true}),tab=name=>page.getByRole('tab',{name,exact:true});
 const login=async()=>{await page.getByLabel('Login',{exact:true}).fill('operador');await page.getByLabel('Senha',{exact:true}).fill('merenda123');await button('Entrar').click();};
 async function mode(demo){await button(demo?'Demonstração':'Voltar à API').click();await button(demo?'Abrir demonstração':'Voltar à API').last().click();}
 async function read(scenario){await expect(page.getByText('Balança conectada',{exact:true})).toBeVisible();await fetch(sim+'/readings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario})});await expect(button('Confirmar pesagem')).toBeEnabled({timeout:15000});}
 const auth=await fetch(api+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login:'operador',senha:'merenda123'})}).then(r=>r.json());
 const list=()=>fetch(api+'/servicos',{headers:{Authorization:`Bearer ${auth.token}`}}).then(r=>r.json());const before=await list();
 await page.goto(url);await button('Demonstração').click();await button('Cancelar').click();await expect(page.getByLabel('Login',{exact:true})).toBeVisible();pass('Cancelar troca mantém login API');
 await mode(true);await expect(page.getByText('Dados locais · demonstração',{exact:true})).toBeVisible();await expect(tab('Hoje')).toBeVisible();pass('Demonstração abre as mesmas telas sem login fictício manual');
 const row=button('Almoço, Não iniciada, Pesar');await expect(row).toBeVisible();const labelBox=await row.getByText('Almoço',{exact:true}).boundingBox(),actionBox=await row.getByText('Pesar',{exact:true}).boundingBox();expect(actionBox.x).toBeGreaterThan(labelBox.x+labelBox.width);pass('Refeição e ação permanecem na mesma linha em 390px');
 await page.screenshot({path:path.join(out,'home-demo-390.png'),fullPage:true});await tab('Histórico').click();await expect(page.getByText('0 registros',{exact:true})).toBeVisible();await tab('Hoje').click();pass('Abas Hoje/Histórico funcionam no navegador');
 await row.click();await expect(button('Voltar à API')).toHaveCount(0);await expect(page.getByText('Demonstração · dados locais',{exact:true})).toBeVisible();await read('sobra');await button('Confirmar pesagem').click();await expect(page.getByText('1 pesagem',{exact:true})).toBeVisible();await button('Voltar').click();
 await mode(false);await expect(page.getByLabel('Login',{exact:true})).toBeVisible();expect(await list()).toEqual(before);pass('Retorno exige login real e não transferiu registro local para API');
 await login();await expect(tab('Hoje')).toBeVisible();await page.screenshot({path:path.join(out,'home-api-390.png'),fullPage:true});await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(out,'home-api-1280.png'),fullPage:true});
 await mode(true);await button('Almoço, Em andamento, Continuar pesagem').click();await expect(page.getByText('1 pesagem',{exact:true})).toBeVisible();pass('Trocar de modo preserva a contribuição local');
 await button('Voltar').click();await mode(false);
 let release;const gate=new Promise(resolve=>release=resolve);let pending=false;
 await page.route(api+'/auth/login',async route=>{pending=true;await gate;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(auth)});});
 await login();await expect.poll(()=>pending).toBe(true);await mode(true);await mode(false);release();await page.waitForTimeout(700);await expect(page.getByLabel('Login',{exact:true})).toBeVisible();pass('Resposta de login antiga não autentica outro modo/sessão');
 expect(errors).toEqual([]);pass('Sem erros de página');fs.writeFileSync(path.join(out,'web.json'),JSON.stringify({result:'PASS',evidence,pageErrors:errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
