/** Leituras fictícias: somente RFID e peso, sem categoria escolhida pelo operador. */
export type Leitura = { codigoRfid: string; pesoBrutoKg: number };
export const cenarios: Record<string, { nome: string; leitura: Leitura }> = {
 sobra: { nome: 'Lixeira da cozinha', leitura: { codigoRfid: 'RFID-SIM-001', pesoBrutoKg: 4 } },
 restos: { nome: 'Lixeira dos pratos', leitura: { codigoRfid: 'RFID-SIM-002', pesoBrutoKg: 3.5 } },
 zero: { nome: 'Pratos sem descarte', leitura: { codigoRfid: 'RFID-SIM-002', pesoBrutoKg: 1.5 } },
 desconhecido: { nome: 'Etiqueta desconhecida', leitura: { codigoRfid: 'RFID-SIM-999', pesoBrutoKg: 4 } },
 abaixo: { nome: 'Peso abaixo da tara', leitura: { codigoRfid: 'RFID-SIM-001', pesoBrutoKg: 0.5 } },
};
export function avaliar(leitura: Leitura) {
 const cadastro = [
  { codigoRfid: 'RFID-SIM-001', lixeiraId: 1, categoria: 'SOBRA_DESCARTADA' as const, taraKg: 1 },
  { codigoRfid: 'RFID-SIM-002', lixeiraId: 2, categoria: 'RESTO_PRATO' as const, taraKg: 1.5 },
 ];
 const lixeira = cadastro.find(l => l.codigoRfid === leitura.codigoRfid);
 if (!lixeira) throw Object.assign(new Error('Lixeira não reconhecida. Repita a leitura.'), {codigo:'RFID_DESCONHECIDO'});
 if (!Number.isFinite(leitura.pesoBrutoKg) || leitura.pesoBrutoKg < lixeira.taraKg)
  throw Object.assign(new Error('Peso bruto menor que a tara ou inválido. Repita a leitura.'), {codigo:'PESO_INVALIDO'});
 return {...lixeira, pesoBrutoKg: leitura.pesoBrutoKg, pesoLiquidoKg: leitura.pesoBrutoKg - lixeira.taraKg};
}
