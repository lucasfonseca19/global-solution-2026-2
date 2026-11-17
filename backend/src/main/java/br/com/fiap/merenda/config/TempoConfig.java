package br.com.fiap.merenda.config;
import java.time.*;
import org.springframework.context.annotation.*;
@Configuration
public class TempoConfig {
    @Bean public Clock clock() { return Clock.system(ZoneId.of("America/Sao_Paulo")); }
}
