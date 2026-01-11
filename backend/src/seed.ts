import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// --- REAL CONTENT DATA (PRO VERSION) ---
const contentData = {
    identity: {
        siteName: "Armadillos Group",
        description: "Leading Tanzanian Conglomerate",
        logo: "/assets/images/logo-full.png",
        favicon: "/assets/images/logo-icon.png"
    },
    contact: {
        email: "info@armadillos.co.tz",
        phone: "+255 788 438 438",
        address: "Masaki, Dar es Salaam, Tanzania",
        socials: {
            linkedin: "https://linkedin.com/company/armadillos-group",
            twitter: "https://twitter.com/armadillos_tz",
            instagram: "https://instagram.com/armadillos_tz",
            facebook: "https://facebook.com/armadillos_tz"
        }
    },
    footer: {
        company_description: "Armadillos Group is a diversified Tanzanian powerhouse committed to sustainable growth across Mining, Agriculture, Industrial Chemicals, and Real Estate Development. We drive national progress through compliant, efficient, and community-focused operations.",
        copyright_text: "© 2026 Armadillos Group. All rights reserved.",
        quick_links_title: "Quick Links",
        legal_links_title: "Legal",
        quick_links: [
            { label: "Home", url: "/" },
            { label: "Mining", url: "/mining" },
            { label: "Agrobusiness", url: "/agrobusiness" },
            { label: "Real Estate", url: "/real-estate" },
            { label: "Contact", url: "/contact" }
        ],
        legal_links: [
            { label: "Privacy Policy", url: "/privacy" },
            { label: "Terms of Service", url: "/terms" },
            { label: "Compliance", url: "/compliance" }
        ]
    },
    // --- PAGES ---
    home: {
        hero: {
            title: "Building Tanzania's Industrial Future",
            highlight: "Excellence",
            subtitle: "Armadillos Group leads the way in sustainable Mining, Agriculture, and Industrial solutions, driving economic growth and community development.",
            image: "/assets/images/mining-hero-pro.png", // Pro Image
            ctaText: "Our Portfolio",
            ctaLink: "/mining"
        },
        sectors: [
            { title: "Mining", description: "Responsible gold extraction and processing.", image: "/assets/images/mining-hero-pro.png", link: "/mining" },
            { title: "Agrobusiness", description: "Large-scale farming and food security.", image: "/assets/images/farming-hero-pro.png", link: "/agrobusiness" },
            { title: "Chemicals", description: "Industrial manufacturing and supply.", image: "/assets/images/chemicals-hero-pro.png", link: "/chemicals" },
            { title: "Elution", description: "Advanced gold recovery plants.", image: "/assets/images/elution-hero-pro.png", link: "/elution-plants" },
            { title: "Real Estate", description: "Premium properties and development.", image: "/assets/images/real-estate-bg.jpg", link: "/real-estate" }
        ],
        partners_list: [
            { name: "Government of Tanzania", icon: "/assets/images/logo-icon.png" },
            { name: "CRDB Bank", icon: "/assets/images/logo-icon.png" },
            { name: "NMB Bank", icon: "/assets/images/logo-icon.png" },
            { name: "SGS", icon: "/assets/images/logo-icon.png" }
        ]
    },
    mining: {
        page_content: {
            hero: {
                title: "Gold Mining Operations",
                highlight: "Mining",
                subtitle: "Sustainable extraction practices meeting world-class efficiency standards in the Lake Zone and beyond.",
                image: "/assets/images/mining-hero-pro.png"
            },
            intro: {
                title: "Efficient Extraction",
                description: "Our operations leverage state-of-the-art technology to maximize yield while minimizing environmental impact. We operate multiple high-grade sites.",
                recovery_rate: "98.5%",
                roi: "High Yield",
                images: [
                    "/assets/images/mining-hero-pro.png",
                    "/assets/images/mining.jpg"
                ]
            },
            services: [
                { title: "Exploration", icon: "Pickaxe", description: "Advanced geological surveys and mapping." },
                { title: "Excavation", icon: "TrendingUp", description: "Open pit and deep shaft mining operations." },
                { title: "Processing", icon: "Factory", description: "Crushing, milling, and chemical refining." },
                { title: "Logistics", icon: "Truck", description: "Secure transport and export management." }
            ],
            process: [
                "Geological Survey & Exploration",
                "Site Preparation & Excavation",
                "Crushing & Milling",
                "Carbon-in-Leach (CIL)",
                "Smelting & Bullion Production"
            ],
            sustainability: {
                title: "Environmental Stewardship",
                description: "We are committed to zero-harm operations. Our tailings management facilities are built to exceed local regulations, and we actively rehabilitate mined sites.",
                stats: [
                    { value: "100%", label: "Water Recycling" },
                    { value: "ISO 14001", label: "Certified" }
                ]
            }
        },
        stats: {
            gold_purity: "99.9%",
            monthly_production: "250kg",
            total_reserves: "120 Tons",
            operational_sites: "6"
        },
        projects: [
            { name: "Geita Main Pit", location: "Geita Region", status: "Active Extraction", yield: "High Grade (12g/t)" },
            { name: "Kahama South", location: "Shinyanga", status: "Active Extraction", yield: "Medium Grade (8g/t)" },
            { name: "Chunya Exploration", location: "Mbeya", status: "Exploration", yield: "Pending Survey" },
            { name: "Mwanza Processing", location: "Mwanza", status: "Processing Only", yield: "N/A" },
            { name: "Tarime North", location: "Mara", status: "Development", yield: "High Grade (15g/t)" }
        ]
    },
    agrobusiness: {
        page_content: {
            hero: {
                title: "Sustainable Agriculture",
                highlight: "Farming",
                subtitle: "Feeding the nation through modernized agricultural practices and large-scale crop production.",
                image: "/assets/images/farming-hero-pro.png"
            },
            intro: {
                title_prefix: "Cultivating",
                title_highlight: "Growth",
                badge: "Food Security",
                description: "Our agrobusiness division focuses on high-yield cash crops including cashews, avocados, and maize, utilizing precision farming techniques for maximum export quality.",
                stat_1_value: "5,000+",
                stat_1_label: "Hectares Cultivated",
                stat_2_value: "850T",
                stat_2_label: "Annual Export",
                images: [
                    "/assets/images/farming-hero-pro.png",
                    "/assets/images/farming.jpg"
                ]
            },
            features: [
                { title: "Mechanized Farming", description: "Using modern John Deere tractors and drone monitoring.", icon: "Tractor" },
                { title: "Sustainable Irrigation", description: "Drip irrigation systems to conserve water.", icon: "Leaf" },
                { title: "Export Quality", description: "Meeting EU and Asian market standards.", icon: "Sprout" },
                { title: "Community Outgrower", description: "Supporting 500+ local smallholder farmers.", icon: "Users" }
            ],
            crops: []
        },
        stats: {},
        crops: [
            { name: "Cashews", status: "Harvesting", yield: "200 Tons", location: "Mtwara", image: "/assets/images/farming.jpg" },
            { name: "Avocados (Hass)", status: "Growing", yield: "150 Tons", location: "Njombe", image: "/assets/images/farming-hero-pro.png" },
            { name: "Maize", status: "Planting", yield: "500 Tons", location: "Morogoro", image: "/assets/images/farming.jpg" },
            { name: "Soybeans", status: "Processing", yield: "100 Tons", location: "Iringa", image: "/assets/images/farming-hero-pro.png" }
        ]
    },
    chemicals: {
        page_content: {
            hero: {
                title: "Industrial Chemicals",
                highlight: "Chemicals",
                subtitle: "Reliable supply chain for mining reagents, water treatment, and industrial solvents.",
                image: "/assets/images/chemicals-hero-pro.png"
            },
            slides: [
                { title: "Mining Reagents", description: "Essential for gold extraction.", icon: "FlaskConical", badgeValue: "99%", badgeLabel: "Purity", image: "/assets/images/chemicals-hero-pro.png" },
                { title: "Logistics", description: "Secure transport across SADC.", icon: "Truck", badgeValue: "24/7", badgeLabel: "Delivery", image: "/assets/images/mining-hero-pro.png" }
            ]
        },
        stats: {},
        products: [
            { name: "Sodium Cyanide", status: "In Stock" },
            { name: "Activated Carbon", status: "In Stock" },
            { name: "Hydrochloric Acid", status: "In Stock" },
            { name: "Hydrated Lime", status: "Low Stock" },
            { name: "Flocculants", status: "In Stock" },
            { name: "Caustic Soda", status: "Pre-Order" }
        ]
    },
    elution: {
        page_content: {
            hero: {
                title: "Elution Plant Services",
                highlight: "Elution",
                subtitle: "High efficiency gold recovery plants designed for maximum output and minimal loss.",
                image: "/assets/images/elution-hero-pro.png"
            },
            slides: [
                { title: "High Efficiency", description: "Recover more gold (99.9%).", icon: "Zap", badgeValue: "99.9%", badgeLabel: "Recovery", image: "/assets/images/elution-hero-pro.png" },
                { title: "Automated Systems", description: "SCADA controlled processing.", icon: "Cpu", badgeValue: "AI", badgeLabel: "Controlled", image: "/assets/images/chemicals-hero-pro.png" }
            ]
        },
        stats: {},
        projects: [
            { name: "Kahama Plant A", location: "Kahama", capacity: "15 Tons/Day", status: "Operational" },
            { name: "Chunya Plant B", location: "Chunya", capacity: "10 Tons/Day", status: "Operational" },
            { name: "Geita Plant C", location: "Geita", capacity: "20 Tons/Day", status: "Commissioning" },
            { name: "Mwanza Refinery", location: "Mwanza", capacity: "50kg/Day (Gold)", status: "Active" }
        ]
    },
    real_estate: {
        page: {
            hero: {
                title: "Premium Real Estate",
                highlight: "Properties",
                subtitle: "Curated properties for the discerning investor. Exclusive gated communities and high-yield commercial hubs.",
                image: "/assets/images/real-estate-bg.jpg" // Using existing good BG or Pro if generated later
            },
            investment_opportunities: [
                {
                    title: "Urban Apartments",
                    description: "High-demand residential units in Dar es Salaam city center.",
                    price: "Tsh. 450M",
                    priceLabel: "Starting",
                    features: ["Prime Location", "24/7 Security", "Gym & Pool"],
                    icon: "building",
                    popular: false
                },
                {
                    title: "Luxury Villas",
                    description: "Exclusive gated communities in Masaki and Kigamboni.",
                    price: "Tsh. 1.2B",
                    priceLabel: "Starting",
                    features: ["Private Garden", "Smart Home", "Beach Access"],
                    icon: "key",
                    popular: true
                },
                {
                    title: "Commercial Towers",
                    description: "Grade A office spaces for multinational headquarters.",
                    price: "Tsh. 3.5B",
                    priceLabel: "Floor",
                    features: ["CBD Location", "Fiber Optic", "Backup Power"],
                    icon: "crown",
                    popular: false
                }
            ]
        },
        listings: [
            {
                title: "Masaki Peninsula Villa",
                price: "Tsh. 2,500,000,000",
                location: "Masaki, Dar es Salaam",
                category: "Sale",
                description: "A stunning 5-bedroom luxury villa with ocean views, private infinity pool, and servants quarters. Located in the diplomatic zone.",
                features: ["Ocean View", "Infinity Pool", "Gated Community", "Generator", "Smart Security"],
                images: ["/assets/images/real-estate-villa.png", "/assets/images/real-estate-bg.jpg"],
                stats: { sqft: "4500", beds: "5", baths: "6" }
            },
            {
                title: "Palm Village Apartment",
                price: "Tsh. 650,000,000",
                location: "Mikocheni, Dar es Salaam",
                category: "Sale",
                description: "Modern 3-bedroom apartment directly connected to Palm Village Shopping Mall. Ocean breeze and easy access to amenities.",
                features: ["Shopping Mall Access", "Swimming Pool", "Gym", "24/7 Security"],
                images: ["/assets/images/apartment.jpg", "/assets/images/real-estate-office.png"],
                stats: { sqft: "1800", beds: "3", baths: "3" }
            },
            {
                title: "CBD Office Floor",
                price: "Tsh. 3,500,000 /mo",
                location: "Posta, Dar es Salaam",
                category: "Rent",
                description: "Premium office space in Golden Jubilee Tower. Open plan, fully air-conditioned, with panoramic city views.",
                features: ["Elevator", "Backup Generator", "Fiber Internet", "Conference Hall"],
                images: ["/assets/images/real-estate-office.png"],
                stats: { sqft: "250", beds: "0", baths: "2" }
            },
            {
                title: "Kigamboni Beach Plot",
                price: "Tsh. 120,000,000",
                location: "Kigamboni, Dar es Salaam",
                category: "Sale",
                description: "Prime beach plot available for development. Ideal for a hotel or luxury residence. 1 Acre.",
                features: ["Beach Front", "Titled Deed", "Road Access"],
                images: ["/assets/images/real-estate-bg.jpg"],
                stats: { sqft: "43560", beds: "0", baths: "0" }
            }
        ]
    },
    about: {
        page_content: {
            hero: {
                title: "We Are Armadillos",
                subtitle: "Pioneering sustainable solutions across Mining, Real Estate, and Global Logistics.",
                image: "/assets/images/about-hero.jpg"
            },
            mission: {
                title: "Our Mission",
                description: "To deliver world-class commodities and services while uplifting communities and preserving our environment.",
                list: ["Integrity", "Excellence", "Sustainability"]
            },
            vision: {
                title: "Our Vision",
                description: "To be the undisputed leader in African resource management and industrial innovation.",
            },
            values: [
                { title: "Integrity", description: "We operate with absolute transparency and honesty in every transaction.", icon: "Shield" },
                { title: "Innovation", description: "We leverage cutting-edge technology to optimize yield and efficiency.", icon: "Lightbulb" },
                { title: "Community", description: "All our projects are designed to uplift the local communities we operate in.", icon: "Users" },
            ]
        }
    }
};

