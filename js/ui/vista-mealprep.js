// ==========================================================
// Vista "Meal prep": cosa preparare e quando, con tempi al
// microonde, conservazione in frigo e riscaldamento sicuro.
// ==========================================================
import { contestoPiano } from '../catalogo.js';
import { pianoMealPrep, REGOLE_SICUREZZA, nomeGiorno } from '../mealprep.js';
import { esc, num } from './dom.js';
import { htmlSelettore, collegaSelettore, settimanaScelta } from './settimana-ui.js';
import * as vistaRicette from './vista-ricette.js';

const TITOLI = {
  batch: 'Cottura per più pasti (batch)',
  anticipo: 'Da preparare per domani',
  momento: 'Al momento del pasto'
};

function tempi(cottura) {
  return cottura.map((c) => `${c.w} W × ${num(c.min, c.min % 1 ? 1 : 0)} min${c.cosa ? ` (${esc(c.cosa)})` : ''}`).join(' → ');
}

export function mostra(ctx, el) {
  const lunedi = settimanaScelta();
  const piano = ctx.stato.piani[lunedi];
  if (!piano) {
    el.innerHTML = `<h2>Meal prep</h2>${htmlSelettore(ctx)}
      <div class="card"><p>Nessun piano per questa settimana.</p><a href="#piano">Vai al piano per generarlo →</a></div>`;
    collegaSelettore(el, () => mostra(ctx, el));
    return;
  }
  const contesto = contestoPiano(ctx.stato);
  const giorni = pianoMealPrep(piano, contesto);

  el.innerHTML = `
    <h2>Meal prep</h2>
    ${htmlSelettore(ctx)}
    <details class="card"><summary><strong>Regole di conservazione e riscaldamento sicuro</strong></summary>
      <ul>${REGOLE_SICUREZZA.map((r) => `<li class="piccolo">${esc(r)}</li>`).join('')}</ul></details>
    ${giorni.map((g) => `
      <section class="card"><h3>${esc(g.nome)}</h3>
      ${g.attivita.map((a) => {
        const r = a.ricetta;
        const quando = a.usi.map((u) => `${nomeGiorno(u.giorno)} ${u.pasto.toLowerCase()} (${num(u.fattore, 2)} porz.)`).join(', ');
        const scala = Math.abs(a.scala - 1) > 0.01 ? ` · quantità ×${num(a.scala, 2)} rispetto alla ricetta` : '';
        return `<div class="pasto">
          <div class="nome-slot">${esc(TITOLI[a.tipo])}</div>
          <div><a href="#ricette" class="ricetta" data-ricetta="${esc(r.id)}">${esc(r.nome)}</a></div>
          <div class="piccolo">${num(a.porzioni, 2)} porzioni${scala}</div>
          ${a.tipo === 'anticipo'
            ? `<p class="piccolo">${esc(a.anticipo)}${Math.abs(a.scala - 1) > 0.01 ? ` <em>(moltiplica le quantità per ${num(a.scala, 2)})</em>` : ''}</p>
               <p class="tenue piccolo">Serve per: ${esc(quando)}</p>`
            : `${a.tipo === 'batch' && a.anticipata ? `<p class="piccolo"><strong>Cucina la sera e metti in frigo</strong>: i cibi amidacei raffreddati almeno 12 ore sviluppano amido resistente.${a.anticipo ? ' ' + esc(a.anticipo) : ''}</p>` : ''}
               <p class="piccolo">Microonde: ${tempi(a.cottura)} <span class="tenue">(circa ${num(a.minuti)} min a quantità standard${a.scala > 1.2 ? '; con più cibo allunga i tempi di circa un terzo e mescola più spesso' : ''})</span></p>
               ${a.tipo === 'batch' ? `<p class="piccolo">Da mangiare: ${esc(quando)}.</p>
                 <p class="piccolo">Conservazione: in frigo al massimo ${a.frigoGiorni} giorn${a.frigoGiorni === 1 ? 'o' : 'i'} dalla cottura, in contenitori singoli.
                 ${a.superaFrigo ? '<strong style="color:var(--errore)">L\'ultima porzione supera i giorni di frigo: congelala subito dopo la cottura.</strong>' : ''}</p>
                 <p class="piccolo">Riscaldamento: ${esc(a.riscaldamento)}</p>` : `<p class="tenue piccolo">Per: ${esc(quando)}</p>`}`}
        </div>`;
      }).join('')}
      </section>`).join('')}`;

  collegaSelettore(el, () => mostra(ctx, el));
  el.onclick = (ev) => {
    const a = ev.target.closest('a[data-ricetta]');
    if (!a) return;
    vistaRicette.apri(a.dataset.ricetta);
  };
}
