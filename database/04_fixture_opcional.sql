-- OPCIONAL: somente banco de demonstração vazio de serviços.
-- Não é montado automaticamente no Docker.
-- Serviços de alimentação já registrados.
INSERT INTO servico_alimentacao (data_servico, tipo_refeicao, usuario_id) VALUES
    ('2026-11-09', 'Almoço', 1),
    ('2026-11-09', 'Jantar', 1),
    ('2026-11-10', 'Almoço', 1),
    ('2026-11-11', 'Almoço', 1),
    ('2026-11-12', 'Almoço', 1),
    ('2026-11-12', 'Jantar', 1);

-- Pesagens confirmadas: bruto lido na balança, tara da lixeira e líquido.
INSERT INTO pesagem (servico_id, lixeira_id, categoria_id, peso_bruto_kg, tara_kg, peso_liquido_kg)
SELECT s.id, l.id, l.categoria_id, v.bruto, l.tara_kg, v.bruto - l.tara_kg
FROM (VALUES
        -- data,        refeição,  RFID,           peso bruto (kg)
        ('2026-11-09', 'Almoço', 'RFID-SIM-001', 4.200),
        ('2026-11-09', 'Almoço', 'RFID-SIM-002', 3.300),
        ('2026-11-09', 'Jantar', 'RFID-SIM-001', 1.800),
        ('2026-11-09', 'Jantar', 'RFID-SIM-002', 2.100),
        ('2026-11-10', 'Almoço', 'RFID-SIM-001', 5.400),
        ('2026-11-10', 'Almoço', 'RFID-SIM-002', 4.000),
        ('2026-11-11', 'Almoço', 'RFID-SIM-001', 1.000),  -- zero confirmado
        ('2026-11-11', 'Almoço', 'RFID-SIM-002', 3.200),
        ('2026-11-12', 'Almoço', 'RFID-SIM-001', 4.000),  -- exemplo do contrato: 3 kg
        ('2026-11-12', 'Almoço', 'RFID-SIM-002', 3.500),  -- exemplo do contrato: 2 kg
        ('2026-11-12', 'Jantar', 'RFID-SIM-001', 2.000)   -- serviço pendente (sem restos)
     ) AS v(data_servico, tipo_refeicao, codigo_rfid, bruto)
JOIN servico_alimentacao s
  ON s.data_servico = v.data_servico::date AND s.tipo_refeicao = v.tipo_refeicao
JOIN lixeira l
  ON l.codigo_rfid = v.codigo_rfid;

-- Conclusão declarada pelo cenário, nunca inferida pelo número de registros.
UPDATE servico_alimentacao SET concluido_em = TIMESTAMPTZ '2026-11-12 15:00:00-03'
WHERE NOT (data_servico = DATE '2026-11-12' AND tipo_refeicao = 'Jantar');

-- Uma categoria contém duas contribuições: mesma soma, denominador por serviço.
UPDATE pesagem SET peso_bruto_kg=3.200, peso_liquido_kg=2.200
WHERE id=(SELECT p.id FROM pesagem p
JOIN servico_alimentacao s ON s.id=p.servico_id
JOIN lixeira l ON l.id=p.lixeira_id
WHERE s.data_servico=DATE '2026-11-09' AND s.tipo_refeicao='Almoço'
AND l.codigo_rfid='RFID-SIM-001' LIMIT 1);
INSERT INTO pesagem(servico_id,lixeira_id,categoria_id,peso_bruto_kg,tara_kg,peso_liquido_kg)
SELECT s.id,l.id,l.categoria_id,2.000,1.000,1.000
FROM servico_alimentacao s CROSS JOIN lixeira l
WHERE s.data_servico=DATE '2026-11-09' AND s.tipo_refeicao='Almoço'
AND l.codigo_rfid='RFID-SIM-001';
