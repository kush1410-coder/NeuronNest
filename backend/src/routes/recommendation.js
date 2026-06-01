const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    emotion,
    storiesRead,
    memoryScore,
    mathScore,
  } = req.body;

  let game = "Memory Match";
  let story = "Animal Adventure";
  let reason = "";

  if (emotion === "happy") {
    game = "Math Wizard";
    story = "Space Explorer";
    reason =
      "You seem energetic and ready for challenges!";
  }

  if (emotion === "curious") {
    game = "Animal Quiz";
    story = "Jungle Discovery";
    reason =
      "Curious minds love exploring new facts.";
  }

  if (emotion === "excited") {
    game = "Emoji Hunt";
    story = "Rocket Adventure";
    reason =
      "Fast-paced activities match your excitement.";
  }

  if (memoryScore < 50) {
    game = "Memory Match";
    reason =
      "Improving memory will help learning.";
  }

  if (mathScore > 80) {
    game = "Math Wizard";
    reason =
      "You're doing great in math. Time for harder challenges!";
  }

  res.json({
    game,
    story,
    reason,
  });
});

module.exports = router;