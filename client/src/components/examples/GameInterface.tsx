import GameInterface from '../GameInterface'
import chrisPortraitUrl from "@assets/chris_portrait.png";

export default function GameInterfaceExample() {
  const mockCharacter = {
    id: "chris",
    name: "クリス・アッシュリー・グレイヴソウル",
    type: "human" as const,
    portraitUrl: chrisPortraitUrl,
    level: 3,
    health: 85,
    maxHealth: 100,
    mana: 40,
    maxMana: 50,
    experience: 150,
    nextLevelExp: 200,
    stats: {
      strength: 70,
      intelligence: 85,
      agility: 75
    }
  };

  return (
    <GameInterface 
      character={mockCharacter}
      onCombatStart={() => console.log('Combat started')}
      onInventoryOpen={() => console.log('Inventory opened')}
      onMapOpen={() => console.log('Map opened')}
      onRelationshipsOpen={() => console.log('Relationships opened')}
    />
  )
}