import type { FontFamilyDefinition } from 'expo-font';
import { ALLO_FAMILY } from './typography';

export const fontSources: FontFamilyDefinition[] = [{
  fontFamily: ALLO_FAMILY,
  fontDefinitions: [{ path: require('../assets/fonts/AlloVariable.ttf'), weight: '100 900' }],
}];
