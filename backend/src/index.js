import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

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

// Enable json could be received
app.use(express.json())

// Could get information from cookie
app.use(cookieParser())

app.listen(3000, () => {
    console.log("App is running on port 3000!!!")
})