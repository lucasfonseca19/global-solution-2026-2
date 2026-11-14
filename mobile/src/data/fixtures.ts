import type { Servico } from "./types";
export const exemplos: Servico[] = [
  {
    id: 101,
    data: "2026-11-12",
    tipoRefeicao: "Almoço",
    status: "COMPLETO",
    pesagens: {
      SOBRA_DESCARTADA: {
        lixeiraId: 1,
        codigoRfid: "RFID-SIM-001",
        taraKg: 1,
        pesoBrutoKg: 4,
        pesoLiquidoKg: 3,
      },
      RESTO_PRATO: {
        lixeiraId: 2,
        codigoRfid: "RFID-SIM-002",
        taraKg: 1.5,
        pesoBrutoKg: 3.5,
        pesoLiquidoKg: 2,
      },
    },
    totalKg: 5,
  },
  {
    id: 102,
    data: "2026-11-13",
    tipoRefeicao: "Almoço",
    status: "PENDENTE",
    pesagens: {
      SOBRA_DESCARTADA: {
        lixeiraId: 1,
        codigoRfid: "RFID-SIM-001",
        taraKg: 1,
        pesoBrutoKg: 4,
        pesoLiquidoKg: 3,
      },
      RESTO_PRATO: null,
    },
    totalKg: 3,
  },
  {
    id: 103,
    data: "2026-11-14",
    tipoRefeicao: "Almoço",
    status: "COMPLETO",
    pesagens: {
      SOBRA_DESCARTADA: {
        lixeiraId: 1,
        codigoRfid: "RFID-SIM-001",
        taraKg: 1,
        pesoBrutoKg: 1,
        pesoLiquidoKg: 0,
      },
      RESTO_PRATO: {
        lixeiraId: 2,
        codigoRfid: "RFID-SIM-002",
        taraKg: 1.5,
        pesoBrutoKg: 1.5,
        pesoLiquidoKg: 0,
      },
    },
    totalKg: 0,
  },
];
