
import React from "react";
import { WizardStep } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardStepsProps {
  currentStep: WizardStep;
  onStepClick?: (step: WizardStep) => void;
  completedSteps: Set<WizardStep>;
}

const WizardSteps: React.FC<WizardStepsProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  const steps: { id: WizardStep; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "details", label: "Character Details" },
    { id: "avatar", label: "Avatar" },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.has(step.id);
          const canClick = onStepClick && (isCompleted || step.id === "description");
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => canClick && onStepClick(step.id)}
                  disabled={!canClick}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 mb-2",
                    isActive && "ring-2 ring-offset-2 ring-primary",
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                      ? "bg-secondary border border-primary/20"
                      : "bg-muted border border-border",
                    canClick && !isActive && "hover:bg-muted/80 cursor-pointer"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[1px] flex-1 mx-2 transition-colors duration-300",
                    (completedSteps.has(step.id) && completedSteps.has(steps[index + 1].id)) ||
                    (completedSteps.has(step.id) && currentStep === steps[index + 1].id)
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardSteps;
