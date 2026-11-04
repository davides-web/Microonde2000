// ==========================================================
// Vista "Ingredienti": tabella con ricerca, modifica e aggiunta.
// I valori sono per 100 g. Le modifiche restano nel telefono.
// ==========================================================
import { REPARTI } from '../dati/ingredienti.js';
import { elencoIngredienti, ePredefinitoIngrediente, creaId } from '../catalogo.js';
import { esc, num, avviso } from './dom.js';

let filtro = '';
let inModifica = null; // id dell'ingrediente aperto (o '__nuovo__')

// Campi numerici modificabili: [proprietà, etichetta]
const CAMPI_NUM = [
  ['kcal', 'kcal'], ['prot', 'Proteine (g)'], ['grassi', 'Grassi (g)'], ['carbo', 'Carboidrati disp. (g)'],
  ['fibre', 'Fibre (g)'], ['sodio', 'Sodio (mg)'], ['potassio', 'Potassio (mg)'],
  ['arCrudo', 'AR crudo (g)'], ['arCotto', 'AR cotto caldo (g)'], ['arRaff', 'AR cotto e raffreddato (g)'],
  ['conf', 'Confezione (g, 0 = a peso)'], ['pezzo', 'Peso di un pezzo (g, facoltativo)']
];
const CATEGORIE = [
  ['pane', 'Pane'], ['albume', 'Albume'], ['avocado', 'Avocado'], ['ultraprocessato', 'Ultraprocessato'],
  ['farina_raffinata', 'Farina raffinata'], ['olio_vegetale', 'Olio vegetale'], ['olio_evo', 'Olio EVO'], ['sale', 'Sale non iposodico']
];

export function mostra(ctx, el) {
  const elenco = elencoIngredienti(ctx.stato);
  if (inModifica) return mostraModulo(ctx, el, elenco);

  const f = filtro.toLowerCase();
  const visibili = elenco.filter((i) => !f || i.nome.toLowerCase().includes(f) || i.reparto.toLowerCase().includes(f));

  el.innerHTML = `
    <h2>Ingredienti</h2>
    <p class="tenue piccolo">Valori per 100 g (carboidrati disponibili, senza fibre). AR = amido resistente stimato.
      I valori provengono da tabelle pubbliche ma <strong>vanno verificati</strong>. Tocca un ingrediente per modificarlo.</p>
    <div class="riga-pulsanti">
      <input type="search" id="cerca-ing" placeholder="Cerca ingrediente o reparto…" value="${esc(filtro)}" style="flex:1">
      <button class="primario" data-azione="nuovo">+ Nuovo</button>
    </div>
    <p class="tenue piccolo">${visibili.length} ingredienti</p>
    <div class="scorri"><table>
      <thead><tr><th>Nome</th><th class="num">kcal</th><th class="num">P</th><th class="num">G</th><th class="num">C</th><th class="num">Fib</th><th class="num">AR crudo/cotto/fredd.</th></tr></thead>
      <tbody>
      ${visibili.map((i) => `<tr data-id="${esc(i.id)}" style="cursor:pointer">
        <td>${esc(i.nome)}${i.categorie && i.categorie.length ? ` <span class="chip errore">${esc(i.categorie.join(', '))}</span>` : ''}
          <div class="tenue piccolo">${esc(i.reparto)}</div></td>
        <td class="num">${num(i.kcal)}</td><td class="num">${num(i.prot, 1)}</td><td class="num">${num(i.grassi, 1)}</td>
        <td class="num">${num(i.carbo, 1)}</td><td class="num">${num(i.fibre, 1)}</td>
        <td class="num">${num(i.arCrudo, 1)} / ${num(i.arCotto, 1)} / ${num(i.arRaff, 1)}</td></tr>`).join('')}
      </tbody></table></div>`;

  const cerca = el.querySelector('#cerca-ing');
  cerca.addEventListener('input', () => {
    filtro = cerca.value;
    const pos = cerca.selectionStart;
    mostra(ctx, el);
    const nuovo = el.querySelector('#cerca-ing');
    nuovo.focus();
    nuovo.setSelectionRange(pos, pos);
  });
  el.querySelector('[data-azione="nuovo"]').addEventListener('click', () => { inModifica = '__nuovo__'; mostra(ctx, el); });
  el.querySelectorAll('tr[data-id]').forEach((tr) => tr.addEventListener('click', () => { inModifica = tr.dataset.id; mostra(ctx, el); window.scrollTo(0, 0); }));
}

