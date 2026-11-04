// Test dell'elenco per Cronometer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RICETTE } from '../js/dati/ricette.js';
import { INGREDIENTI } from '../js/dati/ingredienti.js';
import { IMPOSTAZIONI_PREDEFINITE, copia } from '../js/impostazioni.js';
import { creaContesto, generaSettimana, totaliGiorno } from '../js/generatore.js';
import { giornoCronometer, testoCronometer } from '../js/cronometer.js';
import { valoriIngrediente, vuoto, aggiungi } from '../js/nutrizione.js';

const mappa = Object.fromEntries(INGREDIENTI.map((i) => [i.id, i]));

test('gli ingredienti del giorno danno le stesse kcal del piano', () => {
  const ctx = creaContesto(copia(IMPOSTAZIONI_PREDEFINITE), RICETTE, mappa);
  const piano = generaSettimana(ctx, { seme: 3 });
  for (let i = 0; i < 7; i++) {
    const somma = vuoto();
    for (const gr of giornoCronometer(piano, ctx, i)) for (const a of gr.articoli) aggiungi(somma, valoriIngrediente(mappa[a.id], a.g));
    const { tot } = totaliGiorno(piano.giorni[i].pasti, ctx);
    const mensa = i === 0 ? ctx.imp.mensa.kcal : 0;
    assert.ok(Math.abs(somma.kcal + mensa - tot.kcal) < 0.5, `giorno ${i}`);
  }
});

test('il testo del lunedì segnala la mensa', () => {
  const ctx = creaContesto(copia(IMPOSTAZIONI_PREDEFINITE), RICETTE, mappa);
  const piano = generaSettimana(ctx, { seme: 3 });
  const t = testoCronometer(piano, ctx, 0);
  assert.match(t, /^Lunedì/);
  assert.match(t, /mensa/);
  assert.match(t, / g$/m);
});
