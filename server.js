require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);


app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
