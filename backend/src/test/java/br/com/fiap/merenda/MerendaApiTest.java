package br.com.fiap.merenda;

import br.com.fiap.merenda.model.Usuario;
import br.com.fiap.merenda.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testes de API: sobem a aplicação inteira (controllers, services, repositórios,
 * segurança) com banco H2 em memória. Cada teste desfaz suas alterações (@Transactional).
 * Os nomes CT-xx correspondem ao plano de testes do PDF.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class MerendaApiTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private String token;

    @BeforeEach
    void entrar() throws Exception {
        Tempo.relogio.instante = java.time.Instant.parse("2026-11-18T01:00:00Z");
        String resposta = mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"operador\",\"senha\":\"merenda123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        token = objectMapper.readTree(resposta).get("token").asText();
    }

    private ResultActions enviar(org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder req,
                                 String json) throws Exception {
        req.header("Authorization", "Bearer " + token);
        if (json != null) {
            req.contentType(MediaType.APPLICATION_JSON).content(json);
        }
        return mvc.perform(req);
    }

    // ------------------------------------------------------------------ login e segurança

    @Test
    @DisplayName("CT-01 Login válido devolve token e dados do usuário, sem a senha")
    void loginValido() throws Exception {
        mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"operador\",\"senha\":\"merenda123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.nome").value("Operador de demonstração"))
                .andExpect(jsonPath("$.usuario.senhaHash").doesNotExist());
    }

    @Test
    @DisplayName("CT-02 Senha errada devolve 401 com mensagem genérica")
    void loginSenhaErrada() throws Exception {
        mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"operador\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("NAO_AUTORIZADO"))
                .andExpect(jsonPath("$.mensagem").value("Login ou senha inválidos."));
    }

    @Test
    @DisplayName("CT-03 Acesso sem token ou com token falso devolve 401")
    void semToken() throws Exception {
        mvc.perform(get("/servicos"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("NAO_AUTORIZADO"));
        mvc.perform(get("/servicos").header("Authorization", "Bearer token-falso"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("CT-04 Senha fica guardada como hash BCrypt, nunca em texto puro")
    void senhaEmHash() {
        Usuario operador = usuarioRepository.findByLogin("operador").orElseThrow();
        assertThat(operador.getSenhaHash()).startsWith("$2a$").isNotEqualTo("merenda123");
    }

    @Test
    @DisplayName("CT-05 Entrada com script (XSS) é rejeitada pela validação")
    void bloqueiaXss() throws Exception {
        enviar(post("/pesagens"),
                "{\"data\":\"2026-11-17\",\"tipoRefeicao\":\"<script>alert(1)</script>\",\"cicloId\":\"x\",\"leitura\":{\"codigoRfid\":\"RFID-SIM-001\",\"pesoBrutoKg\":4}}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"))
                .andExpect(jsonPath("$.detalhes[0]", startsWith("tipoRefeicao")));
    }

    @Test
    @DisplayName("CT-06 Tentativa de SQL injection no login não autentica")
    void sqlInjectionNoLogin() throws Exception {
        mvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"operador' OR '1'='1\",\"senha\":\"x' OR '1'='1\"}"))
                .andExpect(status().isUnauthorized());
    }

    // ------------------------------------------------------------------ leituras (IoT)

    @Test
    @DisplayName("CT-07 RFID da cozinha + 4 kg: identifica a sobra e desconta tara de 1 kg")
    void avaliarLeituraValida() throws Exception {
        enviar(post("/leituras/avaliar"), "{\"codigoRfid\":\"RFID-SIM-001\",\"pesoBrutoKg\":4}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria").value("SOBRA_DESCARTADA"))
                .andExpect(jsonPath("$.taraKg").value(1))
                .andExpect(jsonPath("$.pesoLiquidoKg").value(3));
    }

    @Test
    @DisplayName("CT-08 Etiqueta RFID desconhecida é rejeitada")
    void rfidDesconhecido() throws Exception {
        enviar(post("/leituras/avaliar"), "{\"codigoRfid\":\"RFID-SIM-999\",\"pesoBrutoKg\":4}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("RFID_DESCONHECIDO"));
    }

    @Test
    @DisplayName("CT-09 Peso total menor que a tara é rejeitado")
    void pesoAbaixoDaTara() throws Exception {
        enviar(post("/leituras/avaliar"), "{\"codigoRfid\":\"RFID-SIM-001\",\"pesoBrutoKg\":0.5}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("PESO_INVALIDO"))
                .andExpect(jsonPath("$.mensagem", containsString("menor que a tara")));
    }

    @Test
    @DisplayName("CT-10 Peso igual à tara é zero confirmado (não é erro)")
    void zeroConfirmado() throws Exception {
        enviar(post("/leituras/avaliar"), "{\"codigoRfid\":\"RFID-SIM-002\",\"pesoBrutoKg\":1.5}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria").value("RESTO_PRATO"))
                .andExpect(jsonPath("$.pesoLiquidoKg").value(0));
    }


    @org.springframework.boot.test.context.TestConfiguration
    static class Tempo {
        @org.springframework.context.annotation.Bean @org.springframework.context.annotation.Primary
        java.time.Clock testeClock() { return relogio; }
        static final Relogio relogio = new Relogio();
        static class Relogio extends java.time.Clock {
            volatile java.time.Instant instante=java.time.Instant.parse("2026-11-18T01:00:00Z");
            public java.time.Instant instant() { return instante; }
            public java.time.ZoneId getZone() { return java.time.ZoneId.of("America/Sao_Paulo"); }
            public java.time.Clock withZone(java.time.ZoneId zone) { return this; }
        }
    }
    private String confirmar(String ciclo, String rfid, String bruto, String substituir) throws Exception {
        String json = "{\"data\":\"2026-11-17\",\"tipoRefeicao\":\"Almoço\",\"cicloId\":\"" + ciclo + "\",\"leitura\":{\"codigoRfid\":\"" + rfid + "\",\"pesoBrutoKg\":" + bruto + "}" + (substituir == null ? "" : ",\"substituirId\":\"" + substituir + "\"") + "}";
        return enviar(post("/pesagens"), json).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }
    @Test void contribuicoesReplayCorrecaoConclusao() throws Exception {
        JsonNode a = objectMapper.readTree(confirmar("a", "RFID-SIM-001", "4", null));
        String id = a.get("id").asText(), registro = a.get("registros").get(0).get("id").asText();
        confirmar("b", "RFID-SIM-001", "2", null);
        confirmar("c", "RFID-SIM-002", "3.5", null);
        JsonNode replay = objectMapper.readTree(confirmar("a", "RFID-SIM-001", "4.000", null));
        assertThat(replay.get("totalKg").decimalValue()).isEqualByComparingTo("6");
        assertThat(replay.get("registros").size()).isEqualTo(3);
        assertThat(replay.get("registros").get(0).get("id").isTextual()).isTrue();
        assertThat(replay.get("status").asText()).isEqualTo("PENDENTE");
        enviar(put("/servicos/" + id + "/conclusao"), null).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("COMPLETO"));
        JsonNode corrigido = objectMapper.readTree(confirmar("d", "RFID-SIM-001", "3.5", registro));
        assertThat(corrigido.get("totalKg").decimalValue()).isEqualByComparingTo("5.5");
        assertThat(corrigido.get("status").asText()).isEqualTo("COMPLETO");
        confirmar("d", "RFID-SIM-001", "3.5", registro);
        enviar(put("/servicos/" + id + "/conclusao"), null).andExpect(status().isOk());
        enviar(post("/pesagens"), payload("e", "RFID-SIM-001", "2", null)).andExpect(status().isConflict());
        enviar(delete("/servicos/" + id), null).andExpect(status().isNoContent());
        enviar(get("/servicos/" + id), null).andExpect(status().isNotFound());
    }
    private String payload(String ciclo, String rfid, String bruto, String substituir) {
        return "{\"data\":\"2026-11-17\",\"tipoRefeicao\":\"Almoço\",\"cicloId\":\"" + ciclo + "\",\"leitura\":{\"codigoRfid\":\"" + rfid + "\",\"pesoBrutoKg\":" + bruto + "}" + (substituir == null ? "" : ",\"substituirId\":\"" + substituir + "\"") + "}";
    }
    @Test void conflitoReplayEDaLixeiraNaoAlteram() throws Exception {
        JsonNode a = objectMapper.readTree(confirmar("a", "RFID-SIM-001", "4", null));
        String reg = a.get("registros").get(0).get("id").asText();
        enviar(post("/pesagens"), payload("a", "RFID-SIM-001", "5", null)).andExpect(status().isConflict());
        enviar(post("/pesagens"), payload("b", "RFID-SIM-002", "4", reg)).andExpect(status().isConflict());
        enviar(get("/servicos/" + a.get("id").asText()), null).andExpect(jsonPath("$.totalKg").value(3));
    }
    @Test void zeroEConclusaoExigemDuasCategorias() throws Exception {
        JsonNode a = objectMapper.readTree(confirmar("a", "RFID-SIM-001", "1", null));
        enviar(put("/servicos/" + a.get("id").asText() + "/conclusao"), null).andExpect(status().isConflict());
        confirmar("b", "RFID-SIM-002", "1.5", null);
        enviar(put("/servicos/" + a.get("id").asText() + "/conclusao"), null).andExpect(status().isOk()).andExpect(jsonPath("$.totalKg").value(0));
    }
    @Test void diaDoServidorLimitaEscritaEHistoricoContinuaConsultavel() throws Exception {
        enviar(post("/pesagens"), payload("antigo", "RFID-SIM-001", "4", null).replace("2026-11-17", "2026-11-16")).andExpect(status().isConflict());
        enviar(get("/servicos/1"), null).andExpect(status().isOk());
        enviar(delete("/servicos/1"), null).andExpect(status().isConflict());
        enviar(put("/servicos/1/conclusao"), null).andExpect(status().isConflict());
        enviar(post("/pesagens"), payload("fraude", "RFID-SIM-001", "4", "1")).andExpect(status().isConflict());
    }
    @Test void validacaoEMetodosAntigos() throws Exception {
        for (String bruto : new String[]{"500.001", "1.0001", "-1"})
            enviar(post("/pesagens"), payload("a", "RFID-SIM-001", bruto, null)).andExpect(status().isBadRequest());
        enviar(post("/servicos"), "{}").andExpect(status().isMethodNotAllowed());
        enviar(put("/servicos/1"), "{}").andExpect(status().isMethodNotAllowed());
    }

    @Test void viradaDoDiaBloqueiaConfirmacaoECorrecaoEExclusao() throws Exception {
        JsonNode a=objectMapper.readTree(confirmar("virada", "RFID-SIM-001", "4", null));
        Tempo.relogio.instante=java.time.Instant.parse("2026-11-18T03:00:00Z");
        enviar(post("/pesagens"), payload("virada", "RFID-SIM-001", "4", null)).andExpect(status().isConflict());
        enviar(post("/pesagens"), payload("nova", "RFID-SIM-001", "4", null)).andExpect(status().isConflict());
        enviar(delete("/servicos/"+a.get("id").asText()),null).andExpect(status().isConflict());
        enviar(put("/servicos/"+a.get("id").asText()+"/conclusao"),null).andExpect(status().isConflict());
    }
    @Test void tokenExpiradoNaoAutoriza() throws Exception {
        org.springframework.security.oauth2.jwt.JwtClaimsSet claims=org.springframework.security.oauth2.jwt.JwtClaimsSet.builder().subject("1")
            .issuedAt(java.time.Instant.now().minusSeconds(7200)).expiresAt(java.time.Instant.now().minusSeconds(3600)).build();
        String vencido=encoder.encode(org.springframework.security.oauth2.jwt.JwtEncoderParameters.from(
            org.springframework.security.oauth2.jwt.JwsHeader.with(org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS256).build(),claims)).getTokenValue();
        mvc.perform(get("/servicos").header("Authorization","Bearer "+vencido)).andExpect(status().isUnauthorized());
    }
    @Autowired br.com.fiap.merenda.service.ServicoService service;
    @Autowired org.springframework.security.oauth2.jwt.JwtEncoder encoder;
    @Test @Transactional(propagation=org.springframework.transaction.annotation.Propagation.NOT_SUPPORTED)
    void confirmacoesConcorrentesCriamUmServicoESomamSemDuplicar() throws Exception {
        var executor=java.util.concurrent.Executors.newFixedThreadPool(4);
        try {
            var inicio=new java.util.concurrent.CountDownLatch(1);
            var tarefas=new java.util.ArrayList<java.util.concurrent.Future<br.com.fiap.merenda.dto.ServicoResponse>>();
            for (int i=0;i<4;i++) {
                final int n=i;
                tarefas.add(executor.submit(()->{inicio.await();return service.confirmar(new br.com.fiap.merenda.dto.ConfirmacaoPesagem(
                    java.time.LocalDate.parse("2026-11-17"), n%2==0?"Almoço":"  ALMOCO  ","concorrente-"+(n%3),
                    new br.com.fiap.merenda.dto.LeituraRequest("RFID-SIM-001",new java.math.BigDecimal("2")),null),1L);}));
            }
            inicio.countDown();Long id=tarefas.get(0).get(15,java.util.concurrent.TimeUnit.SECONDS).id();
            for (var tarefa:tarefas) assertThat(tarefa.get(15,java.util.concurrent.TimeUnit.SECONDS).id()).isEqualTo(id);
            var finalizado=service.detalhar(id);
            assertThat(finalizado.registros()).hasSize(3);
            assertThat(finalizado.totalKg()).isEqualByComparingTo("3");
            service.excluir(id);
        } finally {executor.shutdownNow();}
    }

    @Test void preservaAcentosDeRefeicaoEIdentificaVariacoes() throws Exception {
        String primeiro=enviar(post("/pesagens"),payload("cafe-1","RFID-SIM-001","2",null).replace("Almoço","  Café   da manhã  "))
            .andExpect(status().isOk()).andExpect(jsonPath("$.tipoRefeicao").value("Café da manhã")).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        JsonNode a=objectMapper.readTree(primeiro);
        enviar(post("/pesagens"),payload("cafe-2","RFID-SIM-001","2",null).replace("Almoço","CAFE DA MANHA"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(a.get("id").asLong())).andExpect(jsonPath("$.totalKg").value(2));
    }

    @Test void replayAposExcluirNaoRessuscitaServico() throws Exception {
        JsonNode criado=objectMapper.readTree(confirmar("excluido","RFID-SIM-001","2",null));
        enviar(delete("/servicos/"+criado.get("id").asText()),null).andExpect(status().isNoContent());
        enviar(post("/pesagens"),payload("excluido","RFID-SIM-001","2",null))
            .andExpect(status().isConflict()).andExpect(jsonPath("$.codigo").value("SERVICO_EXCLUIDO"));
        enviar(post("/pesagens"),payload("excluido","RFID-SIM-001","3",null))
            .andExpect(status().isConflict()).andExpect(jsonPath("$.codigo").value("CICLO_CONFLITANTE"));
        enviar(get("/servicos/"+criado.get("id").asText()),null).andExpect(status().isNotFound());
    }
}
