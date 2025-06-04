import { cn } from "@/lib/utils";
import logoImage from "@assets/1 (2).png";

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
      <img 
        src={logoImage}
        alt="CorestoneGrader"
        className="object-contain"
        style={{ height: size * 1.5 }}
      />
      {showText && (
        <span className={cn("font-bold text-xl", textClassName)}>
          CorestoneGrader
        </span>
      )}
    </div>
  );
}