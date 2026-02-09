import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, IndianRupee, Users, MapPin, Shield } from "lucide-react";

const PremiumCalculator = () => {
  const [age, setAge] = useState(30);
  const [familySize, setFamilySize] = useState(1);
  const [coverage, setCoverage] = useState(500000);
  const [cityType, setCityType] = useState<"metro" | "non-metro">("metro");
  const [calculated, setCalculated] = useState(false);

  const calculatePremium = () => {
    setCalculated(true);
  };

  const basePremium = 3000;
  const ageFactor = age < 30 ? 0.8 : age < 45 ? 1.0 : age < 60 ? 1.5 : 2.2;
  const familyFactor = familySize === 1 ? 1 : familySize === 2 ? 1.7 : familySize <= 4 ? 2.3 : 3.0;
  const coverageFactor = coverage / 500000;
  const cityFactor = cityType === "metro" ? 1.15 : 1.0;
  const annualPremium = Math.round(basePremium * ageFactor * familyFactor * coverageFactor * cityFactor);
  const monthlyPremium = Math.round(annualPremium / 12);

  const coverageOptions = [
    { value: 300000, label: "₹3 Lakh" },
    { value: 500000, label: "₹5 Lakh" },
    { value: 1000000, label: "₹10 Lakh" },
    { value: 2500000, label: "₹25 Lakh" },
    { value: 5000000, label: "₹50 Lakh" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Estimate Your <span className="text-gradient">Premium</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get an instant estimate of your health insurance premium based on your profile.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 space-y-8">
            {/* Age */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="w-4 h-4 text-primary" /> Age: {age} years
              </label>
              <input type="range" min={18} max={70} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground"><span>18</span><span>70</span></div>
            </div>

            {/* Family Size */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="w-4 h-4 text-primary" /> Family Members: {familySize}
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setFamilySize(n)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${familySize === n ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                    {n}{n === 5 ? "+" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Coverage */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Shield className="w-4 h-4 text-primary" /> Coverage Amount
              </label>
              <div className="flex flex-wrap gap-3">
                {coverageOptions.map((opt) => (
                  <button key={opt.value} onClick={() => setCoverage(opt.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${coverage === opt.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="w-4 h-4 text-primary" /> City Type
              </label>
              <div className="flex gap-3">
                {(["metro", "non-metro"] as const).map((type) => (
                  <button key={type} onClick={() => setCityType(type)} className={`px-6 py-2 rounded-xl text-sm font-medium capitalize transition-all ${cityType === type ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                    {type === "metro" ? "Metro City" : "Non-Metro"}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={calculatePremium} size="lg" className="w-full">
              <IndianRupee className="w-5 h-5" /> Calculate Premium
            </Button>

            {calculated && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Annual Premium</p>
                  <p className="text-3xl font-bold text-gradient">₹{annualPremium.toLocaleString("en-IN")}</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Premium</p>
                  <p className="text-3xl font-bold text-gradient">₹{monthlyPremium.toLocaleString("en-IN")}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PremiumCalculator;
