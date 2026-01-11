"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle, Clock, Trash, Reply, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'NEW' | 'READ' | 'REPLIED';
    reply?: string;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyBody, setReplyBody] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('admin_token') || document.cookie.match(new RegExp('(^| )armadillos_admin_session=([^;]+)'))?.[2];
            const res = await fetch('http://localhost:3005/api/v1/contact', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMessage = async (msg: Message) => {
        setSelectedMessage(msg);
        setReplyBody("");
        if (msg.status === 'NEW') {
            // Optimistic update
            const updated = { ...msg, status: 'READ' as const };
            setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));

            // API Call
            const token = localStorage.getItem('admin_token') || document.cookie.match(new RegExp('(^| )armadillos_admin_session=([^;]+)'))?.[2];
            fetch(`http://localhost:3005/api/v1/contact/${msg.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'READ' })
            });
        }
    };

    const handleReply = async () => {
        if (!selectedMessage || !replyBody.trim()) return;
        setSendingReply(true);
        try {
            const token = localStorage.getItem('admin_token') || document.cookie.match(new RegExp('(^| )armadillos_admin_session=([^;]+)'))?.[2];
            const res = await fetch(`http://localhost:3005/api/v1/contact/${selectedMessage.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ replyBody })
            });

            if (res.ok) {
                toast.success("Reply sent successfully");
                setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, status: 'REPLIED', reply: replyBody } : m));
                setSelectedMessage(prev => prev ? { ...prev, status: 'REPLIED', reply: replyBody } : null);
            } else {
                toast.error("Failed to send reply");
            }
        } catch (error) {
            toast.error("Error sending reply");
        } finally {
            setSendingReply(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const token = localStorage.getItem('admin_token') || document.cookie.match(new RegExp('(^| )armadillos_admin_session=([^;]+)'))?.[2];
            const res = await fetch(`http://localhost:3005/api/v1/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
                if (selectedMessage?.id === id) setSelectedMessage(null);
                toast.success("Message deleted");
            }
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading inbox...</div>;

    return (
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6 p-6">
            {/* Messages List */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-xl">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex justify-between items-center">
                    <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                        <Inbox className="text-amber-500" /> Inbox
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{messages.length}</span>
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 p-2">
                    {messages.length === 0 && (
                        <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                            <Mail size={48} className="mb-4 opacity-50" />
                            <p>No messages yet.</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => handleSelectMessage(msg)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedMessage?.id === msg.id
                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30 shadow-md'
                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border-transparent hover:border-slate-100'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold ${msg.status === 'NEW' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {msg.name}
                                </h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 truncate mb-2">{msg.subject}</p>
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${msg.status === 'NEW' ? 'bg-blue-100 text-blue-600' :
                                        msg.status === 'REPLIED' ? 'bg-green-100 text-green-600' :
                                            'bg-slate-100 text-slate-500'
                                    }`}>
                                    {msg.status}
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={(e) => handleDelete(e, msg.id)}>
                                    <Trash size={12} />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Message Detail View */}
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-xl">
                {selectedMessage ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">{selectedMessage.subject}</h1>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {selectedMessage.email}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedMessage.status === 'NEW' ? 'bg-blue-100 text-blue-600' :
                                        selectedMessage.status === 'REPLIED' ? 'bg-green-100 text-green-600' :
                                            'bg-slate-100 text-slate-500'
                                    }`}>
                                    {selectedMessage.status}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {selectedMessage.reply && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-500/20 p-6 rounded-2xl">
                                    <h4 className="flex items-center gap-2 font-bold text-green-800 dark:text-green-300 mb-2">
                                        <Reply size={16} /> Previous Reply
                                    </h4>
                                    <p className="text-green-900/80 dark:text-green-200/80 whitespace-pre-line">{selectedMessage.reply}</p>
                                </div>
                            )}
                        </div>

                        {/* Reply Box */}
                        <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
                            <h4 className="font-bold text-sm text-slate-500 uppercase mb-3 ml-1">Send Response</h4>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden focus-within:ring-2 ring-amber-500/50 transition-all">
                                <textarea
                                    className="w-full p-4 h-32 resize-none focus:outline-none bg-transparent"
                                    placeholder="Type your reply here..."
                                    value={replyBody}
                                    onChange={(e) => setReplyBody(e.target.value)}
                                />
                                <div className="bg-slate-50 dark:bg-white/5 p-2 flex justify-end border-t border-slate-100 dark:border-white/5">
                                    <Button
                                        className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                                        onClick={handleReply}
                                        disabled={sendingReply || !replyBody.trim()}
                                    >
                                        <Reply size={16} /> {sendingReply ? 'Sending...' : 'Send Reply'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Mail size={40} className="opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">Select a Message</h3>
                        <p className="max-w-xs mx-auto">Click on a message from the list on the left to view details and send a reply.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
