
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4 | 5;
  animation?: "fade-in" | "slide-up" | "slide-in" | "scale-in";
}

const AnimatedContainer = ({
  children,
  className,
  delay = 1,
  animation = "fade-in",
}: AnimatedContainerProps) => {
  return (
    <div
      className={cn(
        `opacity-0 animate-${animation} delay-${delay}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
