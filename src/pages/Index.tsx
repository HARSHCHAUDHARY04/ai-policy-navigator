import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { FAQSection } from "@/components/landing/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WhyChooseUs />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
