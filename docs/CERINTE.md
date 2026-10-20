# Proiect: Interactive Combinatorics — Balls & Boxes

## 1. Obiectiv general

Construiește un website educațional interactiv, în limba română, care explică vizual și riguros **problemele de plasament combinatoric al bilelor în cutii**.

Website-ul trebuie să fie inspirat de stilul educațional al canalului **3Blue1Brown**, în special de Manim (biblioteca Python pentru animații matematice).

Scopul nu este doar prezentarea formulelor, ci construirea unei intuiții matematice: utilizatorul trebuie să poată vedea de unde provin formulele, să experimenteze cu exemple, să observe tipare și să înțeleagă demonstrațiile.

**Principiul fundamental: fiecare formulă trebuie să poată fi explicată printr-o animație sau o demonstrație vizuală.**

Website-ul trebuie să poată fi găzduit integral pe **GitHub Pages**, fără backend, baze de date sau servicii externe obligatorii.

## 2. Stack tehnologic

Folosește:

- React + TypeScript + Vite.
- Tailwind CSS pentru stilizare.
- SVG pentru diagrame matematice și bile/cutii.
- Framer Motion sau Motion for React pentru animațiile interfeței.
- GSAP, dacă este util pentru animații matematice cu timeline precis.
- KaTeX pentru randarea formulelor LaTeX.
- Vitest pentru teste unitare ale funcțiilor combinatorice.

Poți utiliza alte biblioteci dacă există avantaje concrete, dar evită dependențele inutile.

Nu folosi Manim Python pentru generarea animațiilor în timp real. Reproduce abordarea sa vizuală folosind SVG și animații JavaScript.

Totul trebuie să funcționeze direct în browser.

## 3. Design vizual

### Inspirație: 3Blue1Brown + Manim

Vreau un design minimalist, matematic și elegant.

Caracteristici:

