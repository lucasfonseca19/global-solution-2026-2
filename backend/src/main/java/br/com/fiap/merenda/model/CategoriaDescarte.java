package br.com.fiap.merenda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Categoria de descarte cadastrada no banco (SOBRA_DESCARTADA ou RESTO_PRATO). */
@Entity
@Table(name = "categoria_descarte")
public class CategoriaDescarte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private Categoria codigo;

    @Column(nullable = false, length = 150)
    private String descricao;

    public Long getId() { return id; }
    public Categoria getCodigo() { return codigo; }
    public String getDescricao() { return descricao; }
}
