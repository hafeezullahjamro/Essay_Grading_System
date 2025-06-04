import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface EssayGradingRequest {
  essayText: string;
  rubricId: number;
}

export interface EssayGradingResponse {
  scores: Record<string, number>;
  overallScore: number;
  feedback: string;
  recommendations: string[];
}

// Define rubrics for essay grading based on IB assessment criteria
export const rubrics = {
  1: {
    name: "Extended Essay",
    maxScore: 34,
    criteria: {
      "Framework for the Essay (Research Question, Methods, Structure)": "Evaluate the effectiveness of research question, research methods, and structural conventions (0-6 marks)",
      "Knowledge and Understanding": "Assess demonstration of knowledge and understanding of subject matter, terminology, and concepts (0-6 marks)", 
      "Analysis and Line of Argument": "Judge analytical approach and coherent line of argument linking research question to findings and conclusions (0-6 marks)",
      "Discussion and Evaluation": "Evaluate balanced discussion of findings and assessment of essay's strengths and limitations (0-8 marks)",
      "Reflection": "Assess evaluative reflection on learning experience and evidence of growth and transfer of learning (0-4 marks)",
      "Language and Presentation": "Evaluate clarity of expression, academic writing style, and proper citation format (0-4 marks)"
    }
  },
  2: {
    name: "TOK Essay", 
    maxScore: 10,
    criteria: {
      "Sustained Focus on Title": "Evaluate how well the essay maintains focus on the prescribed title throughout",
      "Effective Links to Areas of Knowledge": "Assess clear connections to TOK areas of knowledge (history, natural sciences, human sciences, mathematics, arts)",
      "Arguments Supported by Specific Examples": "Judge use of precise, relevant examples that support analytical discussion rather than description",
      "Awareness and Evaluation of Different Points of View": "Evaluate critical exploration of contrasting perspectives and counterclaims",
      "Clear, Coherent and Critical Exploration": "Assess overall analytical depth, logical flow, and critical thinking demonstrated"
    }
  },
  3: {
    name: "TOK Exhibition",
    maxScore: 10, 
    criteria: {
      "Clear Identification of Objects and Real-World Contexts": "Evaluate specificity and authenticity of three objects with clear real-world contexts",
      "Effective Links Between Objects and IA Prompt": "Assess how well objects connect to the chosen internal assessment prompt",
      "Strong Justification Supported by Evidence": "Judge quality of reasoning and evidence supporting object selections",
      "Demonstration of TOK Thinking": "Evaluate how the exhibition shows understanding of knowledge questions",
      "Exploration of How TOK Manifests in the World": "Assess how effectively the exhibition demonstrates TOK concepts in real-world contexts"
    }
  }
};

export async function gradeEssayWithAI(request: EssayGradingRequest): Promise<EssayGradingResponse> {
  try {
    const rubric = rubrics[request.rubricId as keyof typeof rubrics];
    if (!rubric) {
      throw new Error("Invalid rubric ID");
    }

    let specificInstructions = "";
    let maxScoreInfo = `Total possible score: ${rubric.maxScore} marks`;

    // Add specific IB assessment instructions based on essay type
    if (request.rubricId === 1) {
      // Extended Essay
      specificInstructions = `
This is an IB Extended Essay assessment. Apply official IB criteria:
- Use best-fit approach with markbands (1-2: Basic, 3-4: Developing, 5-6: Proficient)
- Framework (0-6): Assess research question clarity, methods, structure
- Knowledge (0-6): Evaluate subject understanding, terminology, concepts
- Analysis (0-6): Judge analytical depth and coherent argumentation
- Discussion (0-8): Assess balanced discussion and critical evaluation
- Reflection (0-4): Evidence of learning growth and skill transfer
- Use positive marking - give credit for what is demonstrated`;
    } else if (request.rubricId === 2) {
      // TOK Essay
      specificInstructions = `
This is an IB TOK Essay assessment. Apply global impression marking:
- Central question: "Does the student provide clear, coherent and critical exploration of the title?"
- Use 5-level scale (1-2: Rudimentary, 3-4: Basic, 5-6: Satisfactory, 7-8: Good, 9-10: Excellent)
- Sustained focus on title is crucial
- Must link effectively to areas of knowledge
- Arguments supported by specific examples
- Demonstrate awareness of different viewpoints`;
    } else if (request.rubricId === 3) {
      // TOK Exhibition
      specificInstructions = `
This is an IB TOK Exhibition assessment. Apply holistic judgment:
- Central question: "Does the exhibition show how TOK manifests in the world?"
- Use 5-level scale (1-2: Rudimentary, 3-4: Basic, 5-6: Satisfactory, 7-8: Good, 9-10: Excellent)
- Objects must have specific real-world contexts
- All three objects link to same IA prompt
- Strong justification supported by evidence
- Demonstrates TOK thinking in real-world contexts`;
    }

    const prompt = `You are a senior IB examiner specializing in ${rubric.name} assessment. Apply official IB criteria rigorously.

${specificInstructions}

ASSESSMENT CRITERIA:
${Object.entries(rubric.criteria).map(([criterion, description]) => 
  `- ${criterion}: ${description}`
).join('\n')}

SUBMISSION TO ASSESS:
"""
${request.essayText}
"""

${maxScoreInfo}

Provide assessment in this JSON format:
{
  "scores": {
    ${Object.keys(rubric.criteria).map(criterion => `"${criterion}": [marks according to IB scale]`).join(',\n    ')}
  },
  "overallScore": [total marks awarded],
  "feedback": "Comprehensive feedback following IB examiner standards explaining strengths and areas for development",
  "recommendations": ["specific actionable recommendation 1", "specific actionable recommendation 2", "specific actionable recommendation 3"]
}

Apply IB marking standards consistently. Be constructive but maintain high academic standards.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior IB examiner with extensive experience in International Baccalaureate assessment. Apply official IB criteria consistently, use positive marking principles, and provide professional feedback that helps students understand their performance level and areas for improvement."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Validate the response structure
    if (!result.scores || !result.overallScore || !result.feedback || !result.recommendations) {
      throw new Error("Invalid response format from OpenAI");
    }

    return {
      scores: result.scores,
      overallScore: Math.max(1, Math.min(10, Math.round(result.overallScore))),
      feedback: result.feedback,
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };

  } catch (error) {
    console.error("Error grading essay with AI:", error);
    throw new Error("Failed to grade essay: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}

export function getRubrics() {
  return Object.entries(rubrics).map(([id, rubric]) => ({
    id: parseInt(id),
    name: rubric.name,
    criteria: Object.keys(rubric.criteria)
  }));
}