package br.com.fiap.merenda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

/** Lixeira com etiqueta RFID, categoria fixa e tara (peso da lixeira vazia). */
@Entity
@Table(name = "lixeira")
public class Lixeira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_rfid", nullable = false, unique = true, length = 40)
    private String codigoRfid;

    @Column(nullable = false, length = 100)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaDescarte categoria;

    @Column(name = "tara_kg", nullable = false, precision = 7, scale = 3)
    private BigDecimal taraKg;

    public Long getId() { return id; }
    public String getCodigoRfid() { return codigoRfid; }
    public String getDescricao() { return descricao; }
    public CategoriaDescarte getCategoria() { return categoria; }
    public BigDecimal getTaraKg() { return taraKg; }
}
