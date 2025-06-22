import React, { useContext, useEffect, useState } from 'react';
import { FaForumbee } from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoFingerPrint } from "react-icons/io5";
// import { TailSpin } from "react-loader-spinner";
import { useAuthStore } from '../zustand/useAuthStore';
import { Loader } from 'lucide-react';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';


const LoginBox = () => {
    const navigate = useNavigate();
    const {signup,loading, login, isEmailVerified, authUser} = useAuthStore();
    const [loginState, setLoginState] = useState('Login');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if(!isEmailVerified) navigate("/verify")
    },[isEmailVerified, navigate]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]:value});
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if(loginState === "Login"){
                await login(formData);
                // navigate('/')
            }else{
                await signup(formData)
                // navigate("/verify")
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

  return (
    <div className='bg-[url("https://res.cloudinary.com/dofovybxu/image/upload/v1740456299/auth_ecmjrt.jpg")] w-screen bg-center bg-cover h-screen relative flex items-center justify-center'>
      <div className='bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[80%] flex items-center flex-col py-5 justify-between'>
        <h1 className='flex items-center gap-3 text-3xl font-semibold'> <IoFingerPrint /><span className='text-xl'>Auth-App</span></h1>
        <div className='flex items-center flex-col w-full'>
            <h1 className='text-2xl font-bold'>{loginState === "Login" ? "Welcome Back" : "Welcome"}</h1>
            <p className='text-xs mt-2 mb-5 font-semibold'>{loginState === "Login"? "Enter your email and password to access your account" : "Fill the form fields for registration"}</p>
            <form className='w-[70%] flex flex-col gap-3' onSubmit={handleFormSubmit}>
                {loginState === "Login" ? null : <div className='flex flex-col gap-1'>
                    <label htmlFor="username" className='font-semibold'>Name</label>
                    <input className='p-1 rounded-sm outline-none' type="text" name='userName' value={formData.userName} placeholder='Enter your Name' onChange={handleChange} />
                </div>}
                <div className='flex flex-col gap-1'>
                    <label htmlFor="email" className='font-semibold'>Email</label>
                    <input className='p-1 rounded-sm outline-none' type="text" name='email' value={formData.email} placeholder='Enter your email' onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="password" className='font-semibold'>Password</label>
                    <div className='relative'>
                        <input className='w-full p-1 rounded-sm outline-none' name='password' type={showPassword ? "text" : "password"} value={formData.password} placeholder='Enter your password' onChange={handleChange} />
                        {showPassword ? <LuEyeOff className='absolute top-2 cursor-pointer right-2' onClick={() => setShowPassword((prev) => !prev)} title='Hide Password'/> : <LuEyeClosed className='absolute top-2 cursor-pointer right-2' onClick={() => setShowPassword((prev) => !prev)} title='Show Password'/>}
                    </div>
                </div>
                <div className='flex items-center justify-between'>
                    <label className='text-xs flex items-center gap-1'><input type="checkbox"/>Remember me</label>
                    <NavLink to={"/forgot-password"} className="text-sm hover:underline">Forgot Password</NavLink>
                </div>
                <button type='submit' className='bg-[rgb(85,73,201)] text-white w-full py-1 my-1 rounded-sm'>{loginState === "Login" ? "Sign In" : "Register"}</button>
                {loginState === "Login"? <button className='flex items-center gap-2 bg-white py-1 px-2 rounded-lg mx-auto'><FcGoogle className='text-xl' />Sign In with google</button>: null}
            </form>
        </div>
        <h3 className='text-sm'>{loginState === "Login" ? "Don't have an account?" : "Already have an account?"} <NavLink onClick={() => loginState === "Login" ? setLoginState("Signup") : setLoginState("Login")} className="text-lg hover:underline">{loginState === "Login" ? "Sign Up" : "Sign In"}</NavLink></h3>
      </div>
      {loading && <Loading />}
    </div>
  )
}

export default LoginBox