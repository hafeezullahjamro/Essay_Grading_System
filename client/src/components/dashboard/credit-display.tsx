import { User } from "@shared/schema";
import { Card } from "@/components/ui/card";

type CreditDisplayProps = {
  user: User | null;
};

export default function CreditDisplay({ user }: CreditDisplayProps) {
  // Determine subscription status
  const hasSubscription = user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();
  
  // Format subscription date if present
  const formatSubscriptionDate = () => {
    if (!user?.subscriptionExpiresAt) return null;
    
    const expiryDate = new Date(user.subscriptionExpiresAt);
    return expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Credit Balance
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your current credits and subscription status.
          </p>
        </div>
        <div>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-blue-100 text-blue-800">
            <i className="fas fa-coins mr-2 text-amber-500"></i>
            <span>{user?.credits || 0}</span> Credits
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Account Status
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Subscription
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {hasSubscription ? (
                <div>
                  <span className="font-medium">Unlimited Monthly</span>
                  <p className="text-xs text-gray-500">Expires: {formatSubscriptionDate()}</p>
                </div>
              ) : (
                "Pay as you go"
              )}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
