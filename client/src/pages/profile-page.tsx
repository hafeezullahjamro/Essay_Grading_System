import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Password update schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Password update form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });
  
  // Purchase subscription mutation
  const purchaseSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/purchase", { bundleId: 4 });
      return await res.json();
    },
  });
  
  // Determine subscription status
  const hasSubscription = user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();
  
  // Format subscription expiration date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get subscription status text
  const getSubscriptionStatus = () => {
    if (!user) return "Loading...";
    if (hasSubscription) return "Unlimited Monthly";
    return "Pay as you go";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activePage="profile" />

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Profile Information */}
                <div className="py-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Account Information
                      </h3>
                      <div className="border-t border-gray-200 pt-4">
                        <dl>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Email address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {user?.email}
                            </dd>
                          </div>
                          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 mb-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Account type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              Standard
                            </dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md mb-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Current credits
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <i className="fas fa-coins mr-1 text-amber-500"></i>
                                {user?.credits} Credits
                              </span>
                            </dd>
                          </div>
                          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 mb-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Subscription status
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {getSubscriptionStatus()}
                            </dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md">
                            <dt className="text-sm font-medium text-gray-500">
                              Subscription expires
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {formatDate(user?.subscriptionExpiresAt)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Management */}
                <div className="py-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Manage Subscription
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        {!hasSubscription ? (
                          <p>
                            You're currently on a pay-as-you-go plan. Upgrade to a monthly subscription for unlimited essays.
                          </p>
                        ) : (
                          <p>
                            You're currently on the unlimited monthly subscription. Your subscription will renew automatically.
                          </p>
                        )}
                      </div>
                      <div className="mt-5">
                        {!hasSubscription ? (
                          <Button
                            onClick={() => purchaseSubscriptionMutation.mutate()}
                            disabled={purchaseSubscriptionMutation.isPending}
                          >
                            <i className="fas fa-arrow-circle-up mr-2"></i>
                            {purchaseSubscriptionMutation.isPending ? 'Processing...' : 'Upgrade to Unlimited'}
                          </Button>
                        ) : (
                          <Button variant="outline">
                            Manage Subscription
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Update Password */}
                <div className="py-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Update Password
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500 mb-4">
                        <p>
                          Change your password for additional security.
                        </p>
                      </div>
                      
                      {updateSuccess && (
                        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                          <AlertDescription>
                            Password updated successfully!
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Form {...passwordForm}>
                        <form 
                          onSubmit={passwordForm.handleSubmit(() => setUpdateSuccess(true))}
                          className="space-y-4"
                        >
                          <div className="sm:flex sm:items-center sm:gap-4">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button type="submit" className="mt-8">
                              Update
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
