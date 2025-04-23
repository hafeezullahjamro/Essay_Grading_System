import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type EssayFormProps = {
  form: UseFormReturn<{
    rubricId: string;
    essayText: string;
  }>;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
};

export default function EssayForm({ form, onSubmit, isSubmitting }: EssayFormProps) {
  // Rubric options
  const rubrics = [
    { id: "1", name: "General Academic Essay" },
    { id: "2", name: "Argumentative Essay" },
    { id: "3", name: "College Admissions Essay" },
    { id: "4", name: "Research Paper" },
    { id: "5", name: "Literary Analysis" }
  ];

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
                  <FormLabel>Select Rubric</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rubric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rubrics.map((rubric) => (
                        <SelectItem key={rubric.id} value={rubric.id}>
                          {rubric.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Grading...
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
