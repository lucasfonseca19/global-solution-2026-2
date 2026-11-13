package br.com.fiap.merenda.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

/**
 * Criação ou atualização de um serviço. No PUT, a lista de pesagens substitui o
 * conjunto completo: categoria ausente volta a ficar "aguardando pesagem".
 */
public record ServicoRequest(
        @Schema(example = "2026-11-13")
        @NotNull(message = "Informe a data do serviço (AAAA-MM-DD).")
        LocalDate data,

        @Schema(example = "Almoço")
        @NotBlank(message = "Informe o tipo de refeição.")
        @Size(max = 30, message = "Tipo de refeição deve ter no máximo 30 caracteres.")
        // Só letras (com acento), números e espaços: bloqueia HTML/JavaScript (XSS).
        @Pattern(regexp = "^[\\p{L}0-9 ]+$", message = "Tipo de refeição aceita apenas letras, números e espaços.")
        String tipoRefeicao,

        @NotNull(message = "Informe a lista de pesagens (pode ser vazia).")
        @Size(max = 2, message = "Envie no máximo uma pesagem por categoria.")
        List<@Valid @NotNull(message = "Pesagem não pode ser nula.") LeituraRequest> pesagens
) {
}