function mostraModulo(ctx, el, elenco) {
  const nuovo = inModifica === '__nuovo__';
  const ing = nuovo
    ? { id: '', nome: '', nomeEn: '', reparto: REPARTI[0], kcal: 0, prot: 0, grassi: 0, carbo: 0, fibre: 0, sodio: 0, potassio: 0, arCrudo: 0, arCotto: 0, arRaff: 0, conf: 0, pezzo: 0, fonte: 'Inserito dall\'utente', nota: '', confNome: '', categorie: [] }
    : elenco.find((i) => i.id === inModifica);
  if (!ing) { inModifica = null; return mostra(ctx, el); }
  const predefinito = !nuovo && ePredefinitoIngrediente(ing.id);
  const modificato = predefinito && ctx.stato.ingredientiUtente[ing.id];

  el.innerHTML = `
    <h2>${nuovo ? 'Nuovo ingrediente' : 'Modifica ingrediente'}</h2>
    <form class="card" id="modulo-ing">
      <label>Nome</label><input name="nome" required value="${esc(ing.nome)}">
      <label>Nome inglese (per la ricerca su Cronometer)</label><input name="nomeEn" value="${esc(ing.nomeEn)}">
      <label>Reparto</label>
      <select name="reparto">${REPARTI.map((r) => `<option ${r === ing.reparto ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>
      <div class="griglia">
        ${CAMPI_NUM.map(([k, et]) => `<div><label>${esc(et)}</label><input type="number" step="any" inputmode="decimal" name="${k}" value="${esc(ing[k] ?? 0)}"></div>`).join('')}
      </div>
      <label>Nome confezione (facoltativo, es. "confezione da 6")</label><input name="confNome" value="${esc(ing.confNome)}">
      <label>Nota per la spesa</label><input name="nota" value="${esc(ing.nota)}">
      <label>Fonte dei valori</label><input name="fonte" value="${esc(ing.fonte)}">
      <h4>Categorie (per le esclusioni)</h4>
      ${CATEGORIE.map(([k, et]) => `<div class="campo-check"><input type="checkbox" name="cat_${k}" id="cat_${k}" ${ing.categorie.includes(k) ? 'checked' : ''}><label for="cat_${k}" style="margin:0">${esc(et)}</label></div>`).join('')}
      <div class="riga-pulsanti">
        <button class="primario" type="submit">Salva</button>
        <button type="button" data-azione="annulla">Annulla</button>
        ${modificato ? '<button type="button" data-azione="ripristina">Ripristina valori originali</button>' : ''}
        ${!nuovo ? '<button type="button" class="pericolo" data-azione="elimina">Elimina</button>' : ''}
      </div>
    </form>`;

  const form = el.querySelector('#modulo-ing');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const d = new FormData(form);
    const dati = {
      nome: String(d.get('nome')).trim(),
      nomeEn: String(d.get('nomeEn')).trim(),
      reparto: d.get('reparto'),
      confNome: String(d.get('confNome')).trim(),
      nota: String(d.get('nota')).trim(),
      fonte: String(d.get('fonte')).trim(),
      categorie: CATEGORIE.map(([k]) => k).filter((k) => d.get('cat_' + k))
    };
    for (const [k] of CAMPI_NUM) dati[k] = Number(String(d.get(k)).replace(',', '.')) || 0;
    const id = nuovo ? creaId(dati.nome, new Set(elenco.map((i) => i.id))) : ing.id;
    ctx.stato.ingredientiUtente[id] = { ...(ctx.stato.ingredientiUtente[id] || {}), ...dati, id };
    inModifica = null;
    ctx.salva();
    avviso('Ingrediente salvato');
  });
  el.querySelector('[data-azione="annulla"]').addEventListener('click', () => { inModifica = null; mostra(ctx, el); });
  el.querySelector('[data-azione="ripristina"]')?.addEventListener('click', () => {
    delete ctx.stato.ingredientiUtente[ing.id];
    inModifica = null;
    ctx.salva();
    avviso('Valori originali ripristinati');
  });
  el.querySelector('[data-azione="elimina"]')?.addEventListener('click', () => {
    if (!confirm(`Eliminare "${ing.nome}"? Le ricette che lo usano lo segnaleranno come mancante.`)) return;
    delete ctx.stato.ingredientiUtente[ing.id];
    if (predefinito) ctx.stato.ingredientiEliminati.push(ing.id);
    inModifica = null;
    ctx.salva();
  });
}
