import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Search,
    Loader2,
    Shield,
    Star,
    Check,
    X,
    ChevronRight,
    ExternalLink,
    Zap,
    MessageSquare
} from "lucide-react";

interface Recommendation {
    name: string;
    provider: string;
    type: string;
    matchScore: number;
    monthlyPremium: number;
    coverage: string;
    badge?: string;
    features: string[];
    notIncluded: string[];
    whyRecommended: string;
    providerUrl?: string;
}

const EXAMPLE_QUERIES = [
    "Best health insurance for a 28-year-old with diabetes under ₹2,500/month",
    "Family floater plan for 4 members, budget ₹5,000/month",
    "Term life insurance for a ₹1 crore cover, 35-year-old non-smoker",
    "Comprehensive car insurance for a 5-year-old Maruti Swift",
];

const typeColors: Record<string, string> = {
    health: "from-pink-500/20 to-rose-500/20 text-pink-500 border-pink-500/30",
    life: "from-purple-500/20 to-violet-500/20 text-purple-500 border-purple-500/30",
    auto: "from-orange-500/20 to-amber-500/20 text-amber-500 border-amber-500/30",
    property: "from-blue-500/20 to-cyan-500/20 text-cyan-500 border-cyan-500/30",
    travel: "from-teal-500/20 to-emerald-500/20 text-teal-500 border-teal-500/30",
};

