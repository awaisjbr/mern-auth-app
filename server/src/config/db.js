import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URI}/auth-app`);
        console.log(`✅ MongoDB Connected.. on ${connect.connection.host}`)
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}