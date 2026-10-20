# Combinatorica — bile și cutii

Aplicație educațională interactivă în limba română, cu un stil matematic minimalist: negru pur, alb pur, formule KaTeX și animații SVG.

## Funcționalități

- Tabel cu cele 16 tipuri de plasamente, formule și rezultate exacte.
- Scenă cu bile și cutii, mutare manuală, redare și parcurgerea distribuțiilor distincte.
- Tabel cu numere Stirling de speța a II-a și totaluri Bell.
- Tabel cu partiții întregi în exact k sau cel mult k părți.
- Calcule BigInt, convenții explicite pentru zero, navigare prin tastatură și reduced-motion.

## Pornire locală

Necesită Node.js 22+ și npm.

```sh
npm ci
npm run dev
```

```sh
npm run test
npm run build
```

Aplicația este complet statică, fără backend, conturi sau servicii externe obligatorii. Fonturile formulelor sunt incluse în build.

## GitHub Pages

Repository: https://github.com/e-andrei/combinatorica-vizuala

Adresa configurată pentru site: https://e-andrei.github.io/combinatorica-vizuala/

Workflow-ul `.github/workflows/pages.yml` instalează dependențele, rulează testele, construiește aplicația și publică pe GitHub Pages la push pe `main`. Sursa Pages este GitHub Actions. Paginile folosesc hash-uri (`#plasamente`, `#stirling`, `#partitii`), iar `base: './'` permite găzduirea în subdirector.

## CONTINUĂ DE AICI — jurnal de continuitate

Actualizat: 20 octombrie 2026. Citește acest jurnal înainte de modificări și actualizează-l după fiecare etapă importantă și înainte de încheierea sesiunii.

### Direcția acceptată

Păstrează interfața simplă alb/negru: pagina principală cu tabel și o singură animație, plus cele două pagini numerice cerute ulterior. Nu reintroduce practica, dashboard-ul, graful sau vechea navigare amplă. Cerința inițială se află în `docs/CERINTE.md`, dar cerințele ulterioare de simplificare au prioritate.

### Stare verificată

- Cele 16 cazuri sunt implementate cu rezultate BigInt și reprezentare canonică fără duplicate.
- 20 de teste trecute: comparație cu enumerare brută independentă pentru 480 combinații și verificarea întregului domeniu al simulatorului, 1.008 combinații.
- Instalare curată cu `npm ci`, teste și build de producție verificate înainte de publicare. Fișierul lock nu conține referințe către directoare locale.
- Simulatorul permite n=0…8 și r=0…6. Enumerarea este limitată la 1.200 de distribuții; peste prag se arată un exemplu valid și explicația limitei.
- Tabelele numerice permit n/k de la 0 la 20; limita implicită este 10. În modul „cel mult k”, totalul p(n) NU este suma valorilor cumulative de pe rând.
- Verificat în browser: navigare, refresh, selectarea formulelor, redare/pauză, cursor, mutare prin tastatură și pointer, cazuri-limită, modurile exact/cel mult.
- Verificate viewporturi desktop și mobil, fără depășirea lățimii paginii; tabelele au scroll local. Testarea pe telefon real și cu cititor de ecran rămâne recomandată.
- Publicare: repository creat și Pages configurat; prima rulare de deployment este în curs de pregătire. Nu considera site-ul live până la confirmarea workflow-ului și a URL-ului.
- Colaborare: invitarea utilizatorului `m0t0gna` este în curs.

### Arhitectură

- `src/App.tsx`: navigarea discretă, tabelul celor 16 cazuri și animația.
- `src/NumberTables.tsx`: tabelele Stirling și partiții întregi.
- `src/Board.tsx`: scena SVG, interacțiuni pointer/tastatură.
- `src/Formula.tsx`: KaTeX.
- `src/math.ts`: formule BigInt și convenții pentru zero.
- `src/configurations.ts`: enumerare canonică și validare.
- `src/content.ts`: formule și argumente matematice.
- `src/math.test.ts`: verificări independente.
- `src/style.css`: aspectul alb/negru și layoutul responsive.
- `Demonstrations.tsx`, `ConceptGraph.tsx`, `Timeline.tsx`, `useTimeline.ts`: componente istorice neimportate de interfața actuală; nu le reactiva automat.

### Pentru următoarea sesiune

1. Verifică acest jurnal și starea Git înainte de editare.
2. Păstrează testele matematice și simplitatea interfeței.
3. Rulează `npm run test` și `npm run build` după modificări relevante.
4. După publicare, consemnează rezultatul real al deployment-ului și al invitației de colaborare.

## Convenții matematice

Pentru n=r=0 există exact o distribuție, cea vidă, validă pentru toate condițiile. Zero bile în cutii existente admit o distribuție arbitrară/injectivă, dar niciuna surjectivă/bijectivă. Bile pozitive în zero cutii nu admit nicio distribuție. `S(0,0)=1`, partiția vidă se numără o dată, iar `0^0=1` în context combinatoric. Factorialele și binomialele nedefinite nu sunt evaluate în cazurile-limită.
