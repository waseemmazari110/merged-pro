"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[var(--color-bg-primary)] transition-colors"
          >
            <span className="font-semibold text-lg text-[var(--color-text-primary)] pr-4">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
              style={{ color: "var(--color-accent-sage)" }}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-8 pb-6 text-[var(--color-neutral-dark)] leading-relaxed">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}