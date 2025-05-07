require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const HttpError = require('./utils/http-error');

const app = express();

app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointment', appointmentRoutes);

// Ruta no encontrada
app.use((req, res, next) => {
  const error = new HttpError('Ruta no encontrada', 404);
  next(error);
});


app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ error: error.message || 'Ocurrió un error desconocido' });
});

// Iniciar servidor
app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
