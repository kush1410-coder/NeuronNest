const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
{
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },

    activityType: {
        type: String,
        required: true
    },

    score: {
        type: Number,
        default: 0
    },

    completionTime: {
        type: Number,
        default: 0
    },

    mistakes: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "Activity",
    activitySchema
);