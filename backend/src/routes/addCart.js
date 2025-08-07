import { User } from "../models/user.js";

const addToCart = async (req, res) => {
    try {
        const { id, productId } = req.body;
        const user = await User.findById(id);
        user.cart.push(productId);
        await user.save();
        return res.json({message: 'Product added to cart'});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { addToCart };
