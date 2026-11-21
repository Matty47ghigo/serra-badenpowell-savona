/**
 * Generatore di eventi calendario (Google Calendar URL & File RFC 5545 .ics)
 */

const createGoogleCalendarUrl = (booking) => {
  const [startH, startM] = booking.timeSlot.split(' - ')[0].split(':');
  const [endH, endM] = booking.timeSlot.split(' - ')[1].split(':');
  const dateFormatted = booking.date.replace(/-/g, '');

  const startIso = `${dateFormatted}T${startH}${startM}00`;
  const endIso = `${dateFormatted}T${endH}${endM}00`;

  const title = encodeURIComponent(`Visita Guidata Serra Baden-Powell Savona (${booking.code})`);
  const details = encodeURIComponent(
    `Visita guidata alla collezione botanica di succulente Caroggio.\n` +
    `Codice Prenotazione: ${booking.code}\n` +
    `Partecipanti: ${booking.visitorsCount} persone\n` +
    `Luogo: Giardini Robert Baden-Powell, Via Pietro Amendola, Savona`
  );
  const location = encodeURIComponent('Giardini Robert Baden-Powell, Via Pietro Amendola, 17100 Savona SV');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
};

const generateIcsContent = (booking) => {
  const [startH, startM] = booking.timeSlot.split(' - ')[0].split(':');
  const [endH, endM] = booking.timeSlot.split(' - ')[1].split(':');
  const dateFormatted = booking.date.replace(/-/g, '');

  const startIso = `${dateFormatted}T${startH}${startM}00`;
  const endIso = `${dateFormatted}T${endH}${endM}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Serra Baden-Powell Savona//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:sbp-${booking.code}@serrabadenpowell.savona.it`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:Visita Guidata Serra Baden-Powell Savona (${booking.code})`,
    `DESCRIPTION:Visita guidata alla collezione botanica Caroggio (700+ cactacee). Partecipanti: ${booking.visitorsCount}. Codice pass: ${booking.code}`,
    `LOCATION:Giardini Robert Baden-Powell\\, Via Pietro Amendola\\, Savona SV`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

module.exports = {
  createGoogleCalendarUrl,
  generateIcsContent
};
