import { Search, Send, ShieldCheck, PartyPopper } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Step {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const steps: Step[] = [
  {
    step: 1,
    icon: Search,
    title: "Find the Right Property",
    description: "Browse large group houses and cottages across the UK and choose the property that suits your group.",
    color: "#3d5a47"
  },
  {
    step: 2,
    icon: Send,
    title: "Enquire or Book Direct",
    description: "Send your enquiry or booking request directly to the property owner and discuss availability, pricing and terms.",
    color: "#3d5a47"
  },
  {
    step: 3,
    icon: ShieldCheck,
    title: "Confirm With the Owner",
    description: "Payments, deposits and booking terms are agreed and handled directly with the property owner.",
    color: "#C6A76D"
  },
  {
    step: 4,
    icon: PartyPopper,
    title: "Enjoy Your Stay",
    description: "Arrive and enjoy your group getaway, with all arrangements managed directly with the owner.",
    color: "#C6A76D"
  },
];

export const faqs: FAQ[] = [
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking 3-6 months in advance, especially for peak dates like bank holiday weekends and summer. Popular properties can book up to a year ahead for prime dates.",
  },
  {
    question: "What's included in the rental price?",
    answer: "Rental prices and inclusions are set by each individual property owner. Generally, utilities, WiFi, linen and towels are provided, but you should confirm specific details directly with the owner during the enquiry process.",
  },
  {
    question: "How do I pay for my booking?",
    answer: "All payments are made directly to the property owner. Each owner will have their own preferred payment methods and schedules, which they will discuss with you once you enquire.",
  },
  {
    question: "What happens if we damage something?",
    answer: "Most owners require a security deposit. The amount and terms for the return of this deposit are managed directly by the property owner. We recommend clarifying these terms before confirming your booking.",
  },
  {
    question: "What if someone in our group cancels?",
    answer: "Cancellation policies are set by the individual property owners. We recommend discussing this with the owner and taking out group travel insurance to cover any potential cancellations.",
  },
  {
    question: "Is there a noise curfew?",
    answer: "Most properties have quiet hours between 11pm and 8am. This means keeping music, conversation, and activities to a reasonable level out of respect for neighbours.",
  },
];
