const express = require("express");
const router = express.Router();

const Emotion = require("../models/Emotion");
const { detectEmotion } = require("../services/geminiService");

router.post("/detect", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const emotion = await detectEmotion(image);
    res.json({ emotion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { userId, emotion } = req.body;

    const mood = await Emotion.create({
      userId,
      emotion,
    });

    res.json(mood);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const history = await Emotion.find({
      userId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;