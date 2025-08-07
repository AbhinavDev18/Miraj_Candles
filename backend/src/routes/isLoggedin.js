import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

const logData =  async (req, res) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.json({error: 'User not logged in'}, {status: 400});
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return res.json({ user });
    }
    catch(error) {
        return res.json({error: error.message}, {status: 400});
    }
};

export { logData };
