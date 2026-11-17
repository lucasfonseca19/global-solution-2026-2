const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(__dirname,'../docs/evidencias/backend-integration');
const appUrl=process.env.QA_APP_URL??'http://localhost:18094';
const simUrl=process.env.QA_SIMULATOR_URL??'http://127.0.0.1:18095';
const apiUrl=process.env.QA_API_URL??'http://localhost:18080';
// Executar somente contra o banco isolado descrito no README destas evidências.
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const evidence=[];
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const ctx=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/Sao_Paulo'});
 const app=await ctx.newPage(),sim=await ctx.newPage(),errors=[];
 app.on('pageerror',e=>errors.push(e.message));
 const button=name=>app.getByRole(name==='Hoje'||name==='Histórico'?'tab':'button',{name,exact:true});
 const pass=name=>evidence.push({cenario:name,status:'PASS'});
 async function login(password='merenda123'){
  await app.getByLabel('Login',{exact:true}).fill('operador');await app.getByLabel('Senha',{exact:true}).fill(password);await button('Entrar').click();
 }
 async function ready(){await expect(app.getByText('Balança conectada',{exact:true})).toBeVisible();}
 async function emit(key){await sim.selectOption('#scenario',key);await sim.getByRole('button',{name:'Colocar na balança',exact:true}).click();}
 async function read(key,label='Confirmar pesagem'){await ready();await emit(key);await expect(button(label)).toBeEnabled({timeout:15000});}
 await sim.goto(simUrl);await emit('sobra');await app.goto(appUrl);
 await login('errada');await expect(app.getByText('Login ou senha inválidos.',{exact:true})).toBeVisible();pass('Login real inválido rejeitado');await login();
 await button('Histórico').click();await expect(app.getByText('0 registros',{exact:true})).toBeVisible();pass('Banco novo sem histórico fictício');await button('Hoje').click();
 await button('Almoço, Não iniciada, Pesar').click();await ready();await app.waitForTimeout(800);await expect(button('Confirmar pesagem')).toHaveCount(0);pass('Entrada não reproduz evento antigo do simulador');
 await emit('desconhecido');await expect(app.getByText(/Lixeira não reconhecida/)).toBeVisible();await ready();await emit('abaixo');await expect(app.getByText(/menor que a tara/)).toBeVisible();pass('RFID e tara validados na API sem gravação');
 await read('sobra');
 let dropped=false;
 await app.route(`${apiUrl}/pesagens`,async route=>{
  if(!dropped&&route.request().method()==='POST'){dropped=true;const response=await route.fetch();expect(response.status()).toBe(200);await route.abort('failed');}
  else await route.continue();
 });
 await button('Confirmar pesagem').click();await expect(app.getByText(/Não foi possível comunicar com a API/)).toBeVisible();await expect(button('Confirmar pesagem')).toBeEnabled();await button('Confirmar pesagem').click();await expect(app.getByText('1 pesagem',{exact:true})).toBeVisible();pass('Resposta perdida após commit: retry mantém um registro e mesmo ciclo');await app.unroute(`${apiUrl}/pesagens`);
 await button('Nova pesagem').click();await read('sobra');await button('Confirmar pesagem').click();await button('Nova pesagem').click();await read('restos');await button('Confirmar pesagem').click();await expect(app.getByText('8,00 kg',{exact:true})).toBeVisible();await expect(app.getByText('Em andamento',{exact:true})).toBeVisible();pass('Contribuições individuais somam e ambas categorias não concluem automaticamente');
 await button('Concluir serviço').click();await expect(app.getByRole('heading',{name:'Serviço concluído',exact:true})).toBeVisible();
 await app.screenshot({path:path.join(out,'servico-concluido.png'),fullPage:true});pass('Conclusão explícita persistida');
 await button('Ver detalhes do serviço').click();await button('Corrigir pesagens').click();await button('Corrigir registro 1').click();await ready();await emit('restos');await expect(app.getByText(/Use a mesma lixeira/)).toBeVisible();await read('correcao','Salvar correção');await button('Salvar correção').click();await button('Voltar ao resultado').click();await expect(app.getByText('7,50 kg',{exact:true}).first()).toBeVisible();pass('Correção individual preserva outras contribuições e conclusão');
 await app.reload();await expect(app.getByLabel('Login',{exact:true})).toBeVisible();await login();await button('Almoço, Concluída, Ver resultado').click();await expect(app.getByText('7,50 kg',{exact:true})).toBeVisible();pass('Recarga encerra sessão e preserva registros no PostgreSQL');
 await button('Voltar').click();await button('Hoje').click();await button('Lanche da tarde, Não iniciada, Pesar').click();await read('zeroSobra');await button('Confirmar pesagem').click();await expect(button('Concluir serviço')).toBeDisabled();await button('Nova pesagem').click();await read('zero');await button('Confirmar pesagem').click();await button('Concluir serviço').click();await expect(app.getByText('0,00 kg',{exact:true}).first()).toBeVisible();pass('Zero confirmado nas duas categorias conclui; ausência bloqueia');
 await button('Voltar').click();await button('Histórico').click();await app.screenshot({path:path.join(out,'historico-api.png'),fullPage:true});await button(/^Almoço,.*concluída/).click();await button('Excluir serviço').click();await button('Cancelar').click();await button('Excluir serviço').click();await button('Excluir serviço').click();await button('Hoje').click();await expect(button('Almoço, Não iniciada, Pesar')).toBeVisible();pass('Exclusão confirmada remove serviço e contribuições');
 expect(errors).toEqual([]);pass('Nenhum erro JavaScript de página');
 fs.writeFileSync(path.join(out,'web.json'),JSON.stringify({result:'PASS',fronteira:'Expo web → Java → PostgreSQL; ponte RFID/balança separada',evidence,pageErrors:errors},null,2));
 console.log(`PASS: ${evidence.length} cenários integrados.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
