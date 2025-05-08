const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ email, name, link }) => {
  const mailOptions = {
    from: `"Tu App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hola ${name},</h2>
          <p style="color: #555;">Recibimos una solicitud para restablecer tu contraseña.</p>
          <p style="color: #555;">Haz clic en el botón de abajo para continuar:</p>
          <a href="${link}" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
          <p style="color: #999; margin-top: 20px;">Este enlace expirará en 15 minutos.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error('Error al enviar el correo');
  }
};

module.exports = sendEmail;
