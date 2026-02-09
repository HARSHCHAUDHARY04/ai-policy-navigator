import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", location: "Mumbai", text: "InsureAI saved me ₹1.8 Lakhs on my family's health insurance. The AI recommendations were spot on!", rating: 5 },
  { name: "Rajesh Patel", location: "Ahmedabad", text: "I was overpaying for years. The comparison tool showed me better policies at half the premium.", rating: 5 },
  { name: "Anita Desai", location: "Bangalore", text: "The claims guide helped me file my first claim smoothly. Settled in just 12 days!", rating: 4 },
  { name: "Vikram Singh", location: "Delhi", text: "Best insurance platform in India. The quiz recommended exactly what my family needed.", rating: 5 },
];

export const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by <span className="text-gradient">Thousands</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Real stories from our customers across India.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.1 }} className="glass-card p-6 flex flex-col">
              <Quote className="w-8 h-8 text-primary/30 mb-3" />
              <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
