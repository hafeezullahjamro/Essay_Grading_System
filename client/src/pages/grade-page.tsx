import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import { GradingResult } from "@shared/schema";
import EssayForm from "@/components/grading/essay-form";
import ResultsDisplay from "@/components/grading/results-display";

// Create the form schema
const formSchema = z.object({
  rubricId: z.string(),
  essayText: z.string().min(50, "Essay must be at least 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function GradePage() {
  const { user } = useAuth();
  const [gradingResults, setGradingResults] = useState<GradingResult | null>(null);
  
  // Fetch available rubrics
  const { data: rubrics, isLoading: rubricsLoading } = useQuery({
    queryKey: ["/api/rubrics"],
    queryFn: async () => {
      const res = await fetch("/api/rubrics");
      return res.json();
    },
  });
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rubricId: "1",
      essayText: "",
    },
  });
  
  // Grade essay mutation
  const gradeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        rubricId: parseInt(data.rubricId),
      };
      const res = await apiRequest("POST", "/api/grade", payload);
      return res.json();
    },
    onSuccess: (data: GradingResult) => {
      setGradingResults(data);
      window.scrollTo({ top: document.getElementById("results-section")?.offsetTop || 0, behavior: "smooth" });
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    gradeMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activePage="grade" />

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Grade Essay</h1>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Credit Information */}
                <div className="py-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Submit an essay for instant AI grading and feedback.
                  </p>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <i className="fas fa-coins mr-1 text-amber-500"></i>
                      <span>{user?.credits}</span> Credits
                    </span>
                  </div>
                </div>

                {/* Essay Submission Form */}
                <div className="py-4">
                  <EssayForm 
                    form={form} 
                    onSubmit={onSubmit} 
                    isSubmitting={gradeMutation.isPending} 
                  />
                </div>

                {/* Results (initially hidden) */}
                {gradingResults && (
                  <div id="results-section" className="py-4">
                    <ResultsDisplay results={gradingResults} />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
