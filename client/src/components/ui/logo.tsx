import { GraduationCap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({ 
  className, 
  size = 24, 
  showText = true,
  textClassName
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <GraduationCap 
          size={size} 
          className="text-primary animate-pulse" 
          style={{ animationDuration: '3s' }}
        />
        <BookOpen 
          size={size * 0.7} 
          className="text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        />
      </div>
      {showText && (
        <span className={cn("font-bold text-xl", textClassName)}>
          <span className="text-primary">Core</span>
          <span className="text-gray-700">Grader</span>
        </span>
      )}
    </div>
  );
}