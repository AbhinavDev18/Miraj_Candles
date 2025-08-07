import { Product } from '../models/product.js';

const getComments = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        return res.json({comments: product.comments});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { getComments };
