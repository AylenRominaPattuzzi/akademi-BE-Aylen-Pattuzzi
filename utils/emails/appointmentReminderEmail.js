const appointmentReminderEmail = (name, date, doctor) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hola ${name},</h2>
          <p style="color: #555;">Te recordamos que tenés un turno confirmado.</p>
          <p style="color: #555;"><strong>Fecha y hora:</strong> ${date}</p>
          <p style="color: #555;"><strong>Profesional:</strong> Dr./Dra. ${doctor}</p>
          <p style="color: #555;">Por favor, llegá con 10 minutos de anticipación.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">Si no podés asistir, te pedimos que canceles el turno con anticipación desde tu cuenta o comunicándote con recepción.</p>
        </div>
      </div>
    `;
  };
  
  exports.appointmentReminderEmail = appointmentReminderEmail;
  