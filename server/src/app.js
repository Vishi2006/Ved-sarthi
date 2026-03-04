const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── REQUEST LOGGER ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});


app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "HealthMeet API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: `No API route for ${req.path}` });
});

// Error handling middleware - MUST be last
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message, err.stack);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
  }
});

module.exports = app;
