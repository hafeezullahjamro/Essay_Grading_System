import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type ExportFormat = 'pdf' | 'csv' | 'json';

interface ExportOptionsProps {
  gradingId?: number;
  gradingCount?: number;
}

export default function ExportOptions({ gradingId, gradingCount = 0 }: ExportOptionsProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const exportMutation = useMutation({
    mutationFn: async ({ format, gradingId }: { format: ExportFormat; gradingId?: number }) => {
      const params = gradingId ? `?gradingId=${gradingId}` : '';
      const response = await apiRequest("GET", `/api/export/${format}${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      return { response, format };
    },
    onSuccess: async ({ response, format }) => {
      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename based on format
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = gradingId 
        ? `grading-${gradingId}-${timestamp}.${format}`
        : `grading-results-${timestamp}.${format}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `Your ${format.toUpperCase()} file has been downloaded.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export grading results.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsExporting(null);
    },
  });

  const handleExport = (format: ExportFormat) => {
    setIsExporting(format);
    exportMutation.mutate({ format, gradingId });
  };

  const exportOptions = [
    {
      format: 'pdf' as ExportFormat,
      title: 'PDF Report',
      description: 'Professional report with detailed feedback and scores',
      icon: FileText,
      features: ['Formatted layout', 'Complete feedback', 'Print-ready'],
      recommended: true,
    },
    {
      format: 'csv' as ExportFormat,
      title: 'CSV Data',
      description: 'Spreadsheet format for data analysis',
      icon: FileSpreadsheet,
      features: ['Scores only', 'Data analysis', 'Excel compatible'],
      recommended: false,
    },
    {
      format: 'json' as ExportFormat,
      title: 'JSON Data',
      description: 'Complete data export for developers',
      icon: File,
      features: ['Full data', 'Machine readable', 'API format'],
      recommended: false,
    },
  ];

  if (gradingCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Results
          </CardTitle>
          <CardDescription>
            No grading results available for export.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Results
        </CardTitle>
        <CardDescription>
          {gradingId 
            ? "Export this specific grading result" 
            : `Export all ${gradingCount} grading results`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isLoading = isExporting === option.format;
          
          return (
            <div
              key={option.format}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{option.title}</h4>
                    {option.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {option.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleExport(option.format)}
                disabled={isLoading || exportMutation.isPending}
                variant={option.recommended ? "default" : "outline"}
                size="sm"
                className={option.recommended ? "bg-primary hover:bg-primary/90 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg" : "border-primary text-primary hover:bg-primary/10"}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export {option.format.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h5 className="font-medium mb-2">Export Information</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• PDF exports include complete feedback and recommendations</li>
            <li>• CSV exports are ideal for creating charts and analysis</li>
            <li>• JSON exports contain all data in machine-readable format</li>
            <li>• All exports include timestamp and user information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}