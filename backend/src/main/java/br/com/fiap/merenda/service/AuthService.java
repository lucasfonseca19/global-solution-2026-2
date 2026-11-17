package br.com.fiap.merenda.service;

import br.com.fiap.merenda.dto.LoginRequest;
import br.com.fiap.merenda.dto.LoginResponse;
import br.com.fiap.merenda.exception.ApiException;
import br.com.fiap.merenda.model.Usuario;
import br.com.fiap.merenda.repository.UsuarioRepository;
import br.com.fiap.merenda.security.LoginAttemptService;
import br.com.fiap.merenda.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    /** Hash usado quando o login não existe, para a resposta levar o mesmo tempo (evita descobrir logins). */
    private static final String HASH_FICTICIO = "$2a$10$0sBRoxt2yAnP7NiYghZsVe7YZu1U8rPpl9i14XUpK2vlCDIK7NRP.";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final LoginAttemptService loginAttemptService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       TokenService tokenService, LoginAttemptService loginAttemptService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.loginAttemptService = loginAttemptService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String login = request.login().trim();
        loginAttemptService.verificarBloqueio(login);

        Optional<Usuario> usuario = usuarioRepository.findByLogin(login);
        String hash = usuario.map(Usuario::getSenhaHash).orElse(HASH_FICTICIO);
        boolean senhaConfere = passwordEncoder.matches(request.senha(), hash);

        if (usuario.isEmpty() || !senhaConfere) {
            loginAttemptService.registrarFalha(login);
            // Mensagem genérica: não revela se o erro foi no login ou na senha.
            throw ApiException.naoAutorizado();
        }

        loginAttemptService.registrarSucesso(login);
        Usuario u = usuario.get();
        return new LoginResponse(tokenService.gerar(u), new LoginResponse.UsuarioResponse(u.getId(), u.getNome()));
    }
}
