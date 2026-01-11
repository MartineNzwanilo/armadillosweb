"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getContent, type SiteContent } from "@/lib/cms";
import { SuccessModal } from "@/components/ui/success-modal";

const defaultContent: SiteContent = {
    identity: {
        name: "Armadillos Group",
        description: "Pioneering sustainable wealth creation through strategic investments in Gold Mining, Real Estate, and Modern Agrobusiness.",
    },
    contact: {
        title: "Contact Us",
        emails: ["info@armadillos.com"],
        phones: ["+1234567890"],
        address: "123 Main St, Anytown, USA",
        socials: { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
    },
    footer: {
        newsletter_title: "Stay Updated",
        newsletter_desc: "Subscribe to our newsletter for the latest investment opportunities.",
        copyright_text: "Armadillos Company Limited",
        quick_links_title: "Explore",
        quick_links: [
            { label: "Home", url: "/" },
            { label: "Mining", url: "/mining" },
            { label: "Real Estate", url: "/real-estate" },
            { label: "Agrobusiness", url: "/agrobusiness" },
            { label: "Contact", url: "/contact" }
        ],
        legal_links_title: "Company",
        legal_links: [
            { label: "About Us", url: "#" },
            { label: "Careers", url: "#" },
            { label: "Privacy Policy", url: "#" },
            { label: "Terms of Service", url: "#" }
        ]
    },
    sections: {
        hero: { title: "", subtitle: "", cta_text: "", cta_link: "", background_url: "" },
        mining: { title: "", description: "", image_url: "", link: "" },
        real_estate: { title: "", description: "", image_url: "", link: "" },
        agrobusiness: { title: "", description: "", image_url: "", link: "" },
        partners: { title: "", description: "" }
    },
    partners: [],
    about: { page_content: { title: "", content: "", image_url: "", mission: "", vision: "", values: [] } },
    // Missing fields to satisfy SiteContent interface
    locations: [],
    home: {
        hero: {}, partners_section: {}, mining_section: {}, real_estate_section: {}, agrobusiness_section: {}, sectors: []
    },
    real_estate_listings: [],
    mining: { stats: {}, page_content: {}, projects: [] },
    agrobusiness: { stats: {}, page_content: {}, crops: [] },
    chemicals: { stats: {}, page_content: {}, projects: [] },
    elution: { stats: {}, page_content: {}, projects: [] },
    real_estate_page: { hero: {}, investment_opportunities: [] }
};

export function Footer({ content: initialContent }: { content?: SiteContent }) {
    const [content, setContent] = useState<SiteContent>(initialContent || defaultContent);
    const [email, setEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false);
    const [message, setMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (!initialContent) {
            getContent().then(data => {
                if (data) setContent(data);
            });
        }
    }, [initialContent]);

    const handleSubscribe = async () => {
        if (!email) return;
        setSubscribing(true);
        setMessage("");
        try {
            const res = await fetch('http://192.168.20.169:3005/api/v1/subscribers/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setShowSuccess(true);
                setEmail("");
            } else {
                setMessage(data.error || "Failed. Try again.");
            }
        } catch (e) {
            setMessage("Network error. Try again.");
        } finally {
            setSubscribing(false);
        }
    };

    // Fallbacks
    const socials = content?.contact.socials || defaultContent.contact.socials;
    const footer = content?.footer || defaultContent.footer;
    const desc = content?.identity.description || defaultContent.identity.description;

    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 pt-20 pb-10">
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Welcome to the Inner Circle"
                message="You've successfully subscribed. Check your email for a welcome message and exclusive updates."
            />

            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-20">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <div className="relative h-14 w-auto">
                                <Image
                                    src="/assets/images/logo-full.png"
                                    alt="Armadillos"
                                    width={200}
                                    height={60}
                                    className="h-full w-auto object-contain invert dark:invert-0"
                                />
                            </div>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                            {desc}
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, url: socials.facebook },
                                { Icon: Twitter, url: socials.twitter },
                                { Icon: Linkedin, url: socials.linkedin },
                                { Icon: Instagram, url: socials.instagram }
                            ].map(({ Icon, url }, i) => (
                                <a key={i} href={url} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white dark:text-slate-400 hover:bg-amber-500 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">{footer.quick_links_title || "Explore"}</h4>
                        <ul className="space-y-4">
                            {footer.quick_links?.map((item: any, i: number) => (
                                <li key={i}>
                                    <Link href={item.url} className="text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">{footer.legal_links_title || "Company"}</h4>
                        <ul className="space-y-4">
                            {footer.legal_links?.map((item: any, i: number) => (
                                <li key={i}>
                                    <Link href={item.url} className="text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-6">{footer.newsletter_title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                            {footer.newsletter_desc}
                        </p>
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 w-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                                    disabled={subscribing}
                                />
                                <Button
                                    onClick={handleSubscribe}
                                    disabled={subscribing || !email}
                                    size="icon"
                                    className="bg-amber-500 hover:bg-amber-600 text-black shrink-0"
                                >
                                    {subscribing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div> : <ArrowRight size={18} />}
                                </Button>
                            </div>
                            {message && (
                                <p className={`text-xs ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        © {new Date().getFullYear()} {footer.copyright_text}. All rights reserved.
                    </p>

                    {/* Theme Toggle Integration */}
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </footer>
    );
}
