package br.com.fiap.merenda.dto;

import br.com.fiap.merenda.model.Categoria;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

/**
 * Serviço no formato do contrato. Em "pesagens", categoria sem confirmação vem
 * como null (aguardando pesagem), nunca como zero.
 */
public record ServicoResponse(
        Long id,
        LocalDate data,
        String tipoRefeicao,
        StatusServico status,
        Map<Categoria, PesagemResponse> pesagens,
        BigDecimal totalKg,
        java.util.List<RegistroPesagemResponse> registros
) {

    public enum StatusServico { PENDENTE, COMPLETO }
}
