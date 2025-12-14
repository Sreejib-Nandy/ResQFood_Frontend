import React from "react";
import gif from "../assets/loader.gif";

const Spinner = () => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white">
            <div className="text-7xl max-md:text-5xl font-bold">
                <img
                    src={gif}
                    alt="Loading..."
                    className="w-80 h-80 max-md:w-50 max-md:h-50"
                />
                {/* Res<span className="text-[#9ac31f]">Q</span>Food */}
            </div>
        </div>
    );
};

export default Spinner;
