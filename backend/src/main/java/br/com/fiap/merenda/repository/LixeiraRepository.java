package br.com.fiap.merenda.repository;

import br.com.fiap.merenda.model.Lixeira;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LixeiraRepository extends JpaRepository<Lixeira, Long> {

    /** Identifica a lixeira pelo código lido no RFID, já trazendo a categoria. */
    @EntityGraph(attributePaths = "categoria")
    Optional<Lixeira> findByCodigoRfid(String codigoRfid);
}
