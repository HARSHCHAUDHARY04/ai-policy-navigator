import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText, Phone, ClipboardCheck, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const steps = [
  { icon: Phone, title: "Intimate the Insurer", description: "Call your insurance company's helpline within 24–48 hours of hospitalization. Most providers have 24/7 toll-free numbers." },
  { icon: FileText, title: "Gather Documents", description: "Collect hospital bills, discharge summary, prescription copies, diagnostic reports, and your policy document." },
  { icon: ClipboardCheck, title: "Fill Claim Form", description: "Complete the claim form provided by your insurer. Attach all required documents and double-check for accuracy." },
  { icon: Clock, title: "Submit & Track", description: "Submit your claim online or at the nearest branch. Track the status through the insurer's app or portal." },
  { icon: CheckCircle2, title: "Settlement", description: "Once approved, the claim amount is typically settled within 7–30 days directly to your bank account." },
];

const dos = ["Inform insurer immediately", "Keep all original bills & receipts", "Use network hospitals for cashless claims", "Read your policy terms carefully", "Follow up regularly on claim status"];
const donts = ["Don't delay claim intimation", "Don't submit incomplete documents", "Don't hide pre-existing conditions", "Don't ignore policy exclusions", "Don't lose original documents"];

const ClaimsGuide = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Claims Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How to <span className="text-gradient">File a Claim</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Step-by-step guide to filing insurance claims in India.</p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          {steps.map((step, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-6 flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Step {idx + 1}</span>
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Do's and Don'ts */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Do's
            </h3>
            <ul className="space-y-3">
              {dos.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />{item}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Don'ts
            </h3>
            <ul className="space-y-3">
              {donts.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm"><XCircle className="w-4 h-4 text-destructive flex-shrink-0" />{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ClaimsGuide;
