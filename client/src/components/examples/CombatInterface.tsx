import CombatInterface from '../CombatInterface'
import chrisPortraitUrl from "@assets/generated_images/Chris_character_portrait_c5374e0f.png";
import soraPortraitUrl from "@assets/generated_images/Sora_character_portrait_93173527.png";

export default function CombatInterfaceExample() {
  //todo: remove mock functionality
  const mockAllies = [
    {
      id: "chris",
      name: "クリス",
      portraitUrl: chrisPortraitUrl,
      health: 85,
      maxHealth: 100,
      mana: 40,
      maxMana: 50,
      speed: 75,
      type: "ally" as const,
      abilities: [
        { name: "剣撃", cost: 5, damage: 25, description: "基本的な剣攻撃" },
        { name: "回復", cost: 10, damage: 0, description: "HPを20回復" },
        { name: "集中", cost: 15, damage: 35, description: "強力な一撃" }
      ]
    },
    {
      id: "sora",
      name: "ソラ",
      portraitUrl: soraPortraitUrl,
      health: 95,
      maxHealth: 120,
      mana: 25,
      maxMana: 40,
      speed: 85,
      type: "ally" as const,
      abilities: [
        { name: "爪撃", cost: 3, damage: 20, description: "素早い爪攻撃" },
        { name: "叫び", cost: 8, damage: 15, description: "敵を怯ませる" },
        { name: "突進", cost: 12, damage: 40, description: "全力の体当たり" }
      ]
    }
  ];

  const mockEnemies = [
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
    },
    {
      id: "mutant2", 
      name: "感染体",
      health: 50,
      maxHealth: 60,
      mana: 15,
      maxMana: 15,
      speed: 90,
      type: "enemy" as const,
      abilities: []
    }
  ];

  return (
    <CombatInterface 
      allies={mockAllies}
      enemies={mockEnemies}
      currentTurn="chris"
      onAction={(action, targetId) => console.log(`Action: ${action}, Target: ${targetId}`)}
      onEscape={() => console.log('Escaped from combat')}
    />
  )
}