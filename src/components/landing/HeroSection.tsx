import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, Sparkle, Target } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4"
            >
              <Sparkle className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium tracking-wide uppercase">AI-Powered Insurance Discovery</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight"
            >
              The Future of <br />
              <span className="text-gradient">Policy Selection</span> <br />
              Is Here.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl"
            >
              Stop guessing. Our AI engine scans thousands of data points to find the perfect insurance shield for your family, health, and assets—instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="/profile">
                <Button variant="hero" size="xl" className="group shadow-glow hover:shadow-glow-accent transition-all duration-500">
                  Find Your Policy
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-8 border-t border-white/10"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">IRDAI Certified Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">99.9% Recommendation Accuracy</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative z-10 preserve-3d"
            >
              <div className="glass-card p-2 rounded-[2rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                  alt="Dashboard Preview"
                  className="rounded-[1.8rem] w-full shadow-inner relative z-10"
                />
              </div>

              {/* Floating Stat Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl shadow-xl z-20 border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Coverage Score</div>
                    <div className="text-lg font-bold">94/100</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl z-20 border-accent/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">New Policies</div>
                    <div className="text-lg font-bold">+24 Today</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
