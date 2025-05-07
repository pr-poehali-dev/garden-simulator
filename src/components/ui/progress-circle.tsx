
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
}

const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
  ({ 
    value, 
    size = 36, 
    strokeWidth = 3, 
    showValue = false, 
    className, 
    ...props 
  }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ref={ref}
          className={cn("rotate-[-90deg]", className)}
          {...props}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className="text-muted stroke-[3]"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className="text-primary"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {showValue && (
          <span className="absolute text-xs font-medium">{value}%</span>
        )}
      </div>
    );
  }
);

ProgressCircle.displayName = "ProgressCircle";

export { ProgressCircle };
