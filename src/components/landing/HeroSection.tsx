import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-primary w-[500px] h-[500px] -top-20 -right-20 animate-float-slow" />
        <div className="orb orb-accent w-[400px] h-[400px] bottom-20 -left-20 animate-float" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight"
          >
            Compare & Choose the{" "}
            <span className="text-gradient">Best Insurance</span>
            <br />for Your Needs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            AI-powered recommendations from India's top insurance providers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/profile">
              <Button variant="hero" size="xl">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
