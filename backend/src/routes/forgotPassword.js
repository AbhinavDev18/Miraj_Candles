import { User } from '../models/user.js';
import { sendEmail } from '../helper/mail.js';

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.json({error: 'User not found'}, {status: 400});
        await sendEmail({ email, emailType: 'RESET', userId: user._id });
        return res.json({message: 'Reset password email sent'});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { forgotPassword };
