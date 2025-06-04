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

// Define rubrics for essay grading
export const rubrics = {
  1: {
    name: "General Essay Rubric",
    criteria: {
      "Grammar and Mechanics": "Evaluate grammar, spelling, punctuation, and sentence structure",
      "Organization and Structure": "Assess logical flow, paragraph structure, and overall organization",
      "Content and Ideas": "Judge the quality, originality, and depth of ideas presented",
      "Voice and Style": "Evaluate writing style, tone, and author's voice",
      "Use of Evidence": "Assess how well evidence supports arguments and claims"
    }
  },
  2: {
    name: "Academic Research Paper",
    criteria: {
      "Thesis and Argument": "Evaluate clarity and strength of thesis statement and argument",
      "Research and Citations": "Assess quality of sources and proper citation format",
      "Analysis and Critical Thinking": "Judge depth of analysis and critical evaluation",
      "Academic Writing Style": "Evaluate formal writing style and academic tone",
      "Conclusion and Synthesis": "Assess how well the conclusion synthesizes the argument"
    }
  },
  3: {
    name: "Creative Writing",
    criteria: {
      "Creativity and Originality": "Evaluate uniqueness and creative elements",
      "Character Development": "Assess depth and believability of characters",
      "Plot and Structure": "Judge story structure and narrative flow",
      "Setting and Atmosphere": "Evaluate world-building and mood creation",
      "Language and Style": "Assess use of literary devices and writing style"
    }
  }
};

export async function gradeEssayWithAI(request: EssayGradingRequest): Promise<EssayGradingResponse> {
  try {
    const rubric = rubrics[request.rubricId as keyof typeof rubrics];
    if (!rubric) {
      throw new Error("Invalid rubric ID");
    }

    const prompt = `You are an expert essay grader. Please grade the following essay using the "${rubric.name}" rubric.

RUBRIC CRITERIA:
${Object.entries(rubric.criteria).map(([criterion, description]) => 
  `- ${criterion}: ${description}`
).join('\n')}

ESSAY TO GRADE:
"""
${request.essayText}
"""

Please provide your evaluation in the following JSON format:
{
  "scores": {
    ${Object.keys(rubric.criteria).map(criterion => `"${criterion}": [score from 1-10]`).join(',\n    ')}
  },
  "overallScore": [overall score from 1-10],
  "feedback": "Detailed feedback explaining the strengths and areas for improvement",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}

Be constructive and specific in your feedback. Scores should be integers from 1-10 where:
1-3: Needs significant improvement
4-6: Developing/Average
7-8: Good/Proficient  
9-10: Excellent/Exceptional`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert essay grader with years of experience in educational assessment. Provide detailed, constructive feedback to help students improve their writing."
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