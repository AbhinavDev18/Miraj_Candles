import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';

const resetPassword = async (req, res) => {
    try {
        const { email, password, otp } = await req.body;
        const user = await User.findOne({ email });
        if(!user) return res.json({error: 'User not found'}, {status: 400});
        if(otp === user.verifyOTP) {
            user.isVerified = true;
            user.verifyOTP = null;
            user.verifyOTPExpiry = null;
            user.verifyToken = null;
            user.verifyTokenExpiry = null;
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
            await user.save();
            return res.json({message: 'Password reset successfully', user: user});
        }
        return res.json({message: 'Invalid OTP', status: 400});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { resetPassword };
