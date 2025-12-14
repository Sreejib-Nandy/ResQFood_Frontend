import React from 'react'
import { Link } from 'react-router-dom'
import CountUp from './CountUp'
import Features from './Features'

import matching from "../assets/matching.png";
import workflow from "../assets/workflow.jpg";
import waste from "../assets/waste.jpg";

import food from "../assets/food.jpg";
import bp from "../assets/bp.jpg";
import goonj from "../assets/goonj.jpg";
import Testimonials from './Testimonials';
import Footer from './Footer';

const HeroSection = () => {
    return (
        <div className="max-h-screen relative pt-16 md:pt-20">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://plus.unsplash.com/premium_photo-1733306621909-1d63c088a93e?fm=jpg&q=60&w=1920')", opacity: 0.9
                }}
            />
            <div className="absolute inset-0 bg-black/55" />
            {/* HERO SECTION */}
            <header className="relative z-10">
                <div
                    className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start lg:items-center gap-12 lg:gap-16 pt-11 md:pt-20 pb-20 md:pb-28">
                    {/* LEFT HERO COLUMN */}
                    <div className="w-full md:w-2/3 lg:w-1/2 text-white flex flex-col max-md:items-center">
                        <h1 className="text-5xl sm:text-5xl lg:text-7xl font-bold leading-tight max-md:pl-3">
                            Connecting{" "}
                            <span className="bg-[#ccff33] bg-clip-text text-transparent">
                                Restaurants
                            </span>{" "}
                            with{" "}
                            <span className="bg-[#02c39a] bg-clip-text text-transparent">
                                Communities
                            </span>
                        </h1>
                        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-xl max-md:text-center">
                            Connect restaurants and food providers with NGOs and volunteers
                            to redistribute surplus meals to those who need them.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/signup"
                                className="bg-white/90 text-green-700 px-5 py-3 flex items-center rounded-lg shadow font-bold max-md:font-medium hover:text-white hover:bg-green-700 transition all duration-700"
                            >
                                Get Started
                            </Link>
                            <a
                                href="#testimonials"
                                className="border-2 border-white/30 text-white px-5 py-3 rounded-lg font-bold max-md:font-medium flex items-center "
                            >
                                Testimonials
                            </a>
                        </div>
                        {/* Mobile Stats */}
                        <div className="mt-10 grid grid-cols-3 gap-4 md:hidden">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-500"><CountUp
                                    from={0}
                                    to={673}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />+</div>
                                <div className="text-white/80 text-md">Meals Shared</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#78C841]"><CountUp
                                    from={0}
                                    to={162}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />+</div>
                                <div className="text-white/80 text-md">Restaurants</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#8db5f6]"><CountUp
                                    from={0}
                                    to={58}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />+</div>
                                <div className="text-white/80 text-md">NGOs</div>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT METRICS CARD (Desktop/Tablet) */}
                    <div className="hidden md:flex justify-end w-full md:w-1/2">
                        <div
                            className="w-full max-w-md relative rounded-xl p-8 shadow-2xl"
                            style={{ backgroundColor: "rgba(240, 248, 255, 0.2)", border: "1px solid rgba(255,255,255,0.6)", }}>
                            <div className="grid gap-6">
                                <div>
                                    <div className="text-4xl lg:text-7xl font-extrabold text-orange-500">
                                        <CountUp
                                            from={0}
                                            to={673}
                                            separator=","
                                            direction="up"
                                            duration={1}
                                            className="count-up-text"
                                        />+</div>
                                    <div className="text-xl lg:text-3xl font-bold text-black">
                                        Meals Shared
                                    </div>
                                </div>
                                <div>
                                    <div className="text-4xl lg:text-7xl font-extrabold text-[#78C841]">
                                        <CountUp
                                            from={0}
                                            to={162}
                                            separator=","
                                            direction="up"
                                            duration={1}
                                            className="count-up-text"
                                        />+</div>
                                    <div className="text-xl lg:text-3xl font-bold text-black">
                                        Restaurants
                                    </div>
                                </div>
                                <div>
                                    <div className="text-4xl lg:text-7xl font-extrabold text-[#DCE4B8]">
                                        <CountUp
                                            from={0}
                                            to={58}
                                            separator=","
                                            direction="up"
                                            duration={1}
                                            className="count-up-text"
                                        />+</div>
                                    <div className="text-xl lg:text-3xl font-bold text-black">
                                        NGO Partners
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* FEATURES */}
            <main className="relative z-10">
                <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 pt-35 max-md:pt-25 flex justify-center">
                    <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <Features
                            title="Real-time Matching"
                            body="Restaurants post surplus food, and nearby NGOs get instant notifications through our live map."
                            img={matching}
                            name="real matching app"
                        />
                        <Features
                            title="Simple Workflow"
                            body="Share surplus food in seconds — just add details and your post goes live instantly."
                            img={workflow}
                            name="Simple Workflow"
                        />
                        <Features
                            title="Track & Report"
                            body="Track collections, measure impact and get reports to help reduce waste and feed people."
                            img={waste}
                            name="Track & Report"
                        />
                    </div>
                </section>
                {/* TESTIMONIALS */}
                <section
                    id="testimonials"
                    className="max-w-7xl mx-auto px-4 sm:px-6 py-35 max-md:pt-25">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-[#f9570c]">
                            What Our Partners Say
                        </h1>
                        <p className="text-lg sm:text-xl text-[#3e3737] mt-4">
                            Behind every saved meal is a story of hope — and we’ve seen thousands of them.
                        </p>
                    </div>

                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <Testimonials
                            quote="ResQFood helped us stop wasting perfectly good meals and feed people in our area."
                            author="— The Majestic Restaurant"
                            type="Restaurant"
                            img={food}
                        />

                        <Testimonials
                            quote="Super easy to claim posts and coordinate pickups — game changer."
                            author="— Goonj"
                            type="Poverty Alleviation NGO"
                            img={goonj}
                        />

                        <Testimonials
                            quote="Fast matching and clear information — saved time and food."
                            author="— 6 Ballygunge Place"
                            type="Restaurant cum Bar"
                            img={bp}
                        />
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default HeroSection
