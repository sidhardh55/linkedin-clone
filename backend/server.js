import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(messageRoutes);
app.use(express.static("uploads"));

const start = async () => {
    const connectDB = await mongoose.connect(process.env.MONGO_URI);

    app.listen(8080, () => {
        console.log("server is running on port 8080");
    });
};

start();