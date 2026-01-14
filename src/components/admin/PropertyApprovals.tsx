/**
 * Property Approvals Component
 * 
 * Admin-only component for reviewing and approving/rejecting property submissions from owners.
 * 
 * Features:
 * - View all properties with filtering by status (pending, approved, rejected)
 * - Preview property details in a clean layout
 * - Approve or reject with single click
 * - Real-time status updates
 * - Responsive design (mobile & desktop)
 * - Role-based access control
 * 
 * @module components/admin/PropertyApprovals
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin, 
  BedDouble, 
  Bath, 
  Users,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ==================== TYPE DEFINITIONS ====================

interface Property {
  id: number;
  title: string;
  slug: string;
  location: string;
  region: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerCompany?: string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  heroImage: string;
  sleepsMin?: number;
  sleepsMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  priceFromMidweek?: number;
  priceFromWeekend?: number;
}

interface StatusCounts {
  pending: number;
  approved: number;
  rejected: number;
  all: number;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

// ==================== MAIN COMPONENT ====================

export default function PropertyApprovals() {
  // State Management
  const [properties, setProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ 
    pending: 0, 
    approved: 0, 
    rejected: 0, 
    all: 0 
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // ==================== DATA FETCHING ====================

  /**
   * Fetch properties from API based on current filter
   */
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        limit: '100'
      });

      const response = await fetch(`/api/admin/properties/pending?${params.toString()}`, {
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`PropertyApprovals: Fetched ${data.properties?.length || 0} properties with status filter: ${statusFilter}`);
        console.log('Property statuses:', data.properties?.map((p: any) => ({ id: p.id, title: p.title, status: p.status })));
        setProperties(data.properties || []);
        setStatusCounts(data.statusCounts || { pending: 0, approved: 0, rejected: 0, all: 0 });
      } else {
        console.error('Failed to fetch properties:', response.status);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filter changes
  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  // ==================== ACTIONS ====================

  /**
   * Approve a property
   * @param propertyId - ID of the property to approve
   * @param event - Click event to prevent propagation
   */
  const handleApprove = async (propertyId: number, event?: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering other buttons
    event?.stopPropagation();
    event?.preventDefault();
    
    if (!confirm('Are you sure you want to approve this property? It will become visible on the website.')) {
      return;
    }

    setActionLoading(propertyId);
    try {
      console.log('Approving property:', propertyId);
      
      const response = await fetch(`/api/admin/properties/${propertyId}/approve`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Approval response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Approval successful:', data);
        alert('✅ Property approved successfully! It is now visible on the website.');
        fetchProperties();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Approval failed:', response.status, errorData);
        
        let errorMessage = errorData.error || 'Unknown error';
        if (response.status === 401) {
          errorMessage = 'Not authenticated. Please log in again.';
          window.location.href = '/auth/admin-login';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to approve properties. Admin access required.';
        }
        
        alert(`❌ Failed to approve: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert(`❌ An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Open rejection modal
   * @param property - Property to reject
   * @param event - Click event to prevent propagation
   */
  const openRejectionModal = (property: Property, event?: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering other buttons
    event?.stopPropagation();
    event?.preventDefault();
    
    setSelectedProperty(property);
    setRejectionReason("");
    setRejectionModalOpen(true);
  };

  /**
   * Reject a property with reason
   */
  const handleReject = async () => {
    if (!selectedProperty) return;
    
    const trimmedReason = rejectionReason.trim();
    
    if (!trimmedReason) {
      alert('⚠️ Please provide a reason for rejection');
      return;
    }

    if (trimmedReason.length < 10) {
      alert('⚠️ Rejection reason must be at least 10 characters long. Please provide more details.');
      return;
    }

    if (trimmedReason.length > 500) {
      alert('⚠️ Rejection reason must not exceed 500 characters');
      return;
    }

    setActionLoading(selectedProperty.id);
    try {
      console.log('Rejecting property:', selectedProperty.id, 'with reason:', trimmedReason);
      
      const response = await fetch(`/api/admin/properties/${selectedProperty.id}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: trimmedReason }),
      });

      console.log('Rejection response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Rejection successful:', data);
        alert('✅ Property rejected successfully! The owner will be notified.');
        setRejectionModalOpen(false);
        setSelectedProperty(null);
        setRejectionReason("");
        fetchProperties();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Rejection failed:', response.status, errorData);
        
        let errorMessage = errorData.error || 'Unknown error';
        if (response.status === 401) {
          errorMessage = 'Not authenticated. Please log in again.';
          window.location.href = '/auth/admin-login';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to reject properties. Admin access required.';
        } else if (errorData.details && Array.isArray(errorData.details)) {
          errorMessage = errorData.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
        }
        
        alert(`❌ Failed to reject: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert(`❌ An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Unpublish an approved property
   * @param propertyId - ID of the property to unpublish
   * @param event - Click event to prevent propagation
   */
  const handleUnpublish = async (propertyId: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    
    if (!confirm('Are you sure you want to unpublish this property? It will be removed from the public website.')) {
      return;
    }

    setActionLoading(propertyId);
    try {
      console.log('Unpublishing property:', propertyId);
      
      const response = await fetch(`/api/admin/properties/${propertyId}/unpublish`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Unpublish response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Unpublish successful:', data);
        alert('✅ Property unpublished successfully! It has been removed from the public website.');
        fetchProperties();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Unpublish failed:', response.status, errorData);
        
        let errorMessage = errorData.error || 'Unknown error';
        if (response.status === 401) {
          errorMessage = 'Not authenticated. Please log in again.';
          window.location.href = '/auth/admin-login';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to unpublish properties. Admin access required.';
        }
        
        alert(`❌ Failed to unpublish: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Unpublish error:', error);
      alert(`❌ An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Format date to UK format
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    // Fallback to dash if the value cannot be parsed
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-black border-amber-300';
      case 'approved':
        return 'bg-green-100 text-black border-green-300';
      case 'rejected':
        return 'bg-red-100 text-black border-red-300';
      default:
        return 'bg-gray-100 text-black border-gray-300';
    }
  };

  /**
   * Filter properties by search query
   */
  const filteredProperties = properties.filter(property => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.ownerName.toLowerCase().includes(query) ||
      property.ownerEmail.toLowerCase().includes(query)
    );
  });

  // ==================== RENDER ====================

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header with Counts */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            Property Approvals
          </h2>
          <p className="text-black text-sm sm:text-base">Review and approve property listings from owners</p>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{statusCounts.pending}</div>
            <div className="text-xs sm:text-sm font-semibold text-black">Pending</div>
          </div>
          <div className="bg-emerald-100 rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{statusCounts.approved}</div>
            <div className="text-xs sm:text-sm font-semibold text-black">Approved</div>
          </div>
          <div className="bg-rose-100 rounded-xl p-4 border border-rose-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{statusCounts.rejected}</div>
            <div className="text-xs sm:text-sm font-semibold text-black">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200 border ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                  : 'bg-white text-slate-800 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 shadow-sm'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`ml-1.5 ${statusFilter === status ? 'text-blue-100' : 'text-gray-500'}`}>
                ({status === 'all' ? statusCounts.all : statusCounts[status]})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <Input
            type="text"
            placeholder="Search by property name, location, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
          <p className="text-black text-sm">Loading properties...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 sm:p-16 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Building className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                {searchQuery ? 'No matching properties' : 'No properties yet'}
              </h3>
              <p className="text-black text-sm max-w-md mx-auto mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms or select a different filter' 
                  : statusFilter === 'all' 
                    ? 'Property submissions from owners will appear here for review'
                    : `There are no ${statusFilter} properties at this time`
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            /* Properties Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onApprove={handleApprove}
                  onReject={openRejectionModal}
                  onUnpublish={handleUnpublish}
                  isLoading={actionLoading === property.id}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Rejection Modal */}
      {rejectionModalOpen && selectedProperty && (
        <RejectionModal
          property={selectedProperty}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onReject={handleReject}
          onClose={() => {
            setRejectionModalOpen(false);
            setSelectedProperty(null);
            setRejectionReason("");
          }}
          isLoading={actionLoading === selectedProperty.id}
        />
      )}
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

/**
 * Property Card Component
 * Displays individual property with all details and action buttons
 */
interface PropertyCardProps {
  property: Property;
  onApprove: (id: number, event?: React.MouseEvent) => void;
  onReject: (property: Property, event?: React.MouseEvent) => void;
  onUnpublish: (id: number, event?: React.MouseEvent) => void;
  isLoading: boolean;
  formatDate: (date: string) => string;
  getStatusBadge: (status: string) => string;
}

function PropertyCard({ 
  property, 
  onApprove, 
  onReject, 
  onUnpublish,
  isLoading, 
  formatDate, 
  getStatusBadge 
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {property.heroImage ? (
          <Image
            src={property.heroImage}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Building className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(property.status)}`}>
            {property.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1.5 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-start gap-1.5 text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span className="text-sm">{property.location}, {property.region}</span>
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-gray-50 rounded-lg">
          {property.bedrooms !== undefined && (
            <div className="flex flex-col items-center gap-1">
              <BedDouble className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">{property.bedrooms}</span>
              <span className="text-xs text-gray-500">Beds</span>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex flex-col items-center gap-1">
              <Bath className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">{property.bathrooms}</span>
              <span className="text-xs text-gray-500">Baths</span>
            </div>
          )}
          {(property.sleepsMin || property.sleepsMax) && (
            <div className="flex flex-col items-center gap-1">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">
                {property.sleepsMin === property.sleepsMax 
                  ? property.sleepsMin 
                  : `${property.sleepsMin}-${property.sleepsMax}`}
              </span>
              <span className="text-xs text-gray-500">Guests</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        {(property.priceFromMidweek || property.priceFromWeekend) && (
          <div className="py-2.5 px-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-xs font-medium text-green-700 mb-1.5">Pricing</div>
            <div className="flex gap-3">
              {property.priceFromMidweek && (
                <div className="flex-1">
                  <div className="text-lg font-bold text-green-700">£{property.priceFromMidweek}</div>
                  <div className="text-xs text-green-600">Midweek</div>
                </div>
              )}
              {property.priceFromWeekend && (
                <div className="flex-1">
                  <div className="text-lg font-bold text-green-700">£{property.priceFromWeekend}</div>
                  <div className="text-xs text-green-600">Weekend</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Owner Information */}
        <div className="py-2.5 px-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="text-xs font-medium text-purple-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Owner Details
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900">{property.ownerName}</div>
            <div className="text-xs text-gray-600 truncate">{property.ownerEmail}</div>
            {property.ownerCompany && (
              <div className="text-xs text-purple-600 font-medium">{property.ownerCompany}</div>
            )}
          </div>
        </div>

        {/* Submission Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Submitted {formatDate(property.createdAt)}</span>
        </div>

        {/* Rejection Reason (if rejected) */}
        {property.status === 'rejected' && property.rejectionReason && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-red-900 mb-1">Rejection Reason</div>
                <div className="text-xs text-red-700 leading-relaxed">{property.rejectionReason}</div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Info (if approved) */}
        {property.status === 'approved' && property.approvedAt && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="text-xs text-green-700 font-medium">
                Approved on {formatDate(property.approvedAt)}
                {property.approvedBy && ` by ${property.approvedBy}`}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {property.status === 'pending' && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onApprove(property.id, e);
                }}
                disabled={isLoading}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onReject(property, e);
                }}
                disabled={isLoading}
                size="sm"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </>
                )}
              </Button>
            </>
          )}
          
          {property.status === 'approved' && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onUnpublish(property.id, e);
              }}
              disabled={isLoading}
              size="sm"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Unpublish
                </>
              )}
            </Button>
          )}
          
          <Link href={`/properties/${property.slug}`} target="_blank" className={property.status === 'pending' ? 'w-full mt-2' : 'w-full'}>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Preview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Rejection Modal Component
 * Modal for entering rejection reason
 */
interface RejectionModalProps {
  property: Property;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  onReject: () => void;
  onClose: () => void;
  isLoading: boolean;
}

function RejectionModal({
  property,
  rejectionReason,
  setRejectionReason,
  onReject,
  onClose,
  isLoading
}: RejectionModalProps) {
  const isValid = rejectionReason.trim().length >= 10 && rejectionReason.trim().length <= 500;
  const charCount = rejectionReason.length;
  const minChars = 10;
  const maxChars = 500;
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border-2 border-red-300 animate-scaleIn">
        {/* Header */}
        <div className="bg-red-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl">
              <XCircle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Reject Property</h3>
              <p className="text-red-100 text-sm mt-1">Provide detailed feedback to the property owner</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Property Info */}
          <div className="p-5 bg-red-50 rounded-xl border-2 border-red-200">
            <p className="text-red-700 text-sm font-semibold mb-2">🏠 Property to reject:</p>
            <p className="text-xl font-bold text-gray-900">{property.title}</p>
            <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              {property.location}, {property.region}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Owner: {property.ownerName} ({property.ownerEmail})
            </p>
          </div>

          {/* Rejection Reason Input */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Rejection Reason <span className="text-red-600">* (Required)</span>
            </label>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-900 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Important: Minimum 10 characters required
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Be specific and constructive. This will help the owner improve their listing.
              </p>
            </div>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Example: The property images are not clear enough. Please upload high-quality photos showing the main rooms, exterior, and amenities. Also, the pricing information needs to be updated with the correct weekend rates."
              rows={6}
              className={`resize-none border-2 rounded-xl text-base focus:ring-4 ${
                charCount === 0 
                  ? 'border-gray-300 focus:border-blue-400 focus:ring-blue-100' 
                  : charCount < minChars
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                  : charCount > maxChars
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50'
                  : 'border-green-400 focus:border-green-500 focus:ring-green-100 bg-green-50'
              }`}
            />
            <div className="flex items-center justify-between mt-2">
              <p className={`text-sm font-semibold ${
                charCount === 0 
                  ? 'text-gray-500' 
                  : charCount < minChars
                  ? 'text-red-600'
                  : charCount > maxChars
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                {charCount} / {maxChars} characters
                {charCount > 0 && charCount < minChars && (
                  <span className="ml-2 text-red-600">({minChars - charCount} more needed)</span>
                )}
                {charCount > maxChars && (
                  <span className="ml-2 text-red-600">({charCount - maxChars} over limit)</span>
                )}
                {isValid && <span className="ml-2 text-green-600">✓ Valid</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t-2 border-gray-200">
          <div className="flex gap-3">
            <Button
              onClick={onReject}
              disabled={isLoading || !isValid}
              className={`flex-1 font-bold text-lg py-3 rounded-xl shadow-lg transition-all duration-200 cursor-pointer ${
                isValid
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-700 text-white transform hover:scale-105 shadow-red-300'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Confirm Rejection
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-2 border-gray-400 hover:bg-gray-100 font-semibold text-lg py-3 rounded-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
