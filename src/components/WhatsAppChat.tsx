"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant";
  content: string;
};

/**
 * WhatsApp Logo - Official SVG
 * Using WhatsApp brand green: #25D366
 */
const WhatsAppLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
      {
        role: "assistant",
        content: "Hi! 👋 I'm here to help you find the perfect group escape house. Ask me about properties, experiences, pricing, or anything else!",
      },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    // WhatsApp Business Number - UPDATE THIS WITH YOUR ACTUAL NUMBER
    // Format: country code + number (no spaces, dashes, or plus sign)
    // Example: "447123456789" for UK number
    const WHATSAPP_NUMBER = "447454253313"; // Group Escape Houses WhatsApp number
    const WHATSAPP_MESSAGE = "Hi! I'm interested in learning more about your group escape houses.";
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    const handleSend = async () => {
      if (!input.trim() || isLoading) return;
  
      const userMessage = input.trim();
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
      setIsLoading(true);
  
      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage, history: messages }),
        });
  
        const data = await response.json();
  
        if (data.reply) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Sorry, I'm having trouble right now. Please email hello@groupescapehouses.co.uk or call us!" },
          ]);
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or email hello@groupescapehouses.co.uk!" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

  const handleRealWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #89A38F 0%, #E5D8C5 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[var(--color-accent-sage)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">AI Assistant</h3>
                <p className="text-xs text-[var(--color-neutral-dark)]">Ask us anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-bg-primary)]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-[var(--color-accent-sage)] text-white"
                      : "bg-white text-[var(--color-text-primary)] shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--color-accent-sage)]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-sage)] text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-xl px-4"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-[var(--color-neutral-dark)] mt-2 text-center">
              Or email us at hello@groupescapehouses.co.uk
            </p>
          </div>
        </div>
      )}

      {/* Floating Buttons Container - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Real WhatsApp Button - Top */}
        <button
          onClick={handleRealWhatsApp}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          style={{
            background: "#25D366",
          }}
          aria-label="Message us on WhatsApp"
        >
          <WhatsAppLogo className="w-9 h-9 text-white" />

          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#25D366]" />

          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-4 py-2 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              Message on WhatsApp
            </p>
            <p className="text-xs text-[var(--color-neutral-dark)]">
              Chat with our team directly
            </p>
            <div
              className="absolute top-1/2 -right-2 w-0 h-0 -translate-y-1/2"
              style={{
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "8px solid white",
              }}
            />
          </div>
        </button>

        {/* AI Chatbot Button - Bottom */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #89A38F 0%, #C6A76D 100%)",
          }}
          aria-label="Chat with AI assistant"
        >
          {isOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <MessageCircle className="w-9 h-9 text-white" />
          )}

          {/* Pulse animation */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[var(--color-accent-sage)]" />
          )}

          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute right-full mr-4 px-4 py-2 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                Chat with AI Assistant
              </p>
              <p className="text-xs text-[var(--color-neutral-dark)]">
                Get instant answers 24/7
              </p>
              <div
                className="absolute top-1/2 -right-2 w-0 h-0 -translate-y-1/2"
                style={{
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "8px solid white",
                }}
              />
            </div>
          )}
        </button>
      </div>
    </>
  );
}