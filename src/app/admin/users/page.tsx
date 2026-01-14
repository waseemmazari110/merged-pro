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
import { Search, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  planId: string | null;
  paymentStatus: string | null;
  createdAt: string;
  propertyCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (paymentFilter !== "all") params.append("paymentStatus", paymentFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, paymentFilter]);

  const handleSearch = () => {
    fetchUsers();
  };

  const handleActivate = async (userId: string, planId: string) => {
    try {
      const response = await fetch("/api/admin/users/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId }),
      });

      if (response.ok) {
        toast.success("User activated successfully");
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to activate user");
      }
    } catch (error) {
      toast.error("Error activating user");
    }
  };

  const getPaymentBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-amber-100 text-amber-800",
      past_due: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status || "pending"] || styles.pending
        }`}
      >
        {(status || "pending").charAt(0).toUpperCase() + (status || "pending").slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800",
      owner: "bg-blue-100 text-blue-800",
      guest: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[role] || styles.guest
        }`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Users Management
          </h1>
          <p className="text-gray-600">
            Manage users, view payment status, and override activations
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} variant="default">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{user.id}</div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {user.planId ? user.planId.charAt(0).toUpperCase() + user.planId.slice(1) : "None"}
                      </span>
                    </TableCell>
                    <TableCell>{getPaymentBadge(user.paymentStatus)}</TableCell>
                    <TableCell>{user.propertyCount}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {user.paymentStatus !== "active" && user.planId && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivate(user.id, user.planId!)}
                            title="Manually activate subscription"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
