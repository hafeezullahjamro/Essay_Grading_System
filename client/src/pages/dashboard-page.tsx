import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import CreditDisplay from "@/components/dashboard/credit-display";
import PurchaseOptions from "@/components/dashboard/purchase-options";
import PurchaseHistory from "@/components/dashboard/purchase-history";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch user's purchase history
  const { data: purchases } = useQuery({
    queryKey: ["/api/purchases"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activePage="dashboard" />

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Credit Overview */}
                <div className="py-4">
                  <CreditDisplay user={user} />
                </div>

                {/* Purchase Credits Section */}
                <div className="py-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Purchase Credits</h2>
                  <PurchaseOptions />
                </div>

                {/* Purchase History */}
                <div className="py-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Purchase History</h2>
                  <PurchaseHistory purchases={purchases || []} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
