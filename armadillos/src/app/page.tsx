
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Footer } from "@/components/layout/Footer";
import { PartnersSection } from "@/components/home/PartnersSection";
import { SectorTeaser } from "@/components/home/SectorTeaser";

import { getContent } from "@/lib/cms";

export default async function Home() {
  const content = await getContent();

  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <Hero
        content={content.home.hero}
        services={[
          {
            id: "mining",
            title: content.mining?.page_content?.hero?.title || "Gold Mining",
            stat: content.mining?.stats?.stat_1_value || "99.9%",
            statLabel: content.mining?.stats?.stat_1_label || "Purity",
            desc: content.mining?.page_content?.hero?.subtitle || "Ethical Extraction",
            badgeValue: content.mining?.stats?.stat_2_value || "$2.4B",
            badgeLabel: content.mining?.stats?.stat_2_label || "Market Cap",
            image: content.mining?.page_content?.hero?.image || "/assets/images/mining.jpg"
          },
          {
            id: "real-estate",
            title: "Real Estate",
            stat: "15%",
            statLabel: "Target ROI",
            desc: content.real_estate_page?.hero?.subtitle || "Premium Developments",
            badgeValue: "120+",
            badgeLabel: "Properties",
            image: content.real_estate_page?.hero?.image || "/assets/images/apartment.jpg"
          },
          {
            id: "agrobusiness",
            title: content.agrobusiness?.page_content?.hero?.title || "Agrobusiness",
            stat: content.agrobusiness?.stats?.stat_1_value || "45k",
            statLabel: content.agrobusiness?.stats?.stat_1_label || "Acres",
            desc: content.agrobusiness?.page_content?.hero?.subtitle || "Sustainable Farming",
            badgeValue: content.agrobusiness?.stats?.stat_2_value || "+18%",
            badgeLabel: content.agrobusiness?.stats?.stat_2_label || "Growth",
            image: content.agrobusiness?.page_content?.hero?.image || "/assets/images/farming.jpg"
          }
        ]}
      />
      <PartnersSection partners={content.partners} />
      <SectorTeaser sectors={content.home.sectors.map((sector: any) => {
        const s = { ...sector };
        if (s.id === 'mining') {
          s.image = content.mining?.page_content?.hero?.image;
          s.desc = content.mining?.page_content?.hero?.subtitle || s.desc;
        }
        if (s.id === 'agrobusiness') {
          s.image = content.agrobusiness?.page_content?.hero?.image;
          s.desc = content.agrobusiness?.page_content?.hero?.subtitle || s.desc;
        }
        if (s.id === 'chemicals') s.image = content.chemicals?.page_content?.hero?.image;
        if (s.id === 'elution') s.image = content.elution?.page_content?.hero?.image;
        if (s.id === 'real-estate') {
          s.image = content.real_estate_page?.hero?.image;
          s.desc = content.real_estate_page?.hero?.subtitle || s.desc;
        }
        return s;
      })} />
      <Footer content={content} />
    </main>
  );
}
