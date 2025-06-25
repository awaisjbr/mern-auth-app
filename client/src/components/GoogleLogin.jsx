import React from 'react';
import {useGoogleLogin} from "@react-oauth/google"
import { FcGoogle } from 'react-icons/fc';
import { googleAuth } from '../utils/GoogleApi';
import { useAuthStore } from '../zustand/useAuthStore';
import Loading from './Loading';

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
        onSuccess: responseGoogle, // Pass the actual callback here
        onError: (error) => console.log('Login Failed:', error),
        flow: 'auth-code', // use 'implicit' if you're not exchanging on backend
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
