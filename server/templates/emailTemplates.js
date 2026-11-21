/**
 * Template Email HTML / CSS Professionali e Responsive
 * Testati per Gmail, Apple Mail, Outlook e client mobile.
 * Palette colori: Smeraldo (#047857), Viola Botanico (#581c87), Pietra (#f5f5f4).
 */

const getBaseLayout = (content, previewText = '') => `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Serra Baden-Powell Savona</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f5f5f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292524; line-height: 1.6; }
    table { border-collapse: collapse; }
    img { max-width: 100%; height: auto; }
    .btn { display: inline-block; padding: 12px 24px; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 9999px; text-align: center; }
    .btn-emerald { background-color: #047857; color: #ffffff !important; }
    .btn-outline { background-color: #ffffff; color: #047857 !important; border: 2px solid #047857; }
    .btn-danger { background-color: #dc2626; color: #ffffff !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f4;">
  <!-- Preheader invisibile -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    ${previewText}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f4; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;">
          
          <!-- Header con Brand e Logo -->
          <tr>
            <td style="background-color: #10221c; padding: 32px 24px; text-align: center;">
              <table align="center" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <div style="background-color: #ffffff; border-radius: 16px; padding: 8px; width: 64px; height: 64px; margin: 0 auto 12px auto; display: inline-block;">
                      <img src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=128&q=80" alt="Logo Serra" width="48" height="48" style="display: block; margin: 0 auto; border-radius: 8px;">
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                      SERRA BADEN-POWELL
                    </div>
                    <div style="font-size: 11px; text-transform: uppercase; color: #6ee7b7; letter-spacing: 2px; font-weight: 600; margin-top: 4px;">
                      Collezione Botanica Caroggio • Savona (Villetta)
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenuto Principale -->
          <tr>
            <td style="padding: 36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer Istituzionale -->
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 24px 32px; text-align: center;">
              <p style="font-size: 12px; color: #78716c; margin: 0 0 8px 0; line-height: 1.5;">
                <strong>Serra dei Giardini Robert Baden-Powell</strong><br>
                Via Pietro Amendola, Quartiere Villetta, 17100 Savona (SV)<br>
                Apertura per visite guidate: <em>Ogni Giovedì dalle 14:00 alle 17:00</em>
              </p>
              <p style="font-size: 11px; color: #a8a29e; margin: 12px 0 0 0;">
                Progetto civico <strong>#Giardinetti365</strong> promosso da Comune di Savona, Auser Savona OdV, Isforcoop ETS e Fondazione De Mari.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * 1. Email Conferma Prenotazione con QR Code e Pulsanti Google/Apple Calendar
 */
const getBookingConfirmationTemplate = ({ booking, googleCalUrl, appleCalUrl }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 9999px;">
        Prenotazione Confermata
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #1c1917; margin: 12px 0 8px 0;">
        Ti aspettiamo alla Serra!
      </h1>
      <p style="font-size: 14px; color: #57534e; margin: 0;">
        Gentile <strong>${booking.name}</strong>, la tua visita guidata alla collezione botanica è confermata con successo.
      </p>
    </div>

    <!-- Box Biglietto Digitale -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f4; border: 2px dashed #047857; border-radius: 16px; margin: 24px 0; padding: 20px;">
      <tr>
        <td style="padding-bottom: 16px; border-bottom: 1px solid #e7e5e4;">
          <table width="100%">
            <tr>
              <td>
                <span style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; display: block;">Codice Prenotazione</span>
                <span style="font-family: monospace; font-size: 22px; font-weight: 800; color: #047857;">${booking.code}</span>
              </td>
              <td align="right">
                <span style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; display: block;">Partecipanti</span>
                <span style="font-size: 16px; font-weight: 700; color: #1c1917;">${booking.visitorsCount} persone</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0;">
          <table width="100%">
            <tr>
              <td width="50%">
                <span style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; display: block;">Data Visita (Giovedì)</span>
                <span style="font-size: 15px; font-weight: 700; color: #1c1917;">${booking.date}</span>
              </td>
              <td width="50%">
                <span style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; display: block;">Fascia Oraria</span>
                <span style="font-size: 15px; font-weight: 700; color: #047857;">${booking.timeSlot}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 12px; border-top: 1px solid #e7e5e4;">
          <span style="font-size: 12px; color: #57534e;">
            📍 <strong>Punto d'incontro:</strong> Ingresso Serra, Giardini Baden-Powell, Via Pietro Amendola, Savona (SV).
          </span>
        </td>
      </tr>
    </table>

    <!-- QR Code Pass d'Ingresso -->
    <div style="text-align: center; margin: 28px 0; padding: 20px; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78716c; font-weight: 700; margin: 0 0 12px 0;">
        Il tuo Pass d'Ingresso Digitale
      </p>
      ${
        booking.qrCode
          ? `<img src="${booking.qrCode}" alt="QR Code Prenotazione ${booking.code}" width="160" height="160" style="display: block; margin: 0 auto; border-radius: 8px;">`
          : `<div style="font-family: monospace; font-size: 18px; font-weight: bold; padding: 20px; background: #eee;">${booking.code}</div>`
      }
      <p style="font-size: 12px; color: #78716c; margin: 12px 0 0 0;">
        Mostra questo codice dal tuo smartphone ai volontari all'arrivo per la convalida immediata.
      </p>
    </div>

    <!-- Pulsanti Calendario Affiancati -->
    <div style="margin: 28px 0; text-align: center;">
      <p style="font-size: 13px; font-weight: 600; color: #44403c; margin-bottom: 14px;">
        Aggiungi l'appuntamento al tuo calendario:
      </p>
      <table align="center" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 0 6px;">
            <a href="${googleCalUrl}" target="_blank" class="btn btn-emerald" style="display: inline-block; padding: 12px 20px; font-size: 13px; background-color: #047857; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 700;">
              📅 Google Calendar
            </a>
          </td>
          <td style="padding: 0 6px;">
            <a href="${appleCalUrl}" download class="btn btn-outline" style="display: inline-block; padding: 12px 20px; font-size: 13px; background-color: #ffffff; color: #047857; text-decoration: none; border-radius: 9999px; font-weight: 700; border: 2px solid #047857;">
              🍏 Apple / Outlook (.ics)
            </a>
          </td>
        </tr>
      </table>
    </div>

    <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 14px; margin-top: 24px;">
      <p style="font-size: 12px; color: #92400e; margin: 0; line-height: 1.4;">
        🌿 <strong>Nota utile:</strong> L'ingresso è gratuito (offerta libera e consapevole). Ti invitiamo ad arrivare con 5 minuti di anticipo rispetto all'orario prenotato.
      </p>
    </div>
  `;

  return getBaseLayout(content, `Prenotazione confermata per la Serra Baden-Powell Savona - Codice: ${booking.code}`);
};

