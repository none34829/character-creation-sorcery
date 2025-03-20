
import React, { useState, useEffect } from "react";
import { Character, WizardStep, CharacterDescription } from "@/types";
import { Button } from "@/components/ui/button";
import WizardSteps from "./WizardSteps";
import CharacterForm from "./CharacterForm";
import CharacterDetails from "./CharacterDetails";
import AvatarGenerator from "./AvatarGenerator";
import CharacterPreview from "./CharacterPreview";
import { generateCharacter, getApiKeysSet } from "@/lib/api";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CharacterWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("description");
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const [apiKeysSet, setApiKeysSet] = useState(getApiKeysSet());
  
  // Check if API keys are set whenever this component renders
  useEffect(() => {
    const currentKeys = getApiKeysSet();
    setApiKeysSet(currentKeys);
    console.log("API keys status in CharacterWizard:", currentKeys);
  }, []);
  
  const handleGenerateCharacter = async (description: CharacterDescription) => {
    // Double-check API keys are set before proceeding
    const currentApiKeysSet = getApiKeysSet();
    if (!currentApiKeysSet.groq) {
      toast.error("Please set your Groq API key first");
      return;
    }
    
    setLoading(true);
    
    try {
      const generatedCharacter = await generateCharacter(description);
      setCharacter(generatedCharacter);
      setCompletedSteps(new Set([...completedSteps, "description"]));
      setCurrentStep("details");
      toast.success("Character details generated successfully!");
    } catch (error) {
      console.error("Error generating character:", error);
      toast.error("Failed to generate character");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarGenerated = (avatarUrl: string) => {
    if (character) {
      setCharacter({ ...character, avatarUrl });
      setCompletedSteps(new Set([...completedSteps, "avatar"]));
    }
  };
  
  const goToNextStep = () => {
    if (currentStep === "description" && character) {
      setCurrentStep("details");
      setCompletedSteps(new Set([...completedSteps, "description"]));
    } else if (currentStep === "details") {
      setCurrentStep("avatar");
      setCompletedSteps(new Set([...completedSteps, "details"]));
    } else if (currentStep === "avatar") {
      setCurrentStep("preview");
      setCompletedSteps(new Set([...completedSteps, "avatar"]));
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep === "details") {
      setCurrentStep("description");
    } else if (currentStep === "avatar") {
      setCurrentStep("details");
    } else if (currentStep === "preview") {
      setCurrentStep("avatar");
    }
  };
  
  const handleStepClick = (step: WizardStep) => {
    // Only allow navigation to completed steps or the description step
    if (completedSteps.has(step) || step === "description") {
      setCurrentStep(step);
    }
  };
  
  const renderStepContent = () => {
    if (currentStep === "description") {
      return <CharacterForm 
        onSubmit={handleGenerateCharacter} 
        isLoading={loading} 
        onApiKeysUpdated={() => setApiKeysSet(getApiKeysSet())}
      />;
    }
    
    if (!character) return null;
    
    if (currentStep === "details") {
      return <CharacterDetails character={character} />;
    }
    
    if (currentStep === "avatar") {
      return <AvatarGenerator character={character} onAvatarGenerated={handleAvatarGenerated} />;
    }
    
    if (currentStep === "preview") {
      return <CharacterPreview character={character} />;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 sm:px-6">
      <WizardSteps
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />
      
      <div className="mb-20">{renderStepContent()}</div>
      
      {character && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 py-4 px-6">
          <div className="max-w-3xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === "description"}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={goToNextStep}
              disabled={
                currentStep === "preview" ||
                (currentStep === "description" && !completedSteps.has("description"))
              }
              className="gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterWizard;
