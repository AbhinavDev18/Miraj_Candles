import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";

const login = async (req, res) => {
    try {
        const reqBody = req.body;
        const { email, password } = reqBody;
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({
                error: "User does not exists"
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(404).json({error: "Invalid password"});
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        const options = {
            httpOnly: true,
            secure: true,
        };
        return res.status(200).cookie('token', token, options).json({user: tokenData, message: "User logged in successfully"});
    }
    catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

export { login };
