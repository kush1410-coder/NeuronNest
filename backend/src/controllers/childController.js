const Child = require("../models/Child");

// Create Child
exports.createChild = async (req, res) => {
    try {

        const {
            name,
            age,
            gender,
            teacherId
        } = req.body;

        const child = await Child.create({
            name,
            age,
            gender,
            teacherId,
            parentId: req.user.id
        });

        res.status(201).json({
            success: true,
            child
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Children
exports.getChildren = async (req, res) => {

    try {

        const children = await Child.find({
            parentId: req.user.id
        });

        res.status(200).json({
            success: true,
            count: children.length,
            children
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Child
exports.getChildById = async (req, res) => {

    try {

        const child = await Child.findById(
            req.params.id
        );

        if (!child) {

            return res.status(404).json({
                success: false,
                message: "Child not found"
            });
        }

        // Ownership Check
        if (child.parentId.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            child
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Child
exports.updateChild = async (req, res) => {

    try {

        const child = await Child.findById(
            req.params.id
        );

        if (!child) {

            return res.status(404).json({
                success: false,
                message: "Child not found"
            });
        }

        // Ownership Check
        if (child.parentId.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const updatedChild =
        await Child.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            child: updatedChild
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Child
exports.deleteChild = async (req, res) => {

    try {

        const child = await Child.findById(
            req.params.id
        );

        if (!child) {

            return res.status(404).json({
                success: false,
                message: "Child not found"
            });
        }

        // Ownership Check
        if (child.parentId.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        await child.deleteOne();

        res.status(200).json({
            success: true,
            message: "Child deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};