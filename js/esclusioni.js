// ==========================================================
// Esclusioni alimentari: quali categorie di ingredienti sono
// vietate con le impostazioni attuali e controllo delle ricette.
// ==========================================================

// Testo leggibile per ogni categoria.
export const MOTIVI = {
  pane: 'pane',
  albume: 'albume da solo',
  avocado: 'avocado',
  ultraprocessato: 'cibo ultraprocessato',
  farina_raffinata: 'farina raffinata',
  olio_vegetale: 'olio vegetale aggiunto',
  olio_evo: 'olio extravergine (non consentito nelle impostazioni)',
  sale: 'sale non iposodico'
};

// Insieme delle categorie escluse secondo le impostazioni.
export function categorieEscluse(imp) {
  const e = (imp && imp.esclusioni) || {};
  const s = new Set();
  if (e.pane) s.add('pane');
  if (e.albume) s.add('albume');
  if (e.avocado) s.add('avocado');
  if (e.ultraprocessati) s.add('ultraprocessato');
  if (e.farineRaffinate) s.add('farina_raffinata');
  if (e.oliVegetali) s.add('olio_vegetale');
  if (!e.consentiOlioEvo) s.add('olio_evo');
  if (e.saleSoloIposodico) s.add('sale');
  return s;
}

// Motivo per cui un ingrediente è escluso (o null se è ammesso).
export function motivoEsclusione(ing, imp) {
  const escluse = categorieEscluse(imp);
  for (const c of ing.categorie || []) {
    if (escluse.has(c)) return MOTIVI[c] || c;
  }
  return null;
}

// Problemi di una ricetta: ingredienti esclusi o mancanti.
// Restituisce un array vuoto se la ricetta è ammessa.
export function problemiRicetta(ricetta, mappaIngredienti, imp) {
  const problemi = [];
  for (const riga of ricetta.ingredienti || []) {
    const ing = mappaIngredienti[riga.id];
    if (!ing) {
      problemi.push({ id: riga.id, nome: riga.id, motivo: 'ingrediente non presente in tabella' });
      continue;
    }
    const motivo = motivoEsclusione(ing, imp);
    if (motivo) problemi.push({ id: riga.id, nome: ing.nome, motivo });
  }
  return problemi;
}

export function ricettaAmmessa(ricetta, mappaIngredienti, imp) {
  return problemiRicetta(ricetta, mappaIngredienti, imp).length === 0;
}
