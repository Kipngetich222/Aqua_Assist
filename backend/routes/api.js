const express = require("express");
const router = express.Router();
const Reading = require("../models/Reading");
const twilio = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

// Save data + SMS alert if thresholds breached
router.post("/readings", async (req, res) => {
  try {
    const { ammonia, dissolvedOxygen } = req.body;
    const reading = new Reading(req.body);
    await reading.save();

    if (ammonia > 0.5 || dissolvedOxygen < 5) {
      await twilio.messages.create({
        body: `ALERT: Ammonia ${ammonia} mg/L | DO ${dissolvedOxygen} mg/L`,
        from: process.env.TWILIO_PHONE,
        to: "+0987654321", // Farmer's phone
      });
    }
    res.status(201).send(reading);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
