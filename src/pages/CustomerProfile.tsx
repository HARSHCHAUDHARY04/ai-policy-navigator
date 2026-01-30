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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit form
      navigate("/dashboard");
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Build Your Profile</h1>
              <p className="text-muted-foreground">
                Help us understand your unique needs for personalized recommendations
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="progress-premium">
                <motion.div
                  className="progress-premium-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mb-12">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setDirection(index > currentStep ? 1 : -1);
                    setCurrentStep(index);
                  }}
                  className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                    index <= currentStep ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    index === currentStep
                      ? "bg-gradient-to-r from-primary to-accent shadow-glow"
                      : index < currentStep
                      ? "bg-success"
                      : "bg-secondary"
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden md:block">{step.title}</span>
                </button>
              ))}
            </div>

            {/* Form Card */}
            <div className="glass-card glow-border p-8 md:p-12 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Personal Info */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 text-gradient">Personal Information</h2>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                            className="input-premium"
                            placeholder="Rahul"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                            className="input-premium"
                            placeholder="Sharma"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            className="input-premium"
                            placeholder="rahul@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="input-premium"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField("dateOfBirth", e.target.value)}
                          className="input-premium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Gender</label>
                        <div className="flex flex-wrap gap-3">
                          {["Male", "Female", "Non-binary", "Prefer not to say"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("gender", option)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.gender === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-3">Marital Status</label>
                          <div className="flex flex-wrap gap-2">
                            {["Single", "Married", "Divorced", "Widowed"].map((option) => (
                              <button
                                key={option}
                                onClick={() => updateField("maritalStatus", option)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.maritalStatus === option
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-3">Dependents</label>
                          <div className="flex flex-wrap gap-2">
                            {["0", "1", "2", "3", "4+"].map((option) => (
                              <button
                                key={option}
                                onClick={() => updateField("dependents", option)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  formData.dependents === option
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                                }`}
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
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 text-gradient">Health & Lifestyle</h2>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Do you smoke?</label>
                        <div className="flex flex-wrap gap-3">
                          {["Never", "Former smoker", "Occasionally", "Regularly"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("smoker", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.smoker === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Exercise Frequency</label>
                        <div className="flex flex-wrap gap-3">
                          {["Sedentary", "1-2x/week", "3-4x/week", "Daily"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("exerciseFrequency", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.exerciseFrequency === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Pre-existing Conditions (select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["None", "Diabetes", "Heart disease", "Hypertension", "Asthma", "Cancer history", "Other"].map((option) => (
                            <button
                              key={option}
                              onClick={() => toggleArrayField("preExistingConditions", option)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.preExistingConditions.includes(option)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Health Goal Priority</label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {[
                            { value: "prevention", label: "Preventive Care", desc: "Regular checkups & screenings" },
                            { value: "coverage", label: "Maximum Coverage", desc: "Comprehensive protection" },
                            { value: "budget", label: "Budget-Friendly", desc: "Essential coverage only" },
                            { value: "family", label: "Family Focus", desc: "Coverage for all family members" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => updateField("healthGoal", option.value)}
                              className={`p-4 rounded-xl text-left transition-all ${
                                formData.healthGoal === option.value
                                  ? "bg-primary/20 border-2 border-primary"
                                  : "bg-secondary/30 border-2 border-transparent hover:bg-secondary/50"
                              }`}
                            >
                              <div className="font-medium text-foreground">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Property */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 text-gradient">Property Details</h2>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Home Ownership</label>
                        <div className="flex flex-wrap gap-3">
                          {["Own", "Rent", "Live with family", "Other"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("homeOwnership", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.homeOwnership === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Property Type</label>
                        <div className="flex flex-wrap gap-3">
                          {["Independent House", "Flat/Apartment", "Villa", "Builder Floor", "N/A"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("propertyType", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.propertyType === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Estimated Property Value</label>
                        <input
                          type="text"
                          value={formData.propertyValue}
                          onChange={(e) => updateField("propertyValue", e.target.value)}
                          className="input-premium"
                          placeholder="₹75,00,000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Security Features (select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["Alarm system", "Security cameras", "Smart locks", "Gated community", "Fire sprinklers", "None"].map((option) => (
                            <button
                              key={option}
                              onClick={() => toggleArrayField("securityFeatures", option)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.securityFeatures.includes(option)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
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
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 text-gradient">Vehicle Information</h2>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Do you own a vehicle?</label>
                        <div className="flex flex-wrap gap-3">
                          {["Yes", "No", "Multiple vehicles"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("hasVehicle", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.hasVehicle === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.hasVehicle !== "No" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Primary Vehicle Type</label>
                            <div className="flex flex-wrap gap-3">
                              {["Hatchback", "Sedan", "SUV", "MUV", "Electric", "Two-Wheeler"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("vehicleType", option)}
                                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    formData.vehicleType === option
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Vehicle Age</label>
                            <div className="flex flex-wrap gap-3">
                              {["New (0-2 years)", "Recent (3-5 years)", "Moderate (6-10 years)", "Older (10+ years)"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("vehicleAge", option)}
                                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    formData.vehicleAge === option
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Annual Running (km)</label>
                            <div className="flex flex-wrap gap-3">
                              {["Under 5,000 km", "5,000 - 10,000 km", "10,000 - 20,000 km", "20,000+ km"].map((option) => (
                                <button
                                  key={option}
                                  onClick={() => updateField("annualMileage", option)}
                                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    formData.annualMileage === option
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Step 5: Employment */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold mb-6 text-gradient">Employment Details</h2>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Employment Status</label>
                        <div className="flex flex-wrap gap-3">
                          {["Employed full-time", "Employed part-time", "Self-employed", "Retired", "Student", "Unemployed"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("employmentStatus", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.employmentStatus === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Occupation</label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => updateField("occupation", e.target.value)}
                          className="input-premium"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Annual Income Range</label>
                        <div className="flex flex-wrap gap-3">
                          {["Under ₹5L", "₹5L - ₹10L", "₹10L - ₹20L", "₹20L - ₹50L", "₹50L - ₹1Cr", "₹1Cr+"].map((option) => (
                            <button
                              key={option}
                              onClick={() => updateField("annualIncome", option)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                formData.annualIncome === option
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/50 text-foreground hover:bg-secondary"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-3">Industry Risk Level</label>
                        <div className="grid md:grid-cols-3 gap-3">
                          {[
                            { value: "low", label: "Low Risk", desc: "Office, remote work" },
                            { value: "medium", label: "Medium Risk", desc: "Travel, retail" },
                            { value: "high", label: "High Risk", desc: "Construction, healthcare" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => updateField("industryRisk", option.value)}
                              className={`p-4 rounded-xl text-center transition-all ${
                                formData.industryRisk === option.value
                                  ? "bg-primary/20 border-2 border-primary"
                                  : "bg-secondary/30 border-2 border-transparent hover:bg-secondary/50"
                              }`}
                            >
                              <div className="font-medium text-foreground">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="hero"
                  onClick={nextStep}
                  className="gap-2"
                >
                  {currentStep === steps.length - 1 ? "Analyze My Profile" : "Continue"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfile;
