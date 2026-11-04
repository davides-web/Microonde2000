# Decisioni prese durante lo sviluppo

Dove la richiesta lasciava spazio a interpretazioni, è stata scelta la
soluzione più semplice. Eccole in ordine.

## Struttura e archivio
- **Nessun passaggio di build**: l'app è fatta di file HTML, CSS e JavaScript
  (moduli ES) serviti così come sono da GitHub Pages. I test girano con il
  test runner integrato di Node (`node --test`), senza dipendenze.
- **localStorage** invece di IndexedDB: i dati sono pochi (qualche centinaio
  di kB) e localStorage è più semplice. Tutto lo stato è un unico oggetto JSON
  sotto la chiave `microonde2000:dati`.
- Ingredienti e ricette predefiniti stanno nel codice; nell'archivio si
  salvano solo **le modifiche dell'utente** (sovrascritture per id, aggiunte
  ed eliminazioni). Così un aggiornamento dell'app può aggiungere nuove ricette
  senza cancellare quelle modificate.
- Il backup è un file JSON con `{"app":"microonde2000","dati":{...}}`;
  l'importazione sostituisce tutti i dati (dopo conferma).
- Service worker "prima la rete, poi la cache": online si ricevono gli
  aggiornamenti, offline si usa la copia salvata.

## Impostazioni
- La **tolleranza** (default ±5) si applica così: kcal del giorno entro ±5%
  dell'obiettivo; ciascun macro entro ±5 **punti percentuali** della quota
  prevista (es. proteine tra 25% e 35% delle kcal).
- **Giorno di ricarica** (default sabato): 2400 kcal con P25 / G20 / C55, così
  le proteine in grammi restano circa uguali (150 g) e i carboidrati salgono.
- **Mensa** (default lunedì a pranzo): stima 700 kcal con 30 g di proteine,
  25 g di grassi e 85 g di carboidrati, tutti modificabili. La stima viene
  contata nei totali del giorno e il resto dei pasti la compensa.
- I pasti hanno una **quota indicativa** di kcal (25/35/30/10%) usata solo per
  evitare porzioni squilibrate (es. una colazione da 1000 kcal).
