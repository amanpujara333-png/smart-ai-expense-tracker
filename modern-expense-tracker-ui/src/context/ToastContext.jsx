import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
                                toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            } backdrop-blur-xl min-w-[300px]`}
                        >
                            {toast.type === 'success' ? <CheckCircle size={20} /> :
                             toast.type === 'error' ? <AlertCircle size={20} /> :
                             <Info size={20} />}
                            
                            <p className="flex-1 font-medium">{toast.message}</p>
                            
                            <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
