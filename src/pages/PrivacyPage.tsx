import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileCheck, 
  Server, 
  UserCheck,
  CheckCircle,
  Building
} from "lucide-react";

const privacyFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All your data is encrypted using AES-256 encryption, both in transit and at rest. Even we can't read your sensitive information.",
  },
  {
    icon: Eye,
    title: "You Control Your Data",
    description: "Download, modify, or delete your data at any time. We never sell your personal information to third parties.",
  },
  {
    icon: FileCheck,
    title: "SOC 2 Type II Certified",
    description: "Our systems are regularly audited by independent third parties to ensure the highest security standards.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Built on enterprise-grade cloud infrastructure with 99.99% uptime and multi-region redundancy.",
  },
  {
    icon: UserCheck,
    title: "Minimal Data Collection",
    description: "We only collect what's necessary to provide you with personalized recommendations. Nothing more.",
  },
  {
    icon: Building,
    title: "Regulatory Compliance",
    description: "Fully compliant with GDPR, CCPA, HIPAA, and other major data protection regulations.",
  },
];

const dataUsage = [
  {
    title: "What We Collect",
    items: [
      "Basic profile information (name, email, date of birth)",
      "Lifestyle and health questionnaire responses",
      "Property and vehicle information for risk assessment",
      "Employment and income range for coverage recommendations",
    ],
  },
  {
    title: "How We Use It",
    items: [
      "Generating personalized risk scores",
      "Matching you with optimal insurance policies",
      "Improving our AI recommendation engine",
      "Communicating important updates about your coverage",
    ],
  },
  {
    title: "What We Never Do",
    items: [
      "Sell your data to advertisers or data brokers",
      "Share your health information without explicit consent",
      "Store payment information on our servers",
      "Use your data for purposes you haven't agreed to",
    ],
  },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Your Data, Protected</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy & <span className="text-gradient">Security</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We take your privacy seriously. Here's how we protect your data 
              and give you complete control over your information.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6 mb-20"
          >
            {["SOC 2 Certified", "GDPR Compliant", "HIPAA Compliant", "CCPA Compliant"].map((badge, index) => (
              <div 
                key={badge}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50"
              >
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">{badge}</span>
              </div>
            ))}
          </motion.div>

          {/* Security Features Grid */}
          <div className="max-w-5xl mx-auto mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-center mb-10"
            >
              How We Keep You Safe
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privacyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Data Usage */}
          <div className="max-w-5xl mx-auto mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-center mb-10"
            >
              Transparent Data Practices
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {dataUsage.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4 pb-4 border-b border-border/50">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-card glow-border p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold mb-6">Your Rights, Our Promise</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                You have complete control over your data. At any time, you can request to:
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Eye, label: "Access" },
                  { icon: FileCheck, label: "Export" },
                  { icon: Lock, label: "Modify" },
                  { icon: Shield, label: "Delete" },
                ].map((right) => (
                  <div 
                    key={right.label}
                    className="p-4 rounded-xl bg-secondary/30 text-center"
                  >
                    <right.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <span className="text-sm font-medium text-foreground">{right.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                Questions? Contact our privacy team at{" "}
                <a href="mailto:privacy@insureai.com" className="text-primary hover:underline">
                  privacy@insureai.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
