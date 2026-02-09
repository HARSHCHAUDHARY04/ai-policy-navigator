import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does InsureAI recommend policies?", a: "Our AI analyzes 200+ data points from your profile—age, health, family size, location, and budget—to match you with the best policies from 20+ insurance partners." },
  { q: "Is my personal data safe?", a: "Absolutely. We use bank-grade encryption and are fully IRDAI compliant. Your data is never shared with third parties without your explicit consent." },
  { q: "How much can I really save?", a: "On average, our users save ₹1.5–2 Lakhs annually by switching to AI-recommended policies that eliminate unnecessary coverage overlap." },
  { q: "What types of insurance do you cover?", a: "We currently cover Health Insurance, Life Insurance, and Term Plans from India's top providers including HDFC Ergo, Star Health, ICICI Lombard, and more." },
  { q: "Is there any cost to use InsureAI?", a: "Using our comparison and recommendation engine is completely free. We earn a small commission from insurers when you purchase a policy through us." },
  { q: "How fast is the claim settlement process?", a: "Claims through network hospitals are typically cashless. For reimbursement claims, most of our partner insurers settle within 7–30 days." },
];

export const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.05 }}>
              <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full glass-card p-5 text-left flex items-center justify-between gap-4">
                <span className="font-semibold text-foreground">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${openIdx === idx ? "rotate-180" : ""}`} />
              </button>
              {openIdx === idx && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-4 pt-2 text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
