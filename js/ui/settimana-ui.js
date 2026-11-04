// ==========================================================
// Selettore della settimana condiviso da Piano, Spesa, Meal prep
// e Cronometer.
// ==========================================================
import { lunediDi, spostaSettimana, etichettaSettimana } from '../settimana.js';
import { esc } from './dom.js';

// Settimana scelta (resta finché l'app è aperta).
// Di sabato e domenica si propone già la settimana successiva.
let scelta = new Date().getDay() % 6 === 0 ? spostaSettimana(lunediDi(), 1) : lunediDi();

export function settimanaScelta() {
  return scelta;
}

export function htmlSelettore(ctx) {
  const haPiano = !!ctx.stato.piani[scelta];
  return `<div class="riga-pulsanti non-stampare" style="align-items:center">
    <button data-sett="-1" aria-label="Settimana precedente">‹</button>
    <strong style="flex:1;text-align:center">Settimana ${esc(etichettaSettimana(scelta))}${haPiano ? '' : ' <span class="tenue piccolo">(nessun piano)</span>'}</strong>
    <button data-sett="1" aria-label="Settimana successiva">›</button>
  </div>`;
}

export function collegaSelettore(el, ridisegna) {
  el.querySelectorAll('[data-sett]').forEach((b) => b.addEventListener('click', () => {
    scelta = spostaSettimana(scelta, Number(b.dataset.sett));
    ridisegna();
  }));
}
