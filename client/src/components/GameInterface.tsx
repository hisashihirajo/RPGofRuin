import { useState, useEffect } from "react";
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
  const getInitialStory = () => {
    if (character.id === "sora") {
      return {
        title: "裏路地の掟",
        text: "ソラは瓦礫の山に腰掛け、錆びついたナイフを弄んでいた。この街で生き残るには、力か、それ以上の狡賢さが必要だ。遠くで、人間たちの話し声が聞こえてくる...",
        choices: [
          { text: "声の主に喧嘩を売る" },
          { text: "影から奇襲をかける" },
          { text: "無視してナイフを研ぐ" }
        ]
      };
    } else if (character.id === "alex") {
      return {
        title: "古の記録",
        text: "アレックスは崩れかけた図書館の片隅で、一冊の古い日誌をめくっていた。そこには戦争前の、まだ世界が『普通』だった頃の記録が記されている。ふと、背後に誰かの気配を感じた。",
        choices: [
          { text: "静かに本を閉じる" },
          { text: "気配の正体を問いただす" },
          { text: "罠を仕掛けて待ち構える" }
        ]
      };
    } else {
      // Chris (Default)
      return {
        title: "新たな出発",
        text: "クリスは今日もディヴァンテに付いて、終焉化した街を歩いていた。廃墟の向こうから、見慣れない影が現れる...",
        choices: [
          { text: "影に近づく" },
          { text: "ディヴァンテに報告する" },
          { text: "隠れて様子を見る" }
        ]
      };
    }
  };

  const [currentStory, setCurrentStory] = useState(getInitialStory());

  // Update story when character changes (e.g. on new game)
  useEffect(() => {
    setCurrentStory(getInitialStory());
  }, [character.id]);

  const handleStoryChoice = (choiceIndex: number) => {
    const selectedChoice = currentStory.choices[choiceIndex];

    if (selectedChoice?.text.includes("戦闘")) {
      onCombatStart();
      return;
    }

    let nextStories: any[] = [];

    if (character.id === "sora") {
      nextStories = [
        {
          title: "一触即発",
          text: "「おい、そこで何してんだよ？」ソラが立ち上がると、人間たちは怯えた顔でこちらを見た。彼らの腰には、高価そうな物資がぶら下がっている。",
          choices: [
            { text: "物資を奪い取る (戦闘)" },
            { text: "脅して情報を吐かせる" },
            { text: "笑い飛ばして去る" }
          ]
        },
        {
          title: "奇襲成功",
          text: "音もなく背後に回り込み、獲物の首筋に冷たい鉄を突きつける。「動くな。命が惜しければな」ソラの声は冷酷に響いた。",
          choices: [
            { text: "身ぐるみを剥ぐ" },
            { text: "仲間の居場所を聞き出す" },
            { text: "そのまま気絶させる" }
          ]
        },
        {
          title: "静かな時間",
          text: "ナイフの刃が鈍く光る。人間たちの気配は遠ざかっていった。今は一人でいたい。この荒廃した世界でも、自分だけの静寂が必要な時がある。",
          choices: [
            { text: "他の場所へ移動する" },
            { text: "少し仮眠を取る" },
            { text: "獲物を探しに出る" }
          ]
        }
      ];
    } else if (character.id === "alex") {
      nextStories = [
        {
          title: "慎重な対応",
          text: "アレックスは気配を殺し、本の中に指を挟んだまま固まった。背後の主は、こちらがミューテーターであることに気づいていないようだ。",
          choices: [
            { text: "背後の主に話しかける" },
            { text: "隙を見て逃げ出す" },
            { text: "本を隠して迎え撃つ" }
          ]
        },
        {
          title: "対峙",
          text: "「誰だ？」アレックスが静かに問いかけると、暗闇から一人の老人が現れた。その瞳には敵意ではなく、深い悲しみが宿っていた。",
          choices: [
            { text: "老人の話を聞く" },
            { text: "警戒を解かずに立ち去る" },
            { text: "老人が持っているものを調べる" }
          ]
        },
        {
          title: "知略の罠",
          text: "アレックスが仕掛けた音の罠に、何者かが引っかかった。小さな爆発音が響き、侵入者は驚いて逃げ出していく。",
          choices: [
            { text: "逃げた後を追跡する" },
            { text: "罠を再設置する" },
            { text: "再び読書に没頭する" }
          ]
        }
      ];
    } else {
      // Chris
      nextStories = [
        {
          title: "影の正体",
          text: "瓦礫を踏み越えて近づくと、影は低く唸り声を上げた。クリスの手が自然と剣の柄に伸びる。戦いは避けられそうにない。",
          choices: [
            { text: "戦闘態勢に入る (戦闘)" },
            { text: "一歩下がって距離を取る" },
            { text: "周囲に仲間がいないか探す" }
          ]
        },
        {
          title: "報告",
          text: "ディヴァンテはすぐに周囲を見回し、静かに頷いた。「焦るな。相手の出方を見るんだ」緊張した空気の中で、次の判断が必要になる。",
          choices: [
            { text: "ディヴァンテの指示を待つ" },
            { text: "先に安全な場所へ戻る" },
            { text: "影の動きを観察する" }
          ]
        },
        {
          title: "観察",
          text: "壊れた壁の陰に身を潜める。影は何かを探すように地面を嗅ぎ、やがて古い地下通路の入口へ向かった。",
          choices: [
            { text: "地下通路へ向かう" },
            { text: "目印を残して戻る" },
            { text: "もう少しだけ追跡する" }
          ]
        }
      ];
    }

    setCurrentStory(nextStories[choiceIndex] ?? nextStories[0]);
  };

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
                    className="flex items-center gap-2 h-9"
                    data-testid="button-inventory"
                  >
                    <Package className="w-4 h-4" />
                    <span>所持品</span>
                  </Button>
                  <Button 
                    onClick={onRelationshipsOpen}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 h-9"
                    data-testid="button-relationships"
                  >
                    <Users className="w-4 h-4" />
                    <span>人間関係</span>
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
                      onClick={() => handleStoryChoice(index)}
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
