import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";

interface Question {
  question: string;
  options: string[];
}

const questions: Question[] = [
  { question: "What's your primary insurance need?", options: ["Health Protection", "Life Coverage", "Investment + Insurance", "Family Floater"] },
  { question: "What's your age group?", options: ["18-30", "31-45", "46-60", "60+"] },
  { question: "What's your monthly budget for insurance?", options: ["Under ₹1,000", "₹1,000-₹2,500", "₹2,500-₹5,000", "₹5,000+"] },
  { question: "Do you have any pre-existing conditions?", options: ["None", "Diabetes", "Heart condition", "Other"] },
  { question: "What matters most to you?", options: ["Lowest Premium", "Maximum Coverage", "Best Claim Ratio", "Network Hospitals"] },
];

// recommendations will be fetched from the API

const InsuranceQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['policies'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/policies');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    enabled: showResults
  });

  const getQuizRecommendations = () => {
    // Basic filtering logic based on quiz answers
    const category = answers[0]?.toLowerCase().includes("health") ? "health" :
      answers[0]?.toLowerCase().includes("life") ? "life" : "health";

    return policies
      .filter((p: any) => p.type === category || p.type === 'health') // default to health if not sure
      .slice(0, 3)
      .map((p: any) => ({
        ...p,
        premium: `₹${(p.monthlyPremium * 12).toLocaleString('en-IN')}/yr`,
        match: p.matchScore
      }));
  };

  const recommendations = getQuizRecommendations();

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Insurance Recommender</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Find Your <span className="text-gradient">Perfect Policy</span>
            </h1>
            <p className="text-muted-foreground">Answer 5 quick questions to get personalized recommendations.</p>
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
                      <button key={option} onClick={() => selectAnswer(option)} className={`p-4 rounded-xl text-left text-sm font-medium transition-all border ${answers[step] === option ? "bg-primary/10 border-primary text-primary" : "bg-secondary/50 border-transparent text-foreground hover:bg-secondary"}`}>
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
                  {step === questions.length - 1 ? "See Results" : "Next"} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h2 className="text-2xl font-bold text-center mb-6">Your Top Recommendations</h2>
              {recommendations.map((rec, idx) => (
                <div key={idx} className="glass-card p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{rec.provider}</p>
                    <h3 className="text-lg font-bold text-foreground">{rec.name}</h3>
                    <p className="text-sm text-muted-foreground">{rec.premium} · {rec.coverage} coverage</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{rec.match}%</p>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Button variant="outline" onClick={restart}>Take Quiz Again</Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InsuranceQuiz;
