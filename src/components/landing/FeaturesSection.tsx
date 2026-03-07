import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Search } from "lucide-react";

const features = [
    {
        title: "Smart Policy Search",
        description: "Enter your profile details and instantly browse plans from India's top insurers—filtered to what actually matters for you.",
        icon: Search,
        color: "text-accent",
        bg: "bg-accent/10 border-accent/20",
    },
    {
        title: "Real-time Comparisons",
        description: "Compare policies side-by-side with real-time premium estimates and coverage breakdowns.",
        icon: BarChart3,
        color: "text-primary",
        bg: "bg-primary/10 border-primary/20",
    },
    {
        title: "Secure & Private",
        description: "Bank-grade encryption keeps your personal data safe. Your information is never sold or shared.",
        icon: Shield,
        color: "text-success",
        bg: "bg-success/10 border-success/20",
    },
    {
        title: "Instant Results",
        description: "No waiting, no callbacks. Get your personalized policy recommendations in seconds.",
        icon: Zap,
        color: "text-warning",
        bg: "bg-warning/10 border-warning/20",
    },
];

export const FeaturesSection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-display font-bold"
                    >
                        Built for <span className="text-gradient">Clarity</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto font-light"
                    >
                        Everything you need to understand, compare, and choose the right insurance—without the confusion.
                    </motion.p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="premium-glass p-8 rounded-2xl group hover:border-primary/30 transition-all duration-500"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.bg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-display text-foreground/90">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-light">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
