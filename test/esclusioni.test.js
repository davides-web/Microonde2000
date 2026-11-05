// Test delle esclusioni: nessuna ricetta predefinita usa ingredienti esclusi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RICETTE } from '../js/dati/ricette.js';
import { INGREDIENTI } from '../js/dati/ingredienti.js';
import { IMPOSTAZIONI_PREDEFINITE, copia } from '../js/impostazioni.js';
import { problemiRicetta, motivoEsclusione, categorieEscluse } from '../js/esclusioni.js';

const mappa = Object.fromEntries(INGREDIENTI.map((i) => [i.id, i]));
const imp = copia(IMPOSTAZIONI_PREDEFINITE);

test('nessuna ricetta predefinita contiene ingredienti esclusi', () => {
  for (const r of RICETTE) {
    assert.deepEqual(problemiRicetta(r, mappa, imp), [], `Ricetta ${r.id}`);
  }
});

test('nessuna ricetta usa albume, pane, avocado, oli o sale da cucina', () => {
  const vietati = new Set(['albume', 'pane_bianco', 'pane_integrale', 'avocado', 'olio_semi', 'olio_evo', 'sale', 'farina_00', 'wurstel', 'prosciutto_cotto', 'dado', 'proteine_siero']);
  for (const r of RICETTE) for (const i of r.ingredienti) assert.ok(!vietati.has(i.id), `${r.id} usa ${i.id}`);
});

test('gli ingredienti esclusi vengono riconosciuti', () => {
  assert.ok(motivoEsclusione(mappa.pane_bianco, imp));
  assert.ok(motivoEsclusione(mappa.albume, imp));
  assert.ok(motivoEsclusione(mappa.avocado, imp));
  assert.ok(motivoEsclusione(mappa.wurstel, imp));
  assert.ok(motivoEsclusione(mappa.farina_00, imp));
  assert.ok(motivoEsclusione(mappa.olio_semi, imp));
  assert.ok(motivoEsclusione(mappa.sale, imp));
  assert.equal(motivoEsclusione(mappa.uova, imp), null);
  assert.equal(motivoEsclusione(mappa.sale_iposodico, imp), null);
});

test('olio EVO: escluso per default, ammesso con l\'interruttore', () => {
  assert.ok(categorieEscluse(imp).has('olio_evo'));
  const imp2 = copia(imp);
  imp2.esclusioni.consentiOlioEvo = true;
  assert.equal(motivoEsclusione(mappa.olio_evo, imp2), null);
  // L'interruttore EVO non riammette gli altri oli vegetali.
  assert.ok(motivoEsclusione(mappa.olio_semi, imp2));
});

test('una ricetta dell\'utente con pane viene segnalata', () => {
  const r = { ingredienti: [{ id: 'uova', g: 60 }, { id: 'pane_integrale', g: 50 }] };
  const p = problemiRicetta(r, mappa, imp);
  assert.equal(p.length, 1);
  assert.equal(p[0].id, 'pane_integrale');
});