const AIInsuranceSearch = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [searched, setSearched] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim() || query.trim().length < 5) return;
        setIsLoading(true);
        setRecommendations([]);
        setError(null);
        setSearched(true);
        setExpandedIdx(null);

        try {
            const response = await fetch("http://localhost:5000/api/ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Server communication failed.");
            setRecommendations(data.recommendations || []);
        } catch (err: any) {
            setError(err.message || "Cognitive engine offline. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            {/* Animated Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

            <Navbar />

            {/* dynamic layout: centered if not searched, top-aligned if searched */}
            <main className={`flex-1 relative z-10 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${searched ? 'pt-28 pb-20 justify-start' : 'pt-32 pb-20 justify-center'}`}>
                <div className="container mx-auto px-6 w-full max-w-4xl">

                    {/* Header - changes size based on state */}
                    <motion.div
                        layout="position"
                        className={`text-center transition-all duration-700 ${searched ? 'mb-8 scale-90 opacity-90' : 'mb-12'}`}
                    >
                        {!searched && (
                            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                                Describe your insurance needs in plain language and we'll find the best matching plans for you.
                            </p>
                        )}
                    </motion.div>

                    {/* Search Interface */}
                    <motion.div
                        layout="position"
                        className={`transition-all duration-700 relative z-20 ${searched ? 'mb-12' : 'max-w-3xl mx-auto'}`}
                    >
                        <div className={`p-1.5 rounded-[2rem] bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.15)] ${searched ? '' : 'animate-pulse-glow'}`}>
                            <div className="premium-glass rounded-[1.8rem] p-3 md:p-4 flex flex-col md:flex-row gap-4 items-end md:items-center bg-black/60 relative overflow-hidden group">
                                {/* Inner glow line tracking bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                                <div className="flex-1 w-full relative">
                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-primary/50 pointer-events-none" />
                                    <textarea
                                        ref={textareaRef}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="E.g., I'm a 32-year-old software engineer looking for a comprehensive health plan with maternity benefits..."
                                        rows={1}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent border-none text-white placeholder:text-muted-foreground/50 text-base md:text-lg resize-none focus:outline-none focus:ring-0 min-h-[56px] font-light leading-relaxed scrollbar-hide"
                                        style={{ overflowY: 'hidden' }}
                                    />
                                </div>

                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading || query.trim().length < 5}
                                    className="w-full md:w-auto self-end md:self-center bg-white text-black font-semibold px-8 py-4 rounded-xl hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 text-black group-hover/btn:text-primary transition-colors" />
                                            <span className="group-hover/btn:text-primary transition-colors">Synthesize</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Example queries (only show if not searched) */}
                        <AnimatePresence>
                            {!searched && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mt-8 text-center"
                                >
                                    <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">Sample Directives</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {EXAMPLE_QUERIES.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setQuery(q); }}
                                                className="text-sm px-4 py-2.5 rounded-xl bg-surface/50 hover:bg-surface border border-white/5 text-muted-foreground hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Dynamic Results Area */}
                    <AnimatePresence mode="wait">
                        {/* Loading State */}
                        {isLoading && searched && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="premium-glass rounded-[2rem] p-16 flex flex-col items-center justify-center gap-6 text-center border-primary/20 relative overflow-hidden"
                            >
                                {/* Futuristic scanning effect background */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[200%] animate-[scan_3s_ease-in-out_infinite]" />

                                <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin [animation-duration:1.5s]" />
                                    <div className="absolute inset-2 border-r-2 border-accent rounded-full animate-spin [animation-duration:2s] animation-direction-reverse" />
                                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                                </div>
                                <div className="relative z-10 gap-2">
                                    <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide">Processing Query Structure</h2>
                                    <p className="text-muted-foreground font-light max-w-sm mx-auto">
                                        Cross-referencing database vectors with cognitive heuristics...
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && searched && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="premium-glass p-8 text-center border-destructive/30 rounded-[2rem] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-destructive/5" />
                                <p className="text-destructive font-bold text-lg mb-2 relative z-10">{error}</p>
                                <p className="text-sm text-muted-foreground relative z-10">Neural link severed. Verify port 5000 connectivity.</p>
                            </motion.div>
                        )}

                        {/* Results State */}
                        {!isLoading && !error && searched && recommendations.length > 0 && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 pb-4 border-b border-white/10 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-white">Synthesized Results</h2>
                                    <span className="ml-auto px-3 py-1 bg-surface rounded-full text-xs font-medium text-muted-foreground uppercase tracking-wider border border-white/5">
                                        {recommendations.length} Matches Node
                                    </span>
                                </div>

                                <div className="grid gap-6">
                                    {recommendations.map((rec, idx) => {
                                        const gradientClass = typeColors[rec.type.toLowerCase()] || typeColors.health;
                                        const isExpanded = expandedIdx === idx;

                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1, ease: "easeOut" }}
                                                className={`premium-glass rounded-[2rem] overflow-hidden group transition-all duration-300 ${isExpanded ? "border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.15)] bg-black/60" : "hover:border-white/20 bg-black/40"
                                                    }`}
                                            >
                                                <div className="p-6 md:p-8 cursor-pointer" onClick={() => setExpandedIdx(isExpanded ? null : idx)}>
                                                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                                                        {/* Score Block */}
                                                        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 w-full md:w-32 flex-shrink-0 p-4 rounded-2xl bg-surface/50 border border-white/5">
                                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                                                <Star className="w-5 h-5 drop-shadow-md" />
                                                            </div>
                                                            <div className="text-right md:text-center">
                                                                <div className="text-2xl md:text-3xl font-display font-bold text-white">{rec.matchScore}%</div>
                                                                <div className="text-[10px] font-bold tracking-widest text-primary uppercase">Affinity</div>
                                                            </div>
                                                        </div>

                                                        {/* Details Block */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                                <div>
                                                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                                        <h3 className="text-2xl font-display font-bold text-white tracking-tight">{rec.name}</h3>
                                                                        {rec.badge && (
                                                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/20 border border-accent/30 text-accent flex items-center gap-1">
                                                                                <Zap className="w-3 h-3" /> {rec.badge}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-base font-light text-muted-foreground">{rec.provider}</p>
                                                                </div>
                                                                <div className="md:text-right bg-white/5 px-4 py-2 rounded-xl border border-white/5 inline-block self-start">
                                                                    <div className="text-xl font-display font-bold text-white flex items-baseline gap-1">
                                                                        ₹{rec.monthlyPremium?.toLocaleString("en-IN")}
                                                                        <span className="text-xs font-normal text-muted-foreground uppercase tracking-wide">/mo</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2 mb-5">
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-white/5 text-white/90">
                                                                    <Shield className="w-3.5 h-3.5 text-primary" /> Coverage: <span className="text-white">{rec.coverage}</span>
                                                                </span>
                                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-white/5 text-muted-foreground capitalize">
                                                                    {rec.type} Sector
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                                                <button
                                                                    className="flex items-center gap-2 text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors"
                                                                >
                                                                    <div className={`w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "rotate-180 bg-primary/20" : ""}`}>
                                                                        <ChevronRight className="w-3 h-3" />
                                                                    </div>
                                                                    <span className="uppercase tracking-widest text-[10px]">{isExpanded ? "Collapse Analysis" : "Expand Analysis"}</span>
                                                                </button>

                                                                {rec.providerUrl && (
                                                                    <a
                                                                        href={rec.providerUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                                                    >
                                                                        Gateway <ExternalLink className="w-3.5 h-3.5" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expanded State */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                            className="border-t border-white/5 bg-background/50 overflow-hidden"
                                                        >
                                                            <div className="p-6 md:p-8 pt-6">
                                                                <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary mb-8 relative overflow-hidden">
                                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                                                    <div className="flex items-start gap-4 relative z-10">
                                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                                            <MessageSquare className="w-4 h-4 text-primary" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-display font-medium text-white uppercase tracking-wider text-xs mb-2 text-primary/80">Why Recommended</h4>
                                                                            <p className="text-sm text-white/90 font-light leading-relaxed">{rec.whyRecommended}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid md:grid-cols-2 gap-6">
                                                                    <div className="p-5 rounded-2xl bg-surface/30 border border-success/10">
                                                                        <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                                            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                                                                                <Check className="w-3 h-3 text-success" />
                                                                            </div>
                                                                            Included Modules
                                                                        </h4>
                                                                        <ul className="space-y-3">
                                                                            {rec.features?.map((f, i) => (
                                                                                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 font-light">
                                                                                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" /> <span className="leading-snug">{f}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                    <div className="p-5 rounded-2xl bg-surface/30 border border-destructive/10">
                                                                        <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                                            <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                                                                                <X className="w-3 h-3 text-destructive" />
                                                                            </div>
                                                                            Omitted Blocks
                                                                        </h4>
                                                                        <ul className="space-y-3">
                                                                            {rec.notIncluded?.map((item, i) => (
                                                                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                                                                                    <X className="w-4 h-4 text-destructive/50 flex-shrink-0 mt-0.5" /> <span className="leading-snug">{item}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Empty results post calculation */}
                        {searched && !isLoading && !error && recommendations.length === 0 && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="premium-glass p-16 text-center rounded-[2rem] border-white/5"
                            >
                                <div className="w-20 h-20 mx-auto bg-surface rounded-full flex items-center justify-center mb-6 border border-white/10">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">Null Vector Match</h2>
                                <p className="text-muted-foreground font-light max-w-sm mx-auto">
                                    The cognitive engine could not align your directive with current database parameters. Refine query algorithms.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main >

            <div className="relative z-20">
                <Footer />
            </div>
        </div >
    );
};

export default AIInsuranceSearch;