/**
 * 2. Email Promemoria 48h prima con pulsante "No, non posso partecipare"
 */
const getReminderTemplate = ({ booking, manageUrl }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #e0e7ff; color: #3730a3; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 9999px;">
        Promemoria Visita Guidata
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 12px 0 8px 0;">
        Ci vediamo questo Giovedì!
      </h1>
      <p style="font-size: 14px; color: #57534e; margin: 0;">
        Gentile <strong>${booking.name}</strong>, ti ricordiamo il tuo appuntamento tra due giorni alla Serra delle Succulente dei Giardini Baden-Powell.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f4; border-radius: 16px; margin: 20px 0; padding: 20px;">
      <tr>
        <td>
          <div style="font-size: 14px; margin-bottom: 8px;">
            📅 <strong>Data:</strong> ${booking.date} (Giovedì)
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            ⏰ <strong>Orario:</strong> ${booking.timeSlot}
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            👥 <strong>Visitatori:</strong> ${booking.visitorsCount} persone
          </div>
          <div style="font-size: 14px;">
            🎫 <strong>Codice Pass:</strong> <span style="font-family: monospace; font-weight: bold; color: #047857;">${booking.code}</span>
          </div>
        </td>
      </tr>
    </table>

    <p style="font-size: 14px; color: #44403c; line-height: 1.5; margin: 20px 0;">
      Per permettere a tutti gli appassionati di partecipare e gestire al meglio i posti limitati, ti chiediamo la cortesia di confermarci la tua presenza.
    </p>

    <!-- Box Disdetta / Cambio Data -->
    <div style="text-align: center; margin: 32px 0; padding: 24px; background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 16px;">
      <p style="font-size: 13px; font-weight: 700; color: #9f1239; margin: 0 0 12px 0;">
        Hai avuto un imprevisto o preferisci cambiare data?
      </p>
      <a href="${manageUrl}" class="btn btn-danger" style="display: inline-block; padding: 12px 24px; font-size: 14px; background-color: #e11d48; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 700;">
        ✕ No, non posso partecipare
      </a>
      <p style="font-size: 11px; color: #881337; margin: 10px 0 0 0;">
        Cliccando potrai scegliere un altro giovedì disponibile oppure annullare la visita con un clic.
      </p>
    </div>
  `;

  return getBaseLayout(content, `Promemoria: la tua visita guidata alla Serra Baden-Powell Savona è giovedì`);
};

/**
 * 3. Email Disdetta da parte dello Staff con Motivazione Cortese
 */
const getStaffCancellationTemplate = ({ booking, reason, rescheduleUrl }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #fee2e2; color: #991b1b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 9999px;">
        Comunicazione dallo Staff
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 12px 0 8px 0;">
        Avviso di Annullamento Visita
      </h1>
      <p style="font-size: 14px; color: #57534e; margin: 0;">
        Gentile <strong>${booking.name}</strong>, siamo spiacenti di doverti comunicare che la visita guidata prevista per giovedì <strong>${booking.date}</strong> (ore ${booking.timeSlot}) è stata annullata.
      </p>
    </div>

    <!-- Motivazione Box -->
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 12px; padding: 18px; margin: 24px 0;">
      <div style="font-size: 11px; text-transform: uppercase; color: #b91c1c; font-weight: 700; margin-bottom: 4px;">
        Motivazione della disdetta:
      </div>
      <div style="font-size: 15px; font-weight: 600; color: #7f1d1d;">
        "${reason || 'Manutenzione straordinaria delle specie cactacee'}"
      </div>
    </div>

    <p style="font-size: 14px; color: #44403c; line-height: 1.5; margin: 20px 0;">
      Ci scusiamo sinceramente per il disagio arrecato. Ci teniamo molto a farti scoprire la nostra collezione, per questo ti invitiamo a prenotare un nuovo giovedì a tua scelta.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${rescheduleUrl}" class="btn btn-emerald" style="display: inline-block; padding: 14px 28px; font-size: 14px; background-color: #047857; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 700;">
        🌿 Scegli un'altra data disponibile
      </a>
    </div>
  `;

  return getBaseLayout(content, `Aggiornamento importante: Visita Serra Baden-Powell Savona`);
};

