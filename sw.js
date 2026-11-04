// ==========================================================
// Service worker: rende l'app utilizzabile offline.
// Tutti i file dell'app vengono messi in cache alla prima visita.
// Quando si pubblica una nuova versione, cambiare VERSIONE.
// ==========================================================
const VERSIONE = 'microonde2000-v1';
const FILE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/stile.css',
  './icone/icona.svg',
  './icone/icona-192.png',
  './icone/icona-512.png',
  './icone/icona-maskable-512.png',
  './js/app.js',
  './js/archivio.js',
  './js/impostazioni.js',
  './js/catalogo.js',
  './js/nutrizione.js',
  './js/esclusioni.js',
  './js/generatore.js',
  './js/spesa.js',
  './js/mealprep.js',
  './js/cronometer.js',
  './js/formato.js',
  './js/settimana.js',
  './js/ui/settimana-ui.js',
  './js/dati/ingredienti.js',
  './js/dati/ricette.js',
  './js/ui/dom.js',
  './js/ui/vista-impostazioni.js',
  './js/ui/vista-ingredienti.js',
  './js/ui/vista-ricette.js',
  './js/ui/vista-piano.js',
  './js/ui/vista-spesa.js',
  './js/ui/vista-mealprep.js',
  './js/ui/vista-cronometer.js'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSIONE)
      // allSettled: un file mancante non blocca l'installazione
      .then((cache) => Promise.allSettled(FILE.map((f) => cache.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((chiavi) => Promise.all(chiavi.filter((k) => k !== VERSIONE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Strategia: prima la rete (per avere gli aggiornamenti), se manca la rete usa la cache.
self.addEventListener('fetch', (evento) => {
  const richiesta = evento.request;
  if (richiesta.method !== 'GET' || new URL(richiesta.url).origin !== self.location.origin) return;
  evento.respondWith(
    fetch(richiesta)
      .then((risposta) => {
        const copia = risposta.clone();
        caches.open(VERSIONE).then((cache) => cache.put(richiesta, copia));
        return risposta;
      })
      .catch(() => caches.match(richiesta, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
  );
});
