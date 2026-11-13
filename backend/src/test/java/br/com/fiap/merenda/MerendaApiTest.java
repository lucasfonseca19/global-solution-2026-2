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
        enviar(post("/servicos"),
                "{\"data\":\"2026-11-13\",\"tipoRefeicao\":\"<script>alert(1)</script>\",\"pesagens\":[]}")
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

    // ------------------------------------------------------------------ serviços

    @Test
    @DisplayName("CT-11 Listar devolve o histórico com total e status")
    void listar() throws Exception {
        enviar(get("/servicos"), null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tipoRefeicao").value("Almoço"))
                .andExpect(jsonPath("$[0].status").value("COMPLETO"))
                .andExpect(jsonPath("$[0].totalKg").value(5));
    }

    @Test
    @DisplayName("CT-12 Criar com uma categoria: 201, pendente, outra categoria null e total parcial")
    void criarPendente() throws Exception {
        enviar(post("/servicos"), """
                {"data":"2026-11-13","tipoRefeicao":"Almoço",
                 "pesagens":[{"codigoRfid":"RFID-SIM-001","pesoBrutoKg":4}]}""")
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/servicos/")))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.pesagens.SOBRA_DESCARTADA.pesoLiquidoKg").value(3))
                .andExpect(jsonPath("$.pesagens.RESTO_PRATO").value(nullValue()))
                .andExpect(jsonPath("$.totalKg").value(3))
                .andExpect(jsonPath("$.alerta").value(nullValue()));
    }

    @Test
    @DisplayName("CT-13 Serviço duplicado (mesma data e refeição) devolve 409")
    void criarDuplicado() throws Exception {
        enviar(post("/servicos"), "{\"data\":\"2026-11-12\",\"tipoRefeicao\":\"almoço\",\"pesagens\":[]}")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("SERVICO_JA_EXISTE"));
    }

    @Test
    @DisplayName("CT-14 Correção substitui o peso (não soma) e passa do limite gera alerta")
    void corrigirComAlerta() throws Exception {
        enviar(put("/servicos/1"), """
                {"data":"2026-11-12","tipoRefeicao":"Almoço","pesagens":[
                  {"codigoRfid":"RFID-SIM-001","pesoBrutoKg":4},
                  {"codigoRfid":"RFID-SIM-002","pesoBrutoKg":4}]}""")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pesagens.RESTO_PRATO.pesoLiquidoKg").value(2.5))
                .andExpect(jsonPath("$.totalKg").value(5.5))
                .andExpect(jsonPath("$.status").value("COMPLETO"))
                .andExpect(jsonPath("$.alerta.tipo").value("DESCARTE_ACIMA_DO_LIMITE"));
    }

    @Test
    @DisplayName("CT-15 PUT sem uma categoria faz ela voltar a aguardar pesagem")
    void putRemoveCategoria() throws Exception {
        enviar(put("/servicos/1"), """
                {"data":"2026-11-12","tipoRefeicao":"Almoço","pesagens":[
                  {"codigoRfid":"RFID-SIM-001","pesoBrutoKg":4}]}""")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.pesagens.RESTO_PRATO").value(nullValue()))
                .andExpect(jsonPath("$.totalKg").value(3));
    }

    @Test
    @DisplayName("CT-16 Duas leituras da mesma categoria no mesmo envio são rejeitadas sem gravar")
    void categoriaRepetida() throws Exception {
        enviar(post("/servicos"), """
                {"data":"2026-11-14","tipoRefeicao":"Almoço","pesagens":[
                  {"codigoRfid":"RFID-SIM-001","pesoBrutoKg":4},
                  {"codigoRfid":"RFID-SIM-001","pesoBrutoKg":5}]}""")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"));

        String lista = enviar(get("/servicos"), null).andReturn().getResponse().getContentAsString();
        JsonNode servicos = objectMapper.readTree(lista);
        assertThat(servicos.toString()).doesNotContain("2026-11-14");
    }

    @Test
    @DisplayName("CT-17 Excluir devolve 204 e o serviço deixa de existir (404)")
    void excluir() throws Exception {
        enviar(delete("/servicos/1"), null).andExpect(status().isNoContent());
        enviar(get("/servicos/1"), null)
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.codigo").value("SERVICO_NAO_ENCONTRADO"));
    }

    @Test
    @DisplayName("CT-18 Data em formato inválido devolve 400")
    void dataInvalida() throws Exception {
        enviar(post("/servicos"), "{\"data\":\"13/11/2026\",\"tipoRefeicao\":\"Almoço\",\"pesagens\":[]}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"));
    }
}
