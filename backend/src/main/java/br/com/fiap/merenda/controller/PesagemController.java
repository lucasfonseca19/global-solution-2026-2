package br.com.fiap.merenda.controller;
import br.com.fiap.merenda.dto.*;
import br.com.fiap.merenda.service.ServicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/pesagens") @SecurityRequirement(name="bearerAuth")
public class PesagemController {
    private final ServicoService service;
    public PesagemController(ServicoService service) {this.service=service;}
    @PostMapping @Operation(summary="Confirmar contribuição individual ou correção; replay idêntico é seguro")
    public ServicoResponse confirmar(@Valid @RequestBody ConfirmacaoPesagem request,@AuthenticationPrincipal Jwt jwt) {
        return service.confirmar(request,Long.valueOf(jwt.getSubject()));
    }
}
