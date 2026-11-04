// ==========================================================
// Piccoli aiuti per l'interfaccia (nessuna libreria esterna).
// ==========================================================

// Protegge il testo prima di inserirlo nell'HTML.
export function esc(testo) {
  return String(testo ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Numero formattato all'italiana con N decimali.
import { num } from '../formato.js';
export { num };

// Mostra un breve messaggio in basso.
let timerAvviso;
export function avviso(testo) {
  const el = document.getElementById('avviso');
  if (!el) return;
  el.textContent = testo;
  el.classList.add('visibile');
  clearTimeout(timerAvviso);
  timerAvviso = setTimeout(() => el.classList.remove('visibile'), 2500);
}

// Copia un testo negli appunti (con ripiego per browser vecchi).
export async function copiaTesto(testo) {
  try {
    await navigator.clipboard.writeText(testo);
  } catch {
    const area = document.createElement('textarea');
    area.value = testo;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  avviso('Copiato negli appunti');
}

// Scarica un file generato nel telefono (es. backup JSON).
export function scaricaFile(nome, contenuto, tipo = 'application/json') {
  const blob = new Blob([contenuto], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Barra colorata: verde se entro tolleranza, arancio se vicina, rossa se fuori.
// "tol" è la tolleranza in percentuale rispetto all'obiettivo.
// "classe" (facoltativa) forza il colore: 'ok', 'vicino' o 'fuori'.
export function barra(etichetta, valore, obiettivo, unita = '', tol = 5, classe = null, nota = '') {
  const rapporto = obiettivo > 0 ? valore / obiettivo : 0;
  const scarto = Math.abs(rapporto - 1) * 100;
  if (!classe) classe = scarto <= tol ? 'ok' : scarto <= tol * 2 ? 'vicino' : 'fuori';
  const larghezza = Math.min(100, rapporto * 100 / 1.3); // l'obiettivo sta a circa il 77% della barra
  return `<div class="barra">
    <div class="etichetta"><span>${esc(etichetta)}</span><span>${num(valore)} / ${num(obiettivo)} ${esc(unita)}${nota ? ' · ' + esc(nota) : ''}</span></div>
    <div class="fondo"><div class="riemp ${classe}" style="width:${larghezza.toFixed(1)}%"></div>
    <div style="position:absolute;top:0;bottom:0;left:${(100 / 1.3).toFixed(1)}%;width:2px;background:var(--testo);opacity:.5"></div></div>
  </div>`;
}
