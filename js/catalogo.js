// ==========================================================
// Catalogo: unisce i dati predefiniti (nel codice) con le
// modifiche dell'utente (salvate nel telefono).
// ==========================================================
import { INGREDIENTI } from './dati/ingredienti.js';
import { RICETTE } from './dati/ricette.js';
import { creaContesto } from './generatore.js';

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

// Restituisce l'elenco delle ricette in uso (predefinite + dell'utente).
export function elencoRicette(stato) {
  const eliminate = new Set(stato.ricetteEliminate || []);
  const utente = stato.ricetteUtente || {};
  const risultato = RICETTE.filter((r) => !eliminate.has(r.id)).map((r) => (utente[r.id] ? { ...r, ...utente[r.id], predefinita: true } : r));
  const predefinite = new Set(RICETTE.map((r) => r.id));
  for (const [id, r] of Object.entries(utente)) {
    if (!predefinite.has(id) && !eliminate.has(id)) risultato.push({ ...r, id, predefinita: false });
  }
  return risultato;
}

export function mappaRicette(stato) {
  return Object.fromEntries(elencoRicette(stato).map((r) => [r.id, r]));
}

export function ePredefinitaRicetta(id) {
  return RICETTE.some((r) => r.id === id);
}

// Contesto per il generatore e i riepiloghi, a partire dallo stato salvato.
export function contestoPiano(stato) {
  return creaContesto(stato.impostazioni, elencoRicette(stato), mappaIngredienti(stato));
}
