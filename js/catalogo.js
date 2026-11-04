// ==========================================================
// Catalogo: unisce i dati predefiniti (nel codice) con le
// modifiche dell'utente (salvate nel telefono).
// ==========================================================
import { INGREDIENTI } from './dati/ingredienti.js';

// Restituisce l'elenco degli ingredienti in uso.
export function elencoIngredienti(stato) {
  const eliminati = new Set(stato.ingredientiEliminati || []);
  const utente = stato.ingredientiUtente || {};
  const risultato = INGREDIENTI.filter((i) => !eliminati.has(i.id)).map((i) => (utente[i.id] ? { ...i, ...utente[i.id] } : i));
  // Ingredienti creati dall'utente (id non presenti tra i predefiniti).
  const predefiniti = new Set(INGREDIENTI.map((i) => i.id));
  for (const [id, ing] of Object.entries(utente)) {
    if (!predefiniti.has(id) && !eliminati.has(id)) risultato.push({ ...ing, id });
  }
  return risultato;
}

// Mappa id -> ingrediente, comoda per i calcoli.
export function mappaIngredienti(stato) {
  return Object.fromEntries(elencoIngredienti(stato).map((i) => [i.id, i]));
}

export function ePredefinitoIngrediente(id) {
  return INGREDIENTI.some((i) => i.id === id);
}

// Crea un id semplice e leggibile da un nome ("Riso venere" -> "riso_venere").
export function creaId(nome, esistenti) {
  const base = String(nome).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'elemento';
  let id = base;
  let n = 2;
  while (esistenti.has(id)) id = `${base}_${n++}`;
  return id;
}