- Fundal aproape negru (#0B0B0F).
- Text alb.
- Formule matematice randate impecabil.
- Animații fluide, geometrice, precise.
- Evidențiere prin culori numai când contribuie la înțelegere.
- Fonturi lizibile.
- Fără gradiente decorative excesive, efecte glassmorphism sau elemente vizuale inutile.

Codificare cromatică sugerată:

- Albastru: bile distincte.
- Alb: bile identice.
- Galben: elementul selectat sau evidențiat.
- Verde: distribuții valide.
- Roșu: distribuții invalide.
- Gri: cutii goale și elemente inactive.

Aspectul trebuie să semene mai mult cu o lecție matematică animată decât cu un dashboard.

Animațiile sunt elementul central al experienței.

## 4. Structura website-ului

### Pagina principală

Titlu: **Combinatorica, explicată vizual**

Subtitlu: „Înțelege 16 tipuri de plasamente prin bile, cutii și animații matematice.”

Afișează o animație introductivă:

1. Apar 5 bile.
2. Apar 3 cutii.
3. Bilele sunt distribuite automat.
4. Se schimbă condițiile.
5. Animația arată cum se modifică numărul distribuțiilor.

Sub animație, afișează o matrice interactivă cu toate cele 16 tipuri de plasament.

### Matricea de concepte

Avem patru tipuri de plasament:

1. Arbitrar.
2. Injectiv.
3. Surjectiv.
4. Bijectiv.

Și patru combinații:

1. Bile distincte, cutii distincte.
2. Bile distincte, cutii identice.
3. Bile identice, cutii distincte.
4. Bile identice, cutii identice.

Rezultă 16 cazuri.

Fiecare celulă trebuie să afișeze formula și să poată fi selectată pentru a deschide lecția corespunzătoare.

## 5. Conținutul matematic obligatoriu

Folosește notațiile:

- n = numărul bilelor.
- r = numărul cutiilor.
- S(n,r) = numărul Stirling de speța a II-a.
- p_{\le r}(n) = numărul partițiilor întregi ale lui n în cel mult r părți pozitive.
- p_r(n) = numărul partițiilor întregi ale lui n în exact r părți pozitive.

### A. Plasamente arbitrare

Cutiile pot rămâne goale, iar o cutie poate conține mai multe bile.

| Bile | Cutii | Formula |
|---|---|---|
| Distincte | Distincte | r^n |
| Distincte | Identice | Σ S(n,k), k=0,...,min(n,r) |
| Identice | Distincte | C(n+r−1,r−1) |
| Identice | Identice | p_{\le r}(n) |

### B. Plasamente injective

Fiecare cutie conține cel mult o bilă.

| Bile | Cutii | Formula |
|---|---|---|
| Distincte | Distincte | r!/(r−n)! |
| Distincte | Identice | 1 |
| Identice | Distincte | C(r,n) |
| Identice | Identice | 1 |

Toate formulele sunt valabile pentru n ≤ r. Altfel, rezultatul este 0.

### C. Plasamente surjective

Fiecare cutie trebuie să conțină cel puțin o bilă.

| Bile | Cutii | Formula |
|---|---|---|
| Distincte | Distincte | r!·S(n,r) |
| Distincte | Identice | S(n,r) |
| Identice | Distincte | C(n−1,r−1) |
| Identice | Identice | p_r(n) |

Toate formulele sunt valabile pentru n ≥ r. Altfel, rezultatul este 0.

### D. Plasamente bijective

Fiecare cutie conține exact o bilă.

| Bile | Cutii | Formula |
|---|---|---|
| Distincte | Distincte | n! |
| Distincte | Identice | 1 |
| Identice | Distincte | 1 |
| Identice | Identice | 1 |

Valabile exclusiv pentru n = r. Altfel, rezultatul este 0.

**Cazurile-limită:** implementează explicit n=0 și r=0, cu convenții matematice coerente, inclusiv S(0,0)=1 și partiția vidă. Explică aceste convenții separat, fără să aplici formule cu factoriale sau binomiale nedefinite.

Verifică riguros toate formulele și condițiile.

## 6. Simulatorul interactiv de bile și cutii

Aceasta este cea mai importantă funcționalitate.

Creează un simulator vizual în care utilizatorul poate modifica:

- Numărul bilelor n, între 0 și 8.
- Numărul cutiilor r, între 0 și 6.
- Bile distincte / identice.
- Cutii distincte / identice.
- Tipul plasamentului.

Bilele trebuie să poată fi mutate cu drag-and-drop între cutii.

La fiecare modificare, actualizează în timp real:

1. Formula matematică.
2. Numărul total de distribuții.
3. Distribuția curentă.
4. Validitatea distribuției pentru condiția selectată.
5. Explicația motivului pentru care distribuția este validă sau invalidă.

Adaugă un buton **„Generează toate distribuțiile”**.

Pentru valori mici ale lui n și r, generează efectiv toate distribuțiile distincte.

Afișează-le ca o galerie animată.

Utilizatorul trebuie să poată naviga prin ele folosind butoanele anterior/următor sau un slider.

Pentru cutii identice, distribuțiile care diferă doar prin permutarea cutiilor trebuie considerate aceeași distribuție.

Pentru bile identice, permutarea bilelor nu trebuie să creeze configurații noi.

Implementează o reprezentare canonică a configurațiilor pentru a elimina duplicatele corect.

Pentru valori mari, dezactivează enumerarea completă atunci când numărul configurațiilor depășește un prag rezonabil, fără să blochezi interfața.

## 7. Animații matematice obligatorii

### Animația 1: De unde apare r^n?

Prezintă trei bile distincte și două cutii distincte.

Arată că fiecare bilă are două alegeri independente.

Construiește un arbore al posibilităților.

Evidențiază vizual:

2 × 2 × 2 = 2³ = 8.

Generalizează animația la r^n.

### Animația 2: Injectivitatea

Arată cum bilele intră una câte una în cutii.

După ocuparea unei cutii, aceasta nu mai poate primi altă bilă.

Afișează progresiv:

r · (r−1) · ... · (r−n+1)

Transformă expresia animat în:

r!/(r−n)!

Arată și de ce pentru bile identice și cutii distincte rezultatul este C(r,n), nu numărul aranjamentelor.

### Animația 3: Surjectivitatea

Arată distribuții în care unele cutii rămân goale.

Marchează cu roșu distribuțiile invalide.

Explică principiul includerii și excluderii.

Construiește progresiv formula:

Σ (-1)^k C(r,k)(r−k)^n.

Folosește exemple mici pentru a arăta de ce se scad distribuțiile cu o cutie goală, apoi se adaugă cele cu două cutii goale etc.

### Animația 4: Bijectivitatea

Prezintă n bile distincte și n cutii distincte.

Distribuie bilele pe rând.

Arată numărul de alegeri rămase:

n, n−1, n−2, ..., 1.

Construiește:

n!

Apoi transformă vizual cutiile în cutii identice.

Arată de ce toate cele n! permutări devin o singură distribuție.

### Animația 5: Numerele Stirling

Explică intuitiv semnificația lui S(n,k).

Folosește 4 bile distincte și 2 cutii identice.

Generează vizual cele 7 partiții.

Apoi demonstrează relația de recurență:

S(n,k) = k·S(n−1,k) + S(n−1,k−1).

Animația trebuie să distingă două situații:

1. Ultima bilă se adaugă uneia dintre cele k grupe deja existente.
2. Ultima bilă formează singură o grupă nouă.

Arată un triunghi interactiv cu valorile Stirling, similar triunghiului lui Pascal.

La selectarea unei valori, arată vizual partițiile corespunzătoare.

### Animația 6: Stars and Bars

Explică plasarea bilelor identice în cutii distincte.

Reprezintă bilele prin stele și delimitările cutiilor prin bare.

Exemplu:

★★|★|★★

Arată cum schimbarea poziției barelor produce distribuții diferite.

Construiește formula:

C(n+r−1,r−1)

Apoi explică versiunea surjectivă prin cerința de cel puțin o bilă în fiecare cutie:

C(n−1,r−1).

Utilizatorul trebuie să poată muta barele interactiv.

### Animația 7: Partiții întregi

Prezintă bile identice și cutii identice.

Exemplu: n=5, r=3.

Construiește vizual cele cinci partiții:

5  
4+1  
3+2  
3+1+1  
2+2+1

Afișează-le prin diagrame Ferrers/Young.

Utilizatorul trebuie să poată trece între reprezentarea cu bile în cutii și diagrama Ferrers.

Explică diferența dintre:

- Partiții în cel mult r părți.
- Partiții în exact r părți.

Demonstrează vizual corespondența:

p_r(n) = p_{\le r}(n−r).

## 8. Sistem de lecții interactive

Pentru fiecare dintre cele 16 cazuri, creează o lecție dedicată cu următoarea structură:

**Etapa 1 — Problema**

Prezintă situația cu bile și cutii.

**Etapa 2 — Experimentează**

Permite utilizatorului să genereze manual câteva distribuții.

**Etapa 3 — Descoperă tiparul**

Afișează exemple pentru n și r mici și valorile rezultate.

**Etapa 4 — Demonstrația**

Explică formula pas cu pas, sincronizând explicațiile cu animațiile.

**Etapa 5 — Formula generală**

Afișează formula într-o secțiune clară, cu explicația fiecărui simbol.

**Etapa 6 — Verifică înțelegerea**

Oferă un exercițiu interactiv cu feedback imediat.

Nu transforma lecțiile în blocuri lungi de text static.

Preferă animațiile narative, cu butoane „Următorul pas”, „Înapoi” și „Reia demonstrația”.

## 9. Modul de comparație

Creează o funcționalitate prin care utilizatorul poate compara simultan două tipuri de plasament.

Exemple:

- Arbitrar vs. injectiv.
- Injectiv vs. bijectiv.
- Surjectiv vs. bijectiv.
- Cutiile distincte vs. cutiile identice.
- Bilele distincte vs. bilele identice.

Afișează două simulatoare sincronizate.

Când utilizatorul schimbă n sau r, ambele simulatoare trebuie actualizate.

Evidențiază animațional distribuțiile care dispar sau devin echivalente atunci când se schimbă condițiile.

Exemplu: dacă transformăm cutiile distincte în cutii identice, arată cum mai multe distribuții distincte se contopesc într-o singură clasă de echivalență.

## 10. Vizualizarea relațiilor matematice

Creează o hartă interactivă a conceptelor.

Conectează vizual:

- Regula produsului.
- Permutări.
- Aranjamente.
- Combinări.
- Combinări cu repetiție.
- Numere Stirling de speța a II-a.
- Numere Bell.
- Partiții întregi.
- Principiul includerii și excluderii.
- Funcții injective.
- Funcții surjective.
- Funcții bijective.

La selectarea unui concept, evidențiază formulele și tipurile de plasament în care este utilizat.

Explică legătura dintre plasamente și funcțiile dintre mulțimi, precizând distincțiile necesare când obiectele sau cutiile sunt identice.

## 11. Exerciții interactive

Adaugă un modul de practică.

Generează automat probleme precum:

„În câte moduri putem plasa 5 bile distincte în 3 cutii identice, fără să lăsăm vreo cutie goală?”

Utilizatorul trebuie să poată:

- Selecta formula corectă.
- Introduce răspunsul numeric.
- Cere un indiciu.
- Vizualiza rezolvarea animată.
- Verifica răspunsul.

Adaugă dificultăți progresive:

- Începător: identificarea formulei.
- Intermediar: calcul numeric.
- Avansat: demonstrații și combinarea principiilor.

## 12. Controlul animațiilor

Fiecare animație matematică importantă trebuie să aibă:

- Play/Pause.
- Restart.
- Step forward.
- Step backward.
- Controlul vitezei: 0.5×, 1×, 1.5× și 2×.
- Un timeline vizual, când este posibil.

Preferă animațiile deterministe, în care navigarea la un anumit pas produce întotdeauna aceeași stare.

Nu implementa o colecție de animații decorative independente de explicația matematică.

## 13. Cerințe de implementare

Separă clar:

- Logica matematică.
- Enumerarea configurațiilor.
- Validarea distribuțiilor.
- Componentele vizuale.
- Timeline-urile animațiilor.
- Conținutul lecțiilor.

Folosește BigInt pentru calculele combinatorice exacte acolo unde este necesar.

Implementează și testează funcțiile matematice pentru:

- Factorial.
- Coeficienți binomiali.
- Numere Stirling de speța a II-a.
- Numere Bell.
- Partiții întregi.
- Numărarea configurațiilor pentru toate cele 16 cazuri.

Verifică formulele prin enumerare exhaustivă pentru valori mici ale lui n și r.

Asigură-te că sunt tratate corect și cazurile imposibile.

Adaugă suport pentru `prefers-reduced-motion`, navigare prin tastatură și ecrane mobile.

Salvează progresul lecțiilor și preferințele local, în localStorage, fără cont de utilizator.

## 14. Publicarea pe GitHub Pages

Proiectul trebuie să poată fi publicat static.

Configurează:

- Vite cu base path compatibil cu GitHub Pages.
- GitHub Actions pentru build și deploy automat.
- Rutare compatibilă cu hosting static, fără erori la refresh.
- Un README complet cu instrucțiuni de instalare, testare și publicare.

Comenzile așteptate:

npm install  
npm run dev  
npm run build  
npm run test

Nu utiliza backend sau servicii cu costuri recurente.

## 15. Criterii de calitate și finalizare

Nu vreau un simplu calculator care afișează rezultatele.

Vreau un instrument prin care cineva care nu știe combinatorică să poată descoperi intuitiv formulele și apoi să înțeleagă demonstrațiile lor matematice.

Prioritizează, în această ordine:

1. Corectitudinea matematică.
2. Simulatorul interactiv de bile și cutii.
3. Animațiile care demonstrează formulele.
4. Calitatea explicațiilor.
5. Navigarea între cele 16 cazuri.
6. Designul și rafinamentul vizual.
7. Funcționalitățile suplimentare.

Nu lăsa butoane decorative sau funcționalități simulate. Dacă un control apare în interfață, trebuie să funcționeze.

Construiește componente reutilizabile pentru a evita implementarea separată a 16 simulatoare.

Înainte să consideri proiectul finalizat:

- Rulează testele.
- Verifică build-ul de producție.
- Compară rezultatele formulelor cu enumerarea efectivă.
- Verifică animațiile și interacțiunile.
- Verifică funcționarea pe mobil.
- Verifică faptul că proiectul poate fi publicat pe GitHub Pages.

**Rezultatul final trebuie să fie un website matematic interactiv, riguros și vizual, cu animații în stil Manim/3Blue1Brown, construit în jurul bilelor și cutiilor, capabil să explice toate cele 16 tipuri de plasament.**

Începe cu arhitectura proiectului și implementează funcționalitățile propriu-zise. Nu te opri la un mockup, o descriere sau un plan. Dacă este necesar, lucrează în etape, dar livrează o aplicație funcțională.