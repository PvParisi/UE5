/* ==========================================================
   Pagina QR – dati delle saveur e cambio di saveur
   Nessuna dipendenza, nessun cookie, nessuna richiesta esterna.
   ========================================================== */

/* Le saveur: aggiungere o modificare una saveur = toccare solo qui.
   Nell'URL l'ordine parte da 1: index.html?saveur=2 apre la seconda. */
const SAVEURS = [
  { nom: '[Saveur 1]', indice: '[ex. agrumes]',         color: '#FF8A3D', deep: '#D9561A', tint: '#FFE6D6' },
  { nom: '[Saveur 2]', indice: '[ex. fruits rouges]',   color: '#FF7EB6', deep: '#C93D7E', tint: '#FFE3EF' },
  { nom: '[Saveur 3]', indice: '[ex. herbes fraîches]', color: '#8FD97A', deep: '#3E8F3A', tint: '#E6F6E0' },
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

  // Colori: applicati subito (lo script è nel <head>), così non si vede la saveur 1 prima di quella giusta
  function couleurs(i) {
    const s = SAVEURS[i];
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
