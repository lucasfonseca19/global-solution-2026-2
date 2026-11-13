package br.com.fiap.merenda.controller;

import br.com.fiap.merenda.dto.ErroResponse;
import br.com.fiap.merenda.dto.ServicoRequest;
import br.com.fiap.merenda.dto.ServicoResponse;
import br.com.fiap.merenda.service.ServicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/servicos")
@Tag(name = "Serviços de alimentação", description = "Refeições com o descarte pesado por categoria")
@SecurityRequirement(name = "bearerAuth")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    @Operation(summary = "Listar serviços (histórico), do mais recente para o mais antigo")
    @ApiResponse(responseCode = "200", description = "Lista, vazia se não houver serviços")
    public List<ServicoResponse> listar() {
        return servicoService.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalhar um serviço com o peso de cada categoria e o total")
    @ApiResponse(responseCode = "200", description = "Serviço encontrado")
    @ApiResponse(responseCode = "404", description = "Serviço não encontrado",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public ServicoResponse detalhar(@PathVariable Long id) {
        return servicoService.detalhar(id);
    }

    @PostMapping
    @Operation(summary = "Criar um serviço com as pesagens já confirmadas (pode ser lista vazia)")
    @ApiResponse(responseCode = "201", description = "Serviço criado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos, RFID desconhecido ou peso inválido",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    @ApiResponse(responseCode = "409", description = "Já existe serviço nesta data e tipo de refeição",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public ResponseEntity<ServicoResponse> criar(@Valid @RequestBody ServicoRequest request,
                                                 @AuthenticationPrincipal Jwt jwt) {
        ServicoResponse criado = servicoService.criar(request, Long.valueOf(jwt.getSubject()));
        URI local = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(criado.id()).toUri();
        return ResponseEntity.created(local).body(criado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar ou corrigir um serviço (substitui o conjunto completo de pesagens)")
    @ApiResponse(responseCode = "200", description = "Serviço atualizado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos, RFID desconhecido ou peso inválido",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    @ApiResponse(responseCode = "404", description = "Serviço não encontrado",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    @ApiResponse(responseCode = "409", description = "Outra data/tipo de refeição já usada por outro serviço",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public ServicoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ServicoRequest request) {
        return servicoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um serviço e suas pesagens (sem recuperação)")
    @ApiResponse(responseCode = "204", description = "Serviço excluído")
    @ApiResponse(responseCode = "404", description = "Serviço não encontrado",
            content = @Content(schema = @Schema(implementation = ErroResponse.class)))
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        servicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
