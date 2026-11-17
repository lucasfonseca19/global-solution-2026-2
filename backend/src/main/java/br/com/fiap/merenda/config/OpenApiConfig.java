package br.com.fiap.merenda.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/** Configuração do Swagger: http://localhost:8080/swagger-ui.html */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Merenda API - Global Solution 2026/2",
        version = "1.0.0",
        description = "Mede o descarte da merenda escolar por serviço de alimentação. "
                + "Faça login em /auth/login, clique em Authorize e cole o token."))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}
