import React from "react";
// import logo from "../assets/logo.png";

const Spinner = () => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white">
            <div className="text-7xl max-md:text-5xl font-bold animate-bounce">
                Res<span className="text-[#9ac31f]">Q</span>Food
                {/* <img
                    src={logo}
                    alt="Loading..."
                    className="w-50 h-50 max-md:w-40 max-md:h-40"
                /> */}
            </div>
        </div>
    );
};

export default Spinner;
