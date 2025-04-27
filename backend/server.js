const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// Data Model
const ReadingSchema = new mongoose.Schema({
  temperature: Number,
  ph: Number,
  dissolvedOxygen: Number,
  ammonia: Number,
  turbidity: Number,
  timestamp: { type: Date, default: Date.now },
});
const Reading = mongoose.model("Reading", ReadingSchema);

// Save Data Endpoint
app.post("/api/readings", async (req, res) => {
  try {
    const reading = new Reading(req.body);
    await reading.save();
    res.status(201).send(reading);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Fetch Data Endpoint
app.get("/api/readings", async (req, res) => {
  const readings = await Reading.find().sort({ timestamp: -1 });
  res.send(readings);
});

app.listen(3000, () => console.log("Server running on port 3000"));
