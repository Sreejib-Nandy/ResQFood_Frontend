import React from 'react'
import Navbar from './components/Navbar';
import { useEffect } from 'react';
import { socket } from './socket/socket';
import { AuthProvider,useAuth } from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/SignUp';
import LogIn from './pages/LogIn';
import Spinner from './components/Spinner';
import { Toaster } from 'react-hot-toast';
import UpdateProfile from './pages/UpdateProfile';
import ProtectedRoute from './route/ProtectedRoute';
import CookieConsent from './components/CookieConsent';


function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Spinner/>;
  }

//   useEffect(() => {
//   socket.on("foodClaimed", () => window.location.reload());
//   socket.on("foodCollected", () => window.location.reload());
// }, []);

  return (
    <AuthProvider>
        <Toaster/>
        <Navbar />
        <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/signup" element={<Signup/>} />
        <Route exact path="/login" element={<LogIn/>} />
        <Route exact path="/updateprofile" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
        </Routes>
        <CookieConsent/>
    </AuthProvider>
  );
}

export default App
