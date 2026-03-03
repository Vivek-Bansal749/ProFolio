import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";


// load environment variables from project root
dotenv.config({ path: process.cwd().endsWith('backend') ? '../.env' : '.env' });

if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment');
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());


app.use(postRoutes);
app.use(userRoutes);
// Removed static uploads folder - now using Cloudinary for file storage


const start = async () =>{
    const mongoUri = process.env.MONGO_URI;
    // mongoose will parse the database name from the URI itself
    const connectDB = await mongoose.connect(mongoUri);

    const port = process.env.PORT || 9080;
    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    })
}

start();