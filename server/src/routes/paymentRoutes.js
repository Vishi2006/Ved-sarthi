const express = require("express");
const { createPaymentIntent } = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/intent", requireAuth, createPaymentIntent);

module.exports = router;
