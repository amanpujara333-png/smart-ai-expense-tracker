import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, TrendingUp, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/signup', { username, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#080b14] flex flex-col lg:flex-row font-sans">
            {/* Left Side: Branding (Same as Login) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-[100px]" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">Expense Tracker</span>
                    </div>
                    <div className="mb-16">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                            BCA 2026 Project • Aman Pujara
                        </span>
                    </div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-white leading-tight mb-8"
                    >
                        Join the future of <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                            Personal Finance.
                        </span>
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-md">Get started in minutes and take full control of your financial journey with our smart tracker.</p>
                </div>
                <div className="relative z-10">
                    <p className="text-gray-500 text-sm">© 2024 FinTrack AI. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#080b14]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
                        <p className="text-gray-400">Join thousands of smart spenders today.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center"
                        >
                            Account created! Redirecting to login...
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#111827] border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                                    placeholder="johndoe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#111827] border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#111827] border border-gray-800 rounded-xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-medium"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
