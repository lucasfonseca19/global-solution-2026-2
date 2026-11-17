import {test,expect,type Page} from '@playwright/test';
async function login(page:Page) {
 await page.getByLabel('Login',{exact:true}).fill('demo');
 await page.getByLabel('Senha',{exact:true}).fill('merenda-demo');
 await page.getByRole('button',{name:'Entrar na demonstração'}).click();
}
test('corrigir por detalhes persiste; sair, excluir e restaurar respeitam confirmação',async({page})=>{
 await page.goto('/'); await login(page);
 await page.getByRole('button',{name:/12\/11\/2026/}).click();
 await page.getByRole('button',{name:'Corrigir pesagens'}).click();
 await expect(page.getByText('12/11/2026 · hoje',{exact:true})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Data do serviço'})).toHaveCount(0);
 await page.getByRole('button',{name:'Abrir simulação'}).click();
 await page.getByRole('button',{name:'Simular: Pratos sem descarte'}).click();
 await expect(page.getByText('Esta confirmação substituirá o peso anterior desta categoria.')).toBeVisible();
 await page.getByRole('button',{name:'Atualizar pesagem'}).click();
 await expect(page.getByText('Total confirmado: 3,00 kg',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Ver detalhes do serviço'}).click();
 await expect(page.getByText('3,00 kg',{exact:true}).filter({visible:true})).toHaveCount(2);
 await page.reload(); await login(page);
 await expect(page.getByRole('button',{name:/12\/11\/2026.*Total: 3,00 kg/})).toHaveCount(1);
 await page.getByRole('button',{name:'Sair da demonstração'}).click(); await login(page);
 await page.getByRole('button',{name:/12\/11\/2026/}).click();
 await page.getByRole('button',{name:'Excluir serviço',exact:true}).click();
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await expect(page.getByText('Total do descarte monitorado')).toBeVisible();
 await page.getByRole('button',{name:'Excluir serviço',exact:true}).click();
 await page.getByRole('button',{name:'Confirmar exclusão'}).click();
 await expect(page.getByRole('button',{name:/12\/11\/2026/})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/13\/11\/2026/})).toBeVisible();
 await page.getByRole('button',{name:'Restaurar exemplos',exact:true}).click();
 await page.getByRole('button',{name:'Cancelar',exact:true}).click();
 await expect(page.getByRole('button',{name:/12\/11\/2026/})).toHaveCount(0);
 await page.getByRole('button',{name:'Restaurar exemplos',exact:true}).click();
 await page.getByRole('button',{name:'Confirmar restauração'}).click();
 await expect(page.getByRole('button',{name:/12\/11\/2026.*Total: 5,00 kg/})).toBeVisible();
 await page.reload(); await login(page);
 await expect(page.getByRole('button',{name:/12\/11\/2026.*Total: 5,00 kg/})).toBeVisible();
 await page.screenshot({path:'test-results/historico-restaurado-dia-atual.png',fullPage:true});
});

// Cada teste começa com armazenamento próprio vazio; recargas dentro do teste preservam dados.
test.beforeEach(async ({page}) => {
 await page.clock.setFixedTime(new Date(2026,10,12,12));
 await page.goto('/');
 await page.evaluate(() => localStorage.clear());
 await page.reload();
});

test('abrir detalhes descarta a correção anterior e preserva categoria já atualizada', async ({page}) => {
 await page.goto('/'); await login(page);
 await page.getByRole('button',{name:/12\/11\/2026/}).click();
 await page.getByRole('button',{name:'Corrigir pesagens'}).click();
 await page.getByRole('button',{name:'Abrir simulação'}).click();
 await page.getByRole('button',{name:'Simular: Pratos sem descarte'}).click();
 await page.getByRole('button',{name:'Atualizar pesagem'}).click();
 await page.getByRole('button',{name:'Ver detalhes do serviço'}).click();
 await expect(page.getByText('Total do descarte monitorado').filter({visible:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Registrar descarte, back'})).toHaveCount(0);
 await page.getByRole('button',{name:'Corrigir pesagens'}).filter({visible:true}).click();
 await page.getByRole('button',{name:'Abrir simulação'}).click();
 await page.getByRole('button',{name:'Simular: Lixeira da cozinha'}).click();
 await page.getByRole('button',{name:'Atualizar pesagem'}).click();
 await expect(page.getByText('Total confirmado: 3,00 kg',{exact:true})).toBeVisible();
});

test('histórico anterior é só consulta e não oferece correção ou exclusão',async({page})=>{
 await page.clock.setFixedTime(new Date(2026,10,15,12));
 await page.goto('/');await login(page);
 await page.getByRole('button',{name:/13\/11\/2026/}).click();
 await expect(page.getByText(/Este registro está disponível apenas para consulta/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Corrigir pesagens',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Excluir serviço',exact:true})).toHaveCount(0);
});
