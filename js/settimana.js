// ==========================================================
// Date della settimana (lunedì → domenica), senza librerie.
// Le settimane sono identificate dalla data del lunedì: "AAAA-MM-GG".
// ==========================================================

function iso(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const g = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${g}`;
}

function daIso(testo) {
  const [a, m, g] = testo.split('-').map(Number);
  return new Date(a, m - 1, g, 12); // mezzogiorno: niente problemi con l'ora legale
}

// Lunedì della settimana che contiene la data.
export function lunediDi(data = new Date()) {
  const d = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 12);
  const giorno = (d.getDay() + 6) % 7; // 0 = lunedì
  d.setDate(d.getDate() - giorno);
  return iso(d);
}

export function spostaSettimana(lunedi, settimane) {
  const d = daIso(lunedi);
  d.setDate(d.getDate() + 7 * settimane);
  return iso(d);
}

// Data del giorno i (0 = lunedì) come "9/11".
export function dataBreve(lunedi, i) {
  const d = daIso(lunedi);
  d.setDate(d.getDate() + i);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

// "dal 9/11 al 15/11"
export function etichettaSettimana(lunedi) {
  return `dal ${dataBreve(lunedi, 0)} al ${dataBreve(lunedi, 6)}`;
}
