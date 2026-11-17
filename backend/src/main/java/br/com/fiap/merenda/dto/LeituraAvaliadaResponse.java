package br.com.fiap.merenda.dto;

import br.com.fiap.merenda.model.Categoria;

import java.math.BigDecimal;

/** Resultado da prévia: lixeira identificada, tara aplicada e peso só do alimento. */
public record LeituraAvaliadaResponse(
        Long lixeiraId,
        String codigoRfid,
        Categoria categoria,
        BigDecimal taraKg,
        BigDecimal pesoBrutoKg,
        BigDecimal pesoLiquidoKg
) {
}
