// ==========================================================
// Elenco "Per Cronometer": per ogni giorno, gli ingredienti in
// grammi da registrare, divisi per pasto (Cronometer ha i gruppi
// colazione/pranzo/cena/spuntini). Si registrano gli ingredienti
// a peso crudo, come in tabella.
// ==========================================================
import { GIORNI, eMensa } from './impostazioni.js';
import { grammiPasti } from './spesa.js';
import { totaliGiorno } from './generatore.js';
import { num } from './formato.js';

// Grammi arrotondati: interi, ma con un decimale sotto i 10 g (spezie, sale).
export function grammiLeggibili(g) {
  return g < 10 ? num(Math.round(g * 10) / 10, g % 1 ? 1 : 0) : num(Math.round(g));
}

// Gruppi di un giorno: [{ pasto, mensa, articoli: [{ id, nome, nomeEn, g }] }]
export function giornoCronometer(piano, ctx, i) {
  const giorno = piano.giorni[i];
  const gruppi = [];
  for (const slot of ctx.imp.pasti) {
    if (eMensa(ctx.imp, i, slot.id)) {
      gruppi.push({ pasto: slot.nome, mensa: true, articoli: [] });
      continue;
    }
    const p = giorno.pasti[slot.id];
    if (!p || !p.ricetta) continue;
    const grammi = grammiPasti({ [slot.id]: p }, ctx);
    const articoli = Object.entries(grammi)
      .filter(([, g]) => g > 0)
      .map(([id, g]) => {
        const ing = ctx.mappaIngredienti[id] || { nome: id, nomeEn: '' };
        return { id, nome: ing.nome, nomeEn: ing.nomeEn || '', g };
      });
    gruppi.push({ pasto: slot.nome, ricetta: ctx.ricette[p.ricetta]?.nome || p.ricetta, articoli });
  }
  const { fecolaG } = totaliGiorno(giorno.pasti, ctx);
  if (fecolaG > 0) {
    const f = ctx.mappaIngredienti.fecola;
    gruppi.push({ pasto: 'Integrazione (fecola cruda)', articoli: [{ id: 'fecola', nome: f.nome, nomeEn: f.nomeEn, g: fecolaG }] });
  }
  return gruppi;
}

// Testo da copiare per un giorno.
export function testoCronometer(piano, ctx, i, etichettaData = '') {
  const righe = [`${GIORNI[i]}${etichettaData ? ' ' + etichettaData : ''}`];
  for (const gr of giornoCronometer(piano, ctx, i)) {
    righe.push('');
    if (gr.mensa) {
      const m = ctx.imp.mensa;
      righe.push(`${gr.pasto}: mensa (stima ${num(m.kcal)} kcal, P ${num(m.prot)} g, G ${num(m.grassi)} g, C ${num(m.carbo)} g) — registra a parte`);
      continue;
    }
    righe.push(`${gr.pasto}${gr.ricetta ? ` — ${gr.ricetta}` : ''}`);
    for (const a of gr.articoli) righe.push(`- ${a.nome}${a.nomeEn ? ` [${a.nomeEn}]` : ''}: ${grammiLeggibili(a.g)} g`);
  }
  return righe.join('\n');
}
