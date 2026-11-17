import {afterEach,expect,test,vi} from 'vitest';
// A suíte Node usa Web Crypto; execução nativa usa a implementação do Expo.
vi.mock('expo-crypto',()=>({getRandomValues:(array:Uint8Array<ArrayBuffer>)=>crypto.getRandomValues(array)}));
import {newWeighingCycle} from './cycle';
afterEach(()=>vi.useRealTimers());
test('clientes no mesmo milissegundo geram ciclos distintos sem contador compartilhado',async()=>{
 vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-17T12:00:00Z'));
 const first=newWeighingCycle();vi.resetModules();
 const second=(await import('./cycle')).newWeighingCycle();
 expect(first).not.toBe(second);expect(first).toMatch(/^ciclo-[a-f0-9]{32}$/);
});
