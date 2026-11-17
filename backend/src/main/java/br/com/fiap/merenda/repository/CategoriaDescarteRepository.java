package br.com.fiap.merenda.repository;
import br.com.fiap.merenda.model.*;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import java.util.Optional;
public interface CategoriaDescarteRepository extends JpaRepository<CategoriaDescarte,Long> {
    // Uma linha estável serializa mutações, inclusive quando o serviço ainda não existe.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<CategoriaDescarte> findByCodigo(Categoria codigo);
}
