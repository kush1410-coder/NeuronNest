const express = require("express");
const router = express.Router();

router.post("/recommend", async (req, res) => {
  try {
    const {
      emotion,
      memoryScore,
      mathScore,
      storiesRead,
    } = req.body;

    let recommendation = {
      game: "Memory Match",
      story: "Animal Adventure",
      reason: "Improve memory skills",
      goal: "Complete 3 games today",
    };

    if (emotion === "happy") {
      recommendation = {
        game: "Math Wizard",
        story: "Space Explorer",
        reason: "You seem energetic today",
        goal: "Reach Level 6",
      };
    }

    if (emotion === "curious") {
      recommendation = {
        game: "Animal Quiz",
        story: "Jungle Discovery",
        reason: "Curious minds learn fastest",
        goal: "Learn 5 new facts",
      };
    }

    if (emotion === "excited") {
      recommendation = {
        game: "Emoji Hunt",
        story: "Rocket Adventure",
        reason: "Fast-paced challenges fit your mood",
        goal: "Score 20 points",
      };
    }

    if (mathScore < 50) {
      recommendation.game = "Math Wizard";
      recommendation.reason =
        "Math practice will help improve scores";
    }

    res.json(recommendation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;