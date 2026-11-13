package br.com.fiap.merenda.service;

import br.com.fiap.merenda.dto.PesagemResponse;
import br.com.fiap.merenda.dto.ServicoResponse;
import br.com.fiap.merenda.dto.ServicoResponse.StatusServico;
import br.com.fiap.merenda.model.Categoria;
import br.com.fiap.merenda.model.Pesagem;
import br.com.fiap.merenda.model.ServicoAlimentacao;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

/** Converte a entidade no formato do contrato da API. */
@Component
public class ServicoMapper {

    private final AlertaService alertaService;

    public ServicoMapper(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    public ServicoResponse paraResponse(ServicoAlimentacao servico) {
        // As duas categorias sempre aparecem; sem pesagem confirmada = null (aguardando).
        Map<Categoria, PesagemResponse> pesagens = new LinkedHashMap<>();
        for (Categoria categoria : Categoria.values()) {
            pesagens.put(categoria, null);
        }

        BigDecimal total = BigDecimal.ZERO;
        for (Pesagem p : servico.getPesagens()) {
            pesagens.put(p.getCategoria().getCodigo(), new PesagemResponse(
                    p.getLixeira().getId(),
                    p.getLixeira().getCodigoRfid(),
                    Pesos.normalizar(p.getTaraKg()),
                    Pesos.normalizar(p.getPesoBrutoKg()),
                    Pesos.normalizar(p.getPesoLiquidoKg())));
            total = total.add(p.getPesoLiquidoKg());
        }

        boolean completo = pesagens.values().stream().allMatch(p -> p != null);

        return new ServicoResponse(
                servico.getId(),
                servico.getDataServico(),
                servico.getTipoRefeicao(),
                completo ? StatusServico.COMPLETO : StatusServico.PENDENTE,
                pesagens,
                Pesos.normalizar(total),
                alertaService.avaliar(total));
    }
}
