"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, CheckCircle2, Clock } from "lucide-react";

export function EnquiryHistory() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/account/enquiries");
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <Mail className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No enquiries sent yet</h3>
        <p className="text-gray-600 mt-1">Your enquiry history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enquiries.map((enquiry) => (
        <div key={enquiry.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  enquiry.type === 'property' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {enquiry.type}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-gray-900">{enquiry.subject}</h4>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 italic">"{enquiry.message}"</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>Sent to: {enquiry.recipientEmail}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Status: {enquiry.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
