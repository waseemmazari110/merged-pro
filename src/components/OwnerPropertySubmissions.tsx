"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Home,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  location: string;
  region?: string;
  heroImage?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  sleepsMin?: number;
  sleepsMax?: number;
  status?: 'pending' | 'approved' | 'rejected';
  isPublished?: boolean;
  createdAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

interface StatusCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

const formatUKDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export function OwnerPropertySubmissions() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ all: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/owner/properties', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const props = data.properties || [];
        setProperties(props);

        // Calculate counts
        setStatusCounts({
          all: props.length,
          pending: props.filter((p: Property) => p.status === 'pending').length,
          approved: props.filter((p: Property) => p.status === 'approved').length,
          rejected: props.filter((p: Property) => p.status === 'rejected').length,
        });

        // Apply filter
        if (statusFilter === 'all') {
          setFilteredProperties(props);
        } else {
          setFilteredProperties(props.filter((p: Property) => p.status === statusFilter));
        }
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle filter change
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter((p) => p.status === statusFilter));
    }
  }, [statusFilter, properties]);

  // Handle delete
  const handleDelete = async (propertyId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(propertyId);
      const response = await fetch(`/api/owner/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        setProperties(prev => prev.filter(p => p.id !== propertyId));
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-xs font-semibold">
            <Clock className="w-4 h-4" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 text-xs font-semibold">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getPublishBadge = (isPublished?: boolean) => {
    if (!isPublished) return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300 text-xs font-semibold">
        <Eye className="w-4 h-4" />
        Published
      </span>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Property Submissions</h2>
            <p className="text-gray-600">Track your submitted properties and their approval status</p>
          </div>
          <button
            onClick={fetchProperties}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              statusFilter === 'all'
                ? 'bg-white shadow-md border-2 border-purple-600'
                : 'bg-white/50 border border-gray-200 hover:bg-white'
            }`}
          >
            <p className="text-xs font-semibold text-gray-600 mb-1">All</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          </div>
          <div
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              statusFilter === 'pending'
                ? 'bg-white shadow-md border-2 border-amber-600'
                : 'bg-white/50 border border-gray-200 hover:bg-white'
            }`}
          >
            <p className="text-xs font-semibold text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{statusCounts.pending}</p>
          </div>
          <div
            onClick={() => setStatusFilter('approved')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              statusFilter === 'approved'
                ? 'bg-white shadow-md border-2 border-emerald-600'
                : 'bg-white/50 border border-gray-200 hover:bg-white'
            }`}
          >
            <p className="text-xs font-semibold text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-emerald-600">{statusCounts.approved}</p>
          </div>
          <div
            onClick={() => setStatusFilter('rejected')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              statusFilter === 'rejected'
                ? 'bg-white shadow-md border-2 border-rose-600'
                : 'bg-white/50 border border-gray-200 hover:bg-white'
            }`}
          >
            <p className="text-xs font-semibold text-gray-600 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-rose-600">{statusCounts.rejected}</p>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <div className="inline-block mb-4">
            <RefreshCw className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-1">
            {statusFilter === 'all' ? 'No properties submitted yet' : `No ${statusFilter} properties`}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {statusFilter === 'all' 
              ? 'Submit your first property to get started'
              : 'Try changing the filter to see other properties'
            }
          </p>
          <Link href="/submit-property">
            <button className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium">
              Submit Property
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {/* Card Content - Responsive Layout */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                {/* Image Section */}
                <div className="relative w-full sm:w-48 h-48 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {property.heroImage ? (
                    <Image
                      src={property.heroImage}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <Home className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col">
                  {/* Title and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{property.title}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </p>
                      {property.region && (
                        <p className="text-xs text-gray-500 mt-1">{property.region}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(property.status)}
                      {getPublishBadge(property.isPublished)}
                    </div>
                  </div>

                  {/* Property Details - Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 flex-shrink-0" />
                        {property.bedrooms} bed
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 flex-shrink-0" />
                        {property.bathrooms} bath
                      </span>
                    )}
                    {property.sleepsMax && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        Sleeps {property.sleepsMax}
                      </span>
                    )}
                    <span className="text-xs col-span-2 sm:col-span-1">
                      Submitted: {formatUKDate(property.createdAt)}
                    </span>
                  </div>

                  {/* Rejection Reason - if rejected */}
                  {property.status === 'rejected' && property.rejectionReason && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                      <div className="flex gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-rose-900 mb-1">Reason for Rejection:</p>
                          <p className="text-sm text-rose-800 line-clamp-2">{property.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approval Date - if approved */}
                  {property.status === 'approved' && property.approvedAt && (
                    <p className="text-xs text-emerald-700 mb-3">
                      ✓ Approved on {formatUKDate(property.approvedAt)}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {property.status === 'rejected' && (
                      <Link href={`/submit-property?edit=${property.id}`} className="flex-1 sm:flex-initial">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Resubmit</span>
                          <span className="sm:hidden">Edit</span>
                        </Button>
                      </Link>
                    )}

                    {property.status === 'approved' && (
                      <Link href={`/properties/${property.title?.toLowerCase().replace(/\s+/g, '-')}?id=${property.id}`} target="_blank" className="flex-1 sm:flex-initial">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          <span className="hidden sm:inline">View Listing</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </Link>
                    )}

                    <button
                      onClick={() => handleDelete(property.id, property.title)}
                      disabled={deleting === property.id}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Expand Button for Mobile */}
                <button
                  onClick={() => setExpandedId(expandedId === property.id ? null : property.id)}
                  className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-all self-start"
                >
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedId === property.id ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expanded Details - Mobile */}
              {expandedId === property.id && property.description && (
                <div className="sm:hidden border-t border-gray-200 p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">{property.description.substring(0, 150)}...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
