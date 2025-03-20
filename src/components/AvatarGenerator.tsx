
import React, { useState } from "react";
import { Character } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateAvatar, getApiKeysSet } from "@/lib/api";
import AnimatedContainer from "./AnimatedContainer";
import { Wand, Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AvatarGeneratorProps {
  character: Character;
  onAvatarGenerated: (avatarUrl: string) => void;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({
  character,
  onAvatarGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(
    character.avatarUrl || null
  );
  
  const apiKeysSet = getApiKeysSet();
  
  const handleGenerateAvatar = async () => {
    if (!apiKeysSet.runware) {
      toast.error("Please set your Runware API key first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const avatarUrl = await generateAvatar(character);
      setGeneratedAvatar(avatarUrl);
      onAvatarGenerated(avatarUrl);
    } catch (error) {
      console.error("Error generating avatar:", error);
      toast.error("Failed to generate avatar");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatedContainer>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Character Avatar</h2>
          <p className="text-muted-foreground">
            Generate an avatar for your character using AI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="bg-muted/40 backdrop-blur-sm border-dashed border-2 overflow-hidden h-[350px] flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full w-full text-center p-6 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/80" />
                <p className="text-sm text-muted-foreground">
                  Generating avatar...
                  <br />
                  This may take a moment
                </p>
              </div>
            ) : generatedAvatar ? (
              <div className="relative w-full h-full group">
                <img
                  src={generatedAvatar}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                    onClick={handleGenerateAvatar}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-center p-6 space-y-4">
                <Image className="h-16 w-16 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No avatar generated yet
                </p>
              </div>
            )}
          </Card>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Avatar for {character.name}</h3>
              <p className="text-sm text-muted-foreground">
                Generate a unique avatar that matches your character's description. The image will be based on the character profile you've created.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground">
                  The AI will use the following information to generate your avatar:
                </p>
                <ul className="text-xs list-disc list-inside space-y-1 mt-2">
                  <li>Name: {character.name}</li>
                  <li>Title: {character.title}</li>
                  <li>Personality traits from description</li>
                </ul>
              </div>
            </div>
            
            <Button
              onClick={handleGenerateAvatar}
              disabled={isGenerating || !apiKeysSet.runware}
              className="w-full relative overflow-hidden group"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand className="h-4 w-4" />
                  {generatedAvatar ? "Regenerate Avatar" : "Generate Avatar"}
                </span>
              )}
              
              <span className="absolute inset-0 w-full bg-shine animate-shine opacity-0 group-hover:opacity-20" />
            </Button>
            
            {!apiKeysSet.runware && (
              <p className="text-xs text-amber-600 text-center">
                Please set your Runware API key in the API Keys menu
              </p>
            )}
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default AvatarGenerator;
