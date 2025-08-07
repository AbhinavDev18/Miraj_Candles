import { User } from '../models/user.js';

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne(
            { email, verifyOTP: otp, verifyOTPExpiry: { $gt: Date.now() }
        });
        if(!user) return res.json({error: 'User not found'}, {status: 400});
        if(otp === user.verifyOTP) {
            user.isVerified = true,
            user.verifyOTP = null,
            user.verifyOTPExpiry = null,
            user.verifyToken = null,
            user.verifyTokenExpiry = null,
            await user.save();
            return res.json({message: 'Email verified successfully', user: user});
        }
        return res.json({message: 'Invalid OTP', status: 400});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}
