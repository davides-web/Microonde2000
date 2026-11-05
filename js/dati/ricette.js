// ==========================================================
// Ricettario predefinito: ricette originali da preparare
// SOLO con il microonde (niente fornelli, forno o friggitrice).
//
// Ogni ricetta indica:
// - ingredienti per TUTTA la ricetta (grammi), divisi poi per "porzioni";
//   terzo valore facoltativo = stato in cui si mangia l'ingrediente,
//   usato per l'amido resistente: 'crudo', 'raffreddato' (cotto e tenuto
//   in frigo almeno 12 h), altrimenti 'cotto' (caldo);
// - cottura: elenco [potenza in W, minuti, cosa] (per il meal prep);
// - anticipo: cosa preparare il giorno prima (se serve);
// - frigoGiorni: giorni massimi in frigo dopo la cottura (0 = da
//   mangiare subito);
// - etichette: colazione, pranzo, cena, spuntino, batch, ricarica.
//
// Regole generali di sicurezza (valgono per tutte):
// - contenitori di vetro, ceramica o plastica con simbolo "adatto al
//   microonde"; mai metallo o alluminio;
// - coperchio appoggiato o con valvola aperta (mai ermetico);
// - carne, pollo e uova vanno cotti fino a 75 °C al cuore; pesce finché
//   è opaco e si sfalda;
// - mai cuocere uova intere con il guscio o con il tuorlo integro:
//   bucare sempre il tuorlo.
// ==========================================================

const RISCALDA = 'Riscalda coperto a 800 W per 2-3 min, mescola a metà, finché è ben fumante anche al centro (almeno 75 °C); riposo 1 min.';
const FREDDA = 'Si mangia fredda o appena tiepida: non serve riscaldare. Tienila in frigo fino al momento del pasto.';

// Riso cotto al microonde, poi raffreddato (testo riutilizzato).
const RISO_ANTICIPO = (g, acqua) =>
  `Il giorno prima cuoci il riso: ${g} g di riso sciacquato e ${acqua} ml di acqua in un contenitore capiente (almeno 4 volte il volume) con coperchio appoggiato, 800 W per 5 min, poi 450 W per 10-12 min; riposo coperto 5 min. Allargalo su un piatto, fallo intiepidire al massimo 1 ora e mettilo in frigo (≤ 4 °C) per almeno 12 ore: così si forma amido resistente.`;
const PATATE_ANTICIPO = (g) =>
  `Il giorno prima cuoci ${g} g di patate: lavale, bucale più volte con la forchetta, mettile in un contenitore con 2 cucchiai d'acqua e coperchio appoggiato e cuoci a 800 W per 5 min, girale e continua 3-6 min finché sono tenere. Fai intiepidire e metti in frigo per almeno 12 ore.`;

function crea(r) {
  return {
    porzioni: 1,
    tempo: 10,
    frigoGiorni: 0,
    riscaldamento: RISCALDA,
    anticipo: '',
    ...r,
    ingredienti: r.ingredienti.map(([id, g, uso]) => ({ id, g, uso: uso || 'cotto' })),
    cottura: (r.cottura || []).map(([w, min, cosa]) => ({ w, min, cosa: cosa || '' })),
    predefinita: true
  };
}

