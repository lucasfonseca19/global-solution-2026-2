-- =====================================================================
-- Script 03: consultas que simulam o uso real do sistema
-- Executar depois de 01_schema.sql e 02_carga_inicial.sql.
-- =====================================================================

-- 1) Histórico (tela inicial do app): cada serviço com o peso de cada
--    categoria, o total e a situação. Categoria sem pesagem = aguardando.
SELECT s.id,
       s.data_servico,
       s.tipo_refeicao,
       SUM(p.peso_liquido_kg) FILTER (WHERE c.codigo = 'SOBRA_DESCARTADA') AS sobra_kg,
       SUM(p.peso_liquido_kg) FILTER (WHERE c.codigo = 'RESTO_PRATO')      AS resto_prato_kg,
       COALESCE(SUM(p.peso_liquido_kg), 0)                                AS total_kg,
       CASE WHEN COUNT(p.id) = (SELECT COUNT(*) FROM categoria_descarte)
            THEN 'COMPLETO' ELSE 'PENDENTE' END                           AS status
FROM servico_alimentacao s
LEFT JOIN pesagem p            ON p.servico_id = s.id
LEFT JOIN categoria_descarte c ON c.id = p.categoria_id
GROUP BY s.id, s.data_servico, s.tipo_refeicao
ORDER BY s.data_servico DESC, s.tipo_refeicao;

-- 2) Total descartado por categoria em todo o período, com média por serviço.
SELECT c.codigo,
       c.descricao,
       COUNT(p.id)                        AS qtd_pesagens,
       SUM(p.peso_liquido_kg)             AS total_kg,
       ROUND(AVG(p.peso_liquido_kg), 3)   AS media_kg_por_servico
FROM categoria_descarte c
LEFT JOIN pesagem p ON p.categoria_id = c.id
GROUP BY c.codigo, c.descricao
ORDER BY total_kg DESC NULLS LAST;

-- 3) Descarte por tipo de refeição (almoço x lanche): onde se perde mais.
SELECT s.tipo_refeicao,
       COUNT(DISTINCT s.id)               AS qtd_servicos,
       SUM(p.peso_liquido_kg)             AS total_kg,
       ROUND(SUM(p.peso_liquido_kg) / COUNT(DISTINCT s.id), 3) AS media_kg_por_servico
FROM servico_alimentacao s
JOIN pesagem p ON p.servico_id = s.id
GROUP BY s.tipo_refeicao
ORDER BY total_kg DESC;

-- 4) Serviços que passaram do limite de alerta (5 kg no total),
--    o mesmo limite usado pela API para gerar o alerta.
SELECT s.data_servico,
       s.tipo_refeicao,
       SUM(p.peso_liquido_kg) AS total_kg
FROM servico_alimentacao s
JOIN pesagem p ON p.servico_id = s.id
GROUP BY s.id, s.data_servico, s.tipo_refeicao
HAVING SUM(p.peso_liquido_kg) > 5
ORDER BY total_kg DESC;

-- 5) Serviços pendentes e qual categoria ainda aguarda pesagem.
SELECT s.data_servico,
       s.tipo_refeicao,
       c.codigo AS categoria_aguardando
FROM servico_alimentacao s
CROSS JOIN categoria_descarte c
LEFT JOIN pesagem p ON p.servico_id = s.id AND p.categoria_id = c.id
WHERE p.id IS NULL
ORDER BY s.data_servico, s.tipo_refeicao;

-- 6) Uso de cada lixeira (leituras RFID): quantas pesagens, tara aplicada
--    e peso bruto médio lido pela balança.
SELECT l.codigo_rfid,
       l.descricao,
       c.codigo                         AS categoria,
       l.tara_kg,
       COUNT(p.id)                      AS qtd_pesagens,
       ROUND(AVG(p.peso_bruto_kg), 3)   AS media_bruto_kg
FROM lixeira l
JOIN categoria_descarte c ON c.id = l.categoria_id
LEFT JOIN pesagem p       ON p.lixeira_id = l.id
GROUP BY l.codigo_rfid, l.descricao, c.codigo, l.tara_kg
ORDER BY l.codigo_rfid;

-- 7) Pesagens registradas por usuário (quem está usando o sistema).
SELECT u.nome,
       COUNT(DISTINCT s.id)   AS servicos_registrados,
       COUNT(p.id)            AS pesagens_confirmadas,
       MAX(p.confirmado_em)   AS ultima_confirmacao
FROM usuario u
JOIN servico_alimentacao s ON s.usuario_id = u.id
LEFT JOIN pesagem p        ON p.servico_id = s.id
GROUP BY u.nome;
