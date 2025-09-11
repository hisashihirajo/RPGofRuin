import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, X, MessageCircle } from "lucide-react";
import divantePortraitUrl from "@assets/generated_images/Divante_character_portrait_7f9dc346.png";
import soraPortraitUrl from "@assets/generated_images/Sora_character_portrait_93173527.png";
import alexPortraitUrl from "@assets/generated_images/Alex_character_portrait_168ba368.png";

interface Relationship {
  id: string;
  name: string;
  portraitUrl: string;
  relationshipType: "family" | "friend" | "mentor" | "rival" | "enemy";
  affection: number;
  maxAffection: number;
  status: "alive" | "missing" | "unknown";
  description: string;
  lastInteraction: string;
  memories: Array<{
    title: string;
    description: string;
    impact: "positive" | "negative" | "neutral";
  }>;
}

interface RelationshipSystemProps {
  relationships: Relationship[];
  onTalkTo: (relationshipId: string) => void;
  onClose: () => void;
}

const relationshipTypeColors = {
  family: "bg-chart-2",
  friend: "bg-chart-4", 
  mentor: "bg-chart-1",
  rival: "bg-chart-3",
  enemy: "bg-destructive"
};

const relationshipTypeLabels = {
  family: "家族",
  friend: "友人",
  mentor: "指導者",
  rival: "ライバル",
  enemy: "敵"
};

export default function RelationshipSystem({ 
  relationships, 
  onTalkTo, 
  onClose 
}: RelationshipSystemProps) {
  const getAffectionLevel = (affection: number, maxAffection: number) => {
    const percentage = (affection / maxAffection) * 100;
    if (percentage >= 80) return { label: "深い絆", color: "text-chart-2" };
    if (percentage >= 60) return { label: "親密", color: "text-chart-4" };
    if (percentage >= 40) return { label: "友好的", color: "text-primary" };
    if (percentage >= 20) return { label: "普通", color: "text-muted-foreground" };
    return { label: "冷淡", color: "text-destructive" };
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            人間関係
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-relationships">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-auto max-h-96 space-y-4">
          {relationships.map((relationship) => {
            const affectionLevel = getAffectionLevel(relationship.affection, relationship.maxAffection);
            
            return (
              <Card key={relationship.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Character Avatar */}
                    <Avatar className="w-16 h-16 border-2 border-border">
                      <AvatarImage src={relationship.portraitUrl} alt={relationship.name} />
                      <AvatarFallback className="text-lg">
                        {relationship.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Character Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{relationship.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              className={`${relationshipTypeColors[relationship.relationshipType]} text-white`}
                            >
                              {relationshipTypeLabels[relationship.relationshipType]}
                            </Badge>
                            <Badge variant="outline">
                              {relationship.status === "alive" ? "生存" : 
                               relationship.status === "missing" ? "行方不明" : "不明"}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => onTalkTo(relationship.id)}
                          size="sm"
                          data-testid={`button-talk-${relationship.id}`}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          話しかける
                        </Button>
                      </div>

                      {/* Affection Level */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-primary" />
                            <span>親密度</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">
                              {relationship.affection}/{relationship.maxAffection}
                            </span>
                            <span className={`font-semibold ${affectionLevel.color}`}>
                              {affectionLevel.label}
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={(relationship.affection / relationship.maxAffection) * 100} 
                          className="h-2" 
                        />
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {relationship.description}
                      </p>

                      {/* Last Interaction */}
                      <div className="text-xs text-muted-foreground">
                        最後の交流: {relationship.lastInteraction}
                      </div>

                      {/* Recent Memories */}
                      {relationship.memories.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">最近の思い出</h4>
                          <div className="space-y-1">
                            {relationship.memories.slice(0, 2).map((memory, index) => (
                              <div key={index} className="flex items-start gap-2 text-xs">
                                <div 
                                  className={`w-2 h-2 rounded-full mt-1 ${
                                    memory.impact === "positive" ? "bg-chart-2" :
                                    memory.impact === "negative" ? "bg-destructive" : "bg-muted"
                                  }`} 
                                />
                                <div>
                                  <div className="font-medium">{memory.title}</div>
                                  <div className="text-muted-foreground">{memory.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}