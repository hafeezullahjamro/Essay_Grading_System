import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  History,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import ExportOptions from "@/components/export/export-options";
import { getQueryFn } from "@/lib/queryClient";

interface GradingHistoryItem {
  id: number;
  date: string;
  rubricId: number;
  scores: Record<string, number>;
  feedback: string;
  recommendations: string[];
  essayText: string;
}

export default function ExportPage() {
  const { data: gradings = [], isLoading } = useQuery<GradingHistoryItem[]>({
    queryKey: ["/api/gradings"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: rubrics = [] } = useQuery({
    queryKey: ["/api/rubrics"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const calculateOverallScore = (scores: Record<string, number>): number => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
  };

  const getRubricName = (rubricId: number): string => {
    const rubric = rubrics.find((r: any) => r.id === rubricId);
    return rubric?.name || `Rubric ${rubricId}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const totalGradings = gradings.length;
  const averageScore = totalGradings > 0 
    ? Math.round(gradings.reduce((sum, grading) => sum + calculateOverallScore(grading.scores), 0) / totalGradings)
    : 0;
  const recentGradings = gradings.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export Center</h1>
          <p className="text-muted-foreground mt-2">
            Download your grading results in multiple formats for analysis and record-keeping
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Essays</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGradings}</div>
            <p className="text-xs text-muted-foreground">
              Essays graded and available for export
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across all graded essays
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Formats</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              PDF, CSV, and JSON formats available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bulk Export */}
        <div>
          <ExportOptions gradingCount={totalGradings} />
        </div>

        {/* Recent Gradings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Gradings
            </CardTitle>
            <CardDescription>
              Your most recent essay grading results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentGradings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No grading results yet</p>
                <p className="text-sm">Grade an essay to see results here</p>
              </div>
            ) : (
              recentGradings.map((grading) => {
                const overallScore = calculateOverallScore(grading.scores);
                return (
                  <div
                    key={grading.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {getRubricName(grading.rubricId)}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={getScoreColor(overallScore)}
                        >
                          {overallScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(grading.date), "MMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {grading.essayText.length} characters • {Math.ceil(grading.essayText.length / 5)} words
                      </p>
                    </div>
                    <ExportOptions gradingId={grading.id} gradingCount={1} />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Information */}
      <Card>
        <CardHeader>
          <CardTitle>Export Information</CardTitle>
          <CardDescription>
            Understanding your export options and data formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">PDF Format</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional reports with formatted layout, complete feedback, and visual score charts. 
                Perfect for printing, sharing, or archival purposes.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs">Print-ready</Badge>
                <Badge variant="outline" className="text-xs">Complete feedback</Badge>
                <Badge variant="outline" className="text-xs">Visual charts</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">CSV Format</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Spreadsheet-compatible data export with scores, dates, and summary information. 
                Ideal for data analysis, tracking progress, and creating custom charts.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs">Excel compatible</Badge>
                <Badge variant="outline" className="text-xs">Data analysis</Badge>
                <Badge variant="outline" className="text-xs">Progress tracking</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium">JSON Format</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete machine-readable data export with all grading information, scores, 
                and metadata. Perfect for developers and advanced data processing.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs">Complete data</Badge>
                <Badge variant="outline" className="text-xs">Machine readable</Badge>
                <Badge variant="outline" className="text-xs">API format</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Export Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                All exports include timestamp and user identification for record-keeping
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Individual exports contain single grading results with complete feedback
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Bulk exports include all your grading history with summary statistics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                PDF exports are formatted for professional presentation and printing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                CSV and JSON exports preserve all numerical data for analysis
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}