const Doctor = require('../models/Doctor');

exports.createDoctor = async (req, res) => {
  try {
    const existingDoctor = await Doctor.findOne({ email: req.body.email });
    if (existingDoctor) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado'  });
    }
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//TODO: Probar el filtro
exports.listDoctors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialty) {
      filter.specialty = req.query.specialty;
    }
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor no encontrado' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoctor) return res.status(404).json({ error: 'Doctor no encontrado' });
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
