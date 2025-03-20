
import React from "react";
import { Character } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedContainer from "./AnimatedContainer";
import { Check, Clipboard, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface CharacterPreviewProps {
  character: Character;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ character }) => {
  const [copied, setCopied] = React.useState<string | null>(null);
  
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      toast.success(`Copied ${field} to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedContainer>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Character Preview</h2>
          <p className="text-muted-foreground">
            Your character is ready to be exported to SpicyChat
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          <Card className="md:col-span-2 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-fit">
            <div className="aspect-square overflow-hidden bg-muted relative">
              {character.avatarUrl ? (
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground text-sm">No avatar generated</p>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="space-y-1">
                <CardTitle className="flex justify-between items-start">
                  <span>{character.name}</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {character.title}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="line-clamp-3">{character.persona.substring(0, 120)}...</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => window.open("https://spicychat.ai/chatbot/create", "_blank")}
              >
                <span className="flex items-center gap-2">
                  Export to SpicyChat
                  <ExternalLink className="h-4 w-4" />
                </span>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="fields" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="fields" className="flex-1">Character Fields</TabsTrigger>
                <TabsTrigger value="json" className="flex-1">JSON Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fields" className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Copy Character Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Name</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 gap-1 text-xs"
                          onClick={() => handleCopy(character.name, "name")}
                        >
                          {copied === "name" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted rounded-md p-2 text-sm">
                        {character.name}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Title</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 gap-1 text-xs"
                          onClick={() => handleCopy(character.title, "title")}
                        >
                          {copied === "title" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted rounded-md p-2 text-sm">
                        {character.title}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Persona</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 gap-1 text-xs"
                          onClick={() => handleCopy(character.persona, "persona")}
                        >
                          {copied === "persona" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted rounded-md p-2 text-sm max-h-32 overflow-y-auto">
                        {character.persona}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Greeting</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 gap-1 text-xs"
                          onClick={() => handleCopy(character.greeting, "greeting")}
                        >
                          {copied === "greeting" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted rounded-md p-2 text-sm max-h-32 overflow-y-auto">
                        {character.greeting}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Scenario</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 gap-1 text-xs"
                          onClick={() => handleCopy(character.scenario, "scenario")}
                        >
                          {copied === "scenario" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted rounded-md p-2 text-sm max-h-32 overflow-y-auto">
                        {character.scenario}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">Example Dialogues</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 gap-1 text-xs"
                          onClick={() => handleCopy(character.exampleDialogues.join("\n\n"), "examples")}
                        >
                          {copied === "examples" ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clipboard className="h-3 w-3" />
                          )}
                          Copy All
                        </Button>
                      </div>
                      <div className="bg-muted rounded-md p-2 text-sm max-h-64 overflow-y-auto space-y-2">
                        {character.exampleDialogues.map((dialogue, index) => (
                          <div key={index} className="border-b border-border/50 pb-2 last:border-0 last:pb-0">
                            {dialogue}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="json">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">JSON Data</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1"
                        onClick={() => handleCopy(JSON.stringify(character, null, 2), "json")}
                      >
                        {copied === "json" ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-4 w-4" />
                            Copy JSON
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted rounded-md p-4 text-xs overflow-auto max-h-96">
                      {JSON.stringify(character, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default CharacterPreview;
