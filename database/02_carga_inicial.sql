-- =====================================================================
-- Script 02: carga inicial (dados FICTÍCIOS para demonstração)
-- Executar depois de 01_schema.sql.
-- =====================================================================

-- Usuário de demonstração.
--   login: operador
--   senha: merenda123   (guardada apenas como hash BCrypt)
INSERT INTO usuario (nome, login, senha_hash) VALUES
    ('Operador de demonstração', 'operador',
     '$2a$10$j6jM1vmirUrynpETRCLVhupDtaunnEPSC0t4zomi301LXeut6BTzu');

INSERT INTO categoria_descarte (codigo, descricao) VALUES
    ('SOBRA_DESCARTADA', 'Alimento preparado e não servido que será descartado'),
    ('RESTO_PRATO',      'Restos comestíveis devolvidos nos pratos');

-- Lixeiras com etiquetas RFID simuladas (mesmos dados do contrato da API).
INSERT INTO lixeira (codigo_rfid, descricao, categoria_id, tara_kg) VALUES
    ('RFID-SIM-001', 'Lixeira da cozinha',
        (SELECT id FROM categoria_descarte WHERE codigo = 'SOBRA_DESCARTADA'), 1.000),
    ('RFID-SIM-002', 'Lixeira de devolução dos pratos',
        (SELECT id FROM categoria_descarte WHERE codigo = 'RESTO_PRATO'), 1.500);

-- Serviços de alimentação já registrados.
INSERT INTO servico_alimentacao (data_servico, tipo_refeicao, usuario_id) VALUES
    ('2026-11-09', 'Almoço', 1),
    ('2026-11-09', 'Lanche', 1),
    ('2026-11-10', 'Almoço', 1),
    ('2026-11-11', 'Almoço', 1),
    ('2026-11-12', 'Almoço', 1),
    ('2026-11-12', 'Lanche', 1);

-- Pesagens confirmadas: bruto lido na balança, tara da lixeira e líquido.
INSERT INTO pesagem (servico_id, lixeira_id, categoria_id, peso_bruto_kg, tara_kg, peso_liquido_kg)
SELECT s.id, l.id, l.categoria_id, v.bruto, l.tara_kg, v.bruto - l.tara_kg
FROM (VALUES
        -- data,        refeição,  RFID,           peso bruto (kg)
        ('2026-11-09', 'Almoço', 'RFID-SIM-001', 4.200),
        ('2026-11-09', 'Almoço', 'RFID-SIM-002', 3.300),
        ('2026-11-09', 'Lanche', 'RFID-SIM-001', 1.800),
        ('2026-11-09', 'Lanche', 'RFID-SIM-002', 2.100),
        ('2026-11-10', 'Almoço', 'RFID-SIM-001', 5.400),
        ('2026-11-10', 'Almoço', 'RFID-SIM-002', 4.000),
        ('2026-11-11', 'Almoço', 'RFID-SIM-001', 1.000),  -- zero confirmado
        ('2026-11-11', 'Almoço', 'RFID-SIM-002', 3.200),
        ('2026-11-12', 'Almoço', 'RFID-SIM-001', 4.000),  -- exemplo do contrato: 3 kg
        ('2026-11-12', 'Almoço', 'RFID-SIM-002', 3.500),  -- exemplo do contrato: 2 kg
        ('2026-11-12', 'Lanche', 'RFID-SIM-001', 2.000)   -- serviço pendente (sem restos)
     ) AS v(data_servico, tipo_refeicao, codigo_rfid, bruto)
JOIN servico_alimentacao s
  ON s.data_servico = v.data_servico::date AND s.tipo_refeicao = v.tipo_refeicao
JOIN lixeira l
  ON l.codigo_rfid = v.codigo_rfid;
