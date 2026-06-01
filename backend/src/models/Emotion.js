const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    emotion: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model(
  "Emotion",
  emotionSchema
);