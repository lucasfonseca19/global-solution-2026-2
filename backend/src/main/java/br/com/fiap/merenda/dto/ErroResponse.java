package br.com.fiap.merenda.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/** Formato único de erro da API. */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ErroResponse(String codigo, String mensagem, List<String> detalhes) {

    public ErroResponse(String codigo, String mensagem) {
        this(codigo, mensagem, List.of());
    }
}
