import InventorySystem from '../InventorySystem'

export default function InventorySystemExample() {
  //todo: remove mock functionality
  const mockItems = [
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
      id: "armor1", 
      name: "革の胸当て",
      type: "armor" as const,
      description: "簡素な革製の防具。最低限の保護を提供する。",
      quantity: 1,
      rarity: "common" as const,
      stats: { defense: 8, health: 5 }
    },
    {
      id: "potion1",
      name: "回復薬",
      type: "consumable" as const,
      description: "HPを50回復する薬草から作った薬。",
      quantity: 5,
      rarity: "common" as const,
      stats: { health: 50 }
    },
    {
      id: "crystal1",
      name: "変異の結晶",
      type: "material" as const,
      description: "ミューテーター化の際に生成される神秘的な結晶。",
      quantity: 3,
      rarity: "rare" as const
    },
    {
      id: "sword2",
      name: "プラズマブレード",
      type: "weapon" as const,
      description: "戦争時代の高度な技術で作られた武器。エネルギーで切断する。",
      quantity: 1,
      rarity: "epic" as const,
      stats: { attack: 45, mana: 10 }
    },
    {
      id: "armor2",
      name: "フェリスベルタの実験服",
      type: "armor" as const,
      description: "母が着ていた科学者の服。放射線から守ってくれる。",
      quantity: 1,
      rarity: "legendary" as const,
      stats: { defense: 25, health: 20, mana: 15 }
    }
  ];

  return (
    <InventorySystem 
      items={mockItems}
      onItemUse={(item) => console.log(`Used item: ${item.name}`)}
      onClose={() => console.log('Inventory closed')}
    />
  )
}