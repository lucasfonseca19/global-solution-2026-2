package br.com.fiap.merenda.repository;

import br.com.fiap.merenda.model.ServicoAlimentacao;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Consultas geradas pelo Spring Data JPA a partir do nome do método.
 * Todas usam parâmetros (PreparedStatement), o que impede SQL injection.
 */
public interface ServicoAlimentacaoRepository extends JpaRepository<ServicoAlimentacao, Long> {

    @EntityGraph(attributePaths = {"pesagens", "pesagens.lixeira", "pesagens.categoria"})
    List<ServicoAlimentacao> findAllByOrderByDataServicoDescTipoRefeicaoAsc();

    @EntityGraph(attributePaths = {"pesagens", "pesagens.lixeira", "pesagens.categoria"})
    Optional<ServicoAlimentacao> findWithPesagensById(Long id);

    List<ServicoAlimentacao> findByDataServico(LocalDate dataServico);

}
