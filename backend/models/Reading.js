const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  ph: { type: Number, required: true },
  dissolvedOxygen: { type: Number, required: true },
  ammonia: { type: Number, required: true },
  turbidity: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reading", ReadingSchema);
