import toast from "react-hot-toast";
import {create} from "zustand";
import {AxiosInstance} from "../utils/AxiosInstance"
import { useNavigate } from "react-router-dom";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    users: [],
    loading: false,
    isEmailVerified: true,
    isAuthenticated: false,

    checkAuth: async () => {
        try {
            const {data} = await AxiosInstance.get("/auth/check-auth");
            if(data.success){
                set({authUser: data.user, isAuthenticated: true, isCheckingAuth:false})
            }else {
                set({ user: null, isAuthenticated: false });
              }
        } catch (error) {
            set({ user: null, isAuthenticated: false });            
        }
    },

    signup: async (credentials) => {
        set({loading: true});
        try {
            const {data} = await AxiosInstance.post("/auth/register", credentials);
            if(data.success){
                set({loading: false, authUser:null, isEmailVerified: false});
                toast.success(data.message)
            }else{
                set({loading: false});
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Register Login Failed");
            set({loading:false, isEmailVerified:true, authUser:null})
        }
    },

    verifyEmail: async (verificationOTP) => {
        set({ loading: true });
        try {
            const {data} = await AxiosInstance.post("/auth/verifyEmail", {verificationOTP});
            if(data.success){
                toast.success(data.message);
                set({user:null, isAuthenticated:false, loading:false, isEmailVerified:true})
            }else{
                toast.error(data.message);
                set({ loading: false})
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Email Verfication Failed");
            set({ loading: false})
        }
    },

    login: async (credentials) => {
        set({loading: true});
        try {
            const {data} = await AxiosInstance.post("/auth/login", credentials);
            if(data.success){
                set({loading: false, authUser:data.user, isAuthenticated: true});
                toast.success(data.message)
            }else{
                set({loading: false});
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "User Login Failed");
            set({loading:false, authUser:null})
        }
    },

    logout: async () => {
        set({loading: true});
        try {
            const {data} = await AxiosInstance.post("/auth/logout");
            if(data.success){
                set({loading: false, authUser:null, isAuthenticated: false});
                toast.success(data.message)
            }else{
                set({loading: false});
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout Failed");
            set({loading:false})
        }
    },

    forgotPassword: async (email) => {
        set({loading: true})
        try {
            const{data} = await AxiosInstance.post("/auth/forgot-password", {email});
            if(data.success){
                toast.success(data.message);
                set({user:null, isAuthenticated:false, loading:false});
            }else{
                toast.error(data.message);
                set({ loading: false})
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Reset Password Failed");
            set({loading:false})
        }
    },

    resetPassword: async (code, password) => {
        set({loading: true})
        try {
            const {data} = await AxiosInstance.post(`/auth/reset-password/${code}`, {password});
            if(data.success){
                toast.success(data.message);
                set({loading:false, isAuthenticated: false, authUser: null})
            }else{
                toast.error(data.message);
                set({ loading: false})
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Reset Password Failed");
            set({loading:false})
        }
    }
    
}))