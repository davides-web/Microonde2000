// ==========================================================
// Archivio: salva e carica i dati SOLO nel telefono
// (localStorage). Gestisce anche il backup in JSON.
// Nessun dato viene mai inviato a internet.
// ==========================================================
import { unisciImpostazioni } from './impostazioni.js';

export const CHIAVE = 'microonde2000:dati';
export const VERSIONE = 1;

// Stato vuoto di partenza.
export function statoIniziale() {
  return {
    versione: VERSIONE,
    impostazioni: unisciImpostazioni(null),
    ingredientiUtente: {},   // id -> ingrediente modificato o nuovo
    ingredientiEliminati: [],
    ricetteUtente: {},       // id -> ricetta modificata o nuova
    ricetteEliminate: [],
    piani: {},               // 'AAAA-MM-GG' (lunedì) -> piano settimanale
    spunte: {}               // 'AAAA-MM-GG' -> { idIngrediente: true }
  };
}

// Normalizza uno stato letto da archivio o da backup.
export function normalizzaStato(grezzo) {
  const base = statoIniziale();
  if (!grezzo || typeof grezzo !== 'object') return base;
  return {
    versione: VERSIONE,
    impostazioni: unisciImpostazioni(grezzo.impostazioni),
    ingredientiUtente: oggetto(grezzo.ingredientiUtente),
    ingredientiEliminati: Array.isArray(grezzo.ingredientiEliminati) ? grezzo.ingredientiEliminati : [],
    ricetteUtente: oggetto(grezzo.ricetteUtente),
    ricetteEliminate: Array.isArray(grezzo.ricetteEliminate) ? grezzo.ricetteEliminate : [],
    piani: oggetto(grezzo.piani),
    spunte: oggetto(grezzo.spunte)
  };
}

function oggetto(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

// Legge lo stato dal telefono (o restituisce lo stato iniziale).
export function caricaStato(memoria = globalThis.localStorage) {
  try {
    const testo = memoria && memoria.getItem(CHIAVE);
    return testo ? normalizzaStato(JSON.parse(testo)) : statoIniziale();
  } catch (e) {
    console.warn('Impossibile leggere i dati salvati:', e);
    return statoIniziale();
  }
}

// Salva lo stato nel telefono. Restituisce true se riuscito.
export function salvaStato(stato, memoria = globalThis.localStorage) {
  try {
    memoria.setItem(CHIAVE, JSON.stringify(stato));
    return true;
  } catch (e) {
    console.warn('Impossibile salvare i dati:', e);
    return false;
  }
}

// Crea il testo del file di backup.
export function creaBackup(stato) {
  return JSON.stringify({ app: 'microonde2000', creato: new Date().toISOString(), dati: stato }, null, 2);
}

// Legge un file di backup. Lancia un errore se il file non è valido.
export function leggiBackup(testo) {
  let obj;
  try {
    obj = JSON.parse(testo);
  } catch {
    throw new Error('Il file non è un JSON valido.');
  }
  if (!obj || obj.app !== 'microonde2000' || !obj.dati) {
    throw new Error('Il file non sembra un backup di Microonde2000.');
  }
  return normalizzaStato(obj.dati);
}
