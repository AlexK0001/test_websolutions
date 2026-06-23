"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does MailCraft AI generate emails?",
    a: "MailCraft AI uses Google's Gemini AI model to generate emails based on your topic, tone, and length preferences. The AI understands context and writes natural, human-like emails tailored to your needs.",
  },
  {
    q: "How many emails can I generate for free?",
    a: "Free plan users can generate up to 10 emails per day. This resets every 24 hours. For unlimited generation, upgrade to Premium.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use JWT authentication and bcrypt password hashing. Your email topics are sent to the AI model for generation but are not stored permanently.",
  },
  {
    q: "Can I use the generated emails as-is?",
    a: "Absolutely. The emails are ready to send, though we recommend reviewing and personalizing them with specific names and details before sending.",
  },
  {
    q: "What tones are available?",
    a: "We currently support five tones: Professional, Friendly, Formal, Casual, and Persuasive. Each produces noticeably different email styles.",
  },
  {
    q: "Can I cancel my Premium plan?",
    a: "Yes, you can cancel at any time. Since Stripe integration is coming soon, reach out to support for manual cancellation in the current version.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked
            <span className="gradient-text"> Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about MailCraft AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-0">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}