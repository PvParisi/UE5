# Pagina QR – progetto UE5 (International Wine Markets)

## Contesto
- Progetto d'esame (M1 SVV, ISVV Bordeaux): pitch di un marchio inventato davanti al prof e alla classe, nei panni degli investitori.
- Prodotto: cocktail a base di vino in piccole bottiglie di vetro, con più gusti ("saveurs"). Identità colorata ma molto essenziale.
- Questo sito è la pagina che si apre scansionando il QR sulla bottiglia. Durante il pitch la giuria lo scansionerà dal vivo con il telefono.
- Il marchio si chiama PÉTILLE. Dal 26/10/2026 il sito non ha più segnaposto tra [parentesi quadre]: i dati che il gruppo non ha fornito sono stati concordati con me (vedi le eccezioni in « Regole fisse »).

## Lingue
- Parla con me in italiano.
- Tutti i testi del sito sono in francese (`lang="fr"`), con la tipografia francese: spazio insecabile prima di : ; ? ! e prima di %, °C, cl.

## Punto di partenza
- `reference/mockup/` contiene il mockup di riferimento: `Main.dc.html` (pagina saveur), `Histoire.dc.html` (storia), `Elabel.dc.html` (e-label).
- Formato del canvas di design da cui provengono: HTML con stili inline dentro `<x-dc>`; i `{{...}}` sono valori calcolati in `renderVals()` dello script `text/x-dc`; `<sc-for>` è un ciclo; `<helmet>` contiene font e stili di base.
- Non è codice da pubblicare: va riprodotto fedelmente il design (colori, tipografia, spaziature, bottiglia SVG), riscritto in HTML/CSS/JS standard.
  - Dal 29/10/2026 la bottiglia dell'hero è una foto per gusto, generata con Gemini dal disegno del gruppo e scontornata (`docs/genera-bouteilles-photo.sh`; originali in `bouteilles-originales/`, fuori dal repository). Sostituisce il disegno del gruppo (28/10) e la bottiglia SVG del mockup. Sull'etichetta lo slogan è « vin frais aux goûts d'ailleurs »; nel resto del sito lo slogan non compare.

## Stack e struttura
- HTML + CSS + JavaScript vanilla. Nessun framework, nessun build step.
- Pagine: `index.html` (saveur), `histoire.html`, `e-label/index.html`.
- Un solo `assets/style.css` con i token di design come variabili CSS; JS minimo in `assets/app.js`.
- Le saveur stanno in un unico oggetto dati (nome, colori `color`/`deep`/`tint`): aggiungere o modificare una saveur = toccare un solo punto.
- Ogni bottiglia avrà il suo QR: `index.html?saveur=2` apre direttamente quella saveur (default: la prima).
- Font Bricolage Grotesque in self-hosting (`assets/fonts/`, woff2): nessuna richiesta a server esterni.
- Solo percorsi relativi: il sito sarà pubblicato sotto un sottopercorso (`https://<utente>.github.io/<repo>/`).

## Regole fisse
- E-label: pagina separata con le sole informazioni obbligatorie (dénomination, ingredienti, allergeni, valori nutrizionali per 100 ml, produttore). Niente marketing, niente link promozionali, niente script di terzi, cookie o analytics (regole UE sull'etichetta elettronica dei vini).
- Nessun tracciamento su tutto il sito.
- Loi Évin: contenuti informativi (origine, terroir, composizione, metodo di produzione). Niente immagini o slogan che associno il prodotto a festa, seduzione o successo sociale. Su ogni pagina: « L'abus d'alcool est dangereux pour la santé, à consommer avec modération. »
- Non inventare dati (gradazione, zuccheri, valori nutrizionali, nomi, luoghi): segnaposto finché il gruppo non li fornisce.
  - Eccezione (24/10/2026, su mia richiesta): i punti vendita in `points-de-vente.html` e in « Où le trouver » sono inventati, così come la mappa illustrativa in « D'où vient le vin » (stile app di mappe, con scala: paesi, strade, corsi d'acqua e nomi inventati, nessun logo o marchio di un servizio reale). Per i punti vendita niente indirizzi, per non indicare attività reali. Non sostituirli con segnaposto.
  - Eccezione (26/10/2026, su mia richiesta): sono inventati ma verosimili zuccheri per gusto, temperatura di servizio, composizione e ingredienti dell'e-label, valori nutrizionali (calcolati da alcol, zucchero e glicerolo), frase sul terroir, edizione d'artista (senza nomi di persone reali), paese del domaine (Mourvelle) e indirizzo del produttore. Sono coerenti con le ricette del gruppo: 6 % vol, 60 % di vino (dal 28/10/2026; prima 5,5 % e 55 %), zuccheri sotto 35 g/L. Se il gruppo fornisce dati reali, sostituiscili; non rimettere segnaposto.
- Accessibilità: contrasto del testo ≥ 4.5:1, target tattili ≥ 44 px, veri `<button>` e `<a>`, `alt` sulle immagini, focus visibile.
- Mobile first (390 px, iPhone), ma leggibile anche proiettato su un grande schermo.
- Leggero: immagini WebP compresse, lazy-loading; deve caricarsi in fretta in 4G.

## Come lavoriamo
- Per modifiche non banali: prima proponi un piano e aspetta il mio ok.
- Piccoli passi, un commit per passo, messaggi chiari in italiano.
- Anteprima: server locale (`python3 -m http.server 8000`) e indirizzo IP locale da aprire sull'iPhone, sulla stessa rete Wi-Fi.
- Le richieste del gruppo (spesso in francese) le incollo in `docs/retours.md`: `docs/retours.md` è un registro cumulativo: checklist per data, con chi ha chiesto cosa. Applica solo i punti non spuntati, poi spuntali con l'hash del commit. Se due punti si contraddicono, o contraddicono una decisione già presa, chiedimi prima di procedere.
- Cache: `style.css` e `app.js` sono richiamati con `?v=N` in tutte le pagine; a ogni modifica di uno dei due aumenta N ovunque, nello stesso commit.
- Pubblicazione su GitHub Pages dal branch `main`. QR in SVG nella cartella `qr/`: uno per saveur e uno per l'e-label. Rigenerali solo se cambia l'URL.
  - Su ogni bottiglia va solo il QR del suo gusto (`qr/saveur-N.svg`). L'e-label si raggiunge dal link « Ingrédients et valeurs nutritionnelles » della pagina del gusto, che passa già `?saveur=N`. `qr/e-label.svg` esiste ma non è usato (deciso il 28/10/2026): non proporre QR dell'e-label per gusto.
