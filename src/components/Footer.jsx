import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FacebookIcon,InstagramIcon, TwitterIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#081225d1] text-white pt-8">
      
      {/* TOP GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* BRAND + TEXT */}
        <div className="flex items-center gap-6">
          <img src={logo} alt="Logo" className="w-30 h-auto" />
          <p className="text-sm text-white/80 leading-relaxed">
            ResQFood brings restaurants and NGOs together to share surplus food and reduce waste.
          </p>
        </div>

        <div className="flex justify-between">
        {/* QUICK LINKS */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-[#ccff33]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#ccff33] transition all duration-700" onClick={() => window.scrollTo(0,0)}>
                Home
              </Link>
            </li>
            <li>
              <a href="#features" className="hover:text-[#ccff33] transition all duration-700">Mission</a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-[#ccff33] transition all duration-700">Testimonials</a>
            </li>
            <li>
              <Link to="/signup" onClick={() => scrollTo(0,0)} className="hover:text-[#ccff33] transition all duration-700">Sign Up</Link>
            </li>
          </ul>
        </div>
        {/* CONTACT */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-[#ccff33]">Contact & Support</h4>
          <div className="text-sm space-y-2">
            <p>ResQFood@hotmail.com</p>
            <p>+91 98765 43210</p>
            <p>123, Salt Lake, Kol – 700091</p>
          </div>
        </div>
        </div>
        <div className="text-sm space-y-2">
            <p className="leading-relaxed">
              <span className="text-[#ccff33] font-semibold">Need help?</span>  
              &nbsp;Email support or join our volunteer network to help collect and distribute meals.
            </p>
            <div className="flex gap-4 pt-1">
                <a href="https://www.facebook.com" target="_blank"><FacebookIcon className="hover:text-[#ccff33] transition all duration-500"/></a>
                <a href="https://www.instagram.com" target="_blank"><InstagramIcon className="hover:text-[#ccff33] transition all duration-500"/></a>
                <a href="https://x.com" target="_blank"><TwitterIcon className="hover:text-[#ccff33] transition all duration-500"/></a>
            </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/20 mt-8"></div>

      {/* COPYRIGHT */}
      <p className="text-center text-sm text-white/70 mt-4 pb-4">
        © 2025 <span className="text-white">Res<span className="text-[#ccff33]">Q</span>Food</span>. All Rights Reserved.
      </p>

    </footer>
  );
}
