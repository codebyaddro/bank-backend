const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmail, sendRegistrationEmail } = require("../services/email.service");

/**
 * - user register controller
 * - POST /api/v1/auth/register
 */
const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const isExists = await User.findOne({ email });

        if(isExists) {
            return res.status(422).json({
                success: false,
                message: "User already exists"
            });
        };

        const user = await User.create({
            email, name, password
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        await sendRegistrationEmail(user.email, user.name);

        res.cookie("token", token);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * - user login controller
 * - POST /api/v1/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");;

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Email or Password INVALID"
            })
        };

        const isValidPassword = await user.comparePassword(password);

        if(!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Email or Password INVALID"
            })
        };

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        const userData = user.toObject();
        delete userData.password;

        res.cookie("token", token);

        res.status(200).json({
            success: true,
            message: "User loggedIn successfully",
            user: userData,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { register, login };