import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    BrainCircuit,
    Plus,
    ArrowUpRight,
    Edit2,
    Check,
    X,
    ShieldCheck,
    Calendar,
    Zap
} from 'lucide-react';
import StatCard from '../components/StatCard';
import AddTransactionModal from '../components/AddTransactionModal';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import api from '../services/api';

const Dashboard = () => {
    const [summary, setSummary] = useState({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        categoryBreakdown: {},
        healthScore: 0,
        budgetStatus: 'Budget Not Set',
        monthlyBudget: 0,
        aiInsights: [],
        subscriptions: []
    });
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [newBudget, setNewBudget] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transRes, summaryRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/analytics/summary')
            ]);
            setTransactions(transRes.data);
            setSummary(summaryRes.data);
            setNewBudget(summaryRes.data.monthlyBudget);
        } catch (err) {
            console.error("Fetch failed", err);
        }
    };

    const handleUpdateBudget = async () => {
        try {
            await api.put('/user/budget', { budget: parseFloat(newBudget) });
            setIsEditingBudget(false);
            fetchData();
        } catch (err) {
            console.error("Budget update failed", err);
        }
    };

    const handleAdd = (newTrans) => {
        setTransactions([newTrans, ...transactions]);
        fetchData();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-12"
        >
            {/* Header with Quick Action */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Financial Intelligence</h1>
                    <p className="text-gray-400">Welcome back, <span className="text-blue-400 font-bold">Aman Pujara</span>! Here is your AI-powered overview.</p>
                </div>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <Plus size={20} />
                        New Transaction
                    </motion.button>
                </div>
            </div>

            <AddTransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAdd={handleAdd} 
            />

            {/* Top Row: Stats & Health Score */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Net Worth" 
                        value={summary.totalBalance} 
                        change={12} 
                        icon={DollarSign} 
                        color="blue" 
                    />
                    <StatCard 
                        title="Monthly Income" 
                        value={summary.monthlyIncome} 
                        change={8} 
                        icon={TrendingUp} 
                        color="emerald" 
                    />
                    <StatCard 
                        title="Monthly Expenses" 
                        value={summary.monthlyExpenses} 
                        change={-5} 
                        icon={TrendingDown} 
                        color="rose" 
                    />
                </div>

                {/* Health Score Card */}
                <motion.div variants={itemVariants} className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-500" />
                    <ShieldCheck className="text-blue-400 mb-2" size={32} />
                    <h3 className="text-gray-400 text-sm font-medium">Financial Health</h3>
                    <div className="text-4xl font-black text-white my-2">{summary.healthScore}%</div>
                    <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${summary.healthScore}%` }}
                            className={`h-full ${summary.healthScore > 70 ? 'bg-emerald-500' : summary.healthScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">Safe Spending Limit Zone</p>
                </motion.div>
            </div>

            {/* Middle Row: AI Insights & Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AI Insights Panel */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass p-8 rounded-3xl bg-blue-600/5 border-blue-500/20">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <BrainCircuit className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">AI Spending Insights</h3>
                        </div>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 animate-pulse">LIVE ANALYSIS</span>
                    </div>
                    <div className="space-y-4">
                        {summary.aiInsights.map((insight, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group"
                            >
                                <Zap className="text-amber-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
                                <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Budget Management Card */}
                <motion.div variants={itemVariants} className="glass p-8 rounded-3xl flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-white">Monthly Budget</h3>
                        {!isEditingBudget ? (
                            <button onClick={() => setIsEditingBudget(true)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-all">
                                <Edit2 size={18} />
                            </button>
                        ) : (
                            <div className="flex gap-1">
                                <button onClick={handleUpdateBudget} className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400">
                                    <Check size={18} />
                                </button>
                                <button onClick={() => setIsEditingBudget(false)} className="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400">
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow flex flex-col justify-center py-4">
                        {isEditingBudget ? (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase font-bold">Set Monthly Limit</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <div className="text-4xl font-bold text-white">${summary.monthlyBudget.toLocaleString()}</div>
                                    <div className={`text-sm font-bold mt-1 ${summary.budgetStatus === 'Exceeded' ? 'text-rose-400' : summary.budgetStatus === 'Critical' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        {summary.budgetStatus}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-500 font-bold">
                                        <span>USED: ${summary.monthlyExpenses.toLocaleString()}</span>
                                        <span>{summary.monthlyBudget > 0 ? Math.round((summary.monthlyExpenses / summary.monthlyBudget) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (summary.monthlyExpenses / summary.monthlyBudget) * 100)}%` }}
                                            className={`h-full ${summary.budgetStatus === 'Exceeded' ? 'bg-rose-500' : summary.budgetStatus === 'Critical' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Third Row: Charts & Subscriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Spending by Category Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass p-8 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6">Spending Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={Object.entries(summary.categoryBreakdown).map(([name, value]) => ({ name, value }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9'}}
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {Object.entries(summary.categoryBreakdown).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Detected Subscriptions */}
                <motion.div variants={itemVariants} className="glass p-8 rounded-3xl overflow-hidden relative">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="text-purple-400" size={20} />
                        <h3 className="text-xl font-bold text-white">Subscriptions</h3>
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {summary.subscriptions.length > 0 ? (
                            summary.subscriptions.map((sub, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                    <div>
                                        <div className="text-white font-bold text-sm">{sub.name}</div>
                                        <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">{sub.frequency}</div>
                                    </div>
                                    <div className="text-blue-400 font-black">${sub.amount}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500 italic text-sm">
                                No recurring expenses detected yet.
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
                </motion.div>
            </div>

            {/* Final Row: Recent Transactions */}
            <motion.div variants={itemVariants} className="glass p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium px-4 py-2 hover:bg-blue-500/10 rounded-xl transition-all">View Full History</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                                <th className="pb-4 font-black">Description</th>
                                <th className="pb-4 font-black">Category</th>
                                <th className="pb-4 font-black">Date</th>
                                <th className="pb-4 font-black text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.slice(0, 8).map((t, idx) => (
                                <tr key={t.id || idx} className="group hover:bg-white/5 transition-all">
                                    <td className="py-4 font-medium text-white">{t.text}</td>
                                    <td className="py-4">
                                        <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-wider group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-500 text-sm">{t.date}</td>
                                    <td className={`py-4 font-black text-right ${t.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
