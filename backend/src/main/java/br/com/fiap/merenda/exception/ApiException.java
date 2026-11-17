package br.com.fiap.merenda.exception;

import org.springframework.http.HttpStatus;

/** Erro de regra de negócio com status HTTP e código do contrato. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String codigo;

    public ApiException(HttpStatus status, String codigo, String mensagem) {
        super(mensagem);
        this.status = status;
        this.codigo = codigo;
    }

    public static ApiException rfidDesconhecido() {
        return new ApiException(HttpStatus.BAD_REQUEST, "RFID_DESCONHECIDO", "Lixeira não reconhecida.");
    }

    public static ApiException pesoInvalido(String mensagem) {
        return new ApiException(HttpStatus.BAD_REQUEST, "PESO_INVALIDO", mensagem);
    }

    public static ApiException dadosInvalidos(String mensagem) {
        return new ApiException(HttpStatus.BAD_REQUEST, "DADOS_INVALIDOS", mensagem);
    }

    public static ApiException naoAutorizado() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "NAO_AUTORIZADO", "Login ou senha inválidos.");
    }

    public static ApiException servicoNaoEncontrado() {
        return new ApiException(HttpStatus.NOT_FOUND, "SERVICO_NAO_ENCONTRADO", "Serviço não encontrado.");
    }

    public static ApiException servicoJaExiste() {
        return new ApiException(HttpStatus.CONFLICT, "SERVICO_JA_EXISTE",
                "Já existe um serviço para esta data e tipo de refeição. Continue ou corrija o registro existente.");
    }

    public static ApiException muitasTentativas(long minutos) {
        return new ApiException(HttpStatus.TOO_MANY_REQUESTS, "MUITAS_TENTATIVAS",
                "Muitas tentativas de login. Tente novamente em " + minutos + " minutos.");
    }

    public HttpStatus getStatus() { return status; }
    public String getCodigo() { return codigo; }
}
