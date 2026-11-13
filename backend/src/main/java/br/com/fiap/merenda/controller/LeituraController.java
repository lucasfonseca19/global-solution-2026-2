package br.com.fiap.merenda.controller;

import br.com.fiap.merenda.dto.ErroResponse;
import br.com.fiap.merenda.dto.LeituraAvaliadaResponse;
import br.com.fiap.merenda.dto.LeituraRequest;
import br.com.fiap.merenda.service.LeituraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leituras")
@Tag(name = "Leituras (IoT)", description = "Dados da balança e do leitor RFID simulados")
@SecurityRequirement(name = "bearerAuth")
public class LeituraController {

    private final LeituraService leituraService;

    public LeituraController(LeituraService leituraService) {
        this.leituraService = leituraService;
    }

    @PostMapping("/avaliar")
    @Operation(summary = "Prévia de uma leitura: identifica a lixeira, desconta a tara e valida, sem gravar")
    @ApiResponse(responseCode = "200", description = "Leitura válida")
    @ApiResponse(responseCode = "400", description = "RFID desconhecido, peso inválido ou dados incorretos",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    @ApiResponse(responseCode = "401", description = "Sem token válido",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public LeituraAvaliadaResponse avaliar(@Valid @RequestBody LeituraRequest request) {
        return leituraService.avaliarSemGravar(request);
    }
}
