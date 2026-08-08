import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
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
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary-hover rounded-full font-sans text-sm tracking-wide shadow-none border border-transparent",
      secondary:
        "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground rounded-[4px] font-sans shadow-none",
      outline:
        "bg-transparent text-primary border border-border hover:bg-primary hover:text-primary-foreground rounded-full font-sans shadow-none",
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
