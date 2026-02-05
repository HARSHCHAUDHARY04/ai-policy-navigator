import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Plus, Trash2 } from "lucide-react";

interface Policy {
  id: string;
  name: string;
  provider: string;
  premium: number;
  coverage: number;
  claimRatio: number;
  hospitalNetwork: number;
  waitingPeriod: number;
  roomRent: string;
  preExisting: number;
  features: string[];
}

const availablePolicies: Policy[] = [
  {
    id: "1",
    name: "Optima Secure",
    provider: "HDFC Ergo",
    premium: 15000,
    coverage: 1000000,
    claimRatio: 92,
    hospitalNetwork: 10000,
    waitingPeriod: 30,
    roomRent: "No Limit",
    preExisting: 3,
    features: ["No Room Rent Limit", "Daycare Coverage", "Free Health Checkup", "Restore Benefit"],
  },
  {
    id: "2",
    name: "Health Companion",
    provider: "Star Health",
    premium: 12500,
    coverage: 1000000,
    claimRatio: 89,
    hospitalNetwork: 12000,
    waitingPeriod: 30,
    roomRent: "1% of SI",
    preExisting: 4,
    features: ["Automatic Restoration", "Wellness Benefits", "OPD Cover", "Maternity Cover"],
  },
  {
    id: "3",
    name: "Health Shield",
    provider: "ICICI Lombard",
    premium: 14000,
    coverage: 1000000,
    claimRatio: 91,
    hospitalNetwork: 9500,
    waitingPeriod: 45,
    roomRent: "1% of SI",
    preExisting: 3,
    features: ["Cumulative Bonus", "Global Coverage", "Air Ambulance", "Second Opinion"],
  },
  {
    id: "4",
    name: "Health Gain",
    provider: "Bajaj Allianz",
    premium: 11000,
    coverage: 1000000,
    claimRatio: 88,
    hospitalNetwork: 8500,
    waitingPeriod: 30,
    roomRent: "2% of SI",
    preExisting: 4,
    features: ["Daily Cash", "Organ Donor", "Ambulance Cover", "Mental Health"],
  },
  {
    id: "5",
    name: "Care Supreme",
    provider: "Care Health",
    premium: 13500,
    coverage: 1000000,
    claimRatio: 90,
    hospitalNetwork: 11000,
    waitingPeriod: 30,
    roomRent: "No Limit",
    preExisting: 3,
    features: ["Unlimited Restore", "AYUSH Treatment", "Annual Checkup", "E-Consultation"],
  },
];

const CompareInsurance = () => {
  const [selectedPolicies, setSelectedPolicies] = useState<Policy[]>([
    availablePolicies[0],
    availablePolicies[1],
  ]);
  const [showSelector, setShowSelector] = useState(false);

  const addPolicy = (policy: Policy) => {
    if (selectedPolicies.length < 4 && !selectedPolicies.find(p => p.id === policy.id)) {
      setSelectedPolicies([...selectedPolicies, policy]);
    }
    setShowSelector(false);
  };

  const removePolicy = (id: string) => {
    setSelectedPolicies(selectedPolicies.filter(p => p.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
              Compare <span className="text-gradient">Insurance Policies</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Side-by-side comparison of health insurance policies. Select up to 4 policies to compare.
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left p-4 text-muted-foreground font-medium w-48">Feature</th>
                  {selectedPolicies.map((policy) => (
                    <th key={policy.id} className="p-4 min-w-[200px]">
                      <div className="glass-card p-4 relative">
                        <button
                          onClick={() => removePolicy(policy.id)}
                          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <p className="text-sm text-muted-foreground">{policy.provider}</p>
                        <h3 className="font-semibold text-foreground">{policy.name}</h3>
                      </div>
                    </th>
                  ))}
                  {selectedPolicies.length < 4 && (
                    <th className="p-4 min-w-[200px]">
                      <button
                        onClick={() => setShowSelector(true)}
                        className="glass-card p-4 w-full h-full flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Policy</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Annual Premium" values={selectedPolicies.map(p => formatCurrency(p.premium))} highlight />
                <CompareRow label="Sum Insured" values={selectedPolicies.map(p => formatCurrency(p.coverage))} />
                <CompareRow label="Claim Settlement Ratio" values={selectedPolicies.map(p => `${p.claimRatio}%`)} />
                <CompareRow label="Network Hospitals" values={selectedPolicies.map(p => p.hospitalNetwork.toLocaleString())} />
                <CompareRow label="Waiting Period" values={selectedPolicies.map(p => `${p.waitingPeriod} days`)} />
                <CompareRow label="Room Rent Limit" values={selectedPolicies.map(p => p.roomRent)} />
                <CompareRow label="Pre-existing Wait" values={selectedPolicies.map(p => `${p.preExisting} years`)} />
                
                {/* Features */}
                <tr>
                  <td className="p-4 text-muted-foreground font-medium border-t border-border">Key Features</td>
                  {selectedPolicies.map((policy) => (
                    <td key={policy.id} className="p-4 border-t border-border">
                      <ul className="space-y-2">
                        {policy.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {selectedPolicies.length < 4 && <td className="p-4 border-t border-border" />}
                </tr>

                {/* CTA Row */}
                <tr>
                  <td className="p-4"></td>
                  {selectedPolicies.map((policy) => (
                    <td key={policy.id} className="p-4">
                      <Button className="w-full">Get Quote</Button>
                    </td>
                  ))}
                  {selectedPolicies.length < 4 && <td className="p-4" />}
                </tr>
              </tbody>
            </table>
          </motion.div>

          {/* Policy Selector Modal */}
          {showSelector && (
            <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Select a Policy</h3>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {availablePolicies
                    .filter(p => !selectedPolicies.find(sp => sp.id === p.id))
                    .map((policy) => (
                      <button
                        key={policy.id}
                        onClick={() => addPolicy(policy)}
                        className="w-full p-4 text-left bg-secondary/50 hover:bg-secondary rounded-xl transition-colors"
                      >
                        <p className="text-sm text-muted-foreground">{policy.provider}</p>
                        <p className="font-semibold">{policy.name}</p>
                        <p className="text-sm text-primary">{formatCurrency(policy.premium)}/year</p>
                      </button>
                    ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const CompareRow = ({ 
  label, 
  values, 
  highlight = false 
}: { 
  label: string; 
  values: string[]; 
  highlight?: boolean;
}) => (
  <tr className={highlight ? "bg-secondary/30" : ""}>
    <td className="p-4 text-muted-foreground font-medium border-t border-border">{label}</td>
    {values.map((value, idx) => (
      <td key={idx} className={`p-4 text-center border-t border-border ${highlight ? "font-semibold text-primary" : ""}`}>
        {value}
      </td>
    ))}
    {values.length < 4 && <td className="p-4 border-t border-border" />}
  </tr>
);

export default CompareInsurance;
