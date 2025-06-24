import React, { useState } from 'react'
import { useAuthStore } from '../zustand/useAuthStore';
import avatarImg from "../assets/avatar.png";
import { FaCamera } from "react-icons/fa";
import { formateData } from '../lib/utils';
import toast from 'react-hot-toast';


const Profile = () => {
    const {authUser, updateProfilePic, checkAuth} = useAuthStore();

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        const formData = new FormData();
        formData.append("avatar",file);

        try {
            await updateProfilePic(formData);
            checkAuth()
        } catch (error) {
            toast.error(error.message)
        }
    };

  return (
    <div className='flex items-center justify-center w-full h-full relative'>
      <div className='bg-black/30 backdrop-blur-sm max-w-[350px] w-full rounded-md pb-5'>
        <div className='flex flex-col items-center py-5 gap-3'>
            <div className='w-[115px] h-[115px] rounded-full bg-white flex items-center justify-center relative group'>
                <div className='h-28 w-28 rounded-full overflow-hidden flex items-center justify-center'><img src={authUser?.profilePic || "https://res.cloudinary.com/dofovybxu/image/upload/v1750736205/avatar_dwursb.png"} alt="Profile Pic" className='w-full cursor-pointer'/></div>
                <div className='absolute bg-[rgba(0,0,0,0.5)] right-0 top-20 w-6 h-6 text-sm rounded-full z-10 text-white hidden1 group-hover:block ' title='Change Pic'>
                    <label className='flex items-center justify-center w-full h-full cursor-pointer' htmlFor="avatar"><FaCamera /><input className='hidden' type="file" onChange={handleChange} name="avatar" id="avatar" /></label>
                </div>
            </div>
        </div>
        <div className='flex flex-col items-center text-white'>
            <h1 className='text-xl font-semibold'>{authUser?.userName}</h1>
            <p>Member since:  {formateData(authUser?.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
