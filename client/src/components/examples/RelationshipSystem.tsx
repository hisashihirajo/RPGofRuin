import RelationshipSystem from '../RelationshipSystem'
import divantePortraitUrl from "@assets/generated_images/Divante_character_portrait_7f9dc346.webp";
import soraPortraitUrl from "@assets/sora_portrait.webp";
import alexPortraitUrl from "@assets/alex_portrait.webp";

export default function RelationshipSystemExample() {
  //todo: remove mock functionality
  const mockRelationships = [
    {
      id: "divante",
      name: "ディヴァンテ",
      portraitUrl: divantePortraitUrl,
      relationshipType: "family" as const,
      affection: 85,
      maxAffection: 100,
      status: "alive" as const,
      description: "クリスの父親。元軍人で、現在は家族を守るために戦っている。クリスを深く愛し、世界の真実を教えてくれる。",
      lastInteraction: "今朝、朝食を一緒に食べた",
      memories: [
        {
          title: "初めての戦闘訓練",
          description: "ディヴァンテが剣の使い方を教えてくれた日",
          impact: "positive" as const
        },
        {
          title: "母の話",
          description: "フェリスベルタについて語り合った夜",
          impact: "positive" as const
        }
      ]
    },
    {
      id: "sora",
      name: "ソラ",
      portraitUrl: soraPortraitUrl,
      relationshipType: "friend" as const,
      affection: 70,
      maxAffection: 100,
      status: "alive" as const,
      description: "クリスの親友。不良気質だが、実際は仲間思いで優しい心を持っている。人間に対する偏見は少ない。",
      lastInteraction: "昨日、一緒に街を探索した",
      memories: [
        {
          title: "初めて出会った日",
          description: "ソラがクリスを他のミューテーターから守ってくれた",
          impact: "positive" as const
        },
        {
          title: "喧嘩した日",
          description: "人間についての考え方で言い争いになった",
          impact: "negative" as const
        }
      ]
    },
    {
      id: "alex",
      name: "アレックス", 
      portraitUrl: alexPortraitUrl,
      relationshipType: "friend" as const,
      affection: 65,
      maxAffection: 100,
      status: "alive" as const,
      description: "クリスのもう一人の親友。おとなしく慎重な性格で、いつも冷静な判断をしてくれる。知識が豊富。",
      lastInteraction: "一昨日、本について話し合った",
      memories: [
        {
          title: "図書館での発見",
          description: "アレックスが戦争前の本を見つけて一緒に読んだ",
          impact: "positive" as const
        },
        {
          title: "危険な実験",
          description: "アレックスの実験でちょっと危ない目にあった",
          impact: "neutral" as const
        }
      ]
    }
  ];

  return (
    <RelationshipSystem 
      relationships={mockRelationships}
      onTalkTo={(id) => console.log(`Talking to: ${id}`)}
      onGift={(id) => console.log(`Gifting to: ${id}`)}
      onClose={() => console.log('Relationships closed')}
    />
  )
}