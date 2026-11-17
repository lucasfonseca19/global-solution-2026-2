-- Execução atômica: nenhum dado de teste permanece após o ROLLBACK.
BEGIN;
INSERT INTO servico_alimentacao(data_servico,tipo_refeicao,usuario_id)
SELECT DATE '2026-11-17','Almoço',id FROM usuario WHERE login='operador';
DO $$
DECLARE sid BIGINT; lid BIGINT; cid BIGINT; outro BIGINT;
BEGIN
SELECT id INTO sid FROM servico_alimentacao WHERE data_servico=DATE '2026-11-17' AND tipo_refeicao='Almoço';
SELECT id,categoria_id INTO lid,cid FROM lixeira WHERE codigo_rfid='RFID-SIM-001';
SELECT id INTO outro FROM categoria_descarte WHERE codigo='RESTO_PRATO';
BEGIN
 INSERT INTO servico_alimentacao(data_servico,tipo_refeicao,usuario_id) SELECT DATE '2026-11-17',' ALMOCO ',usuario_id FROM servico_alimentacao WHERE id=sid;
 RAISE EXCEPTION 'T1 falhou: duplicata normalizada aceita';
EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'T1 PASS: serviço normalizado único'; END;
INSERT INTO pesagem(servico_id,lixeira_id,categoria_id,peso_bruto_kg,tara_kg,peso_liquido_kg)
VALUES (sid,lid,cid,4,1,3),(sid,lid,cid,2,1,1);
IF (SELECT SUM(peso_liquido_kg) FROM pesagem WHERE servico_id=sid) <> 4 THEN RAISE EXCEPTION 'T2 falhou'; END IF;
RAISE NOTICE 'T2 PASS: mesma categoria contém contribuições 3+1=4';
IF (SELECT concluido_em IS NOT NULL FROM servico_alimentacao WHERE id=sid) THEN RAISE EXCEPTION 'T3 falhou'; END IF;
RAISE NOTICE 'T3 PASS: contagem não conclui serviço';
BEGIN
 INSERT INTO pesagem(servico_id,lixeira_id,categoria_id,peso_bruto_kg,tara_kg,peso_liquido_kg) VALUES(sid,lid,cid,0,1,-1);
 RAISE EXCEPTION 'T4 falhou';
EXCEPTION WHEN check_violation THEN RAISE NOTICE 'T4 PASS: bruto abaixo da tara rejeitado'; END;
BEGIN
 INSERT INTO pesagem(servico_id,lixeira_id,categoria_id,peso_bruto_kg,tara_kg,peso_liquido_kg) VALUES(sid,lid,outro,3,1,2);
 RAISE EXCEPTION 'T5 falhou';
EXCEPTION WHEN foreign_key_violation THEN RAISE NOTICE 'T5 PASS: categoria incoerente rejeitada'; END;
BEGIN
 INSERT INTO usuario(nome,login,senha_hash) VALUES('Teste','teste','senha123');
 RAISE EXCEPTION 'T6 falhou';
EXCEPTION WHEN check_violation THEN RAISE NOTICE 'T6 PASS: senha sem formato BCrypt rejeitada'; END;
INSERT INTO pesagem(servico_id,lixeira_id,categoria_id,peso_bruto_kg,tara_kg,peso_liquido_kg) VALUES(sid,lid,cid,1,1,0);
RAISE NOTICE 'T7 PASS: zero confirmado aceito';
INSERT INTO ciclo_pesagem(ciclo_id,payload_hash,servico_id) VALUES('ciclo-teste',repeat('a',64),sid);
BEGIN
 INSERT INTO ciclo_pesagem(ciclo_id,payload_hash,servico_id) VALUES('ciclo-teste',repeat('b',64),sid);
 RAISE EXCEPTION 'T8 falhou';
EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'T8 PASS: ciclo global único'; END;
UPDATE servico_alimentacao SET concluido_em=now() WHERE id=sid;
UPDATE pesagem SET peso_bruto_kg=3.5,peso_liquido_kg=2.5 WHERE id=(SELECT min(id) FROM pesagem WHERE servico_id=sid);
IF NOT (SELECT concluido_em IS NOT NULL FROM servico_alimentacao WHERE id=sid) THEN RAISE EXCEPTION 'T9 falhou'; END IF;
RAISE NOTICE 'T9 PASS: correção preserva conclusão persistida';
DELETE FROM servico_alimentacao WHERE id=sid;
IF EXISTS(SELECT 1 FROM pesagem WHERE servico_id=sid) OR NOT EXISTS(SELECT 1 FROM ciclo_pesagem WHERE ciclo_id='ciclo-teste' AND servico_id IS NULL AND payload_hash=repeat('a',64)) THEN RAISE EXCEPTION 'T10 falhou'; END IF;
RAISE NOTICE 'T10 PASS: exclusão remove contribuições e preserva ciclo/hash sem serviço';
BEGIN
 INSERT INTO ciclo_pesagem(ciclo_id,payload_hash,servico_id) VALUES('ciclo-teste',repeat('a',64),NULL);
 RAISE EXCEPTION 'T11 falhou';
EXCEPTION WHEN unique_violation THEN RAISE NOTICE 'T11 PASS: replay após exclusão mantém ciclo reservado'; END;
END $$;
ROLLBACK;
