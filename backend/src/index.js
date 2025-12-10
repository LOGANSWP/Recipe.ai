import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

import inventoryRouter from "../src/routes/inventoryRoutes.js"
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import planningRouter from "./routes/planningRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { setGeminiApiKey } from "./utils/geminiClient.js";

dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB!")
  })
  .catch((error) => {
    console.log(error)
  })

setGeminiApiKey(process.env.GEMINI_API_KEY);

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); 

// Enable json could be received
// Increase payload limit for Base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Could get information from cookie
app.use(cookieParser())

// Server log
app.use(morgan('short'));

// API Routes
app.use('/api/inventory', inventoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/planning", planningRouter);

// Global error handling
app.use(errorHandler);

// --- DEPLOYMENT CONFIGURATION ---
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder (../../frontend/dist relative to backend/src/index.js)
  const staticPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(staticPath));

  // Serve index.html for any unknown routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
// ------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}!!!`)
})