// ==========================================================
// Generatore del piano settimanale.
//
// Idea (semplice ma efficace):
// 1. per ogni giorno, dal lunedì alla domenica, si provano molte
//    combinazioni casuali di ricette adatte ai pasti (colazione, pranzo...);
// 2. per ogni combinazione si cercano le porzioni migliori
//    (da 0,5 a 2 porzioni per pasto) che avvicinano kcal e macro agli
//    obiettivi;
// 3. si tiene la combinazione col punteggio migliore, premiando gli avanzi
//    di ricette batch (cucinate una volta per 2-3 pasti) e penalizzando
//    le ripetizioni;
// 4. si ripete tutta la settimana alcune volte e si sceglie la migliore.
// L'amido resistente mancante può essere integrato con fecola cruda.
// ==========================================================
import { obiettivoGiorno, eMensa } from './impostazioni.js';
import { valoriRicetta, percentualiMacro, vuoto, aggiungi, arPer100 } from './nutrizione.js';
import { ricettaAmmessa, motivoEsclusione } from './esclusioni.js';

// Porzioni possibili per un pasto.
export const FATTORI = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Generatore di numeri casuali con "seme": stesso seme, stesso piano.
export function casuale(seme) {
  let a = (Number(seme) >>> 0) || 1;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Prepara tutto ciò che serve ai calcoli: valori per porzione delle
// ricette ammesse, ricette per tipo di pasto, dati della fecola.
export function creaContesto(impostazioni, ricette, mappaIngredienti) {
  const valori = {};
  const ammesse = [];
  for (const r of ricette) {
    const v = valoriRicetta(r, mappaIngredienti);
    valori[r.id] = v.porzione;
    if (v.mancanti.length === 0 && ricettaAmmessa(r, mappaIngredienti, impostazioni)) ammesse.push(r);
  }
  const perTipo = {};
  for (const tipo of ['colazione', 'pranzo', 'cena', 'spuntino']) {
    perTipo[tipo] = ammesse.filter((r) => r.etichette.includes(tipo));
  }
  const fecola = mappaIngredienti.fecola;
  const fecolaOk = fecola && !motivoEsclusione(fecola, impostazioni) && arPer100(fecola, 'crudo') > 0;
  return {
    imp: impostazioni,
    ricette: Object.fromEntries(ricette.map((r) => [r.id, r])),
    ammesse: new Set(ammesse.map((r) => r.id)),
    valori,
    perTipo,
    mappaIngredienti,
    fecola: fecolaOk ? fecola : null
  };
}

// Grammi di fecola cruda da aggiungere per colmare l'amido resistente
// mancante (a multipli di 5 g, entro il massimo impostato).
export function fecolaNecessaria(arAttuale, ctx) {
  const ar = ctx.imp.amidoResistente;
  if (!ar.integraFecola || !ctx.fecola) return 0;
  const mancante = ar.obiettivo - arAttuale;
  if (mancante <= 0) return 0;
  const g = Math.ceil(mancante / (arPer100(ctx.fecola, 'crudo') / 100) / 5) * 5;
  return Math.min(g, Number(ar.maxFecola) || 0);
}

// Totali di un giorno: pasti + eventuale mensa + eventuale fecola.
// "pasti" è { idPasto: { ricetta, fattore } | { mensa: true } }.
export function totaliGiorno(pasti, ctx) {
  const tot = vuoto();
  for (const p of Object.values(pasti)) {
    if (!p) continue;
    if (p.mensa) {
      const m = ctx.imp.mensa;
      aggiungi(tot, { kcal: m.kcal, prot: m.prot, grassi: m.grassi, carbo: m.carbo });
    } else if (ctx.valori[p.ricetta]) {
      aggiungi(tot, ctx.valori[p.ricetta], p.fattore);
    }
  }
  const fecolaG = fecolaNecessaria(tot.ar, ctx);
  if (fecolaG > 0) {
    const f = ctx.fecola;
    aggiungi(tot, { kcal: f.kcal, prot: f.prot, grassi: f.grassi, carbo: f.carbo, fibre: f.fibre, sodio: f.sodio, potassio: f.potassio, ar: arPer100(f, 'crudo') }, fecolaG / 100);
  }
  return { tot, fecolaG };
}

// Verifica di un giorno rispetto agli obiettivi e alla tolleranza.
export function verificaGiorno(tot, obiettivo, tolleranza) {
  const pc = percentualiMacro(tot);
  const scartoKcal = ((tot.kcal - obiettivo.kcal) / obiettivo.kcal) * 100;
  const ok = {
    kcal: Math.abs(scartoKcal) <= tolleranza,
    prot: Math.abs(pc.prot - obiettivo.pct.prot) <= tolleranza,
    grassi: Math.abs(pc.grassi - obiettivo.pct.grassi) <= tolleranza,
    carbo: Math.abs(pc.carbo - obiettivo.pct.carbo) <= tolleranza,
    ar: tot.ar >= obiettivo.ar - 0.05
  };
  return { pc, scartoKcal, ok, entroTolleranza: ok.kcal && ok.prot && ok.grassi && ok.carbo };
}

// Punteggio di un giorno: più è basso, meglio è.
function punteggioGiorno(tot, ob, imp, kcalPasti) {
  const tol = Math.max(1, Number(imp.tolleranza) || 5);
  const pc = percentualiMacro(tot);
  const scarti = [
    (tot.kcal - ob.kcal) / ((ob.kcal * tol) / 100),
    (pc.prot - ob.pct.prot) / tol,
    (pc.grassi - ob.pct.grassi) / tol,
    (pc.carbo - ob.pct.carbo) / tol
  ];
  let s = 0;
  for (const e of scarti) {
    s += e * e;
    // Forte penalità oltre il 70% della tolleranza: margine di sicurezza.
    const a = Math.abs(e);
    if (a > 0.7) s += 20 * (a - 0.7) ** 2;
  }
  if (tot.ar < ob.ar) s += 40 * ((ob.ar - tot.ar) / ob.ar) ** 2;
  // Porzioni equilibrate tra i pasti (rispetto alla quota indicativa).
  for (const { kcal, quota } of kcalPasti) {
    if (quota > 0) s += 1.0 * (kcal / ((quota / 100) * ob.kcal) - 1) ** 2;
  }
  return s;
}

// Sceglie a caso un elemento di un array.
function scegli(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

// Genera il piano di 7 giorni.
// opzioni.pianoEsistente: i pasti con bloccato=true vengono mantenuti.
export function generaSettimana(ctx, opzioni = {}) {
  const seme = opzioni.seme ?? Math.floor(Math.random() * 1e9);
  const rnd = casuale(seme);
  const tentativi = opzioni.tentativi ?? 5;
  const combinazioni = opzioni.combinazioni ?? 60;
  let migliore = null;
  for (let t = 0; t < tentativi; t++) {
    const piano = costruisciSettimana(ctx, opzioni.pianoEsistente, rnd, combinazioni);
    if (!migliore || piano.punteggio < migliore.punteggio) migliore = piano;
  }
  // Ultimo passaggio: i giorni fuori tolleranza vengono ricalcolati con più tentativi.
  for (let g = 0; g < 7; g++) {
    const ob = obiettivoGiorno(ctx.imp, g);
    for (let prova = 0; prova < 3; prova++) {
      const { tot } = totaliGiorno(migliore.giorni[g].pasti, ctx);
      if (verificaGiorno(tot, ob, ctx.imp.tolleranza).entroTolleranza) break;
      const stato = statoSettimana(ctx, migliore.giorni, g);
      const nuovo = miglioreGiorno(ctx, g, migliore.giorni[g].pasti, stato, rnd, combinazioni * 10, true);
      const nuovoOk = verificaGiorno(totaliGiorno(nuovo.pasti, ctx).tot, ob, ctx.imp.tolleranza).entroTolleranza;
      if (nuovoOk || nuovo.punteggio < valutaPunteggioGiorno(ctx, g, migliore.giorni[g].pasti, stato)) migliore.giorni[g].pasti = nuovo.pasti;
    }
  }
  return { seme, creato: new Date().toISOString(), giorni: migliore.giorni.map((g) => ({ pasti: g.pasti })) };
}

// Ricostruisce usi e sessioni batch della settimana, escluso un giorno.
function statoSettimana(ctx, giorni, escluso) {
  const usi = {};
  const sessioni = {};
  giorni.forEach((g, i) => {
    if (i === escluso) return;
    registraGiorno(ctx, g.pasti, i, usi, sessioni);
  });
  return { usi, sessioni };
}

function registraGiorno(ctx, pasti, giorno, usi, sessioni) {
  for (const p of Object.values(pasti)) {
    if (!p || p.mensa || !p.ricetta) continue;
    usi[p.ricetta] = (usi[p.ricetta] || 0) + 1;
    const r = ctx.ricette[p.ricetta];
    if (r && r.etichette.includes('batch')) {
      const s = sessioneAperta(r, sessioni[p.ricetta], giorno);
      if (s) s.pasti++;
      else (sessioni[p.ricetta] ||= []).push({ inizio: giorno, pasti: 1 });
    }
  }
}

// Una sessione batch è "aperta" se il cibo è ancora in frigo da pochi
// giorni (entro frigoGiorni, massimo 2 giorni dopo la cottura) e non
// si sono già fatti 3 pasti.
function sessioneAperta(ricetta, sessioni, giorno) {
  if (!sessioni) return null;
  const giorniMax = Math.min(2, Math.max(0, Number(ricetta.frigoGiorni) || 0));
  return sessioni.find((s) => giorno >= s.inizio && giorno - s.inizio <= giorniMax && s.pasti < 3) || null;
}

function costruisciSettimana(ctx, pianoEsistente, rnd, combinazioni) {
  const giorni = [];
  const usi = {};
  const sessioni = {};
  let punteggio = 0;
  for (let g = 0; g < 7; g++) {
    const bloccati = (pianoEsistente && pianoEsistente.giorni && pianoEsistente.giorni[g] && pianoEsistente.giorni[g].pasti) || {};
    const scelto = miglioreGiorno(ctx, g, bloccati, { usi, sessioni }, rnd, combinazioni, false);
    registraGiorno(ctx, scelto.pasti, g, usi, sessioni);
    giorni.push({ pasti: scelto.pasti });
    punteggio += scelto.punteggio;
  }
  return { giorni, punteggio };
}

// Punteggio completo di un giorno già composto (per confronti).
function valutaPunteggioGiorno(ctx, g, pasti, stato) {
  const ob = obiettivoGiorno(ctx.imp, g);
  const { tot } = totaliGiorno(pasti, ctx);
  const kcalPasti = ctx.imp.pasti.filter((p) => pasti[p.id] && !pasti[p.id].mensa)
    .map((p) => ({ kcal: (ctx.valori[pasti[p.id].ricetta]?.kcal || 0) * pasti[p.id].fattore, quota: p.quota }));
  return punteggioGiorno(tot, ob, ctx.imp, kcalPasti) + extraScelte(ctx, g, pasti, stato);
}

// Bonus/penalità che non dipendono dalle porzioni: avanzi batch,
// ripetizioni, ricette adatte al giorno di ricarica.
function extraScelte(ctx, g, pasti, stato) {
  const ob = obiettivoGiorno(ctx.imp, g);
  let s = 0;
  for (const p of Object.values(pasti)) {
    if (!p || p.mensa || !p.ricetta || p.bloccato) continue;
    const r = ctx.ricette[p.ricetta];
    const usi = stato.usi[p.ricetta] || 0;
    const avanzo = r.etichette.includes('batch') && sessioneAperta(r, stato.sessioni[p.ricetta], g);
    if (avanzo && ctx.imp.preferisciBatch) s -= 1.2;
    else s += 0.4 * usi;
    if (ob.ricarica && r.etichette.includes('ricarica')) s -= 0.3;
    s += 0.15 * (p.fattore - 1) ** 2;
  }
  return s;
}

// Trova la combinazione migliore per un giorno.
function miglioreGiorno(ctx, g, pastiEsistenti, stato, rnd, combinazioni, soloLiberi) {
  const imp = ctx.imp;
  const ob = obiettivoGiorno(imp, g);
  const maxRip = Math.max(1, Number(imp.maxRipetizioni) || 3);

  // Pasti fissi (mensa o bloccati) e pasti da riempire.
  const fissi = {};
  const liberi = [];
  for (const slot of imp.pasti) {
    if (eMensa(imp, g, slot.id)) fissi[slot.id] = { mensa: true };
    else {
      const e = pastiEsistenti[slot.id];
      if (e && e.bloccato && ctx.ricette[e.ricetta]) fissi[slot.id] = { ...e };
      else liberi.push(slot);
    }
  }

  let migliore = { pasti: { ...fissi }, punteggio: Infinity };
  if (!liberi.length) {
    migliore.punteggio = valutaPunteggioGiorno(ctx, g, fissi, stato);
    return migliore;
  }

  for (let c = 0; c < combinazioni; c++) {
    // 1) scelta casuale delle ricette per i pasti liberi
    const pasti = { ...fissi };
    const usateOggi = new Set(Object.values(fissi).filter((p) => p.ricetta).map((p) => p.ricetta));
    let valida = true;
    for (const slot of liberi) {
      const candidati = (ctx.perTipo[slot.tipo] || []).filter((r) => !usateOggi.has(r.id) && (stato.usi[r.id] || 0) < maxRip);
      if (!candidati.length) { valida = false; break; }
      // Metà delle volte, se esistono, si preferiscono gli avanzi batch.
      const avanzi = imp.preferisciBatch ? candidati.filter((r) => r.etichette.includes('batch') && sessioneAperta(r, stato.sessioni[r.id], g)) : [];
      const r = avanzi.length && rnd() < 0.6 ? scegli(avanzi, rnd) : scegli(candidati, rnd);
      usateOggi.add(r.id);
      pasti[slot.id] = { ricetta: r.id, fattore: 1, bloccato: false };
    }
    if (!valida) continue;

    // 2) ottimizzazione delle porzioni, un pasto alla volta (2 giri)
    const valuta = () => {
      const { tot } = totaliGiorno(pasti, ctx);
      const kcalPasti = imp.pasti.filter((p) => pasti[p.id] && !pasti[p.id].mensa)
        .map((p) => ({ kcal: ctx.valori[pasti[p.id].ricetta].kcal * pasti[p.id].fattore, quota: p.quota }));
      return punteggioGiorno(tot, ob, imp, kcalPasti);
    };
    let attuale = valuta();
    for (let giro = 0; giro < 2; giro++) {
      for (const slot of liberi) {
        const p = pasti[slot.id];
        let fMigliore = p.fattore;
        for (const f of FATTORI) {
          p.fattore = f;
          const v = valuta() + 0.15 * (f - 1) ** 2;
          if (v < attuale + 0.15 * (fMigliore - 1) ** 2 - 1e-9) {
            attuale = v - 0.15 * (f - 1) ** 2;
            fMigliore = f;
          }
        }
        p.fattore = fMigliore;
      }
    }
    const totale = attuale + extraScelte(ctx, g, pasti, stato);
    if (totale < migliore.punteggio) migliore = { pasti: JSON.parse(JSON.stringify(pasti)), punteggio: totale };
  }

  // Ripiego: se nessuna combinazione è valida, si ignorano i limiti di ripetizione.
  if (migliore.punteggio === Infinity && !soloLiberi) {
    const statoLibero = { usi: {}, sessioni: stato.sessioni };
    return miglioreGiorno(ctx, g, pastiEsistenti, statoLibero, rnd, combinazioni, true);
  }
  return migliore;
}

// Rigenera un solo giorno (tenendo i pasti bloccati e il resto della settimana).
export function rigeneraGiorno(ctx, piano, giorno, seme = Math.floor(Math.random() * 1e9)) {
  const rnd = casuale(seme);
  const stato = statoSettimana(ctx, piano.giorni, giorno);
  return miglioreGiorno(ctx, giorno, piano.giorni[giorno].pasti, stato, rnd, 400, false).pasti;
}

// Porzione migliore per un singolo pasto, lasciando fermi gli altri
// (usata quando si sostituisce un pasto a mano).
export function fattoreMigliore(ctx, giorno, pasti, idPasto) {
  const ob = obiettivoGiorno(ctx.imp, giorno);
  const prova = JSON.parse(JSON.stringify(pasti));
  let migliore = 1;
  let punteggioMin = Infinity;
  for (const f of FATTORI) {
    prova[idPasto].fattore = f;
    const { tot } = totaliGiorno(prova, ctx);
    const s = punteggioGiorno(tot, ob, ctx.imp, []) + 0.15 * (f - 1) ** 2;
    if (s < punteggioMin) { punteggioMin = s; migliore = f; }
  }
  return migliore;
}

// Riepilogo del piano: totali e verifica per ogni giorno, più la media.
export function valutaPiano(piano, ctx) {
  const giorni = piano.giorni.map((g, i) => {
    const ob = obiettivoGiorno(ctx.imp, i);
    const { tot, fecolaG } = totaliGiorno(g.pasti, ctx);
    return { obiettivo: ob, totali: tot, fecolaG, ...verificaGiorno(tot, ob, ctx.imp.tolleranza) };
  });
  const settimana = { totali: vuoto(), obiettivo: { kcal: 0, prot: 0, grassi: 0, carbo: 0, ar: 0 } };
  for (const g of giorni) {
    aggiungi(settimana.totali, g.totali);
    for (const k of Object.keys(settimana.obiettivo)) settimana.obiettivo[k] += g.obiettivo[k];
  }
  settimana.giorniOk = giorni.filter((g) => g.entroTolleranza).length;
  return { giorni, settimana };
}

// Quante volte compare ogni ricetta nel piano.
export function conteggioRicette(piano) {
  const c = {};
  for (const g of piano.giorni) for (const p of Object.values(g.pasti)) if (p && p.ricetta) c[p.ricetta] = (c[p.ricetta] || 0) + 1;
  return c;
}
