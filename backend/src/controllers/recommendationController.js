const Activity = require("../models/Activity");
const Emotion = require("../models/Emotion");

exports.getRecommendation = async (req, res) => {

    try {

        const childId = req.params.childId;

        const activities =
            await Activity.find({ childId });

        const emotions =
            await Emotion.find({ childId });

        let recommendation = [];

        const avgScore =
            activities.length
                ? activities.reduce(
                      (sum, a) => sum + a.score,
                      0
                  ) / activities.length
                : 0;

        const frustrationCount =
            emotions.filter(
                e => e.emotion === "frustrated"
            ).length;

        const boredomCount =
            emotions.filter(
                e => e.emotion === "bored"
            ).length;

        if (avgScore < 50) {
            recommendation.push(
                "Reduce activity difficulty"
            );
        }

        if (avgScore > 80) {
            recommendation.push(
                "Increase difficulty level"
            );
        }

        if (frustrationCount >= 3) {
            recommendation.push(
                "Enable voice assistance"
            );
        }

        if (boredomCount >= 3) {
            recommendation.push(
                "Switch to storytelling activities"
            );
        }

        if (recommendation.length === 0) {

            recommendation.push(
                "Continue current learning path"
            );
        }

        res.status(200).json({
            success: true,
            recommendations: recommendation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};