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
      className="space-y-6"
    >
      {/* Professional Header with IB Grade */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-2xl">IB Assessment Results</CardTitle>
            <CardDescription>Standardized International Baccalaureate Grading Matrix</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold ${overallGrade.color}`}>
                  {overallGrade.grade}
                </div>
                <p className="mt-2 font-semibold">IB Grade</p>
                <p className="text-sm text-gray-600">{overallGrade.label}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{overallGrade.percentage.toFixed(1)}%</div>
                <p className="mt-2 font-semibold">Overall Score</p>
                <Progress value={overallGrade.percentage} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{criteriaData.length}</div>
                <p className="mt-2 font-semibold">Criteria Assessed</p>
                <p className="text-sm text-gray-600">IB Rubric Standards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Standardized Rubric Matrix */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>IB Standardized Rubric Assessment Matrix</CardTitle>
            <CardDescription>
              Detailed breakdown according to International Baccalaureate assessment criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left">Assessment Criterion</th>
                    <th className="border border-gray-200 px-4 py-3 text-center">Score</th>
                    <th className="border border-gray-200 px-4 py-3 text-center">IB Grade</th>
                    <th className="border border-gray-200 px-4 py-3 text-center">Performance Level</th>
                    <th className="border border-gray-200 px-4 py-3 text-center">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {criteriaData.map((item, index) => {
                    const gradeInfo = getIBGrade(item.score);
                    return (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border border-gray-200 px-4 py-3 font-medium">{item.criterion}</td>
                        <td className="border border-gray-200 px-4 py-3 text-center font-bold">{item.score}/10</td>
                        <td className="border border-gray-200 px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-center">{gradeInfo.label}</td>
                        <td className="border border-gray-200 px-4 py-3">
                          <Progress value={item.percentage} className="w-full" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Criteria Performance Analysis</CardTitle>
              <CardDescription>Bar chart showing performance across all assessment criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={criteriaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="criterion" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      formatter={(value) => [`${value}/10`, 'Score']}
                      labelFormatter={(label) => `Criterion: ${label}`}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Performance Radar Chart</CardTitle>
              <CardDescription>Comprehensive view of strengths and areas for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 8 }}
                    />
                    <Radar
                      name="Performance"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Professional Feedback Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Assessment Summary</CardTitle>
            <CardDescription>Detailed evaluation based on IB assessment standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Overall Performance Analysis</h4>
              <p className="text-blue-700 leading-relaxed">{feedback}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Strengths Identified</h4>
                <ul className="space-y-1">
                  {criteriaData
                    .filter(item => item.score >= 7)
                    .map((item, index) => (
                      <li key={index} className="text-green-700 text-sm">
                        • Strong performance in {item.criterion}
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Areas for Development</h4>
                <ul className="space-y-1">
                  {criteriaData
                    .filter(item => item.score < 7)
                    .map((item, index) => (
                      <li key={index} className="text-orange-700 text-sm">
                        • Focus needed on {item.criterion}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Targeted Recommendations */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Personalized Improvement Recommendations</CardTitle>
            <CardDescription>Specific actionable steps for academic enhancement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white text-sm font-bold rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* IB Grade Scale Reference */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>IB Grade Scale Reference</CardTitle>
            <CardDescription>International Baccalaureate standardized grading criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {Object.entries(ibGradeBoundaries).reverse().map(([grade, info]) => (
                <div key={grade} className="text-center p-3 border rounded-lg">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-bold mb-2 ${info.color}`}>
                    {grade}
                  </div>
                  <p className="text-xs font-semibold">{info.label}</p>
                  <p className="text-xs text-gray-600">{info.min}-{info.max}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Options */}
      <motion.div variants={itemVariants}>
        <ExportOptions gradingId={gradingId} gradingCount={1} />
      </motion.div>
    </motion.div>
  );
}
