import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefits = [
    {
        title: "Unbiased Advice",
        description: "We aren't tied to any single provider, ensuring you get the best advice for your needs.",
    },
    {
        title: "Save Up To 40%",
        description: "Our comparison tools help you find the most competitive rates and save on premiums.",
    },
    {
        title: "Paperless Process",
        description: "Say goodbye to physical documents. Handle everything digitally and securely.",
    },
    {
        title: "Dedicated Claims Support",
        description: "Our experts guide you through the claims process to ensure a smooth experience.",
    },
];

export const WhyChooseUs = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                Why Thousands Trust <span className="text-gradient">AI Policy Navigator</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                We've revolutionized the way people think about insurance. By combining AI with human expertise, we provide a seamless, transparent experience.
                            </p>

                            <div className="space-y-4 pt-4">
                                {benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{benefit.title}</h4>
                                            <p className="text-muted-foreground transition-all duration-300">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <div className="aspect-square bg-gradient-to-br from-primary/20 via-background to-accent/20 p-8 flex items-center justify-center">
                                <div className="relative w-full h-full glass-card flex items-center justify-center p-12 text-center">
                                    <div className="space-y-4">
                                        <div className="text-5xl font-bold text-gradient">98%</div>
                                        <p className="text-xl font-medium">Customer Satisfaction Rate</p>
                                        <p className="text-muted-foreground">Join thousands of happy customers who found their perfect plan through our platform.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
};
