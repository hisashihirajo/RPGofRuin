import CombatInterface from '../CombatInterface'
import chrisPortraitUrl from "@assets/chris_portrait.png";
import soraPortraitUrl from "@assets/sora_portrait.png";

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
        { name: "ルインブレイザー", cost: 6, damage: 30, description: "崩壊粒子を刃に乗せる", kind: "strike" as const, target: "enemy" as const },
        { name: "ネオン・スパーク", cost: 9, damage: 34, description: "光る異能の雷撃", kind: "arcane" as const, target: "enemy" as const },
        { name: "アストラルリペア", cost: 10, damage: 38, description: "HPを回復する", kind: "heal" as const, target: "self" as const }
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
        { name: "クロウ・ラッシュ", cost: 4, damage: 24, description: "素早い連続爪撃", kind: "strike" as const, target: "enemy" as const },
        { name: "ヴォイドハウル", cost: 8, damage: 30, description: "空間を震わせる咆哮", kind: "arcane" as const, target: "enemy" as const },
        { name: "ミラージュガード", cost: 5, damage: 0, description: "次の被ダメージを抑える", kind: "guard" as const, target: "self" as const }
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
