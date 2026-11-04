// ==========================================================
// Vista "Ricette": elenco con filtri, scheda della ricetta,
// creazione e modifica dall'interfaccia.
// ==========================================================
import { elencoRicette, mappaIngredienti, elencoIngredienti, ePredefinitaRicetta, creaId } from '../catalogo.js';
import { valoriRicetta, percentualiMacro } from '../nutrizione.js';
import { problemiRicetta } from '../esclusioni.js';
import { esc, num, avviso } from './dom.js';

export const ETICHETTE = ['colazione', 'pranzo', 'cena', 'spuntino', 'batch', 'ricarica'];
const USI = [['cotto', 'cotto (caldo)'], ['raffreddato', 'cotto e raffreddato'], ['crudo', 'crudo']];

let filtroTesto = '';
let filtroEtichetta = '';
let aperta = null;     // id della ricetta mostrata
let bozza = null;      // ricetta in modifica

// Riquadro con i valori nutrizionali di una porzione.
export function riquadroValori(ricetta, mappa) {
  const v = valoriRicetta(ricetta, mappa);
  const p = v.porzione;
  const pc = percentualiMacro(p);
  return `<div class="griglia piccolo">
    <div><strong>${num(p.kcal)}</strong> kcal</div>
    <div>Proteine <strong>${num(p.prot, 1)} g</strong> (${num(pc.prot)}%)</div>
    <div>Grassi <strong>${num(p.grassi, 1)} g</strong> (${num(pc.grassi)}%)</div>
    <div>Carboidrati <strong>${num(p.carbo, 1)} g</strong> (${num(pc.carbo)}%)</div>
    <div>Fibre ${num(p.fibre, 1)} g</div>
    <div>Amido resistente <strong>${num(p.ar, 1)} g</strong></div>
    <div>Sodio ${num(p.sodio)} mg</div>
    <div>Potassio ${num(p.potassio)} mg</div>
  </div>${v.mancanti.length ? `<p class="messaggio-errore">Ingredienti mancanti in tabella: ${esc(v.mancanti.join(', '))}</p>` : ''}`;
}

export function mostra(ctx, el) {
  if (bozza) return mostraModulo(ctx, el);
  if (aperta) return mostraScheda(ctx, el);
  const mappa = mappaIngredienti(ctx.stato);
  const imp = ctx.stato.impostazioni;
  const f = filtroTesto.toLowerCase();
  const ricette = elencoRicette(ctx.stato)
    .filter((r) => (!filtroEtichetta || r.etichette.includes(filtroEtichetta)) && (!f || r.nome.toLowerCase().includes(f)))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'it'));

  el.innerHTML = `
    <h2>Ricettario</h2>
    <p class="tenue piccolo">Tutte le ricette si preparano solo con il microonde. Valori per porzione, calcolati dagli ingredienti.</p>
    <div class="riga-pulsanti">
      <input type="search" id="cerca-ric" placeholder="Cerca ricetta…" value="${esc(filtroTesto)}" style="flex:1">
      <button class="primario" data-azione="nuova">+ Nuova</button>
    </div>
    <div class="riga-pulsanti">
      <button class="mini ${!filtroEtichetta ? 'primario' : ''}" data-etichetta="">tutte</button>
      ${ETICHETTE.map((e) => `<button class="mini ${filtroEtichetta === e ? 'primario' : ''}" data-etichetta="${e}">${e}</button>`).join('')}
    </div>
    <p class="tenue piccolo">${ricette.length} ricette</p>
    ${ricette.map((r) => {
      const v = valoriRicetta(r, mappa).porzione;
      const problemi = problemiRicetta(r, mappa, imp);
      return `<div class="card" data-id="${esc(r.id)}" style="cursor:pointer">
        <strong>${esc(r.nome)}</strong>
        <div class="piccolo">${num(v.kcal)} kcal · P ${num(v.prot)} · G ${num(v.grassi)} · C ${num(v.carbo)} · AR ${num(v.ar, 1)} g · ${r.porzioni} porz. · ${r.tempo} min</div>
        <div>${r.etichette.map((e) => `<span class="chip ${e === 'batch' ? 'batch' : ''}">${esc(e)}</span>`).join('')}
        ${problemi.length ? `<span class="chip errore">esclusa: ${esc(problemi.map((p) => p.nome).join(', '))}</span>` : ''}
        ${!r.predefinita ? '<span class="chip">mia</span>' : ''}</div>
      </div>`;
    }).join('')}`;

  const cerca = el.querySelector('#cerca-ric');
  cerca.addEventListener('input', () => {
    filtroTesto = cerca.value;
    mostra(ctx, el);
    const c = el.querySelector('#cerca-ric');
    c.focus();
    c.setSelectionRange(c.value.length, c.value.length);
  });
  el.querySelectorAll('[data-etichetta]').forEach((b) => b.addEventListener('click', () => { filtroEtichetta = b.dataset.etichetta; mostra(ctx, el); }));
  el.querySelectorAll('.card[data-id]').forEach((c) => c.addEventListener('click', () => { aperta = c.dataset.id; mostra(ctx, el); window.scrollTo(0, 0); }));
  el.querySelector('[data-azione="nuova"]').addEventListener('click', () => {
    bozza = { id: '', nome: '', porzioni: 1, tempo: 10, etichette: ['pranzo'], contenitore: '', anticipo: '', passi: [], cottura: [], frigoGiorni: 0, riscaldamento: '', ingredienti: [] };
    mostra(ctx, el);
  });
}

