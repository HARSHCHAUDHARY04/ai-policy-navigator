import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Heart,
  Home,
  Car,
  Briefcase,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Health & Lifestyle", icon: Heart },
  { id: 3, title: "Property", icon: Home },
  { id: 4, title: "Vehicles", icon: Car },
  { id: 5, title: "Employment", icon: Briefcase },
];

type FormData = {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  dependents: string;

  // Health
  smoker: string;
  exerciseFrequency: string;
  preExistingConditions: string[];
  healthGoal: string;

  // Property
  homeOwnership: string;
  propertyType: string;
  propertyValue: string;
  securityFeatures: string[];

  // Vehicles
  hasVehicle: string;
  vehicleType: string;
  vehicleAge: string;
  annualMileage: string;

  // Employment
  employmentStatus: string;
  occupation: string;
  annualIncome: string;
  industryRisk: string;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  dependents: "",
  smoker: "",
  exerciseFrequency: "",
  preExistingConditions: [],
  healthGoal: "",
  homeOwnership: "",
  propertyType: "",
  propertyValue: "",
  securityFeatures: [],
  hasVehicle: "",
  vehicleType: "",
  vehicleAge: "",
  annualMileage: "",
  employmentStatus: "",
  occupation: "",
  annualIncome: "",
  industryRisk: "",
};

const CustomerProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const arr = formData[field] as string[];
    if (arr.includes(value)) {
      updateField(field, arr.filter((v) => v !== value));
    } else {
      updateField(field, [...arr, value]);
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit form to backend
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to save profile");
        }

        const data = await response.json();
        console.log("Profile saved:", data);

        // Save user ID to localStorage for later use in recommendations
        localStorage.setItem("userId", data._id);

        navigate("/dashboard");
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile. Please try again.");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />

      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-bold tracking-wider uppercase text-primary/80">Profile Synthesis — Step {currentStep + 1} of {steps.length}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                Build Your <span className="text-gradient drop-shadow-[0_0_15px_hsl(152,80%,50%,0.3)]">Intelligence Profile</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                Share a few details about yourself so we can calculate your personalised risk profile and find the best plans for you.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_280px] gap-12 items-start">
              <div className="space-y-8">
                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">Synchronization Progress</span>
                    <span className="text-xl font-display font-bold text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-premium h-2">
                    <motion.div
                      className="progress-premium-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                    />
                  </div>
                </div>

                {/* Form Card */}
                <div className="glass-card glow-border p-8 md:p-10">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {/* Step 1: Personal Info */}
                      {currentStep === 0 && (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-glow">Personal Information</h2>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="label-premium">First Name</label>
                              <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => updateField("firstName", e.target.value)}
                                className="input-premium"
                                placeholder="Enter first name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label-premium">Last Name</label>
                              <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => updateField("lastName", e.target.value)}
                                className="input-premium"
                                placeholder="Enter last name"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="label-premium">Email Address</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                className="input-premium"
                                placeholder="name@domain.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="label-premium">Phone Number</label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                className="input-premium"
                                placeholder="+91 XXXX XXX XXX"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="label-premium">Date of Birth</label>
                            <input
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => updateField("dateOfBirth", e.target.value)}
                              className="input-premium"
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Gender Archetype</label>
                            <div className="flex flex-wrap gap-3">
                              {["Male", "Female", "Non-binary", "Prefer not to say"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("gender", option)}
                                  className={`btn-select-premium ${formData.gender === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-4">
                              <label className="label-premium">Social Structure</label>
                              <div className="flex flex-wrap gap-2">
                                {["Single", "Married", "Divorced", "Widowed"].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => updateField("maritalStatus", option)}
                                    className={`btn-select-premium flex-1 min-w-[80px] ${formData.maritalStatus === option ? "active" : ""}`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <label className="label-premium">Biological Dependents</label>
                              <div className="flex flex-wrap gap-2">
                                {["0", "1", "2", "3", "4+"].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => updateField("dependents", option)}
                                    className={`btn-select-premium flex-1 ${formData.dependents === option ? "active" : ""}`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Health & Lifestyle */}
                      {currentStep === 1 && (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-glow">Health & Bio-Profiling</h2>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Nicotine Exposure</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {["Never", "Former", "Occasional", "Regular"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("smoker", option)}
                                  className={`btn-select-premium py-3 ${formData.smoker === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Physical Optimization (Exercise)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {["Sedentary", "1-2x/week", "3-4x/week", "Daily"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("exerciseFrequency", option)}
                                  className={`btn-select-premium py-3 ${formData.exerciseFrequency === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Condition History (Select all)</label>
                            <div className="flex flex-wrap gap-2">
                              {["None", "Diabetes", "Heart", "Hypertension", "Asthma", "Cancer", "Other"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => toggleArrayField("preExistingConditions", option)}
                                  className={`btn-select-premium ${formData.preExistingConditions.includes(option) ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-4">
                            <label className="label-premium">Optimization Priority</label>
                            <div className="grid md:grid-cols-2 gap-3">
                              {[
                                { value: "prevention", label: "Preventive Care", desc: "Focus on early detection" },
                                { value: "coverage", label: "Maximum Shield", desc: "Comprehensive risk coverage" },
                                { value: "budget", label: "Efficient Budget", desc: "Optimized value-to-cost" },
                                { value: "family", label: "Group Legacy", desc: "Multi-profile protection" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => updateField("healthGoal", option.value)}
                                  className={`p-4 rounded-xl text-left transition-all duration-300 border ${formData.healthGoal === option.value
                                    ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(46,204,113,0.1)]"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                    }`}
                                >
                                  <div className={`font-bold uppercase tracking-widest text-[10px] mb-1 ${formData.healthGoal === option.value ? "text-primary" : "text-muted-foreground"}`}>
                                    {option.label}
                                  </div>
                                  <div className="text-sm text-foreground/80 font-light">{option.desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Property */}
                      {currentStep === 2 && (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <Home className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-glow">Property & Asset Metrics</h2>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Ownership Status</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {["Own", "Rent", "Family", "Other"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("homeOwnership", option)}
                                  className={`btn-select-premium py-3 ${formData.homeOwnership === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Architectural Class</label>
                            <div className="flex flex-wrap gap-3">
                              {["Independent", "Apartment", "Villa", "Bunglow", "N/A"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("propertyType", option)}
                                  className={`btn-select-premium truncate ${formData.propertyType === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="label-premium">Estimated Synthesis Value (Asset)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</span>
                              <input
                                type="text"
                                value={formData.propertyValue}
                                onChange={(e) => updateField("propertyValue", e.target.value)}
                                className="input-premium pl-8"
                                placeholder="7,500,000"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Counter-Risk Features (Security)</label>
                            <div className="flex flex-wrap gap-2">
                              {["Alarm", "CCTV", "Smart Locks", "Gated", "Sprinklers", "None"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => toggleArrayField("securityFeatures", option)}
                                  className={`btn-select-premium ${formData.securityFeatures.includes(option) ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Vehicles */}
                      {currentStep === 3 && (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <Car className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-glow">Transport Logistics</h2>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Operational Fleet</label>
                            <div className="grid grid-cols-3 gap-3">
                              {["Yes", "No", "Multiple"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("hasVehicle", option)}
                                  className={`btn-select-premium py-3 ${formData.hasVehicle === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <AnimatePresence>
                            {formData.hasVehicle !== "No" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 overflow-hidden"
                              >
                                <div className="space-y-4">
                                  <label className="label-premium">Mechanism Class</label>
                                  <div className="flex flex-wrap gap-3">
                                    {["Hatchback", "Sedan", "SUV", "Electric", "Two-Wheeler"].map((option) => (
                                      <button
                                        key={option}
                                        onClick={() => updateField("vehicleType", option)}
                                        className={`btn-select-premium ${formData.vehicleType === option ? "active" : ""}`}
                                      >
                                        {option}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <label className="label-premium">Logistical Age</label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {["0-2 years", "3-5 years", "6-10 years", "10+ years"].map((option) => (
                                      <button
                                        key={option}
                                        onClick={() => updateField("vehicleAge", option)}
                                        className={`btn-select-premium py-3 ${formData.vehicleAge === option ? "active" : ""}`}
                                      >
                                        {option}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <label className="label-premium">Annual Utilization (km)</label>
                                  <div className="flex flex-wrap gap-3">
                                    {["< 5k", "5k-10k", "10k-20k", "20k+"].map((option) => (
                                      <button
                                        key={option}
                                        onClick={() => updateField("annualMileage", option)}
                                        className={`btn-select-premium flex-1 ${formData.annualMileage === option ? "active" : ""}`}
                                      >
                                        {option}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Step 5: Employment */}
                      {currentStep === 4 && (
                        <div className="space-y-8">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                              <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider text-glow">Socio-Economic Parameters</h2>
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Professional Status</label>
                            <div className="flex flex-wrap gap-2">
                              {["Full-time", "Self-employed", "Retired", "Student", "Unemployed"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("employmentStatus", option)}
                                  className={`btn-select-premium flex-1 min-w-[120px] ${formData.employmentStatus === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="label-premium">Specialization / Occupation</label>
                            <input
                              type="text"
                              value={formData.occupation}
                              onChange={(e) => updateField("occupation", e.target.value)}
                              className="input-premium"
                              placeholder="e.g. Bio-Medical Researcher"
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="label-premium">Annual Revenue Range</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {["Under 5L", "5L-10L", "10L-20L", "20L-50L", "50L+"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("annualIncome", option)}
                                  className={`btn-select-premium py-3 ${formData.annualIncome === option ? "active" : ""}`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-4">
                            <label className="label-premium">Sector Risk Coefficient</label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: "low", label: "Low", desc: "Stable Env" },
                                { value: "medium", label: "Med", desc: "Dynamic Env" },
                                { value: "high", label: "High", desc: "Extreme Env" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => updateField("industryRisk", option.value)}
                                  className={`p-4 rounded-xl text-center border transition-all duration-300 ${formData.industryRisk === option.value
                                    ? "bg-primary/20 border-primary"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                                >
                                  <div className={`font-bold uppercase tracking-widest text-[10px] mb-1 ${formData.industryRisk === option.value ? "text-primary" : "text-muted-foreground"}`}>
                                    {option.label}
                                  </div>
                                  <div className="text-[10px] text-foreground/60 leading-tight">{option.desc}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                    <Button
                      variant="heroOutline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="gap-2 px-6"
                      size="lg"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <Button
                      variant="hero"
                      onClick={nextStep}
                      className="gap-2 px-10"
                      size="lg"
                    >
                      {currentStep === steps.length - 1 ? "Initialize Synthesis" : "Process Next Node"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar Steps */}
              <aside className="hidden lg:block space-y-4">
                <div className="sticky top-32">
                  <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-6 px-4">Neural Nodes</h3>
                  <div className="space-y-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => {
                          setDirection(index > currentStep ? 1 : -1);
                          setCurrentStep(index);
                        }}
                        className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border ${index === currentStep
                          ? "bg-primary/10 border-primary/30 shadow-glow-accent"
                          : index < currentStep
                            ? "bg-white/5 border-success/20 opacity-80"
                            : "bg-transparent border-transparent opacity-40 hover:opacity-60"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${index === currentStep
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : index < currentStep
                            ? "bg-success/20 text-success"
                            : "bg-white/5 text-muted-foreground"
                          }`}>
                          {index < currentStep ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <step.icon className="w-5 h-5 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className={`text-[10px] uppercase tracking-widest font-bold ${index === currentStep ? "text-primary" : "text-muted-foreground"}`}>Node 0{index + 1}</p>
                          <p className={`text-sm font-semibold transition-colors ${index === currentStep ? "text-white" : "text-muted-foreground"}`}>{step.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Summary Card */}
                  <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Synthesis Engine Active</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      We're building your personalised coverage profile as you fill in each section.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfile;
