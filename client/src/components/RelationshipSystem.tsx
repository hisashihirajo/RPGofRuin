import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, X, MessageCircle, Package } from "lucide-react";

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
  onGift: (relationshipId: string) => void;
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
  onGift,
  onClose 
}: RelationshipSystemProps) {
  const [activeDialogue, setActiveDialogue] = useState<{name: string, text: string, type: 'talk' | 'gift'} | null>(null);
  const [lastLines, setLastLines] = useState<Record<string, string>>({});

  const getAffectionLevel = (relationship: Relationship) => {
    const percentage = (relationship.affection / relationship.maxAffection) * 100;
    
    // Special ranks for Sora and Alex
    if (relationship.name === "ソラ" || relationship.name === "アレックス") {
      if (percentage >= 100) return { label: "好感度MAX", color: "text-primary font-bold animate-pulse" };
      if (percentage >= 75) return { label: "気になる相手", color: "text-chart-2" };
      if (percentage >= 40) return { label: "友達", color: "text-chart-4" };
      return { label: "知り合い", color: "text-muted-foreground" };
    }

    // Default ranks for others
    if (percentage >= 80) return { label: "深い絆", color: "text-chart-2" };
    if (percentage >= 60) return { label: "親密", color: "text-chart-4" };
    if (percentage >= 40) return { label: "友好的", color: "text-primary" };
    if (percentage >= 20) return { label: "普通", color: "text-muted-foreground" };
    return { label: "冷淡", color: "text-destructive" };
  };

  const handleTalk = (relationship: Relationship) => {
    onTalkTo(relationship.id);
    const percentage = (relationship.affection / relationship.maxAffection) * 100;
    let text = "";

    const getRandomUniqueLine = (lines: string[], charId: string) => {
      const lastLine = lastLines[charId];
      const availableLines = lines.filter(line => line !== lastLine);
      const chosenLine = availableLines[Math.floor(Math.random() * availableLines.length)] || lines[0];
      setLastLines(prev => ({ ...prev, [charId]: chosenLine }));
      return chosenLine;
    };

    // Character-specific dialogue logic with tiers and randomization
    if (relationship.id === "divante") {
      if (percentage >= 80) {
        text = getRandomUniqueLine([
          `「クリス、背中を任せたぞ。お前が立派な戦士として成長したこと、俺の誇りだ。共に行こう、この世界の果てまでな。」`,
          `「お前の剣筋、かつての俺を超えつつあるな。だが奢るなよ。常に高みを目指せ。」`,
          `「...こうしてお前と話していると、平和だった頃を思い出す。この日常を守るのが、俺の最後の任務だ。」`,
          `「強くなったな、クリス。だが、強さだけが全てじゃない。守るべきもののために振るう剣であることを忘れるな。」`
        ], relationship.id);
      } else if (percentage >= 40) {
        text = getRandomUniqueLine([
          `「甘えるな、クリス。戦場では一瞬の迷いが命取りになる。常に周囲を警戒し、最悪を想定して動け。分かったな？」`,
          `「休息も訓練のうちだ。だが、心まで弛ませるなよ。敵は常に隙を伺っている。」`,
          `「この世界は過酷だ。だが、絶望に飲み込まれるな。前を見据え、一歩ずつ進むんだ。」`
        ], relationship.id);
      } else {
        text = getRandomUniqueLine([
          `「...今は作戦行動中だ。私語は慎め。報告があるなら簡潔にまとめろ。軍人として、当然の振る舞いだ。」`,
          `「訓練に戻れ。お喋りをしている暇があるなら、体を動かせ。」`,
          `「...馴れ合うつもりはない。お前も自分の役割を果たせ。」`
        ], relationship.id);
      }
    } else if (relationship.name === "ソラ") {
      if (percentage >= 100) {
        text = getRandomUniqueLine([
          `「...おい、クリス。俺がここまで誰かを信じられるようになるなんて、思ってもみなかったぜ。お前は...特別なんだよ。ずっと、俺のそばにいろ。分かったな？」`,
          `「世界がどうなろうと知るかよ。俺はお前がいればそれでいい。お前の盾にも、矛にもなってやる。だから...俺の手を離すんじゃねえぞ。」`,
          `「へへっ、なんだよ。そんなに見つめんなって...照れるだろ。お前といる時が、俺にとって一番『生きてる』って実感できる瞬間なんだ。」`
        ], relationship.id);
      } else if (percentage >= 75) {
        text = getRandomUniqueLine([
          `「最近さ、お前のことばっか考えちまうんだよな。ったく、調子狂うぜ。これって...どういうことなんだろうな？」`,
          `「おいクリス。今度の非番、空けとけよ。お前と行きたい場所があるんだ。二人っきりでな...。」`,
          `「お前さ、他の奴と話してる時、楽しそうだよな。...いや、別に嫉妬とかじゃねえよ！ 勘違いすんな！」`
        ], relationship.id);
      } else if (percentage >= 40) {
        text = getRandomUniqueLine([
          `「お前、案外やるじゃねえか。俺が認めたんだ、もっと胸張りな。ほら、行くぞ！」`,
          `「よお、クリス。相変わらずクソ真面目なツラしてんな。たまには肩の力抜けよ、な？」`,
          `「へへっ、お前といると退屈しねえよな。これからも俺の隣、空けとけよ？」`
        ], relationship.id);
      } else {
        text = getRandomUniqueLine([
          `「あ？何見てんだよ。用がねえならどっか行け。俺は忙しいんだよ。」`,
          `「チッ、また人間かよ...。馴れ難く近づくんじゃねえよ。」`,
          `「...何か用か？手短にしろよ、イライラさせんな。」`
        ], relationship.id);
      }
    } else if (relationship.name === "アレックス") {
      if (percentage >= 100) {
        text = getRandomUniqueLine([
          `「クリスくん...君は僕にとって、暗闇を照らす唯一の光なんだ。君なしの未来なんて、もう考えられない。僕の人生、全部君に預けるよ。」`,
          `「言葉にするのは難しいけど...君を愛してる。ミューテーターとか人間とか、そんなのどうでもいいくらいに。君という存在そのものが、僕の全てなんだ。」`,
          `「君の隣が、僕の居場所。そう確信してるんだ。たとえ世界中が君の敵になっても、僕は最後まで君の味方でいるよ。」`
        ], relationship.id);
      } else if (percentage >= 75) {
        text = getRandomUniqueLine([
          `「クリスくんの声を聞くだけで、胸の奥が熱くなるんだ。こんな気持ち、初めてで...。君は、僕のことをどう思ってる？」`,
          `「君のことをもっと知りたい。君の好きなもの、嫌いなもの、全部教えてほしいんだ。君の特別な一人に...なれたら嬉しいな。」`,
          `「夜、眠りにつく前に君のことを思い出すんだ。明日も君に会えますようにって。...変かな？」`
        ], relationship.id);
      } else if (percentage >= 40) {
        text = getRandomUniqueLine([
          `「クリスくん...君がそばにいてくれると、僕は...とても安心できるんだ。いつも、ありがとう。」`,
          `「この本、読み終わったら君に貸すよ。きっと君も気に入ると思うんだ。感想を聞かせてね。」`,
          `「君となら、いつかこの世界の真実を解き明かせる気がするんだ。僕も精一杯サポートするよ。」`
        ], relationship.id);
      } else {
        text = getRandomUniqueLine([
          `「あ、えっと...ごめんね。今は一人で静かにしていたいんだ。また、今度にしてくれるかな...。」`,
          `「...ごめんなさい。今は考え事をしているんだ。邪魔しないでくれるかな。」`,
          `「...人間と話すのは、まだ少し慣れないんだ。少し距離を置いてくれると助かるよ。」`
        ], relationship.id);
      }
    } else if (relationship.id === "tyr" || relationship.name === "ティアー") {
      if (percentage >= 80) {
        text = getRandomUniqueLine([
          `「ディヴァンテの息子が、ここまで立派になるとはな...。お前の正義、俺が最後まで見届けさせてもらうぞ。」`,
          `「かつての戦場を思い出すな...。だがあの時と違うのは、お前という希望が俺たちの側にいることだ。」`,
          `「戦士としての誇りを忘れるな。お前の振るう一撃が、明日を作る礎になるんだ。」`
        ], relationship.id);
      } else if (percentage >= 40) {
        text = getRandomUniqueLine([
          `「よぉ、クリス。ディヴァンテは相変わらずか？あいつも不器用な男だが、お前のことは心から大切に思っているはずだ。」`,
          `「この体になっても、守るべきものは変わらん。お前たち若い世代が生きる道を、俺たちが切り拓く。」`,
          `「何か悩みがあるのか？ 俺でよければ相談に乗るぞ。戦い以外のこともな。」`
        ], relationship.id);
      } else {
        text = getRandomUniqueLine([
          `「...俺のようなミューテーターが、あまり人間に近づくべきじゃない。ディヴァンテに迷惑はかけたくないからな。」`,
          `「昔の話をしてどうなる...。今はただ、生き延びることだけを考えろ。」`,
          `「...部外者は去れ。俺にはまだ、やらねばならんことがある。」`
        ], relationship.id);
      }
    } else {
      // Default generic dialogue
      if (percentage >= 80) text = getRandomUniqueLine([`「いつも頼りにしてるよ。君となら、どんな困難も乗り越えられる気がするんだ。」`, `「君がいてくれて本当によかった。最高のパートナーだよ。」`], relationship.id);
      else if (percentage >= 40) text = getRandomUniqueLine([`「やあ、最近の調子はどうだい？無理はしすぎないようにな。」`, `「調子はどう？何かあったら相談してね。」`], relationship.id);
      else text = getRandomUniqueLine([`「...何か用か？今は少し忙しいんだ。」`, `「悪いが、今は手が離せないんだ。また後にしてくれ。」`], relationship.id);
    }

    setActiveDialogue({
      name: relationship.name,
      text: text,
      type: 'talk'
    });
  };

  const handleGift = (relationship: Relationship) => {
    onGift(relationship.id);
    let text = "";
    const percentage = (relationship.affection / relationship.maxAffection) * 100;

    if (relationship.id === "divante") {
      text = `「...これを俺に？ ありがたく受け取っておこう。お前の気遣い、無駄にはせん。」`;
    } else if (relationship.name === "ソラ") {
      if (percentage >= 75) text = `「お、おい...こんな高いもんいいのかよ。大事にするに決まってんだろ。...サンキュな、クリス。」`;
      else text = `「えっ、あたしに？ ...ふーん、悪くないじゃん。ありがと、大事にするよ。」`;
    } else if (relationship.name === "アレックス") {
      if (percentage >= 75) text = `「僕のためにこんなに素敵なものを...。君の優しさが心に沁みるよ。一生の宝物にするね。」`;
      else text = `「わあ、素敵なプレゼントだね。僕のために選んでくれたの？ ...とっても嬉しいよ。」`;
    } else if (relationship.id === "tyr" || relationship.name === "ティアー") {
      text = `「贈り物か。かつての戦友を思い出すな...。感謝する、クリス。」`;
    } else {
      text = `「わあ、ありがとう！大切に使わせてもらうね。」`;
    }

    setActiveDialogue({
      name: relationship.name,
      text: text,
      type: 'gift'
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            人間関係
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose} data-testid="button-close-relationships">
            <X className="w-4 h-4 mr-2" />
            閉じる
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-auto flex-1 p-6 space-y-4">
          {activeDialogue ? (
            <div className="bg-muted/50 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{activeDialogue.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">{activeDialogue.name}</h4>
                    <Badge variant="outline" className="text-[10px]">
                      {activeDialogue.type === 'talk' ? '会話' : '贈り物'}
                    </Badge>
                  </div>
                </div>
                {activeDialogue.type === 'talk' && (
                  <div className="flex items-center gap-1 text-primary animate-bounce">
                    <Heart className="w-4 h-4 fill-primary" />
                    <span className="text-xs font-bold">+1</span>
                  </div>
                )}
                {activeDialogue.type === 'gift' && (
                  <div className="flex items-center gap-1 text-primary animate-bounce">
                    <Heart className="w-4 h-4 fill-primary" />
                    <span className="text-xs font-bold">+5</span>
                  </div>
                )}
              </div>
              <p className="text-xl italic font-serif leading-relaxed mb-6 min-h-24">
                {activeDialogue.text}
              </p>
              <Button onClick={() => setActiveDialogue(null)} className="w-full">
                {activeDialogue.type === 'talk' ? '会話を終える' : '喜んでもらえたようだ'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relationships.map((relationship) => {
                const affectionLevel = getAffectionLevel(relationship);
                
                return (
                  <Card key={relationship.id} className="hover-elevate overflow-hidden border-border/50">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Portrait Section */}
                        <div className="w-full sm:w-32 bg-muted flex items-center justify-center p-4">
                          <Avatar className="w-20 h-20 border-2 border-background shadow-lg">
                            <AvatarImage src={relationship.portraitUrl} alt={relationship.name} />
                            <AvatarFallback className="text-2xl">
                              {relationship.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h3 className="font-bold">{relationship.name}</h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge 
                                  variant="secondary"
                                  className={`${relationshipTypeColors[relationship.relationshipType]} text-white text-[10px] px-1.5 h-4`}
                                >
                                  {relationship.name === "ソラ" || relationship.name === "アレックス" 
                                    ? affectionLevel.label 
                                    : relationshipTypeLabels[relationship.relationshipType]}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] px-1.5 h-4">
                                  {relationship.status === "alive" ? "生存" : 
                                  relationship.status === "missing" ? "行方不明" : "不明"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                onClick={() => handleTalk(relationship)}
                                size="sm"
                                className="h-8"
                                data-testid={`button-talk-${relationship.id}`}
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                話す
                              </Button>
                              <Button 
                                onClick={() => handleGift(relationship)}
                                size="sm"
                                variant="outline"
                                className="h-8 border-primary/50 text-primary hover:bg-primary/10"
                                data-testid={`button-gift-${relationship.id}`}
                              >
                                <Package className="w-3 h-3 mr-1" />
                                贈る
                              </Button>
                            </div>
                          </div>

                          {/* Affection Level */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1 opacity-70">
                                <Heart className="w-3 h-3 text-primary fill-primary" />
                                <span>親密度</span>
                              </div>
                              <span className={`font-semibold ${affectionLevel.color}`}>
                                {affectionLevel.label} ({relationship.affection}/{relationship.maxAffection})
                              </span>
                            </div>
                            <Progress 
                              value={(relationship.affection / relationship.maxAffection) * 100} 
                              className="h-1.5" 
                            />
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 italic">
                            "{relationship.description}"
                          </p>

                          {/* Memories Preview */}
                          {relationship.memories.length > 0 && (
                            <div className="flex gap-1 pt-1 overflow-hidden">
                              {relationship.memories.slice(0, 3).map((memory, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    memory.impact === "positive" ? "bg-chart-2" :
                                    memory.impact === "negative" ? "bg-destructive" : "bg-muted"
                                  }`}
                                  title={memory.title}
                                />
                              ))}
                              <span className="text-[9px] text-muted-foreground ml-1">
                                思い出: {relationship.memories.length}件
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
