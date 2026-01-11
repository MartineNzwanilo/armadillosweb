
// Explicit Intefaces for Type Safety
export interface SiteContent {
    identity: { name: string; description: string };
    contact: {
        title: string; address: string;
        emails: string[]; phones: string[];
        socials: { facebook: string; twitter: string; linkedin: string; instagram: string };
    };
    locations: any[];
    footer: {
        newsletter_title: string;
        newsletter_desc: string;
        copyright_text?: string;
        quick_links_title?: string;
        quick_links?: { label: string; url: string }[];
        legal_links_title?: string;
        legal_links?: { label: string; url: string }[];
    };
    sections: {
        hero: { title: string; subtitle: string; cta_text: string; cta_link: string; background_url: string };
        mining: { title: string; description: string; image_url: string; link: string };
        real_estate: { title: string; description: string; image_url: string; link: string };
        agrobusiness: { title: string; description: string; image_url: string; link: string };
        partners: { title: string; description: string };
    };
    home: {
        hero: any;
        partners_section: any;
        partners_list?: { name: string; icon: string }[];
        mining_section: any;
        real_estate_section: any;
        agrobusiness_section: any;
        sectors: any[];
    };
    real_estate_listings: any[];
    mining: { stats: any; page_content: any; projects: any[] };
    agrobusiness: { stats: any; page_content: any; crops: any[] };
    chemicals: { stats: any; page_content: any; projects: any[] };
    elution: { stats: any; page_content: any; projects: any[] };
    partners: any[]; // New SQL Partners
    real_estate_page: {
        hero: any;
        investment_opportunities?: {
            title: string;
            description: string;
            price: string;
            priceLabel?: string;
            features: string[];
            icon: string;
            popular?: boolean;
        }[];
    };
    about?: { page_content: any }; // Added About Page
}

const defaultContent: SiteContent = {
    identity: { name: "", description: "" },
    contact: { title: "", address: "", emails: [], phones: [], socials: { facebook: "", twitter: "", linkedin: "", instagram: "" } },
    locations: [],
    footer: {
        newsletter_title: "",
        newsletter_desc: "",
        copyright_text: "",
        quick_links: [],
        legal_links: []
    },
    sections: {
        hero: { title: "", subtitle: "", cta_text: "", cta_link: "", background_url: "" },
        mining: { title: "", description: "", image_url: "", link: "" },
        real_estate: { title: "", description: "", image_url: "", link: "" },
        agrobusiness: { title: "", description: "", image_url: "", link: "" },
        partners: { title: "", description: "" }
    },
    home: {
        hero: { badge: "", title_line_1: "", title_line_2: "", description: "", cta_primary: "", cta_secondary: "" },
        partners_section: {},
        partners_list: [],
        mining_section: {}, real_estate_section: {}, agrobusiness_section: {}, sectors: []
    },
    real_estate_listings: [],
    mining: {
        stats: {},
        page_content: {
            hero: { title: "", highlight: "", subtitle: "", image: "" },
            intro: { badge: "", title_prefix: "", title_highlight: "", description: "", images: [] }, // Matches agro structure as fallback
            features: [],
            services: [] // Specific to mining in some contexts
        },
        projects: []
    },
    agrobusiness: {
        stats: {},
        page_content: {
            hero: { title: "", highlight: "", subtitle: "", image: "" },
            intro: { badge: "", title_prefix: "", title_highlight: "", description: "", images: [] },
            features: []
        },
        crops: []
    },
    chemicals: {
        stats: {},
        page_content: {
            hero: { title: "", highlight: "", subtitle: "", image: "" },
            slides: [],
            features: []
        },
        projects: []
    },
    elution: {
        stats: {},
        page_content: {
            hero: { title: "", highlight: "", subtitle: "", image: "" },
            slides: [],
            features: []
        },
        projects: []
    },
    partners: [],
    about: { page_content: {} }, // Added default about content
    real_estate_page: {
        hero: { title: "", highlight: "", subtitle: "", image: "" },
        investment_opportunities: [
            {
                title: "Urban Apartments",
                description: "High-demand residential units in city centers.",
                price: "$150k",
                priceLabel: "Starting",
                features: ["Prime Location", "24/7 Security", "Rental Management"],
                icon: "building",
                popular: false
            },
            {
                title: "Luxury Villas",
                description: "Exclusive gated communities with premium amenities.",
                price: "$450k",
                priceLabel: "Starting",
                features: ["Private Pool", "Smart Home System", "Concierge Service", "Beach Access"],
                icon: "key",
                popular: true
            },
            {
                title: "Commercial Hubs",
                description: "Office towers and retail spaces for enterprise.",
                price: "$1.2M",
                priceLabel: "Starting",
                features: ["CBD Location", "LEED Certified", "Anchor Tenants"],
                icon: "crown",
                popular: false
            }
        ]
    }
};

