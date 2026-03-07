import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
            <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

            {/* Back to Home Link */}
            <Link to="/" className="absolute top-8 left-8 text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2 z-20">
                <div className="w-8 h-8 rounded-full bg-surface border border-white/5 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                </div>
                Return Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <Shield className="w-6 h-6 text-primary drop-shadow-md" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-3">Welcome Back</h1>
                    <p className="text-muted-foreground font-light text-lg">Authenticate to access your workspace.</p>
                </div>

                {/* Main Card */}
                <div className="premium-glass rounded-[2rem] p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] border-white/10 relative group">
                    {/* Subtle top glare */}
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                            <p className="text-sm font-medium text-destructive">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground">Password</label>
                                <a href="#" className="text-xs font-medium text-primary hover:text-white transition-colors">Forgot Phase?</a>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type={showPwd ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60 transition-all font-light"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-white transition-colors"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium w-full py-3.5 mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                                    <span className="font-semibold text-background">Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-background" />
                                    <span className="font-semibold text-background">Initialize Session</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-sm font-light text-muted-foreground">
                            New to the network?{" "}
                            <Link to="/signup" className="text-primary font-semibold hover:text-white transition-colors">
                                Create a terminal
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
