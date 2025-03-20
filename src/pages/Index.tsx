
import React from "react";
import CharacterWizard from "@/components/CharacterWizard";

const Index: React.FC = () => {
  console.log("Rendering Index component");
  
  return (
    <div className="bg-gradient-to-b from-background to-muted min-h-screen">
      <CharacterWizard />
    </div>
  );
};

export default Index;
