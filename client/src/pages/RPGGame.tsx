import { useState } from "react";
import CharacterSelectionScreen from "@/components/CharacterSelectionScreen";
import GameInterface from "@/components/GameInterface";
import CombatInterface from "@/components/CombatInterface";
import InventorySystem from "@/components/InventorySystem";
import RelationshipSystem from "@/components/RelationshipSystem";
import MapInterface from "@/components/MapInterface";
import LocalMapInterface from "@/components/LocalMapInterface";
import ThemeToggle from "@/components/ThemeToggle";
import chrisPortraitUrl from "@assets/chris_portrait.png";
import soraPortraitUrl from "@assets/sora_portrait.png";
import alexPortraitUrl from "@assets/alex_portrait.png";
import divantePortraitUrl from "@assets/generated_images/Divante_character_portrait_7f9dc346.png";

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

export default function RPGGame() {
  const [gameState, setGameState] = useState<GameState>("character-selection");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>("safe_shelter");

  // todo: remove mock functionality - convert character selection data to game character format
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

  // todo: remove mock functionality
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

  // todo: remove mock functionality
  const mockRelationships = [
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
    }
  ];

  // todo: remove mock functionality
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
          { name: "剣撃", cost: 5, damage: 25, description: "基本的な剣攻撃" },
          { name: "回復", cost: 10, damage: 0, description: "HPを20回復" }
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
        />
      )}

      {gameState === "inventory" && (
        <InventorySystem
          items={mockInventoryItems}
          onItemUse={(item) => console.log(`Used item: ${item.name}`)}
          onClose={() => setGameState("main-game")}
        />
      )}

      {gameState === "relationships" && (
        <RelationshipSystem
          relationships={mockRelationships}
          onTalkTo={(id) => console.log(`Talking to: ${id}`)}
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
            // Future: Handle specific interactions based on point type
          }}
          onExit={() => setGameState("main-game")}
          onWorldMap={() => setGameState("map")}
        />
      )}
    </div>
  );
}