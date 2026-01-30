import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Shield, 
  Star, 
  ChevronRight, 
  Check, 
  X, 
  Heart, 
  Home, 
  Car,
  HelpCircle,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PolicyType = "health" | "property" | "auto" | "life";

interface Policy {
  id: string;
  name: string;
  provider: string;
  type: PolicyType;
  matchScore: number;
  monthlyPremium: number;
  coverage: string;
  features: string[];
  notIncluded: string[];
  whyRecommended: string;
  badge?: string;
}

const policies: Policy[] = [
  {
    id: "health-1",
    name: "Premium Health Guard",
    provider: "HDFC Ergo",
    type: "health",
    matchScore: 96,
    monthlyPremium: 3500,
    coverage: "₹50L",
    badge: "Best Match",
    features: [
      "Pre-existing conditions covered",
      "Preventive care 100% covered",
      "Mental health included",
      "Day care procedures covered",
      "Teleconsultation access",
    ],
    notIncluded: [
      "Cosmetic procedures",
      "Experimental treatments",
    ],
    whyRecommended: "Based on your hypertension condition and preference for preventive care, this plan offers comprehensive coverage with reduced waiting period for pre-existing conditions.",
  },
  {
    id: "health-2",
    name: "Essential Care",
    provider: "Star Health",
    type: "health",
    matchScore: 84,
    monthlyPremium: 2350,
    coverage: "₹25L",
    features: [
      "Pre-existing conditions covered (2 yr wait)",
      "Preventive care included",
      "Emergency coverage",
      "AYUSH treatment covered",
    ],
    notIncluded: [
      "Mental health services",
      "Specialist visits limited",
      "No teleconsultation",
    ],
    whyRecommended: "A budget-friendly option that still provides essential coverage. Consider if monthly premium is a priority over comprehensive benefits.",
  },
  {
    id: "auto-1",
    name: "Comprehensive Motor Shield",
    provider: "ICICI Lombard",
    type: "auto",
    matchScore: 92,
    monthlyPremium: 1350,
    coverage: "IDV + ₹15L PA",
    badge: "Recommended",
    features: [
      "Own damage coverage",
      "Third-party liability",
      "Roadside assistance",
      "Zero depreciation add-on",
      "Engine protection",
    ],
    notIncluded: [
      "CNG/LPG kit (separate)",
      "Commercial use coverage",
    ],
    whyRecommended: "Given your vehicle's age (6-10 years) and high usage, comprehensive coverage with zero depreciation protects against major repair costs.",
  },
  {
    id: "property-1",
    name: "Home Suraksha Pro",
    provider: "Bajaj Allianz",
    type: "property",
    matchScore: 88,
    monthlyPremium: 1170,
    coverage: "₹40L",
    features: [
      "Structure coverage",
      "Contents protection",
      "Burglary & theft coverage",
      "Fire & allied perils",
      "Public liability coverage",
    ],
    notIncluded: [
      "Flood insurance (separate)",
      "Earthquake coverage (add-on)",
    ],
    whyRecommended: "Your security features qualify you for discounts. This plan provides robust protection for your property value.",
  },
];

const typeIcons = {
  health: Heart,
  property: Home,
  auto: Car,
  life: Shield,
};

const typeColors = {
  health: "from-pink-500 to-rose-500",
  property: "from-blue-500 to-cyan-500",
  auto: "from-orange-500 to-amber-500",
  life: "from-purple-500 to-violet-500",
};

const PolicyRecommendations = () => {
  const [selectedType, setSelectedType] = useState<PolicyType | "all">("all");
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const filteredPolicies = selectedType === "all" 
    ? policies 
    : policies.filter(p => p.type === selectedType);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Curated for You</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Perfect <span className="text-gradient">Policies</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Based on your risk analysis, here are the policies that best match your needs and budget
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[
              { value: "all", label: "All Policies" },
              { value: "health", label: "Health", icon: Heart },
              { value: "auto", label: "Auto", icon: Car },
              { value: "property", label: "Property", icon: Home },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value as PolicyType | "all")}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedType === tab.value
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Policy Cards */}
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredPolicies.map((policy, index) => {
              const TypeIcon = typeIcons[policy.type];
              const isExpanded = expandedPolicy === policy.id;

              return (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="glass-card overflow-hidden"
                >
                  {/* Main Card Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Icon & Match Score */}
                      <div className="flex md:flex-col items-center gap-4 md:gap-2">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${typeColors[policy.type]} flex items-center justify-center shadow-lg`}>
                          <TypeIcon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gradient">{policy.matchScore}%</div>
                          <div className="text-xs text-muted-foreground">Match</div>
                        </div>
                      </div>

                      {/* Policy Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-foreground">{policy.name}</h3>
                              {policy.badge && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  {policy.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{policy.provider}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-foreground">₹{policy.monthlyPremium.toLocaleString('en-IN')}</div>
                            <div className="text-sm text-muted-foreground">/month</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-foreground">Coverage: {policy.coverage}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <span className="text-success">High match for your profile</span>
                          </div>
                        </div>

                        {/* Quick Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {policy.features.slice(0, 3).map((feature, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-success/10 text-success"
                            >
                              <Check className="w-3 h-3" />
                              {feature}
                            </span>
                          ))}
                          {policy.features.length > 3 && (
                            <span className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                              +{policy.features.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Expand Toggle */}
                        <button
                          onClick={() => setExpandedPolicy(isExpanded ? null : policy.id)}
                          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Why this policy?</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                      </div>

                      {/* CTA */}
                      <div className="flex md:flex-col gap-3">
                        <Button variant="hero" className="flex-1 md:flex-none">
                          Select Policy
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none">
                          Compare
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border/50 bg-secondary/20 p-6 md:p-8"
                    >
                      {/* Why Recommended */}
                      <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Why We Recommend This</h4>
                            <p className="text-sm text-muted-foreground">{policy.whyRecommended}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Included */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Check className="w-4 h-4 text-success" />
                            What's Included
                          </h4>
                          <ul className="space-y-2">
                            {policy.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                <Check className="w-4 h-4 text-success flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Not Included */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <X className="w-4 h-4 text-destructive" />
                            Not Included
                          </h4>
                          <ul className="space-y-2">
                            {policy.notIncluded.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <X className="w-4 h-4 text-destructive/50 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyRecommendations;
