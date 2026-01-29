import { motion } from "framer-motion";
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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock risk data - in a real app, this would come from the backend
const riskData = {
  overallScore: 72,
  factors: [
    {
      id: "health",
      name: "Health Risk",
      icon: Heart,
      score: 68,
      status: "medium",
      description: "Moderate risk based on lifestyle factors",
      insights: [
        { positive: true, text: "Regular exercise routine" },
        { positive: true, text: "Non-smoker status" },
        { positive: false, text: "Pre-existing condition: Hypertension" },
      ],
    },
    {
      id: "property",
      name: "Property Risk",
      icon: Home,
      score: 82,
      status: "low",
      description: "Well-protected property with security features",
      insights: [
        { positive: true, text: "Security system installed" },
        { positive: true, text: "Located in low-crime area" },
        { positive: true, text: "Recently updated electrical" },
      ],
    },
    {
      id: "vehicle",
      name: "Vehicle Risk",
      icon: Car,
      score: 58,
      status: "high",
      description: "Higher risk due to vehicle age and mileage",
      insights: [
        { positive: false, text: "Vehicle age: 6-10 years" },
        { positive: false, text: "High annual mileage" },
        { positive: true, text: "Clean driving record" },
      ],
    },
    {
      id: "employment",
      name: "Income Stability",
      icon: Briefcase,
      score: 88,
      status: "low",
      description: "Stable employment with good income protection",
      insights: [
        { positive: true, text: "Full-time employment" },
        { positive: true, text: "Low-risk industry" },
        { positive: true, text: "Stable income history" },
      ],
    },
  ],
  recommendations: [
    "Consider increasing health coverage for pre-existing conditions",
    "Your property coverage is well-optimized",
    "Comprehensive auto insurance recommended for older vehicle",
    "Disability insurance could provide additional income protection",
  ],
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Analysis Complete</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Risk <span className="text-gradient">Analysis</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what our AI discovered about your risk profile
            </p>
          </motion.div>

          {/* Overall Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="glass-card glow-border p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Circle */}
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="hsl(var(--secondary))"
                      strokeWidth="12"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(riskData.overallScore / 100) * 553} 553`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(186 100% 50%)" />
                        <stop offset="100%" stopColor="hsl(256 80% 60%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-gradient">{riskData.overallScore}</span>
                    <span className="text-sm text-muted-foreground">Protection Score</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">Good Protection Level</h2>
                  <p className="text-muted-foreground mb-6">
                    Your overall risk profile shows room for improvement in a few areas. 
                    Our AI has identified specific recommendations to optimize your coverage.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">2 areas well protected</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-sm text-warning">2 areas need attention</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Risk Factor Cards */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-xl font-bold mb-6">Risk Factor Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {riskData.factors.map((factor, index) => (
                <motion.div
                  key={factor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <factor.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{factor.name}</h4>
                        <span className={`text-2xl font-bold ${getScoreColor(factor.score)}`}>
                          {factor.score}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(factor.status)}`}>
                          {factor.status.charAt(0).toUpperCase() + factor.status.slice(1)} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{factor.description}</p>

                  {/* Progress Bar */}
                  <div className="progress-premium mb-4">
                    <div 
                      className="progress-premium-fill" 
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>

                  {/* Insights */}
                  <div className="space-y-2">
                    {factor.insights.map((insight, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {insight.positive ? (
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                {riskData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Link to="/recommendations">
              <Button variant="hero" size="xl">
                View Policy Recommendations
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RiskDashboard;
