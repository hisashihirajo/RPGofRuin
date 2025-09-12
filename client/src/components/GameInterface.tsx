import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Zap, Users, Map, Package, Search } from "lucide-react";

interface Character {
  id: string;
  name: string;
  type: "human" | "mutator";
  portraitUrl: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  nextLevelExp: number;
  stats: {
    strength: number;
    intelligence: number;
    agility: number;
  };
}

interface GameInterfaceProps {
  character: Character;
  currentLocation: string;
  onCombatStart: () => void;
  onInventoryOpen: () => void;
  onMapOpen: () => void;
  onLocalMapOpen: () => void;
  onRelationshipsOpen: () => void;
}

export default function GameInterface({ 
  character, 
  currentLocation,
  onCombatStart, 
  onInventoryOpen, 
  onMapOpen, 
  onLocalMapOpen,
  onRelationshipsOpen 
}: GameInterfaceProps) {
  const [currentStory, setCurrentStory] = useState({
    title: "新たな出発",
    text: "クリスは今日もディヴァンテに付いて、終焉化した街を歩いていた。廃墟の向こうから、見慣れない影が現れる...",
    choices: [
      { text: "影に近づく", action: () => console.log("Approaching shadow") },
      { text: "ディヴァンテに報告する", action: () => console.log("Reporting to Divante") },
      { text: "隠れて様子を見る", action: () => console.log("Hiding and watching") }
    ]
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Character Status Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={character.portraitUrl} alt={character.name} />
                  <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{character.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {character.type === "human" ? "人間" : "ミューテーター"} Lv.{character.level}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Health */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-destructive" />
                    <span>HP</span>
                  </div>
                  <span className="font-mono">{character.health}/{character.maxHealth}</span>
                </div>
                <Progress value={(character.health / character.maxHealth) * 100} className="h-2" />
              </div>

              {/* Mana */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>MP</span>
                  </div>
                  <span className="font-mono">{character.mana}/{character.maxMana}</span>
                </div>
                <Progress value={(character.mana / character.maxMana) * 100} className="h-2" />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>経験値</span>
                  <span className="font-mono">{character.experience}/{character.nextLevelExp}</span>
                </div>
                <Progress value={(character.experience / character.nextLevelExp) * 100} className="h-2" />
              </div>

              {/* Stats */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">ステータス</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>力</span>
                    <span className="font-mono">{character.stats.strength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>知性</span>
                    <span className="font-mono">{character.stats.intelligence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>敏捷</span>
                    <span className="font-mono">{character.stats.agility}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <Button 
                  onClick={onCombatStart}
                  variant="destructive" 
                  className="w-full"
                  data-testid="button-combat"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  戦闘開始
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={onInventoryOpen}
                    variant="outline" 
                    size="sm"
                    data-testid="button-inventory"
                  >
                    <Package className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={onRelationshipsOpen}
                    variant="outline" 
                    size="sm"
                    data-testid="button-relationships"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Location and Map Buttons */}
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-2">現在地</div>
                  <div className="text-sm font-semibold mb-2" data-testid="current-location-display">
                    {currentLocation === "safe_shelter" && "安全な避難所"}
                    {currentLocation === "ruined_city" && "廃墟の街"}
                    {currentLocation === "mutator_settlement" && "ミューテーター居住区"}
                    {currentLocation === "industrial_ruins" && "工業地帯の廃墟"}
                    {currentLocation === "underground_lab" && "地下研究所"}
                    {currentLocation === "old_battlefield" && "古い戦場"}
                    {!["safe_shelter", "ruined_city", "mutator_settlement", "industrial_ruins", "underground_lab", "old_battlefield"].includes(currentLocation) && `未知の場所: ${currentLocation}`}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={onLocalMapOpen}
                      variant="outline" 
                      size="sm"
                      data-testid="button-local-map"
                    >
                      <Search className="w-4 h-4 mr-1" />
                      探索
                    </Button>
                    <Button 
                      onClick={onMapOpen}
                      variant="outline" 
                      size="sm"
                      data-testid="button-map"
                    >
                      <Map className="w-4 h-4 mr-1" />
                      世界地図
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Story Area */}
        <div className="lg:col-span-3">
          <Card className="bg-card dark:bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl font-serif text-foreground">{currentStory.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed text-base">
                  {currentStory.text}
                </p>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="font-semibold text-foreground">選択肢:</h4>
                <div className="space-y-2">
                  {currentStory.choices.map((choice, index) => (
                    <Button
                      key={index}
                      onClick={choice.action}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover-elevate bg-card/50 dark:bg-card/50 border-border text-foreground"
                      data-testid={`button-choice-${index}`}
                    >
                      <span className="font-mono text-primary mr-3 font-bold">{index + 1}.</span>
                      <span className="text-foreground">{choice.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}