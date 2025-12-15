import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import Footer from "../components/Footer";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "restaurant",
        password: "",
        confirmpassword: "",
        address: "",
        contactInfo: "",
    });

    const [errors, setErrors] = useState({});
    const { signup } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    }

    function validate() {
        const err = {};

        if (!form.name.trim()) err.name = "Full name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            err.email = "Valid email required";

        if (!form.contactInfo.match(/^[\d+\s-]{10}$/))
            err.contactInfo = "Phone number must be exactly 10 digits";

        if (!form.address.trim()) err.address = "Address is required";

        if (!form.password) err.password = "Password is required";

        // STRONG PASSWORD VALIDATION (same as backend)
        if (
            !form.password.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
            )
        ) {
            err.password = "Must include uppercase, lowercase, number & symbol";
        }

        if (form.confirmpassword !== form.password)
            err.confirmpassword = "Passwords do not match";

        return err;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) {
            return;
        }

        try {
            const result = await signup(form);
        
        navigate("/login");
        scrollTo(0,0);
        } catch (err) {
            toast.error("Registration failed. Please try again.");
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl shadow-[#515739] p-8 my-15 max-md:mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 border-[#b0e510]">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="LOGO" className="w-20 h-auto" />
                            <div>
                                <h2 className="font-bold text-lg">Create your account</h2>
                                <div className="text-sm text-slate-500">
                                    Join ResQFood as a Restaurant or NGO partner
                                </div>
                            </div>
                        </div>
                        <div className="text-l text-slate-600">After signup, you'll be able to create posts to share surplus food or to collect food.</div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label className="text-sm text-slate-600">Organization Name</label>
                            <input name="name" value={form.name} onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Your organization name" />
                            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                        </div>

                        {/* Email */}
                        <div>
                             <label className="text-sm text-slate-600">Email</label>
                             <input name="email" value={form.email} onChange={handleChange}
                                 className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="you@example.com" />
                             {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                         </div>

                        {/* Phone + Role */}
                        <div className="w-full mt-1 py-2 rounded-lg">
                            <div>
                                <label className="text-sm text-slate-600">Role</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-2 py-2 border rounded-lg"
                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="ngo">NGO</option>
                                </select>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-sm text-slate-600">Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="Your address"
                            />
                            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <label className="text-sm text-slate-600">Contact Info</label>
                            <input
                                name="contactInfo"
                                value={form.contactInfo}
                                onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="+91 98765 XXXXX"
                            />
                            {errors.contactInfo && <p className="text-xs text-red-500">{errors.contactInfo}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm text-slate-600">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="Your password"
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm text-slate-600">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmpassword"
                                value={form.confirmpassword}
                                onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="Confirm password"
                            />
                            {errors.confirmpassword && (
                                <p className="text-xs text-red-500">{errors.confirmpassword}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-[#9fc235] text-white py-3 mt-4 rounded-lg hover:bg-[#c3ec47] disabled:opacity-60 cursor-pointer">
                            Create account
                        </button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

