// ==========================================================
// Tabella ingredienti predefinita: valori per 100 g di parte edibile.
//
// IMPORTANTE: i valori sono stati trascritti da tabelle pubbliche
// (USDA FoodData Central – SR Legacy, oppure CREA – Tabelle di
// composizione degli alimenti) e vanno VERIFICATI: vedi DA_VERIFICARE.md.
//
// Convenzioni:
// - "carbo" = carboidrati DISPONIBILI (fibre escluse), come in CREA e
//   nelle etichette europee. Per i dati USDA si è sottratta la fibra.
// - sodio e potassio in mg.
// - Amido resistente (AR, g per 100 g di peso come indicato nel nome):
//     arCrudo  = mangiato crudo / così com'è
//     arCotto  = cotto e mangiato caldo
//     arRaff   = cotto, raffreddato in frigo almeno 12 ore (anche se poi
//                riscaldato brevemente)
//   Sono STIME indicative tratte dalla letteratura: variano molto.
// - Pesi: cereali, pasta e legumi secchi a peso CRUDO; legumi in
//   barattolo a peso SGOCCIOLATO.
// - conf = grammi della confezione tipica (0 = si compra a peso).
// - categorie = usate dalle esclusioni (pane, albume, avocado,
//   ultraprocessato, farina_raffinata, olio_vegetale, olio_evo, sale).
// ==========================================================

// Reparti del supermercato (ordine usato nella lista della spesa).
export const REPARTI = [
  'Frutta e verdura',
  'Carne e pesce',
  'Frigo (latticini, uova, tofu)',
  'Surgelati',
  'Dispensa (cereali, legumi, conserve)',
  'Frutta secca e semi',
  'Spezie e condimenti'
];
const [FV, CP, FR, SU, DI, SE, SP] = REPARTI;

export const FONTI = {
  USDA: 'USDA FoodData Central (SR Legacy)',
  CREA: 'CREA – Tabelle di composizione degli alimenti (2019)',
  ETI: 'Stima da etichette commerciali (non USDA/CREA)'
};

