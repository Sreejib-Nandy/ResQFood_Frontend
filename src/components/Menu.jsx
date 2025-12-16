import React, { useState } from 'react'
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Menu = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="text-sm w-40 p-3 bg-white border border-gray-500/30 text-gray-800/80 rounded-md font-medium">
            <ul className="flex flex-col gap-px">
                <li className="flex items-center justify-between gap-2 cursor-pointer px-1 py-1 rounded hover:bg-gray-500/20 transition" onClick={() => {navigate("/updateprofile");scrollTo(0,0)}}>
                    <a href="#" className="-mr-px">Edit Profile</a>
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.672 6.763 5.58 15.854l-.166 2.995 2.995-.166L17.5 9.59m-2.828-2.828 1.348-1.349a2 2 0 1 1 2.829 2.829L17.5 9.59m-2.828-2.828L17.5 9.591" stroke="#1F2937" strokeWidth=".96" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </li>
                <div className="w-full h-px bg-gray-300/70 my-2"></div>
                <li className="flex items-center text-red-600/80 justify-between gap-3 cursor-pointer px-1 py-2 rounded hover:bg-red-600/20 transition" onClick={() => {logout();navigate("/");scrollTo(0,0)}}>
                    <p>Log out</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                </li>
            </ul>
        </div>
    );
}

export default Menu
