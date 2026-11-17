-- Mesmos dados de demonstração do contrato (senha do operador: merenda123).
INSERT INTO usuario (nome, login, senha_hash, criado_em) VALUES
    ('Operador de demonstração', 'operador',
     '$2a$10$j6jM1vmirUrynpETRCLVhupDtaunnEPSC0t4zomi301LXeut6BTzu', CURRENT_TIMESTAMP);

INSERT INTO categoria_descarte (codigo, descricao) VALUES
    ('SOBRA_DESCARTADA', 'Alimento preparado e não servido que será descartado'),
    ('RESTO_PRATO', 'Restos comestíveis devolvidos nos pratos');

INSERT INTO lixeira (codigo_rfid, descricao, categoria_id, tara_kg) VALUES
    ('RFID-SIM-001', 'Lixeira da cozinha', 1, 1.000),
    ('RFID-SIM-002', 'Lixeira de devolução dos pratos', 2, 1.500);

INSERT INTO servico_alimentacao (data_servico, tipo_refeicao, usuario_id, criado_em, atualizado_em, concluido_em) VALUES
    ('2026-11-12', 'Almoço', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO pesagem (servico_id, lixeira_id, categoria_id, peso_bruto_kg, tara_kg, peso_liquido_kg, confirmado_em) VALUES
    (1, 1, 1, 4.000, 1.000, 3.000, CURRENT_TIMESTAMP),
    (1, 2, 2, 3.500, 1.500, 2.000, CURRENT_TIMESTAMP);
