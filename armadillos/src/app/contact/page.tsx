"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContent, type SiteContent } from "@/lib/cms";
import { BranchesMap } from "@/components/contact/BranchesMap";

import { toast } from "sonner";

export default function ContactPage() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        inquiryType: "General Inquiry",
        message: ""
    });

    useEffect(() => {
        getContent().then(setContent);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch('http://localhost:3005/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    subject: `${formData.inquiryType}`,
                    message: formData.message,
                    inquiryType: formData.inquiryType
                })
            });

            if (res.ok) {
                toast.success("Message sent! We will contact you shortly.");
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    inquiryType: "General Inquiry",
                    message: ""
                });
            } else {
                toast.error("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setSending(false);
        }
    };

    const contact = content?.contact || {
        title: "Global Headquarters",
        address: "Golden Jubilee Towers, 14th Floor\nOhio Street, P.O. Box 4567\nDar Es Salaam, Tanzania",
        emails: ["invest@armadillos.co.tz", "info@armadillos.co.tz"],
        phones: ["+255 22 212 3456", "+255 76 712 3456"]
    };

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />

            <PageHero
                title="Get in Touch"
                highlight="Touch"
                subtitle="Ready to discuss investment opportunities? Our specialized team is here to assist you."
            />

            <section className="relative py-20 overflow-hidden">

                <div className="container mx-auto px-4 z-10 relative">

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                        {/* Contact Info Card (Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 backdrop-blur-md h-fit lg:sticky lg:top-32 shadow-xl dark:shadow-none"
                        >
                            <h3 className="text-3xl font-serif text-slate-900 dark:text-white mb-10">Global Headquarters</h3>

                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-all">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white text-lg font-bold mb-2">{contact.title}</h4>
                                        <a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line hover:text-amber-500 transition-colors">
                                            {contact.address}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-all">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Email Us</h4>
                                        {contact.emails.map((email: string, i: number) => (
                                            <a key={i} href={`mailto:${email}`} className="block text-slate-600 dark:text-slate-300 text-lg hover:text-amber-500 transition-colors">{email}</a>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-all">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white text-lg font-bold mb-2">Call Us</h4>
                                        {contact.phones.map((phone: string, i: number) => (
                                            <a key={i} href={`tel:${phone.replace(/\s+/g, '')}`} className="block text-slate-600 dark:text-slate-300 text-lg hover:text-amber-500 transition-colors">{phone}</a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pro Contact Form (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative group"
                        >
                            {/* Animated Gradient Border Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 rounded-[3rem] opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-1000 animate-gradient-xy" />

                            <div className="relative p-8 md:p-12 rounded-[3rem] bg-white dark:bg-black border border-slate-200 dark:border-white/10 shadow-2xl">

                                <div className="mb-10">
                                    <h3 className="text-4xl font-serif text-slate-900 dark:text-white mb-4">Send a Message</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg">Our team typically responds within 24 hours.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group/input">
                                            <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-amber-400">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-white/20 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-500"
                                                placeholder="Enter first name"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 group/input">
                                            <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-amber-400">Last Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-white/20 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-500"
                                                placeholder="Enter last name"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group/input">
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-amber-400">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-white/20 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-500"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2 group/input">
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-amber-400">Inquiry Type</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-white/20 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer"
                                                value={formData.inquiryType}
                                                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                                            >
                                                <option className="bg-white dark:bg-slate-900">Investment Opportunity</option>
                                                <option className="bg-white dark:bg-slate-900">Real Estate Viewing</option>
                                                <option className="bg-white dark:bg-slate-900">Agrobusiness Partnership</option>
                                                <option className="bg-white dark:bg-slate-900">General Inquiry</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                                                <ArrowRight size={20} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group/input">
                                        <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-amber-400">Your Message</label>
                                        <textarea
                                            rows={5}
                                            required
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-lg focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-white/20 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none placeholder:text-slate-500"
                                            placeholder="Tell us how we can help..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <Button
                                        disabled={sending}
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-black font-bold text-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="mr-3">{sending ? "Sending..." : "Send Message"}</span>
                                        <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </Button>
                                </form>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            <BranchesMap />

            <Footer />
        </main>
    );
}
