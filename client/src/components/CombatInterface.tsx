import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sword, Shield, Zap, Heart, Clock } from "lucide-react";

interface CombatEntity {
  id: string;
  name: string;
  portraitUrl?: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  speed: number;
  type: "ally" | "enemy";
  abilities: Array<{
    name: string;
    cost: number;
    damage: number;
    description: string;
  }>;
}

interface CombatInterfaceProps {
  allies: CombatEntity[];
  enemies: CombatEntity[];
  currentTurn: string;
  onAction: (action: string, targetId?: string) => void;
  onEscape: () => void;
}

export default function CombatInterface({ 
  allies, 
  enemies, 
  currentTurn, 
  onAction, 
  onEscape 
}: CombatInterfaceProps) {
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [combatLog, setCombatLog] = useState([
    "戦闘が開始された！",
    "クリスの番です。"
  ]);

  const currentEntity = [...allies, ...enemies].find(entity => entity.id === currentTurn);
  const isPlayerTurn = allies.some(ally => ally.id === currentTurn);

  const handleAbilitySelect = (abilityName: string) => {
    setSelectedAbility(selectedAbility === abilityName ? null : abilityName);
    setSelectedTarget(null);
  };

  const handleTargetSelect = (targetId: string) => {
    if (selectedAbility) {
      onAction(selectedAbility, targetId);
      setSelectedAbility(null);
      setSelectedTarget(null);
      setCombatLog(prev => [...prev, `${currentEntity?.name}が${selectedAbility}を使用！`]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Combat Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          
          {/* Allies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-chart-2" />
                味方
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allies.map((ally) => (
                  <div 
                    key={ally.id}
                    className={`p-4 rounded-lg border ${
                      currentTurn === ally.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={ally.portraitUrl} alt={ally.name} />
                        <AvatarFallback>{ally.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{ally.name}</h4>
                        {currentTurn === ally.id && (
                          <Badge variant="default" className="text-xs">行動中</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Health Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-destructive" />
                          <span>HP</span>
                        </div>
                        <span className="font-mono">{ally.health}/{ally.maxHealth}</span>
                      </div>
                      <Progress value={(ally.health / ally.maxHealth) * 100} className="h-2" />
                    </div>

                    {/* Mana Bar */}
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-primary" />
                          <span>MP</span>
                        </div>
                        <span className="font-mono">{ally.mana}/{ally.maxMana}</span>
                      </div>
                      <Progress value={(ally.mana / ally.maxMana) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enemies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sword className="w-5 h-5 text-destructive" />
                敵
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enemies.map((enemy) => (
                  <div 
                    key={enemy.id}
                    className={`p-4 rounded-lg border cursor-pointer hover-elevate ${
                      selectedTarget === enemy.id ? 'border-destructive bg-destructive/5' : 
                      currentTurn === enemy.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => selectedAbility && handleTargetSelect(enemy.id)}
                    data-testid={`target-${enemy.id}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-destructive text-destructive-foreground">
                          {enemy.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{enemy.name}</h4>
                        {currentTurn === enemy.id && (
                          <Badge variant="destructive" className="text-xs">行動中</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Health Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-destructive" />
                          <span>HP</span>
                        </div>
                        <span className="font-mono">{enemy.health}/{enemy.maxHealth}</span>
                      </div>
                      <Progress value={(enemy.health / enemy.maxHealth) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        {isPlayerTurn && currentEntity && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {currentEntity.name}のターン
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {currentEntity.abilities.map((ability) => (
                  <Button
                    key={ability.name}
                    onClick={() => handleAbilitySelect(ability.name)}
                    variant={selectedAbility === ability.name ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-start"
                    disabled={ability.cost > currentEntity.mana}
                    data-testid={`ability-${ability.name}`}
                  >
                    <div className="font-semibold text-sm">{ability.name}</div>
                    <div className="text-xs text-muted-foreground">MP: {ability.cost}</div>
                    <div className="text-xs text-muted-foreground mt-1">{ability.description}</div>
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => onAction('defend')}
                  variant="secondary"
                  data-testid="button-defend"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  防御
                </Button>
                <Button 
                  onClick={onEscape}
                  variant="outline"
                  data-testid="button-escape"
                >
                  逃げる
                </Button>
              </div>

              {selectedAbility && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {selectedAbility}のターゲットを選択してください
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Combat Log */}
        <Card>
          <CardHeader>
            <CardTitle>戦闘ログ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 overflow-y-auto space-y-1" data-testid="combat-log">
              {combatLog.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}