import {getRandomValues} from 'expo-crypto';
/** Identidade aleatória entre aparelhos/abas; o mesmo ciclo é mantido em retries. */
export function newWeighingCycle(){
 const bytes=getRandomValues(new Uint8Array(16));
 return `ciclo-${Array.from(bytes,byte=>byte.toString(16).padStart(2,'0')).join('')}`;
}
