-- =====================================================================
-- Script 02: cadastros mínimos, sem histórico fictício
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
