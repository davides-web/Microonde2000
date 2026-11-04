// ==========================================================
// Lista della spesa: somma gli ingredienti di tutti i pasti
// della settimana (porzioni comprese), aggiunge la fecola di
// integrazione e arrotonda alle confezioni tipiche.
// ==========================================================
import { REPARTI } from './dati/ingredienti.js';
import { totaliGiorno, pastiAttivi } from './generatore.js';
import { num } from './formato.js';

// Grammi di ogni ingrediente necessari per un insieme di pasti.
// Restituisce un oggetto { idIngrediente: grammi }.
export function grammiPasti(pasti, ctx, accumulo = {}) {
  for (const p of Object.values(pasti)) {
    if (!p || p.mensa || !p.ricetta) continue;
    const r = ctx.ricette[p.ricetta];
    if (!r) continue;
    const scala = (Number(p.fattore) || 1) / Math.max(1, Number(r.porzioni) || 1);
    for (const riga of r.ingredienti) {
      accumulo[riga.id] = (accumulo[riga.id] || 0) + (Number(riga.g) || 0) * scala;
    }
  }
  return accumulo;
}

// Fabbisogno di tutta la settimana (inclusa la fecola di integrazione).
export function fabbisognoSettimana(piano, ctx) {
  const totale = {};
  for (const giorno of piano.giorni) {
    grammiPasti(pastiAttivi(giorno.pasti, ctx.imp), ctx, totale);
    const { fecolaG } = totaliGiorno(giorno.pasti, ctx);
    if (fecolaG > 0) totale.fecola = (totale.fecola || 0) + fecolaG;
  }
  return totale;
}

// Quantità da comprare: confezioni intere oppure peso arrotondato.
export function quantitaAcquisto(ing, grammi) {
  const conf = Number(ing.conf) || 0;
  let testo;
  let confezioni = 0;
  let grammiAcquisto;
  if (conf > 0) {
    // Piccola tolleranza (2%) per non comprare una confezione in più per pochi grammi.
    confezioni = Math.max(1, Math.ceil(grammi / conf - 0.02));
    grammiAcquisto = confezioni * conf;
    const nome = ing.confNome || `${num(conf)} g`;
    testo = `${confezioni} × ${nome}`;
  } else {
    grammiAcquisto = Math.max(50, Math.ceil(grammi / 50) * 50);
    testo = `${num(grammiAcquisto)} g`;
  }
  if (ing.pezzo > 0) {
    const pezzi = Math.ceil(grammi / ing.pezzo - 0.05);
    testo += ` (circa ${pezzi} ${pezzi === 1 ? 'pezzo' : 'pezzi'})`;
  }
  return { confezioni, grammiAcquisto, testo };
}

// Lista raggruppata per reparto, nell'ordine dei reparti del supermercato.
export function listaSpesa(piano, ctx) {
  const fabbisogno = fabbisognoSettimana(piano, ctx);
  const gruppi = new Map(REPARTI.map((r) => [r, []]));
  for (const [id, grammi] of Object.entries(fabbisogno)) {
    if (grammi <= 0) continue;
    const ing = ctx.mappaIngredienti[id] || { id, nome: id, reparto: 'Altro', conf: 0 };
    const reparto = ing.reparto || 'Altro';
    if (!gruppi.has(reparto)) gruppi.set(reparto, []);
    gruppi.get(reparto).push({ id, nome: ing.nome, grammi, nota: ing.nota || '', ...quantitaAcquisto(ing, grammi) });
  }
  return [...gruppi.entries()]
    .filter(([, articoli]) => articoli.length)
    .map(([reparto, articoli]) => ({ reparto, articoli: articoli.sort((a, b) => a.nome.localeCompare(b.nome, 'it')) }));
}

// Testo semplice da copiare (es. per la spesa online).
export function testoSpesa(lista, spunte = {}, soloDaComprare = true) {
  const righe = [];
  for (const g of lista) {
    const articoli = g.articoli.filter((a) => !soloDaComprare || !spunte[a.id]);
    if (!articoli.length) continue;
    righe.push(g.reparto.toUpperCase());
    for (const a of articoli) righe.push(`- ${a.nome}: ${a.testo}${a.nota ? ` — ${a.nota}` : ''}`);
    righe.push('');
  }
  return righe.join('\n').trim();
}
