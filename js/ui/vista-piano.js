// ==========================================================
// Vista "Piano": genera il piano della settimana, mostra i
// totali con barre colorate, permette di bloccare un pasto,
// rigenerare gli altri, sostituire a mano e cambiare porzioni.
// ==========================================================
import { GIORNI, eMensa } from '../impostazioni.js';
import { contestoPiano } from '../catalogo.js';
import { generaSettimana, valutaPiano, fattoreMigliore, rigeneraGiorno, FATTORI } from '../generatore.js';
import { dataBreve } from '../settimana.js';
import { esc, num, barra, avviso } from './dom.js';
import { htmlSelettore, collegaSelettore, settimanaScelta } from './settimana-ui.js';
import * as vistaRicette from './vista-ricette.js';

// Barre di un giorno (o della media settimanale).
function barreValori(tot, ob, verifica, tol) {
  const cls = (ok) => (ok ? 'ok' : 'fuori');
  return `
    ${barra('Calorie', tot.kcal, ob.kcal, 'kcal', tol, verifica ? cls(verifica.ok.kcal) : null)}
    ${barra('Proteine', tot.prot, ob.prot, 'g', tol, verifica ? cls(verifica.ok.prot) : null, verifica ? `${num(verifica.pc.prot)}% (obiettivo ${ob.pct.prot}%)` : '')}
    ${barra('Grassi', tot.grassi, ob.grassi, 'g', tol, verifica ? cls(verifica.ok.grassi) : null, verifica ? `${num(verifica.pc.grassi)}% (obiettivo ${ob.pct.grassi}%)` : '')}
    ${barra('Carboidrati', tot.carbo, ob.carbo, 'g', tol, verifica ? cls(verifica.ok.carbo) : null, verifica ? `${num(verifica.pc.carbo)}% (obiettivo ${ob.pct.carbo}%)` : '')}
    ${barra('Amido resistente', tot.ar, ob.ar, 'g', tol, tot.ar >= ob.ar - 0.05 ? 'ok' : tot.ar >= ob.ar * 0.8 ? 'vicino' : 'fuori')}`;
}

export function mostra(ctx, el) {
  const lunedi = settimanaScelta();
  const imp = ctx.stato.impostazioni;
  const piano = ctx.stato.piani[lunedi];
  const contesto = contestoPiano(ctx.stato);

  let corpo;
  if (!piano) {
    corpo = `<div class="card"><p>Non c'è ancora un piano per questa settimana.</p>
      <div class="riga-pulsanti"><button class="primario" data-azione="genera">Genera il piano</button></div>
      <p class="tenue piccolo">Il piano rispetta obiettivi (±${imp.tolleranza}%), esclusioni, varietà (max ${imp.maxRipetizioni} volte la stessa ricetta) e preferisce il batch cooking.</p></div>`;
  } else {
    const val = valutaPiano(piano, contesto);
    const sett = val.settimana;
    const media = (v) => Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x / 7]));
    const obMedio = { ...media(sett.obiettivo), pct: imp.macro };
    corpo = `
      <div class="riga-pulsanti non-stampare">
        <button class="primario" data-azione="genera">Rigenera (tiene i pasti bloccati)</button>
        <button data-azione="sblocca">Sblocca tutto</button>
        <button class="pericolo" data-azione="elimina">Elimina piano</button>
      </div>
      <section class="card">
        <h3>Media giornaliera della settimana</h3>
        <p class="piccolo">${sett.giorniOk}/7 giorni entro la tolleranza (±${imp.tolleranza}% kcal, ±${imp.tolleranza} punti sui macro).
          Totale settimana: ${num(sett.totali.kcal)} kcal su ${num(sett.obiettivo.kcal)}.</p>
        ${barreValori(media(sett.totali), obMedio, null, imp.tolleranza)}
      </section>
      ${val.giorni.map((g, i) => cardGiorno(ctx, contesto, piano, i, g, lunedi)).join('')}`;
  }

  el.innerHTML = `<h2>Piano settimanale</h2>${htmlSelettore(ctx)}${corpo}`;
  collegaSelettore(el, () => mostra(ctx, el));

  el.onclick = (ev) => {
    const b = ev.target.closest('[data-azione]');
    if (!b) return;
    const azione = b.dataset.azione;
    const g = Number(b.dataset.giorno);
    const slot = b.dataset.slot;
    if (azione === 'genera') {
      b.disabled = true;
      b.textContent = 'Sto calcolando…';
      // Lascia al browser il tempo di aggiornare il pulsante.
      setTimeout(() => {
        ctx.stato.piani[lunedi] = generaSettimana(contesto, { pianoEsistente: piano });
        ctx.salva();
        avviso('Piano generato');
      }, 30);
    } else if (azione === 'sblocca') {
      for (const giorno of piano.giorni) for (const p of Object.values(giorno.pasti)) if (p) p.bloccato = false;
      ctx.salva();
    } else if (azione === 'elimina') {
      if (confirm('Eliminare il piano di questa settimana?')) {
        delete ctx.stato.piani[lunedi];
        ctx.salva();
      }
    } else if (azione === 'blocca') {
      const p = piano.giorni[g].pasti[slot];
      p.bloccato = !p.bloccato;
      ctx.salva();
    } else if (azione === 'porzione') {
      const p = piano.giorni[g].pasti[slot];
      const i = FATTORI.indexOf(p.fattore);
      const nuovo = FATTORI[Math.min(FATTORI.length - 1, Math.max(0, (i < 0 ? 2 : i) + Number(b.dataset.passo)))];
      p.fattore = nuovo;
      p.bloccato = true;
      ctx.salva();
    } else if (azione === 'apri') {
      vistaRicette.apri(b.dataset.ricetta);
      ctx.vai('ricette');
    } else if (azione === 'rigenera-giorno') {
      piano.giorni[g].pasti = rigeneraGiorno(contesto, piano, g);
      ctx.salva();
      avviso(`${GIORNI[g]} rigenerato`);
    }
  };

  // Sostituzione manuale di un pasto.
  el.querySelectorAll('select[data-sostituisci]').forEach((sel) => sel.addEventListener('change', () => {
    if (!sel.value) return;
    const g = Number(sel.dataset.giorno);
    const slot = sel.dataset.slot;
    const pasti = piano.giorni[g].pasti;
    pasti[slot] = { ricetta: sel.value, fattore: 1, bloccato: true };
    pasti[slot].fattore = fattoreMigliore(contesto, g, pasti, slot);
    ctx.salva();
    avviso('Pasto sostituito e bloccato');
  }));
}

