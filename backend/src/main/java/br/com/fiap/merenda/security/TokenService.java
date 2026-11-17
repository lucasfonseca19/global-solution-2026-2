package br.com.fiap.merenda.security;

import br.com.fiap.merenda.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/** Gera o token JWT devolvido no login. O "subject" é o id do usuário. */
@Service
public class TokenService {

    private final JwtEncoder jwtEncoder;
    private final long validadeHoras;

    public TokenService(JwtEncoder jwtEncoder, @Value("${merenda.jwt.validade-horas}") long validadeHoras) {
        this.jwtEncoder = jwtEncoder;
        this.validadeHoras = validadeHoras;
    }

    public String gerar(Usuario usuario) {
        Instant agora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("merenda-api")
                .subject(String.valueOf(usuario.getId()))
                .issuedAt(agora)
                .expiresAt(agora.plus(validadeHoras, ChronoUnit.HOURS))
                .claim("login", usuario.getLogin())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
