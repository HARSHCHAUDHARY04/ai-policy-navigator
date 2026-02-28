import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
  X,
  Check,
  Shield,
  Star,
  ExternalLink,
} from "lucide-react";

interface Question {
  question: string;
  options: string[];
}

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

const questions: Question[] = [
  { question: "What's your primary insurance need?", options: ["Health Protection", "Life Coverage", "Investment + Insurance", "Family Floater"] },
  { question: "What's your age group?", options: ["18-30", "31-45", "46-60", "60+"] },
  { question: "What's your monthly budget for insurance?", options: ["Under ₹1,000", "₹1,000-₹2,500", "₹2,500-₹5,000", "₹5,000+"] },
  { question: "Do you have any pre-existing conditions?", options: ["None", "Diabetes", "Heart condition", "Other"] },
  { question: "What matters most to you?", options: ["Lowest Premium", "Maximum Coverage", "Best Claim Ratio", "Network Hospitals"] },
];

const InsuranceQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
  };

  const next = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Final step — call Gemini AI
      setIsLoading(true);
      setShowResults(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        if (!response.ok) throw new Error("Server error. Please try again.");
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
    setRecommendations([]);
    setError(null);
    setExpandedIdx(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Recommender</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Find Your <span className="text-gradient">Perfect Policy</span>
            </h1>
            <p className="text-muted-foreground">Answer 5 quick questions — Gemini AI will curate policies just for you.</p>
          </motion.div>

          {!showResults ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <p className="text-sm text-muted-foreground mb-2">Question {step + 1} of {questions.length}</p>
                  <h2 className="text-2xl font-bold text-foreground mb-6">{questions[step].question}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {questions[step].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => selectAnswer(option)}
                        className={`p-4 rounded-xl text-left text-sm font-medium transition-all border ${answers[step] === option
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary/50 border-transparent text-foreground hover:bg-secondary"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prev} disabled={step === 0}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={next} disabled={!answers[step]}>
                  {step === questions.length - 1 ? "Get AI Recommendations" : "Next"} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Loading State */}
              {isLoading && (
                <div className="glass-card p-12 flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Gemini is analysing your profile…</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Our AI is searching through hundreds of Indian insurance policies to find your best matches.
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="glass-card p-8 text-center border-destructive/30">
                  <p className="text-destructive font-medium mb-4">{error}</p>
                  <Button variant="outline" onClick={restart}>Try Again</Button>
                </div>
              )}

              {/* Results */}
              {!isLoading && !error && recommendations.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold">Your AI-Curated Recommendations</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">Based on your profile, Gemini recommends these policies:</p>

                  {recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-foreground">{rec.name}</h3>
                              {rec.badge && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary flex items-center gap-1">
                                  <Star className="w-3 h-3" /> {rec.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{rec.provider}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                <Shield className="w-3 h-3" /> {rec.coverage}
                              </span>
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground">
                                ₹{rec.monthlyPremium?.toLocaleString("en-IN")}/mo
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-3xl font-bold text-gradient">{rec.matchScore}%</p>
                            <p className="text-xs text-muted-foreground">match</p>
                            <CheckCircle2 className="w-5 h-5 text-primary mx-auto mt-1" />
                          </div>
                        </div>

                        {/* Top features */}
                        <div className="flex flex-wrap gap-2 mt-4">
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

                        {/* Why Recommended toggle */}
                        <button
                          onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
                        >
                          <Sparkles className="w-4 h-4" />
                          Why this policy?
                          <ChevronRight className={`w-4 h-4 transition-transform ${expandedIdx === idx ? "rotate-90" : ""}`} />
                        </button>

                        {rec.providerUrl && (
                          <a
                            href={rec.providerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mt-3"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Visit provider
                          </a>
                        )}
                      </div>

                      {/* Expanded panel */}
                      <AnimatePresence>
                        {expandedIdx === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-border/50 bg-secondary/20 p-6"
                          >
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                              <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">Gemini's Reasoning</h4>
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
                  ))}

                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={restart}>Take Quiz Again</Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InsuranceQuiz;
