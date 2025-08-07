import { Product } from '../models/product.js';
// import cloudinary from 'cloudinary';

export const insertProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, status, quantity, sold } = req.body;
        const product = new Product({
            name,
            description,
            price,
            image: imageUrl,
            status,
            quantity,
            sold,
        });
        await product.save();
        return res.status(201).json(product);
    }
    catch(error) {
        return res.status(500).json({ message: error.message });
    }
}
