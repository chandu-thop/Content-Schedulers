import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const generateToken = (id) => {
    jwt.sign({ id }, process.env.JWT_SECRET || "pass", { expiresIn: '30d' });
};
//Register user
// POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const userExits = await User.findOne({ email });
        if (userExits) {
            res.status(400).json({ message: "User already exits" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString()) });
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err?.message || "Server Error" });
    }
};
export const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id.toString()) });
        }
        else {
            res.status(400).json({ message: "Invalid Email or Password" });
        }
    }
    catch (err) {
        res.status(500).json({ message: err?.message || "Server Error" });
    }
};
