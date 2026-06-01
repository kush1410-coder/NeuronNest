const Activity = require("../models/Activity");

exports.createActivity = async (req, res) => {

    try {

        const activity =
        await Activity.create(req.body);

        res.status(201).json({
            success: true,
            activity
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getActivities = async (req, res) => {

    try {

        const activities =
        await Activity.find({
            childId: req.params.childId
        });

        res.status(200).json({
            success: true,
            count: activities.length,
            activities
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};