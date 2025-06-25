import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, replace } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import { useAuthStore } from "./zustand/useAuthStore";
import { GoogleOAuthProvider } from "@react-oauth/google";

const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginBox"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const App = () => {
  const {isAuthenticated, authUser, checkAuth, isEmailVerified} = useAuthStore();

  

  useEffect(() => {
    checkAuth();
  },[checkAuth, isAuthenticated])


  return (
    <>
      <Toaster position="top-center" duration={7000} />
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={authUser && isAuthenticated ? <HomePage /> : <Navigate to='/login'/>}/>
          <Route path="/login" element={isAuthenticated && authUser?.isVerified ? <Navigate to="/"/> : <GoogleOAuthProvider clientId='774531537923-pk0nitd7i860j56psbopver812kogdq4.apps.googleusercontent.com'><LoginPage /></GoogleOAuthProvider>}/>
          <Route path="/verify" element={isEmailVerified ? <Navigate to={"/login"}/> : <VerifyPage />}/>
          <Route path="/forgot-password" element={<ForgotPassword /> }/>
          <Route path="/reset-password/:code" element={<ResetPassword /> }/>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