export const API_Base = "http://192.168.20.169:3005/api/v1";

/**
 * Safe fetch wrapper to prevent app crash on backend failure
 */
async function safeFetch(url: string, fallback: any = {}) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        console.warn(`CMS Fetch failed for ${url}`, e);
        return fallback;
    }
}

export async function checkConnection() {
    try {
        const res = await fetch(`${API_Base}/settings`);
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Retrieves the entire site content object from the Backend API.
 */
export async function getContent(): Promise<SiteContent> {
    // Parallel fetch with individual error handling
    const args = await Promise.all([
        safeFetch(`${API_Base}/content/home`, { content: null }),
        safeFetch(`${API_Base}/content/agrobusiness`, { content: null }),
        safeFetch(`${API_Base}/content/chemicals`, { content: null }),
        safeFetch(`${API_Base}/content/elution`, { content: null }),
        safeFetch(`${API_Base}/content/mining`, { content: null }), // Added mining fetch
        safeFetch(`${API_Base}/content/real-estate`, { content: null }), // Added Real Estate Page fetch
        safeFetch(`${API_Base}/settings`, { settings: null, locations: [] }),
        safeFetch(`${API_Base}/projects`, []), // General projects
        safeFetch(`${API_Base}/projects?type=REAL_ESTATE`, []), // Real Estate Listings
        safeFetch(`${API_Base}/partners`, []), // SQL Partners
        safeFetch(`${API_Base}/content/about`, { content: null }) // Added About Fetch
    ]);

    const [
        home, agro, chem, elution, mining, realEstatePage, settings, projects, realEstateListings, partnersList, about
    ] = args;

    // Transform Projects array into specific categories
    const cropCycles = Array.isArray(projects) ? projects.filter((p: any) => p.type === 'CROP_CYCLE').map((p: any) => ({ ...p.details, ...p })) : [];
    const miningProjects = Array.isArray(projects) ? projects.filter((p: any) => p.type === 'MINING').map((p: any) => ({ ...p.details, ...p })) : [];
    const shipments = Array.isArray(projects) ? projects.filter((p: any) => p.type === 'SHIPMENT').map((p: any) => ({ ...p.details, ...p })) : [];
    const facilities = Array.isArray(projects) ? projects.filter((p: any) => p.type === 'FACILITY').map((p: any) => ({ ...p.details, ...p })) : [];
    const properties = Array.isArray(realEstateListings) ? realEstateListings : [];

    const unwrap = (data: any) => {
        if (!data) return {};
        if (data.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
            return data.content;
        }
        return data.content || {};
    };

    const getStats = (data: any) => data?.stats || {};

    const homeData = unwrap(home);
    const agroData = unwrap(agro);
    const chemData = unwrap(chem);
    const elutionData = unwrap(elution);
    const miningData = unwrap(mining);
    const aboutData = unwrap(about); // Unwrap about data

    // Helper to extract actual page content, handling potential nesting
    const getPageContent = (data: any) => data?.page_content || data || {};

    const fullContent: SiteContent = {
        identity: { ...defaultContent.identity, ...(settings.settings?.identity || {}) },
        contact: {
            ...defaultContent.contact,
            ...(settings.settings?.contact || {}),
            socials: {
                ...defaultContent.contact.socials,
                ...(settings.settings?.contact?.socials || {})
            }
        },
        locations: Array.isArray(settings.locations) ? settings.locations : [],
        footer: { ...defaultContent.footer, ...(settings.settings?.footer || {}) },
        sections: { ...defaultContent.sections, ...(settings.settings?.sections || {}) },

        home: {
            hero: { ...defaultContent.home.hero, ...(homeData?.hero || {}) },
            partners_section: { ...defaultContent.home.partners_section, ...(homeData?.partners_section || {}) },
            mining_section: { ...defaultContent.home.mining_section, ...(homeData?.mining_section || {}) },
            real_estate_section: { ...defaultContent.home.real_estate_section, ...(homeData?.real_estate_section || {}) },
            agrobusiness_section: { ...defaultContent.home.agrobusiness_section, ...(homeData?.agrobusiness_section || {}) },
            sectors: homeData?.sectors || defaultContent.home.sectors
        },

        real_estate_listings: properties,
        mining: {
            stats: getStats(mining.content),
            page_content: getPageContent(miningData),
            projects: miningProjects
        },
        agrobusiness: {
            stats: getStats(agro.content),
            page_content: getPageContent(agroData),
            crops: cropCycles
        },
        chemicals: {
            stats: getStats(chem.content),
            page_content: getPageContent(chemData),
            projects: shipments
        },
        elution: {
            stats: getStats(elution.content),
            page_content: getPageContent(elutionData),
            projects: facilities
        },
        real_estate_page: {
            hero: { ...defaultContent.real_estate_page.hero, ...(getPageContent(unwrap(realEstatePage)).hero || {}) },
            investment_opportunities: getPageContent(unwrap(realEstatePage)).investment_opportunities || defaultContent.real_estate_page.investment_opportunities
        },
        partners: Array.isArray(partnersList) ? partnersList : [],
        about: { page_content: getPageContent(aboutData) } // Populate about content
    };
    return fullContent;
}

function getClientToken() {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )armadillos_admin_session=([^;]+)'));
        if (match) return match[2];
        const localToken = localStorage.getItem('admin_token');
        if (localToken) return localToken;
    }
    return null;
}


