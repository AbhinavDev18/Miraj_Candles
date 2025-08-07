import { uploadOnCloudinary } from '../utils/cloudinary.js';

const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'File is required' });
        }

        const uploadedImage = await uploadOnCloudinary(file.buffer, file.originalname, {
            resource_type: "auto",
            folder: "candles/candle"
        });

        if (!uploadedImage?.url) {
            return res.status(500).json({ error: 'Cloudinary upload failed' });
        }

        return res.json({
            message: "Image uploaded successfully",
            imageUrl: uploadedImage.url,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { uploadFile };




// import { uploadOnCloudinary } from '../utils/cloudinary.js';

// const uploadFile = async (req, res) => {
//     try {
//         const file = req.file;
//         if (!file) {
//             return res.status(400).json({ error: 'File is required' });
//         }

//         const localPath = file.path; // multer saves the file locally
//         const avatar = await uploadOnCloudinary(localPath, {
//             resource_type: "auto",
//             folder: "candles/candle"
//         });

//         if (!avatar.url) {
//             return res.status(500).json({ error: 'Cloudinary upload failed' });
//         }

//         return res.json({
//             message: "Image uploaded successfully",
//             imageUrl: avatar.url,
//         });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// export { uploadFile };
