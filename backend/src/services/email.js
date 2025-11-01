const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send booking confirmation email
 */
async function sendConfirmation(booking) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Conferma Prenotazione - Comune di Codroipo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1F4788;">Conferma Prenotazione</h2>
          <p>Gentile <strong>${booking.name}</strong>,</p>
          <p>La sua prenotazione è stata confermata con successo:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Servizio:</strong> ${booking.service}</p>
            <p><strong>Data:</strong> ${new Date(booking.date).toLocaleDateString('it-IT')}</p>
            <p><strong>Ora:</strong> ${booking.time}</p>
            ${booking.notes ? `<p><strong>Note:</strong> ${booking.notes}</p>` : ''}
          </div>
          
          <p>Le ricordiamo di:</p>
          <ul>
            <li>Presentarsi 5 minuti prima dell'orario previsto</li>
            <li>Portare un documento di identità valido</li>
            <li>Portare tutta la documentazione necessaria</li>
          </ul>
          
          <p>Riceverà un promemoria automatico 24 ore prima dell'appuntamento.</p>
          
          <p>Per qualsiasi modifica o cancellazione, contatti il numero: <strong>0432-123456</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Comune di Codroipo<br>
            Piazza Garibaldi, 1 - 33033 Codroipo (UD)<br>
            Tel: 0432-123456 | Email: info@comune.codroipo.ud.it
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

/**
 * Send booking reminder (24h before)
 */
async function sendReminder(booking) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Promemoria Appuntamento - Comune di Codroipo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1F4788;">Promemoria Appuntamento</h2>
          <p>Gentile <strong>${booking.name}</strong>,</p>
          <p>Le ricordiamo il suo appuntamento di domani:</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>Servizio:</strong> ${booking.service}</p>
            <p><strong>Data:</strong> ${new Date(booking.date).toLocaleDateString('it-IT')}</p>
            <p><strong>Ora:</strong> ${booking.time}</p>
          </div>
          
          <p>La aspettiamo presso l'ufficio comunale.</p>
          <p>Per modifiche o cancellazioni: <strong>0432-123456</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Comune di Codroipo<br>
            Piazza Garibaldi, 1 - 33033 Codroipo (UD)
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Reminder email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
}

/**
 * Send cancellation email
 */
async function sendCancellation(booking) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Cancellazione Appuntamento - Comune di Codroipo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Appuntamento Cancellato</h2>
          <p>Gentile <strong>${booking.name}</strong>,</p>
          <p>Il suo appuntamento è stato cancellato:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Servizio:</strong> ${booking.service}</p>
            <p><strong>Data:</strong> ${new Date(booking.date).toLocaleDateString('it-IT')}</p>
            <p><strong>Ora:</strong> ${booking.time}</p>
          </div>
          
          <p>Per prenotare un nuovo appuntamento, contatti il numero: <strong>0432-123456</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            Comune di Codroipo<br>
            Piazza Garibaldi, 1 - 33033 Codroipo (UD)
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw error;
  }
}

module.exports = {
  sendConfirmation,
  sendReminder,
  sendCancellation
};
