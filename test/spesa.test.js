// Test dell'aggregazione della lista della spesa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RICETTE } from '../js/dati/ricette.js';
import { INGREDIENTI } from '../js/dati/ingredienti.js';
import { IMPOSTAZIONI_PREDEFINITE, copia } from '../js/impostazioni.js';
import { creaContesto, generaSettimana } from '../js/generatore.js';
import { grammiPasti, fabbisognoSettimana, quantitaAcquisto, listaSpesa, testoSpesa } from '../js/spesa.js';
import { REPARTI } from '../js/dati/ingredienti.js';

const mappa = Object.fromEntries(INGREDIENTI.map((i) => [i.id, i]));

// Contesto minimo con due ricette inventate e senza integrazione di fecola.
function contestoProva() {
  const imp = copia(IMPOSTAZIONI_PREDEFINITE);
  imp.amidoResistente.integraFecola = false;
  const ricette = [
    { id: 'a', nome: 'A', porzioni: 2, etichette: ['pranzo', 'batch'], ingredienti: [{ id: 'riso_basmati', g: 160, uso: 'cotto' }, { id: 'uova', g: 120, uso: 'cotto' }], cottura: [], passi: [] },
    { id: 'b', nome: 'B', porzioni: 1, etichette: ['cena'], ingredienti: [{ id: 'uova', g: 60, uso: 'cotto' }, { id: 'zucchine', g: 230, uso: 'cotto' }], cottura: [], passi: [] }
  ];
  return creaContesto(imp, ricette, mappa);
}

test('somma gli ingredienti scalando per porzioni e fattore', () => {
  const ctx = contestoProva();
  const g = grammiPasti({ pranzo: { ricetta: 'a', fattore: 1.5 }, cena: { ricetta: 'b', fattore: 1 } }, ctx);
  assert.equal(g.riso_basmati, 120);       // 160 / 2 × 1,5
  assert.equal(g.uova, 90 + 60);           // 120 / 2 × 1,5 + 60
  assert.equal(g.zucchine, 230);
});

test('la mensa non entra nella spesa e la settimana si somma giorno per giorno', () => {
  const ctx = contestoProva();
  const giorno = { pasti: { pranzo: { ricetta: 'a', fattore: 1 }, cena: { ricetta: 'b', fattore: 2 } } };
  const piano = { giorni: [{ pasti: { pranzo: { mensa: true }, cena: { ricetta: 'b', fattore: 1 } } }, ...Array(6).fill(giorno)] };
  const f = fabbisognoSettimana(piano, ctx);
  assert.equal(f.riso_basmati, 80 * 6);
  assert.equal(f.uova, 60 + 6 * (60 + 120));
  assert.equal(f.zucchine, 230 + 6 * 460);
});

test('arrotondamento alle confezioni tipiche', () => {
  // Riso: confezione da 1000 g
  assert.equal(quantitaAcquisto(mappa.riso_basmati, 480).confezioni, 1);
  assert.equal(quantitaAcquisto(mappa.riso_basmati, 1300).confezioni, 2);
  // Tolleranza 2%: 1010 g non fanno comprare un secondo pacco da 1 kg
  assert.equal(quantitaAcquisto(mappa.riso_basmati, 1010).confezioni, 1);
  // Uova: confezione da 6 (360 g), con conteggio dei pezzi
  const u = quantitaAcquisto(mappa.uova, 700);
  assert.equal(u.confezioni, 2);
  assert.match(u.testo, /2 × confezione da 6/);
  assert.match(u.testo, /12 pezzi/);
  // Verdura sfusa: a peso, arrotondata ai 50 g superiori
  const z = quantitaAcquisto(mappa.zucchine, 2990);
  assert.equal(z.confezioni, 0);
  assert.equal(z.grammiAcquisto, 3000);
});

test('lista raggruppata per reparto, con nota sulle uova bio e testo copiabile', () => {
  const ctx = contestoProva();
  const piano = { giorni: Array(7).fill({ pasti: { pranzo: { ricetta: 'a', fattore: 1 }, cena: { ricetta: 'b', fattore: 1 } } }) };
  const lista = listaSpesa(piano, ctx);
  const reparti = lista.map((g) => g.reparto);
  assert.deepEqual(reparti, REPARTI.filter((r) => reparti.includes(r)), 'ordine dei reparti');
  const uova = lista.flatMap((g) => g.articoli).find((a) => a.id === 'uova');
  assert.match(uova.nota, /BIOLOGICHE/);
  const testo = testoSpesa(lista, { zucchine: true }, true);
  assert.match(testo, /Uova intere/);
  assert.doesNotMatch(testo, /Zucchine/);    // già spuntate
});

test('piano reale: la fecola di integrazione finisce nella spesa', () => {
  const imp = copia(IMPOSTAZIONI_PREDEFINITE);
  const ctx = creaContesto(imp, RICETTE, mappa);
  const piano = generaSettimana(ctx, { seme: 1 });
  const f = fabbisognoSettimana(piano, ctx);
  assert.ok(f.fecola > 0);
  // Nessun ingrediente escluso nella spesa
  for (const id of ['pane_bianco', 'albume', 'avocado', 'olio_semi', 'sale']) assert.equal(f[id], undefined);
});
