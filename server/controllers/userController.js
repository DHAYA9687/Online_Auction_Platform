import { User } from "../models/userModel.js";
import { generateToken } from "../libs/generateToken.js";
import bcrypt from "bcryptjs";



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = generateToken(user._id);
        //set cookie
        res.cookie('jwt', token, {
            httpOnly: true,      // Prevent client-side access
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: 'none',  // Protect against CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        //send response
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Request Body:", req.body);
        if (!name || !password || !email) {
            return res.status(400).json({ error: "Some Arguments is Missing" });
        }
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await User.create({ name, email, password: hashpassword });

        if (user) {
            // Generate JWT token
            const token = generateToken(user._id);
            console.log(token);

            // Send response (excluding password)
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0) // Expire immediately
    });
    res.status(200).json({ message: "Logged out successfully" });
};

