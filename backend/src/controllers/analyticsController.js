const Activity = require("../models/Activity");
const Emotion = require("../models/Emotion");

exports.getAnalytics = async (req, res) => {

    try {

        const childId = req.params.childId;

        const activities = await Activity.find({
            childId
        });

        const emotions = await Emotion.find({
            childId
        });

        if (
            activities.length === 0 &&
            emotions.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message: "No analytics data found"
            });
        }

        // -----------------------
        // Activity Analytics
        // -----------------------

        const totalScore =
            activities.reduce(
                (sum, item) => sum + item.score,
                0
            );

        const avgScore =
            activities.length
                ? totalScore / activities.length
                : 0;

        const totalMistakes =
            activities.reduce(
                (sum, item) =>
                    sum + item.mistakes,
                0
            );

        const avgMistakes =
            activities.length
                ? totalMistakes /
                  activities.length
                : 0;

        const avgCompletionTime =
            activities.length
                ? activities.reduce(
                      (sum, item) =>
                          sum +
                          item.completionTime,
                      0
                  ) / activities.length
                : 0;

        // -----------------------
        // Emotion Analytics
        // -----------------------

        const emotionCount = {};

        emotions.forEach((e) => {

            emotionCount[e.emotion] =
                (emotionCount[e.emotion] || 0)
                + 1;

        });

        let dominantEmotion =
            "neutral";

        let max = 0;

        for (const emotion in emotionCount) {

            if (
                emotionCount[emotion] > max
            ) {
                max =
                    emotionCount[
                        emotion
                    ];

                dominantEmotion =
                    emotion;
            }
        }

        const highEngagement =
            emotions.filter(
                (e) =>
                    e.engagement ===
                    "high"
            ).length;

        const engagementScore =
            emotions.length
                ? (
                      (highEngagement /
                          emotions.length) *
                      100
                  ).toFixed(2)
                : 0;

        // -----------------------
        // Learning Level Logic
        // -----------------------

        let learningLevel =
            "beginner";

        let recommendedDifficulty =
            "easy";

        if (avgScore >= 80) {

            learningLevel =
                "advanced";

            recommendedDifficulty =
                "hard";
        }
        else if (
            avgScore >= 60
        ) {

            learningLevel =
                "intermediate";

            recommendedDifficulty =
                "medium";
        }

        res.status(200).json({

            success: true,

            analytics: {

                totalActivities:
                    activities.length,

                averageScore:
                    Number(
                        avgScore.toFixed(2)
                    ),

                averageMistakes:
                    Number(
                        avgMistakes.toFixed(2)
                    ),

                averageCompletionTime:
                    Number(
                        avgCompletionTime.toFixed(
                            2
                        )
                    ),

                dominantEmotion,

                engagementScore:
                    Number(
                        engagementScore
                    ),

                learningLevel,

                recommendedDifficulty
            }
        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};