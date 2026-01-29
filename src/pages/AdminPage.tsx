import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Database, 
  Brain, 
  Shield, 
  ArrowRight, 
  Server, 
  Cpu,
  Network,
  BarChart3,
  Users,
  FileText,
  Sparkles
} from "lucide-react";

const systemComponents = [
  {
    icon: Database,
    title: "Data Layer",
    description: "MongoDB-powered storage with encryption at rest",
    items: ["User profiles", "Risk assessments", "Policy catalog", "Audit logs"],
  },
  {
    icon: Brain,
    title: "AI Engine",
    description: "Machine learning models for intelligent recommendations",
    items: ["Risk scoring model", "Policy matching algorithm", "Fraud detection", "Predictive analytics"],
  },
  {
    icon: Server,
    title: "API Services",
    description: "RESTful APIs built with Node.js + Express",
    items: ["Authentication", "Profile management", "Risk analysis", "Recommendations"],
  },
  {
    icon: Shield,
    title: "Security Layer",
    description: "Enterprise-grade security infrastructure",
    items: ["JWT authentication", "Rate limiting", "Data encryption", "Access control"],
  },
];

const pipelineSteps = [
  { icon: Users, label: "User Input", color: "primary" },
  { icon: Database, label: "Data Storage", color: "accent" },
  { icon: Brain, label: "AI Processing", color: "primary" },
  { icon: BarChart3, label: "Risk Scoring", color: "accent" },
  { icon: FileText, label: "Policy Match", color: "primary" },
  { icon: Shield, label: "Recommendations", color: "success" },
];

const stats = [
  { value: "200+", label: "Data Points Analyzed" },
  { value: "50ms", label: "Avg Response Time" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "1M+", label: "Policies in Catalog" },
];

const AdminPage = () => {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Cpu className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">System Architecture</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Admin <span className="text-gradient">Overview</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A comprehensive view of the InsureAI system architecture and data processing pipeline
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Data Flow Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-20"
          >
            <h2 className="text-2xl font-bold text-center mb-10">Recommendation Pipeline</h2>
            <div className="glass-card glow-border p-8 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[700px]">
                {pipelineSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        step.color === "primary" 
                          ? "bg-gradient-to-br from-primary to-accent shadow-glow"
                          : step.color === "accent"
                          ? "bg-gradient-to-br from-accent to-primary"
                          : "bg-gradient-to-br from-success to-primary"
                      }`}>
                        <step.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground mt-3 text-center">
                        {step.label}
                      </span>
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <div className="flex items-center mx-4 mb-6">
                        <div className="w-12 h-px bg-gradient-to-r from-primary to-accent" />
                        <ArrowRight className="w-4 h-4 text-primary -ml-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* System Components */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-center mb-10">System Components</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {systemComponents.map((component, index) => (
                <motion.div
                  key={component.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <component.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{component.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {component.items.map((item) => (
                          <span 
                            key={item}
                            className="px-3 py-1 rounded-full text-xs bg-secondary text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card glow-border p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Architecture Overview</h2>
              </div>

              {/* Simple ASCII-style diagram */}
              <div className="font-mono text-sm space-y-4 overflow-x-auto">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30">
                    React Frontend
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="px-4 py-2 rounded-lg bg-accent/20 text-accent border border-accent/30">
                    Express API
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="px-4 py-2 rounded-lg bg-success/20 text-success border border-success/30">
                    MongoDB
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-border" />
                </div>

                <div className="flex justify-center">
                  <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
                    <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
                    <span className="text-foreground font-semibold">AI/ML Engine</span>
                    <div className="text-xs text-muted-foreground mt-1">
                      Risk Scoring • Policy Matching • Analytics
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Frontend</div>
                    <div className="text-foreground font-medium">React + Tailwind + Framer Motion</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Backend</div>
                    <div className="text-foreground font-medium">Node.js + Express + JWT</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Database</div>
                    <div className="text-foreground font-medium">MongoDB + Mongoose ODM</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
