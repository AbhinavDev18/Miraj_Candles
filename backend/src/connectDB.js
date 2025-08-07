import { app } from './index.js';
import mongoose from 'mongoose';
import dotend from "dotenv";
dotend.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on the port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
})
