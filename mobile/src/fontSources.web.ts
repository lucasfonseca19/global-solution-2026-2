import type { FontFamilyDefinition } from 'expo-font';
import { ALLO_FAMILY } from './typography';

// WOFF2 mantém os três eixos com menos bytes na prévia web.
export const fontSources: FontFamilyDefinition[] = [{
  fontFamily: ALLO_FAMILY,
  fontDefinitions: [{ path: require('../assets/fonts/AlloVariable.woff2'), weight: '100 900' }],
}];
