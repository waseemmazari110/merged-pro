export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Loading Admin Dashboard</h2>
        <p className="text-gray-400">Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  );
}