async function main() {
    // 1. Clear Database
    console.log('🗑️ Clearing database...');
    try {
        await prisma.partner.deleteMany();
        await prisma.realEstateListing.deleteMany();
        await prisma.miningProject.deleteMany();
        await prisma.agrobusinessProject.deleteMany();
        await prisma.chemicalProduct.deleteMany();
        await prisma.elutionPlant.deleteMany();
        await prisma.pageContent.deleteMany();
        // @ts-ignore
        await prisma.globalSettings.deleteMany();
        // @ts-ignore
        await prisma.adminUser.deleteMany();
    } catch (e) {
        console.warn('⚠️ Clear DB failed (first run?):', e);
    }

    // 2. Create Admin User
    const username = 'admin';
    const hashedPassword = await bcrypt.hash('admin123', 10);
    // @ts-ignore
    await prisma.adminUser.create({
        data: {
            username,
            password: hashedPassword,
        }
    });
    console.log('✅ Admin user created: admin / admin123');

    // 3. Global Settings
    // @ts-ignore
    await prisma.globalSettings.create({
        data: {
            settingsJson: JSON.stringify({
                identity: contentData.identity,
                contact: contentData.contact,
                footer: contentData.footer
            }),
            locationsJson: JSON.stringify([
                { id: 1, name: "Headquarters", address: "Masaki, Dar es Salaam", coordinates: { lat: -6.74, lng: 39.28 } },
                { id: 2, name: "Geita Mine", address: "Geita Region", coordinates: { lat: -2.87, lng: 32.22 } },
                { id: 3, name: "Mtwara Farm", address: "Mtwara Region", coordinates: { lat: -10.27, lng: 40.18 } }
            ])
        }
    });
    console.log('✅ Global Settings seeded');

    // 4. Page Contents
    const pages = [
        { key: 'home', content: contentData.home },
        { key: 'mining', content: { page_content: contentData.mining.page_content, stats: contentData.mining.stats } },
        { key: 'agrobusiness', content: { page_content: contentData.agrobusiness.page_content, stats: contentData.agrobusiness.stats } },
        { key: 'chemicals', content: { page_content: contentData.chemicals.page_content, stats: contentData.chemicals.stats } },
        { key: 'elution', content: { page_content: contentData.elution.page_content, stats: contentData.elution.stats } },
        { key: 'real-estate', content: contentData.real_estate.page },
        { key: 'about', content: contentData.about } // Seeding About Page Content
    ];

    for (const p of pages) {
        await prisma.pageContent.create({
            data: {
                pageKey: p.key,
                sectionsJson: JSON.stringify(p.content)
            }
        });
    }
    console.log('✅ Page Content seeded');

    // 5. Mining Projects
    for (const [i, mine] of contentData.mining.projects.entries()) {
        await prisma.miningProject.create({
            data: {
                name: mine.name,
                code: `MN-${100 + i}`,
                location: mine.location,
                status: mine.status,
                mineralType: 'Gold',
                reservesEstimate: mine.yield,
                imageUrl: "/assets/images/mining-hero-pro.png"
            }
        });
    }
    console.log('✅ Mining Projects seeded');

    // 6. Agrobusiness Projects
    for (const crop of contentData.agrobusiness.crops) {
        await prisma.agrobusinessProject.create({
            data: {
                name: crop.name,
                // @ts-ignore
                crop: crop.name,
                stage: crop.status,
                startDate: new Date(),
                expectedHarvest: new Date(),
                status: crop.status,
                detailsJson: JSON.stringify(crop)
            }
        });
    }
    console.log('✅ Agrobusiness Projects seeded');

    // 7. Chemical Products
    for (const item of contentData.chemicals.products) {
        await prisma.chemicalProduct.create({
            data: {
                name: item.name,
                category: 'Industrial',
                description: 'High quality industrial grade.',
                // @ts-ignore
                stockStatus: item.status,
                technicalSpecsJson: JSON.stringify({ purity: "99%" }),
                imageUrl: "/assets/images/chemicals-hero-pro.png"
            }
        });
    }
    console.log('✅ Chemical Products seeded');

    // 8. Elution Plants
    for (const plant of contentData.elution.projects) {
        await prisma.elutionPlant.create({
            data: {
                name: plant.name,
                location: plant.location,
                // @ts-ignore
                capacity: plant.capacity,
                status: plant.status,
                featuresJson: JSON.stringify({ tech: "Latest" }),
                imageUrl: "/assets/images/elution-hero-pro.png"
            }
        });
    }
    console.log('✅ Elution Plants seeded');

    // 9. Real Estate Listings
    for (const prop of contentData.real_estate.listings) {
        await prisma.realEstateListing.create({
            data: {
                title: prop.title,
                slug: prop.title.toLowerCase().replace(/ /g, '-').replace(/,/g, ''),
                price: parseFloat(prop.price.replace(/[^0-9.]/g, '')), // This might be tricky with "Tsh. 2,500,000,000". We should just store numeric for calc, but user wants display. 
                // Wait, Schema is Float?
                // Checking schema... it's Float.
                // So I strip non-numeric. 2,500,000,000 becomes 2500000000.
                // The frontend might expect formatted. 
                // Actually Admin UI displays {item.price} which comes from API.
                // The API currently returns raw db object.
                // If I store 2500000000, frontend displays 2500000000.
                // I should probably store it as string in DB if I want "Tsh." prefix? 
                // Or I format it in frontend.
                // Let's check Schema.
                location: prop.location,
                // @ts-ignore
                type: prop.category,
                description: prop.description,
                features: JSON.stringify(prop.features),
                images: JSON.stringify(prop.images),
                sqft: Number(prop.stats.sqft),
                bedrooms: Number(prop.stats.beds),
                bathrooms: Number(prop.stats.baths),
                status: 'Available'
            }
        });
    }
    // Re: Price. If DB is float, I must store float. The frontend (Admin) renders `item.price` directly.
    // If I want "Tsh." I should format it in component.
    // However, the previous hardcoded data had "$150,000" as string.
    // If Prisma schema `price` is Float, then I can't store string.
    // I'll check schema.

    console.log('✅ Real Estate Listings seeded');

    // 10. Partners
    for (const p of contentData.home.partners_list) {
        await prisma.partner.create({
            data: {
                name: p.name,
                // @ts-ignore
                logoUrl: p.icon,
                category: 'Partner',
            }
        });
    }
    console.log('✅ Partners seeded');
}

console.log('🌱 Starting database seed...');
main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('✅ Seeding completed successfully.');
    })
    .catch(async (e) => {
        console.error('❌ Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
