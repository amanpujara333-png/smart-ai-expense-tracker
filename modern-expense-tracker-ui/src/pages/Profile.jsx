import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Shield, Save, Upload } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { addToast } = useToast();
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/user/profile');
            setProfile(res.data);
            if (res.data.hasImage) {
                const imgRes = await api.get('/user/profile/image', { responseType: 'blob' });
                setImagePreview(URL.createObjectURL(imgRes.data));
            }
        } catch (err) {
            console.error("Profile fetch failed", err);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            await api.post('/user/profile/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImagePreview(URL.createObjectURL(file));
            addToast('Profile image updated!', 'success');
        } catch (err) {
            addToast('Failed to upload image.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="glass p-8 rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-purple-600 -z-10 opacity-20" />
                
                <div className="flex flex-col md:flex-row items-center gap-8 pt-8">
                    {/* Avatar Upload */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-gray-800 overflow-hidden bg-gray-700 shadow-xl">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-500 transition-all shadow-lg">
                            <Camera size={18} className="text-white" />
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2">{profile.username}</h2>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} /> {profile.email}
                        </p>
                        <div className="mt-4 flex gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">BCA 2026 Project</span>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold">By Aman Pujara</span>
                        </div>
                    </div>

                    <div className="hidden lg:block glass bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Security Strength</p>
                                <p className="text-sm font-bold text-white">Advanced</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="glass p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white">Personal Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <input 
                                type="text" 
                                disabled
                                value={profile.username}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 px-4 text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input 
                                type="text" 
                                disabled
                                value={profile.email}
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 px-4 text-gray-500"
                            />
                        </div>
                        <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-all text-gray-300">
                            Request Name Change
                        </button>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="glass p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white">Account Settings</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">Enable for extra security</p>
                            </div>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Monthly Reports</p>
                                <p className="text-xs text-gray-500">Receive email summaries</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                        <button className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-sm font-medium transition-all text-rose-400">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
