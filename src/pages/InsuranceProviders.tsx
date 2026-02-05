import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ExternalLink, Shield, Heart, Car, Plane } from "lucide-react";

const providers = {
  health: [
    { name: "Star Health", url: "https://www.starhealth.in", desc: "India's largest standalone health insurer" },
    { name: "HDFC Ergo Health", url: "https://www.hdfcergo.com/health-insurance", desc: "Comprehensive health plans" },
    { name: "ICICI Lombard", url: "https://www.icicilombard.com/health-insurance", desc: "Trusted health coverage" },
    { name: "Max Bupa", url: "https://www.nivabupa.com", desc: "Premium health insurance" },
    { name: "Care Health", url: "https://www.careinsurance.com", desc: "Affordable health plans" },
    { name: "Bajaj Allianz Health", url: "https://www.bajajallianz.com/health-insurance.html", desc: "Wide hospital network" },
  ],
  life: [
    { name: "LIC of India", url: "https://licindia.in", desc: "Government-backed security" },
    { name: "HDFC Life", url: "https://www.hdfclife.com", desc: "Term & savings plans" },
    { name: "ICICI Prudential", url: "https://www.iciciprulife.com", desc: "Flexible life coverage" },
    { name: "SBI Life", url: "https://www.sbilife.co.in", desc: "Trusted life insurance" },
    { name: "Max Life", url: "https://www.maxlifeinsurance.com", desc: "Premium life plans" },
    { name: "Tata AIA", url: "https://www.tataaia.com", desc: "Life protection solutions" },
  ],
  motor: [
    { name: "Bajaj Allianz Motor", url: "https://www.bajajallianz.com/motor-insurance.html", desc: "Comprehensive motor cover" },
    { name: "TATA AIG Motor", url: "https://www.tataaig.com/motor-insurance", desc: "Quick claim settlement" },
    { name: "New India Assurance", url: "https://www.newindia.co.in", desc: "Government insurer" },
    { name: "Bharti AXA", url: "https://www.bharti-axagi.co.in/motor-insurance", desc: "Affordable premiums" },
    { name: "HDFC Ergo Motor", url: "https://www.hdfcergo.com/motor-insurance", desc: "Wide garage network" },
    { name: "ICICI Lombard Motor", url: "https://www.icicilombard.com/motor-insurance", desc: "Digital-first claims" },
  ],
  travel: [
    { name: "TATA AIG Travel", url: "https://www.tataaig.com/travel-insurance", desc: "Global travel protection" },
    { name: "Bajaj Allianz Travel", url: "https://www.bajajallianz.com/travel-insurance.html", desc: "Comprehensive travel plans" },
    { name: "HDFC Ergo Travel", url: "https://www.hdfcergo.com/travel-insurance", desc: "International coverage" },
    { name: "ICICI Lombard Travel", url: "https://www.icicilombard.com/travel-insurance", desc: "Medical emergency cover" },
    { name: "Care Travel", url: "https://www.careinsurance.com/travel-insurance", desc: "Budget-friendly travel" },
    { name: "Reliance Travel", url: "https://www.reliancegeneral.co.in/travel-insurance", desc: "Quick visa processing" },
  ],
};

const categories = [
  { key: "health", label: "Health Insurance", icon: Heart, color: "text-red-500" },
  { key: "life", label: "Life Insurance", icon: Shield, color: "text-primary" },
  { key: "motor", label: "Motor Insurance", icon: Car, color: "text-blue-500" },
  { key: "travel", label: "Travel Insurance", icon: Plane, color: "text-purple-500" },
];

const InsuranceProviders = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Insurance <span className="text-gradient">Providers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Direct links to India's top insurance companies. Compare and buy policies directly from providers.
            </p>
          </motion.div>

          {/* Categories */}
          {categories.map((category, catIdx) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <category.icon className={`w-6 h-6 ${category.color}`} />
                <h2 className="text-2xl font-display font-semibold">{category.label}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers[category.key as keyof typeof providers].map((provider, idx) => (
                  <a
                    key={idx}
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="provider-card group"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{provider.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InsuranceProviders;
