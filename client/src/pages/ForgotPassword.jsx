import Loading from '../components/Loading';
import { useAuthStore } from '../zustand/useAuthStore';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';

const forgotPassword = () => {
  const {forgotPassword, loading} = useAuthStore();
  const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await forgotPassword(email);
        setEmail("")
        navigate('/login')
      } catch (error) {
        toast.error(error.message)
      }
    }
    
  return (
    <div className='bg-[url("https://res.cloudinary.com/dofovybxu/image/upload/v1740456299/auth_ecmjrt.jpg")] bg-center bg-cover w-screen h-screen relative flex items-center justify-center'>

      <div className='bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[50%] flex items-center justify-between flex-col py-10'>
        <div>
            <h1 className='text-center font-bold text-xl'>Forgot password?</h1>
            <p className='text-center text-sm'>No worries, let's reset it.</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
          <div><input className='p-1 rounded-sm outline-none' type="email" value={email} onChange={(e) => setEmail(e.target.value)}  placeholder='email@example.com' required/></div>
          <div className='flex flex-col items-center gap-3'>
              <button type='submit' className='bg-[rgb(85,73,201)] text-white py-1 px-3 my-1 rounded-sm'>Reset Password</button>
              <Link to={"/login"}><button className='flex items-center gap-2 text-sm border-black border px-2 py-1'><FaArrowLeftLong /> <span>Back to Login</span></button></Link>
          </div>
        </form>
        
      </div>
      {loading && <Loading />}
    </div>
  )
}

export default forgotPassword
