import express from "express";
import { userModel } from "../models/user.model.js";
import { loginUser, registerUser, verifyEmail, checkAuth, logout, updateProfilePic } from "../controllers/auth.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        res.status(200).json({success: true, users})
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});
router.post("/register", registerUser);
router.post("/verifyEmail", userAuth, verifyEmail);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/check-auth", userAuth, checkAuth);
router.post("/update-profile-pic", userAuth,upload.single("avatar"), updateProfilePic)


export default router