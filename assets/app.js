/* ==========================================================
   Pagina QR – dati delle saveur e cambio di saveur
   Nessuna dipendenza, nessun cookie, nessuna richiesta esterna.
   ========================================================== */

/* Le saveur: aggiungere o modificare una saveur = toccare solo qui.
   Nell'URL l'ordine parte da 1: index.html?saveur=2 apre la seconda.
   sucre: zuccheri totali in g/L (sotto i 35 g/L, soglia della taxe premix).
   ingredients: parte dell'elenco ingredienti dell'e-label propria del gusto, in ordine
   decrescente (con alcool: tra « vin blanc (60 %) » e « gaz carbonique »).
   kj, kcal, glucides, sucres: valori per 100 ml, calcolati da alcol (6 % vol),
   zucchero e glicerolo del vino; grassi, proteine e sale: 0 g.
   photo: foto della bottiglia dell'hero in assets/img/ (docs/genera-bouteilles-photo.sh). */
const SAVEURS = [
  { nom: 'Pink Bloom', fruits: 'Pamplemousse rose, lavande',
    recette: 'jus de pamplemousse rose, sirop de lavande',
    gout: ['Floral', 'Acidulé', 'Rafraîchissant'],
    sucre: 23,
    ingredients: 'jus de pamplemousse rose (22 %), eau, sirop de lavande (1 %) (sucre, eau, arôme naturel de lavande)',
    kj: 181, kcal: 43, glucides: '2,7', sucres: '2,3',
    color: '#EF81B4', deep: '#C9558C', tint: '#FCE6F0',
    photo: 'bouteille-pink-bloom.webp' },
  { nom: 'Sunset Peach', fruits: 'Pêche, orange sanguine',
    recette: 'nectar de pêche, jus d\'orange sanguine',
    gout: ['Fruité', 'Doux', 'Gourmand'],
    sucre: 32,
    ingredients: 'nectar de pêche (20 %) (purée de pêche, eau, sucre), eau, jus d\'orange sanguine (10 %)',
    kj: 196, kcal: 47, glucides: '3,6', sucres: '3,2',
    color: '#FF751F', deep: '#D4520A', tint: '#FFE3D2',
    photo: 'bouteille-sunset-peach.webp' },
  { nom: 'Hibiscus Kiss', fruits: 'Litchi, hibiscus',
    recette: 'jus de litchi, sirop d\'hibiscus',
    gout: ['Floral', 'Exotique', 'Légèrement acidulé'],
    sucre: 26,
    ingredients: 'eau, jus de litchi (12 %), sirop d\'hibiscus (0,8 %) (sucre, eau, extrait d\'hibiscus)',
    kj: 186, kcal: 45, glucides: '3,0', sucres: '2,6',
    color: '#C991FB', deep: '#9A5CD6', tint: '#F4E9FE',
    photo: 'bouteille-hibiscus-kiss.webp' },
  { nom: 'Passion Flower', fruits: 'Fruit de la passion, fleur de sureau',
    recette: 'jus de fruit de la passion, sirop de fleur de sureau',
    gout: ['Exotique', 'Floral', 'Acidulé'],
    sucre: 26,
    ingredients: 'eau, jus de fruit de la passion (15 %), sirop de fleur de sureau (1,2 %) (sucre, eau, extrait de fleur de sureau)',
    kj: 186, kcal: 45, glucides: '3,0', sucres: '2,6',
    color: '#8BCFB6', deep: '#4E9C80', tint: '#E8F5F0',
    photo: 'bouteille-passion-flower.webp' },
  { nom: 'Mango', fruits: 'Mangue, fleur d\'oranger',
    recette: 'nectar de mangue, fleur d\'oranger',
    gout: ['Doux', 'Exotique', 'Floral'],
    sucre: 30,
    ingredients: 'nectar de mangue (22 %) (purée de mangue, eau, sucre), eau, eau de fleur d\'oranger',
    kj: 192, kcal: 46, glucides: '3,4', sucres: '3,0',
    color: '#FFC657', deep: '#D99A1E', tint: '#FFF4DD',
    photo: 'bouteille-mango.webp' },
  { nom: 'White Blossom', fruits: 'Raisin blanc, framboise', sansAlcool: true,
    recette: 'jus de raisin d\'Ugni blanc du domaine, purée de framboise, eau pétillante',
    gout: ['Fruité', 'Frais', 'Légèrement acidulé'],
    sucre: 33,
    ingredients: 'eau gazéifiée, jus de raisin blanc (Ugni blanc) (20 %), purée de framboise (5 %)',
    kj: 58, kcal: 14, glucides: '3,4', sucres: '3,3',
    color: '#FEF3EA', deep: '#E2B9A0', tint: '#FEF3EA',
    photo: 'bouteille-white-blossom.webp' },
];

