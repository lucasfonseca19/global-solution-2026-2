-- Revisar backup e colisões antes de aplicar; NÃO executado em banco pessoal.
-- Migração do esquema original 51957f3; transação atômica, sem DROP de dados.
BEGIN;
LOCK TABLE servico_alimentacao, pesagem IN ACCESS EXCLUSIVE MODE;
-- Falha por colisão normalizada preserva tudo (ROLLBACK). Não mescla serviços.
CREATE UNIQUE INDEX uk_servico_data_tipo_normalizado ON servico_alimentacao
(data_servico, (translate(lower(regexp_replace(btrim(tipo_refeicao), '\s+', ' ', 'g') COLLATE "C"),
'ÁÀÂÃÉÊÍÓÔÕÚÜÇáàâãéêíóôõúüç', 'aaaaeeiooouucaaaaeeiooouuc')));
ALTER TABLE servico_alimentacao ADD COLUMN concluido_em TIMESTAMPTZ;
-- NULL intencional: o legado não registrou decisão explícita de concluir.
ALTER TABLE pesagem DROP CONSTRAINT uk_pesagem_servico_categoria;
ALTER TABLE pesagem ADD CONSTRAINT ck_pesagem_tara CHECK (tara_kg >= 0 AND tara_kg <= 100);
CREATE TABLE ciclo_pesagem (
    ciclo_id VARCHAR(100) NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    servico_id BIGINT,
    CONSTRAINT pk_ciclo_pesagem PRIMARY KEY(ciclo_id),
    CONSTRAINT ck_ciclo_id CHECK (LENGTH(TRIM(ciclo_id)) > 0),
    CONSTRAINT ck_ciclo_hash CHECK (payload_hash ~ '^[a-f0-9]{64}$'),
    CONSTRAINT fk_ciclo_servico FOREIGN KEY(servico_id)
        REFERENCES servico_alimentacao(id) ON DELETE SET NULL
);
CREATE INDEX ix_pesagem_servico ON pesagem(servico_id);
CREATE INDEX ix_ciclo_servico ON ciclo_pesagem(servico_id);
COMMIT;
