"use strict";

require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
