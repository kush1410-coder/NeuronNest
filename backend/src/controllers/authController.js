const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken =
require("../utils/generateToken");

exports.register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;

        const existingUser =
        await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword =
        await bcrypt.hash(password, 10);

        const user =
        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        const token =
        generateToken(
            user._id,
            user.role
        );

        const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
};

res.status(201).json({
    success: true,
    token,
    user: userResponse
});

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
        await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token =
        generateToken(
            user._id,
            user.role
        );

        const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
};

res.status(200).json({
    success: true,
    token,
    user: userResponse
});

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};