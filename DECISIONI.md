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

## Tabella ingredienti
- 175 ingredienti, di cui alcuni **volutamente esclusi** (pane, albume,
  avocado, würstel, prosciutto cotto, proteine in polvere, dado, farina 00,
  olio di semi, sale da cucina, olio EVO): servono perché, se l'utente li usa
  in una propria ricetta, l'app la segnala e il generatore la scarta.
- I **carboidrati** sono quelli *disponibili* (senza fibre), come nelle
  etichette europee e in CREA; per i dati USDA è stata sottratta la fibra.
- L'**amido resistente** ha tre stime per ingrediente: crudo, cotto e mangiato
  caldo, cotto e raffreddato in frigo (≥12 h). In ogni ricetta, ogni
  ingrediente indica in quale stato viene mangiato.
- Pesi: cereali e legumi secchi a peso **crudo**, legumi in barattolo a peso
  **sgocciolato**. Così la lista della spesa coincide con le ricette.
- La **confezione tipica** (grammi) è un campo dell'ingrediente: 0 significa
  "a peso" (frutta e verdura sfuse), arrotondato ai 50 g superiori.
- Per ogni ingrediente c'è anche il **nome inglese** usato da USDA, utile per
  trovare la voce giusta su Cronometer.
- Il sale iposodico è considerato 50% cloruro di sodio e 50% cloruro di
  potassio (composizione tipica in commercio).
