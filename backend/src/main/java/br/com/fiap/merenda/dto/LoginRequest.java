package br.com.fiap.merenda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Informe o login.")
        @Size(max = 50, message = "Login deve ter no máximo 50 caracteres.")
        String login,

        @NotBlank(message = "Informe a senha.")
        @Size(max = 100, message = "Senha deve ter no máximo 100 caracteres.")
        String senha
) {
}
