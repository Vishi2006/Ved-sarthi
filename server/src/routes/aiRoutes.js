const express = require("express");
const multer = require("multer");
const { chat, uploadReport, getChatHistory } = require("../controllers/aiControllers");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "AI routes working", multer: "configured" });
});

// Optional auth middleware - attaches userId if token is valid, but doesn't fail if missing
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.sub;
      console.log("✅ User authenticated:", req.userId);
    } catch (err) {
      console.log("⚠️ Invalid token, proceeding as guest");
    }
  } else {
    console.log("⚠️ No token provided, proceeding as guest");
  }
  next();
};

router.get("/chat-history", requireAuth, getChatHistory);
router.post("/chat", requireAuth, chat);
router.post("/upload-report", optionalAuth, upload.single("report"), uploadReport);

module.exports = router;
