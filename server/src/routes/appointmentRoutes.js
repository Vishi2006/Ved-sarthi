const express = require("express");
const {
  listMyAppointments,
  createAppointment,
} = require("../controllers/appointmentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, listMyAppointments);
router.post("/", requireAuth, createAppointment);

module.exports = router;
