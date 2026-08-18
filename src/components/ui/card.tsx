import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "subtle" | "dark" | "flat";
  density?: "default" | "compact";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", density = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-card text-card-foreground border border-border shadow-none",
      interactive:
        "bg-card text-card-foreground border border-border hover:border-brand-indigo hover:shadow-xs active:scale-[0.99] transition-all duration-150 cursor-pointer",
      subtle: "bg-muted/40 text-card-foreground border border-border-subtle shadow-none",
      dark: "bg-surface-dark text-surface-dark-foreground border border-surface-dark-border shadow-none",
      flat: "bg-muted/60 text-card-foreground border-transparent shadow-none",
    };

    const densityStyles = {
      default: "rounded-card",
      compact: "rounded-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          densityStyles[density],
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg sm:text-xl font-bold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 sm:p-6 pt-0 sm:pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 sm:p-6 pt-0 sm:pt-0 border-t border-border/50", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
