"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building, Plus, Edit2, CheckCircle, Clock, XCircle, AlertCircle, Trash2, Calendar, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// Purple button styles (matching dashboard)
const purpleButtonClass = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl";
const purpleButtonSoftClass = "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200";

interface Property {
  id: number;
  title: string;
  location: string;
  sleepsMax: number;
  bedrooms: number;
  priceFromWeekend: number;
  isPublished: boolean;
  heroImage: string;
  status?: string; // 'pending', 'approved', 'rejected'
  rejectionReason?: string;
  statusInfo?: {
    status: string;
    approvedAt?: string;
    rejectionReason?: string;
  };
}

export default function OwnerPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/owner/properties', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handle delete property
  const handleDelete = async (propertyId: number) => {
    setDeletingId(propertyId);
    try {
      const res = await fetch(`/api/owner/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove property from local state
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        setShowDeleteConfirm(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter properties by status
  const filteredProperties = statusFilter === 'all' 
    ? properties 
    : properties.filter(p => {
        const status = p.statusInfo?.status || p.status || 'pending';
        return status === statusFilter;
      });

  // Count by status
  const statusCounts = properties.reduce((acc, p) => {
    const status = p.statusInfo?.status || p.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/owner/dashboard")}
                className="mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Building className="w-8 h-8 text-purple-600" />
                  Manage Properties
                </h1>
                <p className="text-sm text-gray-600 mt-1">View, edit, and manage all your listings</p>
              </div>
            </div>
            <Link href="/owner/properties/new">
              <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${purpleButtonClass}`}>
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Property</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All Properties
            <span className="ml-2 text-xs text-gray-500">({properties.length})</span>
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Approved
            <span className="ml-1 text-xs text-gray-500">({statusCounts.approved || 0})</span>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-yellow-400 text-yellow-900'
                : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending
            <span className="ml-1 text-xs text-gray-500">({statusCounts.pending || 0})</span>
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Rejected
            <span className="ml-1 text-xs text-gray-500">({statusCounts.rejected || 0})</span>
          </button>
        </div>

        {filteredProperties.length === 0 && properties.length > 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-gray-200">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No {statusFilter} properties</h2>
            <p className="text-gray-600 mb-6">Try selecting a different filter</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-gray-200">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h2>
            <p className="text-gray-600 mb-6">Get started by adding your first property</p>
            <Link href="/owner/properties/new">
              <button className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${purpleButtonClass}`}>
                <Plus className="w-5 h-5" />
                Add Your First Property
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Property Card */}
            <Link href="/owner/properties/new">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center cursor-pointer hover:shadow-2xl transition-all border-2 border-purple-400 hover:scale-105">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Add New Property</h3>
                    <p className="text-purple-100">Click here to create a new property listing</p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const status = property.statusInfo?.status || property.status || 'pending';
              const isApproved = status === 'approved';
              const isPending = status === 'pending';
              const isRejected = status === 'rejected';
              
              return (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {property.heroImage && (
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={property.heroImage}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {/* Approval Status Badge */}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                          isApproved
                            ? 'bg-green-500 text-white'
                            : isPending
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {isApproved && '✓ Approved'}
                        {isPending && '⏱ Pending'}
                        {isRejected && '✗ Rejected'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{property.location}</p>

                  {/* Status Message */}
                  {isPending && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-800">
                        ⏱ Awaiting admin approval. Your listing will be visible once approved.
                      </p>
                    </div>
                  )}
                  {isRejected && property.statusInfo?.rejectionReason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-xs text-red-700">{property.statusInfo.rejectionReason}</p>
                    </div>
                  )}
                  {isApproved && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-xs text-green-800">
                        ✓ Approved & Live on the website
                      </p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>🛏️ {property.bedrooms} bed</span>
                    <span>👥 {property.sleepsMax} guests</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-purple-600">
                        £{property.priceFromWeekend}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      {/* View Button */}
                      <Link href={`/owner/properties/${property.id}/view`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="View property"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </Link>

                      {/* Edit Button */}
                      <Link href={`/owner/properties/${property.id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          title="Edit property"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Button>
                      </Link>
                      
                      {/* Availability Button */}
                      {isApproved && (
                        <Link href={`/owner/properties/${property.id}/availability`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                            title="Check availabilities"
                          >
                            <Calendar className="w-5 h-5" />
                          </Button>
                        </Link>
                      )}

                      {/* Delete Button */}
                      {showDeleteConfirm === property.id ? (
                        <div className="flex gap-2 ml-auto">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(property.id)}
                            disabled={deletingId === property.id}
                            className="text-xs px-3"
                          >
                            {deletingId === property.id ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              'Confirm'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={deletingId === property.id}
                            className="text-xs px-3"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors ml-auto"
                          onClick={() => setShowDeleteConfirm(property.id)}
                          title="Delete property"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
