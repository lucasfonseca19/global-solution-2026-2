package br.com.fiap.merenda.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/** Leitura simulada dos sensores: código da etiqueta RFID e peso total da balança. */
public record LeituraRequest(
        @Schema(example = "RFID-SIM-001")
        @NotBlank(message = "Informe o código RFID.")
        @Size(max = 40, message = "Código RFID deve ter no máximo 40 caracteres.")
        @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Código RFID aceita apenas letras, números e hífen.")
        String codigoRfid,

        @Schema(example = "4")
        @NotNull(message = "Informe o peso bruto.")
        @DecimalMin(value = "0.0", message = "Peso bruto não pode ser negativo.")
        @DecimalMax(value = "500.0", message = "Peso bruto acima do limite da balança (500 kg).")
        @Digits(integer = 4, fraction = 3, message = "Peso bruto aceita até 3 casas decimais.")
        BigDecimal pesoBrutoKg
) {
}