export const RICETTE = [
  // ===================== COLAZIONI =====================
  crea({
    id: 'porridge_mirtilli', nome: 'Porridge proteico ai mirtilli e noci', tempo: 6,
    etichette: ['colazione', 'ricarica'],
    contenitore: 'Ciotola di vetro o ceramica da almeno 750 ml (il latte sale).',
    ingredienti: [['avena', 50], ['latte_ps', 200], ['yogurt_greco_0', 150, 'crudo'], ['mirtilli', 80, 'crudo'], ['noci', 12], ['cannella', 1]],
    cottura: [[800, 1.5, 'avena e latte'], [800, 1, 'avena e latte']],
    passi: [
      'Mescola avena e latte nella ciotola capiente.',
      'Cuoci a 800 W per 1 min e 30 s, senza coperchio.',
      'Mescola, poi altri 60 s a 800 W restando vicino: se sale, ferma e mescola.',
      'Riposo 1 minuto: il porridge si addensa.',
      'Aggiungi lo yogurt greco, i mirtilli, le noci spezzettate e la cannella.'
    ]
  }),
  crea({
    id: 'coppa_avena_fecola', nome: 'Coppa fredda di avena, kefir e fecola con salsa di frutti di bosco', tempo: 15,
    etichette: ['colazione'],
    contenitore: 'Tazza adatta al microonde per la frutta; barattolo o ciotola per la coppa.',
    ingredienti: [['avena', 40, 'crudo'], ['kefir', 150], ['yogurt_greco_0', 170], ['fecola', 15, 'crudo'], ['banana_verde', 80, 'crudo'], ['frutti_bosco', 100], ['semi_chia', 10]],
    cottura: [[800, 1, 'frutti di bosco']],
    passi: [
      'Metti i frutti di bosco surgelati nella tazza e scaldali a 800 W per 1 min; mescola: diventano una salsa.',
      'Lascia raffreddare la salsa almeno 10 minuti. La fecola NON va scaldata: sopra i 60 °C perde l\'amido resistente.',
      'Nel barattolo mescola kefir, yogurt, avena cruda, semi di chia e fecola fino a non vedere grumi.',
      'Aggiungi la banana poco matura a rondelle e la salsa ormai fredda.',
      'Puoi prepararla la sera prima e tenerla in frigo chiusa.'
    ],
    frigoGiorni: 1, riscaldamento: FREDDA
  }),
  crea({
    id: 'uova_spinaci_patate', nome: 'Uova strapazzate con spinaci e patate fredde', tempo: 8,
    etichette: ['colazione', 'cena'],
    contenitore: 'Ciotola bassa di vetro o ceramica (circa 18 cm) con coperchio forato.',
    anticipo: PATATE_ANTICIPO(150),
    ingredienti: [['uova', 120], ['spinaci_surgelati', 100], ['patate', 150, 'raffreddato'], ['parmigiano', 10], ['sale_iposodico', 0.5], ['pepe', 0.2]],
    cottura: [[800, 2, 'spinaci'], [600, 1.5, 'uova']],
    passi: [
      'Scalda gli spinaci surgelati coperti a 800 W per 2 min; scola l\'acqua.',
      'Aggiungi le patate fredde tagliate a cubetti.',
      'Sbatti le uova con parmigiano, sale iposodico e pepe e versale sopra.',
      'Cuoci a 600 W per 1 min, mescola con la forchetta portando al centro i bordi, poi altri 30-45 s finché sono rapprese ma morbide.',
      'Riposo 30 s: la cottura finisce col calore residuo.'
    ]
  }),
  crea({
    id: 'mug_cake_cacao', nome: 'Mug cake di avena e cacao con yogurt', tempo: 5,
    etichette: ['colazione', 'spuntino'],
    contenitore: 'Tazza grande da almeno 350 ml.',
    ingredienti: [['avena', 40], ['uova', 60], ['banana', 60], ['cacao', 8], ['latte_ps', 30], ['yogurt_greco_0', 150, 'crudo']],
    cottura: [[800, 1.75, 'mug cake']],
    passi: [
      'Nella tazza schiaccia la banana con la forchetta.',
      'Aggiungi uovo, latte, avena e cacao e mescola bene, anche sul fondo.',
      'Cuoci a 800 W per 1 min e 30 s; se il centro è ancora liquido, altri 15-20 s.',
      'Riposo 1 minuto. Servi con lo yogurt greco a parte.'
    ]
  }),
  crea({
    id: 'frittata_tazza_ricotta', nome: 'Frittata in tazza con ricotta e zucchine', tempo: 7,
    etichette: ['colazione', 'cena'],
    contenitore: 'Tazza larga o ciotolina da 400 ml.',
    ingredienti: [['uova', 120], ['ricotta', 60], ['zucchine', 100], ['parmigiano', 10], ['avena', 25], ['erba_cipollina', 3], ['pepe', 0.2]],
    cottura: [[800, 2, 'zucchine'], [600, 2, 'frittata']],
    passi: [
      'Grattugia le zucchine nella tazza, copri e cuoci a 800 W per 2 min; scola il liquido.',
      'Aggiungi uova, ricotta, parmigiano, avena, erba cipollina e pepe; mescola.',
      'Cuoci a 600 W per 1 min e 30 s, mescola delicatamente i bordi verso il centro, poi altri 30 s finché il centro è rappreso.',
      'Riposo 1 minuto prima di mangiarla.'
    ]
  }),
  crea({
    id: 'mela_cotta_yogurt', nome: 'Mela cotta alla cannella con yogurt greco e avena cruda', tempo: 7,
    etichette: ['colazione', 'spuntino'],
    contenitore: 'Ciotola di ceramica con coperchio.',
    ingredienti: [['mela', 180], ['yogurt_greco_2', 200, 'crudo'], ['avena', 35, 'crudo'], ['noci', 12], ['cannella', 1]],
    cottura: [[800, 3, 'mela']],
    passi: [
      'Taglia la mela a cubetti, mettila nella ciotola con 2 cucchiai d\'acqua e la cannella.',
      'Copri e cuoci a 800 W per 3 min, mescolando a metà.',
      'Riposo 2 min, poi lascia intiepidire.',
      'Versa la mela sullo yogurt e completa con avena cruda e noci.'
    ]
  }),
  crea({
    id: 'budino_chia', nome: 'Budino di chia al latte con frutti di bosco caldi', tempo: 20,
    etichette: ['colazione', 'spuntino'],
    contenitore: 'Barattolo di vetro senza coperchio metallico; tazza per la frutta.',
    ingredienti: [['semi_chia', 25], ['latte_ps', 200], ['yogurt_greco_0', 150, 'crudo'], ['frutti_bosco', 100], ['miele', 5], ['mandorle', 10]],
    cottura: [[800, 0.75, 'latte'], [800, 1, 'frutti di bosco']],
    passi: [
      'Intiepidisci il latte nel barattolo a 800 W per 40-45 s (non deve bollire).',
      'Aggiungi i semi di chia e mescola bene; dopo 5 minuti mescola di nuovo per evitare grumi.',
      'Lascia riposare almeno 15 minuti (o tutta la notte in frigo).',
      'Scalda i frutti di bosco a 800 W per 1 min, aggiungi il miele.',
      'Componi: budino, yogurt greco, frutti di bosco e mandorle spezzettate.'
    ],
    frigoGiorni: 2, riscaldamento: FREDDA
  }),
  crea({
    id: 'porridge_salato', nome: 'Porridge salato con uovo, funghi e parmigiano', tempo: 8,
    etichette: ['colazione', 'pranzo'],
    contenitore: 'Ciotola di vetro da almeno 750 ml con coperchio forato.',
    ingredienti: [['avena', 50], ['funghi', 100], ['spinaci', 50], ['uova', 120], ['parmigiano', 15], ['sale_iposodico', 0.5], ['pepe', 0.2]],
    cottura: [[800, 2, 'funghi'], [800, 2, 'avena'], [600, 1, 'uova']],
    passi: [
      'Affetta i funghi, mettili nella ciotola coperta e cuoci a 800 W per 2 min.',
      'Aggiungi avena e 180 ml di acqua, cuoci a 800 W per 2 min mescolando a metà.',
      'Unisci gli spinaci e mescola: appassiscono col calore.',
      'Fai due incavi, rompi le uova, BUCA i tuorli con uno stuzzicadenti, copri e cuoci a 600 W per 1 min (15-30 s in più se l\'albume è ancora trasparente).',
      'Completa con parmigiano, sale iposodico e pepe.'
    ]
  }),
  crea({
    id: 'pera_ricotta_cacao', nome: 'Pera calda con ricotta, cacao e nocciole', tempo: 6,
    etichette: ['colazione', 'spuntino'],
    contenitore: 'Ciotola di ceramica con coperchio.',
    ingredienti: [['pera', 180], ['ricotta', 100, 'crudo'], ['yogurt_greco_0', 100, 'crudo'], ['cacao', 5], ['nocciole', 12], ['cannella', 0.5]],
    cottura: [[800, 2.5, 'pera']],
    passi: [
      'Taglia la pera a spicchi, mettila nella ciotola con la cannella e 1 cucchiaio d\'acqua.',
      'Copri e cuoci a 800 W per 2 min e 30 s.',
      'Mescola ricotta, yogurt e cacao fino a ottenere una crema.',
      'Servi la crema con la pera calda e le nocciole spezzettate.'
    ]
  }),
  crea({
    id: 'porridge_banana_arachidi', nome: 'Porridge di avena, banana e burro di arachidi', tempo: 6,
    etichette: ['colazione', 'ricarica'],
    contenitore: 'Ciotola di vetro o ceramica da almeno 1 litro.',
    ingredienti: [['avena', 60], ['latte_ps', 250], ['banana', 100], ['burro_arachidi', 15], ['yogurt_greco_0', 120, 'crudo'], ['cannella', 0.5]],
    cottura: [[800, 2, 'avena e latte'], [800, 1, 'avena e latte']],
    passi: [
      'Mescola avena, latte e metà banana schiacciata nella ciotola capiente.',
      'Cuoci a 800 W per 2 min, mescola, poi altri 60 s sorvegliando.',
      'Riposo 1 minuto.',
      'Completa con yogurt greco, il resto della banana a rondelle, burro di arachidi e cannella.'
    ]
  }),
  crea({
    id: 'frittata_patate_batch', nome: 'Frittata di patate e cipolla (3 porzioni)', porzioni: 3, tempo: 15,
    etichette: ['colazione', 'pranzo', 'cena', 'batch'],
    contenitore: 'Pirofila tonda di vetro da 20-22 cm con coperchio o piatto capovolto.',
    anticipo: PATATE_ANTICIPO(450),
    ingredienti: [['uova', 360], ['patate', 450, 'raffreddato'], ['cipolla', 80], ['parmigiano', 30], ['prezzemolo', 10], ['sale_iposodico', 1.5], ['pepe', 0.3]],
    cottura: [[800, 2, 'cipolla'], [600, 6, 'frittata']],
    passi: [
      'Affetta la cipolla sottile, mettila nella pirofila con 1 cucchiaio d\'acqua, copri e cuoci a 800 W per 2 min.',
      'Aggiungi le patate fredde a fette.',
      'Sbatti le uova con parmigiano, prezzemolo, sale iposodico e pepe e versale sulle patate.',
      'Copri e cuoci a 600 W per 3 min; ruota la pirofila di mezzo giro e porta i bordi verso il centro con una spatola.',
      'Continua a 600 W per 2-3 min finché il centro è rappreso (non deve tremolare).',
      'Riposo 2 minuti, poi taglia in 3 spicchi.'
    ],
    frigoGiorni: 3,
    riscaldamento: 'Si può mangiare fredda; oppure riscalda coperta a 600 W per 1 min e 30 s finché è calda al centro.'
  }),

  // ===================== SPUNTINI =====================
  crea({
    id: 'yogurt_fecola_bosco', nome: 'Yogurt greco con fecola e frutti di bosco tiepidi', tempo: 12,
    etichette: ['spuntino', 'colazione'],
    contenitore: 'Tazza adatta al microonde.',
    ingredienti: [['yogurt_greco_0', 170, 'crudo'], ['frutti_bosco', 80], ['fecola', 15, 'crudo'], ['mandorle', 10]],
    cottura: [[800, 1, 'frutti di bosco']],
    passi: [
      'Scalda i frutti di bosco a 800 W per 1 min e lasciali raffreddare almeno 10 minuti.',
      'Mescola la fecola cruda nello yogurt freddo fino a farla sparire.',
      'Aggiungi i frutti di bosco ormai freddi e le mandorle.'
    ],
    riscaldamento: FREDDA
  }),
  crea({
    id: 'edamame_limone', nome: 'Edamame al vapore con limone e peperoncino', tempo: 5,
    etichette: ['spuntino'],
    contenitore: 'Ciotola con coperchio forato.',
    ingredienti: [['edamame', 130], ['limone', 5], ['sale_iposodico', 0.5], ['peperoncino', 0.2]],
    cottura: [[800, 3, 'edamame']],
    passi: [
      'Metti gli edamame surgelati nella ciotola con 2 cucchiai d\'acqua.',
      'Copri e cuoci a 800 W per 3 min, mescolando a metà.',
      'Scola, condisci con limone, sale iposodico e peperoncino.'
    ]
  }),
  crea({
    id: 'ceci_croccanti', nome: 'Ceci croccanti speziati (4 porzioni)', porzioni: 4, tempo: 15,
    etichette: ['spuntino', 'batch'],
    contenitore: 'Piatto piano grande adatto al microonde con un foglio di carta forno.',
    ingredienti: [['ceci_lessati', 480], ['paprika', 3], ['cumino', 2], ['sale_iposodico', 1]],
    cottura: [[800, 4, 'ceci'], [800, 2, 'ceci'], [800, 2, 'ceci']],
    passi: [
      'Sciacqua e scola i ceci, poi asciugali molto bene con carta da cucina (togli le pellicine che si staccano).',
      'Stendili in un solo strato sul piatto con la carta forno.',
      'Cuoci a 800 W per 4 min, mescola, poi continua a intervalli di 2 min mescolando ogni volta (totale 8-10 min) finché sono asciutti.',
      'Condisci con le spezie mentre sono caldi e lasciali raffreddare: diventano croccanti raffreddando.',
      'Conserva in un barattolo chiuso.'
    ],
    frigoGiorni: 3, riscaldamento: 'Si mangiano a temperatura ambiente.'
  }),
  crea({
    id: 'fiocchi_pera_noci', nome: 'Fiocchi di latte con pera calda e noci', tempo: 5,
    etichette: ['spuntino'],
    contenitore: 'Ciotolina di ceramica con coperchio.',
    ingredienti: [['fiocchi_latte', 150, 'crudo'], ['pera', 120], ['noci', 8], ['cannella', 0.5]],
    cottura: [[800, 2, 'pera']],
    passi: [
      'Taglia la pera a cubetti, aggiungi la cannella, copri e cuoci a 800 W per 2 min.',
      'Versa la pera calda sui fiocchi di latte e completa con le noci.'
    ]
  }),
  crea({
    id: 'kefir_banana_mandorle', nome: 'Kefir con banana poco matura, cacao e mandorle tostate', tempo: 5,
    etichette: ['spuntino', 'colazione'],
    contenitore: 'Piattino adatto al microonde per le mandorle; bicchiere o ciotola.',
    ingredienti: [['kefir', 200, 'crudo'], ['banana_verde', 100, 'crudo'], ['cacao', 5], ['mandorle', 12]],
    cottura: [[800, 1, 'mandorle'], [800, 1, 'mandorle']],
    passi: [
      'Stendi le mandorle sul piattino e tostale a 800 W per 1 min, mescola, poi altri 30-60 s (attenzione: bruciano all\'interno senza cambiare colore fuori).',
      'Lasciale raffreddare e spezzettale.',
      'Mescola il cacao nel kefir, aggiungi la banana a rondelle e le mandorle.'
    ]
  }),
  crea({
    id: 'uovo_cocotte_spinaci', nome: 'Uova in cocotte con spinaci e parmigiano', tempo: 5,
    etichette: ['spuntino', 'colazione'],
    contenitore: 'Cocotte o tazza larga di ceramica.',
    ingredienti: [['uova', 120], ['spinaci', 80], ['parmigiano', 5], ['pepe', 0.2]],
    cottura: [[800, 1, 'spinaci'], [600, 1.25, 'uova']],
    passi: [
      'Metti gli spinaci nella cocotte con 1 cucchiaio d\'acqua, copri e cuoci a 800 W per 1 min.',
      'Rompi sopra le uova e BUCA i tuorli in 2-3 punti con uno stuzzicadenti.',
      'Copri e cuoci a 600 W per 1 min; se l\'albume è ancora trasparente, altri 15-20 s.',
      'Completa con parmigiano e pepe; riposo 30 s.'
    ]
  }),
  crea({
    id: 'skyr_mela_semi', nome: 'Skyr con composta di mela tiepida, fecola e semi di zucca', tempo: 12,
    etichette: ['spuntino', 'colazione'],
    contenitore: 'Ciotolina di ceramica con coperchio.',
    ingredienti: [['skyr', 170, 'crudo'], ['mela', 120], ['fecola', 10, 'crudo'], ['semi_zucca', 10], ['cannella', 0.5]],
    cottura: [[800, 2, 'mela']],
    passi: [
      'Taglia la mela a cubetti, aggiungi cannella e 1 cucchiaio d\'acqua, copri e cuoci a 800 W per 2 min.',
      'Schiacciala con la forchetta e lasciala raffreddare almeno 10 minuti.',
      'Mescola la fecola cruda nello skyr freddo, aggiungi la composta fredda e i semi di zucca.'
    ],
    riscaldamento: FREDDA
  }),
  crea({
    id: 'crema_ceci_verdure', nome: 'Crema di ceci schiacciati con bastoncini di verdura', tempo: 8,
    etichette: ['spuntino'],
    contenitore: 'Ciotola con coperchio.',
    ingredienti: [['ceci_lessati', 100], ['tahina', 10], ['limone', 10], ['aglio', 2], ['cumino', 0.5], ['carote', 100, 'crudo'], ['sedano', 60, 'crudo'], ['sale_iposodico', 0.3]],
    cottura: [[800, 1.5, 'ceci']],
    passi: [
      'Metti i ceci sciacquati nella ciotola con 2 cucchiai d\'acqua e l\'aglio, copri e scalda a 800 W per 1 min e 30 s: si ammorbidiscono.',
      'Schiacciali con la forchetta insieme a tahina, limone, cumino e sale iposodico, aggiungendo un goccio d\'acqua se serve.',
      'Servi con carote e sedano a bastoncini.'
    ],
    frigoGiorni: 2, riscaldamento: FREDDA
  }),

  crea({
    id: 'mela_datteri_yogurt', nome: 'Mela calda con datteri, cannella e yogurt greco', tempo: 5,
    etichette: ['spuntino', 'colazione', 'ricarica'],
    contenitore: 'Ciotolina di ceramica con coperchio.',
    ingredienti: [['mela', 150], ['datteri', 20], ['yogurt_greco_0', 120, 'crudo'], ['cannella', 0.5]],
    cottura: [[800, 2.5, 'mela e datteri']],
    passi: [
      'Taglia la mela a cubetti e i datteri a pezzetti, aggiungi la cannella e 1 cucchiaio d\'acqua.',
      'Copri e cuoci a 800 W per 2 min e 30 s, mescolando a metà.',
      'Riposo 1 min, poi servi sullo yogurt greco.'
    ]
  }),

  // ===================== PRANZI E CENE =====================
  crea({
    id: 'chili_tacchino', nome: 'Chili di tacchino e borlotti con riso (3 porzioni)', porzioni: 3, tempo: 30,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da 3 litri con coperchio appoggiato.',
    anticipo: RISO_ANTICIPO(150, 300),
    ingredienti: [['macinato_tacchino', 450], ['borlotti', 480, 'raffreddato'], ['passata', 400], ['cipolla', 100], ['peperoni', 200], ['aglio', 5], ['cumino', 3], ['paprika', 4], ['sale_iposodico', 2], ['mozzarella', 90], ['riso_basmati', 150, 'raffreddato']],
    cottura: [[800, 4, 'cipolla e peperoni'], [800, 5, 'macinato'], [800, 8, 'chili']],
    passi: [
      'Trita cipolla, aglio e peperoni, mettili nella ciotola con 3 cucchiai d\'acqua, copri e cuoci a 800 W per 4 min.',
      'Aggiungi il macinato sgranato con la forchetta, copri e cuoci a 800 W per 5 min, mescolando a metà e rompendo i grumi.',
      'Unisci passata, borlotti sciacquati, spezie e sale iposodico; copri e cuoci a 800 W per 8 min mescolando ogni 4 min.',
      'Controlla che la carne non sia più rosata (75 °C). Riposo 3 min.',
      'Dividi chili e riso freddo in 3 contenitori; aggiungi la mozzarella a cubetti al momento di riscaldare.'
    ],
    frigoGiorni: 2
  }),
  crea({
    id: 'pollo_curry_riso', nome: 'Pollo al curry e cocco con piselli e riso (3 porzioni)', porzioni: 3, tempo: 25,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da 2,5 litri con coperchio appoggiato.',
    anticipo: RISO_ANTICIPO(180, 360),
    ingredienti: [['petto_pollo', 450], ['latte_cocco', 180], ['passata', 200], ['piselli', 200], ['cipolla', 80], ['zenzero', 5], ['curry', 8], ['curcuma', 2], ['sale_iposodico', 1.5], ['riso_basmati', 180, 'raffreddato']],
    cottura: [[800, 3, 'cipolla'], [800, 6, 'pollo'], [800, 4, 'curry']],
    passi: [
      'Trita cipolla e zenzero, mettili nella ciotola con 2 cucchiai d\'acqua, copri e cuoci a 800 W per 3 min.',
      'Aggiungi il pollo a bocconcini, curry e curcuma; mescola, copri e cuoci a 800 W per 6 min mescolando a metà.',
      'Unisci latte di cocco, passata, piselli surgelati e sale iposodico; copri e cuoci a 800 W per 4 min.',
      'Taglia il pezzo più grosso di pollo: deve essere bianco all\'interno (75 °C). Riposo 2 min.',
      'Dividi con il riso freddo in 3 contenitori.'
    ],
    frigoGiorni: 2
  }),
  crea({
    id: 'salmone_patate_fagiolini', nome: 'Salmone al limone con patate fredde e fagiolini (2 porzioni)', porzioni: 2, tempo: 15,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Pirofila rettangolare di vetro con coperchio; ciotola con coperchio per i fagiolini.',
    anticipo: PATATE_ANTICIPO(400),
    ingredienti: [['salmone', 260], ['patate', 400, 'raffreddato'], ['fagiolini', 300], ['limone', 20], ['prezzemolo', 10], ['sale_iposodico', 1]],
    cottura: [[800, 5, 'fagiolini'], [600, 4, 'salmone']],
    passi: [
      'Cuoci i fagiolini surgelati con 3 cucchiai d\'acqua, coperti, a 800 W per 5 min mescolando a metà.',
      'Metti il salmone nella pirofila con limone, prezzemolo e sale iposodico; la parte più spessa verso l\'esterno.',
      'Copri e cuoci a 600 W per 3-4 min: è pronto quando è opaco e si sfalda con la forchetta.',
      'Riposo 1 min. Servi con le patate fredde a fette (o scaldate 1 min) e i fagiolini.'
    ],
    frigoGiorni: 2
  }),
  crea({
    id: 'merluzzo_couscous', nome: 'Merluzzo con pomodorini, zucchine e couscous integrale', tempo: 15,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Pirofila di vetro con coperchio; tazza grande per l\'acqua; ciotola per il couscous.',
    ingredienti: [['merluzzo', 200], ['pomodorini', 150], ['zucchine', 150], ['couscous_integrale', 70], ['mandorle', 25], ['limone', 10], ['origano', 0.5], ['sale_iposodico', 0.5]],
    cottura: [[800, 1.5, 'acqua'], [800, 3, 'verdure'], [600, 5, 'merluzzo']],
    passi: [
      'Scalda 100 ml di acqua a 800 W per 1 min e 30 s, versala sul couscous, copri e lascia gonfiare 5 min; sgrana con la forchetta.',
      'Nella pirofila metti zucchine a rondelle e pomodorini tagliati, copri e cuoci a 800 W per 3 min.',
      'Appoggia sopra il merluzzo (anche surgelato), condisci con limone, origano e sale iposodico.',
      'Copri e cuoci a 600 W per 4-5 min (6-7 se surgelato) finché è opaco e si sfalda.',
      'Riposo 2 min; servi con il couscous e le mandorle a lamelle.'
    ]
  }),
  crea({
    id: 'dal_lenticchie', nome: 'Dal di lenticchie rosse e spinaci con yogurt (3 porzioni)', porzioni: 3, tempo: 30,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da almeno 3 litri (le lenticchie fanno schiuma) con coperchio appoggiato.',
    ingredienti: [['lenticchie_rosse', 240, 'raffreddato'], ['passata', 300], ['cipolla', 100], ['aglio', 5], ['zenzero', 10], ['curry', 6], ['curcuma', 3], ['spinaci_surgelati', 300], ['latte_cocco', 150], ['anacardi', 30], ['sale_iposodico', 2], ['yogurt_greco_2', 300, 'crudo']],
    cottura: [[800, 3, 'cipolla'], [800, 10, 'lenticchie'], [800, 8, 'dal']],
    passi: [
      'Trita cipolla, aglio e zenzero, copri e cuoci con 2 cucchiai d\'acqua a 800 W per 3 min.',
      'Aggiungi le lenticchie sciacquate, le spezie e 700 ml di acqua; copri e cuoci a 800 W per 10 min.',
      'Mescola, aggiungi passata, spinaci surgelati e latte di cocco; cuoci a 800 W per 6-8 min mescolando ogni 3 min, finché le lenticchie si sfaldano.',
      'Riposo 5 min: si addensa. Sala con sale iposodico.',
      'Dividi in 3 contenitori; al momento di mangiare aggiungi 100 g di yogurt e gli anacardi.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'polpette_manzo_sugo', nome: 'Polpette di manzo e ricotta al pomodoro con patate (3 porzioni)', porzioni: 3, tempo: 30,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Pirofila tonda di vetro da 24 cm con coperchio.',
    anticipo: PATATE_ANTICIPO(450),
    ingredienti: [['macinato_manzo', 450], ['ricotta', 90], ['avena', 45], ['uova', 60], ['parmigiano', 45], ['polpa_pomodoro', 500], ['basilico', 5], ['aglio', 3], ['sale_iposodico', 1.5], ['patate', 450, 'raffreddato']],
    cottura: [[800, 5, 'polpette'], [800, 5, 'polpette e sugo'], [600, 3, 'polpette e sugo']],
    passi: [
      'Impasta macinato, ricotta, avena, uovo, parmigiano, aglio tritato e sale iposodico; forma 12 polpette.',
      'Disponile in cerchio nella pirofila lasciando vuoto il centro (cuociono in modo più uniforme).',
      'Copri e cuoci a 800 W per 5 min; girale.',
      'Aggiungi la polpa di pomodoro e il basilico, copri e cuoci a 800 W per 5 min, poi 600 W per 3 min.',
      'Controlla che l\'interno non sia rosato (75 °C). Riposo 3 min. Dividi con le patate fredde in 3 contenitori.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'orzotto_funghi', nome: 'Orzotto con funghi, piselli, pollo e noci (3 porzioni)', porzioni: 3, tempo: 45,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da 3 litri con coperchio appoggiato.',
    ingredienti: [['orzo_perlato', 210, 'raffreddato'], ['funghi', 400], ['piselli', 300], ['cipolla', 80], ['sovracosce_pollo', 360], ['parmigiano', 60], ['noci', 30], ['rosmarino', 2], ['sale_iposodico', 1.5]],
    cottura: [[800, 10, 'orzo'], [450, 15, 'orzo'], [800, 6, 'pollo e funghi'], [800, 3, 'orzotto']],
    passi: [
      'Metti l\'orzo sciacquato con 650 ml di acqua nella ciotola, copri e cuoci a 800 W per 10 min, poi a 450 W per 15 min mescolando ogni 5 min. Riposo 5 min e scola l\'acqua eventualmente rimasta.',
      'In un altro contenitore cuoci cipolla tritata, funghi a fette e pollo a pezzetti, coperti, a 800 W per 6 min mescolando a metà.',
      'Unisci orzo, piselli surgelati, rosmarino e sale iposodico; cuoci a 800 W per 3 min.',
      'Controlla che il pollo sia cotto (75 °C). Completa con parmigiano e noci spezzettate.',
      'Dividi in 3 contenitori: riposando in frigo l\'orzo forma amido resistente.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'insalata_farro_pollo', nome: 'Insalata di farro, ceci, pollo e feta (3 porzioni)', porzioni: 3, tempo: 35,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da 3 litri con coperchio; pirofila con coperchio per il pollo.',
    ingredienti: [['farro_perlato', 180, 'raffreddato'], ['ceci_lessati', 240, 'crudo'], ['petto_pollo', 300], ['cetriolo', 200, 'crudo'], ['pomodorini', 300, 'crudo'], ['cipolla_rossa', 60], ['feta', 120], ['semi_girasole', 30], ['menta', 5], ['limone', 30], ['origano', 1], ['sale_iposodico', 1]],
    cottura: [[800, 8, 'farro'], [450, 12, 'farro'], [600, 7, 'pollo']],
    passi: [
      'Cuoci il farro sciacquato con 540 ml di acqua, coperto, a 800 W per 8 min e poi a 450 W per 12 min, mescolando ogni 5 min. Scola e allarga su un piatto.',
      'Cuoci il pollo a fette con il succo di mezzo limone, coperto, a 600 W per 6-7 min girandolo a metà (75 °C al cuore). Taglialo a cubetti.',
      'Cuoci la cipolla rossa a fettine con un cucchiaio di aceto o limone a 800 W per 1 min (diventa più delicata).',
      'Unisci farro, ceci sciacquati, pollo, cetriolo e pomodorini a pezzi, cipolla, feta, semi, menta, origano, limone e sale iposodico.',
      'Dividi in 3 contenitori e metti in frigo: è più buona il giorno dopo.'
    ],
    frigoGiorni: 3, riscaldamento: FREDDA
  }),
  crea({
    id: 'pasta_tonno_mozzarella', nome: 'Pasta integrale al tonno, pomodoro e mozzarella', tempo: 15,
    etichette: ['pranzo', 'cena', 'ricarica'],
    contenitore: 'Ciotola di vetro alta da almeno 1,5 litri (la pasta fa schiuma).',
    ingredienti: [['pasta_integrale', 80], ['tonno_naturale', 100], ['polpa_pomodoro', 200], ['cipolla', 30], ['mozzarella', 60], ['origano', 0.5], ['prezzemolo', 5]],
    cottura: [[800, 12, 'pasta'], [800, 2, 'sugo']],
    passi: [
      'Metti la pasta nella ciotola e coprila con 400 ml di acqua (deve stare 2 dita sopra).',
      'Cuoci senza coperchio a 800 W per il tempo indicato sulla confezione più 3 minuti, mescolando ogni 4 min; aggiungi acqua calda se si asciuga troppo.',
      'Scola, aggiungi polpa di pomodoro, cipolla tritata finissima e origano; cuoci a 800 W per 2 min.',
      'Unisci tonno sgocciolato, mozzarella a cubetti e prezzemolo; mescola e lascia riposare 1 min.'
    ]
  }),
  crea({
    id: 'pasta_lenticchie_broccoli', nome: 'Pasta di lenticchie con broccoli, ricotta e noci', tempo: 15,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Ciotola di vetro alta da almeno 1,5 litri.',
    ingredienti: [['pasta_lenticchie', 80], ['broccoli', 200], ['ricotta', 100], ['parmigiano', 15], ['noci', 10], ['aglio', 2], ['peperoncino', 0.2]],
    cottura: [[800, 6, 'pasta'], [800, 4, 'pasta e broccoli']],
    passi: [
      'Metti la pasta di lenticchie nella ciotola con 400 ml di acqua e l\'aglio; cuoci senza coperchio a 800 W per 6 min mescolando a metà.',
      'Aggiungi le cimette di broccoli, mescola e cuoci a 800 W per altri 4 min (attenzione alla schiuma).',
      'Scola tenendo 2 cucchiai di acqua di cottura; mescola con ricotta e parmigiano fino a fare una crema.',
      'Completa con noci e peperoncino.'
    ]
  }),
  crea({
    id: 'patata_ripiena_sgombro', nome: 'Patata ripiena con sgombro, yogurt e mais', tempo: 12,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Piatto adatto al microonde con coperchio a campana.',
    ingredienti: [['patate', 300], ['sgombro_naturale', 100], ['yogurt_intero', 100, 'crudo'], ['mais', 50], ['parmigiano', 15], ['erba_cipollina', 3], ['sale_iposodico', 0.3]],
    cottura: [[800, 4, 'patata'], [800, 4, 'patata'], [800, 1, 'ripieno']],
    passi: [
      'Lava la patata e bucala 6-8 volte con la forchetta.',
      'Cuoci sul piatto coperto a 800 W per 4 min, girala e continua 3-4 min finché uno stecchino entra facilmente.',
      'Riposo 2 min. Tagliala a metà e schiaccia leggermente la polpa.',
      'Mescola sgombro, mais e parmigiano, distribuiscili sulla patata e scalda a 800 W per 1 min.',
      'Completa con yogurt, erba cipollina e sale iposodico.'
    ]
  }),
  crea({
    id: 'uova_purgatorio_ceci', nome: 'Uova in purgatorio con ceci e basilico', tempo: 12,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Pirofila tonda e bassa di vetro (circa 18 cm) con coperchio.',
    ingredienti: [['uova', 120], ['polpa_pomodoro', 250], ['ceci_lessati', 120], ['cipolla', 40], ['paprika', 1], ['basilico', 3], ['parmigiano', 10], ['sale_iposodico', 0.3]],
    cottura: [[800, 2, 'cipolla'], [800, 3, 'sugo e ceci'], [600, 1.5, 'uova']],
    passi: [
      'Cuoci la cipolla tritata con 1 cucchiaio d\'acqua, coperta, a 800 W per 2 min.',
      'Aggiungi polpa di pomodoro, ceci, paprika e sale iposodico; copri e cuoci a 800 W per 3 min.',
      'Fai due incavi nel sugo, rompi le uova e BUCA i tuorli con uno stuzzicadenti.',
      'Copri e cuoci a 600 W per 1 min e 30 s; se l\'albume è ancora trasparente, altri 20-30 s.',
      'Completa con basilico e parmigiano.'
    ]
  }),
  crea({
    id: 'tacchino_patate_dolci', nome: 'Tacchino alla paprika con patate dolci e broccoli (2 porzioni)', porzioni: 2, tempo: 25,
    etichette: ['pranzo', 'cena', 'batch', 'ricarica'],
    contenitore: 'Due pirofile di vetro con coperchio.',
    ingredienti: [['petto_tacchino', 300], ['patate_dolci', 400, 'raffreddato'], ['broccoli', 400], ['semi_zucca', 40], ['parmigiano', 20], ['paprika', 2], ['rosmarino', 2], ['limone', 15], ['sale_iposodico', 1]],
    cottura: [[800, 8, 'patate dolci'], [800, 5, 'broccoli'], [600, 7, 'tacchino']],
    passi: [
      'Taglia le patate dolci a cubetti, coprile e cuocile con 2 cucchiai d\'acqua a 800 W per 7-8 min mescolando a metà; falle raffreddare e mettile in frigo (meglio la sera prima).',
      'Cuoci i broccoli a cimette con 3 cucchiai d\'acqua, coperti, a 800 W per 5 min.',
      'Condisci il tacchino a fette con paprika, rosmarino, limone e sale iposodico; copri e cuoci a 600 W per 6-7 min girandolo a metà (75 °C al cuore).',
      'Dividi in 2 contenitori; completa con semi di zucca e parmigiano.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'gamberi_quinoa', nome: 'Gamberi e zucchine all\'aglio con quinoa e anacardi', tempo: 20,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Ciotola con coperchio per la quinoa; pirofila con coperchio per i gamberi.',
    ingredienti: [['gamberi', 180], ['zucchine', 200], ['quinoa', 70], ['anacardi', 25], ['aglio', 3], ['limone', 15], ['prezzemolo', 5], ['peperoncino', 0.2]],
    cottura: [[800, 4, 'quinoa'], [450, 6, 'quinoa'], [800, 3, 'zucchine'], [600, 3, 'gamberi']],
    passi: [
      'Sciacqua bene la quinoa, mettila con 150 ml di acqua nella ciotola coperta: 800 W per 4 min, poi 450 W per 6 min. Riposo coperta 5 min.',
      'Nella pirofila cuoci zucchine a cubetti e aglio, coperti, a 800 W per 3 min.',
      'Aggiungi i gamberi (scongelati e scolati), copri e cuoci a 600 W per 2-3 min mescolando a metà: sono pronti quando sono rosa e opachi.',
      'Unisci quinoa, limone, prezzemolo, peperoncino e anacardi.'
    ]
  }),
  crea({
    id: 'bowl_messicana', nome: 'Bowl di pollo, fagioli neri, mais e riso (3 porzioni)', porzioni: 3, tempo: 25,
    etichette: ['pranzo', 'cena', 'batch', 'ricarica'],
    contenitore: 'Pirofila di vetro con coperchio; 3 contenitori per le porzioni.',
    anticipo: RISO_ANTICIPO(150, 300),
    ingredienti: [['sovracosce_pollo', 400], ['fagioli_neri', 240, 'raffreddato'], ['mais', 140], ['riso_basmati', 150, 'raffreddato'], ['peperoni', 200], ['pomodori', 200, 'crudo'], ['cipolla_rossa', 60], ['feta', 90], ['yogurt_greco_2', 150, 'crudo'], ['limone', 30], ['cumino', 2], ['paprika', 2], ['coriandolo', 5], ['sale_iposodico', 1]],
    cottura: [[800, 3, 'peperoni e cipolla'], [600, 8, 'pollo'], [800, 2, 'fagioli e mais']],
    passi: [
      'Cuoci peperoni e cipolla a strisce, coperti, con 2 cucchiai d\'acqua a 800 W per 3 min; tieni da parte.',
      'Condisci il pollo a striscioline con cumino, paprika e sale iposodico; copri e cuoci a 600 W per 7-8 min mescolando a metà (75 °C al cuore).',
      'Scalda fagioli sciacquati e mais a 800 W per 2 min.',
      'Componi 3 contenitori: riso freddo, pollo, verdure, fagioli e mais.',
      'Al momento di mangiare aggiungi pomodori a cubetti, feta, coriandolo, limone e yogurt come salsa.'
    ],
    frigoGiorni: 2
  }),
  crea({
    id: 'spezzatino_manzo', nome: 'Spezzatino di manzo con patate, carote e piselli (3 porzioni)', porzioni: 3, tempo: 40,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da 3 litri con coperchio appoggiato.',
    ingredienti: [['manzo_magro', 450], ['patate', 450, 'raffreddato'], ['carote', 200], ['cipolla', 100], ['passata', 200], ['piselli', 150], ['parmigiano', 30], ['noci', 30], ['rosmarino', 2], ['sale_iposodico', 1.5]],
    cottura: [[800, 4, 'cipolla e carote'], [800, 6, 'manzo'], [450, 15, 'spezzatino']],
    passi: [
      'Cuoci cipolla tritata e carote a rondelle con 3 cucchiai d\'acqua, coperte, a 800 W per 4 min.',
      'Aggiungi il manzo a bocconcini piccoli (2 cm), copri e cuoci a 800 W per 6 min mescolando a metà.',
      'Unisci patate a cubetti, passata, 100 ml di acqua, rosmarino e sale iposodico; copri e cuoci a 450 W per 15 min mescolando ogni 5 min (la bassa potenza rende la carne tenera).',
      'Aggiungi i piselli negli ultimi 5 minuti. Riposo 5 min.',
      'Dividi in 3 contenitori; al momento di servire completa con parmigiano e noci.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'minestrone_pollo', nome: 'Minestrone con cannellini, orzo e pollo (3 porzioni)', porzioni: 3, tempo: 40,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da almeno 3 litri con coperchio appoggiato.',
    ingredienti: [['minestrone', 600], ['cannellini', 240, 'raffreddato'], ['orzo_perlato', 120, 'raffreddato'], ['passata', 150], ['petto_pollo', 300], ['parmigiano', 60], ['semi_zucca', 30], ['rosmarino', 2], ['sale_iposodico', 1.5]],
    cottura: [[800, 10, 'orzo e minestrone'], [450, 12, 'minestrone'], [800, 6, 'pollo']],
    passi: [
      'Metti orzo sciacquato, minestrone surgelato, passata e 900 ml di acqua nella ciotola; copri e cuoci a 800 W per 10 min.',
      'Mescola e continua a 450 W per 12 min mescolando ogni 4 min.',
      'Aggiungi il pollo a cubetti piccoli e i cannellini, copri e cuoci a 800 W per 6 min (75 °C al cuore).',
      'Sala con sale iposodico, aggiungi il rosmarino. Riposo 5 min.',
      'Dividi in 3 contenitori; completa ogni porzione con parmigiano e semi di zucca.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'zuppa_ceci_uovo', nome: 'Zuppa di ceci e spinaci con uovo in camicia', tempo: 12,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Ciotola fonda di ceramica con coperchio.',
    ingredienti: [['ceci_lessati', 150], ['spinaci_surgelati', 150], ['passata', 100], ['uova', 120], ['parmigiano', 15], ['aglio', 2], ['cumino', 0.5], ['sale_iposodico', 0.3]],
    cottura: [[800, 4, 'zuppa'], [600, 1.5, 'uova']],
    passi: [
      'Metti ceci, spinaci surgelati, passata, aglio, cumino e 150 ml di acqua nella ciotola; copri e cuoci a 800 W per 4 min mescolando a metà.',
      'Schiaccia una parte dei ceci con la forchetta per rendere la zuppa cremosa.',
      'Rompi le uova nella zuppa calda, BUCA i tuorli, copri e cuoci a 600 W per 1 min e 30 s (20-30 s in più se serve).',
      'Completa con parmigiano e sale iposodico.'
    ]
  }),
  crea({
    id: 'tofu_verdure_riso', nome: 'Tofu e verdure allo zenzero con riso integrale', tempo: 25,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Ciotola capiente con coperchio per il riso; pirofila con coperchio.',
    ingredienti: [['tofu', 180], ['broccoli_surgelati', 150], ['carote', 80], ['peperoni', 100], ['riso_integrale', 60], ['zenzero', 5], ['aglio', 3], ['semi_sesamo', 10], ['aceto_mele', 10], ['sale_iposodico', 0.5]],
    cottura: [[800, 5, 'riso'], [450, 15, 'riso'], [800, 5, 'verdure'], [800, 2, 'tofu']],
    passi: [
      'Cuoci il riso integrale con 180 ml di acqua in una ciotola capiente coperta: 800 W per 5 min, poi 450 W per 15 min. Riposo coperto 5 min.',
      'Nella pirofila cuoci broccoli, carote a bastoncini e peperoni a strisce con zenzero e aglio tritati e 2 cucchiai d\'acqua, coperti, a 800 W per 5 min.',
      'Aggiungi il tofu a cubetti, l\'aceto e il sale iposodico; scalda a 800 W per 2 min.',
      'Servi sul riso con i semi di sesamo.'
    ]
  }),
  crea({
    id: 'trota_couscous', nome: 'Trota al limone con couscous, zucchine e pomodorini', tempo: 15,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Pirofila di vetro con coperchio; ciotola per il couscous.',
    ingredienti: [['trota', 200], ['couscous_integrale', 60], ['zucchine', 150], ['pomodorini', 100], ['mandorle', 10], ['limone', 15], ['prezzemolo', 5], ['sale_iposodico', 0.5]],
    cottura: [[800, 1.5, 'acqua'], [800, 3, 'verdure'], [600, 4, 'trota']],
    passi: [
      'Scalda 90 ml di acqua a 800 W per 1 min e 30 s, versala sul couscous, copri e lascia gonfiare 5 min.',
      'Cuoci zucchine e pomodorini a pezzi nella pirofila coperta a 800 W per 3 min.',
      'Appoggia la trota sopra con limone, prezzemolo e sale iposodico; copri e cuoci a 600 W per 3-4 min finché è opaca.',
      'Servi con il couscous sgranato e le mandorle tritate.'
    ]
  }),
  crea({
    id: 'curry_cavolfiore_tofu', nome: 'Curry di cavolfiore, ceci e tofu con yogurt (2 porzioni)', porzioni: 2, tempo: 25,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro da 2,5 litri con coperchio appoggiato.',
    ingredienti: [['cavolfiore', 500], ['ceci_lessati', 240, 'raffreddato'], ['tofu', 300], ['passata', 200], ['latte_cocco', 60], ['cipolla', 80], ['curry', 6], ['zenzero', 5], ['sale_iposodico', 1], ['yogurt_greco_2', 200, 'crudo']],
    cottura: [[800, 3, 'cipolla'], [800, 7, 'cavolfiore'], [800, 4, 'curry']],
    passi: [
      'Cuoci cipolla e zenzero tritati con 2 cucchiai d\'acqua, coperti, a 800 W per 3 min.',
      'Aggiungi il cavolfiore a cimette piccole e il curry con 4 cucchiai d\'acqua; copri e cuoci a 800 W per 7 min mescolando a metà.',
      'Unisci ceci sciacquati, tofu a cubetti, passata, latte di cocco e sale iposodico; copri e cuoci a 800 W per 4 min.',
      'Riposo 3 min. Dividi in 2 contenitori; servi con 100 g di yogurt a porzione.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'sgombro_cannellini', nome: 'Insalata tiepida di sgombro, cannellini e cipolla rossa', tempo: 6,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Ciotola adatta al microonde.',
    ingredienti: [['sgombro_naturale', 125], ['cannellini', 160, 'crudo'], ['cipolla_rossa', 50], ['pomodorini', 150, 'crudo'], ['rucola', 40, 'crudo'], ['semi_zucca', 10], ['aceto_mele', 10], ['origano', 0.5]],
    cottura: [[800, 1, 'cipolla']],
    passi: [
      'Affetta la cipolla rossa, mettila nella ciotola con l\'aceto, copri e cuoci a 800 W per 1 min: diventa dolce.',
      'Aggiungi cannellini sciacquati, pomodorini, sgombro sgocciolato, rucola, origano e semi di zucca; mescola.'
    ],
    frigoGiorni: 1, riscaldamento: FREDDA
  }),
  crea({
    id: 'burger_lenticchie', nome: 'Burger di lenticchie e avena con salsa allo yogurt (2 porzioni)', porzioni: 2, tempo: 15,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Piatto piano adatto al microonde con carta forno; coperchio a campana.',
    ingredienti: [['lenticchie_lessate', 300, 'raffreddato'], ['avena', 60], ['uova', 60], ['parmigiano', 30], ['cipolla', 50], ['cumino', 1], ['sale_iposodico', 0.8], ['yogurt_greco_2', 150, 'crudo'], ['lattuga', 80, 'crudo'], ['pomodori', 150, 'crudo'], ['semi_girasole', 20]],
    cottura: [[800, 1.5, 'cipolla'], [800, 3, 'burger'], [800, 2, 'burger']],
    passi: [
      'Cuoci la cipolla tritata, coperta, a 800 W per 1 min e 30 s.',
      'Schiaccia le lenticchie scolate con la forchetta e impastale con avena, uovo, parmigiano, cipolla, cumino e sale iposodico; lascia riposare 10 min (l\'avena assorbe l\'umidità).',
      'Forma 4 burger e mettili sul piatto con la carta forno.',
      'Copri e cuoci a 800 W per 3 min, girali delicatamente e continua 2 min.',
      'Servi con lattuga, pomodori, semi di girasole e yogurt come salsa.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'tempeh_saraceno', nome: 'Tempeh all\'aceto balsamico con grano saraceno e broccoli', tempo: 20,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Ciotola con coperchio per il grano saraceno; pirofila con coperchio.',
    ingredienti: [['tempeh', 120], ['grano_saraceno', 60], ['broccoli', 200], ['aceto_balsamico', 10], ['zenzero', 3], ['semi_sesamo', 5], ['sale_iposodico', 0.3]],
    cottura: [[800, 3, 'grano saraceno'], [450, 5, 'grano saraceno'], [800, 4, 'broccoli'], [800, 2, 'tempeh']],
    passi: [
      'Cuoci il grano saraceno sciacquato con 130 ml di acqua, coperto, a 800 W per 3 min e a 450 W per 5 min. Riposo 5 min.',
      'Cuoci i broccoli a cimette con 3 cucchiai d\'acqua, coperti, a 800 W per 4 min.',
      'Taglia il tempeh a fettine, condiscilo con aceto balsamico e zenzero e scaldalo a 800 W per 2 min.',
      'Componi il piatto e completa con sesamo e sale iposodico.'
    ]
  }),
  crea({
    id: 'pollo_bulgur_feta', nome: 'Pollo, bulgur e verdure con feta e menta (3 porzioni)', porzioni: 3, tempo: 30,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Ciotola di vetro con coperchio; pirofila con coperchio.',
    ingredienti: [['petto_pollo', 450], ['bulgur', 180, 'raffreddato'], ['zucchine', 300], ['peperoni', 300], ['cipolla_rossa', 80], ['feta', 90], ['semi_girasole', 30], ['menta', 5], ['limone', 30], ['sale_iposodico', 1.5]],
    cottura: [[800, 6, 'bulgur'], [800, 5, 'verdure'], [600, 8, 'pollo']],
    passi: [
      'Metti il bulgur con 400 ml di acqua nella ciotola coperta e cuoci a 800 W per 5-6 min; riposo coperto 10 min, poi sgrana.',
      'Cuoci zucchine, peperoni e cipolla a pezzi, coperti, a 800 W per 5 min.',
      'Cuoci il pollo a strisce con il limone, coperto, a 600 W per 7-8 min mescolando a metà (75 °C al cuore).',
      'Unisci tutto con la menta e il sale iposodico e dividi in 3 contenitori.',
      'Al momento di mangiare aggiungi feta sbriciolata e semi di girasole.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'chili_fagioli_tofu', nome: 'Chili di fagioli neri, patate dolci e tofu (3 porzioni)', porzioni: 3, tempo: 30,
    etichette: ['pranzo', 'cena', 'batch', 'ricarica'],
    contenitore: 'Ciotola di vetro da 3 litri con coperchio appoggiato.',
    ingredienti: [['fagioli_neri', 480, 'raffreddato'], ['patate_dolci', 450, 'raffreddato'], ['tofu', 300], ['polpa_pomodoro', 400], ['cipolla', 100], ['peperoni', 200], ['cumino', 3], ['paprika', 3], ['sale_iposodico', 1.5], ['yogurt_greco_0', 300, 'crudo']],
    cottura: [[800, 4, 'cipolla e peperoni'], [800, 8, 'patate dolci'], [800, 6, 'chili']],
    passi: [
      'Cuoci cipolla e peperoni tritati con 3 cucchiai d\'acqua, coperti, a 800 W per 4 min.',
      'Aggiungi le patate dolci a cubetti piccoli e 100 ml di acqua; copri e cuoci a 800 W per 8 min mescolando a metà.',
      'Unisci fagioli sciacquati, tofu sbriciolato, polpa di pomodoro, spezie e sale iposodico; copri e cuoci a 800 W per 6 min mescolando a metà.',
      'Riposo 3 min. Dividi in 3 contenitori; servi con 100 g di yogurt a porzione.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'insalata_riso_tonno', nome: 'Insalata di riso con tonno, uova e verdure (2 porzioni)', porzioni: 2, tempo: 25,
    etichette: ['pranzo', 'cena', 'batch', 'ricarica'],
    contenitore: 'Ciotola capiente con coperchio per il riso; tazzine per le uova.',
    anticipo: RISO_ANTICIPO(140, 280),
    ingredienti: [['riso_parboiled', 140, 'raffreddato'], ['tonno_naturale', 160], ['uova', 120], ['piselli', 150], ['carote', 100], ['mais', 80], ['cetriolo', 100, 'crudo'], ['mozzarella', 80], ['prezzemolo', 5], ['limone', 20]],
    cottura: [[800, 4, 'piselli e carote'], [600, 1.5, 'uova']],
    passi: [
      'Cuoci piselli surgelati e carote a cubetti con 2 cucchiai d\'acqua, coperti, a 800 W per 4 min; fai raffreddare.',
      'Rompi ogni uovo in una tazzina unta di yogurt o bagnata, BUCA il tuorlo, copri e cuoci a 600 W per 1 min e 30 s finché è sodo; fai raffreddare e taglia a pezzi.',
      'Unisci riso freddo, tonno, uova, verdure, mais, cetriolo, mozzarella a cubetti, prezzemolo e limone.',
      'Dividi in 2 contenitori e tieni in frigo.'
    ],
    frigoGiorni: 2, riscaldamento: FREDDA
  }),
  crea({
    id: 'merluzzo_piselli_patate', nome: 'Merluzzo in umido con piselli e patate fredde', tempo: 15,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Pirofila di vetro con coperchio.',
    anticipo: PATATE_ANTICIPO(200),
    ingredienti: [['merluzzo', 200], ['piselli', 120], ['patate', 200, 'raffreddato'], ['polpa_pomodoro', 150], ['cipolla', 40], ['parmigiano', 15], ['mandorle', 15], ['prezzemolo', 5], ['sale_iposodico', 0.5]],
    cottura: [[800, 2, 'cipolla'], [800, 3, 'sugo e piselli'], [600, 5, 'merluzzo']],
    passi: [
      'Cuoci la cipolla tritata con 1 cucchiaio d\'acqua, coperta, a 800 W per 2 min.',
      'Aggiungi polpa di pomodoro e piselli, copri e cuoci a 800 W per 3 min.',
      'Appoggia il merluzzo nel sugo con le patate fredde a cubetti intorno; copri e cuoci a 600 W per 4-5 min finché il pesce si sfalda.',
      'Completa con prezzemolo, parmigiano e mandorle tritate.'
    ]
  }),
  crea({
    id: 'maiale_mele_verza', nome: 'Filetto di maiale con mele, verza e patate fredde (2 porzioni)', porzioni: 2, tempo: 25,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Pirofila rettangolare di vetro con coperchio.',
    anticipo: PATATE_ANTICIPO(400),
    ingredienti: [['filetto_maiale', 320], ['mela', 180], ['verza', 400], ['patate', 400, 'raffreddato'], ['nocciole', 30], ['parmigiano', 20], ['rosmarino', 2], ['aceto_mele', 15], ['sale_iposodico', 1]],
    cottura: [[800, 6, 'verza e mela'], [600, 8, 'maiale']],
    passi: [
      'Affetta verza e mela, mettile nella pirofila con aceto e rosmarino, copri e cuoci a 800 W per 6 min mescolando a metà.',
      'Taglia il filetto a medaglioni spessi 2 cm, appoggiali sopra le verdure, sala con sale iposodico.',
      'Copri e cuoci a 600 W per 4 min, gira i medaglioni e continua 3-4 min (al cuore almeno 70-75 °C).',
      'Riposo 3 min. Dividi con le patate fredde in 2 contenitori; completa con nocciole tritate e parmigiano.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'orata_finocchi_farro', nome: 'Orata al vapore con finocchi, arance e farro freddo', tempo: 20,
    etichette: ['pranzo', 'cena'],
    contenitore: 'Pirofila di vetro con coperchio.',
    anticipo: 'Il giorno prima cuoci 60 g di farro perlato con 180 ml di acqua, coperto, a 800 W per 5 min e a 450 W per 12 min; scola e conserva in frigo.',
    ingredienti: [['orata', 200], ['finocchio', 200], ['arancia', 120, 'crudo'], ['farro_perlato', 60, 'raffreddato'], ['pistacchi', 15], ['limone', 10], ['sale_iposodico', 0.3]],
    cottura: [[800, 4, 'finocchio'], [600, 4, 'orata']],
    passi: [
      'Taglia il finocchio a spicchi sottili, mettilo nella pirofila con 2 cucchiai d\'acqua, copri e cuoci a 800 W per 4 min.',
      'Appoggia sopra i filetti di orata con limone e sale iposodico; copri e cuoci a 600 W per 3-4 min finché la carne è opaca.',
      'Servi con il farro freddo, l\'arancia a spicchi e i pistacchi tritati.'
    ]
  }),
  crea({
    id: 'polenta_ceci_verdure', nome: 'Farinata morbida di ceci con verdure e ricotta (2 porzioni)', porzioni: 2, tempo: 20,
    etichette: ['pranzo', 'cena', 'batch'],
    contenitore: 'Pirofila tonda di vetro da 20 cm con coperchio.',
    ingredienti: [['farina_ceci', 120], ['zucchine', 200], ['peperoni', 150], ['cipolla', 60], ['uova', 120], ['ricotta', 150], ['parmigiano', 20], ['rosmarino', 2], ['sale_iposodico', 1]],
    cottura: [[800, 4, 'verdure'], [600, 6, 'farinata']],
    passi: [
      'Mescola la farina di ceci con 250 ml di acqua fredda, frustando bene, e lascia riposare 15 min.',
      'Cuoci zucchine, peperoni e cipolla a cubetti nella pirofila coperta a 800 W per 4 min.',
      'Aggiungi alla pastella uova, parmigiano, rosmarino e sale iposodico; versala sulle verdure.',
      'Copri e cuoci a 600 W per 3 min, ruota la pirofila e continua 2-3 min finché il centro è sodo.',
      'Riposo 3 min; servi a spicchi con la ricotta.'
    ],
    frigoGiorni: 3
  }),
  crea({
    id: 'cozze_pomodoro_pasta', nome: 'Pasta integrale con cozze, pomodorini e prezzemolo', tempo: 18,
    etichette: ['pranzo', 'cena', 'ricarica'],
    contenitore: 'Ciotola di vetro alta da almeno 1,5 litri; pirofila con coperchio.',
    ingredienti: [['pasta_integrale', 80], ['cozze', 200], ['pomodorini', 200], ['aglio', 3], ['prezzemolo', 8], ['peperoncino', 0.2], ['semi_canapa', 15], ['parmigiano', 10]],
    cottura: [[800, 12, 'pasta'], [800, 4, 'cozze e pomodorini']],
    passi: [
      'Cuoci la pasta con 400 ml di acqua, senza coperchio, a 800 W per il tempo della confezione più 3 min, mescolando ogni 4 min; scola.',
      'Nella pirofila metti pomodorini tagliati, aglio e cozze surgelate; copri e cuoci a 800 W per 4 min mescolando a metà.',
      'Unisci la pasta, il prezzemolo, il peperoncino, i semi di canapa e il parmigiano.'
    ]
  }),
  crea({
    id: 'pasta_pomodoro_ricotta', nome: 'Pasta integrale al pomodoro, basilico e ricotta', tempo: 15,
    etichette: ['pranzo', 'cena', 'ricarica'],
    contenitore: 'Ciotola di vetro alta da almeno 1,5 litri (la pasta fa schiuma).',
    ingredienti: [['pasta_integrale', 100], ['passata', 200], ['ricotta', 80], ['parmigiano', 10], ['basilico', 5], ['aglio', 2]],
    cottura: [[800, 13, 'pasta'], [800, 2, 'sugo']],
    passi: [
      'Copri la pasta con 450 ml di acqua nella ciotola alta.',
      'Cuoci senza coperchio a 800 W per il tempo della confezione più 3 minuti, mescolando ogni 4 min; aggiungi acqua calda se si asciuga troppo.',
      'Scola, aggiungi passata e aglio tritato e cuoci a 800 W per 2 min.',
      'Completa con ricotta, parmigiano e basilico; mescola e lascia riposare 1 min.'
    ]
  }),
  crea({
    id: 'patate_dolci_ricotta', nome: 'Patata dolce ripiena di ricotta, spinaci e uovo', tempo: 15,
    etichette: ['pranzo', 'cena', 'ricarica'],
    contenitore: 'Piatto con coperchio a campana; ciotolina.',
    ingredienti: [['patate_dolci', 300], ['ricotta', 100], ['spinaci', 80], ['uova', 60], ['parmigiano', 10], ['semi_zucca', 10], ['noce_moscata', 0.2], ['sale_iposodico', 0.3]],
    cottura: [[800, 7, 'patata dolce'], [800, 1, 'spinaci'], [600, 1, 'uovo']],
    passi: [
      'Buca la patata dolce con la forchetta e cuocila coperta a 800 W per 4 min; girala e continua 3 min finché è tenera.',
      'Appassisci gli spinaci coperti a 800 W per 1 min; mescolali con ricotta, parmigiano, noce moscata e sale iposodico.',
      'Rompi l\'uovo in una tazzina, BUCA il tuorlo, copri e cuoci a 600 W per 45-60 s.',
      'Apri la patata, farciscila con la crema di ricotta, appoggia l\'uovo e i semi di zucca.'
    ]
  })
];
