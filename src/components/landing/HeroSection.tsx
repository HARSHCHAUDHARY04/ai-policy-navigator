import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Target, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float-slow mix-blend-screen" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-float mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
          >
            <ShieldCheck className="w-4 h-4" />
            A project by Harsh Chaudhary
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight"
          >
            Find the Right{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rounded-full opacity-50" />
              <span className="relative text-gradient">Insurance Policy</span>
            </span>{" "}
            for You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl font-light leading-relaxed mx-auto"
          >
            Stop guessing. PolicyNav scans and compares India's top insurance plans to find the perfect coverage for your family, health, and assets—simply and transparently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link to="/profile">
              <button className="btn-premium w-full sm:w-auto hover-scale group">
                Find Your Policy
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/quiz">
              <button className="btn-outline-premium w-full sm:w-auto hover-scale">
                Take the Quiz
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="pt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/5"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-foreground/80">IRDAI Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground/80">Personalized Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-foreground/80">Instant Results</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
