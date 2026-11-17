import { Platform, StyleSheet, type TextStyle, type StyleProp } from 'react-native';

export const ALLO_FAMILY = 'Allo Variable';

// O tamanho óptico acompanha o texto, inclusive abaixo de 14. Peso permanece
// em fontWeight por padrão; o terceiro argumento permite um ajuste fino explícito.
export function allo(size: number, roundness = 40, weight?: number): TextStyle {
  return {
    fontFamily: ALLO_FAMILY,
    fontVariationSettings: `'opsz' ${Math.min(32, Math.max(9, size))}, 'ROND' ${roundness}${weight === undefined ? '' : `, 'wght' ${weight}`}`,
  };
}

// React Native usa nomes de variantes; CSS usa as tags OpenType. Não enviar
// "stylistic-two" ao navegador: invalida font-variant e perde os tabulares.
export const identifierType: TextStyle & { fontFeatureSettings?: string } = Platform.OS === 'web'
  ? { fontFeatureSettings: '"ss02" 1', fontVariant: ['tabular-nums'] }
  : { fontVariant: ['stylistic-two', 'tabular-nums'] };

export function alloTextStyle(style: StyleProp<TextStyle>, defaultSize = 16): TextStyle {
  const explicit = StyleSheet.flatten(style) ?? {};
  const size = explicit.fontSize ?? defaultSize;
  const numeric = explicit.fontVariant?.includes('tabular-nums');
  return { ...allo(size, numeric ? 35 : size >= 24 ? 55 : 40), ...explicit };
}
