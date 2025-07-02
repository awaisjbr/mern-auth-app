import React from 'react';
import {useGoogleLogin} from "@react-oauth/google"
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '../zustand/useAuthStore';

const GoogleLogin = () => {
    const {googleSignIn, loading} = useAuthStore()

    const responseGoogle = async (authResponse) => {
        try {
            if(authResponse.code){
                 await googleSignIn(authResponse.code);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle, 
        onError: (error) => console.log('Login Failed:', error),
        flow: 'auth-code',
    });

  return (
   <div>
            <button 
                onClick={() => googleLogin()} 
                className='flex items-center gap-2 bg-white py-1 px-2 rounded-lg mx-auto'
            >
                <FcGoogle className='text-xl' />
                Sign In with Google
            </button>
        </div>
  )
}

export default GoogleLogin
