package br.com.fiap.merenda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Último peso confirmado de uma categoria em um serviço.
 * Guarda o peso bruto lido na balança, a tara aplicada e o peso líquido (só o alimento).
 */
@Entity
@Table(name = "pesagem",
        uniqueConstraints = @UniqueConstraint(name = "uk_pesagem_servico_categoria",
                columnNames = {"servico_id", "categoria_id"}))
public class Pesagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "servico_id", nullable = false)
    private ServicoAlimentacao servico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lixeira_id", nullable = false)
    private Lixeira lixeira;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaDescarte categoria;

    @Column(name = "peso_bruto_kg", nullable = false, precision = 7, scale = 3)
    private BigDecimal pesoBrutoKg;

    @Column(name = "tara_kg", nullable = false, precision = 7, scale = 3)
    private BigDecimal taraKg;

    @Column(name = "peso_liquido_kg", nullable = false, precision = 7, scale = 3)
    private BigDecimal pesoLiquidoKg;

    @Column(name = "confirmado_em", nullable = false)
    private LocalDateTime confirmadoEm;

    @PrePersist
    @PreUpdate
    void aoConfirmar() {
        confirmadoEm = LocalDateTime.now();
    }

    /** Substitui a leitura anterior (nunca soma). */
    public void registrarLeitura(Lixeira lixeira, BigDecimal pesoBrutoKg, BigDecimal pesoLiquidoKg) {
        this.lixeira = lixeira;
        this.categoria = lixeira.getCategoria();
        this.pesoBrutoKg = pesoBrutoKg;
        this.taraKg = lixeira.getTaraKg();
        this.pesoLiquidoKg = pesoLiquidoKg;
        this.confirmadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public ServicoAlimentacao getServico() { return servico; }
    void setServico(ServicoAlimentacao servico) { this.servico = servico; }
    public Lixeira getLixeira() { return lixeira; }
    public CategoriaDescarte getCategoria() { return categoria; }
    public BigDecimal getPesoBrutoKg() { return pesoBrutoKg; }
    public BigDecimal getTaraKg() { return taraKg; }
    public BigDecimal getPesoLiquidoKg() { return pesoLiquidoKg; }
    public LocalDateTime getConfirmadoEm() { return confirmadoEm; }
}
