#!/usr/bin/env -S node --experimental-strip-types
import { avaliar, cenarios } from './shared.ts';
const [comando, nome] = process.argv.slice(2);
if (comando === 'listar') {
 console.log(Object.entries(cenarios).map(([key,c]) => `${key}: ${c.nome}`).join('\n'));
} else if (['emitir','avaliar'].includes(comando) && Object.hasOwn(cenarios, nome)) {
 const leitura = {...cenarios[nome].leitura};
 console.log(JSON.stringify(leitura));
 if(comando === 'avaliar') {
  try { console.log(JSON.stringify(avaliar(leitura))); }
  catch(e) { console.error(JSON.stringify({codigo:e.codigo,mensagem:e.message})); process.exitCode=1; }
 }
} else {
 console.error('Uso: node --experimental-strip-types iot/cli.mjs listar | emitir <cenário> | avaliar <cenário>');
 process.exitCode=2;
}
