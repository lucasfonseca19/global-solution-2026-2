package br.com.fiap.merenda.service;

import br.com.fiap.merenda.dto.LeituraAvaliadaResponse;
import br.com.fiap.merenda.dto.LeituraRequest;
import br.com.fiap.merenda.exception.ApiException;
import br.com.fiap.merenda.model.Lixeira;
import br.com.fiap.merenda.repository.LixeiraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Uso dos dados dos sensores simulados:
 * 1. o código RFID identifica a lixeira e, com ela, a categoria e a tara;
 * 2. o peso da balança menos a tara dá o peso só do alimento;
 * 3. leituras impossíveis são rejeitadas (etiqueta desconhecida, peso menor que a tara).
 */
@Service
public class LeituraService {

    /** Leitura já validada, usada tanto pela prévia quanto pela gravação. */
    public record LeituraAvaliada(Lixeira lixeira, BigDecimal pesoBrutoKg, BigDecimal pesoLiquidoKg) {
    }

    private final LixeiraRepository lixeiraRepository;

    public LeituraService(LixeiraRepository lixeiraRepository) {
        this.lixeiraRepository = lixeiraRepository;
    }

    @Transactional(readOnly = true)
    public LeituraAvaliadaResponse avaliarSemGravar(LeituraRequest request) {
        LeituraAvaliada a = avaliar(request);
        return new LeituraAvaliadaResponse(
                a.lixeira().getId(),
                a.lixeira().getCodigoRfid(),
                a.lixeira().getCategoria().getCodigo(),
                Pesos.normalizar(a.lixeira().getTaraKg()),
                Pesos.normalizar(a.pesoBrutoKg()),
                Pesos.normalizar(a.pesoLiquidoKg()));
    }

    public LeituraAvaliada avaliar(LeituraRequest request) {
        Lixeira lixeira = lixeiraRepository.findByCodigoRfid(request.codigoRfid().trim())
                .orElseThrow(ApiException::rfidDesconhecido);

        BigDecimal bruto = request.pesoBrutoKg();
        BigDecimal tara = lixeira.getTaraKg();
        if (bruto.compareTo(tara) < 0) {
            throw ApiException.pesoInvalido("Peso total (" + Pesos.texto(bruto) + " kg) menor que a tara da lixeira ("
                    + Pesos.texto(tara) + " kg). Repita a leitura.");
        }
        return new LeituraAvaliada(lixeira, bruto, bruto.subtract(tara));
    }
}
