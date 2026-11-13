package br.com.fiap.merenda.service;

import java.math.BigDecimal;

/** Utilitário para mostrar pesos sem zeros sobrando (3.000 -> 3, 2.500 -> 2.5). */
final class Pesos {

    private Pesos() {
    }

    static BigDecimal normalizar(BigDecimal valor) {
        if (valor == null) {
            return null;
        }
        BigDecimal semZeros = valor.stripTrailingZeros();
        return semZeros.scale() < 0 ? semZeros.setScale(0) : semZeros;
    }

    static String texto(BigDecimal valor) {
        return normalizar(valor).toPlainString();
    }
}
