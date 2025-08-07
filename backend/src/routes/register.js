import { User } from "../models/user.js";
import { sendEmail } from "../helper/mail.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if(
            [username, email, password].some((field) => field?.trim() === "")
        ) {
            throw new error("All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [ { username }, { email } ]
        });

        if(existedUser) {
            throw new error("user already exists");
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            isVerified: false
        });
        const createdUser = await User.findById(user._id).select("-password");
        await sendEmail({ email, emailType: 'VERIFY', userId: createdUser._id  });
        return res.status(201).json({
            message: 'User created successfully, verify your email',
            success: true,
            user: createdUser,
            redirectTo: `/verifyemail?email=${email}`,
        });
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { registerUser };
