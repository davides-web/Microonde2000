// Test del generatore del piano: rispetto di obiettivi e tolleranze.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RICETTE } from '../js/dati/ricette.js';
import { INGREDIENTI } from '../js/dati/ingredienti.js';
import { IMPOSTAZIONI_PREDEFINITE, copia, eMensa } from '../js/impostazioni.js';
import { creaContesto, generaSettimana, valutaPiano, conteggioRicette, rigeneraGiorno } from '../js/generatore.js';
import { problemiRicetta } from '../js/esclusioni.js';

const mappa = Object.fromEntries(INGREDIENTI.map((i) => [i.id, i]));

function contesto(modifica) {
  const imp = copia(IMPOSTAZIONI_PREDEFINITE);
  if (modifica) modifica(imp);
  return creaContesto(imp, RICETTE, mappa);
}

test('con le impostazioni predefinite ogni giorno è entro la tolleranza', () => {
  const ctx = contesto();
  for (const seme of [1, 2, 3, 4, 5]) {
    const piano = generaSettimana(ctx, { seme });
    const v = valutaPiano(piano, ctx);
    v.giorni.forEach((g, i) => {
      assert.ok(g.entroTolleranza, `seme ${seme}, giorno ${i}: kcal ${g.totali.kcal.toFixed(0)}, P ${g.pc.prot.toFixed(1)}%, G ${g.pc.grassi.toFixed(1)}%, C ${g.pc.carbo.toFixed(1)}%`);
      assert.ok(Math.abs(g.totali.kcal - g.obiettivo.kcal) <= g.obiettivo.kcal * 0.05);
    });
  }
});

test('amido resistente: la media settimanale raggiunge l\'obiettivo (con fecola)', () => {
  const ctx = contesto();
  const v = valutaPiano(generaSettimana(ctx, { seme: 11 }), ctx);
  assert.ok(v.settimana.totali.ar / 7 >= 0.9 * 40, `media AR ${(v.settimana.totali.ar / 7).toFixed(1)} g`);
  for (const g of v.giorni) assert.ok(g.fecolaG <= 40, 'fecola entro il massimo');
});

test('giorno di ricarica (sabato) con più kcal e carboidrati', () => {
  const ctx = contesto();
  const v = valutaPiano(generaSettimana(ctx, { seme: 3 }), ctx);
  const sab = v.giorni[5];
  assert.equal(sab.obiettivo.ricarica, true);
  assert.equal(sab.obiettivo.kcal, 2400);
  assert.ok(sab.totali.carbo > v.giorni[1].totali.carbo);
  assert.ok(sab.entroTolleranza);
});

test('mensa del lunedì: pranzo escluso dal piano ma contato nei totali', () => {
  const ctx = contesto();
  const piano = generaSettimana(ctx, { seme: 4 });
  assert.ok(eMensa(ctx.imp, 0, 'pranzo'));
  assert.deepEqual(piano.giorni[0].pasti.pranzo, { mensa: true });
  for (let g = 1; g < 7; g++) assert.ok(piano.giorni[g].pasti.pranzo.ricetta);
});

test('varietà: nessuna ricetta oltre il massimo di ripetizioni, mai due volte nello stesso giorno', () => {
  const ctx = contesto((i) => { i.maxRipetizioni = 2; });
  const piano = generaSettimana(ctx, { seme: 7 });
  for (const n of Object.values(conteggioRicette(piano))) assert.ok(n <= 2);
  for (const g of piano.giorni) {
    const ids = Object.values(g.pasti).filter((p) => p.ricetta).map((p) => p.ricetta);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test('esclusioni: il piano usa solo ricette ammesse', () => {
  const ctx = contesto();
  // Una ricetta "proibita" inserita nel ricettario non deve comparire.
  const proibita = { id: 'toast', nome: 'Toast', porzioni: 1, etichette: ['colazione', 'pranzo', 'cena', 'spuntino'], ingredienti: [{ id: 'pane_bianco', g: 100, uso: 'cotto' }, { id: 'uova', g: 120, uso: 'cotto' }], cottura: [], passi: [] };
  const ctx2 = creaContesto(ctx.imp, [...RICETTE, proibita], mappa);
  const piano = generaSettimana(ctx2, { seme: 2 });
  assert.equal(conteggioRicette(piano).toast, undefined);
  for (const g of piano.giorni) for (const p of Object.values(g.pasti)) {
    if (p.ricetta) assert.deepEqual(problemiRicetta(ctx2.ricette[p.ricetta], mappa, ctx2.imp), []);
  }
});

test('batch cooking: alcune ricette batch ricompaiono in giorni vicini', () => {
  const ctx = contesto();
  const piano = generaSettimana(ctx, { seme: 5 });
  let avanzi = 0;
  for (let g = 1; g < 7; g++) {
    const ieri = new Set(Object.values(piano.giorni[g - 1].pasti).map((p) => p.ricetta));
    for (const p of Object.values(piano.giorni[g].pasti)) {
      if (p.ricetta && ieri.has(p.ricetta) && ctx.ricette[p.ricetta].etichette.includes('batch')) avanzi++;
    }
  }
  assert.ok(avanzi >= 3, `avanzi batch: ${avanzi}`);
});

test('pasti bloccati restano uguali dopo la rigenerazione', () => {
  const ctx = contesto();
  const piano = generaSettimana(ctx, { seme: 8 });
  piano.giorni[2].pasti.cena = { ricetta: 'zuppa_ceci_uovo', fattore: 1.25, bloccato: true };
  const nuovo = generaSettimana(ctx, { seme: 9, pianoEsistente: piano });
  assert.deepEqual(nuovo.giorni[2].pasti.cena, { ricetta: 'zuppa_ceci_uovo', fattore: 1.25, bloccato: true });
  const giorno = rigeneraGiorno(ctx, nuovo, 2, 1);
  assert.equal(giorno.cena.ricetta, 'zuppa_ceci_uovo');
});

test('stesso seme, stesso piano', () => {
  const ctx = contesto();
  const a = generaSettimana(ctx, { seme: 42 });
  const b = generaSettimana(ctx, { seme: 42 });
  assert.deepEqual(a.giorni, b.giorni);
});
