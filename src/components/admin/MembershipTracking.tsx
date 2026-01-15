"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  CreditCard,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDatabaseDateToUK } from "@/lib/date-utils";
import { toast } from "sonner";

interface MembershipData {
  id: string;
  name: string;
  email: string;
  planName: string;
  status: string;
  amount: number;
  currency: string;
  signupDate: string;
  currentPeriodEnd: string;
  paymentStatus: string;
}

interface MembershipSummary {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  newThisMonth: number;
}

export default function MembershipTracking() {
  const [members, setMembers] = useState<MembershipData[]>([]);
  const [summary, setSummary] = useState<MembershipSummary>({
    totalMembers: 0,
    activeMembers: 0,
    totalRevenue: 0,
    newThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/memberships");
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setSummary(data.summary || {
          totalMembers: 0,
          activeMembers: 0,
          totalRevenue: 0,
          newThisMonth: 0,
        });
      }
    } catch (error) {
      console.error("Failed to load membership data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMembership = async (memberId: string, memberName: string, memberEmail: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to cancel this membership?\n\nUser: ${memberName} (${memberEmail})\n\nThis will remove their subscription but keep their account.`
    );

    if (!confirmDelete) return;

    setDeletingMemberId(memberId);
    try {
      const response = await fetch("/api/admin/memberships/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: memberId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Membership for ${memberName} has been cancelled`);
        loadMembershipData();
      } else {
        toast.error(data.error || "Failed to delete membership");
      }
    } catch (error) {
      toast.error("Error deleting membership");
    } finally {
      setDeletingMemberId(null);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; icon: any; label: string }> = {
      active: {
        variant: "default",
        icon: CheckCircle,
        label: "Active",
      },
      past_due: {
        variant: "destructive",
        icon: XCircle,
        label: "Past Due",
      },
      cancelled: {
        variant: "secondary",
        icon: XCircle,
        label: "Cancelled",
      },
      trialing: {
        variant: "default",
        icon: Clock,
        label: "Trial",
      },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      icon: Clock,
      label: status,
    };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Plan", "Status", "Amount", "Signup Date", "Next Billing"];
    const rows = filteredMembers.map((m) => [
      m.name,
      m.email,
      m.planName,
      m.status,
      `${m.currency} ${m.amount.toFixed(2)}`,
      m.signupDate,
      m.currentPeriodEnd,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memberships-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-3xl font-bold">{summary.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Members</p>
              <p className="text-3xl font-bold text-green-600">{summary.activeMembers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">£{summary.totalRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">New This Month</p>
              <p className="text-3xl font-bold text-purple-600">{summary.newThisMonth}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trialing">Trial</option>
              <option value="past_due">Past Due</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button variant="outline" size="sm" onClick={loadMembershipData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || filterStatus !== "all"
                      ? "No members match your filters"
                      : "No members yet"}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.planName}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.currency} {member.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{formatDatabaseDateToUK(member.signupDate)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDatabaseDateToUK(member.currentPeriodEnd)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.paymentStatus === "succeeded" ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Paid
                        </Badge>
                      ) : member.paymentStatus === "pending" ? (
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleDeleteMembership(member.id, member.name, member.email)
                        }
                        disabled={deletingMemberId === member.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingMemberId === member.id ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredMembers.length} of {members.length} members
      </div>
    </div>
  );
}
