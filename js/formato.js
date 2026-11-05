// Formattazione dei numeri all'italiana (usata anche fuori dall'interfaccia).
export function num(valore, decimali = 0) {
  const n = Number(valore) || 0;
  return n.toLocaleString('it-IT', { minimumFractionDigits: decimali, maximumFractionDigits: decimali });
}
