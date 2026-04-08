import * as React from "react"
import { cn } from "@/lib/utils"

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(
  ({ className, cols = 1, children, ...props }, ref) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-6",
          gridCols[cols],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardGrid.displayName = "CardGrid";

export { CardGrid };
