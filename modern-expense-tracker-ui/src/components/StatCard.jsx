import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass p-6 rounded-2xl relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 blur-3xl -z-10 group-hover:bg-${color}-500/20 transition-all duration-500`} />
        
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
                <Icon size={24} />
            </div>
            <div className={`flex items-center text-sm ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {change >= 0 ? '+' : ''}{change}%
            </div>
        </div>

        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">${value.toLocaleString()}</p>
        
        <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                className={`h-full bg-${color}-500`}
            />
        </div>
    </motion.div>
);

export default StatCard;
