import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  ClipboardList, 
  Brain, 
  LineChart, 
  CheckCircle, 
  ArrowRight,
  User,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    icon: ClipboardList,
    title: "Share Your Profile",
    subtitle: "2 minutes",
    description: "Answer simple questions about your lifestyle, assets, and goals. No complex forms—just a conversation.",
    details: [
      "Demographics & family info",
      "Assets & property details",
      "Lifestyle & activities",
      "Current coverage gaps",
    ],
    color: "primary",
  },
  {
    id: 2,
    icon: Brain,
    title: "AI Risk Analysis",
    subtitle: "Instant",
    description: "Our AI processes 200+ data points to build your unique risk profile and identify potential coverage gaps.",
    details: [
      "Multi-factor risk scoring",
      "Pattern recognition",
      "Historical claims analysis",
      "Predictive modeling",
    ],
    color: "accent",
  },
  {
    id: 3,
    icon: LineChart,
    title: "Personalized Scoring",
    subtitle: "Transparent",
    description: "See your complete risk breakdown with clear explanations. Understand exactly why each score matters.",
    details: [
      "Health risk indicators",
      "Property risk factors",
      "Lifestyle risk assessment",
      "Overall protection score",
    ],
    color: "primary",
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Smart Recommendations",
    subtitle: "Tailored",
    description: "Get policy recommendations ranked by fit, not by commission. Every suggestion explained.",
    details: [
      "Best-match policies",
      "Coverage comparison",
      "Cost optimization",
      "One-click enrollment",
    ],
    color: "success",
  },
];

const StepCard = ({ step, index, isActive, onClick }: { 
  step: typeof steps[0]; 
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onClick={onClick}
      className={`cursor-pointer transition-all duration-500 ${
        isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
      }`}
    >
      <div className={`glass-card p-8 relative overflow-hidden ${
        isActive ? "glow-border" : ""
      }`}>
        {/* Step Number */}
        <div className="absolute top-6 right-6 text-6xl font-bold text-white/5">
          {String(step.id).padStart(2, "0")}
        </div>

        <div className="flex gap-6">
          {/* Icon */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
            step.color === "primary" 
              ? "bg-gradient-to-br from-primary to-accent shadow-glow"
              : step.color === "accent"
              ? "bg-gradient-to-br from-accent to-primary shadow-[0_0_60px_-15px_hsl(256_80%_60%/0.4)]"
              : "bg-gradient-to-br from-success to-primary shadow-[0_0_60px_-15px_hsl(160_84%_39%/0.4)]"
          }`}>
            <step.icon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {step.subtitle}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{step.description}</p>

            {/* Expandable Details */}
            <motion.div
              initial={false}
              animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border/50">
                {step.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <ChevronRight className="w-3 h-3 text-primary" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section ref={heroRef} className="container mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple 4-Step Process</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How <span className="text-gradient">InsureAI</span> Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From your first click to perfect coverage—our AI-powered process 
              takes the complexity out of insurance.
            </p>
          </motion.div>
        </section>

        {/* Interactive Flow */}
        <section className="container mx-auto px-6 mb-24">
          {/* Progress Line */}
          <div className="hidden lg:block relative max-w-4xl mx-auto mb-16">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-secondary/50 rounded-full">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: "0%" }}
                animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between relative">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step.id}
                </button>
              ))}
            </div>
          </div>

          {/* Step Cards */}
          <div className="max-w-4xl mx-auto space-y-6">
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </section>

        {/* Visual Process Flow */}
        <section className="container mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card glow-border p-12 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              The AI Behind Your <span className="text-gradient">Perfect Policy</span>
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {/* Data Collection */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Data Collection</h4>
                <p className="text-sm text-muted-foreground">Secure, encrypted input</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="data-line w-full" />
              </div>

              {/* AI Processing */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative">
                  <Brain className="w-10 h-10 text-accent" />
                  <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">AI Processing</h4>
                <p className="text-sm text-muted-foreground">200+ data point analysis</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <div className="data-line w-full" />
              </div>

              {/* Output */}
              <div className="text-center md:col-span-1">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-success" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Smart Matching</h4>
                <p className="text-sm text-muted-foreground">Personalized policies</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to experience <span className="text-gradient">smarter insurance?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start your free analysis now and discover the perfect coverage for your unique needs.
            </p>
            <Link to="/profile">
              <Button variant="hero" size="xl">
                Start My Analysis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
