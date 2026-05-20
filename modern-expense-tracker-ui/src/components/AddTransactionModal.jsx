import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, AlignLeft, Calendar, Tag } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
    const { addToast } = useToast();
    const [type, setType] = useState('EXPENSE');
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('OTHER');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalAmount = type === 'EXPENSE' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
            const finalCategory = type === 'INCOME' ? 'INCOME' : category;

            const res = await api.post('/transactions', {
                text,
                amount: finalAmount,
                category: finalCategory,
                date
            });
            onAdd(res.data);
            addToast('Transaction added successfully!', 'success');
            setText('');
            setAmount('');
            onClose();
        } catch (err) {
            console.error("Add failed", err);
            addToast('Failed to add transaction. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'HEALTH', 'INCOME', 'OTHER'];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-4"
                    >
                        <div className="glass bg-[#1e293b] rounded-3xl p-8 border border-white/10 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-white">New Transaction</h3>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Type Toggle */}
                                <div className="flex p-1 bg-gray-900/50 rounded-2xl border border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setType('EXPENSE')}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === 'EXPENSE' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setType('INCOME');
                                            setCategory('INCOME');
                                        }}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Income
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 flex justify-between items-center">
                                        Description
                                        {text && (
                                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                                AI Smart Categorizing...
                                            </span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input 
                                            type="text" 
                                            value={text}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setText(val);
                                                
                                                // Smart Categorization Logic
                                                if (type === 'EXPENSE') {
                                                    const lowerVal = val.toLowerCase();
                                                    const mapping = {
                                                        'FOOD': ['dominos', 'pizza', 'zomato', 'swiggy', 'kfc', 'starbucks', 'restaurant', 'coffee', 'lunch', 'dinner'],
                                                        'TRANSPORT': ['uber', 'lyft', 'ola', 'fuel', 'gas', 'petrol', 'metro', 'bus', 'train', 'taxi'],
                                                        'SHOPPING': ['amazon', 'flipkart', 'myntra', 'walmart', 'target', 'groceries', 'market', 'mall'],
                                                        'ENTERTAINMENT': ['netflix', 'spotify', 'cinema', 'movie', 'game', 'xbox', 'playstation', 'disney'],
                                                        'HEALTH': ['pharmacy', 'doctor', 'hospital', 'medicine', 'gym', 'health']
                                                    };

                                                    for (const [cat, keywords] of Object.entries(mapping)) {
                                                        if (keywords.some(k => lowerVal.includes(k))) {
                                                            setCategory(cat);
                                                            break;
                                                        }
                                                    }
                                                }
                                            }}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                                            placeholder={type === 'EXPENSE' ? "What did you spend on? (e.g. Uber, Dominos)" : "Source of income"}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input 
                                                type="date" 
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {type === 'EXPENSE' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <select 
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 appearance-none"
                                            >
                                                {categories.filter(c => c !== 'INCOME').map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Transaction'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddTransactionModal;
