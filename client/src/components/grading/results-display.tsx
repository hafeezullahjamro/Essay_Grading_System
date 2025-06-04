import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradingResult } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, Award, Target, CheckCircle, AlertCircle, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExportOptions from "@/components/export/export-options";

type ResultsDisplayProps = {
  results: GradingResult;
  gradingId?: number;
};

export default function ResultsDisplay({ results, gradingId }: ResultsDisplayProps) {
  // Format scores data for chart
  const scoreData = Object.entries(results.scores).map(([category, score]) => ({
    category: category.length > 25 ? category.substring(0, 25) + "..." : category,
    fullCategory: category,
    score,
    maxScore: 10,
    percentage: (score / 10) * 100
  }));

  // Calculate performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 9) return { level: "Excellent", color: "bg-green-500", textColor: "text-green-700" };
    if (score >= 7) return { level: "Good", color: "bg-blue-500", textColor: "text-blue-700" };
    if (score >= 5) return { level: "Satisfactory", color: "bg-yellow-500", textColor: "text-yellow-700" };
    if (score >= 3) return { level: "Basic", color: "bg-orange-500", textColor: "text-orange-700" };
    return { level: "Needs Improvement", color: "bg-red-500", textColor: "text-red-700" };
  };

  const performance = getPerformanceLevel(results.overallScore);
  
  // Colors for charts
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  // Radial chart data for overall score
  const radialData = [
    {
      name: 'Score',
      value: results.overallScore,
      fill: performance.color.replace('bg-', '#')
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="bg-white shadow overflow-hidden sm:rounded-lg">
        <CardContent className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Grading Results
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              AI-generated assessment and feedback.
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <i className="fas fa-check-circle mr-1"></i>
              Completed
            </span>
          </div>
        </CardContent>

        {/* Score Breakdown */}
        <motion.div className="border-t border-gray-200" variants={itemVariants}>
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Score Breakdown</h4>
            <div className="mb-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip formatter={(value) => [`${value}/10`, "Score"]} />
                  <Bar dataKey="score" fill="#3B82F6" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-base font-medium text-gray-900">Overall Score</div>
                <div className="text-base font-medium text-gray-900">{results.overallScore}/10</div>
              </div>
              <div className="mt-1 relative">
                <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${results.overallScore * 10}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Feedback */}
        <motion.div className="border-t border-gray-200" variants={itemVariants}>
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Detailed Feedback</h4>
            <div className="prose prose-sm max-w-none text-gray-700">
              {results.feedback.split(/\. /).map((sentence, index) => (
                <p key={index}>{sentence}.</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Improvement Suggestions */}
        <motion.div className="border-t border-gray-200" variants={itemVariants}>
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Recommendations</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.recommendations.map((recommendation, index) => (
                <motion.div 
                  key={index}
                  className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm"
                  variants={itemVariants}
                >
                  <div className="text-sm text-gray-500 mb-2">
                    {Object.keys(results.scores)[index % Object.keys(results.scores).length]}
                  </div>
                  <p className="text-sm text-gray-700">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
