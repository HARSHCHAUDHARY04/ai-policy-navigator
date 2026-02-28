import { useState } from "react";
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
    "Family floater plan for 4 members, parents aged 55, budget ₹5,000/month",
    "Term life insurance for a ₹1 crore cover for a 35-year-old non-smoker",
    "Comprehensive car insurance for a 5-year-old Maruti Swift in Delhi",
];

const typeColors: Record<string, string> = {
    health: "from-pink-500 to-rose-500",
    life: "from-purple-500 to-violet-500",
    auto: "from-orange-500 to-amber-500",
    property: "from-blue-500 to-cyan-500",
    travel: "from-teal-500 to-emerald-500",
};

const AIInsuranceSearch = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const [searched, setSearched] = useState(false);

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
            if (!response.ok) throw new Error("Server error. Is the backend running?");
            const data = await response.json();
            setRecommendations(data.recommendations || []);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Gemini AI Search</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Search Insurance <span className="text-gradient">with AI</span>
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Describe your insurance need in plain English — Gemini AI will find the best real Indian policies for you.
                        </p>
                    </motion.div>

                    {/* Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 mb-8"
                    >
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="e.g. Best health insurance for a 30-year-old with diabetes, budget ₹3,000/month…"
                                    rows={3}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={isLoading || query.trim().length < 5}
                                className="flex-shrink-0 h-auto px-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Search
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Example queries */}
                        <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
                            <div className="flex flex-wrap gap-2">
                                {EXAMPLE_QUERIES.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(q)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Loading */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="glass-card p-12 flex flex-col items-center gap-4 text-center"
                        >
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1" />
                            </div>
                            <h2 className="text-xl font-bold">Gemini is searching…</h2>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Analysing your requirements and matching against hundreds of Indian insurance policies.
                            </p>
                        </motion.div>
                    )}

                    {/* Error */}
                    {error && !isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center border-destructive/30">
                            <p className="text-destructive font-medium mb-2">{error}</p>
                            <p className="text-sm text-muted-foreground">Make sure the backend server is running on port 5000.</p>
                        </motion.div>
                    )}

                    {/* Results */}
                    {!isLoading && !error && recommendations.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">AI Recommendations</h2>
                                <span className="ml-auto text-sm text-muted-foreground">{recommendations.length} matches found</span>
                            </div>

                            {recommendations.map((rec, idx) => {
                                const gradientClass = typeColors[rec.type] || "from-primary to-primary/60";
                                const isExpanded = expandedIdx === idx;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-card overflow-hidden"
                                    >
                                        <div className="p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                                {/* Score */}
                                                <div className="flex md:flex-col items-center gap-3 md:gap-2 flex-shrink-0">
                                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg`}>
                                                        <Shield className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gradient">{rec.matchScore}%</div>
                                                        <div className="text-xs text-muted-foreground">Match</div>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <h3 className="text-xl font-bold text-foreground">{rec.name}</h3>
                                                                {rec.badge && (
                                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary flex items-center gap-1">
                                                                        <Star className="w-3 h-3" /> {rec.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{rec.provider}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <div className="text-2xl font-bold text-foreground">
                                                                ₹{rec.monthlyPremium?.toLocaleString("en-IN")}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">/month</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                            <Shield className="w-3 h-3" /> {rec.coverage}
                                                        </span>
                                                        <span className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground capitalize">
                                                            {rec.type}
                                                        </span>
                                                    </div>

                                                    {/* Features preview */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {rec.features?.slice(0, 3).map((f, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                                                                <Check className="w-3 h-3" /> {f}
                                                            </span>
                                                        ))}
                                                        {rec.features?.length > 3 && (
                                                            <span className="px-2 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                                                                +{rec.features.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                                                        >
                                                            <Sparkles className="w-4 h-4" />
                                                            Why this policy?
                                                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                                                        </button>

                                                        {rec.providerUrl && (
                                                            <a
                                                                href={rec.providerUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                Visit provider
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="border-t border-border/50 bg-secondary/20 p-6 md:p-8"
                                                >
                                                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                                                        <div className="flex items-start gap-3">
                                                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <h4 className="font-semibold text-foreground mb-1">Gemini's Analysis</h4>
                                                                <p className="text-sm text-muted-foreground">{rec.whyRecommended}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                                <Check className="w-4 h-4 text-success" /> What's Included
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {rec.features?.map((f, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                                                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" /> {f}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                                <X className="w-4 h-4 text-destructive" /> Not Included
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {rec.notIncluded?.map((item, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                        <X className="w-4 h-4 text-destructive/50 flex-shrink-0 mt-0.5" /> {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Empty state after search */}
                    {searched && !isLoading && !error && recommendations.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">No results found</h2>
                            <p className="text-sm text-muted-foreground">Try a more detailed query or different insurance type.</p>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AIInsuranceSearch;
