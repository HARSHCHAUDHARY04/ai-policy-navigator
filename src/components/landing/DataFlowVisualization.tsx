import { motion } from "framer-motion";
import { User, Brain, FileCheck, Shield, ArrowRight } from "lucide-react";

const flowSteps = [
  { icon: User, label: "Your Data", delay: 0 },
  { icon: Brain, label: "AI Analysis", delay: 0.3 },
  { icon: FileCheck, label: "Risk Score", delay: 0.6 },
  { icon: Shield, label: "Perfect Policy", delay: 0.9 },
];

export const DataFlowVisualization = () => {
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
      {/* Central AI Core */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-40 h-40 rounded-full border border-primary/20 animate-rotate-slow" />
          
          {/* Middle Ring */}
          <div 
            className="absolute inset-4 rounded-full border border-accent/30"
            style={{ animation: "rotate-slow 25s linear infinite reverse" }}
          />
          
          {/* Core */}
          <div className="absolute inset-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-8 rounded-full bg-gradient-primary opacity-40 blur-2xl" />
        </div>
      </motion.div>

      {/* Orbital Data Points */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="absolute w-3 h-3 rounded-full bg-primary/60 shadow-glow"
          style={{
            top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 6)}%`,
            left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 6)}%`,
            animation: `pulse-glow ${2 + i * 0.3}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(186 100% 50% / 0)" />
            <stop offset="50%" stopColor="hsl(186 100% 50% / 0.5)" />
            <stop offset="100%" stopColor="hsl(186 100% 50% / 0)" />
          </linearGradient>
        </defs>
        
        {/* Animated data flow lines */}
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={i}
            x1={50 + 180 * Math.cos((i * Math.PI) / 2)}
            y1={200 + 180 * Math.sin((i * Math.PI) / 2)}
            x2="200"
            y2="200"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.2, repeat: Infinity, repeatType: "loop" }}
          />
        ))}
      </svg>

      {/* Corner Cards */}
      {flowSteps.map((step, i) => {
        const positions = [
          { top: "5%", left: "5%" },
          { top: "5%", right: "5%" },
          { bottom: "5%", right: "5%" },
          { bottom: "5%", left: "5%" },
        ];
        
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: step.delay + 0.8 }}
            className="absolute glass-card p-4 w-32"
            style={positions[i] as any}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">{step.label}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};
