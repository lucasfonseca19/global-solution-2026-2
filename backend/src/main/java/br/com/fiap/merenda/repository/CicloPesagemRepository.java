package br.com.fiap.merenda.repository;
import br.com.fiap.merenda.model.CicloPesagem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CicloPesagemRepository extends JpaRepository<CicloPesagem,String> {
    java.util.List<CicloPesagem> findByServicoId(Long servicoId);
}
