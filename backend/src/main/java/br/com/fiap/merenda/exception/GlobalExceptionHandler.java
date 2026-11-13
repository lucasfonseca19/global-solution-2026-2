package br.com.fiap.merenda.exception;

import br.com.fiap.merenda.dto.ErroResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

/**
 * Converte qualquer erro no formato { codigo, mensagem }.
 * Mensagens são genéricas: nenhum detalhe interno (stack trace, SQL) vai para o cliente.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroResponse> regraDeNegocio(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(new ErroResponse(ex.getCodigo(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException ex) {
        List<String> detalhes = ex.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .sorted()
                .toList();
        return ResponseEntity.badRequest()
                .body(new ErroResponse("DADOS_INVALIDOS", "Dados de entrada inválidos.", detalhes));
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErroResponse> validacaoParametros(HandlerMethodValidationException ex) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse("DADOS_INVALIDOS", "Dados de entrada inválidos."));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErroResponse> formatoInvalido(Exception ex) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse("DADOS_INVALIDOS",
                        "Formato inválido. Confira o JSON, números e datas (AAAA-MM-DD)."));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> integridade(DataIntegrityViolationException ex) {
        log.warn("Violação de integridade no banco: {}", ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErroResponse("CONFLITO_DE_DADOS", "Os dados conflitam com um registro existente."));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResponse> rotaInexistente(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErroResponse("RECURSO_NAO_ENCONTRADO", "Rota não encontrada."));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResponse> metodoNaoPermitido(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(new ErroResponse("METODO_NAO_PERMITIDO", "Método HTTP não suportado nesta rota."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> inesperado(Exception ex) {
        log.error("Erro inesperado", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErroResponse("ERRO_INTERNO", "Erro inesperado. Tente novamente."));
    }
}
