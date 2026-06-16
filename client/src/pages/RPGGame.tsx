import { useEffect, useState } from "react";
import CharacterSelectionScreen from "@/components/CharacterSelectionScreen";
import GameInterface from "@/components/GameInterface";
import CombatInterface from "@/components/CombatInterface";
import InventorySystem from "@/components/InventorySystem";
import RelationshipSystem from "@/components/RelationshipSystem";
import MapInterface from "@/components/MapInterface";
import LocalMapInterface from "@/components/LocalMapInterface";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import chrisPortraitUrl from "@assets/chris_portrait.webp";
import soraPortraitUrl from "@assets/sora_portrait.webp";
import alexPortraitUrl from "@assets/alex_portrait.webp";
import tyrPortraitUrl from "@assets/tyr_portrait.webp";
import divantePortraitUrl from "@assets/generated_images/Divante_character_portrait_7f9dc346.webp";

type GameState = "character-selection" | "main-game" | "combat" | "inventory" | "relationships" | "map" | "local-map";

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

const SAVE_KEY = "rpg-of-ruin-save-v1";

interface SavedGame {
  gameState: GameState;
  selectedCharacter: Character | null;
  currentLocation: string;
  relationships: any[];
}

export default function RPGGame() {
  const { toast } = useToast();
  const savedGame = loadSavedGame();
  
  const [gameState, setGameState] = useState<GameState>(savedGame?.gameState ?? "character-selection");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(savedGame?.selectedCharacter ?? null);
  const [currentLocation, setCurrentLocation] = useState<string>(savedGame?.currentLocation ?? "safe_shelter");

  // Initial mock relationships
  const defaultRelationships = [
    {
      id: "divante",
      name: "ディヴァンテ",
      portraitUrl: divantePortraitUrl,
      relationshipType: "family" as const,
      affection: 85,
      maxAffection: 100,
      status: "alive" as const,
      description: "クリスの父親。元軍人で、現在は家族を守るために戦っている。",
      lastInteraction: "今朝、朝食を一緒に食べた",
      memories: [
        {
          title: "戦闘訓練",
          description: "ディヴァンテが剣の使い方を教えてくれた",
          impact: "positive" as const
        }
      ]
    },
    {
      id: "sora",
      name: "ソラ",
      portraitUrl: soraPortraitUrl,
      relationshipType: "friend" as const,
      affection: 65,
      maxAffection: 100,
      status: "alive" as const,
      description: "生まれつきのミューテーターの少女。粗野で不良気質だが、筋の通らないことは嫌う熱い奴。",
      lastInteraction: "昨日、一緒に廃墟を探索した",
      memories: [
        {
          title: "雨宿り",
          description: "突然の雨に降られ、二人で古いバスの中で雨宿りをした",
          impact: "positive" as const
        }
      ]
    },
    {
      id: "alex",
      name: "アレックス",
      portraitUrl: alexPortraitUrl,
      relationshipType: "friend" as const,
      affection: 45,
      maxAffection: 100,
      status: "alive" as const,
      description: "おとなしく慎重な性格のミューテーター。読書と観察が趣味の博識な少年。",
      lastInteraction: "三日前、珍しい植物を見つけたと教えてくれた",
      memories: [
        {
          title: "秘密の場所",
          description: "アレックスが見つけた、静かな地下庭園を案内してもらった",
          impact: "positive" as const
        }
      ]
    },
    {
      id: "tyr",
      name: "ティアー",
      portraitUrl: tyrPortraitUrl,
      relationshipType: "mentor" as const,
      affection: 50,
      maxAffection: 100,
      status: "alive" as const,
      description: "ディヴァンテの軍人時代の友人。ミューテーター化したが、強い意志で理性を保っている。",
      lastInteraction: "先日、街のパトロール中に再会した",
      memories: [
        {
          title: "かつての誓い",
          description: "軍人時代、共に国を守ると誓い合った記憶",
          impact: "positive" as const
        }
      ]
    }
  ];

  const [relationships, setRelationships] = useState<any[]>(savedGame?.relationships ?? defaultRelationships);

  useEffect(() => {
    const safeGameState = selectedCharacter ? gameState : "character-selection";

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        gameState: safeGameState,
        selectedCharacter,
        currentLocation,
        relationships,
      } satisfies SavedGame),
    );
  }, [gameState, selectedCharacter, currentLocation, relationships]);

  const handleTalkTo = (id: string) => {
    setRelationships(prev => prev.map(rel => 
      rel.id === id 
        ? { ...rel, affection: Math.min(rel.maxAffection, rel.affection + 1), lastInteraction: "たった今話した" } 
        : rel
    ));
  };

  const handleGift = (id: string) => {
    setRelationships(prev => prev.map(rel => 
      rel.id === id 
        ? { ...rel, affection: Math.min(rel.maxAffection, rel.affection + 5), lastInteraction: "贈り物をした" } 
        : rel
    ));
    const rel = relationships.find(r => r.id === id);
    toast({
      title: "好感度アップ",
      description: `${rel?.name}に贈り物をし、絆が深まった！`,
    });
  };

  const convertToGameCharacter = (character: any): Character => {
    return {
      ...character,
      level: 1,
      health: character.stats.health,
      maxHealth: character.stats.health,
      mana: Math.floor(character.stats.intelligence * 0.6),
      maxMana: Math.floor(character.stats.intelligence * 0.6),
      experience: 0,
      nextLevelExp: 100
    };
  };

  const mockInventoryItems = [
    {
      id: "sword1",
      name: "古い鉄剣",
      type: "weapon" as const,
      description: "戦争前の時代から残る古い剣。まだ使えそうだ。",
      quantity: 1,
      rarity: "common" as const,
      stats: { attack: 15, defense: 2 }
    },
    {
      id: "potion1",
      name: "回復薬",
      type: "consumable" as const,
      description: "HPを50回復する薬草から作った薬。",
      quantity: 3,
      rarity: "common" as const,
      stats: { health: 50 }
    }
  ];

  const mockCombatData = {
    allies: [
      {
        id: selectedCharacter?.id || "chris",
        name: selectedCharacter?.name || "クリス",
        portraitUrl: selectedCharacter?.portraitUrl || chrisPortraitUrl,
        health: selectedCharacter?.health || 85,
        maxHealth: selectedCharacter?.maxHealth || 100,
        mana: selectedCharacter?.mana || 40,
        maxMana: selectedCharacter?.maxMana || 50,
        speed: selectedCharacter?.stats?.agility || 75,
        type: "ally" as const,
        abilities: [
          {
            name: "ルインブレイザー",
            cost: 6,
            damage: 30,
            description: "崩壊粒子を刃に乗せて斬り込む単体攻撃",
            kind: "strike" as const,
            target: "enemy" as const,
          },
          {
            name: "ネオン・スパーク",
            cost: 9,
            damage: 34,
            description: "光る異能の雷で敵を焼く高威力スキル",
            kind: "arcane" as const,
            target: "enemy" as const,
          },
          {
            name: "アストラルリペア",
            cost: 10,
            damage: 38,
            description: "体内の星脈を整えてHPを回復する",
            kind: "heal" as const,
            target: "self" as const,
          },
          {
            name: "ミラージュガード",
            cost: 5,
            damage: 0,
            description: "幻光の膜で次の被ダメージを大きく抑える",
            kind: "guard" as const,
            target: "self" as const,
          }
        ]
      }
    ],
    enemies: [
      {
        id: "mutant1",
        name: "狂暴なミューテーター",
        health: 80,
        maxHealth: 80,
        mana: 20,
        maxMana: 20,
        speed: 60,
        type: "enemy" as const,
        abilities: []
      }
    ]
  };

  const handleCharacterSelect = (character: any) => {
    const gameChar = convertToGameCharacter(character);
    setSelectedCharacter(gameChar);
    setGameState("main-game");
  };

  const handleBackToCharacterSelect = () => {
    setSelectedCharacter(null);
    setGameState("character-selection");
  };

  const handlePartyUpdate = (allies: Array<Pick<Character, "id" | "health" | "mana">>) => {
    const updatedCharacter = allies.find((ally) => ally.id === selectedCharacter?.id);
    if (!updatedCharacter) return;

    setSelectedCharacter((current) =>
      current
        ? {
            ...current,
            health: updatedCharacter.health,
            mana: updatedCharacter.mana,
          }
        : current,
    );
  };

  const handleVictory = (experienceGained: number) => {
    setSelectedCharacter((current) => {
      if (!current) return current;

      let level = current.level;
      let experience = current.experience + experienceGained;
      let nextLevelExp = current.nextLevelExp;
      let maxHealth = current.maxHealth;
      let maxMana = current.maxMana;
      let stats = { ...current.stats };

      while (experience >= nextLevelExp) {
        experience -= nextLevelExp;
        level += 1;
        nextLevelExp = Math.floor(nextLevelExp * 1.35);
        maxHealth += 12;
        maxMana += 5;
        stats = {
          strength: stats.strength + 3,
          intelligence: stats.intelligence + 3,
          agility: stats.agility + 2,
        };
      }

      return {
        ...current,
        level,
        experience,
        nextLevelExp,
        maxHealth,
        maxMana,
        health: maxHealth,
        mana: maxMana,
        stats,
      };
    });

    setGameState("main-game");
  };

  if (gameState === "character-selection") {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <CharacterSelectionScreen onCharacterSelect={handleCharacterSelect} />
      </div>
    );
  }

  if (!selectedCharacter) {
    return <div>Error: No character selected</div>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* Back to Character Selection - for demo purposes */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={handleBackToCharacterSelect}
          className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded hover-elevate"
          data-testid="button-back-to-selection"
        >
          ← キャラ選択に戻る
        </button>
      </div>

      {/* Main Game States */}
      {gameState === "main-game" && (
        <GameInterface
          character={selectedCharacter}
          currentLocation={currentLocation}
          onCombatStart={() => setGameState("combat")}
          onInventoryOpen={() => setGameState("inventory")}
          onMapOpen={() => setGameState("map")}
          onLocalMapOpen={() => setGameState("local-map")}
          onRelationshipsOpen={() => setGameState("relationships")}
        />
      )}

      {gameState === "combat" && (
        <CombatInterface
          allies={mockCombatData.allies}
          enemies={mockCombatData.enemies}
          currentTurn={selectedCharacter.id}
          onAction={(action, targetId) => console.log(`Action: ${action}, Target: ${targetId}`)}
          onEscape={() => setGameState("main-game")}
          onPartyUpdate={handlePartyUpdate}
          onVictory={handleVictory}
        />
      )}

      {gameState === "inventory" && (
        <InventorySystem
          items={mockInventoryItems}
          onItemUse={(item) => {
            toast({
              title: "アイテム使用",
              description: `${item.name}を使用しました。`,
            });
            console.log(`Used item: ${item.name}`);
          }}
          onClose={() => setGameState("main-game")}
        />
      )}

      {gameState === "relationships" && (
        <RelationshipSystem
          relationships={relationships}
          onTalkTo={handleTalkTo}
          onGift={handleGift}
          onClose={() => setGameState("main-game")}
        />
      )}

      {gameState === "map" && (
        <MapInterface
          currentLocation={currentLocation}
          onLocationSelect={(locationId) => {
            setCurrentLocation(locationId);
            setGameState("main-game");
          }}
          onClose={() => setGameState("main-game")}
        />
      )}

      {gameState === "local-map" && (
        <LocalMapInterface
          locationId={currentLocation}
          onInteract={(pointId) => {
            console.log(`Interacting with: ${pointId}`);
          }}
          onExit={() => setGameState("main-game")}
          onWorldMap={() => setGameState("map")}
        />
      )}
    </div>
  );
}

function loadSavedGame(): SavedGame | null {
  if (typeof window === "undefined") return null;

  try {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) return null;

    const saved = JSON.parse(rawSave) as SavedGame;
    if (!saved.selectedCharacter) return null;

    return saved;
  } catch {
    return null;
  }
}
