"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  Trash2,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDatabaseDateToUK } from "@/lib/date-utils";

interface Property {
  id: number;
  title: string;
  slug: string;
  location: string;
  region: string;
  status: "pending" | "approved" | "rejected";
  isPublished: number;
  sleepsMax: number;
  priceFromMidweek: number;
  priceFromWeekend: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    planId: string;
    paymentStatus: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  offset: number;
  total: number;
  totalPages: number;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  // Action states
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [actioningType, setActioningType] = useState<string | null>(null);

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "20",
        page: page.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (regionFilter !== "all") {
        params.append("region", regionFilter);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/admin/properties?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      setProperties(data.properties || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, statusFilter, regionFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchProperties();
  };

  const handleApprove = async (propertyId: number, title: string) => {
    const confirm = window.confirm(
      `Approve and publish "${title}"?\n\nThis will make the property live on the site.`
    );
    if (!confirm) return;

    setActioningId(propertyId);
    setActioningType("approve");

    try {
      const response = await fetch("/api/admin/properties/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      if (response.ok) {
        toast.success(`Property "${title}" approved and published`);
        fetchProperties();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve property");
      }
    } catch (error) {
      toast.error("Error approving property");
    } finally {
      setActioningId(null);
      setActioningType(null);
    }
  };

  const handleReject = async (propertyId: number, title: string) => {
    const reason = window.prompt(
      `Why are you rejecting "${title}"?\n\nProvide a reason for the owner:`
    );
    if (reason === null) return;

    setActioningId(propertyId);
    setActioningType("reject");

    try {
      const response = await fetch("/api/admin/properties/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, reason: reason || "No reason provided" }),
      });

      if (response.ok) {
        toast.success(`Property "${title}" rejected`);
        fetchProperties();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject property");
      }
    } catch (error) {
      toast.error("Error rejecting property");
    } finally {
      setActioningId(null);
      setActioningType(null);
    }
  };

  const handleTogglePublish = async (propertyId: number, currentPublished: boolean) => {
    setActioningId(propertyId);
    setActioningType("publish");

    try {
      const response = await fetch(
        `/api/admin/properties/${propertyId}/publish`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !currentPublished }),
        }
      );

      if (response.ok) {
        toast.success(
          `Property ${!currentPublished ? "published" : "unpublished"}`
        );
        fetchProperties();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update publication status");
      }
    } catch (error) {
      toast.error("Error updating publication status");
    } finally {
      setActioningId(null);
      setActioningType(null);
    }
  };

  const handleDelete = async (propertyId: number, title: string) => {
    const confirm = window.confirm(
      `Delete "${title}"?\n\nThis action cannot be undone.`
    );
    if (!confirm) return;

    setActioningId(propertyId);
    setActioningType("delete");

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success(`Property "${title}" deleted`);
        fetchProperties();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete property");
      }
    } catch (error) {
      toast.error("Error deleting property");
    } finally {
      setActioningId(null);
      setActioningType(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || styles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPublishBadge = (isPublished: number) => {
    const published = isPublished === 1;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          published
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {published ? "Published" : "Draft"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties Management
          </h1>
          <p className="text-gray-600">
            Review, approve, and manage property listings from owners
          </p>
        </div>

        {/* Stats */}
        {pagination && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold">{pagination.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold">
                {properties.filter((p) => p.status === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold">
                {properties.filter((p) => p.status === "approved").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold">
                {properties.filter((p) => p.isPublished === 1).length}
              </p>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by title, location, or region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Region Filter */}
            <Select value={regionFilter} onValueChange={(v) => {
              setRegionFilter(v);
              setPage(1);
            }}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="South West">South West</SelectItem>
                <SelectItem value="South Coast">South Coast</SelectItem>
                <SelectItem value="Midlands">Midlands</SelectItem>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="Wales">Wales</SelectItem>
                <SelectItem value="Scotland">Scotland</SelectItem>
                <SelectItem value="Lake District">Lake District</SelectItem>
                <SelectItem value="Peak District">Peak District</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} variant="default">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            <Button onClick={fetchProperties} variant="outline">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Loading properties...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No properties found</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Publication</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price (Mid/Wknd)</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-xs text-gray-500">{property.location}</div>
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View details
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {property.owner?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.owner?.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        Plan: {property.owner?.planId || "none"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{property.region}</TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell>{getPublishBadge(property.isPublished)}</TableCell>
                    <TableCell className="text-sm">
                      {property.sleepsMax} guests
                    </TableCell>
                    <TableCell className="text-sm">
                      £{property.priceFromMidweek} / £{property.priceFromWeekend}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDatabaseDateToUK(property.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {property.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                handleApprove(property.id, property.title)
                              }
                              disabled={
                                actioningId === property.id &&
                                actioningType === "approve"
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleReject(property.id, property.title)
                              }
                              disabled={
                                actioningId === property.id &&
                                actioningType === "reject"
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {property.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleTogglePublish(
                                property.id,
                                property.isPublished === 1
                              )
                            }
                            disabled={
                              actioningId === property.id &&
                              actioningType === "publish"
                            }
                            title={
                              property.isPublished === 1
                                ? "Unpublish"
                                : "Publish"
                            }
                          >
                            {property.isPublished === 1 ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(property.id, property.title)
                          }
                          disabled={
                            actioningId === property.id &&
                            actioningType === "delete"
                          }
                          title="Delete property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {properties.length > 0 ? 1 + (page - 1) * pagination.limit : 0} to{" "}
              {Math.min(page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} properties
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, page - 3),
                    Math.min(pagination.totalPages, page + 2)
                  )
                  .map((p) => (
                    <Button
                      key={p}
                      onClick={() => setPage(p)}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                    >
                      {p}
                    </Button>
                  ))}
              </div>
              <Button
                onClick={() =>
                  setPage(Math.min(pagination.totalPages, page + 1))
                }
                disabled={page === pagination.totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