function cardGiorno(ctx, contesto, piano, i, val, lunedi) {
  const imp = ctx.stato.impostazioni;
  const giorno = piano.giorni[i];
  const righe = imp.pasti.map((slot) => {
    if (eMensa(imp, i, slot.id)) {
      return `<div class="pasto"><div class="nome-slot">${esc(slot.nome)}</div>
        <div class="ricetta">Mensa scolastica</div>
        <div class="tenue piccolo">Stima: ${num(imp.mensa.kcal)} kcal · P ${num(imp.mensa.prot)} · G ${num(imp.mensa.grassi)} · C ${num(imp.mensa.carbo)} (modificabile nelle impostazioni)</div></div>`;
    }
    const p = giorno.pasti[slot.id];
    const r = p && contesto.ricette[p.ricetta];
    const candidati = (contesto.perTipo[slot.tipo] || []).slice().sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
    const altre = [...contesto.ammesse].map((id) => contesto.ricette[id]).filter((x) => !x.etichette.includes(slot.tipo)).sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
    const selettore = `<select data-sostituisci data-giorno="${i}" data-slot="${esc(slot.id)}" class="mini" style="width:auto;max-width:100%">
      <option value="">Sostituisci con…</option>
      <optgroup label="Adatte (${esc(slot.tipo)})">${candidati.map((c) => `<option value="${esc(c.id)}">${esc(c.nome)}</option>`).join('')}</optgroup>
      <optgroup label="Altre ricette">${altre.map((c) => `<option value="${esc(c.id)}">${esc(c.nome)}</option>`).join('')}</optgroup>
    </select>`;
    if (!r) {
      return `<div class="pasto"><div class="nome-slot">${esc(slot.nome)}</div><div class="tenue">Nessuna ricetta${p ? ' (ricetta non più disponibile)' : ''}</div>
        <div class="azioni">${selettore}</div></div>`;
    }
    const v = contesto.valori[r.id];
    const escluso = !contesto.ammesse.has(r.id);
    return `<div class="pasto">
      <div class="titolo"><span class="nome-slot">${esc(slot.nome)}</span>
        <span class="piccolo">${num(v.kcal * p.fattore)} kcal · P ${num(v.prot * p.fattore)} · G ${num(v.grassi * p.fattore)} · C ${num(v.carbo * p.fattore)}</span></div>
      <div><a href="#ricette" class="ricetta" data-azione="apri" data-ricetta="${esc(r.id)}">${esc(r.nome)}</a>
        ${r.etichette.includes('batch') ? '<span class="chip batch">batch</span>' : ''}
        ${p.bloccato ? '<span class="chip">🔒 bloccato</span>' : ''}
        ${escluso ? '<span class="chip errore">contiene ingredienti esclusi</span>' : ''}</div>
      <div class="azioni non-stampare">
        <button class="mini" data-azione="porzione" data-passo="-1" data-giorno="${i}" data-slot="${esc(slot.id)}" aria-label="Meno">−</button>
        <span class="piccolo" style="align-self:center">${num(p.fattore, 2)} porz.</span>
        <button class="mini" data-azione="porzione" data-passo="1" data-giorno="${i}" data-slot="${esc(slot.id)}" aria-label="Più">+</button>
        <button class="mini" data-azione="blocca" data-giorno="${i}" data-slot="${esc(slot.id)}">${p.bloccato ? 'Sblocca' : 'Blocca'}</button>
        ${selettore}
      </div></div>`;
  }).join('');

  const fecola = val.fecolaG > 0
    ? `<div class="pasto"><div class="nome-slot">Integrazione amido resistente</div>
        <div><strong>${num(val.fecolaG)} g di fecola di patate cruda</strong> <span class="tenue piccolo">sciolta in acqua, kefir o yogurt FREDDI, anche divisa nei pasti (mai scaldata)</span></div></div>`
    : '';
  const tol = imp.tolleranza;
  return `<section class="card">
    <h3>${GIORNI[i]} ${dataBreve(lunedi, i)} ${val.obiettivo.ricarica ? '<span class="chip batch">ricarica</span>' : ''}
      ${val.entroTolleranza ? '<span class="chip" style="background:var(--ok);color:#fff">✓ entro tolleranza</span>' : '<span class="chip errore">fuori tolleranza</span>'}</h3>
    ${righe}${fecola}
    <div class="riga-pulsanti non-stampare"><button class="mini" data-azione="rigenera-giorno" data-giorno="${i}">Rigenera questo giorno (tiene i bloccati)</button></div>
    <details><summary class="piccolo">Totali del giorno: ${num(val.totali.kcal)} kcal · AR ${num(val.totali.ar, 1)} g</summary>
      ${barreValori(val.totali, val.obiettivo, val, tol)}
      <p class="tenue piccolo">Fibre ${num(val.totali.fibre)} g · Sodio ${num(val.totali.sodio)} mg · Potassio ${num(val.totali.potassio)} mg</p>
    </details>
  </section>`;
}