// Colonne: id, nome, nome inglese (per cercarlo su Cronometer), reparto,
// kcal, proteine, grassi, carboidrati, fibre, sodio, potassio,
// AR crudo, AR cotto, AR raffreddato, fonte, confezione (g), extra
const RIGHE = [
  // ---------- Cereali, pseudocereali e tuberi ----------
  ['riso_basmati', 'Riso basmati (crudo)', 'Rice, white, long-grain, raw', DI, 365, 7.1, 0.7, 78.7, 1.3, 5, 115, 1.5, 1.5, 4, 'USDA', 1000],
  ['riso_integrale', 'Riso integrale (crudo)', 'Rice, brown, long-grain, raw', DI, 367, 7.5, 3.2, 72.6, 3.6, 7, 223, 1.5, 1.5, 4, 'USDA', 1000],
  ['riso_parboiled', 'Riso parboiled (crudo)', 'Rice, white, parboiled, raw', DI, 374, 7.5, 1.0, 79.1, 1.8, 2, 92, 2.5, 2.5, 5, 'USDA', 1000],
  ['pasta_integrale', 'Pasta integrale (cruda)', 'Pasta, whole-wheat, dry', DI, 348, 14.6, 1.4, 67.0, 8.0, 8, 215, 1.5, 1.5, 3, 'USDA', 500],
  ['pasta_lenticchie', 'Pasta di lenticchie rosse 100% (cruda)', 'Red lentil pasta, dry', DI, 335, 24.0, 2.0, 46.0, 8.0, 5, 700, 2, 2, 3, 'ETI', 250],
  ['orzo_perlato', 'Orzo perlato (crudo)', 'Barley, pearled, raw', DI, 352, 9.9, 1.2, 62.1, 15.6, 9, 280, 2, 2, 3.5, 'USDA', 500],
  ['farro_perlato', 'Farro perlato (crudo)', 'Spelt, uncooked', DI, 335, 15.1, 2.5, 67.1, 6.8, 18, 440, 1.5, 1.5, 3, 'CREA', 500],
  ['quinoa', 'Quinoa (cruda)', 'Quinoa, uncooked', DI, 368, 14.1, 6.1, 57.2, 7.0, 5, 563, 0.5, 0.5, 0.8, 'USDA', 500],
  ['avena', 'Fiocchi d\'avena integrali', 'Oats, rolled, dry', DI, 379, 13.2, 6.5, 57.6, 10.1, 6, 362, 7, 1, 2.5, 'USDA', 500],
  ['crusca_avena', 'Crusca d\'avena', 'Oat bran, raw', DI, 246, 17.3, 7.0, 50.8, 15.4, 4, 566, 3, 0.5, 1, 'USDA', 500],
  ['fecola', 'Fecola di patate', 'Potato starch', DI, 333, 0.1, 0.1, 83.1, 0, 55, 15, 65, 1, 3, 'USDA', 250],
  ['couscous_integrale', 'Couscous integrale (crudo)', 'Couscous, whole wheat, dry', DI, 350, 12.5, 2.0, 63.0, 9.0, 10, 300, 0.8, 0.8, 1.5, 'ETI', 500],
  ['bulgur', 'Bulgur (crudo)', 'Bulgur, dry', DI, 342, 12.3, 1.3, 63.4, 12.5, 17, 410, 1, 1, 2, 'USDA', 500],
  ['grano_saraceno', 'Grano saraceno (crudo)', 'Buckwheat groats, roasted, dry', DI, 346, 11.7, 2.7, 64.6, 10.3, 11, 320, 1.5, 1.5, 2.5, 'USDA', 500],
  ['miglio', 'Miglio decorticato (crudo)', 'Millet, raw', DI, 378, 11.0, 4.2, 64.4, 8.5, 5, 195, 0.5, 0.5, 1, 'USDA', 500],
  ['patate', 'Patate (crude, con buccia)', 'Potatoes, flesh and skin, raw', FV, 77, 2.0, 0.1, 15.4, 2.1, 6, 425, 15, 1, 3.5, 'USDA', 1500, { pezzo: 200 }],
  ['patate_dolci', 'Patate dolci (crude)', 'Sweet potato, raw', FV, 86, 1.6, 0.1, 17.1, 3.0, 55, 337, 5, 1, 2, 'USDA', 0],
  ['mais', 'Mais dolce (in barattolo, sgocciolato)', 'Corn, sweet, yellow, canned, drained', DI, 86, 3.3, 1.4, 16.3, 2.7, 15, 270, 1, 1, 1.5, 'USDA', 140],

  // ---------- Legumi ----------
  ['lenticchie_rosse', 'Lenticchie rosse decorticate (secche)', 'Lentils, pink or red, raw', DI, 358, 24.0, 2.2, 52.2, 10.8, 7, 578, 3.5, 3.5, 5, 'USDA', 500],
  ['lenticchie_lessate', 'Lenticchie lessate (barattolo, sgocciolate)', 'Lentils, mature seeds, cooked, boiled, without salt', DI, 116, 9.0, 0.4, 12.2, 7.9, 2, 369, 3, 2.5, 3.5, 'USDA', 240],
  ['ceci_lessati', 'Ceci lessati (barattolo, sgocciolati)', 'Chickpeas, mature seeds, cooked, boiled, without salt', DI, 164, 8.9, 2.6, 19.8, 7.6, 7, 291, 3, 2.5, 3.5, 'USDA', 240],
  ['cannellini', 'Fagioli cannellini lessati (barattolo, sgocciolati)', 'Beans, white, mature seeds, cooked, boiled, without salt', DI, 139, 9.7, 0.4, 18.8, 6.3, 6, 561, 3.5, 3, 4.5, 'USDA', 240],
  ['borlotti', 'Fagioli borlotti lessati (barattolo, sgocciolati)', 'Beans, cranberry (roman), cooked, boiled, without salt', DI, 136, 9.3, 0.5, 15.9, 8.6, 1, 387, 3.5, 3, 4.5, 'USDA', 240],
  ['fagioli_neri', 'Fagioli neri lessati (barattolo, sgocciolati)', 'Beans, black, mature seeds, cooked, boiled, without salt', DI, 132, 8.9, 0.5, 15.0, 8.7, 1, 355, 3.5, 3, 4.5, 'USDA', 240],
  ['farina_ceci', 'Farina di ceci', 'Chickpea flour (besan)', DI, 387, 22.4, 6.7, 47.0, 10.8, 64, 846, 1, 1, 1.5, 'USDA', 500],
  ['piselli', 'Piselli surgelati', 'Peas, green, frozen, unprepared', SU, 77, 5.2, 0.4, 9.1, 4.5, 108, 153, 1, 1, 1.5, 'USDA', 450],
  ['edamame', 'Edamame sgusciati surgelati', 'Edamame, frozen, unprepared', SU, 121, 11.9, 5.2, 3.7, 5.2, 6, 436, 0, 0, 0, 'USDA', 400],
  ['fave', 'Fave surgelate', 'Broadbeans (fava beans), immature seeds, raw', SU, 72, 5.6, 0.6, 7.5, 4.2, 50, 250, 1, 1, 1.5, 'USDA', 450],
  ['tofu', 'Tofu compatto', 'Tofu, firm, prepared with calcium sulfate', FR, 144, 17.3, 8.7, 0.5, 2.3, 14, 237, 0, 0, 0, 'USDA', 250],
  ['tempeh', 'Tempeh', 'Tempeh', FR, 192, 20.3, 10.8, 7.6, 0, 9, 412, 0, 0, 0, 'USDA', 200],

  // ---------- Carne e pesce ----------
  ['petto_pollo', 'Petto di pollo (crudo)', 'Chicken, broilers or fryers, breast, meat only, raw', CP, 120, 22.5, 2.6, 0, 0, 45, 370, 0, 0, 0, 'USDA', 500],
  ['sovracosce_pollo', 'Sovracosce di pollo senza pelle (crude)', 'Chicken, thigh, meat only, raw', CP, 121, 19.7, 4.1, 0, 0, 95, 242, 0, 0, 0, 'USDA', 500],
  ['petto_tacchino', 'Fesa/petto di tacchino (crudo)', 'Turkey, breast, meat only, raw', CP, 107, 24.0, 1.2, 0, 0, 46, 333, 0, 0, 0, 'CREA', 400],
  ['macinato_tacchino', 'Macinato di tacchino (crudo)', 'Turkey, ground, raw', CP, 148, 19.7, 8.3, 0, 0, 58, 235, 0, 0, 0, 'USDA', 400],
  ['macinato_manzo', 'Macinato di manzo magro 5% (crudo)', 'Beef, ground, 95% lean meat / 5% fat, raw', CP, 137, 21.4, 5.0, 0, 0, 66, 343, 0, 0, 0, 'USDA', 400],
  ['manzo_magro', 'Manzo magro a straccetti/bocconcini (crudo)', 'Beef, round, top round, lean, raw', CP, 125, 22.0, 4.0, 0, 0, 55, 350, 0, 0, 0, 'USDA', 400],
  ['filetto_maiale', 'Filetto di maiale (crudo)', 'Pork, fresh, tenderloin, raw', CP, 109, 20.9, 2.2, 0, 0, 53, 399, 0, 0, 0, 'USDA', 400],
  ['salmone', 'Salmone (filetto crudo)', 'Fish, salmon, Atlantic, farmed, raw', CP, 208, 20.4, 13.4, 0, 0, 59, 363, 0, 0, 0, 'USDA', 250],
  ['trota', 'Trota (filetto crudo)', 'Fish, trout, rainbow, farmed, raw', CP, 141, 20.8, 6.2, 0, 0, 51, 361, 0, 0, 0, 'USDA', 250],
  ['merluzzo', 'Merluzzo (filetti surgelati)', 'Fish, cod, Atlantic, raw', SU, 82, 17.8, 0.7, 0, 0, 54, 413, 0, 0, 0, 'USDA', 400],
  ['nasello', 'Nasello (filetti surgelati)', 'Hake, raw', SU, 71, 17.0, 0.3, 0, 0, 101, 294, 0, 0, 0, 'CREA', 400],
  ['orata', 'Orata (filetti)', 'Gilthead seabream, raw', CP, 121, 19.7, 3.8, 0, 0, 69, 380, 0, 0, 0, 'CREA', 300],
  ['tonno_fresco', 'Tonno fresco (trancio)', 'Fish, tuna, fresh, yellowfin, raw', CP, 109, 24.4, 0.5, 0, 0, 45, 441, 0, 0, 0, 'USDA', 250],
  ['tonno_naturale', 'Tonno al naturale (sgocciolato)', 'Fish, tuna, light, canned in water, drained', DI, 103, 23.4, 0.9, 0, 0, 320, 230, 0, 0, 0, 'CREA', 240],
  ['sgombro_naturale', 'Sgombro al naturale (sgocciolato)', 'Fish, mackerel, canned, drained solids', DI, 156, 23.2, 6.3, 0, 0, 379, 194, 0, 0, 0, 'USDA', 250],
  ['gamberi', 'Gamberi sgusciati surgelati', 'Crustaceans, shrimp, raw', SU, 85, 20.1, 0.5, 0, 0, 400, 170, 0, 0, 0, 'USDA', 400],
  ['cozze', 'Cozze sgusciate surgelate', 'Mollusks, mussel, blue, raw', SU, 86, 11.9, 2.2, 3.7, 0, 286, 320, 0, 0, 0, 'USDA', 400],
  ['wurstel', 'Würstel', 'Frankfurter', CP, 270, 12.0, 24.0, 3.0, 0, 1000, 200, 0, 0, 0, 'CREA', 250, { categorie: ['ultraprocessato'] }],
  ['prosciutto_cotto', 'Prosciutto cotto', 'Ham, sliced, cooked', CP, 132, 19.8, 5.6, 0.9, 0, 900, 280, 0, 0, 0, 'CREA', 100, { categorie: ['ultraprocessato'] }],

  // ---------- Uova e latticini ----------
  ['uova', 'Uova intere', 'Egg, whole, raw, fresh', FR, 143, 12.6, 9.5, 0.7, 0, 142, 138, 0, 0, 0, 'USDA', 360, { pezzo: 60, confNome: 'confezione da 6', nota: 'Solo uova BIOLOGICHE (codice che inizia con 0)' }],
  ['albume', 'Albume d\'uovo', 'Egg, white, raw, fresh', FR, 52, 10.9, 0.2, 0.7, 0, 166, 163, 0, 0, 0, 'USDA', 500, { categorie: ['albume'] }],
  ['yogurt_greco_0', 'Yogurt greco 0% bianco', 'Yogurt, Greek, plain, nonfat', FR, 59, 10.3, 0.4, 3.6, 0, 36, 141, 0, 0, 0, 'USDA', 500],
  ['yogurt_greco_2', 'Yogurt greco 2% bianco', 'Yogurt, Greek, plain, lowfat', FR, 73, 10.0, 1.9, 3.9, 0, 34, 141, 0, 0, 0, 'USDA', 500],
  ['yogurt_intero', 'Yogurt bianco intero', 'Yogurt, plain, whole milk', FR, 61, 3.5, 3.3, 4.7, 0, 46, 155, 0, 0, 0, 'USDA', 500],
  ['skyr', 'Skyr bianco', 'Skyr, plain', FR, 63, 11.0, 0.2, 4.0, 0, 50, 150, 0, 0, 0, 'ETI', 450],
  ['kefir', 'Kefir bianco', 'Kefir, lowfat, plain', FR, 41, 3.8, 1.0, 4.5, 0, 40, 164, 0, 0, 0, 'USDA', 500],
  ['latte_ps', 'Latte parzialmente scremato', 'Milk, partially skimmed', FR, 46, 3.5, 1.5, 5.0, 0, 44, 150, 0, 0, 0, 'CREA', 1000],
  ['latte_scremato', 'Latte scremato', 'Milk, skimmed', FR, 34, 3.4, 0.1, 5.0, 0, 42, 156, 0, 0, 0, 'CREA', 1000],
  ['latte_intero', 'Latte intero', 'Milk, whole', FR, 64, 3.3, 3.6, 4.9, 0, 50, 150, 0, 0, 0, 'CREA', 1000],
  ['ricotta', 'Ricotta vaccina semigrassa', 'Cheese, ricotta, part skim milk', FR, 138, 11.4, 7.9, 5.1, 0, 99, 125, 0, 0, 0, 'USDA', 250],
  ['fiocchi_latte', 'Fiocchi di latte', 'Cheese, cottage, creamed, large or small curd', FR, 98, 11.1, 4.3, 3.4, 0, 364, 104, 0, 0, 0, 'USDA', 200],
  ['mozzarella', 'Mozzarella vaccina (fior di latte)', 'Mozzarella cheese, whole milk', FR, 253, 18.7, 19.5, 0.7, 0, 196, 98, 0, 0, 0, 'CREA', 125],
  ['parmigiano', 'Parmigiano Reggiano', 'Cheese, parmesan, hard', FR, 387, 33.5, 28.1, 0, 0, 600, 102, 0, 0, 0, 'CREA', 200],
  ['feta', 'Feta', 'Cheese, feta', FR, 264, 14.2, 21.3, 3.9, 0, 1116, 62, 0, 0, 0, 'USDA', 200],
  ['burro', 'Burro', 'Butter, without salt', FR, 717, 0.9, 81.1, 0.1, 0, 11, 24, 0, 0, 0, 'USDA', 125],
  ['proteine_siero', 'Proteine del siero del latte in polvere', 'Whey protein powder', DI, 380, 80.0, 6.0, 6.0, 0, 200, 500, 0, 0, 0, 'ETI', 1000, { categorie: ['ultraprocessato'] }],

  // ---------- Verdura ----------
  ['spinaci', 'Spinaci freschi', 'Spinach, raw', FV, 23, 2.9, 0.4, 1.4, 2.2, 79, 558, 0, 0, 0, 'USDA', 250],
  ['spinaci_surgelati', 'Spinaci surgelati', 'Spinach, frozen, chopped or leaf, unprepared', SU, 29, 3.6, 0.6, 1.3, 2.9, 74, 346, 0, 0, 0, 'USDA', 450],
  ['broccoli', 'Broccoli', 'Broccoli, raw', FV, 34, 2.8, 0.4, 4.0, 2.6, 33, 316, 0, 0, 0, 'USDA', 0],
  ['broccoli_surgelati', 'Broccoli surgelati', 'Broccoli, frozen, chopped, unprepared', SU, 28, 2.8, 0.3, 2.4, 3.0, 24, 250, 0, 0, 0, 'USDA', 450],
  ['cavolfiore', 'Cavolfiore', 'Cauliflower, raw', FV, 25, 1.9, 0.3, 3.0, 2.0, 30, 299, 0, 0, 0, 'USDA', 0],
  ['zucchine', 'Zucchine', 'Squash, summer, zucchini, raw', FV, 17, 1.2, 0.3, 2.1, 1.0, 8, 261, 0, 0, 0, 'USDA', 0],
  ['carote', 'Carote', 'Carrots, raw', FV, 41, 0.9, 0.2, 6.8, 2.8, 69, 320, 0, 0, 0, 'USDA', 1000],
  ['pomodori', 'Pomodori', 'Tomatoes, red, ripe, raw', FV, 18, 0.9, 0.2, 2.7, 1.2, 5, 237, 0, 0, 0, 'USDA', 0],
  ['pomodorini', 'Pomodorini ciliegia', 'Tomatoes, cherry, raw', FV, 18, 0.9, 0.2, 2.7, 1.2, 5, 237, 0, 0, 0, 'USDA', 250],
  ['passata', 'Passata di pomodoro (senza sale aggiunto)', 'Tomato puree, canned, without salt added', DI, 38, 1.7, 0.2, 7.1, 1.9, 28, 439, 0, 0, 0, 'USDA', 700],
  ['polpa_pomodoro', 'Polpa di pomodoro a pezzi', 'Tomatoes, canned, crushed, no salt added', DI, 22, 1.1, 0.3, 3.0, 1.5, 10, 230, 0, 0, 0, 'CREA', 400],
  ['concentrato', 'Concentrato di pomodoro', 'Tomato paste, canned, without salt added', DI, 82, 4.3, 0.5, 14.8, 4.1, 59, 1014, 0, 0, 0, 'USDA', 130],
  ['peperoni', 'Peperoni rossi', 'Peppers, sweet, red, raw', FV, 31, 1.0, 0.3, 3.9, 2.1, 4, 211, 0, 0, 0, 'USDA', 0],
  ['melanzane', 'Melanzane', 'Eggplant, raw', FV, 25, 1.0, 0.2, 2.9, 3.0, 2, 229, 0, 0, 0, 'USDA', 0],
  ['cipolla', 'Cipolla', 'Onions, raw', FV, 40, 1.1, 0.1, 7.6, 1.7, 4, 146, 0, 0, 0, 'USDA', 1000, { pezzo: 100 }],
  ['cipolla_rossa', 'Cipolla rossa', 'Onions, red, raw', FV, 40, 1.1, 0.1, 7.6, 1.7, 4, 146, 0, 0, 0, 'USDA', 500, { pezzo: 100 }],
  ['aglio', 'Aglio', 'Garlic, raw', FV, 149, 6.4, 0.5, 31.0, 2.1, 17, 401, 0, 0, 0, 'USDA', 100, { pezzo: 5 }],
  ['funghi', 'Funghi champignon', 'Mushrooms, white, raw', FV, 22, 3.1, 0.3, 2.3, 1.0, 5, 318, 0, 0, 0, 'USDA', 400],
  ['verza', 'Cavolo verza', 'Cabbage, savoy, raw', FV, 27, 2.0, 0.1, 3.0, 3.1, 28, 230, 0, 0, 0, 'USDA', 0],
  ['cavolo_nero', 'Cavolo nero / kale', 'Kale, raw', FV, 35, 2.9, 1.5, 0.3, 4.1, 53, 348, 0, 0, 0, 'USDA', 250],
  ['cavolo_rosso', 'Cavolo cappuccio rosso', 'Cabbage, red, raw', FV, 31, 1.4, 0.2, 5.3, 2.1, 27, 243, 0, 0, 0, 'USDA', 0],
  ['cavolini', 'Cavolini di Bruxelles surgelati', 'Brussels sprouts, frozen, unprepared', SU, 41, 3.8, 0.4, 4.1, 3.8, 10, 370, 0, 0, 0, 'USDA', 450],
  ['fagiolini', 'Fagiolini surgelati', 'Beans, snap, green, frozen, unprepared', SU, 31, 1.8, 0.2, 4.3, 2.7, 6, 211, 0, 0, 0, 'USDA', 450],
  ['asparagi', 'Asparagi', 'Asparagus, raw', FV, 20, 2.2, 0.1, 1.8, 2.1, 2, 202, 0, 0, 0, 'USDA', 500],
  ['carciofi', 'Cuori di carciofo surgelati', 'Artichokes, frozen, unprepared', SU, 38, 2.6, 0.4, 3.1, 3.9, 47, 248, 0, 0, 0, 'USDA', 450],
  ['finocchio', 'Finocchio', 'Fennel, bulb, raw', FV, 31, 1.2, 0.2, 4.2, 3.1, 52, 414, 0, 0, 0, 'USDA', 0],
  ['sedano', 'Sedano', 'Celery, raw', FV, 16, 0.7, 0.2, 1.4, 1.6, 80, 260, 0, 0, 0, 'USDA', 0],
  ['lattuga', 'Insalata (lattuga)', 'Lettuce, green leaf, raw', FV, 15, 1.4, 0.2, 1.6, 1.3, 28, 194, 0, 0, 0, 'USDA', 250],
  ['rucola', 'Rucola', 'Arugula, raw', FV, 25, 2.6, 0.7, 2.1, 1.6, 27, 369, 0, 0, 0, 'USDA', 125],
  ['cetriolo', 'Cetriolo', 'Cucumber, with peel, raw', FV, 15, 0.7, 0.1, 3.1, 0.5, 2, 147, 0, 0, 0, 'USDA', 0],
  ['zucca', 'Zucca (delica/butternut)', 'Squash, winter, butternut, raw', FV, 45, 1.0, 0.1, 9.7, 2.0, 4, 352, 0, 0, 0, 'USDA', 0],
  ['barbabietola', 'Barbabietola precotta', 'Beets, cooked, boiled, drained', FV, 44, 1.7, 0.2, 8.0, 2.0, 77, 305, 0, 0, 0, 'USDA', 500],
  ['porri', 'Porri', 'Leeks, raw', FV, 61, 1.5, 0.3, 12.4, 1.8, 20, 180, 0, 0, 0, 'USDA', 0],
  ['bietole', 'Bietole', 'Chard, swiss, raw', FV, 19, 1.8, 0.2, 2.1, 1.6, 213, 379, 0, 0, 0, 'USDA', 0],
  ['verdure_miste', 'Verdure miste surgelate (piselli, carote, mais, fagiolini)', 'Vegetables, mixed, frozen, unprepared', SU, 64, 3.3, 0.5, 9.3, 4.0, 47, 212, 0.5, 0.5, 0.8, 'USDA', 450],
  ['minestrone', 'Minestrone surgelato (solo verdure)', 'Vegetable soup mix, frozen', SU, 35, 1.8, 0.3, 5.0, 2.5, 30, 250, 0.3, 0.3, 0.5, 'ETI', 1000],
  ['prezzemolo', 'Prezzemolo fresco', 'Parsley, fresh', FV, 36, 3.0, 0.8, 3.0, 3.3, 56, 554, 0, 0, 0, 'USDA', 50],
  ['basilico', 'Basilico fresco', 'Basil, fresh', FV, 23, 3.2, 0.6, 1.1, 1.6, 4, 295, 0, 0, 0, 'USDA', 30],
  ['erba_cipollina', 'Erba cipollina', 'Chives, raw', FV, 30, 3.3, 0.7, 1.9, 2.5, 3, 296, 0, 0, 0, 'USDA', 30],
  ['menta', 'Menta fresca', 'Spearmint, fresh', FV, 44, 3.3, 0.7, 1.6, 6.8, 31, 458, 0, 0, 0, 'USDA', 30],
  ['coriandolo', 'Coriandolo fresco', 'Coriander (cilantro) leaves, raw', FV, 23, 2.1, 0.5, 0.9, 2.8, 46, 521, 0, 0, 0, 'USDA', 30],
  ['rosmarino', 'Rosmarino fresco', 'Rosemary, fresh', FV, 131, 3.3, 5.9, 6.6, 14.1, 26, 668, 0, 0, 0, 'USDA', 30],
  ['zenzero', 'Zenzero fresco', 'Ginger root, raw', FV, 80, 1.8, 0.8, 15.8, 2.0, 13, 415, 0, 0, 0, 'USDA', 100],
  ['limone', 'Limone (succo)', 'Lemon juice, raw', FV, 22, 0.4, 0.2, 6.6, 0.3, 1, 103, 0, 0, 0, 'USDA', 0, { pezzo: 40 }],

  // ---------- Frutta ----------
  ['banana_verde', 'Banana poco matura (buccia verde-gialla)', 'Bananas, raw (slightly unripe)', FV, 89, 1.1, 0.3, 20.2, 2.6, 1, 358, 5, 1, 1, 'USDA', 0, { pezzo: 120 }],
  ['banana', 'Banana matura', 'Bananas, raw', FV, 89, 1.1, 0.3, 20.2, 2.6, 1, 358, 1, 0.5, 0.5, 'USDA', 0, { pezzo: 120 }],
  ['mela', 'Mela', 'Apples, raw, with skin', FV, 52, 0.3, 0.2, 11.4, 2.4, 1, 107, 0, 0, 0, 'USDA', 0, { pezzo: 180 }],
  ['pera', 'Pera', 'Pears, raw', FV, 57, 0.4, 0.1, 12.1, 3.1, 1, 116, 0, 0, 0, 'USDA', 0, { pezzo: 180 }],
  ['arancia', 'Arancia', 'Oranges, raw, all commercial varieties', FV, 47, 0.9, 0.1, 9.4, 2.4, 0, 181, 0, 0, 0, 'USDA', 0, { pezzo: 150 }],
  ['kiwi', 'Kiwi', 'Kiwifruit, green, raw', FV, 61, 1.1, 0.5, 11.7, 3.0, 3, 312, 0, 0, 0, 'USDA', 0, { pezzo: 75 }],
  ['fragole', 'Fragole', 'Strawberries, raw', FV, 32, 0.7, 0.3, 5.7, 2.0, 1, 153, 0, 0, 0, 'USDA', 250],
  ['mirtilli', 'Mirtilli', 'Blueberries, raw', FV, 57, 0.7, 0.3, 12.1, 2.4, 1, 77, 0, 0, 0, 'USDA', 125],
  ['lamponi', 'Lamponi', 'Raspberries, raw', FV, 52, 1.2, 0.7, 5.4, 6.5, 1, 151, 0, 0, 0, 'USDA', 125],
  ['frutti_bosco', 'Frutti di bosco surgelati', 'Mixed berries, frozen, unsweetened', SU, 45, 0.9, 0.4, 6.5, 4.5, 1, 150, 0, 0, 0, 'USDA', 300],
  ['ananas', 'Ananas', 'Pineapple, raw', FV, 50, 0.5, 0.1, 11.7, 1.4, 1, 109, 0, 0, 0, 'USDA', 0],
  ['mango', 'Mango', 'Mangos, raw', FV, 60, 0.8, 0.4, 13.4, 1.6, 1, 168, 0, 0, 0, 'USDA', 0],
  ['pesca', 'Pesca', 'Peaches, raw', FV, 39, 0.9, 0.3, 8.0, 1.5, 0, 190, 0, 0, 0, 'USDA', 0, { pezzo: 150 }],
  ['uva', 'Uva', 'Grapes, red or green, raw', FV, 69, 0.7, 0.2, 17.2, 0.9, 2, 191, 0, 0, 0, 'USDA', 500],
  ['cachi', 'Cachi', 'Persimmons, japanese, raw', FV, 70, 0.6, 0.2, 15.0, 3.6, 1, 161, 0, 0, 0, 'USDA', 0],
  ['melograno', 'Melograno (chicchi)', 'Pomegranates, raw', FV, 83, 1.7, 1.2, 14.7, 4.0, 3, 236, 0, 0, 0, 'USDA', 0],
  ['datteri', 'Datteri secchi', 'Dates, medjool', SE, 277, 1.8, 0.2, 68.3, 6.7, 1, 696, 0, 0, 0, 'USDA', 250],
  ['uvetta', 'Uvetta', 'Raisins, seedless', SE, 299, 3.1, 0.5, 75.5, 3.7, 11, 749, 0, 0, 0, 'USDA', 250],
  ['albicocche_secche', 'Albicocche secche', 'Apricots, dried, sulfured, uncooked', SE, 241, 3.4, 0.5, 55.3, 7.3, 10, 1162, 0, 0, 0, 'USDA', 200],
  ['prugne_secche', 'Prugne secche', 'Plums, dried (prunes), uncooked', SE, 240, 2.2, 0.4, 56.8, 7.1, 2, 732, 0, 0, 0, 'USDA', 200],
  ['fichi_secchi', 'Fichi secchi', 'Figs, dried, uncooked', SE, 249, 3.3, 0.9, 54.1, 9.8, 10, 680, 0, 0, 0, 'USDA', 250],
  ['avocado', 'Avocado', 'Avocados, raw, all commercial varieties', FV, 160, 2.0, 14.7, 1.8, 6.7, 7, 485, 0, 0, 0, 'USDA', 0, { categorie: ['avocado'] }],

  // ---------- Frutta secca e semi ----------
  ['mandorle', 'Mandorle', 'Nuts, almonds', SE, 579, 21.2, 49.9, 9.1, 12.5, 1, 733, 0, 0, 0, 'USDA', 200],
  ['noci', 'Noci', 'Nuts, walnuts, english', SE, 654, 15.2, 65.2, 7.0, 6.7, 2, 441, 0, 0, 0, 'USDA', 200],
  ['nocciole', 'Nocciole', 'Nuts, hazelnuts or filberts', SE, 628, 15.0, 60.8, 7.0, 9.7, 0, 680, 0, 0, 0, 'USDA', 200],
  ['anacardi', 'Anacardi (non salati)', 'Nuts, cashew nuts, raw', SE, 553, 18.2, 43.9, 26.9, 3.3, 12, 660, 0, 0, 0, 'USDA', 200],
  ['pistacchi', 'Pistacchi (non salati)', 'Nuts, pistachio nuts, raw', SE, 560, 20.2, 45.3, 16.6, 10.6, 1, 1025, 0, 0, 0, 'USDA', 200],
  ['arachidi', 'Arachidi (non salate)', 'Peanuts, all types, raw', SE, 567, 25.8, 49.2, 7.6, 8.5, 18, 705, 0, 0, 0, 'USDA', 200],
  ['burro_arachidi', 'Burro di arachidi 100% (senza sale)', 'Peanut butter, smooth style, without salt', SE, 598, 22.2, 51.4, 17.3, 5.0, 17, 558, 0, 0, 0, 'USDA', 350],
  ['crema_mandorle', 'Crema di mandorle 100%', 'Nuts, almond butter, plain, without salt added', SE, 614, 21.0, 55.5, 8.5, 10.3, 7, 748, 0, 0, 0, 'USDA', 200],
  ['semi_chia', 'Semi di chia', 'Seeds, chia seeds, dried', SE, 486, 16.5, 30.7, 7.7, 34.4, 16, 407, 0, 0, 0, 'USDA', 250],
  ['semi_lino', 'Semi di lino macinati', 'Seeds, flaxseed', SE, 534, 18.3, 42.2, 1.6, 27.3, 30, 813, 0, 0, 0, 'USDA', 250],
  ['semi_zucca', 'Semi di zucca', 'Seeds, pumpkin and squash seed kernels, dried', SE, 559, 30.2, 49.0, 4.7, 6.0, 7, 809, 0, 0, 0, 'USDA', 200],
  ['semi_girasole', 'Semi di girasole', 'Seeds, sunflower seed kernels, dried', SE, 584, 20.8, 51.5, 11.4, 8.6, 9, 645, 0, 0, 0, 'USDA', 200],
  ['semi_sesamo', 'Semi di sesamo', 'Seeds, sesame seeds, whole, dried', SE, 573, 17.7, 49.7, 11.6, 11.8, 11, 468, 0, 0, 0, 'USDA', 200],
  ['semi_canapa', 'Semi di canapa decorticati', 'Seeds, hemp seed, hulled', SE, 553, 31.6, 48.8, 4.7, 4.0, 5, 1200, 0, 0, 0, 'USDA', 200],
  ['tahina', 'Tahina (crema di sesamo, senza sale)', 'Seeds, sesame butter, tahini', SE, 595, 17.0, 53.8, 11.9, 9.3, 35, 414, 0, 0, 0, 'USDA', 300],
  ['cocco_rape', 'Cocco rapè (non zuccherato)', 'Nuts, coconut meat, dried (desiccated), not sweetened', SE, 660, 6.9, 64.5, 7.4, 16.3, 37, 543, 0, 0, 0, 'USDA', 200],

  // ---------- Dispensa: dolcificanti, cacao, conserve ----------
  ['cacao', 'Cacao amaro in polvere', 'Cocoa, dry powder, unsweetened', DI, 228, 19.6, 13.7, 20.9, 37.0, 21, 1524, 0, 0, 0, 'USDA', 250],
  ['cioccolato_85', 'Cioccolato fondente 85%', 'Chocolate, dark, 70-85% cacao solids', DI, 598, 7.8, 42.6, 35.0, 10.9, 20, 715, 0, 0, 0, 'USDA', 100],
  ['miele', 'Miele', 'Honey', DI, 304, 0.3, 0, 82.2, 0.2, 4, 52, 0, 0, 0, 'USDA', 500],
  ['sciroppo_acero', 'Sciroppo d\'acero', 'Syrups, maple', DI, 260, 0, 0.1, 67.0, 0, 12, 212, 0, 0, 0, 'USDA', 250],
  ['latte_cocco', 'Latte di cocco (lattina, solo cocco e acqua)', 'Nuts, coconut milk, canned', DI, 197, 2.0, 21.3, 2.8, 0, 13, 220, 0, 0, 0, 'USDA', 400],
  ['farina_00', 'Farina di grano tenero tipo 00', 'Wheat flour, white, all-purpose', DI, 340, 10.3, 1.0, 72.7, 2.7, 2, 107, 0, 0, 0, 'USDA', 1000, { categorie: ['farina_raffinata'] }],
  ['pane_bianco', 'Pane bianco', 'Bread, white, commercially prepared', DI, 266, 7.6, 3.3, 48.2, 2.4, 490, 115, 0, 0, 0, 'USDA', 500, { categorie: ['pane'] }],
  ['pane_integrale', 'Pane integrale', 'Bread, whole-wheat, commercially prepared', DI, 252, 12.5, 3.5, 36.0, 6.0, 450, 250, 0, 0, 0, 'USDA', 500, { categorie: ['pane'] }],
  ['dado', 'Dado / brodo granulare', 'Bouillon, dry', DI, 250, 10.0, 15.0, 20.0, 0, 20000, 300, 0, 0, 0, 'ETI', 100, { categorie: ['ultraprocessato'] }],

  // ---------- Grassi, sale, aceti ----------
  ['olio_evo', 'Olio extravergine di oliva', 'Oil, olive, extra virgin', SP, 884, 0, 100, 0, 0, 2, 1, 0, 0, 0, 'USDA', 1000, { categorie: ['olio_evo'] }],
  ['olio_semi', 'Olio di semi di girasole', 'Oil, sunflower', SP, 884, 0, 100, 0, 0, 0, 0, 0, 0, 0, 'USDA', 1000, { categorie: ['olio_vegetale'] }],
  ['sale', 'Sale da cucina', 'Salt, table', SP, 0, 0, 0, 0, 0, 38758, 8, 0, 0, 0, 'USDA', 1000, { categorie: ['sale'] }],
  ['sale_iposodico', 'Sale iposodico (50% sodio, 50% potassio)', 'Salt substitute, 50% sodium chloride / 50% potassium chloride', SP, 0, 0, 0, 0, 0, 19700, 26200, 0, 0, 0, 'ETI', 300],
  ['aceto_mele', 'Aceto di mele', 'Vinegar, cider', SP, 21, 0, 0, 0.9, 0, 5, 73, 0, 0, 0, 'USDA', 500],
  ['aceto_balsamico', 'Aceto balsamico di Modena', 'Vinegar, balsamic', SP, 88, 0.5, 0, 17.0, 0, 23, 112, 0, 0, 0, 'USDA', 250],

  // ---------- Spezie ----------
  ['pepe', 'Pepe nero', 'Spices, pepper, black', SP, 251, 10.4, 3.3, 38.6, 25.3, 20, 1329, 0, 0, 0, 'USDA', 50],
  ['curcuma', 'Curcuma in polvere', 'Spices, turmeric, ground', SP, 312, 9.7, 3.3, 44.4, 22.7, 27, 2080, 0, 0, 0, 'USDA', 50],
  ['paprika', 'Paprika dolce', 'Spices, paprika', SP, 282, 14.1, 12.9, 19.1, 34.9, 68, 2280, 0, 0, 0, 'USDA', 50],
  ['cumino', 'Cumino in polvere', 'Spices, cumin seed', SP, 375, 17.8, 22.3, 33.7, 10.5, 168, 1788, 0, 0, 0, 'USDA', 50],
  ['curry', 'Curry in polvere', 'Spices, curry powder', SP, 325, 14.3, 14.0, 2.6, 53.2, 52, 1170, 0, 0, 0, 'USDA', 50],
  ['cannella', 'Cannella in polvere', 'Spices, cinnamon, ground', SP, 247, 4.0, 1.2, 27.5, 53.1, 10, 431, 0, 0, 0, 'USDA', 50],
  ['origano', 'Origano secco', 'Spices, oregano, dried', SP, 265, 9.0, 4.3, 26.4, 42.5, 25, 1260, 0, 0, 0, 'USDA', 20],
  ['zenzero_polvere', 'Zenzero in polvere', 'Spices, ginger, ground', SP, 335, 9.0, 4.2, 57.5, 14.1, 27, 1320, 0, 0, 0, 'USDA', 50],
  ['peperoncino', 'Peperoncino in fiocchi', 'Spices, pepper, red or cayenne', SP, 318, 12.0, 17.3, 29.4, 27.2, 30, 2014, 0, 0, 0, 'USDA', 30],
  ['aglio_polvere', 'Aglio in polvere', 'Spices, garlic powder', SP, 331, 16.6, 0.7, 63.7, 9.0, 60, 1193, 0, 0, 0, 'USDA', 50],
  ['noce_moscata', 'Noce moscata', 'Spices, nutmeg, ground', SP, 525, 5.8, 36.3, 28.5, 20.8, 16, 350, 0, 0, 0, 'USDA', 30],
  ['vaniglia', 'Vaniglia (bacca o estratto puro)', 'Vanilla extract', SP, 288, 0.1, 0.1, 12.7, 0, 9, 148, 0, 0, 0, 'USDA', 50]
];

// Trasforma le righe compatte in oggetti leggibili.
export const INGREDIENTI = RIGHE.map((r) => {
  const extra = r[16] || {};
  return {
    id: r[0],
    nome: r[1],
    nomeEn: r[2],
    reparto: r[3],
    kcal: r[4],
    prot: r[5],
    grassi: r[6],
    carbo: r[7],
    fibre: r[8],
    sodio: r[9],
    potassio: r[10],
    arCrudo: r[11],
    arCotto: r[12],
    arRaff: r[13],
    fonte: FONTI[r[14]] || r[14],
    conf: r[15],
    confNome: extra.confNome || '',
    pezzo: extra.pezzo || 0,
    nota: extra.nota || '',
    categorie: extra.categorie || []
  };
});
