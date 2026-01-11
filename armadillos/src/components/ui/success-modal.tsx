
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

export function SuccessModal({ isOpen, onClose, title = "Success", message }: SuccessModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-6 flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                                <CheckCircle className="w-8 h-8 text-amber-500" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-zinc-400 mb-6 font-light leading-relaxed">
                                {message}
                            </p>

                            {/* Action */}
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                Continue
                            </button>
                        </div>

                        {/* Decorative bottom line */}
                        <div className="h-1 w-full bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
