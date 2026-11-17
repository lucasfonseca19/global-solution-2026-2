const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
const out='../docs/evidencias/weighing-redesign';
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});
 const context=await b.newContext({viewport:{width:390,height:844},timezoneId:'America/Sao_Paulo'});
 const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.clock.install({time:new Date('2026-11-17T12:00:00-03:00')});
 const button=name=>p.getByRole('button',{name,exact:true});
 const shot=name=>p.screenshot({path:`${out}/${name}.png`,fullPage:true});
 async function simulate(label){await button('Simular pesagem').click();await button(label).click();}
 async function weigh(label){await simulate(label);await expect(p.getByText('Identificando lixeira…',{exact:true})).toBeVisible();await expect(button('Concluir serviço')).toBeDisabled();await expect(p.getByText('Pesando…',{exact:true})).toBeVisible();await expect(button('Confirmar pesagem')).toBeEnabled();}
 await p.goto('http://localhost:8094');await button('Entrar').click();await shot('home-preservada');
 await button('Almoço, Não iniciada, Pesar').click();await shot('aguardando');
 await simulate('Colocar lixeira de sobras');await button('Cancelar pesagem').click();
 await simulate('Etiqueta desconhecida');await expect(p.getByText(/Lixeira não reconhecida/)).toBeVisible();await expect(button('Confirmar pesagem')).toHaveCount(0);
 await simulate('Peso abaixo da tara');await expect(p.getByText(/Peso bruto menor/)).toBeVisible();
 await weigh('Colocar lixeira de sobras');await expect(p.getByText(/RFID-SIM-001 · Lixeira da cozinha/)).toBeVisible();await shot('peso-estavel');
 await button('Confirmar pesagem').dblclick();await expect(p.getByText('1 pesagem',{exact:true})).toBeVisible();
 if(await button('Nova pesagem').count())await button('Nova pesagem').click();await weigh('Colocar lixeira de sobras');await button('Confirmar pesagem').click();await expect(p.getByText('2 pesagens',{exact:true})).toBeVisible();
 await button('Nova pesagem').click();await weigh('Colocar lixeira de restos');await button('Confirmar pesagem').click();await expect(p.getByText('8,00 kg',{exact:true})).toBeVisible();
 await button('Voltar').click();await expect(button('Almoço, Em andamento, Continuar pesagem')).toBeVisible();await button('Almoço, Em andamento, Continuar pesagem').click();
 await weigh('Colocar lixeira de restos');await button('Voltar').click();await expect(p.getByText(/Descartar a leitura e sair/)).toBeVisible();await button('Continuar aqui').click();await button('Descartar leitura').click();await expect(p.getByText('8,00 kg',{exact:true})).toBeVisible();await button('Concluir serviço').click();await expect(p.getByRole('heading',{name:'Serviço concluído',exact:true})).toBeVisible();await shot('concluido');
 await button('Ver detalhes do serviço').click();await expect(p.getByText('Registro 2 · 3,00 kg',{exact:true})).toBeVisible();await button('Corrigir pesagens').click();
 // A lista abre por padrão para serviços completos; localizar pelo controle acessível.
 if(!await button('Corrigir registro 1').isVisible())await button('Pesagens registradas').click();
 await button('Corrigir registro 1').click();await button('Colocar lixeira de restos').click();await expect(p.getByText(/Use a mesma lixeira/)).toBeVisible();
 await simulate('Correção: cozinha 2,50 kg');await expect(button('Salvar correção')).toBeEnabled();await button('Salvar correção').click();await button('Voltar ao resultado').click();await expect(p.getByText('7,50 kg',{exact:true}).first()).toBeVisible();await expect(p.getByText('Concluído',{exact:true})).toBeVisible();await shot('correcao-individual');
 await button('Voltar').click();await button('Voltar').click(); // Detalhes -> Histórico
 await button('Hoje').click();await expect(button('Almoço, Concluída, Ver resultado')).toBeVisible();
 await button('Lanche da tarde, Não iniciada, Pesar').click();await weigh('Sobras sem descarte');await button('Confirmar pesagem').click();await button('Nova pesagem').click();await weigh('Pratos sem descarte');await button('Confirmar pesagem').click();await button('Concluir serviço').click();await expect(p.getByText('0,00 kg',{exact:true}).first()).toBeVisible();await button('Voltar').click();
 await button('Histórico').click();await shot('historico-preservado');await button(/^Almoço,.*incompleta/).click();await expect(p.getByText(/apenas para consulta/)).toBeVisible();await expect(button('Excluir serviço')).toHaveCount(0);
 await button('Voltar').click();await button('Hoje').click();await button('Almoço, Concluída, Ver resultado').click();await button('Excluir serviço').click();await button('Cancelar').click();await button('Excluir serviço').click();await button('Excluir serviço').click();await button('Hoje').click();await expect(button('Almoço, Não iniciada, Pesar')).toBeVisible();
 // Uma nova sessão simula a virada do dia com prévia não confirmada.
 const q=await context.newPage();q.on('pageerror',e=>errors.push(e.message));await q.clock.install({time:new Date('2026-11-17T23:00:00-03:00')});await q.goto('http://localhost:8094');const qb=name=>q.getByRole('button',{name,exact:true});await qb('Entrar').click();await qb('Almoço, Não iniciada, Pesar').click();await qb('Simular pesagem').click();await qb('Colocar lixeira de sobras').click();await expect(qb('Confirmar pesagem')).toBeEnabled();await q.clock.pauseAt(new Date('2026-11-17T23:59:59-03:00'));await q.clock.fastForward(2000);await expect(q.getByRole('heading',{name:'Somente consulta'})).toBeVisible();await expect(qb('Confirmar pesagem')).toHaveCount(0);await qb('Voltar').click();await expect(q.getByText('18 de novembro',{exact:true})).toBeVisible();
 await qb('Almoço, Não iniciada, Pesar').click();await q.clock.resume();await qb('Simular pesagem').click();await qb('Colocar lixeira de sobras').click();await expect(qb('Confirmar pesagem')).toBeEnabled();await q.setViewportSize({width:320,height:844});expect(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await q.screenshot({path:`${out}/mobile-320.png`,fullPage:true});await q.setViewportSize({width:1280,height:900});await q.screenshot({path:`${out}/desktop-1280.png`,fullPage:true});
 const reducedContext=await b.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});const r=await reducedContext.newPage();r.on('pageerror',e=>errors.push(e.message));await r.goto('http://localhost:8094');const rb=name=>r.getByRole('button',{name,exact:true});await rb('Entrar').click();await rb('Almoço, Não iniciada, Pesar').click();await rb('Simular pesagem').click();await rb('Colocar lixeira de sobras').click();await expect(rb('Confirmar pesagem')).toBeEnabled();expect(errors).toEqual([]);fs.writeFileSync(`${out}/qa.json`,JSON.stringify({result:'PASS',scenarios:['RFID inválido','tara inválida','identificação e estabilização','duplo clique','múltiplas pesagens','conclusão explícita','descarte e saída protegida','correção individual concluída','zero nas duas categorias','Home e Histórico','histórico somente consulta','cancelar identificação e tentar novamente','exclusão com confirmação','virada do dia','movimento reduzido','layout 320 e 1280 px'],pageErrors:errors},null,2));await b.close();console.log('PASS: fluxo de pesagem e regressões.');
})().catch(e=>{console.error(e);process.exit(1)});
