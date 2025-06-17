import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import { useAuthStore } from "./zustand/useAuthStore";


const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginBox"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));

const App = () => {
  const {isEmailVerified, isAuthenticated, authUser, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  },[])

  return (
    <>
      <Toaster position="top-center" duration={7000} />
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />}/>
          <Route path="/login" element={isAuthenticated ? <Navigate to={"/"}/> : <LoginPage />}/>
          <Route path="/verify" element={isEmailVerified ? <Navigate to={"/login"}/> : <VerifyPage />}/>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
