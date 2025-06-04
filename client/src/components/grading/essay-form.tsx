import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type EssayFormProps = {
  form: UseFormReturn<{
    rubricId: string;
    essayText: string;
  }>;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
};

export default function EssayForm({ form, onSubmit, isSubmitting }: EssayFormProps) {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // IB Essay types based on rubrics
  const essayTypes = [
    { 
      id: "1", 
      name: "Extended Essay",
      description: "IB Extended Essay - Independent research project with detailed analysis (4,000 words max)"
    },
    { 
      id: "2", 
      name: "TOK Essay", 
      description: "Theory of Knowledge Essay - Critical exploration of knowledge questions (1,600 words max)"
    },
    { 
      id: "3", 
      name: "TOK Exhibition",
      description: "Theory of Knowledge Exhibition - Three objects exploring how TOK manifests in the world"
    }
  ];

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file extension
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setFileUploadError('Invalid file type. Only PDF, DOCX, and TXT files are allowed.');
      setUploadStatus('error');
      return;
    }

    // Set the selected file and clear any previous errors
    setSelectedFile(file);
    setFileUploadError(null);
    setUploadStatus('uploading');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('essayFile', file);

      // Upload file
      const response = await fetch('/api/upload-essay', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload file');
      }

      // Update the form with the extracted text
      form.setValue('essayText', data.text);
      setUploadStatus('success');
      toast({
        title: 'File processed successfully',
        description: 'Your essay has been extracted and is ready for grading.',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileUploadError(error instanceof Error ? error.message : 'An error occurred processing the file');
      setUploadStatus('error');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rubricId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Essay Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an essay type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {essayTypes.map((essayType) => (
                        <SelectItem key={essayType.id} value={essayType.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{essayType.name}</span>
                            <span className="text-sm text-gray-500">{essayType.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4 mr-2" />
                  Type or Paste
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <FormField
                  control={form.control}
                  name="essayText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Essay Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your essay here..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="mt-2 text-sm text-gray-500">
                        For best results, ensure your essay is properly formatted and free of formatting artifacts.
                      </p>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="upload">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="essayFile"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadStatus === 'uploading'}
                    />
                    <label 
                      htmlFor="essayFile"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {uploadStatus === 'uploading' ? 'Processing file...' : 'Click to upload or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PDF, DOCX, or TXT files (max 5MB)
                      </span>
                      {selectedFile && (
                        <span className="text-xs text-blue-500 mt-2">
                          {selectedFile.name}
                        </span>
                      )}
                    </label>
                  </div>
                  
                  {uploadStatus === 'success' && (
                    <Alert className="bg-green-50 border-green-200">
                      <FileText className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        File processed successfully! You can now grade your essay.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {uploadStatus === 'error' && fileUploadError && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-600">
                        {fileUploadError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || uploadStatus === 'uploading' || form.getValues('essayText').length < 50}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Grading Essay...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>
                    Grade Now
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
