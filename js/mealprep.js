// ==========================================================
// Meal prep: dal piano della settimana ricava cosa cucinare e
// quando, con tempi al microonde, conservazione e riscaldamento.
//
// Regole:
// - una ricetta batch usata in giorni vicini si cucina UNA volta
//   per tutti i pasti (quantità = somma delle porzioni);
// - se una ricetta contiene ingredienti "cotti e raffreddati", si
//   cucina il giorno prima (sera) e si mette in frigo;
// - le ricette non batch si cucinano al momento; se hanno una
//   preparazione anticipata (es. patate), quella si fa il giorno prima.
// ==========================================================
import { GIORNI } from './impostazioni.js';
import { sessioneAperta, richiedeRaffreddamento } from './generatore.js';

export const REGOLE_SICUREZZA = [
  'Fai raffreddare i cibi cotti al massimo 1 ora a temperatura ambiente (allargali in un contenitore basso), poi subito in frigo a 4 °C o meno.',
  'Usa contenitori ermetici adatti al microonde; scrivi sul coperchio il giorno di cottura.',
  'Riscalda una porzione alla volta, coperta (coperchio appoggiato), mescolando a metà, finché è fumante anche al centro (almeno 75 °C); poi 1 minuto di riposo.',
  'Il riso cotto va raffreddato in fretta e riscaldato una sola volta.',
  'Non riscaldare più di una volta la stessa porzione e non ricongelare cibi già scongelati.',
  'Se superi i giorni massimi di conservazione, congela le porzioni subito dopo la cottura e scongelale in frigo la sera prima.',
  'La fecola di patate per l\'amido resistente si aggiunge sempre a freddo: non va mai scaldata.'
];

// Nome del giorno per indici da -1 (domenica precedente) a 6.
export function nomeGiorno(i) {
  return i < 0 ? 'Domenica precedente' : GIORNI[i];
}

// Elenco delle cotture della settimana.
// Ogni sessione: { ricetta, giornoCottura, anticipata, usi: [{giorno, pasto, fattore}], porzioni }
export function sessioniCottura(piano, ctx) {
  const sessioni = [];
  const aperte = {}; // idRicetta -> sessioni batch (per riconoscere gli avanzi)
  piano.giorni.forEach((giorno, g) => {
    for (const slot of ctx.imp.pasti) {
      const p = giorno.pasti[slot.id];
      if (!p || p.mensa || !p.ricetta || !ctx.ricette[p.ricetta]) continue;
      const r = ctx.ricette[p.ricetta];
      const uso = { giorno: g, pasto: slot.nome, fattore: p.fattore };
      if (r.etichette.includes('batch')) {
        // aperte[id] = [{ inizio, pasti, sessione }] (stessa regola del generatore)
        const lista = (aperte[r.id] ||= []);
        const aperta = sessioneAperta(r, lista, g);
        if (aperta) {
          aperta.sessione.usi.push(uso);
          aperta.pasti++;
          continue;
        }
        const nuova = creaSessione(r, uso);
        lista.push({ inizio: g, pasti: 1, sessione: nuova });
        sessioni.push(nuova);
      } else {
        sessioni.push(creaSessione(r, uso));
      }
    }
  });
  for (const s of sessioni) s.porzioni = s.usi.reduce((t, u) => t + u.fattore, 0);
  return sessioni.sort((a, b) => a.giornoCottura - b.giornoCottura);
}

function creaSessione(r, uso) {
  const batch = r.etichette.includes('batch');
  const anticipata = batch && richiedeRaffreddamento(r);
  return {
    ricetta: r,
    batch,
    anticipata,
    giornoCottura: anticipata ? uso.giorno - 1 : uso.giorno,
    usi: [uso],
    porzioni: 0
  };
}

// Minuti totali al microonde di una ricetta (per la quantità standard).
export function minutiMicroonde(r) {
  return (r.cottura || []).reduce((t, c) => t + (Number(c.min) || 0), 0);
}

// Attività giorno per giorno: { giorno: -1..6, attivita: [...] }.
// tipo: 'batch' (cottura per più pasti), 'anticipo' (da preparare il
// giorno prima), 'momento' (da cucinare al momento del pasto).
export function pianoMealPrep(piano, ctx) {
  const perGiorno = new Map();
  const aggiungi = (g, a) => {
    if (!perGiorno.has(g)) perGiorno.set(g, []);
    perGiorno.get(g).push(a);
  };
  for (const s of sessioniCottura(piano, ctx)) {
    const r = s.ricetta;
    const scala = s.porzioni / Math.max(1, Number(r.porzioni) || 1);
    const ultimoUso = Math.max(...s.usi.map((u) => u.giorno));
    const giorniInFrigo = ultimoUso - s.giornoCottura;
    const base = {
      ricetta: r,
      porzioni: s.porzioni,
      scala,
      minuti: minutiMicroonde(r),
      cottura: r.cottura || [],
      usi: s.usi,
      frigoGiorni: r.frigoGiorni,
      superaFrigo: giorniInFrigo > (Number(r.frigoGiorni) || 0),
      riscaldamento: r.riscaldamento
    };
    if (s.batch && (s.usi.length > 1 || s.anticipata)) {
      aggiungi(s.giornoCottura, { ...base, tipo: 'batch', anticipata: s.anticipata, anticipo: r.anticipo });
    } else {
      if (r.anticipo) aggiungi(s.giornoCottura - 1, { ...base, tipo: 'anticipo', anticipo: r.anticipo });
      aggiungi(s.giornoCottura, { ...base, tipo: 'momento' });
    }
  }
  const ordine = { anticipo: 0, batch: 1, momento: 2 };
  return [...perGiorno.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([giorno, attivita]) => ({ giorno, nome: nomeGiorno(giorno), attivita: attivita.sort((a, b) => ordine[a.tipo] - ordine[b.tipo]) }));
}
