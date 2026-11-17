package br.com.fiap.merenda.model;
import jakarta.persistence.*;
@Entity @Table(name="ciclo_pesagem")
public class CicloPesagem {
    @Id @Column(name="ciclo_id", length=100) private String cicloId;
    @Column(name="payload_hash", nullable=false, length=64) private String payloadHash;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="servico_id") private ServicoAlimentacao servico;
    protected CicloPesagem() {}
    public CicloPesagem(String cicloId, String payloadHash, ServicoAlimentacao servico) {
        this.cicloId=cicloId; this.payloadHash=payloadHash; this.servico=servico;
    }
    public void desvincularServico() { servico=null; }
    public String getPayloadHash() { return payloadHash; }
    public ServicoAlimentacao getServico() { return servico; }
}
