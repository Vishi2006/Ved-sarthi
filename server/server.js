"use strict";

require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Connected to MongoDB: ${process.env.MONGODB_DB || 'healthmeet'}`);
  });
})().catch((err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
