// import { REAL_ESTATE_PROJECTS } from "@/lib/real-estate-data"; // Removed
import { RealEstateDetailClient } from "./client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

// Dynamic routing now, no static params needed for hardcoded items


export default async function RealEstateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Try Hardcoded Data (Removed)
    let project = null;

    // 2. Try Dynamic Data (if not found in hardcoded)
    // This handles seeded data (e.g. UUIDs) that are not in the static file
    if (!project) {
        try {
            const res = await fetch(`http://localhost:3005/api/v1/projects/${slug}`, {
                cache: 'no-store',
                next: { revalidate: 0 }
            });

            if (res.ok) {
                const data = await res.json();

                // Helper to safely get location string
                const getLocString = (loc: any) => {
                    if (typeof loc === 'string') return loc;
                    if (loc && typeof loc === 'object' && loc.address) return loc.address;
                    return "Tanzania";
                };

                // Helper to safely get array/object
                const details = data.details || {};

                // Map Backend Project Model to Frontend UI Model
                project = {
                    id: data.id ? data.id.toString() : slug,
                    // Real Estate uses 'title', others 'name'. Fallback safely.
                    title: data.title || data.name,
                    // Real Estate uses top-level 'description', others might use 'details.description'
                    description: data.description || details.description || data.status || "Details available upon request.",
                    // Real Estate location is top-level (parsed object/string), others might be distinct
                    location: getLocString(data.location || details.location),
                    price: typeof data.price === 'number'
                        ? `$${data.price.toLocaleString()}`
                        : (data.price || details.price || "Contact for Price"),
                    category: data.type || details.category || "Real Estate",
                    type: data.type,
                    features: Array.isArray(data.features) ? data.features : (Array.isArray(details.features) ? details.features : []),
                    stats: data.stats || details.stats || { sqft: "-", beds: "-", baths: "-" },
                    // Backend returns 'gallery' for Real Estate, 'images' might be in details
                    images: Array.isArray(data.gallery) && data.gallery.length > 0
                        ? data.gallery
                        : (Array.isArray(details.images) && details.images.length > 0 ? details.images : ["/assets/images/real-estate-bg.jpg"]),
                    image: (Array.isArray(data.gallery) && data.gallery.length > 0)
                        ? data.gallery[0]
                        : (Array.isArray(details.images) && details.images.length > 0 ? details.images[0] : "/assets/images/real-estate-bg.jpg"),
                };
            }
        } catch (e) {
            console.error(`Failed to fetch dynamic project ${slug}:`, e);
        }
    }

    if (!project) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-black flex flex-col transition-colors duration-300">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-slate-900 dark:text-white">
                    <h1 className="text-4xl font-serif">Project Not Found</h1>
                    <p className="text-slate-500 mt-2">The requested property ID "{slug}" does not exist.</p>
                    <Link href="/real-estate" className="mt-4 text-amber-500 hover:underline">Back to Portfolio</Link>
                </div>
                <Footer />
            </main>
        );
    }

    return <RealEstateDetailClient project={project} />;
}
