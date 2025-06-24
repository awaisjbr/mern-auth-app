import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../zustand/useAuthStore';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const {code} = useParams();
    const navigate = useNavigate()
    const {resetPassword, loading} = useAuthStore();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password does not match")
            return;
        }
        try {
          await resetPassword(code, password);
          toast.success("Redirecting to Home Page")
          setTimeout(() => {
            navigate('/login')
          },2000)
        } catch (error) {
          toast.error(error.message)
        }
    }
  return (
    <div className='bg-[url("https://res.cloudinary.com/dofovybxu/image/upload/v1740456299/auth_ecmjrt.jpg")] bg-center bg-cover w-screen h-screen relative flex items-center justify-center'>
    
          <div className='bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[50%] flex items-center justify-center gap-20 flex-col py-10'>
            <div>
                <h1 className='text-center font-bold text-xl'>Reset Password</h1>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <div><input className='p-1 rounded-sm outline-none' type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='new password'/></div>
                <div><input className='p-1 rounded-sm outline-none' type="password" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='confirm password'/></div>
                <button className='text-lg bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md cursor-pointer font-semibold' type="submit">Reset Password</button>
            </form>
          </div>
          {loading && <Loading />}
    </div>
  )
}

export default ResetPassword