// Apre direttamente una ricetta (usato dalle altre viste).
export function apri(id) {
  aperta = id;
  bozza = null;
}

function mostraScheda(ctx, el) {
  const r = elencoRicette(ctx.stato).find((x) => x.id === aperta);
  if (!r) { aperta = null; return mostra(ctx, el); }
  const mappa = mappaIngredienti(ctx.stato);
  const problemi = problemiRicetta(r, mappa, ctx.stato.impostazioni);
  const potenza = ctx.stato.impostazioni.potenzaMicroonde;
  el.innerHTML = `
    <div class="riga-pulsanti non-stampare"><button data-azione="indietro">← Ricette</button>
      <button data-azione="modifica">Modifica</button>
      <button data-azione="duplica">Duplica</button>
      ${!r.predefinita || ctx.stato.ricetteUtente[r.id] ? `<button data-azione="${r.predefinita ? 'ripristina' : 'elimina'}" class="pericolo">${r.predefinita ? 'Ripristina originale' : 'Elimina'}</button>` : '<button data-azione="elimina" class="pericolo">Nascondi</button>'}
    </div>
    <h2>${esc(r.nome)}</h2>
    <div>${r.etichette.map((e) => `<span class="chip ${e === 'batch' ? 'batch' : ''}">${esc(e)}</span>`).join('')}</div>
    <p class="piccolo">${r.porzioni} porzion${r.porzioni > 1 ? 'i' : 'e'} · ${r.tempo} min · in frigo: ${r.frigoGiorni ? `max ${r.frigoGiorni} giorn${r.frigoGiorni > 1 ? 'i' : 'o'}` : 'da consumare subito'}</p>
    ${problemi.length ? `<p class="messaggio-errore">Questa ricetta contiene ingredienti esclusi: ${esc(problemi.map((p) => `${p.nome} (${p.motivo})`).join('; '))}. Non verrà usata nel piano.</p>` : ''}
    <section class="card"><h3>Valori per porzione</h3>${riquadroValori(r, mappa)}</section>
    <section class="card"><h3>Ingredienti (totale ricetta)</h3>
      <table><tbody>${r.ingredienti.map((i) => `<tr><td>${esc(mappa[i.id]?.nome || i.id)}${i.uso !== 'cotto' ? ` <span class="tenue piccolo">(${esc(i.uso)})</span>` : ''}</td><td class="num">${num(i.g, i.g % 1 ? 1 : 0)} g</td></tr>`).join('')}</tbody></table>
    </section>
    <section class="card"><h3>Contenitore</h3><p>${esc(r.contenitore)}</p>
      ${r.anticipo ? `<h4>Da preparare prima</h4><p>${esc(r.anticipo)}</p>` : ''}
      <h3>Preparazione</h3>
      <ol>${r.passi.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      ${potenza && potenza !== 800 ? `<p class="tenue piccolo">I tempi sono per 800 W: con il tuo microonde da ${potenza} W moltiplica circa per ${num(800 / potenza, 2)}.</p>` : ''}
      <h4>Conservazione e riscaldamento</h4><p>${esc(r.riscaldamento)}</p>
    </section>`;

  el.querySelector('[data-azione="indietro"]').addEventListener('click', () => { aperta = null; mostra(ctx, el); });
  el.querySelector('[data-azione="modifica"]').addEventListener('click', () => { bozza = JSON.parse(JSON.stringify(r)); mostra(ctx, el); });
  el.querySelector('[data-azione="duplica"]').addEventListener('click', () => {
    bozza = { ...JSON.parse(JSON.stringify(r)), id: '', nome: r.nome + ' (copia)', predefinita: false };
    mostra(ctx, el);
  });
  el.querySelector('[data-azione="ripristina"]')?.addEventListener('click', () => {
    delete ctx.stato.ricetteUtente[r.id];
    ctx.salva();
    avviso('Ricetta originale ripristinata');
  });
  el.querySelector('[data-azione="elimina"]')?.addEventListener('click', () => {
    if (!confirm(`Eliminare "${r.nome}"?`)) return;
    delete ctx.stato.ricetteUtente[r.id];
    if (ePredefinitaRicetta(r.id)) ctx.stato.ricetteEliminate.push(r.id);
    aperta = null;
    ctx.salva();
  });
}

