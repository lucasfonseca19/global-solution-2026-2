package br.com.fiap.merenda.security;

import br.com.fiap.merenda.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Proteção contra força bruta: depois de N senhas erradas seguidas para o mesmo
 * login, bloqueia novas tentativas por alguns minutos. Guardado em memória (MVP).
 */
@Service
public class LoginAttemptService {

    private record Tentativas(int falhas, Instant bloqueadoAte) {
    }

    private final Map<String, Tentativas> porLogin = new ConcurrentHashMap<>();
    private final int maxTentativas;
    private final long bloqueioMinutos;

    public LoginAttemptService(@Value("${merenda.login.max-tentativas}") int maxTentativas,
                               @Value("${merenda.login.bloqueio-minutos}") long bloqueioMinutos) {
        this.maxTentativas = maxTentativas;
        this.bloqueioMinutos = bloqueioMinutos;
    }

    public void verificarBloqueio(String login) {
        Tentativas t = porLogin.get(chave(login));
        if (t != null && t.bloqueadoAte() != null && Instant.now().isBefore(t.bloqueadoAte())) {
            throw ApiException.muitasTentativas(bloqueioMinutos);
        }
    }

    public void registrarFalha(String login) {
        porLogin.compute(chave(login), (k, atual) -> {
            int falhas = (atual == null || atual.bloqueadoAte() != null) ? 1 : atual.falhas() + 1;
            Instant bloqueio = falhas >= maxTentativas
                    ? Instant.now().plus(Duration.ofMinutes(bloqueioMinutos))
                    : null;
            return new Tentativas(falhas, bloqueio);
        });
    }

    public void registrarSucesso(String login) {
        porLogin.remove(chave(login));
    }

    private String chave(String login) {
        return login.trim().toLowerCase(Locale.ROOT);
    }
}
