import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Target, Zap, TrendingDown, CheckCircle2 } from "lucide-react";

const solutions = [
  {
    icon: Target,
    title: "Precision Matching",
    description: "Our AI analyzes 200+ data points to find policies that match your exact needs—not generic recommendations.",
    benefits: ["Personalized coverage", "No gaps in protection", "Right policy, first time"],
  },
  {
    icon: Zap,
    title: "Instant Risk Analysis",
    description: "Get your complete risk profile in minutes, not days. Understand exactly what you need coverage for.",
    benefits: ["Real-time scoring", "Transparent factors", "Actionable insights"],
  },
  {
    icon: TrendingDown,
    title: "Cost Optimization",
    description: "We find savings you didn't know existed by identifying overlapping coverage and unnecessary add-ons.",
    benefits: ["Average $2.4K savings", "Bundle optimization", "Premium reduction tips"],
  },
];

export const SolutionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="orb orb-primary w-[500px] h-[500px] -bottom-60 left-1/4 opacity-50" />
        <div className="orb orb-accent w-[400px] h-[400px] top-20 -right-20 opacity-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The AI Solution</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Insurance, <span className="text-gradient">reimagined</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI doesn't just compare policies—it understands your life, analyzes your risks, 
            and recommends coverage that actually makes sense for you.
          </p>
        </motion.div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="glass-card glow-border p-8 h-full hover-lift hover-glow">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:shadow-[0_0_50px_-10px_hsl(186_100%_50%/0.6)] transition-shadow duration-300">
                  <solution.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-3">{solution.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{solution.description}</p>

                {/* Benefits */}
                <ul className="space-y-2">
                  {solution.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
