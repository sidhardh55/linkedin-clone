import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const envPath of [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(process.cwd(), 'backend/.env')
]) {
    dotenv.config({ path: envPath });
}

const app = express();
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(messageRoutes);
app.use(express.static("uploads"));

const start = async () => {
    if (mongoUri) {
        try {
            await mongoose.connect(mongoUri);
            console.log("MongoDB connected successfully");
        } catch (error) {
            console.error("MongoDB connection failed:", error.message);
        }
    } else {
        console.warn("No MongoDB URI found. Set MONGO_URI, MONGODB_URI, or DATABASE_URL to enable database features.");
    }

    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
};

start();