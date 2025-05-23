import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 shadow-lg",
        destructive:
          "bg-blue-600 text-white hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 shadow-lg",
        outline:
          "bg-blue-600 text-white hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 shadow-lg",
        secondary:
          "bg-blue-600 text-white hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 shadow-lg",
        ghost: "bg-blue-600 text-white hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 shadow-lg",
        link: "text-blue-600 underline-offset-4 hover:text-blue-800",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }






