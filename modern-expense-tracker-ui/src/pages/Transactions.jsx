import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Download, 
    Plus, 
    Trash2, 
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import api from '../services/api';
import AddTransactionModal from '../components/AddTransactionModal';
import { useToast } from '../context/ToastContext';

const Transactions = () => {
    const { addToast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transactions'); 
            setTransactions(res.data);
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = (newTrans) => {
        setTransactions([newTrans, ...transactions]);
        addToast('Transaction added!', 'success');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this transaction?")) return;
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter(t => t.id !== id));
            addToast('Transaction deleted.', 'info');
        } catch (err) {
            addToast('Delete failed.', 'error');
        }
    };

    const filteredTransactions = transactions.filter(t => 
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Expenses</h1>
                    <p className="text-gray-400">Total {transactions.length} records</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>

            <AddTransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAdd={handleAdd} 
            />

            {/* Search Bar */}
            <div className="glass p-4 rounded-2xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search your history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e293b]/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Simple List */}
            <div className="glass rounded-3xl overflow-hidden">
                <div className="divide-y divide-gray-800">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading your history...</div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-20 text-center text-gray-500">
                            <p className="text-lg font-medium">No transactions yet.</p>
                            <p className="text-sm">Click "Add New" to get started!</p>
                        </div>
                    ) : filteredTransactions.map((t) => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 flex items-center justify-between hover:bg-white/5 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                    t.amount < 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                    {t.amount < 0 ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">{t.text}</p>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest">{t.category} • {t.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className={`text-xl font-black ${t.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                </p>
                                <button 
                                    onClick={() => handleDelete(t.id)}
                                    className="p-3 hover:bg-rose-500/10 text-rose-400 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Transactions;
