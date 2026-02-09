import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, TrendingUp, Users, Heart, Calculator, FileText, Umbrella } from "lucide-react";

const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: React.ElementType; className: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    className={`absolute hidden md:flex items-center justify-center w-14 h-14 rounded-2xl glass-card shadow-card ${className}`}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon className="w-6 h-6 text-primary" />
    </motion.div>
  </motion.div>
);

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-primary w-[500px] h-[500px] -top-20 -right-20 animate-float-slow" />
        <div className="orb orb-accent w-[400px] h-[400px] bottom-20 -left-20 animate-float" />
      </div>

      {/* Floating Animated Icons */}
      <FloatingIcon icon={Heart} className="top-[18%] left-[8%]" delay={0.6} />
      <FloatingIcon icon={Shield} className="top-[25%] right-[10%]" delay={0.8} />
      <FloatingIcon icon={Calculator} className="bottom-[30%] left-[5%]" delay={1.0} />
      <FloatingIcon icon={FileText} className="bottom-[22%] right-[7%]" delay={1.2} />
      <FloatingIcon icon={Umbrella} className="top-[45%] left-[15%]" delay={1.4} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge-premium">
              <Shield className="w-4 h-4" />
              IRDAI Compliant
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight"
          >
            Compare & Choose the{" "}
            <span className="text-gradient">Best Insurance</span>
            <br />for Your Needs
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            AI-powered recommendations from India's top insurance providers. 
            Save up to ₹2 Lakhs annually with personalized policies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/profile">
              <Button variant="hero" size="xl">
                Get Personalized Quote
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/compare">
              <Button variant="heroOutline" size="xl">
                Compare Policies
              </Button>
            </Link>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 pt-8"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm">50,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm">₹500 Cr+ Claims Settled</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">20+ Insurance Partners</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
