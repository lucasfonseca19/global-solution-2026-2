package br.com.fiap.merenda.dto;
import br.com.fiap.merenda.model.Categoria;
import java.math.BigDecimal;
public record RegistroPesagemResponse(String id, Categoria categoria, Long lixeiraId,
    String codigoRfid, BigDecimal taraKg, BigDecimal pesoBrutoKg, BigDecimal pesoLiquidoKg) {}
