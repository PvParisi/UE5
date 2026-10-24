/* ==========================================================
   Pagina QR – dati delle saveur e cambio di saveur
   Nessuna dipendenza, nessun cookie, nessuna richiesta esterna.
   ========================================================== */

/* Le saveur: aggiungere o modificare una saveur = toccare solo qui.
   Nell'URL l'ordine parte da 1: index.html?saveur=2 apre la seconda. */
const SAVEURS = [
  { nom: 'Sunset Tropical', fruits: 'Ananas et mangue',                     color: '#FFB627', deep: '#D98200', tint: '#FFF1D3' },
  { nom: 'Berry Pop',       fruits: 'Framboise et cranberry',               color: '#FF6F8E', deep: '#C9284F', tint: '#FFE2E8' },
  { nom: 'Green Vibe',      fruits: 'Pomme verte et menthe',                color: '#8FD97A', deep: '#3E8F3A', tint: '#E6F6E0' },
  { nom: 'Peach Glow',      fruits: 'Pêche et orange sanguine',             color: '#FF8A3D', deep: '#D9561A', tint: '#FFE6D6' },
  { nom: '[Saveur 6]',      fruits: '[Pamplemousse rose, lavande, citron]', color: '#C7A6F2', deep: '#7E57C2', tint: '#F1E9FC' },
  { nom: 'Golden Bloom',    fruits: 'Pomme et fleur de sureau', sansAlcool: true, color: '#F5D76E', deep: '#C9A227', tint: '#FDF6DC' },
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

    document.querySelectorAll('[data-saveur]').forEach(function (el) {
      const champ = el.getAttribute('data-saveur');
      if (champ in s) el.textContent = s[champ];
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
