const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "Child",
    childSchema
);