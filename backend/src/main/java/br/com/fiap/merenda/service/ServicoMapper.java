package br.com.fiap.merenda.service;
import br.com.fiap.merenda.dto.*;
import br.com.fiap.merenda.model.*;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.*;
@Component
public class ServicoMapper {
    public ServicoResponse paraResponse(ServicoAlimentacao servico) {
        Map<Categoria,PesagemResponse> pesagens = new LinkedHashMap<>();
        List<RegistroPesagemResponse> registros = new ArrayList<>();
        for (Categoria categoria : Categoria.values()) pesagens.put(categoria,null);
        BigDecimal total=BigDecimal.ZERO;
        for (Pesagem p : servico.getPesagens().stream().sorted(Comparator.comparing(Pesagem::getId)).toList()) {
            Categoria c=p.getCategoria().getCodigo();
            registros.add(new RegistroPesagemResponse(p.getId().toString(),c,p.getLixeira().getId(),p.getLixeira().getCodigoRfid(),
                Pesos.normalizar(p.getTaraKg()),Pesos.normalizar(p.getPesoBrutoKg()),Pesos.normalizar(p.getPesoLiquidoKg())));
            PesagemResponse anterior=pesagens.get(c);
            pesagens.put(c,new PesagemResponse(p.getLixeira().getId(),p.getLixeira().getCodigoRfid(),
                Pesos.normalizar(p.getTaraKg().add(anterior==null?BigDecimal.ZERO:anterior.taraKg())),
                Pesos.normalizar(p.getPesoBrutoKg().add(anterior==null?BigDecimal.ZERO:anterior.pesoBrutoKg())),
                Pesos.normalizar(p.getPesoLiquidoKg().add(anterior==null?BigDecimal.ZERO:anterior.pesoLiquidoKg()))));
            total=total.add(p.getPesoLiquidoKg());
        }
        return new ServicoResponse(servico.getId(),servico.getDataServico(),servico.getTipoRefeicao(),
            servico.getConcluidoEm()==null?ServicoResponse.StatusServico.PENDENTE:ServicoResponse.StatusServico.COMPLETO,
            pesagens,Pesos.normalizar(total),registros);
    }
}
