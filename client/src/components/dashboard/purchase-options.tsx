import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type Bundle = {
  id: number;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  isPopular: boolean;
  isSubscription: boolean;
};

export default function PurchaseOptions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [processingBundle, setProcessingBundle] = useState<number | null>(null);
  
  // Credit bundles
  const bundles: Bundle[] = [
    {
      id: 1,
      name: "Single Essay",
      price: 1.50,
      credits: 1,
      bonusCredits: 0,
      isPopular: false,
      isSubscription: false
    },
    {
      id: 2,
      name: "5 Essay Pack",
      price: 5.00,
      credits: 5,
      bonusCredits: 1,
      isPopular: true,
      isSubscription: false
    },
    {
      id: 3,
      name: "10 Essay Pack",
      price: 8.50,
      credits: 10,
      bonusCredits: 2,
      isPopular: false,
      isSubscription: false
    },
    {
      id: 4,
      name: "Unlimited Monthly",
      price: 15.00,
      credits: 0,
      bonusCredits: 0,
      isPopular: false,
      isSubscription: true
    }
  ];
  
  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (bundleId: number) => {
      setProcessingBundle(bundleId);
      const res = await apiRequest("POST", "/api/purchase", { bundleId });
      return await res.json();
    },
    onSuccess: (data) => {
      // Refresh user data to update credits
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Show success toast
      toast({
        title: "Purchase successful",
        description: "Your credits have been updated",
      });
      
      setProcessingBundle(null);
    },
    onError: (error) => {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
      setProcessingBundle(null);
    }
  });
  
  // Handle purchase
  const handlePurchase = (bundleId: number) => {
    purchaseMutation.mutate(bundleId);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {bundles.map((bundle) => (
        <motion.div
          key={bundle.id}
          className={`bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 ${
            bundle.isPopular ? "border-2 border-primary" : ""
          }`}
          whileHover={{ translateY: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <div className={bundle.isPopular ? "flex justify-between items-center" : ""}>
              <h3 className="text-lg font-medium text-gray-900">{bundle.name}</h3>
              {bundle.isPopular && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Popular
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-2xl font-semibold text-gray-900">${bundle.price.toFixed(2)}</span>
              {!bundle.isSubscription && (
                <span className="ml-1 text-sm text-gray-500">
                  (${(bundle.price / (bundle.credits + bundle.bonusCredits)).toFixed(2)}/essay)
                </span>
              )}
              {bundle.isSubscription && (
                <span className="ml-1 text-sm text-gray-500">/month</span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {bundle.isSubscription
                ? "Unlimited essays"
                : `${bundle.credits + bundle.bonusCredits} credits${
                    bundle.bonusCredits > 0 ? ` (${bundle.bonusCredits} bonus)` : ""
                  }`}
            </p>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                bundle.isPopular
                  ? "border-transparent text-white bg-primary hover:bg-primary/90"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              onClick={() => handlePurchase(bundle.id)}
              disabled={processingBundle === bundle.id}
            >
              {processingBundle === bundle.id ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className={`fas fa-shopping-cart mr-2 ${!bundle.isPopular && "text-gray-500"}`}></i>
                  Purchase
                </>
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
