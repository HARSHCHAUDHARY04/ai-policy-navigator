import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does the AI recommendation engine work?",
    answer: "Our AI analyzes several factors including your age, lifestyle, existing health conditions, and budget to match you with policies that provide the best coverage for your specific situation.",
  },
  {
    question: "Is my personal data secure?",
    answer: "Absolutely. We use industry-standard encryption and follow strict data protection protocols to ensure your information is always safe and never shared without your consent.",
  },
  {
    question: "Can I buy insurance directly from the providers?",
    answer: "Yes, our platform provides direct links to the official websites of India's top insurance providers, allowing you to complete your purchase securely and directly.",
  },
  {
    question: "Are there any hidden fees for using this platform?",
    answer: "No, AI Policy Navigator is completely free for users. Our goal is to empower you with the information you need to make the best choice.",
  },
  {
    question: "How often should I review my insurance policies?",
    answer: "We recommend reviewing your insurance needs annually or whenever you experience significant life changes, such as marriage, having a child, or buying a new home.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Clear answers to common questions about our platform and the insurance process.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-10"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b-border/30 last:border-b-0">
                <AccordionTrigger className="text-left font-semibold py-6 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
