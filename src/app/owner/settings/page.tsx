"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Building,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  phone?: string;
}

function SettingsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      setLoading(true);
      const session = await authClient.getSession();
      
      if (!session?.data?.user) {
        router.push('/owner/login');
        return;
      }

      const userData = {
        id: session.data.user.id,
        name: session.data.user.name || session.data.user.email.split('@')[0],
        email: session.data.user.email,
        role: (session.data.user as any).role || 'owner',
        company: (session.data.user as any).company || '',
        phone: (session.data.user as any).phone || '',
      };

      setUser(userData);
      setName(userData.name);
      setEmail(userData.email);
      setCompany(userData.company || '');
      setPhone(userData.phone || '');

    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch('/api/owner/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          company,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Reload user data
      await loadUserData();

    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#89A38F]" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Settings Card */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if you need to update it.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7XXX XXXXXX"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Company Name (Optional)
                  </label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company or business name"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {user?.role === 'owner' ? 'Property Owner' : user?.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User ID</span>
                  <span className="text-sm text-gray-900 font-mono">{user?.id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200 flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#89A38F] hover:bg-[#7a9280] text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                onClick={() => router.push('/owner/dashboard')}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>

        {/* Additional Settings */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <Link href="/owner/subscription" className="block">
              <h3 className="font-semibold text-gray-900 mb-1">Subscription</h3>
              <p className="text-sm text-gray-600">Manage your subscription plan and billing</p>
            </Link>
          </Card>
          <Card className="p-4 hover:shadow-md transition-shadow">
            <Link href="/owner/payments" className="block">
              <h3 className="font-semibold text-gray-900 mb-1">Payment History</h3>
              <p className="text-sm text-gray-600">View your payment history and invoices</p>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <SettingsContent />
    </ProtectedRoute>
  );
}
