import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Clock } from "lucide-react";

const features = [
    {
        title: "AI-Powered Analysis",
        description: "Our advanced algorithms analyze your unique profile to find the most relevant policies.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "Secure & Private",
        description: "Your data is encrypted and handled with the highest security standards for your peace of mind.",
        icon: Shield,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Real-time Comparisons",
        description: "Compare policies side-by-side with real-time premium estimates and coverage details.",
        icon: BarChart3,
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        title: "Instant Support",
        description: "Get immediate answers to your insurance queries through our comprehensive guides and tools.",
        icon: Clock,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

export const FeaturesSection = () => {
    return (
        <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Your Insurance Journey</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We simplify the complex world of insurance with cutting-edge technology and user-centric design.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-8 group hover:border-primary/50 transition-colors"
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
