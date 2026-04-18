import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../utils/generateToken.js";

// ✅ REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            mobile,
            password: hashed,
        });

        sendToken(user, res);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
            },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ✅ LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        // ✅ Role check (only admin allowed)
        if (user.role !== "admin")
            return res.status(403).json({ message: "Access denied. Admin only." });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: "Invalid credentials" });

        sendToken(user, res);

        res.json({
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({ message: "Logged out" });
};


export const getProfile = async (req, res) => {
    res.json(req.user);
};

// ✅ UPDATE USER CREDITS (ADMIN ONLY)
export const updateUserCredits = async (req, res) => {
    try {
        const { userId, amount, action } = req.body;

        // 🔒 Admin check
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        if (!userId || !amount || !action) {
            return res.status(400).json({
                message: "userId, amount & action required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Handle actions safely
        if (action === "add") {
            user.credits += Number(amount);
        } else if (action === "deduct") {
            if (user.credits < amount) {
                return res.status(400).json({
                    message: "Insufficient credits",
                });
            }
            user.credits -= Number(amount);
        } else {
            return res.status(400).json({
                message: "Invalid action (add/deduct)",
            });
        }

        await user.save();

        res.json({
            message: "Credits updated successfully",
            credits: user.credits,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ GET ALL USERS (ADMIN)
export const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await User.find().select("-password");

        res.json({
            total: users.length,
            users,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const adminDashboard = async (req, res) => {
    res.json({ message: "Welcome Admin 🚀" });
};