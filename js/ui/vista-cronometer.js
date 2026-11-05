// ==========================================================
// Vista "Per Cronometer": per ogni giorno l'elenco degli
// ingredienti in grammi, copiabile con un tocco.
// ==========================================================
import { GIORNI } from '../impostazioni.js';
import { contestoPiano } from '../catalogo.js';
import { giornoCronometer, testoCronometer, grammiLeggibili } from '../cronometer.js';
import { dataBreve } from '../settimana.js';
import { esc, num, copiaTesto } from './dom.js';
import { htmlSelettore, collegaSelettore, settimanaScelta } from './settimana-ui.js';

export function mostra(ctx, el) {
  const lunedi = settimanaScelta();
  const piano = ctx.stato.piani[lunedi];
  if (!piano) {
    el.innerHTML = `<h2>Per Cronometer</h2>${htmlSelettore(ctx)}
      <div class="card"><p>Nessun piano per questa settimana.</p><a href="#piano">Vai al piano per generarlo →</a></div>`;
    collegaSelettore(el, () => mostra(ctx, el));
    return;
  }
  const contesto = contestoPiano(ctx.stato);
  el.innerHTML = `
    <h2>Per Cronometer</h2>
    ${htmlSelettore(ctx)}
    <p class="tenue piccolo">Ingredienti da registrare, a peso crudo (legumi in barattolo: peso sgocciolato). Sotto ogni nome (e tra parentesi quadre nel testo copiato) c'è il nome inglese da cercare su Cronometer. Le dosi tengono conto delle porzioni del piano.</p>
    ${piano.giorni.map((_, i) => `
      <section class="card">
        <div class="riga-pulsanti" style="justify-content:space-between;align-items:center;margin:0">
          <h3 style="margin:0">${GIORNI[i]} ${dataBreve(lunedi, i)}</h3>
          <button class="primario mini" data-copia="${i}">Copia</button>
        </div>
        ${giornoCronometer(piano, contesto, i).map((gr) => `
          <h4>${esc(gr.pasto)}${gr.ricetta ? ` <span class="tenue piccolo">— ${esc(gr.ricetta)}</span>` : ''}</h4>
          ${gr.mensa
            ? `<p class="piccolo">Mensa: registra a parte (stima ${num(ctx.stato.impostazioni.mensa.kcal)} kcal).</p>`
            : `<table><tbody>${gr.articoli.map((a) => `<tr><td>${esc(a.nome)}${a.nomeEn ? `<div class="tenue piccolo">${esc(a.nomeEn)}</div>` : ''}</td><td class="num">${grammiLeggibili(a.g)} g</td></tr>`).join('')}</tbody></table>`}
        `).join('')}
      </section>`).join('')}`;

  collegaSelettore(el, () => mostra(ctx, el));
  el.onclick = (ev) => {
    const b = ev.target.closest('[data-copia]');
    if (!b) return;
    const i = Number(b.dataset.copia);
    copiaTesto(testoCronometer(piano, contesto, i, dataBreve(lunedi, i)));
  };
}
