# Galleria Fotografica Serra Baden-Powell (@serrabadenpowell)

Incolla qui dentro le foto reali scaricate dal profilo Instagram
**@serrabadenpowell** (https://www.instagram.com/serrabadenpowell).

## Come aggiungere le foto

1. Scarica le foto da Instagram (o scattale direttamente).
2. Rinominale con questi nomi esatti (senza spazi/accenti):
   - `serra-1.jpg` -> Cactacee & Succulente Rare
   - `serra-2.jpg` -> La Serra Storica della Villetta
   - `serra-3.jpg` -> Cura Condivisa & Metodo Esperienziale
   - `serra-4.jpg` -> Fioriture diurne e notturne
   - `serra-5.jpg` -> Percorsi di Visita Guidata
   - `serra-6.jpg` -> Un Bene Comune Restituito alla Città
3. Salvale in questa cartella: `client/public/images/serra/`
4. Riavvia / ricompila il frontend (Docker: `docker-compose up -d --build frontend`).

## Note

- Formato consigliato: `.jpg` (landscape, 1200x800 px circa) per migliori prestazioni.
- Se una foto manca, il sito mostra automaticamente un'immagine di fallback (nessun "broken image").
- Per aggiungere nuove foto, crea nuovi file `serra-7.jpg`, `serra-8.jpg`, ecc.
  e aggiungi le voci nel file `client/src/data/greenhouseData.js` (array `gallery`).