# Praxisy — Prompt di riferimento

Questo documento è il brief master del sito **praxisy.info**: cosa è Praxisy, come deve essere raccontato, come funziona tecnicamente il sito multilingua e quali regole di contenuto vanno rispettate in ogni modifica futura. Va aggiornato ogni volta che cambia il posizionamento o l'architettura.

## 1. Cos'è Praxisy

Praxisy è una piattaforma AI-assisted per la governance locale: genera documenti (delibere, determine, bandi, verbali), gestisce segnalazioni dei cittadini, sondaggi e partecipazione civica, con **supervisione umana obbligatoria** su ogni output generato (human-in-the-loop, mai automazione cieca).

- **Modello AI**: Claude AI (Anthropic).
- **Fondatore**: Marco Portaro (Founder & CEO, Praxisy / Porty).
- **Stato reale**: piattaforma demo funzionante, 13 comuni simulati (Milano, Palma, Bolzano + 10 comuni del Nord Italia). Nessun comune reale è ancora cliente pagante: il progetto è in cerca dei primi piloti.
- **Contatto**: marcoportaro02@gmail.com · Instagram @praxisy.

## 2. Posizionamento: US-first, poi globale

Il sito racconta un percorso a fasi, riassunto nella sezione "Where We Start" / "Da dove partiamo":

1. **Stati Uniti — mercato di lancio primario.** Texas, California e Mississippi sono i primi stati target (analisi interna, non ancora una partnership o un pilota attivo — va sempre dichiarato).
2. **Italia — origine.** Dove Praxisy è nata, dove vivono le demo reali.
3. **Resto d'Europa — prossimo passo**, a partire dalla Francia, con una logica di crescita comune.
4. **Globale — visione finale**: infrastruttura AI di riferimento per la governance locale ovunque serva fare di più con meno.

**Regola chiave**: la versione **inglese (EN)** è quella "americana" — è l'unica in cui i riferimenti a Italia ed Europa sono nascosti/rimossi dal narrative (vedi §4). Le altre lingue (FR, DE, ES, EU, PL) mantengono i dati italiani reali E aggiungono contenuti dedicati al proprio mercato.

## 3. Regole di contenuto (non negoziabili)

1. **Mai inventare dati.** Ogni statistica citata deve avere una fonte reale e verificabile (agenzia statistica, ministero, istituto di ricerca). Se un dato non è verificato, va segnalato esplicitamente ("da verificare", "stima interna, non verificata da terzi").
2. **Distinguere sempre reale da target.** Le 13 demo comunali sono un dato reale. Tutto ciò che riguarda tempi di risposta, percentuali di efficienza, ROI stimato sono **obiettivi della fase pilota**, non risultati misurati — va sempre esplicitato nel testo o nei disclaimer.
3. **Non promettere una struttura che non esiste.** Il progetto è guidato da un solo founder. La sezione "Il team che stiamo costruendo" dichiara apertamente le competenze mancanti (advisor legale, privacy/sicurezza, sviluppo full-stack) invece di far credere a un team già formato.
4. **Informazioni personali sul founder ridotte al minimo.** Nella sezione Founder compaiono solo: nome (Marco Portaro, accanto al logo), ruolo, hobby/interessi, competenze core. **Non** ci sono: certificazioni professionali, il progetto collaterale Porty Clothes, la filosofia "Fail fast, learn faster", la spiegazione etimologica di "Praxis". Se in futuro si vuole reintrodurre uno di questi elementi, farlo con parsimonia.
5. **Numeri e statistiche mai standardizzati tra le lingue.** Ogni mercato ha le proprie cifre reali (vedi §5) — non riciclare i dati italiani traducendoli e basta.

## 4. Architettura multilingua (i18n)

- **Lingua base**: l'italiano è scritto direttamente nel markup di `index.html` (attributi `data-i18n="chiave"`). È il fallback per qualunque chiave mancante in un pack.
- **Pack di override**: `i18n-en.js`, `i18n-fr.js`, `i18n-de.js`, `i18n-es.js`, `i18n-eu.js`, `i18n-pl.js` — ciascuno espone `window.PRAXISY_I18N.<lingua>` con le sole chiavi che differiscono dall'italiano.
- **Controller**: `i18n.js` — cattura il testo base al load, applica il pack scelto, gestisce `<html lang>`, `body[data-lang]`, rilevamento lingua browser (IT e PL hanno auto-detect dal locale del browser; tutte le altre lingue non mappate cadono su EN di default), persistenza in `localStorage`.
- **Lingue attive**: `it`, `en`, `fr`, `de`, `es`, `eu` (framing europeo generale, testo in inglese), `pl`.

### Meccanismi di visibilità condizionale

- **`.us-hide`** (`praxisy.css`): nasconde elementi *solo* quando `body[data-lang="en"]`. Usato per rimuovere dal racconto americano tutto ciò che parla di Italia/Europa (box dati Italia, sezione Mercato, fasi "Origine"/"Resto d'Europa" di Where We Start, card di confronto prezzi italiana).
- **`[data-lang-only="xx"]`** (`praxisy.css`): mostra un elemento *solo* per la lingua `xx`. Usato per i box "Stessa crisi, stessa urgenza" dedicati a ciascun mercato (`prob.us`, `prob.fr`, `prob.de`, `prob.es`, `prob.eu`, `prob.pl`) nella sezione "Il problema".
- **`data-count-{lang}`** (`praxisy.js` + `index.html`): i contatori animati (`data-count`) possono avere un valore diverso per lingua; `i18n.js` corregge istantaneamente i numeri già animati quando si cambia lingua a metà pagina.

