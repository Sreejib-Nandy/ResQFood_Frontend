import React from 'react'

const Features = (props) => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

    // Adjust the threshold value to control the tilt effect
    const threshold = 12;

    const handleMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setTilt({ x: y * -threshold, y: x * threshold });
    };
    return (
        <div className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer max-w-100 max-h-100 bg-gray-100"
            onMouseMove={handleMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
            <img src={props.img}
                alt={props.name} className="w-full h-52 object-cover"
            />
            <h3 className="mt-3 px-4 pt-3 mb-1 text-2xl font-bold text-gray-800">
                {props.title}
            </h3>
            <p className="px-4 pb-2 text-gray-600 w-5/6">
                {props.body}
            </p>
            <button className="px-4 py-2 mb-6 mx-4 bg-[#a4d511] rounded-full text-sm cursor-pointer hover:bg-gray-200 transition all duration-700">know more</button>
        </div>

    );
}

export default Features
