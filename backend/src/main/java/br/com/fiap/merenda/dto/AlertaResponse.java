package br.com.fiap.merenda.dto;

import java.math.BigDecimal;

/** Alerta gerado quando o descarte do serviço passa do limite configurado. */
public record AlertaResponse(
        String tipo,
        BigDecimal limiteKg,
        BigDecimal totalKg,
        String mensagem
) {
}
