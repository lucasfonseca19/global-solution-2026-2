package br.com.fiap.merenda.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record ConfirmacaoPesagem(
    @NotNull LocalDate data,
    @NotBlank @Size(max=30) @Pattern(regexp="^[\\p{L}0-9 ]+$") String tipoRefeicao,
    @NotBlank @Size(max=100) @Pattern(regexp="^[A-Za-z0-9_-]+$") String cicloId,
    @NotNull @Valid LeituraRequest leitura,
    @Pattern(regexp="^[1-9][0-9]{0,18}$") String substituirId
) {}
