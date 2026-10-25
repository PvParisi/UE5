/* ==========================================================
   Pagina QR – dati delle saveur e cambio di saveur
   Nessuna dipendenza, nessun cookie, nessuna richiesta esterna.
   ========================================================== */

/* Le saveur: aggiungere o modificare una saveur = toccare solo qui.
   Nell'URL l'ordine parte da 1: index.html?saveur=2 apre la seconda. */
const SAVEURS = [
  { nom: 'Pink Bloom', fruits: 'Pamplemousse rose, lavande, citron',
    recette: 'jus de pamplemousse rose, sirop de lavande, citron',
    gout: ['Floral', 'Acidulé', 'Rafraîchissant'],
    color: '#FFA3C2', deep: '#D94F86', tint: '#FFE9F1' },
  { nom: 'Sunset Peach', fruits: 'Pêche, orange sanguine',
    recette: 'nectar de pêche, jus d\'orange sanguine',
    gout: ['Fruité', 'Doux', 'Gourmand'],
    color: '#FF9A52', deep: '#D9621A', tint: '#FFE9D9' },
  { nom: 'Hibiscus Kiss', fruits: 'Litchi, hibiscus, citron vert',
    recette: 'jus de litchi, sirop d\'hibiscus, sirop de citron vert',
    gout: ['Floral', 'Exotique', 'Légèrement acidulé'],
    color: '#F0679A', deep: '#B0204F', tint: '#FDE3EC' },
  { nom: 'Passion Flower', fruits: 'Fruit de la passion, fleur de sureau, citron vert',
    recette: 'jus de fruit de la passion, sirop de fleur de sureau, citron vert',
    gout: ['Exotique', 'Floral', 'Acidulé'],
    color: '#C3A0F5', deep: '#7E57C2', tint: '#F1E9FC' },
  { nom: 'Mango Fleur', fruits: 'Mangue, fleur d\'oranger, gingembre',
    recette: 'nectar de mangue, fleur d\'oranger, sirop de gingembre',
    gout: ['Doux', 'Exotique', 'Floral'],
    color: '#FFC23D', deep: '#D98E00', tint: '#FFF3D6' },
  { nom: 'Apple Blossom', fruits: 'Pomme, framboise, citron vert', sansAlcool: true,
    recette: 'jus de pomme, purée de framboise, citron vert',
    gout: ['Fruité', 'Frais', 'Légèrement acidulé'],
    color: '#9BDB7E', deep: '#3E8F3A', tint: '#E8F7E1' },
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
