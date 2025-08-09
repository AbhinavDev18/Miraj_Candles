import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from './routes.js';
import { connectDB } from "./connectDB.js";
import dotend from "dotenv";
dotend.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

app.use("/api", router);

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on the port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
})
