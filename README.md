# Microonde2000 – Pasti della settimana cucinati solo al microonde

App per il telefono (Android) che prepara il **piano dei pasti della
settimana** per chi cucina **solo con il microonde**: ricette, piano con
calorie e macronutrienti, lista della spesa, meal prep ed elenco degli
ingredienti da registrare su Cronometer.

> **Strumento di pianificazione, non sostituisce il parere di un medico o di
> un dietista.**

- Funziona **anche senza internet**, una volta aperta la prima volta.
- **Nessun dato esce dal telefono**: niente account, niente server, niente
  statistiche. Tutto resta nella memoria del browser del telefono.
- Si può fare un **backup** in un file e ricaricarlo quando serve.

---

## 1. Pubblicare l'app con GitHub Pages (una volta sola)

1. Apri il repository su GitHub dal computer (o dal browser del telefono in
   modalità "sito desktop").
2. Vai su **Settings** (Impostazioni) → nella colonna a sinistra **Pages**.
3. In **Build and deployment** → **Source** scegli **Deploy from a branch**.
4. In **Branch** scegli **main** e la cartella **/ (root)**, poi **Save**.
5. Aspetta uno o due minuti e ricarica la pagina: in alto comparirà
   l'indirizzo dell'app, del tipo
   `https://NOME-UTENTE.github.io/Microonde2000/`.

Ogni volta che il ramo `main` viene aggiornato, l'app pubblicata si aggiorna
da sola (sul telefono basta aprirla con internet attivo; a volte serve
chiuderla e riaprirla due volte).

## 2. Installare l'app sul telefono Android

1. Apri l'indirizzo dell'app con **Chrome**.
2. Tocca il menu **⋮** in alto a destra → **Installa app** (oppure
   **Aggiungi a schermata Home**).
3. Conferma: l'icona verde con il microonde comparirà tra le app.
4. Aprila una volta con internet attivo: da quel momento funziona anche
   offline.

## 3. Come si usa

Le schede in alto sono:

| Scheda | A cosa serve |
|---|---|
| **Piano** | Genera il piano della settimana. Per ogni pasto puoi cambiare le porzioni (− / +), **bloccarlo** 🔒, **sostituirlo** con un'altra ricetta, rigenerare un giorno o tutta la settimana (i pasti bloccati restano). Le barre sono verdi se il giorno rispetta gli obiettivi, rosse se no. |
| **Spesa** | Lista della settimana divisa per reparto, con confezioni arrotondate. Spunta ciò che hai preso, **Copia testo** per incollarlo nella spesa online, **Stampa** per averla su carta. |
| **Meal prep** | Cosa cucinare e quando, giorno per giorno: cotture per più pasti, cose da preparare la sera prima, tempi al microonde, quanto si conservano in frigo e come riscaldarle in sicurezza. |
| **Cronometer** | Per ogni giorno gli ingredienti in grammi da registrare. Tocca **Copia** e incolla dove ti serve. |
| **Ricette** | Il ricettario (oltre 50 ricette al microonde). Puoi filtrare, aprire, modificare, duplicare e creare ricette. |
| **Ingredienti** | La tabella con i valori per 100 g. Puoi correggerli e aggiungerne. |
| **Impostazioni** | Obiettivi, giorno di ricarica, amido resistente, esclusioni, mensa, pasti della giornata, backup. |

Con le frecce **‹ ›** in alto si passa da una settimana all'altra.

## 4. Modificare le impostazioni

Vai su **Impostazioni**. Ogni modifica si salva subito. Valori di partenza:

- **2000 kcal** al giorno, proteine 30%, grassi 30%, carboidrati 40%,
  tolleranza **±5%** (calorie ±5%, ogni macro ±5 punti percentuali).
- **Giorno di ricarica**: sabato, 2400 kcal con più carboidrati (25/20/55).
- **Amido resistente**: 40 g al giorno; se le ricette non bastano, il piano
  aggiunge fecola di patate **cruda** (fino a 40 g) da sciogliere in acqua o
  yogurt freddi.
- **Esclusioni**: niente pane, niente albume da solo, niente avocado, niente
  ultraprocessati, niente farine raffinate, niente oli vegetali aggiunti,
  olio extravergine **non** consentito (c'è un interruttore a parte), sale
  solo iposodico.
- **Mensa**: lunedì a pranzo, stima 700 kcal (modificabile).
- **Pasti**: colazione, pranzo, cena e uno spuntino. Puoi aggiungere spuntini
  o togliere pasti e cambiare la quota di calorie di ciascuno.
- **Varietà**: la stessa ricetta al massimo 3 volte a settimana;
  preferenza per il batch cooking.

Dopo aver cambiato gli obiettivi, torna su **Piano** e tocca **Rigenera**.

## 5. Modificare o aggiungere ricette

1. Vai su **Ricette** e tocca una ricetta → **Modifica** (o **+ Nuova**, o
   **Duplica** per partire da una esistente).
2. Inserisci nome, porzioni, tempo, etichette (colazione, pranzo, cena,
   spuntino, batch, ricarica).
3. Aggiungi gli ingredienti con i **grammi per tutta la ricetta** e lo stato
   in cui si mangiano: *cotto*, *cotto e raffreddato* (in frigo almeno 12
   ore: più amido resistente) o *crudo*.
4. Scrivi i passaggi, uno per riga, con potenza e tempi. Nel campo "Tempi al
   microonde" scrivi una riga per cottura, ad esempio `800 W 4 min verdure`.
5. **Salva**. I valori nutrizionali si calcolano da soli. Se usi un
   ingrediente escluso, la ricetta viene segnalata e il piano non la userà.

Le ricette predefinite modificate si possono riportare all'originale con
**Ripristina originale**.

Per gli **ingredienti**: scheda **Ingredienti** → tocca una riga per
modificarla, oppure **+ Nuovo**. La **confezione** (in grammi) serve per
arrotondare la lista della spesa: metti 0 per i prodotti sfusi.

## 6. Backup (importante)

I dati stanno **solo nel browser del telefono**: se cancelli i dati di
Chrome o cambi telefono, si perdono. Ogni tanto:

1. **Impostazioni** → **Esporta backup (JSON)**: viene scaricato un file
   `microonde2000-backup-AAAA-MM-GG.json` nella cartella Download.
2. Salvalo dove vuoi (Google Drive, email a te stesso…).
3. Per ripristinarlo: **Impostazioni** → **Importa backup** → scegli il file.
   I dati attuali vengono sostituiti da quelli del backup.

## 7. Per chi vuole guardare il codice

- Nessuna libreria esterna, nessun passaggio di compilazione: HTML, CSS e
  JavaScript (moduli) nella cartella `js/`, commentati in italiano.
- Dati predefiniti: `js/dati/ingredienti.js` e `js/dati/ricette.js`.
- Logica: `nutrizione.js` (calcoli), `esclusioni.js`, `generatore.js` (piano),
  `spesa.js`, `mealprep.js`, `cronometer.js`; interfaccia in `js/ui/`.
- Test automatici (serve Node.js 20 o successivo): `npm test`. Vengono
  eseguiti anche da GitHub a ogni modifica (scheda **Actions**).
- Provare in locale: `python3 -m http.server` nella cartella del progetto e
  aprire `http://localhost:8000`.
- Quando si pubblica una nuova versione conviene cambiare `VERSIONE` in
  `sw.js`, così i telefoni scaricano subito i file nuovi.

Vedi anche [DECISIONI.md](DECISIONI.md) (scelte fatte durante lo sviluppo) e
[DA_VERIFICARE.md](DA_VERIFICARE.md) (cosa controllare prima di fidarsi dei
numeri).
