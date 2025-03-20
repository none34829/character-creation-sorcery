
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CharacterDescription } from "@/types";
import { setApiKeys, getApiKeysSet } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AnimatedContainer from "./AnimatedContainer";
import { AlertCircle, Key, LinkIcon, ArrowRight, Wand } from "lucide-react";
import { toast } from "sonner";

interface CharacterFormProps {
  onSubmit: (description: CharacterDescription) => void;
  isLoading: boolean;
  onApiKeysUpdated?: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ 
  onSubmit, 
  isLoading,
  onApiKeysUpdated
}) => {
  const [description, setDescription] = useState<CharacterDescription>({
    text: "",
    url: "",
  });
  
  const [apiKeys, setLocalApiKeys] = useState({
    groq: "",
    exa: "",
    runware: "",
  });
  
  const [apiKeysSet, setLocalApiKeysSet] = useState(getApiKeysSet());
  const [apiKeysDialogOpen, setApiKeysDialogOpen] = useState(false);
  
  useEffect(() => {
    const currentApiKeysSet = getApiKeysSet();
    setLocalApiKeysSet(currentApiKeysSet);
    
    if (!currentApiKeysSet.groq) {
      setApiKeysDialogOpen(true);
    }
    
    console.log("Current API keys status:", currentApiKeysSet);
  }, []);
  
  useEffect(() => {
    const currentApiKeysSet = getApiKeysSet();
    setLocalApiKeysSet(currentApiKeysSet);
    
    if (currentApiKeysSet.groq && !apiKeysDialogOpen && onApiKeysUpdated) {
      onApiKeysUpdated();
    }
  }, [apiKeysDialogOpen, onApiKeysUpdated]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.text.trim()) return;
    
    const currentApiKeysSet = getApiKeysSet();
    if (!currentApiKeysSet.groq) {
      setApiKeysDialogOpen(true);
      return;
    }
    
    onSubmit(description);
  };
  
  const handleSetApiKeys = () => {
    setApiKeys({
      groq: apiKeys.groq,
      exa: apiKeys.exa,
      runware: apiKeys.runware,
    });
    
    const updatedKeys = getApiKeysSet();
    setLocalApiKeysSet(updatedKeys);
    
    console.log("API keys set successfully:", updatedKeys);
    
    if (apiKeys.groq) {
      setApiKeysDialogOpen(false);
      
      if (onApiKeysUpdated) {
        setTimeout(() => {
          onApiKeysUpdated();
        }, 100);
      }
    } else {
      toast.error("Groq API key is required");
    }
  };

  return (
    <div>
      <Dialog open={apiKeysDialogOpen} onOpenChange={setApiKeysDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="absolute top-4 right-4 flex items-center gap-2"
            onClick={() => setApiKeysDialogOpen(true)}
          >
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set API Keys</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groq-api-key">
                Groq API Key
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="groq-api-key"
                placeholder="Enter Groq API key"
                value={apiKeys.groq}
                onChange={(e) => setLocalApiKeys({ ...apiKeys, groq: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  console.groq.com/keys
                </a>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exa-api-key">
                Exa API Key
                <span className="text-muted-foreground ml-1">(optional)</span>
              </Label>
              <Input
                id="exa-api-key"
                placeholder="Enter Exa API key"
                value={apiKeys.exa}
                onChange={(e) => setLocalApiKeys({ ...apiKeys, exa: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a
                  href="https://exa.ai/apis"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  exa.ai/apis
                </a>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="runware-api-key">
                Runware API Key
                <span className="text-muted-foreground ml-1">(for avatar)</span>
              </Label>
              <Input
                id="runware-api-key"
                placeholder="Enter Runware API key"
                value={apiKeys.runware}
                onChange={(e) => setLocalApiKeys({ ...apiKeys, runware: e.target.value })}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a
                  href="https://runware.ai/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  runware.ai/dashboard
                </a>
              </p>
            </div>
            
            <Button 
              onClick={handleSetApiKeys} 
              disabled={!apiKeys.groq} 
              className="w-full"
            >
              Save API Keys
            </Button>
            
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              <p>API keys are stored only in your browser and are never sent to our servers.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatedContainer>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Character Creation Wizard</h1>
            <p className="text-muted-foreground text-lg">
              Let AI help you create the perfect character for SpicyChat
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatedContainer delay={2}>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Describe Your Character
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the character you want to create in detail. For example: 'A witty and wise female space explorer named Captain Zara who has traveled to the far reaches of the cosmos. She's seen many civilizations rise and fall, and has a dry sense of humor.'"
                  value={description.text}
                  onChange={(e) => setDescription({ ...description, text: e.target.value })}
                  className="min-h-[150px]"
                  required
                />
              </div>
            </AnimatedContainer>
            
            <AnimatedContainer delay={3}>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-base flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>Reference URL (Optional)</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/character-reference"
                  value={description.url || ""}
                  onChange={(e) => setDescription({ ...description, url: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Provide a URL with more information about your character to improve the generation
                </p>
              </div>
            </AnimatedContainer>
            
            <AnimatedContainer delay={4} className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={!description.text.trim() || isLoading || !apiKeysSet.groq}
                className="relative overflow-hidden group px-8"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Wand className="w-4 h-4" />
                    <span>Generate Character</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1" />
                  </span>
                )}
                
                <span className="absolute inset-0 w-full bg-shine animate-shine opacity-0 group-hover:opacity-20" />
              </Button>
            </AnimatedContainer>
            
            {!apiKeysSet.groq && (
              <AnimatedContainer delay={5} className="text-center">
                <p className="text-sm text-muted-foreground">
                  Please set up your API keys to continue
                </p>
              </AnimatedContainer>
            )}
          </form>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default CharacterForm;
