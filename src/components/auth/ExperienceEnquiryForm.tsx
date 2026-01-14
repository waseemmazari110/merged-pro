"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export function ExperienceEnquiryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experience",
          subject: `${category}: ${subject}`,
          message,
          recipientEmail: "info@groupescapehouses.co.uk", // Site admin
        }),
      });

      if (res.ok) {
        toast.success("Enquiry sent successfully!");
        setSubject("");
        setCategory("");
        setMessage("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send enquiry");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-[var(--color-accent-sage)]" />
        <h3 className="text-xl font-bold text-gray-900">Contact us about experiences</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger id="category" className="rounded-xl border-gray-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Experiences">Experiences</SelectItem>
                <SelectItem value="Corporate Stays">Corporate Stays</SelectItem>
                <SelectItem value="Event Accommodation">Event Accommodation</SelectItem>
                <SelectItem value="General Question">General Question</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="What is this about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="rounded-xl border-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            placeholder="Tell us more about what you're looking for..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="rounded-xl border-gray-300 min-h-[120px]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full py-6 text-lg font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Send Enquiry"}
        </Button>
      </form>
    </div>
  );
}
