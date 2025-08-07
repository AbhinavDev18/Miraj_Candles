import { Product } from '../models/product.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const insertProduct = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Product image file is required' });
        }

        const uploadedImage = await uploadOnCloudinary(file.buffer, file.originalname, {
            resource_type: "image",
            folder: "candles/products",
        });

        if (!uploadedImage?.url) {
            return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }

        const { name, description, price, status, quantity, sold } = req.body;

        const product = new Product({
            name,
            description,
            price,
            image: uploadedImage.url, // Store Cloudinary URL
            status,
            quantity,
            sold,
        });

        await product.save();

        return res.status(201).json({
            message: 'Product inserted successfully',
            product,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




// import { Product } from '../models/product.js';
// // import cloudinary from 'cloudinary';

// export const insertProduct = async (req, res) => {
//     try {
//         const { name, description, price, imageUrl, status, quantity, sold } = req.body;
//         const product = new Product({
//             name,
//             description,
//             price,
//             image: imageUrl,
//             status,
//             quantity,
//             sold,
//         });
//         await product.save();
//         return res.status(201).json(product);
//     }
//     catch(error) {
//         return res.status(500).json({ message: error.message });
//     }
// }