(function () {
  'use strict';

  // Indice (0-based) letto da ?saveur=N; valore assente o non valido → prima saveur
  function lireSaveur() {
    const n = parseInt(new URLSearchParams(location.search).get('saveur'), 10);
    return n >= 1 && n <= SAVEURS.length ? n - 1 : 0;
  }

  // Aggiunge o sostituisce ?saveur=N in un href relativo, senza toccare il resto
  function avecSaveur(href, i) {
    const [chemin, ancre] = href.split('#');
    const [base, requete] = chemin.split('?');
    const params = new URLSearchParams(requete || '');
    params.set('saveur', String(i + 1));
    return base + '?' + params.toString() + (ancre !== undefined ? '#' + ancre : '');
  }

  const racine = document.documentElement;
  const boutons = [];

  // Colori e variante sans alcool: applicati subito (lo script è nel <head>),
  // così non si vede la saveur 1 prima di quella giusta
  function couleurs(i) {
    const s = SAVEURS[i];
    racine.toggleAttribute('data-sans-alcool', Boolean(s.sansAlcool));
    racine.style.setProperty('--saveur', s.color);
    racine.style.setProperty('--saveur-deep', s.deep);
    racine.style.setProperty('--saveur-tint', s.tint);

    // Colore della barra del browser, solo dove l'intestazione è colorata
    const meta = document.querySelector('meta[name="theme-color"][data-avec-saveur]');
    if (meta) meta.setAttribute('content', s.color);
  }

  function appliquer(i) {
    const s = SAVEURS[i];
    couleurs(i);

    // data-saveur="champ": testo del campo; un array (gout) diventa una lista di <li>;
    // data-majuscule mette la maiuscola iniziale (recette è in minuscolo per stare a metà frase)
    document.querySelectorAll('[data-saveur]').forEach(function (el) {
      const champ = el.getAttribute('data-saveur');
      if (!(champ in s)) return;
      const valeur = s[champ];
      if (Array.isArray(valeur)) {
        el.replaceChildren.apply(el, valeur.map(function (texte) {
          const li = document.createElement('li');
          li.textContent = texte;
          return li;
        }));
      } else if (el.hasAttribute('data-majuscule')) {
        el.textContent = valeur.charAt(0).toUpperCase() + valeur.slice(1);
      } else {
        el.textContent = valeur;
      }
    });

    // <img data-photo="cartella/">: foto della bottiglia del gusto. Il src è solo qui e non
    // nell'HTML, così con ?saveur=N non si scarica prima la foto della saveur 1
    document.querySelectorAll('img[data-photo]').forEach(function (img) {
      img.src = img.getAttribute('data-photo') + s.photo;
    });

    // <title data-avec-saveur>Marque – Saveur</title>: aggiorna la parte dopo il trattino
    const titre = document.querySelector('title[data-avec-saveur]');
    if (titre) document.title = titre.textContent.split(' – ')[0] + ' – ' + s.nom;

    document.querySelectorAll('a[data-lien]').forEach(function (a) {
      a.setAttribute('href', avecSaveur(a.getAttribute('href'), i));
    });

    boutons.forEach(function (b, j) {
      b.setAttribute('aria-pressed', String(j === i));
    });
  }

  // Griglia « Toutes les saveurs » generata dai dati (solo su index.html)
  function creerGrille() {
    const grille = document.querySelector('[data-saveurs]');
    if (!grille) return;

    SAVEURS.forEach(function (s, i) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'saveur-choix';
      b.style.setProperty('--choix-color', s.color);
      b.style.setProperty('--choix-tint', s.tint);

      const pastille = document.createElement('span');
      pastille.className = 'saveur-pastille';
      pastille.setAttribute('aria-hidden', 'true');

      const nom = document.createElement('span');
      nom.className = 'saveur-nom';
      nom.textContent = s.nom;

      b.append(pastille, nom);
      if (s.sansAlcool) {
        const mention = document.createElement('span');
        mention.className = 'saveur-mention';
        mention.textContent = 'Sans alcool';
        b.append(mention);
      }
      b.addEventListener('click', function () {
        appliquer(i);
        history.replaceState(null, '', avecSaveur(location.pathname.split('/').pop() + location.search + location.hash, i));
      });

      boutons.push(b);
      grille.appendChild(b);
    });
    const section = grille.closest('section');
    if (section) section.hidden = false;
  }

  const depart = lireSaveur();
  couleurs(depart);
  document.addEventListener('DOMContentLoaded', function () {
    creerGrille();
    appliquer(depart);
  });
})();
