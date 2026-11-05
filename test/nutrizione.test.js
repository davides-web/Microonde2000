// Test del calcolo dei valori nutrizionali di una ricetta.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { valoriRicetta, percentualiMacro, valoriIngrediente } from '../js/nutrizione.js';
import { RICETTE } from '../js/dati/ricette.js';
import { INGREDIENTI } from '../js/dati/ingredienti.js';

// Due ingredienti inventati con numeri tondi per verificare i conti.
const mappa = {
  a: { id: 'a', kcal: 100, prot: 10, grassi: 2, carbo: 10, fibre: 1, sodio: 50, potassio: 100, arCrudo: 10, arCotto: 1, arRaff: 4 },
  b: { id: 'b', kcal: 400, prot: 0, grassi: 20, carbo: 50, fibre: 0, sodio: 0, potassio: 0, arCrudo: 0, arCotto: 0, arRaff: 0 }
};

test('somma degli ingredienti e divisione per porzioni', () => {
  const ricetta = { porzioni: 2, ingredienti: [{ id: 'a', g: 200, uso: 'cotto' }, { id: 'b', g: 50, uso: 'cotto' }] };
  const v = valoriRicetta(ricetta, mappa);
  assert.equal(v.totale.kcal, 400);   // 200 + 200
  assert.equal(v.totale.prot, 20);
  assert.equal(v.totale.grassi, 14);  // 4 + 10
  assert.equal(v.totale.carbo, 45);   // 20 + 25
  assert.equal(v.porzione.kcal, 200);
  assert.equal(v.porzione.sodio, 50);
  assert.equal(v.pesoPorzione, 125);
});

test('amido resistente secondo lo stato (crudo, cotto, raffreddato)', () => {
  const ing = mappa.a;
  assert.equal(valoriIngrediente(ing, 100, 'crudo').ar, 10);
  assert.equal(valoriIngrediente(ing, 100, 'cotto').ar, 1);
  assert.equal(valoriIngrediente(ing, 100, 'raffreddato').ar, 4);
});

test('ingredienti mancanti vengono segnalati e ignorati', () => {
  const v = valoriRicetta({ porzioni: 1, ingredienti: [{ id: 'a', g: 100 }, { id: 'zzz', g: 50 }] }, mappa);
  assert.deepEqual(v.mancanti, ['zzz']);
  assert.equal(v.totale.kcal, 100);
});

test('percentuali dei macro sommano a 100', () => {
  const pc = percentualiMacro({ prot: 30, grassi: 10, carbo: 40 });
  assert.ok(Math.abs(pc.prot + pc.grassi + pc.carbo - 100) < 1e-9);
  assert.ok(Math.abs(pc.prot - (120 / 370) * 100) < 1e-9);
});

test('ricetta reale: porridge ai mirtilli calcolato dalla tabella', () => {
  const m = Object.fromEntries(INGREDIENTI.map((i) => [i.id, i]));
  const r = RICETTE.find((x) => x.id === 'porridge_mirtilli');
  const v = valoriRicetta(r, m).porzione;
  // avena 50 g + latte 200 g + yogurt 150 g + mirtilli 80 g + noci 12 g + cannella 1 g
  const atteso = 379 * 0.5 + 46 * 2 + 59 * 1.5 + 57 * 0.8 + 654 * 0.12 + 247 * 0.01;
  assert.ok(Math.abs(v.kcal - atteso) < 1e-6);
});

test('almeno 40 ricette, id unici, ingredienti esistenti, dati completi', () => {
  const m = Object.fromEntries(INGREDIENTI.map((i) => [i.id, i]));
  assert.ok(RICETTE.length >= 40);
  assert.equal(new Set(RICETTE.map((r) => r.id)).size, RICETTE.length);
  for (const r of RICETTE) {
    for (const i of r.ingredienti) assert.ok(m[i.id], `${r.id}: ingrediente ${i.id} mancante`);
    assert.ok(r.passi.length >= 2, `${r.id}: passi`);
    assert.ok(r.cottura.length >= 1 && r.cottura.every((c) => c.w > 0 && c.min > 0), `${r.id}: cottura al microonde`);
    assert.ok(r.contenitore, `${r.id}: contenitore`);
    assert.ok(r.passi.some((p) => /\d+\s*W/.test(p)), `${r.id}: potenza in watt nei passi`);
    assert.ok(r.etichette.some((e) => ['colazione', 'pranzo', 'cena', 'spuntino'].includes(e)), `${r.id}: etichetta pasto`);
    if (r.etichette.includes('batch')) assert.ok(r.porzioni >= 2, `${r.id}: batch con almeno 2 porzioni`);
  }
});
