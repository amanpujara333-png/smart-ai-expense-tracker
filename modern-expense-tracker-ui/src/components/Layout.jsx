import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Receipt, 
    PieChart, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Wallet,
    TrendingUp,
    Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link to={path}>
        <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center p-3 mb-2 rounded-xl cursor-pointer transition-all duration-300 ${
                active 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
        >
            <Icon size={20} className={active ? 'text-blue-400' : ''} />
            {!collapsed && (
                <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 font-medium"
                >
                    {label}
                </motion.span>
            )}
        </motion.div>
    </Link>
);

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: Settings, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-gray-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.div
                animate={{ width: collapsed ? 80 : 260 }}
                className="glass-dark border-r border-gray-800 flex flex-col p-4 relative z-50"
            >
                <div className="flex items-center mb-10 px-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                            >
                                Expense Tracker
                            </motion.span>
                            <span className="text-[10px] text-blue-400 font-medium uppercase tracking-tighter">
                                2026 Project BCA - Aman Pujara
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 bg-gray-800 border border-gray-700 rounded-full p-1 text-gray-400 hover:text-white"
                >
                    {collapsed ? <Menu size={14} /> : <X size={14} />}
                </button>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-y-auto">
                {/* Gradient Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] -z-10 rounded-full" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] -z-10 rounded-full" />

                <header className="h-16 border-b border-gray-800/50 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40">
                    <h2 className="text-lg font-semibold text-gray-200">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-gray-400">Premium Plan</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="avatar" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
