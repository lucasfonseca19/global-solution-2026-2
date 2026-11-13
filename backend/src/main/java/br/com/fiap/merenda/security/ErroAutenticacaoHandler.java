package br.com.fiap.merenda.security;

import br.com.fiap.merenda.dto.ErroResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/** Responde 401/403 no mesmo formato JSON de erro do restante da API. */
@Component
public class ErroAutenticacaoHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public ErroAutenticacaoHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException ex) throws IOException {
        escrever(response, HttpServletResponse.SC_UNAUTHORIZED,
                new ErroResponse("NAO_AUTORIZADO", "Faça login para acessar este recurso."));
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {
        escrever(response, HttpServletResponse.SC_FORBIDDEN,
                new ErroResponse("ACESSO_NEGADO", "Você não tem permissão para este recurso."));
    }

    private void escrever(HttpServletResponse response, int status, ErroResponse erro) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getOutputStream(), erro);
    }
}
