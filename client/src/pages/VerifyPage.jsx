import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { useAuthStore } from "../zustand/useAuthStore";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const {verifyEmail, loading} = useAuthStore()
  const navigate = useNavigate()
  const [verificationOTP, setVerificationOTP] = useState("");
    
  const handleVerifyEmail = async (e) => {
      e.preventDefault();
      try {
        await verifyEmail(verificationOTP);
        navigate('/login')
      } catch (error) {
        toast.error(error.message)
      }
  }

  return (
    <div className='bg-[url("https://res.cloudinary.com/dofovybxu/image/upload/v1740456299/auth_ecmjrt.jpg")] bg-center bg-cover w-screen h-screen relative flex items-center justify-center'>
      <div className="bg-white/30 backdrop-blur-sm max-w-[360px] w-full h-[50%] flex items-center flex-col py-5 justify-evenly">
        <h1 className="flex items-center gap-3 text-xl font-semibold">Email-Verification</h1>
        
        <form className="flex flex-col gap-5" onSubmit={handleVerifyEmail}>
          <InputOTP maxLength={6} value={verificationOTP} onChange={(value) => setVerificationOTP(value)}>
            <InputOTPGroup >
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <button type="submit" className="text-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md cursor-pointer font-semibold">Verify Email</button>
        </form>

      </div>
      {loading && <Loading />}
    </div>
  );
};

export default VerifyPage;