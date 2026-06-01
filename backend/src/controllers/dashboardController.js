const Child = require("../models/Child");
const Activity = require("../models/Activity");
const Emotion = require("../models/Emotion");

exports.getDashboard = async (req, res) => {
    try {

        const childId = req.params.childId;

        const child = await Child.findById(childId);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: "Child not found"
            });
        }

        const activities =
            await Activity.find({ childId })
            .sort({ createdAt: -1 })
            .limit(10);

        const emotions =
            await Emotion.find({ childId })
            .sort({ createdAt: -1 })
            .limit(10);

        const avgScore =
            activities.length
                ? activities.reduce(
                      (sum, item) => sum + item.score,
                      0
                  ) / activities.length
                : 0;

        const emotionMap = {};

        emotions.forEach(e => {
            emotionMap[e.emotion] =
                (emotionMap[e.emotion] || 0) + 1;
        });

        let dominantEmotion = "neutral";
        let max = 0;

        Object.keys(emotionMap).forEach(key => {
            if (emotionMap[key] > max) {
                max = emotionMap[key];
                dominantEmotion = key;
            }
        });

        res.status(200).json({
            success: true,

            child,

            analytics: {
                totalActivities:
                    activities.length,

                averageScore:
                    Number(avgScore.toFixed(2)),

                dominantEmotion
            },

            recentActivities:
                activities,

            recentEmotions:
                emotions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};