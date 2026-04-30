import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, 
    Bookmark, 
    ArrowRight, 
    TrendingUp, 
    AlertCircle, 
    Clock, 
    ExternalLink,
    PieChart,
    ChevronRight,
    Zap,
    Check,
    X,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface SavedPolicy {
    _id: string;
    policy: {
        _id: string;
        name: string;
        provider: string;
        type: string;
        monthlyPremium: number;
        coverage: string;
        features: string[];
        notIncluded: string[];
        whyRecommended: string;
        providerUrl?: string;
    };
    status: string;
    createdAt: string;
}

interface RiskSummary {
    overallScore: number;
    sectors: { name: string; score: number }[];
    insights: string[];
}

const Dashboard = () => {
    const { token } = useAuth();
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const { data: savedPolicies, isLoading: policiesLoading } = useQuery<SavedPolicy[]>({
        queryKey: ['saved-policies'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/policies/saved`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch saved policies");
            return res.json();
        },
        enabled: !!token
    });

    const { data: riskSummary, isLoading: riskLoading } = useQuery<RiskSummary>({
        queryKey: ['risk-summary'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/analytics/risk-summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch risk summary");
            return res.json();
        },
        enabled: !!token
    });

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Shield className="w-16 h-16 text-primary/20 mb-6" />
                <h1 className="text-3xl font-display font-bold mb-4">Access Restricted</h1>
                <p className="text-muted-foreground mb-8 max-w-md">Please log in to view your personalized insurance dashboard and track your policies.</p>
                <Link to="/login">
                    <Button size="lg" className="px-8">Log In Now</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            
            <Navbar />

            <main className="flex-1 pt-32 pb-20 relative z-10">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
                                Dashboard<span className="text-primary">.</span>
                            </h1>
                            <p className="text-muted-foreground font-light text-lg">Central control for your insurance portfolio</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/smart-search">
                                <Button className="premium-glass bg-white/5 border-white/10 text-white hover:bg-white/10 px-6">
                                    <Zap className="w-4 h-4 mr-2 text-primary" /> New Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Summary Column */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Risk Score Card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="premium-glass p-8 relative overflow-hidden group border-primary/20"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-6">Security Posture</h3>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-6xl font-display font-bold">{riskSummary?.overallScore || '--'}</span>
                                    <span className="text-sm font-medium text-muted-foreground mb-2">/100</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
                                    <div 
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-1000"
                                        style={{ width: `${riskSummary?.overallScore || 0}%` }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    {riskSummary?.insights.slice(0, 2).map((insight, i) => (
                                        <div key={i} className="flex gap-3 text-sm font-light text-foreground/80">
                                            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                            <p>{insight}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/risk-dashboard" className="mt-8 block">
                                    <Button variant="ghost" className="w-full justify-between hover:bg-white/5 group/btn">
                                        <span className="text-xs font-bold uppercase tracking-widest">Full Analysis</span>
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Analytics Quick Look */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="premium-glass p-8 border-white/5"
                            >
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Sector Protection</h3>
                                <div className="space-y-4">
                                    {riskSummary?.sectors.map((sector, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{sector.name}</span>
                                                <span className="font-medium">{sector.score}%</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${sector.score > 80 ? 'bg-success' : sector.score > 50 ? 'bg-warning' : 'bg-destructive'} opacity-60`}
                                                    style={{ width: `${sector.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Policies Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="premium-glass min-h-[400px] flex flex-col border-white/5 relative overflow-hidden"
                            >
                                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Bookmark className="w-5 h-5 text-primary" />
                                        <h2 className="text-xl font-display font-bold">Saved Portfolios</h2>
                                    </div>
                                    <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                                        {savedPolicies?.length || 0} Policies
                                    </span>
                                </div>

                                <div className="flex-1 p-4 md:p-8">
                                    {policiesLoading ? (
                                        <div className="grid gap-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                                            ))}
                                        </div>
                                    ) : savedPolicies && savedPolicies.length > 0 ? (
                                        <div className="grid gap-6">
                                            {savedPolicies.filter(s => s.policy).map((saved, idx) => {
                                                const isExpanded = expandedIdx === idx;
                                                return (
                                                    <motion.div 
                                                        key={saved._id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className={`group flex flex-col rounded-2xl bg-white/5 border transition-all overflow-hidden ${isExpanded ? "border-primary/50 bg-white/[0.08]" : "border-white/5 hover:border-primary/30 hover:bg-white/[0.07]"}`}
                                                    >
                                                        <div 
                                                            className="flex flex-col md:flex-row md:items-center gap-6 p-6 cursor-pointer"
                                                            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                                        >
                                                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                                <Shield className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h4 className="text-lg font-bold text-white truncate">{saved.policy.name}</h4>
                                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary border border-primary/20 uppercase">
                                                                        {saved.policy.type}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{saved.policy.provider}</p>
                                                            </div>
                                                            <div className="flex md:flex-col items-center md:items-end justify-between gap-2">
                                                                <div className="text-xl font-display font-bold">₹{saved.policy.monthlyPremium.toLocaleString('en-IN')}</div>
                                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                                                    <Clock className="w-3 h-3" /> {new Date(saved.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                            <div className="md:ml-auto flex items-center gap-2">
                                                                <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-primary/50 group-hover:text-primary transition-colors">
                                                                    {isExpanded ? "Close Details" : "View Details"}
                                                                </span>
                                                                <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}>
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="border-t border-white/5 bg-black/20"
                                                                >
                                                                    <div className="p-6 space-y-6">
                                                                        {/* Insights Section */}
                                                                        {saved.policy.whyRecommended && (
                                                                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
                                                                                <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                                                                                <div>
                                                                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Expert Analysis</h5>
                                                                                    <p className="text-sm text-foreground/90 font-light leading-relaxed">{saved.policy.whyRecommended}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="grid md:grid-cols-2 gap-6">
                                                                            {/* Features */}
                                                                            <div>
                                                                                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                                                                    <Check className="w-3 h-3 text-success" /> Features
                                                                                </h5>
                                                                                <ul className="space-y-2">
                                                                                    {saved.policy.features?.length > 0 ? (
                                                                                        saved.policy.features.map((f, i) => (
                                                                                            <li key={i} className="text-xs text-muted-foreground font-light flex items-start gap-2">
                                                                                                <div className="w-1 h-1 rounded-full bg-success mt-1.5 flex-shrink-0" /> {f}
                                                                                            </li>
                                                                                        ))
                                                                                    ) : (
                                                                                        <li className="text-xs text-muted-foreground italic">Standard category benefits apply.</li>
                                                                                    )}
                                                                                </ul>
                                                                            </div>

                                                                            {/* Not Included */}
                                                                            <div>
                                                                                <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                                                                    <X className="w-3 h-3 text-destructive" /> Exclusions
                                                                                </h5>
                                                                                <ul className="space-y-2">
                                                                                    {saved.policy.notIncluded?.length > 0 ? (
                                                                                        saved.policy.notIncluded.map((n, i) => (
                                                                                            <li key={i} className="text-xs text-muted-foreground font-light flex items-start gap-2">
                                                                                                <div className="w-1 h-1 rounded-full bg-destructive mt-1.5 flex-shrink-0" /> {n}
                                                                                            </li>
                                                                                        ))
                                                                                    ) : (
                                                                                        <li className="text-xs text-muted-foreground italic">Standard exclusions apply.</li>
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        </div>

                                                                        {saved.policy.providerUrl && (
                                                                            <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                                                                                <a 
                                                                                    href={saved.policy.providerUrl} 
                                                                                    target="_blank" 
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                                                                                >
                                                                                    View official document <ExternalLink className="w-3 h-3" />
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                                <Bookmark className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">No Saved Policies</h3>
                                            <p className="text-muted-foreground text-sm max-w-xs mb-8">You haven't saved any policies yet. Start a search to find the best recommendations for your profile.</p>
                                            <Link to="/smart-search">
                                                <Button className="bg-primary hover:bg-primary/90">Find Policies</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 bg-gradient-to-t from-black/40 to-transparent flex justify-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Encrypted End-to-End Analysis</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
