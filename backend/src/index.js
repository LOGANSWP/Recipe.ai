import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors";
import morgan from "morgan";
import inventoryRouter from "../src/routes/inventoryRoutes.js"
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import planningRouter from "./routes/planningRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

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

// Server log
app.use(morgan('short'));

// Routes
app.use('/api/inventory', inventoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/planning", planningRouter);

// Global error handling
app.use(errorHandler);

app.listen(3000, () => {
    console.log("App is running on port 3000!!!")
})