export async function getProjects(type?: string) {
    try {
        const res = await safeFetch(`${API_Base}/projects${type ? `?type=${type}` : ''}`);
        // If it's a 404/500, safeFetch returns {}, we want []
        if (Array.isArray(res)) return res;
        return [];
    } catch (e) {
        console.error("Projects fetch error:", e);
        return [];
    }
}

export async function getProject(id: string) {
    try {
        const res = await safeFetch(`${API_Base}/projects/${id}`);
        // If not found or error, safeFetch returns {}
        if (res && res.id) return res;
        return null;
    } catch (e) {
        console.error("Project fetch error:", e);
        return null;
    }
}

export async function updateContent(page: string, content: any) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/content/${page}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ content })
        });
        return res.ok;
    } catch (e) {
        console.error("Save failed:", e);
        return false;
    }
}

export async function createProject(type: string, name: string, status: string, details: any) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/projects`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ type, name, status, details })
        });
        if (!res.ok) {
            console.error(`Create project failed: ${res.status}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.error("Create project exception:", e);
        return null;
    }
}

export async function updateProject(id: string, name: string, status: string, details: any) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/projects/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ name, status, details })
        });
        if (!res.ok) {
            console.error(`Update project failed: ${res.status}`);
            return null;
        }
        return await res.json();
    } catch (e) {
        console.error("Update project failed:", e);
        return null;
    }
}

export async function deleteProject(id: string) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/projects/${id}`, {
            method: 'DELETE',
            headers
        });
        return res.ok;
    } catch (e) {
        console.error("Delete project failed:", e);
        return false;
    }
}

export async function saveSettings(settings: any, locations: any[]) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/settings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ settings, locations })
        });
        return res.ok;
    } catch (e) {
        console.error("Save settings failed:", e);
        return false;
    }
}

// Partners API
export async function getPartners() {
    return safeFetch(`${API_Base}/partners`, []);
}

export async function addPartner(name: string, type: string, logo: string) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/partners`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name, type, logo })
        });

        if (!res.ok) {
            throw new Error(`Failed to add partner: ${res.status}`);
        }

        return await res.json();
    } catch (e) {
        console.error("Add partner failed", e);
        throw e;
    }
}

export async function deletePartner(id: string) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/partners/${id}`, {
            method: 'DELETE',
            headers
        });
        return res.ok;
    } catch (e) {
        console.error("Delete partner failed", e);
        return false;
    }
}

export async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const token = getClientToken();
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_Base}/auth/change-password`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Password change failed");
        }
        return true;
    } catch (e: any) {
        console.error("Change password failed", e);
        throw e;
    }
}
