// Controlli di coerenza sulla tabella ingredienti.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INGREDIENTI, REPARTI } from '../js/dati/ingredienti.js';

test('circa 150 ingredienti con id unici', () => {
  assert.ok(INGREDIENTI.length >= 140);
  assert.equal(new Set(INGREDIENTI.map((i) => i.id)).size, INGREDIENTI.length);
});

test('valori numerici validi, reparto e fonte presenti', () => {
  for (const i of INGREDIENTI) {
    for (const k of ['kcal', 'prot', 'grassi', 'carbo', 'fibre', 'sodio', 'potassio', 'arCrudo', 'arCotto', 'arRaff', 'conf']) {
      assert.ok(Number.isFinite(i[k]) && i[k] >= 0, `${i.id}.${k}`);
    }
    assert.ok(i.prot + i.grassi + i.carbo + i.fibre <= 101, `${i.id}: macro oltre 100 g`);
    assert.ok(REPARTI.includes(i.reparto), `${i.id}: reparto`);
    assert.ok(i.fonte, `${i.id}: fonte`);
  }
});
