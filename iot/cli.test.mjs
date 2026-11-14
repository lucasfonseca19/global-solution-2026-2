import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
test('rejeita nomes herdados e inexistentes sem emitir leitura', () => {
  for (const nome of ['constructor', 'toString', 'inexistente']) {
    const result = spawnSync(process.execPath, ['--experimental-strip-types', cli, 'emitir', nome], { encoding: 'utf8' });
    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
  }
});
test('emite somente código e peso de um cenário conhecido', () => {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', cli, 'emitir', 'sobra'], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), { codigoRfid: 'RFID-SIM-001', pesoBrutoKg: 4 });
});
