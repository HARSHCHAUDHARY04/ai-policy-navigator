import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Heart,
  Home,
  Car,
  Briefcase,
  ChevronRight,
  Info,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Basic logic to generate risk data from user profile
const generateRiskData = (user: any) => {
  if (!user) return null;

  const healthScore = user.smoker === 'Never' ? 85 : 60;
  const propertyScore = user.homeOwnership === 'Own' ? 85 : 70;
  const vehicleScore = user.vehicleAge?.includes('New') ? 90 : 65;
  const employmentScore = user.employmentStatus === 'Employed full-time' ? 90 : 75;

  return {
    overallScore: Math.round((healthScore + propertyScore + vehicleScore + employmentScore) / 4),
    factors: [
      {
        id: "health",
        name: "Health Risk",
        icon: Heart,
        score: healthScore,
        status: healthScore >= 80 ? "low" : "medium",
        description: `Risk analysis for ${user.firstName}`,
        insights: [
          { positive: user.smoker === 'Never', text: user.smoker === 'Never' ? "Non-smoker status" : "Current/former smoker" },
          { positive: true, text: `Exercise frequency: ${user.exerciseFrequency}` },
        ],
      },
      {
        id: "property",
        name: "Property Risk",
        icon: Home,
        score: propertyScore,
        status: propertyScore >= 80 ? "low" : "medium",
        description: `${user.propertyType || 'Home'} protection status`,
        insights: [
          { positive: true, text: `Ownership: ${user.homeOwnership}` },
        ],
      },
      {
        id: "vehicle",
        name: "Vehicle Risk",
        icon: Car,
        score: vehicleScore,
        status: vehicleScore >= 80 ? "low" : "medium",
        description: "Vehicle protection analysis",
        insights: [
          { positive: true, text: `Vehicle Age: ${user.vehicleAge || 'N/A'}` },
        ],
      },
      {
        id: "employment",
        name: "Income Stability",
        icon: Briefcase,
        score: employmentScore,
        status: employmentScore >= 80 ? "low" : "medium",
        description: "Career & income security",
        insights: [
          { positive: true, text: user.employmentStatus },
        ],
      },
    ],
    recommendations: [
      healthScore < 80 ? "Consider increasing health coverage" : "Your health coverage is well-optimized",
      "Check our new life insurance policies for family protection",
      "Update your property insurance value annually",
    ],
  };
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

const getStatusBadge = (status: string) => {
  const styles = {
    low: "bg-success/20 text-success",
    medium: "bg-warning/20 text-warning",
    high: "bg-destructive/20 text-destructive",
  };
  return styles[status as keyof typeof styles] || styles.medium;
};

const RiskDashboard = () => {
  const userId = localStorage.getItem("userId");

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      // In a real app, we'd have a GET /api/users/:id endpoint
      // For now, we'll just fetch all and find ours or return null
      const response = await fetch('http://localhost:5000/api/users');
      const users = await response.json();
      return users.find((u: any) => u._id === userId) || users[users.length - 1]; // fallback to last user
    },
    enabled: !!userId
  });

  const riskData = generateRiskData(user) || {
    overallScore: 0,
    factors: [],
    recommendations: ["Complete your profile to see risk analysis"]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full premium-glass border-success/30 mb-6 shadow-glow">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success tracking-wide uppercase">Analysis Complete</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Your Risk <span className="text-gradient">Analysis</span>
            </h1>
            <p className="text-muted-foreground text-xl font-light">
              Deep evaluation of your protection parameters
            </p>
          </motion.div>

          {/* Overall Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="premium-glass p-8 md:p-14 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Futuristic Score Circle */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl animate-pulse" />
                  <svg className="w-56 h-56 transform -rotate-90 relative z-10 drop-shadow-[0_0_15px_rgba(46,204,113,0.3)]">
                    <circle
                      cx="112"
                      cy="112"
                      r="96"
                      fill="none"
                      stroke="hsl(160 20% 15%)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="96"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(riskData.overallScore / 100) * 603} 603`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(152 80% 50%)" />
                        <stop offset="100%" stopColor="hsl(180 90% 60%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className="text-6xl font-display font-bold text-glow text-white">{riskData.overallScore}</span>
                    <span className="text-sm font-medium tracking-widest text-primary mt-1 uppercase">Score</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-display font-bold mb-4 text-white">Optimal Protection Level</h2>
                  <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
                    Your overall risk profile shows a strong baseline. We've identified specific adjustments to maximize your coverage efficiency.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-success/10 border border-success/20">
                      <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-sm font-medium text-success/90">2 Areas Optimized</span>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-warning/10 border border-warning/20">
                      <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      </div>
                      <span className="text-sm font-medium text-warning/90">2 Areas Need Attention</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Risk Factor Cards */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-primary rounded-full" />
              <h3 className="text-2xl font-display font-bold text-white">Factor Breakdown</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {riskData.factors.map((factor, index) => (
                <motion.div
                  key={factor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="premium-glass p-8 hover-lift group"
                >
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-glow">
                      <factor.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg text-white font-display">{factor.name}</h4>
                        <span className={`text-2xl font-display font-bold ${getScoreColor(factor.score)}`}>
                          {factor.score}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-current ${getStatusBadge(factor.status)}`}>
                        {factor.status} Risk
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 font-light">{factor.description}</p>

                  {/* Progress Bar */}
                  <div className="bg-background rounded-full p-1 mb-6 border border-white/5 shadow-inner">
                    <div className="progress-premium !h-2 !bg-transparent !shadow-none !border-none">
                      <div
                        className={`progress-premium-fill ${factor.status === "high" ? "!bg-destructive !shadow-[0_0_10px_rgba(231,76,60,0.8)]" :
                          factor.status === "medium" ? "!bg-warning !shadow-[0_0_10px_rgba(243,156,18,0.8)]" : ""
                          }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="space-y-3 bg-card/40 p-4 rounded-xl border border-white/5">
                    {factor.insights.map((insight, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {insight.positive ? (
                          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-success" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-3 h-3 text-warning" />
                          </div>
                        )}
                        <span className="text-muted-foreground">{insight.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="glow-border p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-accent">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">Recommendations</h3>
              </div>

              <div className="space-y-4 relative z-10">
                {riskData.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl premium-glass border-primary/20 hover-lift"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/90 font-light text-lg leading-relaxed">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Link to="/recommendations">
              <button className="btn-premium px-10 py-5 text-lg shadow-glow-accent group">
                Access Policy Recommendations
                <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RiskDashboard;
