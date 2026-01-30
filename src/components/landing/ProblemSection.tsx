import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { XCircle, AlertTriangle, DollarSign, Clock } from "lucide-react";

const problems = [
  {
    icon: XCircle,
    title: "One-Size-Fits-All Policies",
    description: "Traditional insurance ignores your unique circumstances, leaving you either underinsured or overpaying for coverage you don't need.",
    stat: "67%",
    statLabel: "pay for unused coverage",
  },
  {
    icon: AlertTriangle,
    title: "Hidden Risk Blind Spots",
    description: "Without proper risk analysis, you might be exposed to threats you're not even aware of until it's too late.",
    stat: "3.2x",
    statLabel: "higher claim rejections",
  },
  {
    icon: DollarSign,
    title: "Overpaying by Lakhs",
    description: "The average Indian overpays by ₹2 lakh/year because they can't navigate the complex insurance landscape effectively.",
    stat: "₹2L",
    statLabel: "wasted annually",
  },
  {
    icon: Clock,
    title: "Weeks of Research",
    description: "Comparing policies manually takes weeks of research, endless calls with agents, and confusing fine print.",
    stat: "47hrs",
    statLabel: "average research time",
  },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-destructive/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">The Insurance Problem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Traditional insurance is <span className="text-destructive">broken</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            The insurance industry hasn't evolved with you. Here's why millions 
            are stuck with the wrong coverage.
          </p>
        </motion.div>

        {/* Problem Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full hover:border-destructive/30 transition-colors duration-300">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                    <problem.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">{problem.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                    <div className="pt-3 border-t border-border/50">
                      <span className="text-2xl font-bold text-destructive">{problem.stat}</span>
                      <span className="text-sm text-muted-foreground ml-2">{problem.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
