import { Product } from '../models/product.js';

const comments = async (req, res) => {
    try {
        const { id, productId, comment } = req.body;
        const product = await Product.findById(productId);
        product.comments.push({ id, comment });
        await product.save();
        return res.json({message: 'Comment added'});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
}

export { comments };
