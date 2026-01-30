import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, TrendingUp, Shield, Brain } from "lucide-react";
import { DataFlowVisualization } from "./DataFlowVisualization";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="orb orb-primary w-[600px] h-[600px] -top-40 -left-40 animate-float-slow" />
        <div className="orb orb-accent w-[500px] h-[500px] top-1/2 -right-40 animate-float" />
        <div className="orb orb-primary w-[300px] h-[300px] bottom-20 left-1/4 animate-float-slow" style={{ animationDelay: "2s" }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(186 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(186 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Insurance</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Insurance that</span>
                <br />
                <span className="text-gradient">understands you</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Stop overpaying for generic coverage. Our AI analyzes your unique profile to 
                recommend policies tailored to your actual needs and risk factors.
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-8"
            >
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gradient">94%</div>
                <div className="text-sm text-muted-foreground">Match Accuracy</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gradient">₹2L</div>
                <div className="text-sm text-muted-foreground">Avg. Savings/Year</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gradient">48hrs</div>
                <div className="text-sm text-muted-foreground">Quick Approval</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/profile">
                <Button variant="hero" size="xl">
                  Analyze My Profile
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="heroOutline" size="xl">
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>IRDAI Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>50K+ Policies Matched</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Data Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <DataFlowVisualization />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
