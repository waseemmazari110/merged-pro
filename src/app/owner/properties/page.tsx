"use client";

import { OwnerPropertySubmissions } from "@/components/OwnerPropertySubmissions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OwnerPropertiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
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
          {/* Page Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Property Submissions
              </h1>
              <p className="text-gray-600 text-lg">
                Monitor your listings and track their approval status
              </p>
            </div>
            <Link href="/submit-property">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-6 py-3 h-auto">
                <Plus className="w-5 h-5" />
                Submit New Property
              </Button>
            </Link>
          </div>

          {/* Main Content Component */}
          <OwnerPropertySubmissions />
        </div>
      </main>
      <Footer />
    </>
  );
}
