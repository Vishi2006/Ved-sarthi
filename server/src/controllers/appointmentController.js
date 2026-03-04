const Appointment = require("../models/Appointment");

const listMyAppointments = async (req, res) => {
  const rows = await Appointment.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json({ appointments: rows });
};

const createAppointment = async (req, res) => {
  const { doctorName, specialty, address, datetime } = req.body || {};
  if (!doctorName || !datetime) {
    return res.status(400).json({ message: "doctorName and datetime are required" });
  }

  const appt = await Appointment.create({
    userId: req.userId,
    doctorName: String(doctorName),
    specialty: specialty ? String(specialty) : "",
    address: address ? String(address) : "",
    datetime: new Date(datetime),
    status: "pending",
  });

  res.status(201).json({ appointment: appt });
};

module.exports = { listMyAppointments, createAppointment };