### Quando aggiungi una lingua nuova

1. Aggiungere il codice a `SUPPORTED`/`DOC_LANG` in `i18n.js` e, se serve, l'auto-detect dal locale browser.
2. Aggiungere il pill `<button class="lang-pill" data-lang="xx">` nella topbar.
3. Aggiungere `<script src="i18n-xx.js"></script>` prima di `i18n.js`.
4. Creare `i18n-xx.js` con traduzione completa (verificare con un diff delle chiavi contro `index.html` — zero chiavi mancanti, a parte i box `prob.*` e `start.*` di altre lingue che restano nascosti).
5. Ricercare dati reali e citabili per quel mercato (debito/finanza dei comuni, crisi di ricambio del personale, divario digitale, fondi pubblici/UE) e costruire il box dedicato + le 3 statistiche animate di "Perché adesso" con `data-count-xx`.
6. Personalizzare la card "mercato target" (chiave `mod.7h`/`mod.7p`) invece di ripetere le città italiane.
7. Verificare con `node --check` su tutti i file JS, bilanciamento tag `<section>`/`<div>`, e un pass Playwright su tutte le lingue/breakpoint (zero overflow, zero errori console, zero `data-i18n` vuoti).

## 5. Dati reali per mercato (già in uso)

| Mercato | Comuni/enti | Debito/finanza | Personale in uscita | Divario digitale |
|---|---|---|---|---|
| Italia | dato reale: 13 demo | PA italiana: 30–40 mld €/anno inefficienza | 32% entro 2028 (Ragioneria Generale) | — |
| USA | ~90.000 governi locali (Census Bureau) | — | ~25% vicino alla pensione (ICMA/MissionSquare) | 15% famiglie senza banda larga (NTIA 2023) |
| Francia | 34.935 communes (INSEE gen. 2024) | debito €225,8 mld, +4,6% (Cour des comptes/OFGL) | 39% posti da coprire entro 2030 (France Stratégie) | 15% illectronisme (Sénat) |
| Germania | ~10.800 Gemeinden (Destatis dic. 2024) | arretrato investimenti €215,7 mld, +15,9% (KfW-Kommunalpanel) | 25% in pensione entro 2030 (PwC) | 59% cittadini mai online per pratiche PA (Behörden-Digimeter) |
| Spagna | 8.131 municipios, 84% <5.000 ab. (INE) | debito aggregato >20 mld € (Min. Hacienda) | 26% in pensione in 10 anni (Función Pública) | solo 1 su 4 comuni <10k ha usato fondi Next Gen EU (IDL-UAM) |
| Polonia | 2.478 gminy (GUS) | debito JST >111 mld zł, +13% anno su anno (Min. Finansów) | 42% uffici con difficoltà di reclutamento (GazetaPrawna.pl) | 51% senza competenze digitali di base (GUS 2024) |

Tutti i dati sopra vanno **verificati e aggiornati** prima di qualunque pubblicazione ufficiale/investor-facing — sono citati da fonti pubbliche ma non certificati da terzi.

## 6. Struttura delle sezioni (ordine attuale della pagina)

1. Topbar lingua + nav
2. Hero (headline, lead, CTA demo/contatti)
3. Where We Start / Da dove partiamo (4 fasi, 2 nascoste per EN)
4. Prima/dopo (prima con AI vs senza)
5. Pilastri (trasparenza + velocità)
6. Prodotto (7 moduli + 5 approfondimenti feature)
7. Efficienza e risultati (tabella tempi, target pilota)
8. Governance AI e conformità
9. Affidabilità e conformità (tabella normative)
10. Costo (3 fasce prezzo + case study Italia/USA)
11. Perché adesso (3 statistiche animate per lingua)
12. Banner "Powered by Claude AI"
13. Il problema (tabella dati Italia + box dedicato per lingua)
14. Mercato e posizionamento (nascosto per EN)
15. Metodologia
16. Roadmap
17. Per i comuni (candidatura pilota)
18. Fondatore (profilo minimale, team che si sta costruendo, perché lo diciamo apertamente)
19. FAQ
20. CTA finale + cerchiamo collaboratori
21. Footer

**Nota**: la marquee scorrevole e i 4 box statistici che stavano subito sotto l'hero sono stati rimossi (non reintrodurli senza una richiesta esplicita).

## 7. Design system (praxisy.css)

- **Colori**: sfondo `--bg:#F5F7F5`, superficie `--surface:#FFFFFF`, testo `--ink:#121A15` (e varianti `--ink-2/3/4`), verde primario `--green:#0E7A47` con `--green-700`, `--green-900`, `--green-bright`, `--green-tint`; negativo `--neg:#B0492F`; warning `--warn:#9A6B12`.
- **Hero**: sfondo crema `#F8F3E9` (non verde).
- **Font**: `--sans` Helvetica Neue stack; `--mono` IBM Plex Mono, self-hosted in `/fonts/` (mai ripristinare il CDN Google Fonts — coerenza con le promesse privacy del sito).
- **Border radius**: `--r-sm/--r/--r-lg/--r-xl` da 8 a 30px.

## 8. Cose da non fare

- Non reintrodurre riferimenti a Italia/Europa nella versione EN senza che sia una richiesta esplicita.
- Non aggiungere statistiche senza fonte reale citata.
- Non espandere la sezione Founder con altri dettagli personali senza richiesta esplicita.
- Non tradurre un pack lingua copiando semplicemente l'italiano — ogni nuova sezione va tradotta per intero, verificata con il diff delle chiavi.
- Non fare `git push --force` o cancellare branch senza conferma esplicita.
