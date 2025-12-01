import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors";
import inventoryRouter from "../src/routes/inventoryRoutes.js"

dotenv.config()

mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log("Connected to MongoDB!")
    })
    .catch((error) => {
        console.log(error)
    })

const app = express()

// Middleware
app.use(cors()); // Allow React frontend to connect

// Enable json could be received
// Increase payload limit for Base64 images
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Could get information from cookie
app.use(cookieParser())

// Routes
app.use('/api/inventory', inventoryRouter);

app.listen(3000, () => {
    console.log("App is running on port 3000!!!")
})