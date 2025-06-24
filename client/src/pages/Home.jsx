import React from 'react'
import Navbar from '../components/Navbar'
import Profile from '../components/Profile'

const Home = () => {
  
  return (
    <div className='bg-[url("https://res.cloudinary.com/dofovybxu/image/upload/v1750223791/l4flsyvqmm1ijhg4vfft.png")] h-screen bg-center bg-cover relative'>
      <Navbar />
      <Profile />
    </div>
  )
}

export default Home
