package br.com.fiap.merenda.dto;

import java.math.BigDecimal;

public record PesagemResponse(
        Long lixeiraId,
        String codigoRfid,
        BigDecimal taraKg,
        BigDecimal pesoBrutoKg,
        BigDecimal pesoLiquidoKg
) {
}
