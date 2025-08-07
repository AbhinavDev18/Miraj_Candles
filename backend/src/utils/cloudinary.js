import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// import dotend from "dotenv";
// dotend.config();

const uploadOnCloudinary = async (fileBuffer, originalName, options = {}) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const base64String = fileBuffer.toString("base64");
        const dataURI = `data:image/${path.extname(originalName).slice(1)};base64,${base64String}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: options.resource_type || "auto",
            folder: options.folder || "uploads"
        });
        return result;
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return null;
    }
}

export { uploadOnCloudinary };



// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// import dotend from "dotenv";
// dotend.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath, { resource_type, folder }) => {
//     try {
//         if(!localFilePath) return null;
//         const response = await cloudinary.uploader.upload(
//             localFilePath, {
//                 resource_type: 'auto'
//             }
//         );
//         if(response && response.public_id) {
//             fs.unlinkSync(localFilePath);
//             return response;
//         }
//         else throw new Error("Upload failed");
//     }
//     catch(err) {
//         fs.unlinkSync(localFilePath);
//         console.log(err);
//         return null;
//     }
// }

// export { uploadOnCloudinary };
