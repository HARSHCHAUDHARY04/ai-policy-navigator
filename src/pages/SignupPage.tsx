import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Security keys do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Security key must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await register(name, email, password);
            navigate("/profile");
        } catch (err: any) {
            setError(err.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        "Cognitive policy matching Engine",
        "Advanced risk vector analysis",
        "Deep comparison matrix (200+ sources)",
        "Certified carrier network access"
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

            {/* Back to Home Link */}
            <Link to="/" className="absolute top-8 left-8 text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2 z-20">
                <div className="w-8 h-8 rounded-full bg-surface border border-white/5 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                </div>
                Return Home
            </Link>

            <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left side - benefits */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="hidden md:block space-y-8"
                >
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <Shield className="w-6 h-6 text-primary drop-shadow-md" />
                        </div>
                        <span className="text-2xl font-display font-bold text-white tracking-tight">PolicyNav</span>
                    </div>

                    <div>
                        <h2 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 text-white">
                            Initialize your <br />
                            <span className="text-gradient">protection matrix.</span>
                        </h2>
                        <p className="text-muted-foreground font-light text-xl max-w-md leading-relaxed">
                            Join 50,000+ users who made smarter coverage decisions on PolicyNav.
                        </p>
                    </div>

                    <div className="pt-4 space-y-5">
                        {benefits.map((b, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                key={b}
                                className="flex items-start gap-4"
                            >
                                <div className="w-8 h-8 rounded-xl bg-surface border border-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Zap className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white/80 font-light text-lg">{b}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right side - form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                    <div className="text-center mb-6 md:hidden">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xl font-display font-bold text-white">PolicyAI</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white">Access Node</h1>
                    </div>

                    <div className="premium-glass rounded-[2rem] p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border-white/10 relative group">
                        {/* Subtle top glare */}
                        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="mb-8 hidden md:block">
                            <h2 className="text-3xl font-display font-bold text-white mb-2">Create Terminal</h2>
                            <p className="text-muted-foreground font-light">Zero cost baseline access. No credit metrics required.</p>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                                <p className="text-sm font-medium text-destructive">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">Operator Name</label>
                                <div className="relative group/input">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter designation"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">Comms Address</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Secure email link"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">Security Key</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 6 hash chars"
                                        className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                    />
                                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-white transition-colors">
                                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">Verify Key</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="Re-enter hash"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-premium w-full py-3.5 mt-4 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                                        <span className="font-semibold text-background">Provisioning...</span>
                                    </>
                                ) : (
                                    <span className="font-semibold text-background">Initialize Terminal →</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-white/5 pt-6">
                            <p className="text-sm font-light text-muted-foreground">
                                Access exists in network?{" "}
                                <Link to="/login" className="text-primary font-semibold hover:text-white transition-colors">
                                    Authenticate
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