// Converte le righe "800 W 4 min cosa" in passaggi di cottura.
function leggiCottura(testo) {
  return testo.split('\n').map((riga) => {
    const m = riga.match(/(\d+)\s*W\D+?([\d.,]+)\s*min\s*(.*)/i);
    return m ? { w: Number(m[1]), min: Number(m[2].replace(',', '.')), cosa: m[3].trim() } : null;
  }).filter(Boolean);
}

function mostraModulo(ctx, el) {
  const ingredienti = elencoIngredienti(ctx.stato).slice().sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
  const mappa = Object.fromEntries(ingredienti.map((i) => [i.id, i]));
  const b = bozza;
  const opzioniIng = (scelto) => ingredienti.map((i) => `<option value="${esc(i.id)}" ${i.id === scelto ? 'selected' : ''}>${esc(i.nome)}</option>`).join('');
  const problemi = problemiRicetta(b, mappa, ctx.stato.impostazioni);

  el.innerHTML = `
    <h2>${b.id ? 'Modifica ricetta' : 'Nuova ricetta'}</h2>
    <form id="modulo-ric" class="card">
      <label>Nome</label><input name="nome" required value="${esc(b.nome)}">
      <div class="griglia">
        <div><label>Porzioni</label><input type="number" min="1" name="porzioni" value="${esc(b.porzioni)}"></div>
        <div><label>Tempo (min)</label><input type="number" min="0" name="tempo" value="${esc(b.tempo)}"></div>
        <div><label>Giorni max in frigo</label><input type="number" min="0" name="frigoGiorni" value="${esc(b.frigoGiorni)}"></div>
      </div>
      <h4>Etichette</h4>
      <div class="griglia">${ETICHETTE.map((e) => `<div class="campo-check"><input type="checkbox" id="et-${e}" name="et_${e}" ${b.etichette.includes(e) ? 'checked' : ''}><label for="et-${e}" style="margin:0">${e}</label></div>`).join('')}</div>
      <h4>Ingredienti (grammi per tutta la ricetta)</h4>
      ${b.ingredienti.map((riga, i) => `
        <div class="card" style="padding:8px">
          <select data-riga="${i}" data-prop="id">${opzioniIng(riga.id)}</select>
          <div class="griglia" style="align-items:end">
            <div><label>Grammi</label><input type="number" step="any" min="0" data-riga="${i}" data-prop="g" value="${esc(riga.g)}"></div>
            <div><label>Stato</label><select data-riga="${i}" data-prop="uso">${USI.map(([k, t]) => `<option value="${k}" ${k === riga.uso ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
            <div><button type="button" class="mini pericolo" data-rimuovi="${i}">Rimuovi</button></div>
          </div>
        </div>`).join('')}
      <button type="button" data-azione="aggiungi-riga">+ Ingrediente</button>
      ${problemi.length ? `<p class="messaggio-errore">Ingredienti esclusi dalle impostazioni: ${esc(problemi.map((p) => p.nome).join(', '))}</p>` : ''}
      <div class="card"><h4>Valori per porzione (anteprima)</h4>${riquadroValori(b, mappa)}</div>
      <label>Contenitore adatto</label><input name="contenitore" value="${esc(b.contenitore)}">
      <label>Da preparare prima (facoltativo)</label><textarea name="anticipo" style="min-height:60px">${esc(b.anticipo)}</textarea>
      <label>Passaggi (uno per riga, con potenza, tempi, quando mescolare e riposo)</label>
      <textarea name="passi">${esc(b.passi.join('\n'))}</textarea>
      <label>Tempi al microonde (uno per riga, es. "800 W 4 min verdure")</label>
      <textarea name="cottura" style="min-height:70px">${esc(b.cottura.map((c) => `${c.w} W ${c.min} min ${c.cosa}`).join('\n'))}</textarea>
      <label>Conservazione e riscaldamento</label><textarea name="riscaldamento" style="min-height:60px">${esc(b.riscaldamento)}</textarea>
      <div class="riga-pulsanti">
        <button class="primario" type="submit">Salva</button>
        <button type="button" data-azione="annulla">Annulla</button>
      </div>
    </form>`;

  const form = el.querySelector('#modulo-ric');
  // Copia i campi del modulo nella bozza (senza ridisegnare).
  const leggiModulo = () => {
    const d = new FormData(form);
    b.nome = String(d.get('nome')).trim();
    b.porzioni = Math.max(1, Number(d.get('porzioni')) || 1);
    b.tempo = Number(d.get('tempo')) || 0;
    b.frigoGiorni = Number(d.get('frigoGiorni')) || 0;
    b.etichette = ETICHETTE.filter((e) => d.get('et_' + e));
    b.contenitore = String(d.get('contenitore'));
    b.anticipo = String(d.get('anticipo'));
    b.passi = String(d.get('passi')).split('\n').map((s) => s.trim()).filter(Boolean);
    b.cottura = leggiCottura(String(d.get('cottura')));
    b.riscaldamento = String(d.get('riscaldamento'));
  };
  form.querySelectorAll('[data-riga]').forEach((inp) => inp.addEventListener('change', () => {
    leggiModulo();
    const riga = b.ingredienti[Number(inp.dataset.riga)];
    riga[inp.dataset.prop] = inp.dataset.prop === 'g' ? Number(inp.value) || 0 : inp.value;
    mostraModulo(ctx, el);
  }));
  form.querySelectorAll('[data-rimuovi]').forEach((btn) => btn.addEventListener('click', () => {
    leggiModulo();
    b.ingredienti.splice(Number(btn.dataset.rimuovi), 1);
    mostraModulo(ctx, el);
  }));
  form.querySelector('[data-azione="aggiungi-riga"]').addEventListener('click', () => {
    leggiModulo();
    b.ingredienti.push({ id: ingredienti[0].id, g: 100, uso: 'cotto' });
    mostraModulo(ctx, el);
  });
  form.querySelector('[data-azione="annulla"]').addEventListener('click', () => { bozza = null; mostra(ctx, el); });
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    leggiModulo();
    if (!b.ingredienti.length) { alert('Aggiungi almeno un ingrediente.'); return; }
    if (!b.id) b.id = creaId(b.nome, new Set(elencoRicette(ctx.stato).map((r) => r.id)));
    if (!b.riscaldamento) b.riscaldamento = 'Riscalda coperto a 800 W per 2-3 min, mescola a metà, finché è fumante al centro; riposo 1 min.';
    const { predefinita, ...daSalvare } = b;
    ctx.stato.ricetteUtente[b.id] = daSalvare;
    aperta = b.id;
    bozza = null;
    ctx.salva();
    avviso('Ricetta salvata');
  });
}
