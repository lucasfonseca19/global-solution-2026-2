-- Testes das regras de integridade do banco. Cada comando DEVE falhar.
\echo '--- T1: serviço duplicado (mesma data e refeição) ---'
INSERT INTO servico_alimentacao (data_servico, tipo_refeicao, usuario_id) VALUES ('2026-11-12', 'Almoço', 1);
\echo '--- T2: segunda pesagem da mesma categoria no mesmo serviço ---'
INSERT INTO pesagem (servico_id, lixeira_id, categoria_id, peso_bruto_kg, tara_kg, peso_liquido_kg) VALUES (5, 1, 1, 6, 1, 5);
\echo '--- T3: peso bruto menor que a tara ---'
INSERT INTO pesagem (servico_id, lixeira_id, categoria_id, peso_bruto_kg, tara_kg, peso_liquido_kg) VALUES (6, 2, 2, 1, 1.5, -0.5);
\echo '--- T4: categoria diferente da lixeira usada (lixeira da cozinha como resto de prato) ---'
INSERT INTO pesagem (servico_id, lixeira_id, categoria_id, peso_bruto_kg, tara_kg, peso_liquido_kg) VALUES (6, 1, 2, 3, 1, 2);
\echo '--- T5: senha sem hash ---'
INSERT INTO usuario (nome, login, senha_hash) VALUES ('Teste', 'teste', 'senha123');
\echo '--- T6: excluir serviço remove as pesagens (ON DELETE CASCADE) - deve FUNCIONAR ---'
BEGIN;
SELECT COUNT(*) AS pesagens_do_servico_3_antes FROM pesagem WHERE servico_id = 3;
DELETE FROM servico_alimentacao WHERE id = 3;
SELECT COUNT(*) AS pesagens_do_servico_3_depois FROM pesagem WHERE servico_id = 3;
ROLLBACK;
