const {
    generateStory
} = require(
    "../services/geminiService"
);

exports.createStory = async (
    req,
    res
) => {

    try {

        const {
            age,
            emotion,
            topic,
            learningLevel,
            language
        } = req.body;

        const story =
            await generateStory(
                age,
                emotion,
                topic,
                learningLevel,
                language
            );

        res.status(200).json({
            success: true,
            story
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};