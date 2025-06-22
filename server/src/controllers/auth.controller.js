import bcrypt from "bcryptjs";
import validator from "validator"
import cloudinary from "../config/cloudinary.js";
import corn from "node-cron";
import crypto from "crypto";
import { userModel } from "../models/user.model.js";
import { transporter } from "../config/nodemailer.js";
import { generateTokenAndCookies } from "../utils/utils.js";


corn.schedule("0 */12 * * *", async () => {
  try {
    const now = new Date();
    const result = await userModel.deleteMany({
      isVerified: false,
      verificationOtpExpiresAt: { $lt: now }
    });

    console.log(`Cron Job: Deleted ${result.deletedCount} unverified users at ${now.toLocaleString()}`);
  } catch (error) {
    console.error("Cron Job Error:", error.message);
  }
});

export const registerUser = async (req, res) => {
    const {userName, email, password} = req.body;
    if(!userName || !email || !password){
        return res.json({success:false, message: "All feilds are required"})
    }
    if(!validator.isEmail(email)){
        return res.json({success:false, message: "Invalid email formate"})
    }
    if(password.length < 6){
        return res.status(500).json({success: false, message: "Password should be 6 charters"})
    }

   try {
    const userExist = await userModel.findOne({email});
    if(userExist){
        return res.status(500).json({success:false, message: "User email already exists"})
    }
    
    const hasedPassword = await bcrypt.hash(password, 10);
    const verificationOTP = Math.floor(Math.random() * 900000 + 100000).toString();
    const verificationOtpExpiresAt = Date.now() + 10 * 60 * 1000   //OTP valid for 10 minutes
    const newUser = new userModel({userName, email, password:hasedPassword, verificationOTP, verificationOtpExpiresAt});
    newUser.profilePic = `https://avatar.iran.liara.run/public/boy?username=${newUser.userName}`
    await newUser.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to : "awaisjbr@gmail.com",
        subject: "Account Activation",
        text: `Welcome! your account has been created with email id: ${email}. Please verify your account with otp ${verificationOTP}. It is valid for 10 minutes. `
    }
    await transporter.sendMail(mailOptions);

    generateTokenAndCookies(newUser._id, res)

    res.status(201).json({success: true, message: "User register successfully, OTP sent to email"})
   } catch (error) {
    res.status(500).json({success: false, message: error.message})
}
}

export const verifyEmail = async (req, res) => {
    const {verificationOTP} = req.body;
    const id = req.user;
    try {
        const user = await userModel.findById(id).select("-password");
        if(!user){
           return res.status(500).json({success: false, message: "user not authorized"});
        }
        if(user.verificationOTP !== verificationOTP || user.verificationOtpExpiresAt < Date.now()){
            return res.status(500).json({success: false, message: "Invalid or expired OTP"});
        }
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOtpExpiresAt = undefined;
        await user.save();
        res.clearCookie("token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
        })
        
        res.status(200).json({success: true, message: "Account verified successfully.", user:user.isVerified})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }

}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(500).json({success: false, message: "Missing user credentials"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(500).json({success: false, message: "invalid Email"})
        }
        const isMatchPsssword = await bcrypt.compare(password, user.password);
        if(!isMatchPsssword){
            return res.status(500).json({success: false, message: "Wrong password"})
        }
        // const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn: "12h"});
        // res.cookie("token", token,{
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            //     maxAge: 24 * 60 * 60 * 1000,
            // });
        user.lastLoggedIn = Date.now();
        await user.save();
        generateTokenAndCookies(user._id, res)
       
        res.status(200).json({success: true, message: "user loggedIn successfully",user: {...user._doc, password:undefined}})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        const id = req.user;
        const user = await userModel.findById(id).select("-password");
        if(!user){
            return res.status(500).json({success: false, message: "user not authorized"});
        }
        res.status(200).json({success: true, user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        })
        res.status(200).json({success: true, message: "user logged out successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message}) 
    }
}

export const updateProfilePic = async (req, res) => {
    const id = req.user;
    try {
        const user = await userModel.findById(id).select("-password");
        if(!user){
            return res.status(500).json({success: false, message: "user not authorized"});
        }
        const profilePic = req.file;
        const profilePicURL = await cloudinary.uploader.upload(profilePic.path, {resource_type: "image"});
        user.profilePic = profilePicURL.secure_url;
        await user.save();

        res.status(200).json({success: true, message: "Profile Pic updated successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
        console.log(error)
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.json({success:false, message: "Email is required"})
        };
        const user = await userModel.findOne({email}).select("-password");
        if(!user){
            return res.json({success:false, message: "Email not found"})
        }
        const verificationOTP = crypto.randomBytes(32).toString("hex");
        const verificationOtpExpiresAt = Date.now() + (10 * 60 * 1000) ;  //OTP valid for 10 minutes
        const resetUrl = `http://localhost:5173/reset-password/${verificationOTP}`
        user.verificationOTP = verificationOTP;
        user.verificationOtpExpiresAt = verificationOtpExpiresAt;
        await user.save();
        
        const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to : "awaisjbr@gmail.com",
        subject: "Password Reset Link",
        text: `Welcome! your requested password reset link for email ${email} is <a target="_blank" href=${resetUrl} style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>. It is valid for 10 minutes. `
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({success: true, message: "Password Forgot OTP sent to email"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message}) 
    }
}

export const resetPassword = async (req, res) => {
    const {password} = req.body;
    const {code} = req.params;
    try {
        const user = await userModel.findOne({verificationOTP: code});
        if(!user || user.verificationOtpExpiresAt < Date.now()){
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        const hasedPassword = await bcrypt.hash(password, 10);
        user.password = hasedPassword;
        user.verificationOTP = undefined;
        user.verificationOtpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message}) 
    }
}