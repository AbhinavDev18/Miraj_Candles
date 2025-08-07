import { User } from "../models/user.js";

const removeFromCart = async (req, res) => {
    try {
        const { id, productId } = req.body;
        const user = await User.findById(id);
        user.cart.pull(productId);
        await user.save();
        return res.json({message: 'Product removed from cart'});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { removeFromCart };
