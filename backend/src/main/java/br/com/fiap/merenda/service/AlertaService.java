package br.com.fiap.merenda.service;

import br.com.fiap.merenda.dto.AlertaResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Alerta disparado pelos dados da balança: quando o descarte total de um serviço
 * passa do limite configurado (merenda.alerta.limite-total-kg), a resposta traz o alerta.
 */
@Service
public class AlertaService {

    private static final Logger log = LoggerFactory.getLogger(AlertaService.class);

    private final BigDecimal limiteKg;

    public AlertaService(@Value("${merenda.alerta.limite-total-kg}") BigDecimal limiteKg) {
        this.limiteKg = limiteKg;
    }

    public AlertaResponse avaliar(BigDecimal totalKg) {
        if (totalKg.compareTo(limiteKg) <= 0) {
            return null;
        }
        return new AlertaResponse(
                "DESCARTE_ACIMA_DO_LIMITE",
                Pesos.normalizar(limiteKg),
                Pesos.normalizar(totalKg),
                "Descarte de " + Pesos.texto(totalKg) + " kg passou do limite de " + Pesos.texto(limiteKg)
                        + " kg por serviço. Vale revisar a quantidade preparada ou o cardápio.");
    }

    /** Registra o alerta no log quando um serviço é gravado acima do limite. */
    public void registrarSeNecessario(Long servicoId, BigDecimal totalKg) {
        if (avaliar(totalKg) != null) {
            log.warn("ALERTA: serviço {} com descarte de {} kg (limite {} kg)",
                    servicoId, Pesos.texto(totalKg), Pesos.texto(limiteKg));
        }
    }
}
