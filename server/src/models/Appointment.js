const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorName: { type: String, required: true, trim: true },
    specialty: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    datetime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
