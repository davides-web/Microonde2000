// ==========================================================
// Vista "Spesa": lista aggregata per reparto, con spunte,
// copia del testo (per la spesa online) e stampa.
// ==========================================================
import { contestoPiano } from '../catalogo.js';
import { listaSpesa, testoSpesa } from '../spesa.js';
import { esc, num, copiaTesto, avviso } from './dom.js';
import { htmlSelettore, collegaSelettore, settimanaScelta } from './settimana-ui.js';

let soloDaComprare = false;

export function mostra(ctx, el) {
  const lunedi = settimanaScelta();
  const piano = ctx.stato.piani[lunedi];
  if (!piano) {
    el.innerHTML = `<h2>Lista della spesa</h2>${htmlSelettore(ctx)}
      <div class="card"><p>Nessun piano per questa settimana.</p><a href="#piano">Vai al piano per generarlo →</a></div>`;
    collegaSelettore(el, () => mostra(ctx, el));
    return;
  }
  const contesto = contestoPiano(ctx.stato);
  const lista = listaSpesa(piano, contesto);
  const spunte = (ctx.stato.spunte[lunedi] ||= {});
  const totale = lista.reduce((t, g) => t + g.articoli.length, 0);
  const fatti = lista.reduce((t, g) => t + g.articoli.filter((a) => spunte[a.id]).length, 0);

  el.innerHTML = `
    <h2>Lista della spesa</h2>
    ${htmlSelettore(ctx)}
    <p class="tenue piccolo">Quantità per tutta la settimana, arrotondate alle confezioni tipiche (modificabili nella scheda Ingredienti). Il pranzo in mensa è escluso.</p>
    <div class="riga-pulsanti non-stampare">
      <button class="primario" data-azione="copia">Copia testo</button>
      <button data-azione="stampa">Stampa</button>
      <button data-azione="filtro">${soloDaComprare ? 'Mostra tutto' : 'Nascondi spuntati'}</button>
      <button data-azione="azzera">Togli le spunte</button>
    </div>
    <p class="piccolo">${fatti}/${totale} articoli presi</p>
    ${lista.map((g) => {
      const articoli = g.articoli.filter((a) => !soloDaComprare || !spunte[a.id]);
      if (!articoli.length) return '';
      return `<section class="card"><h3>${esc(g.reparto)}</h3>
        ${articoli.map((a) => `<label class="articolo ${spunte[a.id] ? 'fatto' : ''}">
          <input type="checkbox" data-id="${esc(a.id)}" ${spunte[a.id] ? 'checked' : ''}>
          <span class="testo"><strong>${esc(a.nome)}</strong>: ${esc(a.testo)}
            <span class="tenue piccolo">(servono ${num(a.grammi)} g)</span>
            ${a.nota ? `<br><span class="piccolo" style="color:var(--attenzione)">${esc(a.nota)}</span>` : ''}</span>
        </label>`).join('')}
      </section>`;
    }).join('')}`;

  collegaSelettore(el, () => mostra(ctx, el));
  el.querySelectorAll('input[data-id]').forEach((c) => c.addEventListener('change', () => {
    if (c.checked) spunte[c.dataset.id] = true;
    else delete spunte[c.dataset.id];
    ctx.salva();
  }));
  el.onclick = (ev) => {
    const b = ev.target.closest('button[data-azione]');
    if (!b) return;
    const azione = b.dataset.azione;
    if (azione === 'copia') copiaTesto(`Spesa settimana dal ${lunedi}\n\n` + testoSpesa(lista, spunte, true));
    else if (azione === 'stampa') window.print();
    else if (azione === 'filtro') { soloDaComprare = !soloDaComprare; mostra(ctx, el); }
    else if (azione === 'azzera') { ctx.stato.spunte[lunedi] = {}; ctx.salva(); avviso('Spunte azzerate'); }
  };
}
