import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import api from "../api/axios";
import logo from '../assets/logo.png';
import upload from "../assets/upload_area.png"
import Spinner from '../components/Spinner';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { SaveAll, Trash2 } from 'lucide-react';
import DeleteModal from '../components/DeleteModal';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const { user, loading, hardLogout } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || "",
        address: user?.address || "",
        contactInfo: user?.contactInfo || "",
    });

    const [avatar, setAvatar] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    // useEffect(() => {
    //     if (!loading && !user) {
    //         navigate("/", { replace: true });
    //     }
    // }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                address: user.address || "",
                contactInfo: user.contactInfo || "",
            });
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Session expired. Please login again.");
            return;
        }

        if (form.contactInfo && !/^\d{10}$/.test(form.contactInfo)) {
            toast.error("Contact number must be 10 digits");
            return;
        }

        const formData = new FormData();

        if (form.name.trim()) formData.append("name", form.name.trim());
        if (form.address.trim()) formData.append("address", form.address.trim());
        if (form.contactInfo.trim()) formData.append("contactInfo", form.contactInfo.trim());
        if (avatar) formData.append("avatar", avatar);

        setSubmitting(true);
        try {
            const res = await api.patch("/users/me", formData, {
                withCredentials: true,
            });

            const data = res.data;
            window.scrollTo(0, 0);

            if (!data.success) {
                toast.error(data.message || "Update failed");
                return;
            }
            toast.success("Profile updated successfully");

            // Option 1 (quick): reload
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);

            // Option 2 (better UX): update AuthContext user instead of reload

        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete("/users/me", { withCredentials: true });

            toast.success("Account deleted permanently");

            setShowDeleteModal(false);

            hardLogout();

            setTimeout(() => {
                window.location.replace("/");
            }, 800);

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete account");
        }
    };


    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl shadow-[#ccff33] p-8 my-5 mb-15 max-md:mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 border-[#b0e510]">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="LOGO" className="w-20 h-auto" />
                            <div>
                                <h2 className="font-bold text-lg">Edit Profile</h2>
                                <div className="text-sm text-slate-500">
                                    {user?.role == "restaurant" ? "You joined our ResQFood as a Restaurant Owner" : "You joined our ResQFood as a NGO"}
                                </div>
                            </div>
                        </div>
                        <div className="text-l text-slate-600">
                            {user?.role == "restaurant" ? "Don't you think - Good food deserves a second chance?" : "Food is more than nourishment — it’s hope. What do you think?"}
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.avatar?.url || upload}
                                alt="avatar"
                                className="w-18 h-15 rounded-full object-cover"
                            />
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className='w-full py-10 px-4 border-2 rounded-lg border-[#9fc235] border-dashed' />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="text-sm text-slate-600">Organization Name</label>
                            <input name="name" value={form.name} onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg" />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-sm text-slate-600">Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg"
                            />
                        </div>

                        {/* Contact Info */}
                        <div>
                            <label className="text-sm text-slate-600">Contact Info</label>
                            <input
                                name="contactInfo"
                                value={form.contactInfo}
                                onChange={handleChange}
                                className="w-full mt-1 px-3 py-2 border rounded-lg" />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#9fc235] text-white py-3 mt-4 rounded-lg hover:bg-[#c3ec47] disabled:opacity-60 transition all duration-300 cursor-pointer flex items-center justify-center gap-3">
                            {submitting ? "Saving..." : "Save Changes"}
                            <SaveAll />
                        </button>
                    </form>

                    <div className='min-md:relative min-md:-right-[23.6vw]'>
                        <button
                            type="button"
                            onClick={() => {
                                setShowDeleteModal(true);
                                scrollTo(0, 0);
                            }}
                            className="w-full bg-red-600/90 text-white py-3 rounded-lg hover:bg-red-600/70 disabled:opacity-60 transition all duration-300 cursor-pointer flex items-center justify-center gap-3">
                            Delete Account
                            <Trash2 />
                        </button>

                        <DeleteModal
                            isOpen={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={handleDelete}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UpdateProfile

