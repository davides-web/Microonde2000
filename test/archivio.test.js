// Test dell'archivio e del backup.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statoIniziale, salvaStato, caricaStato, creaBackup, leggiBackup } from '../js/archivio.js';
import { IMPOSTAZIONI_PREDEFINITE, unisciImpostazioni } from '../js/impostazioni.js';

// Finto localStorage per Node.
function memoriaFinta() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}

test('salva e ricarica lo stato', () => {
  const mem = memoriaFinta();
  const s = statoIniziale();
  s.impostazioni.kcal = 1800;
  assert.equal(salvaStato(s, mem), true);
  assert.equal(caricaStato(mem).impostazioni.kcal, 1800);
});

test('backup: esporta e reimporta gli stessi dati', () => {
  const s = statoIniziale();
  s.ricetteUtente.prova = { id: 'prova', nome: 'Prova' };
  const r = leggiBackup(creaBackup(s));
  assert.deepEqual(r.ricetteUtente, s.ricetteUtente);
});

test('backup non valido viene rifiutato', () => {
  assert.throws(() => leggiBackup('non json'));
  assert.throws(() => leggiBackup('{"app":"altro"}'));
});

test('le impostazioni salvate vengono unite ai default', () => {
  const imp = unisciImpostazioni({ kcal: 2200, macro: { prot: 35 } });
  assert.equal(imp.kcal, 2200);
  assert.equal(imp.macro.prot, 35);
  assert.equal(imp.macro.grassi, IMPOSTAZIONI_PREDEFINITE.macro.grassi);
});
