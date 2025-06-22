import { useAuthStore } from '../zustand/useAuthStore';
import React from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import Loading from './Loading';

const Navbar = () => {
  const {authUser, logout, loading} = useAuthStore();

  const handleLogout = async () => {
    let confirm = window.confirm();
    if(confirm){
      logout();
    }
  };
  if(loading) return <Loading />

  return (
    <div className='h-16 fixed top-0 left-0 w-full flex items-center justify-between px-10 shadow-sm bg-black/30 backdrop-blur-sm '>
      <div className="logo uppercase text-sm md:text-xl font-bold tracking-wider select-none text-white"><span className='text-[rgb(52,168,83)]'>M</span><span className='text-[rgb(251,188,5)]'>E</span><span className='text-[rgb(66,133,244)]'>R</span><span className='text-[rgb(234,67,53)]'>N</span>-Auth-App</div>
      {authUser ? <div className='group relative'>
        <img src={authUser?.profilePic} alt="" className='h-12 w-12 rounded-full cursor-pointer' />
        <div className='group-hover:block absolute right-0 z-10 hidden p-1 shadow-sm'>
          <ul className='list-none m-0 p-1 bg-gray-100 text-sm'>
            <li className='cursor-pointer px-5 hover:bg-gray-300 py-1'>Profile</li>
            <li className='cursor-pointer px-5 hover:bg-gray-300 py-1'>Account</li>
            <li className='cursor-pointer px-5 hover:bg-gray-300 py-1' onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      </div> : <button className='flex items-center gap-2 border-black border-2 rounded-full px-5 py-2'>Login <FaArrowRightLong /></button>}
    </div> 
  )
}

export default Navbar
