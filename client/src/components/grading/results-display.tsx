import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GradingResult } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { TrendingUp, Award, Target, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import ExportOptions from "@/components/export/export-options";

type ResultsDisplayProps = {
  results: GradingResult;
  gradingId?: number;
};

// IB Grade boundaries for standardized assessment
const ibGradeBoundaries = {
  7: { min: 80, max: 100, label: "Excellent", color: "bg-green-600" },
  6: { min: 70, max: 79, label: "Very Good", color: "bg-green-500" },
  5: { min: 60, max: 69, label: "Good", color: "bg-blue-500" },
  4: { min: 50, max: 59, label: "Satisfactory", color: "bg-yellow-500" },
  3: { min: 40, max: 49, label: "Mediocre", color: "bg-orange-500" },
  2: { min: 30, max: 39, label: "Poor", color: "bg-red-400" },
  1: { min: 0, max: 29, label: "Very Poor", color: "bg-red-600" }
};

function getIBGrade(score: number) {
  // Convert 0-10 scale to 0-100 percentage
  const percentage = (score / 10) * 100;
  for (const [grade, boundary] of Object.entries(ibGradeBoundaries)) {
    if (percentage >= boundary.min && percentage <= boundary.max) {
      return { grade: parseInt(grade), ...boundary, percentage };
    }
  }
  return { grade: 1, ...ibGradeBoundaries[1], percentage };
}

export default function ResultsDisplay({ results, gradingId }: ResultsDisplayProps) {
  const { scores, overallScore, feedback, recommendations } = results;
  const overallGrade = getIBGrade(overallScore);

  // Prepare data for charts
  const criteriaData = Object.entries(scores).map(([criterion, score]) => ({
    criterion: criterion.replace(/([A-Z])/g, ' $1').trim(),
    score: score,
    percentage: (score / 10) * 100,
    grade: getIBGrade(score).grade
  }));

  const radarData = criteriaData.map(item => ({
    subject: item.criterion.length > 15 ? item.criterion.substring(0, 15) + '...' : item.criterion,
    score: item.percentage,
    fullMark: 100
  }));

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

      {/* Export Options Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6"
      >
        <ExportOptions gradingId={gradingId} gradingCount={1} />
      </motion.div>
    </motion.div>
  );
}
