// ==========================================================
// Impostazioni predefinite dell'app.
// Tutto ciò che è qui può essere cambiato dalla schermata
// "Impostazioni"; i valori modificati vengono salvati nel
// telefono e uniti a questi valori di partenza.
// ==========================================================

// Giorni della settimana: l'indice 0 è il lunedì.
export const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const IMPOSTAZIONI_PREDEFINITE = {
  // Obiettivo calorico giornaliero e ripartizione dei macronutrienti
  // in percentuale delle kcal (proteine, grassi, carboidrati).
  kcal: 2000,
  macro: { prot: 30, grassi: 30, carbo: 40 },

  // Tolleranza ammessa: ± percentuale sulle kcal e ± punti
  // percentuali sulla ripartizione dei macro.
  tolleranza: 5,

  // Giorno di "ricarica" (più calorie e più carboidrati).
  ricarica: { attiva: true, giorno: 5, kcal: 2400, prot: 25, grassi: 20, carbo: 55 },

  // Amido resistente: obiettivo in grammi al giorno.
  // Se manca, il piano può aggiungere fecola di patate cruda
  // (da sciogliere in acqua o yogurt freddi) fino a un massimo.
  amidoResistente: { obiettivo: 40, integraFecola: true, maxFecola: 40 },

  // Esclusioni alimentari (true = escluso).
  esclusioni: {
    pane: true,
    albume: true,            // niente albume da solo: solo uova intere
    avocado: true,
    ultraprocessati: true,
    farineRaffinate: true,
    oliVegetali: true,       // oli di semi e simili
    consentiOlioEvo: false,  // interruttore separato per l'olio extravergine
    saleSoloIposodico: true
  },

  // Pranzo alla mensa scolastica: lo slot non viene pianificato
  // e la stima viene sottratta dal giorno.
  mensa: { attiva: true, giorno: 0, pasto: 'pranzo', kcal: 700, prot: 30, grassi: 25, carbo: 85 },

  // Pasti della giornata. "quota" = percentuale indicativa delle kcal
  // del giorno; "tipo" = etichetta delle ricette adatte.
  pasti: [
    { id: 'colazione', nome: 'Colazione', tipo: 'colazione', quota: 25 },
    { id: 'pranzo', nome: 'Pranzo', tipo: 'pranzo', quota: 35 },
    { id: 'cena', nome: 'Cena', tipo: 'cena', quota: 30 },
    { id: 'spuntino', nome: 'Spuntino', tipo: 'spuntino', quota: 10 }
  ],

  // Varietà: la stessa ricetta al massimo N volte a settimana.
  maxRipetizioni: 3,

  // Preferenza per il batch cooking (cucinare una volta per 2-3 pasti).
  preferisciBatch: true,

  // Potenza del proprio microonde (solo promemoria nelle ricette).
  potenzaMicroonde: 800
};

// Copia profonda semplice (i dati sono solo JSON).
export function copia(oggetto) {
  return JSON.parse(JSON.stringify(oggetto));
}

// Unisce le impostazioni salvate con quelle predefinite:
// le chiavi nuove (aggiunte in versioni successive) prendono il default.
export function unisciImpostazioni(salvate) {
  const base = copia(IMPOSTAZIONI_PREDEFINITE);
  if (!salvate || typeof salvate !== 'object') return base;
  for (const chiave of Object.keys(base)) {
    const v = salvate[chiave];
    if (v === undefined || v === null) continue;
    if (Array.isArray(base[chiave])) {
      if (Array.isArray(v) && v.length) base[chiave] = v;
    } else if (typeof base[chiave] === 'object') {
      base[chiave] = { ...base[chiave], ...v };
    } else {
      base[chiave] = v;
    }
  }
  return base;
}

// Restituisce l'obiettivo di un giorno (0 = lunedì), tenendo conto
// dell'eventuale giorno di ricarica. Grammi calcolati dalle percentuali.
export function obiettivoGiorno(imp, giorno) {
  const ric = imp.ricarica;
  const usaRicarica = ric && ric.attiva && Number(ric.giorno) === giorno;
  const kcal = usaRicarica ? ric.kcal : imp.kcal;
  const pct = usaRicarica ? { prot: ric.prot, grassi: ric.grassi, carbo: ric.carbo } : imp.macro;
  return {
    ricarica: usaRicarica,
    kcal,
    pct,
    prot: (kcal * pct.prot) / 100 / 4,
    grassi: (kcal * pct.grassi) / 100 / 9,
    carbo: (kcal * pct.carbo) / 100 / 4,
    ar: imp.amidoResistente.obiettivo
  };
}

// Vero se quel pasto di quel giorno è alla mensa (escluso dal piano).
export function eMensa(imp, giorno, idPasto) {
  const m = imp.mensa;
  return !!(m && m.attiva && Number(m.giorno) === giorno && m.pasto === idPasto);
}
