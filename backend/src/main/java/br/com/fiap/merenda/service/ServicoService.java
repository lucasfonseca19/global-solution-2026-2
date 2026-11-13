package br.com.fiap.merenda.service;

import br.com.fiap.merenda.dto.LeituraRequest;
import br.com.fiap.merenda.dto.ServicoRequest;
import br.com.fiap.merenda.dto.ServicoResponse;
import br.com.fiap.merenda.exception.ApiException;
import br.com.fiap.merenda.model.Categoria;
import br.com.fiap.merenda.model.Pesagem;
import br.com.fiap.merenda.model.ServicoAlimentacao;
import br.com.fiap.merenda.model.Usuario;
import br.com.fiap.merenda.repository.ServicoAlimentacaoRepository;
import br.com.fiap.merenda.repository.UsuarioRepository;
import br.com.fiap.merenda.service.LeituraService.LeituraAvaliada;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/** Regras dos serviços de alimentação e de suas pesagens. */
@Service
public class ServicoService {

    private final ServicoAlimentacaoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LeituraService leituraService;
    private final AlertaService alertaService;
    private final ServicoMapper mapper;

    public ServicoService(ServicoAlimentacaoRepository servicoRepository, UsuarioRepository usuarioRepository,
                          LeituraService leituraService, AlertaService alertaService, ServicoMapper mapper) {
        this.servicoRepository = servicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.leituraService = leituraService;
        this.alertaService = alertaService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ServicoResponse> listar() {
        return servicoRepository.findAllByOrderByDataServicoDescTipoRefeicaoAsc().stream()
                .map(mapper::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServicoResponse detalhar(Long id) {
        return mapper.paraResponse(buscar(id));
    }

    @Transactional
    public ServicoResponse criar(ServicoRequest request, Long usuarioId) {
        String tipo = request.tipoRefeicao().trim();
        if (servicoRepository.existsByDataServicoAndTipoRefeicaoIgnoreCase(request.data(), tipo)) {
            throw ApiException.servicoJaExiste();
        }
        // Valida todas as leituras antes de gravar qualquer coisa (sem gravação parcial).
        Map<Categoria, LeituraAvaliada> leituras = avaliarLeituras(request.pesagens());

        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(ApiException::naoAutorizado);
        ServicoAlimentacao servico = new ServicoAlimentacao();
        servico.setDataServico(request.data());
        servico.setTipoRefeicao(tipo);
        servico.setUsuario(usuario);
        leituras.values().forEach(l -> servico.adicionarPesagem(novaPesagem(l)));

        ServicoAlimentacao salvo = servicoRepository.save(servico);
        alertaService.registrarSeNecessario(salvo.getId(), total(salvo));
        return mapper.paraResponse(salvo);
    }

    /**
     * PUT substitui o conjunto completo de pesagens:
     * - categoria enviada: o novo peso substitui o anterior (não soma);
     * - categoria não enviada: volta a ficar aguardando pesagem.
     */
    @Transactional
    public ServicoResponse atualizar(Long id, ServicoRequest request) {
        ServicoAlimentacao servico = buscar(id);
        String tipo = request.tipoRefeicao().trim();
        if (servicoRepository.existsByDataServicoAndTipoRefeicaoIgnoreCaseAndIdNot(request.data(), tipo, id)) {
            throw ApiException.servicoJaExiste();
        }
        Map<Categoria, LeituraAvaliada> leituras = avaliarLeituras(request.pesagens());

        servico.setDataServico(request.data());
        servico.setTipoRefeicao(tipo);

        // Atualiza no lugar as categorias que continuam e remove as que saíram.
        Iterator<Pesagem> it = servico.getPesagens().iterator();
        while (it.hasNext()) {
            Pesagem existente = it.next();
            LeituraAvaliada nova = leituras.remove(existente.getCategoria().getCodigo());
            if (nova == null) {
                it.remove();
            } else {
                existente.registrarLeitura(nova.lixeira(), nova.pesoBrutoKg(), nova.pesoLiquidoKg());
            }
        }
        // O que sobrou no mapa são categorias novas neste serviço.
        leituras.values().forEach(l -> servico.adicionarPesagem(novaPesagem(l)));
        servico.setAtualizadoEm(java.time.LocalDateTime.now());

        ServicoAlimentacao salvo = servicoRepository.saveAndFlush(servico);
        alertaService.registrarSeNecessario(salvo.getId(), total(salvo));
        return mapper.paraResponse(salvo);
    }

    /** Exclui o serviço e suas pesagens. Não há como recuperar. */
    @Transactional
    public void excluir(Long id) {
        servicoRepository.delete(buscar(id));
    }

    private ServicoAlimentacao buscar(Long id) {
        return servicoRepository.findWithPesagensById(id).orElseThrow(ApiException::servicoNaoEncontrado);
    }

    private Map<Categoria, LeituraAvaliada> avaliarLeituras(List<LeituraRequest> pesagens) {
        Map<Categoria, LeituraAvaliada> porCategoria = new EnumMap<>(Categoria.class);
        for (LeituraRequest leitura : pesagens) {
            LeituraAvaliada avaliada = leituraService.avaliar(leitura);
            Categoria categoria = avaliada.lixeira().getCategoria().getCodigo();
            if (porCategoria.put(categoria, avaliada) != null) {
                throw ApiException.dadosInvalidos("Envie apenas uma pesagem por categoria (" + categoria + " repetida).");
            }
        }
        return porCategoria;
    }

    private Pesagem novaPesagem(LeituraAvaliada leitura) {
        Pesagem pesagem = new Pesagem();
        pesagem.registrarLeitura(leitura.lixeira(), leitura.pesoBrutoKg(), leitura.pesoLiquidoKg());
        return pesagem;
    }

    private BigDecimal total(ServicoAlimentacao servico) {
        return servico.getPesagens().stream()
                .map(Pesagem::getPesoLiquidoKg)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