/**
 * 4. Email Conferma Cambio Giorno da parte dell'Utente
 */
const getRescheduleConfirmationTemplate = ({ booking, googleCalUrl, appleCalUrl }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 9999px;">
        Data Aggiornata con Successo
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 12px 0 8px 0;">
        Nuovo Appuntamento Confermato
      </h1>
      <p style="font-size: 14px; color: #57534e; margin: 0;">
        Gentile <strong>${booking.name}</strong>, la tua prenotazione è stata spostata al nuovo giovedì selezionato.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f4; border: 2px dashed #047857; border-radius: 16px; margin: 20px 0; padding: 20px;">
      <tr>
        <td>
          <div style="font-size: 14px; margin-bottom: 8px;">
            🎫 <strong>Codice Prenotazione:</strong> <span style="font-family: monospace; font-weight: bold; color: #047857;">${booking.code}</span>
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            📅 <strong>Nuova Data:</strong> ${booking.date} (Giovedì)
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            ⏰ <strong>Nuova Fascia Oraria:</strong> ${booking.timeSlot}
          </div>
          <div style="font-size: 14px;">
            👥 <strong>Visitatori:</strong> ${booking.visitorsCount} persone
          </div>
        </td>
      </tr>
    </table>

    <div style="margin: 28px 0; text-align: center;">
      <table align="center" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 0 6px;">
            <a href="${googleCalUrl}" target="_blank" class="btn btn-emerald" style="display: inline-block; padding: 12px 20px; font-size: 13px; background-color: #047857; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 700;">
              📅 Aggiorna Google Calendar
            </a>
          </td>
          <td style="padding: 0 6px;">
            <a href="${appleCalUrl}" download class="btn btn-outline" style="display: inline-block; padding: 12px 20px; font-size: 13px; background-color: #ffffff; color: #047857; text-decoration: none; border-radius: 9999px; font-weight: 700; border: 2px solid #047857;">
              🍏 Nuovo File .ics
            </a>
          </td>
        </tr>
      </table>
    </div>
  `;

  return getBaseLayout(content, `Aggiornamento data prenotazione Serra Baden-Powell Savona`);
};

/**
 * 5. Email Conferma Cancellazione su richiesta dell'Utente
 */
const getUserCancellationTemplate = ({ booking, siteUrl }) => {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #f5f5f4; color: #57534e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 9999px;">
        Disdetta Registrata
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #1c1917; margin: 12px 0 8px 0;">
        Visita Annullata
      </h1>
      <p style="font-size: 14px; color: #57534e; margin: 0;">
        Gentile <strong>${booking.name}</strong>, ti confermiamo che la tua prenotazione (Codice: <code>${booking.code}</code>) per il giorno ${booking.date} è stata annullata.
      </p>
    </div>

    <p style="font-size: 14px; color: #44403c; line-height: 1.5; margin: 20px 0; text-align: center;">
      Grazie per averci avvisato! Liberando il posto hai permesso ad altri visitatori di poter partecipare alla visita guidata.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${siteUrl}" class="btn btn-emerald" style="display: inline-block; padding: 12px 24px; font-size: 13px; background-color: #047857; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 700;">
        Torna al Sito della Serra
      </a>
    </div>
  `;

  return getBaseLayout(content, `Conferma avvenuta disdetta visita Serra Baden-Powell`);
};

module.exports = {
  getBookingConfirmationTemplate,
  getReminderTemplate,
  getStaffCancellationTemplate,
  getRescheduleConfirmationTemplate,
  getUserCancellationTemplate,
};
