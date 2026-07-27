import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "landing"
    | "landingOutline"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default:
        "bg-app-primary text-white hover:bg-app-primary-hover rounded-[4px]",
      landing:
        "bg-landing-primary text-white hover:bg-landing-primary-hover rounded-none font-serif text-base tracking-wide shadow-none border border-black",
      landingOutline:
        "bg-transparent text-black border border-black hover:bg-black hover:text-white rounded-none font-serif text-base shadow-none",
      secondary:
        "bg-app-secondary-green text-white hover:bg-app-secondary-green-hover rounded-[4px]",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-[4px]",
      ghost: "hover:bg-accent hover:text-accent-foreground rounded-[4px]",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[4px]",
      link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
