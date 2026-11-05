// ==========================================================
// Calcolo dei valori nutrizionali a partire dagli ingredienti.
// Tutte le funzioni sono "pure": non toccano l'interfaccia,
// così si possono provare con i test automatici.
// ==========================================================

// Nutrienti sommati (oltre all'amido resistente "ar").
export const NUTRIENTI = ['kcal', 'prot', 'grassi', 'carbo', 'fibre', 'sodio', 'potassio'];

// Valori a zero.
export function vuoto() {
  return { kcal: 0, prot: 0, grassi: 0, carbo: 0, fibre: 0, sodio: 0, potassio: 0, ar: 0 };
}

// Somma b (moltiplicato per fattore) dentro a. Restituisce a.
export function aggiungi(a, b, fattore = 1) {
  for (const k of [...NUTRIENTI, 'ar']) a[k] += (b[k] || 0) * fattore;
  return a;
}

// Amido resistente per 100 g secondo lo stato in cui si mangia
// l'ingrediente: 'crudo', 'cotto' (caldo) o 'raffreddato'.
export function arPer100(ing, uso = 'cotto') {
  if (uso === 'crudo') return ing.arCrudo || 0;
  if (uso === 'raffreddato') return ing.arRaff ?? ing.arCotto ?? 0;
  return ing.arCotto || 0;
}

// Valori di "grammi" grammi di un ingrediente.
export function valoriIngrediente(ing, grammi, uso = 'cotto') {
  const f = grammi / 100;
  const v = vuoto();
  for (const k of NUTRIENTI) v[k] = (ing[k] || 0) * f;
  v.ar = arPer100(ing, uso) * f;
  return v;
}

// Valori di una ricetta: totale, per porzione ed elenco degli
// ingredienti non trovati nella tabella.
export function valoriRicetta(ricetta, mappaIngredienti) {
  const totale = vuoto();
  const mancanti = [];
  let pesoTotale = 0;
  for (const riga of ricetta.ingredienti || []) {
    const ing = mappaIngredienti[riga.id];
    if (!ing) {
      mancanti.push(riga.id);
      continue;
    }
    aggiungi(totale, valoriIngrediente(ing, Number(riga.g) || 0, riga.uso));
    pesoTotale += Number(riga.g) || 0;
  }
  const porzioni = Math.max(1, Number(ricetta.porzioni) || 1);
  const porzione = aggiungi(vuoto(), totale, 1 / porzioni);
  return { totale, porzione, mancanti, pesoTotale, pesoPorzione: pesoTotale / porzioni };
}

// Ripartizione dei macro in percentuale dell'energia da macronutrienti
// (proteine e carboidrati 4 kcal/g, grassi 9 kcal/g): le tre
// percentuali sommano sempre a 100.
export function percentualiMacro(v) {
  const p = v.prot * 4;
  const g = v.grassi * 9;
  const c = v.carbo * 4;
  const tot = p + g + c;
  if (tot <= 0) return { prot: 0, grassi: 0, carbo: 0 };
  return { prot: (p / tot) * 100, grassi: (g / tot) * 100, carbo: (c / tot) * 100 };
}

// Arrotonda tutti i valori (per mostrarli o per i test).
export function arrotonda(v, decimali = 1) {
  const m = 10 ** decimali;
  const r = {};
  for (const k of Object.keys(v)) r[k] = Math.round(v[k] * m) / m;
  return r;
}
