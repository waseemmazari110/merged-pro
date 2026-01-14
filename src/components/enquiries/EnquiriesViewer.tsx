"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  MapPin, 
  Clock,
  Search,
  Filter,
  Eye,
  MessageSquare,
  TrendingUp,
  Home
} from "lucide-react";

interface Enquiry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  enquiryType: string;
  status: string;
  priority: string;
  propertyId?: number;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  occasion?: string;
  budget?: number;
  createdAt: string;
  respondedAt?: string;
  resolvedAt?: string;
  property?: {
    id: number;
    title: string;
    slug: string;
    location: string;
  };
}

interface EnquiriesStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  byProperty: { propertyId: string; count: number }[];
}

export function EnquiriesViewer() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<EnquiriesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, [selectedStatus, selectedProperty]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedProperty !== "all") params.set("propertyId", selectedProperty);

      const response = await fetch(`/api/owner/enquiries?${params}`);
      const data = await response.json();

      if (data.success) {
        setEnquiries(data.enquiries);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "bg-blue-100 text-blue-800 border-blue-300",
      in_progress: "bg-yellow-100 text-yellow-800 border-yellow-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
      closed: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return variants[status as keyof typeof variants] || variants.new;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: "bg-red-100 text-red-800 border-red-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      medium: "bg-blue-100 text-blue-800 border-blue-300",
      low: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = searchQuery === "" || 
      enquiry.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Enquiries</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                <p className="text-sm text-gray-500">New</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                <p className="text-sm text-gray-500">Resolved</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No enquiries found</h3>
              <p className="text-gray-500">
                {searchQuery ? "Try adjusting your search filters" : "Enquiries will appear here when guests contact you"}
              </p>
            </div>
          </Card>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <Card
              key={enquiry.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedEnquiry(enquiry)}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Left: Main Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {enquiry.firstName} {enquiry.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{enquiry.subject}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusBadge(enquiry.status)}>
                        {enquiry.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityBadge(enquiry.priority)}>
                        {enquiry.priority}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {enquiry.email}
                    </div>
                    {enquiry.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {enquiry.phone}
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  {enquiry.property && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Home className="h-4 w-4" />
                      <span>{enquiry.property.title}</span>
                      <span className="text-gray-400">•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{enquiry.property.location}</span>
                    </div>
                  )}

                  {/* Booking Details */}
                  {enquiry.checkInDate && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {enquiry.checkInDate} - {enquiry.checkOutDate}
                      </div>
                      {enquiry.numberOfGuests && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {enquiry.numberOfGuests} guests
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Preview */}
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {enquiry.message}
                  </p>
                </div>

                {/* Right: Timestamp */}
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEnquiry(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedEnquiry.firstName} {selectedEnquiry.lastName}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedEnquiry.subject}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedEnquiry.email}</p>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedEnquiry.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusBadge(selectedEnquiry.status)}>
                    {selectedEnquiry.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <Badge className={getPriorityBadge(selectedEnquiry.priority)}>
                    {selectedEnquiry.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
              </div>

              {selectedEnquiry.property && (
                <div>
                  <h3 className="font-semibold mb-2">Property</h3>
                  <p className="text-gray-700">{selectedEnquiry.property.title}</p>
                  <p className="text-sm text-gray-500">{selectedEnquiry.property.location}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Mark as Resolved</Button>
                <Button variant="outline" className="flex-1">Reply</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
