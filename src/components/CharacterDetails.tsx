
import React from "react";
import { Character } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedContainer from "./AnimatedContainer";
import { MessageSquare, User, Quote } from "lucide-react";

interface CharacterDetailsProps {
  character: Character;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ character }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatedContainer>
        <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">{character.name}</CardTitle>
              <Badge variant="outline" className="text-xs border-border/60">
                {character.title}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Persona</span>
              </h3>
              <ScrollArea className="h-[150px] rounded-md border p-4">
                <p className="text-sm leading-relaxed">{character.persona}</p>
              </ScrollArea>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Quote className="w-4 h-4" />
                <span>Greeting</span>
              </h3>
              <div className="rounded-md border p-4 bg-muted/30">
                <p className="text-sm italic">"{character.greeting}"</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Scenario</h3>
              <div className="rounded-md border p-4">
                <p className="text-sm">{character.scenario}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Example Dialogues</span>
              </h3>
              <ScrollArea className="h-[220px]">
                <div className="space-y-3">
                  {character.exampleDialogues.map((dialogue, index) => (
                    <div key={index} className="rounded-md border p-3">
                      <p className="text-sm whitespace-pre-line">{dialogue}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  );
};

export default CharacterDetails;
