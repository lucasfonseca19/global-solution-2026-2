package br.com.fiap.merenda.dto;

public record LoginResponse(String token, UsuarioResponse usuario) {

    public record UsuarioResponse(Long id, String nome) {
    }
}
