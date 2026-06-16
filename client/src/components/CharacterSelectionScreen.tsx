import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import chrisPortraitUrl from "@assets/chris_portrait.webp";
import soraPortraitUrl from "@assets/sora_portrait.webp";
import alexPortraitUrl from "@assets/alex_portrait.webp";
import worldBackgroundUrl from "@assets/generated_images/Post-apocalyptic_world_overview_scene_51792660.webp";

interface Character {
  id: string;
  name: string;
  description: string;
  type: "human" | "mutator";
  portraitUrl: string;
  stats: {
    health: number;
    strength: number;
    intelligence: number;
    agility: number;
  };
}

interface CharacterSelectionScreenProps {
  onCharacterSelect: (character: Character) => void;
}

const availableCharacters: Character[] = [
  {
    id: "chris",
    name: "クリス・アッシュリー・グレイヴソウル",
    description: "戦争後に生まれた人間の少年。両親の愛情に育まれ、ミューテーターとの共存を信じている。",
    type: "human",
    portraitUrl: chrisPortraitUrl,
    stats: { health: 100, strength: 70, intelligence: 85, agility: 75 }
  },
  {
    id: "sora",
    name: "ソラ",
    description: "生まれつきのミューテーター。不良気質だが、クリスとは深い友情で結ばれている。",
    type: "mutator",
    portraitUrl: soraPortraitUrl,
    stats: { health: 120, strength: 90, intelligence: 65, agility: 85 }
  },
  {
    id: "alex",
    name: "アレックス",
    description: "ソラとは対照的におとなしい性格のミューテーター。知性と慎重さで仲間を支える。",
    type: "mutator",
    portraitUrl: alexPortraitUrl,
    stats: { health: 110, strength: 60, intelligence: 95, agility: 70 }
  }
];

export default function CharacterSelectionScreen({ onCharacterSelect }: CharacterSelectionScreenProps) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${worldBackgroundUrl})` }}
    >
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary-foreground mb-4">
            終焉化した世界に終止符を
          </h1>
          <p className="text-lg text-muted-foreground">
            キャラクターを選択してください
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableCharacters.map((character) => (
            <Card key={character.id} className="hover-elevate cursor-pointer bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-2 border-primary">
                  <AvatarImage src={character.portraitUrl} alt={character.name} />
                  <AvatarFallback className="text-2xl">
                    {character.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {character.name}
                </h3>
                
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-3" 
                     style={{ 
                       backgroundColor: character.type === "human" ? "hsl(var(--chart-2))" : "hsl(var(--primary))",
                       color: character.type === "human" ? "white" : "hsl(var(--primary-foreground))"
                     }}>
                  {character.type === "human" ? "人間" : "ミューテーター"}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {character.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">体力:</span>
                    <span className="font-mono">{character.stats.health}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">力:</span>
                    <span className="font-mono">{character.stats.strength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">知性:</span>
                    <span className="font-mono">{character.stats.intelligence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">敏捷:</span>
                    <span className="font-mono">{character.stats.agility}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onCharacterSelect(character)}
                  className="w-full"
                  data-testid={`button-select-${character.id}`}
                >
                  選択
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}