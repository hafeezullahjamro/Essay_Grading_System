import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';

// TODO: Replace with your actual Stripe publishable key when deploying
// Get this from: https://dashboard.stripe.com/apikeys
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_dummy_key');

const CheckoutForm = ({ bundleId }: { bundleId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Credits have been added to your account!",
      });
      setLocation('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Details
          </h3>
          <PaymentElement />
        </div>
        
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Complete Purchase'}
        </Button>
      </form>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [bundle, setBundle] = useState<any>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Get bundle ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bundleId = urlParams.get('bundle');

  useEffect(() => {
    if (!bundleId) {
      toast({
        title: "Invalid Request",
        description: "No bundle selected",
        variant: "destructive",
      });
      setLocation('/dashboard');
      return;
    }

    // Fetch bundle details and create payment intent
    const initializePayment = async () => {
      try {
        // Get bundle details
        const bundleRes = await apiRequest("GET", `/api/bundles/${bundleId}`);
        const bundleData = await bundleRes.json();
        setBundle(bundleData);

        // Create payment intent
        const paymentRes = await apiRequest("POST", "/api/create-payment-intent", { 
          bundleId: parseInt(bundleId),
          amount: bundleData.price 
        });
        const paymentData = await paymentRes.json();
        setClientSecret(paymentData.clientSecret);
      } catch (error) {
        toast({
          title: "Payment Setup Failed",
          description: "Could not initialize payment. Please try again.",
          variant: "destructive",
        });
        setLocation('/dashboard');
      }
    };

    initializePayment();
  }, [bundleId, setLocation, toast]);

  if (!clientSecret || !bundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
            <p className="mt-2 text-gray-600">Secure payment powered by Stripe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg border h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">{bundle.name}</span>
                <span className="font-bold">${bundle.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Credits</span>
                <span>{bundle.credits} credits</span>
              </div>
              {bundle.bonusCredits > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Bonus Credits</span>
                  <span>+{bundle.bonusCredits} credits</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${bundle.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm bundleId={bundleId!} />
          </Elements>
        </div>
      </div>
    </div>
  );
}