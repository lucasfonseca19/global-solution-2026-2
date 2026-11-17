package br.com.fiap.merenda.service;
import br.com.fiap.merenda.dto.*;
import br.com.fiap.merenda.exception.ApiException;
import br.com.fiap.merenda.model.*;
import br.com.fiap.merenda.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.text.Normalizer;
@Service
public class ServicoService {
    private final ServicoAlimentacaoRepository servicos;
    private final UsuarioRepository usuarios;
    private final CicloPesagemRepository ciclos;
    private final CategoriaDescarteRepository categorias;
    private final LeituraService leituras;
    private final ServicoMapper mapper;
    private final Clock clock;
    public ServicoService(ServicoAlimentacaoRepository servicos, UsuarioRepository usuarios,
        CicloPesagemRepository ciclos, CategoriaDescarteRepository categorias, LeituraService leituras,
        ServicoMapper mapper, Clock clock) {
        this.servicos=servicos;this.usuarios=usuarios;this.ciclos=ciclos;this.categorias=categorias;
        this.leituras=leituras;this.mapper=mapper;this.clock=clock;
    }
    @Transactional(readOnly=true) public List<ServicoResponse> listar() {
        return servicos.findAllByOrderByDataServicoDescTipoRefeicaoAsc().stream().map(mapper::paraResponse).toList();
    }
    @Transactional(readOnly=true) public ServicoResponse detalhar(Long id) {return mapper.paraResponse(buscar(id));}
    private ServicoAlimentacao buscar(Long id) {return servicos.findWithPesagensById(id).orElseThrow(ApiException::servicoNaoEncontrado);}
    private ApiException conflito(String codigo,String mensagem) {return new ApiException(HttpStatus.CONFLICT,codigo,mensagem);}
    private void bloquear() {categorias.findByCodigo(Categoria.SOBRA_DESCARTADA).orElseThrow(()->new IllegalStateException("Carga inicial de categorias ausente."));}
    private void validarDia(LocalDate data) {
        if (!LocalDate.now(clock.withZone(ZoneId.of("America/Sao_Paulo"))).equals(data))
            throw conflito("DIA_ENCERRADO","Alterações são permitidas somente no dia atual da escola (America/Sao_Paulo).");
    }
    private String chaveTipo(String valor) {
        return Normalizer.normalize(valor.trim().replaceAll(" +"," "),Normalizer.Form.NFD)
            .replaceAll("\\p{M}","").toLowerCase(Locale.ROOT);
    }
    private String tipo(String valor) {
        return switch(chaveTipo(valor)) {
            case "almoco" -> "Almoço";
            case "jantar" -> "Jantar";
            case "lanche da tarde" -> "Lanche da tarde";
            default -> valor.trim().replaceAll(" +"," ");
        };
    }
    private String hash(ConfirmacaoPesagem r,String tipo) {
        String texto=r.data()+"|"+chaveTipo(tipo)+"|"+r.leitura().codigoRfid().trim()+"|"+r.leitura().pesoBrutoKg().stripTrailingZeros().toPlainString()+"|"+Objects.toString(r.substituirId(),"");
        try {return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(texto.getBytes(StandardCharsets.UTF_8)));}
        catch (NoSuchAlgorithmException e) {throw new IllegalStateException(e);}
    }
    @Transactional public ServicoResponse confirmar(ConfirmacaoPesagem r,Long usuarioId) {
        bloquear(); validarDia(r.data());
        String tipo=tipo(r.tipoRefeicao()), hash=hash(r,tipo);
        Optional<CicloPesagem> replay=ciclos.findById(r.cicloId());
        if (replay.isPresent()) {
            if (!replay.get().getPayloadHash().equals(hash)) throw conflito("CICLO_CONFLITANTE","Este ciclo já foi confirmado com outros dados.");
            if (replay.get().getServico()==null) throw conflito("SERVICO_EXCLUIDO","O serviço deste ciclo foi excluído. Inicie um novo ciclo para uma nova pesagem.");
            validarDia(replay.get().getServico().getDataServico());
            return mapper.paraResponse(replay.get().getServico());
        }
        ServicoAlimentacao s=servicos.findByDataServico(r.data()).stream()
            .filter(existente->chaveTipo(existente.getTipoRefeicao()).equals(chaveTipo(tipo))).findFirst().orElse(null);
        if (r.substituirId()!=null && s==null) throw conflito("CORRECAO_INVALIDA","A pesagem não pertence ao serviço atual.");
        if (s==null) {
            s=new ServicoAlimentacao();s.setDataServico(r.data());s.setTipoRefeicao(tipo);
            s.setUsuario(usuarios.findById(usuarioId).orElseThrow(ApiException::naoAutorizado));
        }
        validarDia(s.getDataServico());
        LeituraService.LeituraAvaliada l=leituras.avaliar(r.leitura());
        if (r.substituirId()!=null) {
            final String id=r.substituirId();
            Pesagem p=s.getPesagens().stream().filter(pesagem->pesagem.getId().toString().equals(id)).findFirst()
                .orElseThrow(()->conflito("CORRECAO_INVALIDA","A pesagem não pertence ao serviço atual."));
            if (!p.getLixeira().getId().equals(l.lixeira().getId())) throw conflito("CORRECAO_INVALIDA","A correção deve usar a mesma lixeira.");
            p.registrarLeitura(l.lixeira(),l.pesoBrutoKg(),l.pesoLiquidoKg());
        } else {
            if (s.getConcluidoEm()!=null) throw conflito("SERVICO_CONCLUIDO","Selecione uma pesagem para corrigir o serviço concluído.");
            Pesagem p=new Pesagem();p.registrarLeitura(l.lixeira(),l.pesoBrutoKg(),l.pesoLiquidoKg());s.adicionarPesagem(p);
        }
        s.setAtualizadoEm(LocalDateTime.now(clock));
        servicos.saveAndFlush(s);ciclos.saveAndFlush(new CicloPesagem(r.cicloId(),hash,s));
        validarDia(s.getDataServico());
        return mapper.paraResponse(s);
    }
    @Transactional public ServicoResponse concluir(Long id) {
        bloquear();ServicoAlimentacao s=buscar(id);validarDia(s.getDataServico());
        if (s.getPesagens().stream().map(p->p.getCategoria().getCodigo()).distinct().count()!=Categoria.values().length)
            throw conflito("CATEGORIAS_INCOMPLETAS","Confirme uma pesagem de cada categoria, mesmo quando o peso líquido for zero.");
        if (s.getConcluidoEm()==null) s.concluir(clock.instant());
        servicos.saveAndFlush(s);validarDia(s.getDataServico());return mapper.paraResponse(s);
    }
    @Transactional public void excluir(Long id) {
        bloquear();ServicoAlimentacao s=buscar(id);validarDia(s.getDataServico());
        // Conserva a identidade/hash para impedir que um retry ressuscite o serviço.
        ciclos.findByServicoId(id).forEach(CicloPesagem::desvincularServico);
        ciclos.flush();servicos.delete(s);servicos.flush();validarDia(s.getDataServico());
    }
}
