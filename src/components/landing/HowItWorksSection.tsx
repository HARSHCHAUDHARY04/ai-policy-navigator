import { motion } from "framer-motion";
import { ClipboardList, LineChart, CheckCircle, ScanSearch } from "lucide-react";

const steps = [
    {
        icon: ClipboardList,
        title: "Share Your Profile",
        description: "Answer a few simple questions about your lifestyle, assets, and goals. No complex forms—just clear inputs.",
        color: "bg-primary/20 text-primary",
        step: "01",
    },
    {
        icon: ScanSearch,
        title: "We Scan the Market",
        description: "PolicyNav scans hundreds of plans across India's top insurers to identify the ones that match your needs.",
        color: "bg-accent/20 text-accent",
        step: "02",
    },
    {
        icon: LineChart,
        title: "Personalized Scoring",
        description: "See your complete risk breakdown with clear explanations. Understand exactly why each plan fits you.",
        color: "bg-primary/20 text-primary",
        step: "03",
    },
    {
        icon: CheckCircle,
        title: "Smart Recommendations",
        description: "Get policy recommendations ranked by fit, not by commission. Every suggestion is explained clearly.",
        color: "bg-success/20 text-success",
        step: "04",
    },
];

export const HowItWorksSection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
                        How <span className="text-gradient">PolicyNav</span> Works
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                        From your first click to the perfect coverage—our process takes the complexity out of insurance.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line – desktop only */}
                    <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className={`w-24 h-24 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg relative`}>
                                    <step.icon className="w-10 h-10" />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-border text-xs font-bold flex items-center justify-center text-muted-foreground">
                                        {index + 1}
                                    </span>
                                </div>
                                <h3 className="text-lg font-display font-bold mb-2 text-white">{step.title}</h3>
                                <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-[200px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
