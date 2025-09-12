import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sword, Shield, Zap, Heart, ArrowLeft } from "lucide-react";

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
  const [selectedCommand, setSelectedCommand] = useState<"attack" | "magic" | "item" | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [combatMessage, setCombatMessage] = useState("戦闘が開始された！");

  const currentEntity = [...allies, ...enemies].find(entity => entity.id === currentTurn);
  const isPlayerTurn = allies.some(ally => ally.id === currentTurn);

  const handleCommandSelect = (command: "attack" | "magic" | "item") => {
    setSelectedCommand(command);
    setSelectedAbility(null);
    setSelectedTarget(null);
  };

  const handleAbilitySelect = (abilityName: string) => {
    setSelectedAbility(abilityName);
    setCombatMessage(`${abilityName}のターゲットを選択してください`);
  };

  const handleTargetSelect = (targetId: string) => {
    if (selectedAbility) {
      onAction(selectedAbility, targetId);
      setCombatMessage(`${currentEntity?.name}が${selectedAbility}を使用！`);
      setSelectedCommand(null);
      setSelectedAbility(null);
      setSelectedTarget(null);
    } else if (selectedCommand === "attack") {
      onAction("attack", targetId);
      setCombatMessage(`${currentEntity?.name}が攻撃した！`);
      setSelectedCommand(null);
    }
  };

  const handleBackCommand = () => {
    if (selectedAbility) {
      setSelectedAbility(null);
      setCombatMessage(`コマンドを選択してください`);
    } else if (selectedCommand) {
      setSelectedCommand(null);
      setCombatMessage(`コマンドを選択してください`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Battle Ground */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
      
      {/* Enemy Area - Top Center */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="flex justify-center items-end space-x-8 min-h-48">
          {enemies.map((enemy, index) => (
            <div 
              key={enemy.id}
              className={`relative cursor-pointer transition-all ${
                selectedTarget === enemy.id ? 'scale-110' : 'hover:scale-105'
              } ${
                (selectedAbility || selectedCommand === "attack") ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => (selectedAbility || selectedCommand === "attack") && handleTargetSelect(enemy.id)}
              data-testid={`target-${enemy.id}`}
            >
              {/* Enemy Sprite/Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-destructive/50">
                  <AvatarFallback className="bg-destructive/80 text-destructive-foreground text-4xl">
                    {enemy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Enemy HP Bar */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-36">
                  <div className="bg-black/70 border border-destructive/50 rounded p-1">
                    <div className="text-center text-xs text-white mb-1">{enemy.name}</div>
                    <Progress 
                      value={(enemy.health / enemy.maxHealth) * 100} 
                      className="h-2 bg-gray-700"
                    />
                    <div className="text-center text-xs text-white mt-1">
                      {enemy.health}/{enemy.maxHealth}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Party Status Panel - Left Side */}
      <div className="absolute left-4 top-1/3 w-64 z-20">
        <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
          <div className="text-center text-primary font-semibold mb-3 border-b border-primary/30 pb-2">
            パーティ
          </div>
          
          <div className="space-y-3">
            {allies.map((ally) => (
              <div 
                key={ally.id}
                className={`p-3 rounded border ${
                  currentTurn === ally.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-slate-600 bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarImage src={ally.portraitUrl} alt={ally.name} />
                    <AvatarFallback>{ally.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{ally.name}</div>
                    {currentTurn === ally.id && (
                      <div className="text-xs text-primary">▶ 行動中</div>
                    )}
                  </div>
                </div>
                
                {/* HP */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-white mb-1">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400" />HP
                    </span>
                    <span>{ally.health}/{ally.maxHealth}</span>
                  </div>
                  <Progress value={(ally.health / ally.maxHealth) * 100} className="h-1.5" />
                </div>
                
                {/* MP */}
                <div>
                  <div className="flex justify-between text-xs text-white mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-400" />MP
                    </span>
                    <span>{ally.mana}/{ally.maxMana}</span>
                  </div>
                  <Progress value={(ally.mana / ally.maxMana) * 100} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Window - Bottom */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-96 z-20">
        <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
          <div className="text-white text-center font-mono" data-testid="combat-message">
            {combatMessage}
          </div>
        </div>
      </div>

      {/* Command Menu - Bottom Right */}
      {isPlayerTurn && currentEntity && (
        <div className="absolute bottom-4 right-4 w-80 z-20">
          <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
            
            {/* Main Commands */}
            {!selectedCommand && !selectedAbility && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleCommandSelect("attack")}
                  className="h-12 text-base bg-slate-700 hover:bg-slate-600 border border-primary/30"
                  data-testid="command-attack"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  たたかう
                </Button>
                <Button
                  onClick={() => handleCommandSelect("magic")}
                  className="h-12 text-base bg-slate-700 hover:bg-slate-600 border border-primary/30"
                  data-testid="command-magic"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  まほう
                </Button>
                <Button
                  onClick={() => handleCommandSelect("item")}
                  className="h-12 text-base bg-slate-700 hover:bg-slate-600 border border-primary/30"
                  data-testid="command-item"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  アイテム
                </Button>
                <Button
                  onClick={onEscape}
                  className="h-12 text-base bg-slate-700 hover:bg-slate-600 border border-primary/30"
                  data-testid="command-escape"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  にげる
                </Button>
              </div>
            )}

            {/* Magic/Ability Selection */}
            {selectedCommand === "magic" && !selectedAbility && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-semibold">まほう</span>
                  <Button
                    onClick={handleBackCommand}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    もどる
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {currentEntity.abilities.map((ability) => (
                    <Button
                      key={ability.name}
                      onClick={() => handleAbilitySelect(ability.name)}
                      disabled={ability.cost > currentEntity.mana}
                      className="w-full justify-between bg-slate-700 hover:bg-slate-600 text-left"
                      data-testid={`ability-${ability.name}`}
                    >
                      <span>{ability.name}</span>
                      <span className="text-xs text-blue-400">MP{ability.cost}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Attack Selection Message */}
            {selectedCommand === "attack" && (
              <div className="text-center">
                <div className="text-primary mb-2">ターゲットを選択してください</div>
                <Button
                  onClick={handleBackCommand}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  もどる
                </Button>
              </div>
            )}

            {/* Item Selection (Placeholder) */}
            {selectedCommand === "item" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-semibold">アイテム</span>
                  <Button
                    onClick={handleBackCommand}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    もどる
                  </Button>
                </div>
                
                <div className="text-center text-muted-foreground text-sm">
                  アイテムがありません
                </div>
              </div>
            )}

            {/* Ability Target Selection */}
            {selectedAbility && (
              <div className="text-center">
                <div className="text-primary mb-2">{selectedAbility}</div>
                <div className="text-sm text-muted-foreground mb-2">ターゲットを選択してください</div>
                <Button
                  onClick={handleBackCommand}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  もどる
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}