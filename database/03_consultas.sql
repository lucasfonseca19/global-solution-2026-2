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
       CASE WHEN s.concluido_em IS NOT NULL
            THEN 'COMPLETO' ELSE 'PENDENTE' END                           AS status
FROM servico_alimentacao s
LEFT JOIN pesagem p            ON p.servico_id = s.id
LEFT JOIN categoria_descarte c ON c.id = p.categoria_id
GROUP BY s.id, s.data_servico, s.tipo_refeicao
ORDER BY s.data_servico DESC, s.tipo_refeicao;

-- 2) Média dos totais por categoria de cada serviço concluído.
-- Primeiro agrega contribuições; AVG nunca é calculado sobre pesagens soltas.
WITH por_servico AS (
    SELECT s.id, c.id AS categoria_id, SUM(p.peso_liquido_kg) AS total_kg,
           COUNT(p.id) AS qtd_pesagens
    FROM servico_alimentacao s
    JOIN pesagem p ON p.servico_id = s.id
    JOIN categoria_descarte c ON c.id = p.categoria_id
    WHERE s.concluido_em IS NOT NULL
    GROUP BY s.id, c.id
)
SELECT c.codigo, c.descricao, COUNT(ps.id) AS qtd_servicos_concluidos,
       COALESCE(SUM(ps.qtd_pesagens), 0) AS qtd_pesagens,
       SUM(ps.total_kg) AS total_kg,
       ROUND(AVG(ps.total_kg), 3) AS media_kg_por_servico
FROM categoria_descarte c
LEFT JOIN por_servico ps ON ps.categoria_id = c.id
GROUP BY c.codigo, c.descricao
ORDER BY total_kg DESC NULLS LAST;

-- 3) Descarte e média por refeição, somente serviços concluídos.
SELECT s.tipo_refeicao,
       COUNT(DISTINCT s.id)               AS qtd_servicos,
       SUM(p.peso_liquido_kg)             AS total_kg,
       ROUND(SUM(p.peso_liquido_kg) / COUNT(DISTINCT s.id), 3) AS media_kg_por_servico
FROM servico_alimentacao s
JOIN pesagem p ON p.servico_id = s.id
WHERE s.concluido_em IS NOT NULL
GROUP BY s.tipo_refeicao
ORDER BY total_kg DESC;

-- 4) Ranking dos serviços concluídos por total de descarte.
-- Consulta analítica; não representa alerta nem regra de negócio.
SELECT s.data_servico,
       s.tipo_refeicao,
       SUM(p.peso_liquido_kg) AS total_kg
FROM servico_alimentacao s
JOIN pesagem p ON p.servico_id = s.id
WHERE s.concluido_em IS NOT NULL
GROUP BY s.id, s.data_servico, s.tipo_refeicao
ORDER BY total_kg DESC;

-- 5) Serviços pendentes: categorias ausentes ou confirmação final pendente.
SELECT s.data_servico, s.tipo_refeicao,
       STRING_AGG(c.codigo, ', ' ORDER BY c.codigo)
           FILTER (WHERE NOT EXISTS (
               SELECT 1 FROM pesagem p WHERE p.servico_id = s.id AND p.categoria_id = c.id
           )) AS categorias_aguardando,
       'PENDENTE' AS status
FROM servico_alimentacao s
CROSS JOIN categoria_descarte c
WHERE s.concluido_em IS NULL
GROUP BY s.id
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
