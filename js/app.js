// ==========================================================
// Punto di ingresso dell'app: carica i dati, gestisce le
// schede (tramite l'indirizzo #piano, #spesa, ...) e salva.
// ==========================================================
import { caricaStato, salvaStato } from './archivio.js';
import { esc } from './ui/dom.js';
import * as vistaImpostazioni from './ui/vista-impostazioni.js';
import * as vistaIngredienti from './ui/vista-ingredienti.js';
import * as vistaRicette from './ui/vista-ricette.js';
import * as vistaPiano from './ui/vista-piano.js';
import * as vistaSpesa from './ui/vista-spesa.js';
import * as vistaMealprep from './ui/vista-mealprep.js';
import * as vistaCronometer from './ui/vista-cronometer.js';

// Elenco delle schede. Ogni vista esporta una funzione "mostra(ctx, el)".
const VISTE = {
  piano: vistaPiano,
  spesa: vistaSpesa,
  mealprep: vistaMealprep,
  cronometer: vistaCronometer,
  ricette: vistaRicette,
  ingredienti: vistaIngredienti,
  impostazioni: vistaImpostazioni
};

// Contesto condiviso tra le viste.
const ctx = {
  stato: caricaStato(),
  // Salva nel telefono e ridisegna la vista corrente.
  salva(ridisegna = true) {
    salvaStato(ctx.stato);
    if (ridisegna) mostraVista();
  },
  // Sostituisce tutto lo stato (es. dopo l'importazione di un backup).
  sostituisci(nuovoStato) {
    ctx.stato = nuovoStato;
    ctx.salva();
  },
  vai(scheda) {
    location.hash = '#' + scheda;
  }
};

function mostraVista() {
  const nome = (location.hash || '#piano').slice(1).split('/')[0];
  const vista = VISTE[nome] || VISTE.piano || VISTE.impostazioni;
  const el = document.getElementById('vista');
  document.querySelectorAll('#schede a').forEach((a) => {
    a.classList.toggle('attiva', a.getAttribute('href') === '#' + nome);
  });
  el.onclick = null; // ogni vista imposta i propri gestori
  try {
    vista.mostra(ctx, el);
  } catch (e) {
    console.error(e);
    el.innerHTML = `<p class="messaggio-errore">Errore: ${esc(e.message)}</p>`;
  }
}

window.addEventListener('hashchange', () => {
  mostraVista();
  window.scrollTo(0, 0);
});
mostraVista();

// Registra il service worker per il funzionamento offline.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('Service worker non registrato', e));
}
