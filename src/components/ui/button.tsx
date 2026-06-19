import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 rounded-2xl font-extrabold tracking-tight transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 active:translate-y-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_5px_0_0_hsl(var(--primary-shadow))] hover:brightness-105 active:shadow-[0_2px_0_0_hsl(var(--primary-shadow))]",
        accent:
          "bg-accent text-accent-foreground shadow-[0_5px_0_0_hsl(var(--accent-shadow))] hover:brightness-105 active:shadow-[0_2px_0_0_hsl(var(--accent-shadow))]",
        secondary: "bg-secondary text-secondary-foreground hover:brightness-95 active:translate-y-[1px]",
        outline: "border-2 border-border bg-card hover:bg-muted active:translate-y-[1px]",
        ghost: "hover:bg-muted active:translate-y-[1px]",
        destructive: "bg-red-500 text-white hover:brightness-105 active:translate-y-[1px]",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 rounded-xl px-3 text-sm",
        lg: "min-h-[3.25rem] px-6 text-base",
        xl: "min-h-16 px-8 text-lg",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
