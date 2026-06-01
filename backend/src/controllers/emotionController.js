const Emotion = require("../models/Emotion");

exports.createEmotion = async (req, res) => {

    try {

        const emotion =
        await Emotion.create(req.body);

        res.status(201).json({
            success: true,
            emotion
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getEmotions = async (req, res) => {

    try {

        const emotions =
        await Emotion.find({
            childId: req.params.childId
        })
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: emotions.length,
            emotions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};