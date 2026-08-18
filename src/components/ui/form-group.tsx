import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormGroupProps {
  id?: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormGroup({
  id,
  label,
  required,
  helperText,
  error,
  className,
  children,
}: FormGroupProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={id}
            className="text-xs font-semibold text-foreground flex items-center gap-1"
          >
            {label}
            {required && <span className="text-destructive font-bold">*</span>}
          </Label>
        </div>
      )}

      {children}

      {error ? (
        <p className="text-[11px] font-medium text-destructive leading-tight">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-body-muted leading-tight">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
