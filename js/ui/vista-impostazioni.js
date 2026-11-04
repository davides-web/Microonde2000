// ==========================================================
// Vista "Impostazioni": obiettivi, esclusioni, mensa, pasti,
// backup (esporta/importa) e azzeramento.
// ==========================================================
import { GIORNI, IMPOSTAZIONI_PREDEFINITE, copia } from '../impostazioni.js';
import { creaBackup, leggiBackup, statoIniziale } from '../archivio.js';
import { esc, avviso, scaricaFile } from './dom.js';

// Legge/scrive un valore annidato, es. "macro.prot".
function leggi(obj, percorso) {
  return percorso.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function scrivi(obj, percorso, valore) {
  const parti = percorso.split('.');
  const ultima = parti.pop();
  const dest = parti.reduce((o, k) => o[k], obj);
  dest[ultima] = valore;
}

// Campi numerici e caselle di spunta generati in modo uniforme.
function campoNum(imp, percorso, etichetta, passo = 1) {
  return `<div><label for="i-${percorso}">${esc(etichetta)}</label>
    <input id="i-${percorso}" type="number" inputmode="decimal" step="${passo}" data-campo="${percorso}" value="${esc(leggi(imp, percorso))}"></div>`;
}
function campoCheck(imp, percorso, etichetta) {
  return `<div class="campo-check"><input id="i-${percorso}" type="checkbox" data-campo="${percorso}" ${leggi(imp, percorso) ? 'checked' : ''}>
    <label for="i-${percorso}" style="margin:0">${esc(etichetta)}</label></div>`;
}
function campoGiorno(imp, percorso, etichetta) {
  const v = Number(leggi(imp, percorso));
  return `<div><label for="i-${percorso}">${esc(etichetta)}</label>
    <select id="i-${percorso}" data-campo="${percorso}" data-tipo="numero">
      ${GIORNI.map((g, i) => `<option value="${i}" ${i === v ? 'selected' : ''}>${g}</option>`).join('')}
    </select></div>`;
}

export function mostra(ctx, el) {
  const imp = ctx.stato.impostazioni;
  const sommaMacro = imp.macro.prot + imp.macro.grassi + imp.macro.carbo;
  const sommaRic = imp.ricarica.prot + imp.ricarica.grassi + imp.ricarica.carbo;
  const sommaQuote = imp.pasti.reduce((s, p) => s + Number(p.quota || 0), 0);

  el.innerHTML = `
  <h2>Impostazioni</h2>
  <p class="tenue">Le modifiche vengono salvate subito nel telefono. Dopo aver cambiato gli obiettivi, rigenera il piano.</p>

  <section class="card">
    <h3>Obiettivi giornalieri</h3>
    <div class="griglia">
      ${campoNum(imp, 'kcal', 'Calorie (kcal)', 10)}
      ${campoNum(imp, 'macro.prot', 'Proteine (% kcal)')}
      ${campoNum(imp, 'macro.grassi', 'Grassi (% kcal)')}
      ${campoNum(imp, 'macro.carbo', 'Carboidrati (% kcal)')}
      ${campoNum(imp, 'tolleranza', 'Tolleranza (±%)')}
    </div>
    ${sommaMacro !== 100 ? `<p class="messaggio-errore">Attenzione: le percentuali sommano a ${sommaMacro}%, non 100%.</p>` : ''}
  </section>

  <section class="card">
    <h3>Giorno di ricarica</h3>
    ${campoCheck(imp, 'ricarica.attiva', 'Attiva il giorno di ricarica')}
    <div class="griglia">
      ${campoGiorno(imp, 'ricarica.giorno', 'Giorno')}
      ${campoNum(imp, 'ricarica.kcal', 'Calorie (kcal)', 10)}
      ${campoNum(imp, 'ricarica.prot', 'Proteine (%)')}
      ${campoNum(imp, 'ricarica.grassi', 'Grassi (%)')}
      ${campoNum(imp, 'ricarica.carbo', 'Carboidrati (%)')}
    </div>
    ${sommaRic !== 100 ? `<p class="messaggio-errore">Attenzione: le percentuali sommano a ${sommaRic}%.</p>` : ''}
  </section>

  <section class="card">
    <h3>Amido resistente</h3>
    <div class="griglia">
      ${campoNum(imp, 'amidoResistente.obiettivo', 'Obiettivo (g/giorno)')}
      ${campoNum(imp, 'amidoResistente.maxFecola', 'Fecola cruda max (g/giorno)', 5)}
    </div>
    ${campoCheck(imp, 'amidoResistente.integraFecola', 'Se manca, integra con fecola di patate cruda (in acqua o yogurt freddi)')}
    <p class="tenue piccolo">Fonti: fecola di patate cruda, patate/riso/legumi cotti e raffreddati, banana poco matura, avena cruda. Le stime per ingrediente si modificano nella scheda Ingredienti.</p>
  </section>

  <section class="card">
    <h3>Esclusioni</h3>
    ${campoCheck(imp, 'esclusioni.pane', 'Niente pane')}
    ${campoCheck(imp, 'esclusioni.albume', 'Niente albume da solo (solo uova intere)')}
    ${campoCheck(imp, 'esclusioni.avocado', 'Niente avocado')}
    ${campoCheck(imp, 'esclusioni.ultraprocessati', 'Niente cibi ultraprocessati')}
    ${campoCheck(imp, 'esclusioni.farineRaffinate', 'Niente farine raffinate')}
    ${campoCheck(imp, 'esclusioni.oliVegetali', 'Niente oli vegetali aggiunti')}
    ${campoCheck(imp, 'esclusioni.consentiOlioEvo', 'Consenti olio extravergine di oliva')}
    ${campoCheck(imp, 'esclusioni.saleSoloIposodico', 'Sale solo iposodico')}
  </section>

  <section class="card">
    <h3>Mensa</h3>
    ${campoCheck(imp, 'mensa.attiva', 'Un pasto a settimana alla mensa (escluso dal piano)')}
    <div class="griglia">
      ${campoGiorno(imp, 'mensa.giorno', 'Giorno')}
      <div><label for="i-mensa.pasto">Pasto</label>
        <select id="i-mensa.pasto" data-campo="mensa.pasto">
          ${imp.pasti.map((p) => `<option value="${esc(p.id)}" ${p.id === imp.mensa.pasto ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}
        </select></div>
      ${campoNum(imp, 'mensa.kcal', 'Stima kcal', 10)}
      ${campoNum(imp, 'mensa.prot', 'Proteine (g)')}
      ${campoNum(imp, 'mensa.grassi', 'Grassi (g)')}
      ${campoNum(imp, 'mensa.carbo', 'Carboidrati (g)')}
    </div>
  </section>

  <section class="card">
    <h3>Pasti della giornata</h3>
    <p class="tenue piccolo">La quota è la percentuale indicativa delle kcal del giorno per quel pasto. Somma attuale: ${sommaQuote}%.</p>
    ${imp.pasti.map((p, i) => `
      <div class="griglia" style="align-items:end">
        <div><label>Nome</label><input data-pasto="${i}" data-prop="nome" value="${esc(p.nome)}"></div>
        <div><label>Tipo di ricette</label>
          <select data-pasto="${i}" data-prop="tipo">
            ${['colazione', 'pranzo', 'cena', 'spuntino'].map((t) => `<option ${t === p.tipo ? 'selected' : ''}>${t}</option>`).join('')}
          </select></div>
        <div><label>Quota (%)</label><input type="number" data-pasto="${i}" data-prop="quota" value="${esc(p.quota)}"></div>
        <div><button class="mini pericolo" data-azione="rimuovi-pasto" data-indice="${i}" ${imp.pasti.length <= 1 ? 'disabled' : ''}>Rimuovi</button></div>
      </div>`).join('')}
    <div class="riga-pulsanti"><button data-azione="aggiungi-spuntino">+ Aggiungi spuntino</button></div>
  </section>

  <section class="card">
    <h3>Varietà e batch cooking</h3>
    <div class="griglia">
      ${campoNum(imp, 'maxRipetizioni', 'Stessa ricetta max (volte/settimana)')}
      ${campoNum(imp, 'potenzaMicroonde', 'Potenza del tuo microonde (W)', 50)}
    </div>
    ${campoCheck(imp, 'preferisciBatch', 'Preferisci il batch cooking (una cottura per 2-3 pasti)')}
  </section>

  <section class="card">
    <h3>Backup</h3>
    <p class="tenue piccolo">I dati restano solo in questo telefono. Esporta un backup ogni tanto (es. su Google Drive o via email a te stesso) per non perderli.</p>
    <div class="riga-pulsanti">
      <button class="primario" data-azione="esporta">Esporta backup (JSON)</button>
      <label class="pulsante" style="margin:0;display:inline-flex;align-items:center">Importa backup
        <input type="file" accept="application/json,.json" data-azione="importa" style="display:none"></label>
    </div>
    <h4>Ripristino</h4>
    <div class="riga-pulsanti">
      <button data-azione="reset-impostazioni">Impostazioni predefinite</button>
      <button class="pericolo" data-azione="reset-tutto">Cancella tutti i dati</button>
    </div>
  </section>`;

  // --- Modifica dei campi semplici ---
  el.querySelectorAll('[data-campo]').forEach((input) => {
    input.addEventListener('change', () => {
      const percorso = input.dataset.campo;
      let valore;
      if (input.type === 'checkbox') valore = input.checked;
      else if (input.type === 'number' || input.dataset.tipo === 'numero') valore = Number(input.value);
      else valore = input.value;
      scrivi(imp, percorso, valore);
      ctx.salva();
      avviso('Impostazione salvata');
    });
  });

  // --- Modifica dei pasti ---
  el.querySelectorAll('[data-pasto]').forEach((input) => {
    input.addEventListener('change', () => {
      const p = imp.pasti[Number(input.dataset.pasto)];
      const prop = input.dataset.prop;
      p[prop] = prop === 'quota' ? Number(input.value) : input.value;
      ctx.salva();
    });
  });

  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-azione]');
    if (!b || b.tagName === 'INPUT') return;
    const azione = b.dataset.azione;
    if (azione === 'aggiungi-spuntino') {
      const n = imp.pasti.filter((p) => p.tipo === 'spuntino').length + 1;
      imp.pasti.push({ id: 'spuntino' + Date.now().toString(36), nome: 'Spuntino ' + n, tipo: 'spuntino', quota: 10 });
      ctx.salva();
    } else if (azione === 'rimuovi-pasto') {
      imp.pasti.splice(Number(b.dataset.indice), 1);
      ctx.salva();
    } else if (azione === 'esporta') {
      const data = new Date().toISOString().slice(0, 10);
      scaricaFile(`microonde2000-backup-${data}.json`, creaBackup(ctx.stato));
    } else if (azione === 'reset-impostazioni') {
      if (confirm('Ripristinare le impostazioni predefinite? Ricette, ingredienti e piani restano.')) {
        ctx.stato.impostazioni = copia(IMPOSTAZIONI_PREDEFINITE);
        ctx.salva();
        avviso('Impostazioni ripristinate');
      }
    } else if (azione === 'reset-tutto') {
      if (confirm('Cancellare TUTTI i dati (piani, ricette e ingredienti modificati, impostazioni)? Consigliato esportare prima un backup.')) {
        ctx.sostituisci(statoIniziale());
        avviso('Dati cancellati');
      }
    }
  });

  // --- Importazione backup ---
  el.querySelector('[data-azione="importa"]').addEventListener('change', async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      const nuovo = leggiBackup(await file.text());
      if (confirm('Sostituire i dati attuali con quelli del backup?')) {
        ctx.sostituisci(nuovo);
        avviso('Backup importato');
      }
    } catch (e) {
      alert(e.message);
    }
  });
}
