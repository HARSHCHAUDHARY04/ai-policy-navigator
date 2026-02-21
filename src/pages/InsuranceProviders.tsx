import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Shield, Heart, Car, Plane } from "lucide-react";

// Providers will be fetched from the API

const categories = [
  { key: "health", label: "Health Insurance", icon: Heart, color: "text-red-500" },
  { key: "life", label: "Life Insurance", icon: Shield, color: "text-primary" },
  { key: "motor", label: "Motor Insurance", icon: Car, color: "text-blue-500" },
  { key: "travel", label: "Travel Insurance", icon: Plane, color: "text-purple-500" },
];

const InsuranceProviders = () => {
  const { data: providersData = [], isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/providers');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
  });

  const providers = {
    health: providersData.filter((p: any) => p.category === 'health'),
    life: providersData.filter((p: any) => p.category === 'life'),
    motor: providersData.filter((p: any) => p.category === 'motor'),
    travel: providersData.filter((p: any) => p.category === 'travel'),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
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
