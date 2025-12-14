import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, X as XIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import upload from "../assets/upload_area.png"
import Menu from "./Menu";

const Navbar = () => {
  const [isOpen, setisOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 pr-5 sm:px-6 md:px-8 lg:px-16 py-2.5 max-md:py-4 text-white bg-blue-950/50 backdrop-blur-md">
        {/* Logo */}
        <Link to="/" className="flex-1 flex items-center" onClick={() => { scrollTo(0, 0); }}>
          <img
            src={logo}
            alt="Logo"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain cursor-pointer"
          />
          <p className="text-4xl max-md:text-3xl">Res<span className="text-[#ccff33]" style={{ fontFamily: '"Sekuya", system-ui',  fontWeight: 700,}}>Q</span>Food</p>
        </Link>

        {/* Desktop Navigation */}
        <div className={`max-md:absolute max-md:top-0 max-md:-left-10 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-7 md:px-6 py-3 max-md:px-3 max-md:h-screen md:rounded-full backdrop-blur-3xl bg-black/85 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
          <XIcon className='md:hidden absolute top-6 right-6 w-8 h-8 cursor-pointer' onClick={() => { setisOpen(false) }} />
          <Link to="/" onClick={() => { scrollTo(0, 0); setisOpen(false) }} className="hover:text-[#ccff33] transition-all duration-400">Home</Link>
          <a href={isHome ? "#features" : undefined} onClick={() => { setisOpen(false) }} className={`${!isHome
            ? "text-gray-400 cursor-not-allowed"
            : "hover:text-[#ccff33]"} transition-all duration-600`} aria-disabled={!isHome}>About</a>
          <a href={isHome ? "#testimonials" : undefined} onClick={() => { setisOpen(false) }} className={`${!isHome
            ? "text-gray-400 cursor-not-allowed"
            : "hover:text-[#ccff33]"} transition-all duration-600`} aria-disabled={!isHome}>Testimonials</a>


          {user && user?.role == 'restaurant' && (<Link to="/restaurantdashboard" onClick={() => { scrollTo(0, 0); setisOpen(false) }} className="hover:text-[#ccff33] transition-all duration-400 ">
            Restaurant Dashboard
          </Link>)}
          {user && user?.role == 'ngo' && (<Link to="/ngodashboard" onClick={() => { scrollTo(0, 0); setisOpen(false) }} className="hover:text-[#ccff33] transition-all duration-400">
            NGO Dashboard
          </Link>)}
          {!user && (
            <>
              <button
                onClick={() => { navigate("/login"), setisOpen(false), scrollTo(0, 0) }}
                className="bg-green px-4 py-2 rounded-full font-medium hover:bg-green-dull transition text-[#ccff33] cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => { navigate("/signup"), setisOpen(false), scrollTo(0, 0) }}
                className="bg-[#7da30be6] px-5 py-2 rounded-full font-medium hover:bg-[#a6ca38d0] transition cursor-pointer"
              >Register
              </button>
            </>)}
        </div>

        {user && (
          <div className="relative ml-4">
            <img
              src={user.avatar?.url || upload}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => setMenuOpen(prev => !prev)}
            />

            {menuOpen && (
              <div className="absolute right-0 top-12 z-50" onClick={() => setMenuOpen(prev => !prev)}>
                <Menu />
              </div>
            )}
          </div>
        )}

        <MenuIcon className='md:hidden w-8 h-8 cursor-pointer ml-8' onClick={() => { setisOpen(true) }} />
      </div>
    </>
  );
};

export default Navbar;
