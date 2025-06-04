import { createObjectCsvWriter } from 'csv-writer';
import html_to_pdf from 'html-pdf-node';
import { Grading } from '@shared/schema';
import { getRubrics } from './openai';

// Generate CSV export for grading results
export async function generateCSVExport(gradings: Grading[]): Promise<string> {
  const csvData = gradings.map(grading => {
    const scores = JSON.parse(grading.scores);
    const recommendations = JSON.parse(grading.recommendations);
    const rubrics = getRubrics();
    const rubric = rubrics.find(r => r.id === grading.rubricId);
    
    return {
      id: grading.id,
      date: grading.date.toISOString().split('T')[0],
      rubric: rubric?.name || `Rubric ${grading.rubricId}`,
      overall_score: calculateOverallScore(scores),
      essay_length: grading.essayText.length,
      feedback_summary: grading.feedback.substring(0, 100) + '...',
      recommendations_count: recommendations.length,
      ...scores // Spread individual criterion scores
    };
  });

  // Create CSV content manually for better control
  const headers = Object.keys(csvData[0] || {});
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => 
      headers.map(header => {
        const value = row[header as keyof typeof row];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : String(value);
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

// Generate JSON export for grading results
export function generateJSONExport(gradings: Grading[]) {
  const rubrics = getRubrics();
  
  return {
    export_info: {
      generated_at: new Date().toISOString(),
      total_gradings: gradings.length,
      format_version: '1.0'
    },
    gradings: gradings.map(grading => {
      const scores = JSON.parse(grading.scores);
      const recommendations = JSON.parse(grading.recommendations);
      const rubric = rubrics.find(r => r.id === grading.rubricId);
      
      return {
        id: grading.id,
        date: grading.date.toISOString(),
        rubric: {
          id: grading.rubricId,
          name: rubric?.name || `Rubric ${grading.rubricId}`,
          criteria: rubric?.criteria || []
        },
        essay: {
          length: grading.essayText.length,
          word_count: grading.essayText.split(/\s+/).length,
          text: grading.essayText
        },
        assessment: {
          scores: scores,
          overall_score: calculateOverallScore(scores),
          feedback: grading.feedback,
          recommendations: recommendations
        }
      };
    })
  };
}

// Generate PDF export for grading results
export async function generatePDFExport(gradings: Grading[], username: string): Promise<Buffer> {
  const rubrics = getRubrics();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CorestoneGrader - Essay Grading Results</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #6b7280;
          margin: 5px 0;
        }
        .grading-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          page-break-inside: avoid;
        }
        .grading-header {
          background: #f8fafc;
          padding: 15px;
          margin: -20px -20px 20px -20px;
          border-radius: 8px 8px 0 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .grading-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }
        .grading-meta {
          color: #6b7280;
          font-size: 14px;
          margin: 5px 0 0 0;
        }
        .scores-section {
          margin: 20px 0;
        }
        .scores-title {
          font-size: 16px;
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
        }
        .score-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .score-item:last-child {
          border-bottom: none;
        }
        .overall-score {
          background: #dbeafe;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          margin: 20px 0;
        }
        .overall-score .score {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .feedback-section {
          margin: 20px 0;
        }
        .feedback-title {
          font-size: 16px;
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
        }
        .feedback-content {
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        }
        .recommendations {
          margin: 20px 0;
        }
        .recommendation-item {
          background: #fef3c7;
          padding: 10px 15px;
          margin: 8px 0;
          border-radius: 6px;
          border-left: 4px solid #f59e0b;
        }
        .page-break {
          page-break-before: always;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CorestoneGrader</h1>
        <p>Essay Grading Results Report</p>
        <p>Generated for: ${username}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Total Essays: ${gradings.length}</p>
      </div>

      ${gradings.map((grading, index) => {
        const scores = JSON.parse(grading.scores);
        const recommendations = JSON.parse(grading.recommendations);
        const rubric = rubrics.find(r => r.id === grading.rubricId);
        const overallScore = calculateOverallScore(scores);
        
        return `
          <div class="grading-item ${index > 0 ? 'page-break' : ''}">
            <div class="grading-header">
              <h2 class="grading-title">${rubric?.name || `Essay ${index + 1}`}</h2>
              <p class="grading-meta">
                Graded on: ${grading.date.toLocaleDateString()} | 
                Essay Length: ${grading.essayText.length} characters |
                Word Count: ~${Math.ceil(grading.essayText.length / 5)} words
              </p>
            </div>

            <div class="overall-score">
              <div class="score">${overallScore}%</div>
              <div>Overall Score</div>
            </div>

            <div class="scores-section">
              <h3 class="scores-title">Detailed Scores</h3>
              ${Object.entries(scores).map(([criterion, score]) => `
                <div class="score-item">
                  <span>${criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span><strong>${score}%</strong></span>
                </div>
              `).join('')}
            </div>

            <div class="feedback-section">
              <h3 class="feedback-title">Feedback</h3>
              <div class="feedback-content">
                ${grading.feedback.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="recommendations">
              <h3 class="feedback-title">Recommendations</h3>
              ${recommendations.map((rec: string) => `
                <div class="recommendation-item">${rec}</div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}

      <div class="footer">
        <p>Generated by CorestoneGrader | www.corestronegrader.com</p>
        <p>This report contains detailed analysis of essay submissions using authentic IB assessment criteria.</p>
      </div>
    </body>
    </html>
  `;

  const options = {
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm'
    },
    printBackground: true,
    preferCSSPageSize: true
  };

  try {
    const file = { content: htmlContent };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    return pdfBuffer;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF export');
  }
}

// Helper function to calculate overall score
function calculateOverallScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  
  const total = values.reduce((sum, score) => sum + score, 0);
  return Math.round(total / values.length);
}