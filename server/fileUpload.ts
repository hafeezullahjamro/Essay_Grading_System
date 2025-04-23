import { Request, Response, NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import util from 'util';
import mammoth from 'mammoth';

// Setup file upload middleware with options
export const fileUploadMiddleware = fileUpload({
  createParentPath: true, // Create upload directory if it doesn't exist
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  preserveExtension: true
});

// Interface for file extraction results
interface FileExtractionResult {
  success: boolean;
  text: string;
  error?: string;
}

// Extract text from a PDF file
async function extractTextFromPDF(filePath: string): Promise<FileExtractionResult> {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse PDF file
    const data = await pdfParse(dataBuffer);
    
    return {
      success: true,
      text: data.text.trim()
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return {
      success: false,
      text: '',
      error: 'Failed to extract text from PDF file.'
    };
  }
}

// Extract text from a DOCX file
async function extractTextFromDOCX(filePath: string): Promise<FileExtractionResult> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return {
      success: true,
      text: result.value.trim()
    };
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    return {
      success: false,
      text: '',
      error: 'Failed to extract text from DOCX file.'
    };
  }
}

// Extract text from a TXT file
async function extractTextFromTXT(filePath: string): Promise<FileExtractionResult> {
  try {
    const readFile = util.promisify(fs.readFile);
    const text = await readFile(filePath, 'utf8');
    return {
      success: true,
      text: text.trim()
    };
  } catch (error) {
    console.error('Error reading TXT file:', error);
    return {
      success: false,
      text: '',
      error: 'Failed to read TXT file.'
    };
  }
}

// Handle file upload
export async function handleFileUpload(req: Request, res: Response) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files were uploaded.' 
      });
    }

    // Get the uploaded file
    const essayFile = req.files.essayFile as fileUpload.UploadedFile;
    
    // Check file extension
    const fileExtension = path.extname(essayFile.name).toLowerCase();
    
    if (!['.pdf', '.docx', '.txt'].includes(fileExtension)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file format. Only PDF, DOCX, and TXT files are allowed.' 
      });
    }

    let extractionResult: FileExtractionResult;

    // Extract text based on file type
    switch (fileExtension) {
      case '.pdf':
        extractionResult = await extractTextFromPDF(essayFile.tempFilePath);
        break;
      case '.docx':
        extractionResult = await extractTextFromDOCX(essayFile.tempFilePath);
        break;
      case '.txt':
        extractionResult = await extractTextFromTXT(essayFile.tempFilePath);
        break;
      default:
        extractionResult = {
          success: false,
          text: '',
          error: 'Unsupported file format.'
        };
    }

    // Clean up temp file
    fs.unlinkSync(essayFile.tempFilePath);

    if (!extractionResult.success) {
      return res.status(500).json({ 
        success: false, 
        message: extractionResult.error
      });
    }

    // Return the extracted text
    return res.status(200).json({ 
      success: true, 
      text: extractionResult.text 
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing file upload.' 
    });
  }
}