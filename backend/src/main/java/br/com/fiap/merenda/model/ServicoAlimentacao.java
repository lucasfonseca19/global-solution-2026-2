package br.com.fiap.merenda.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Serviço de alimentação: uma refeição em uma data (ex.: almoço de 12/11).
 * Só existe um serviço por data e tipo de refeição.
 */
@Entity
@Table(name = "servico_alimentacao",
        uniqueConstraints = @UniqueConstraint(name = "uk_servico_data_tipo",
                columnNames = {"data_servico", "tipo_refeicao"}))
public class ServicoAlimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_servico", nullable = false)
    private LocalDate dataServico;

    @Column(name = "tipo_refeicao", nullable = false, length = 30)
    private String tipoRefeicao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    /** Excluir o serviço remove suas pesagens (cascade + orphanRemoval). */
    @OneToMany(mappedBy = "servico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pesagem> pesagens = new ArrayList<>();

    @PrePersist
    void aoCriar() {
        LocalDateTime agora = LocalDateTime.now();
        criadoEm = agora;
        atualizadoEm = agora;
    }

    @PreUpdate
    void aoAtualizar() {
        atualizadoEm = LocalDateTime.now();
    }

    public void adicionarPesagem(Pesagem pesagem) {
        pesagem.setServico(this);
        pesagens.add(pesagem);
    }

    public Long getId() { return id; }
    public LocalDate getDataServico() { return dataServico; }
    public void setDataServico(LocalDate dataServico) { this.dataServico = dataServico; }
    public String getTipoRefeicao() { return tipoRefeicao; }
    public void setTipoRefeicao(String tipoRefeicao) { this.tipoRefeicao = tipoRefeicao; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
    public List<Pesagem> getPesagens() { return pesagens; }
}
