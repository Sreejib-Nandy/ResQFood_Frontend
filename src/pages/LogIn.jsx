import React, { useState } from 'react'
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";
import Footer from '../components/Footer';

const LogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { login } = useAuth();

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(formData);

    //   if (!result.success) {
    //     toast.error(result.message);
    //     return;
    //   }

    } catch (err) {
      toast.error("Login failed. Please try again.");
      console.error(err);
    }
  };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="flex items-center justify-center min-h-[80vh] px-2">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl shadow-[#515739] p-8 my-15 max-md:mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 border-[#b0e510]">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="LOGO" className="w-20 h-auto" />
                            <div>
                                <h2 className="font-bold text-2xl">Log in to your account</h2>
                            </div>
                        </div>
                        <div className="text-l text-slate-600">Once logged in, you’ll be able to manage posts, share surplus food, or collect meals from nearby partners.</div>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full text-center border border-gray-300/40 rounded-2xl px-5 bg-white">
                        <h1 className="text-gray-900 text-3xl mt-5 font-medium">Login</h1>
                        <p className="text-gray-500 text-sm mt-2">Please log in to continue</p>
                        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 max-md:pl-2 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                            <input type="email" name="email" placeholder="Email id" className="border-none outline-none" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-5 max-md:pl-2 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="mt-4 text-left text-[#9fc235]">
                            <button className="text-sm pl-2" type="reset">Forget password?</button>
                        </div>
                        <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-[#9fc235] hover:opacity-90 cursor-pointer transition-opacity">Log in
                        </button>
                        <p className="text-gray-500 text-sm mt-3 mb-11 text-center">"Don't have an account?"<Link to="/signup" className="text-[#9fc235] hover:underline" onClick={() => scrollTo(0,0)}> Sign up</Link></p>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default LogIn
