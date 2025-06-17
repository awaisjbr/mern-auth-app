import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./src/routes/auth.route.js"

dotenv.config();
const app = express();

//middlewares
app.use(express.json({limit: "5mb"}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api/auth", authRouter);

const port = process.env.PORT || 5000;
connectDB()
.then(() => {
    app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);  
    })
}).catch((error) => {
    console.log(error.message);
    
})
