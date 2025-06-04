// Test script to verify export functionality
const { generateCSVExport, generateJSONExport } = require('./server/exportUtils.ts');

// Mock grading data for testing
const mockGrading = {
  id: 1,
  date: new Date(),
  rubricId: 1,
  scores: JSON.stringify({
    "Knowledge and Understanding": 85,
    "Analysis and Line of Argument": 78,
    "Discussion and Evaluation": 82,
    "Language and Presentation": 88
  }),
  feedback: "This essay demonstrates strong analytical skills and clear understanding of the topic. The argument is well-structured with good use of evidence. Consider expanding on the counterarguments to strengthen the overall analysis.",
  recommendations: JSON.stringify([
    "Strengthen counterargument analysis",
    "Add more specific examples",
    "Improve citation format",
    "Enhance conclusion impact"
  ]),
  essayText: "This is a comprehensive essay that explores the complex relationship between technology and society. The introduction effectively establishes the central thesis that technological advancement has fundamentally transformed human interaction patterns, particularly in the digital age. The essay demonstrates a thorough understanding of the subject matter through well-researched examples and thoughtful analysis. The argument proceeds logically through several key points, examining both positive and negative implications of technological change. Evidence is drawn from credible sources and integrated effectively to support the main arguments. The discussion shows awareness of multiple perspectives on this contentious issue. However, there are areas where the analysis could be deepened, particularly in addressing potential counterarguments. The conclusion effectively summarizes the main points while suggesting broader implications for future research. Overall, this represents a solid piece of academic writing that meets most of the assessment criteria."
};

console.log('Testing CSV Export...');
try {
  const csvResult = generateCSVExport([mockGrading]);
  console.log('CSV Export Test - SUCCESS');
  console.log('CSV contains CorestoneGrader branding:', csvResult.includes('CorestoneGrader'));
  console.log('CSV header preview:');
  console.log(csvResult.split('\n').slice(0, 6).join('\n'));
} catch (error) {
  console.log('CSV Export Test - FAILED:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

console.log('Testing JSON Export...');
try {
  const jsonResult = generateJSONExport([mockGrading]);
  console.log('JSON Export Test - SUCCESS');
  console.log('JSON contains platform info:', !!jsonResult.platform);
  console.log('Platform details:', JSON.stringify(jsonResult.platform, null, 2));
  console.log('Export info:', JSON.stringify(jsonResult.export_info, null, 2));
} catch (error) {
  console.log('JSON Export Test - FAILED:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');
console.log('Export functionality test completed.');