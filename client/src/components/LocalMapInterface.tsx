import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight, Search, Users, Package } from "lucide-react";

// Import local map images - Updated with area-specific detailed maps
import safeShelterMap from "@assets/generated_images/Safe_shelter_interior_map_e91461c3.png";
import ruinedCityMap from "@assets/generated_images/Ruined_city_exploration_map_595fa71d.png";
import mutatorSettlementMap from "@assets/generated_images/Mutator_settlement_community_map_63779bed.png";
import industrialRuinsMap from "@assets/generated_images/Industrial_ruins_factory_map_1dc26719.png";
import undergroundLabMap from "@assets/generated_images/Underground_research_lab_map_76cb2c40.png";
import oldBattlefieldMap from "@assets/generated_images/Old_battlefield_war_map_d3bc0dc1.png";

interface InteractionPoint {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  type: "npc" | "item" | "exit" | "story" | "shop";
  isAccessible: boolean;
  requirement?: string;
}

interface MapData {
  name: string;
  mapImage: string;
  description: string;
  points: InteractionPoint[];
}

interface LocalMapInterfaceProps {
  locationId: string;
  onInteract: (pointId: string) => void;
  onExit: () => void;
  onWorldMap: () => void;
}

export default function LocalMapInterface({ 
  locationId, 
  onInteract, 
  onExit,
  onWorldMap 
}: LocalMapInterfaceProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: 20, y: 80 }); // Start near entrance
  const [nearbyPoint, setNearbyPoint] = useState<InteractionPoint | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");

  // Get map data based on location
  const getMapData = (): MapData => {
    switch (locationId) {
      case "safe_shelter":
        return {
          name: "安全な避難所",
          mapImage: safeShelterMap,
          description: "ディヴァンテが見つけた隠れ家。安全で快適な生活空間。",
          points: [
            { id: "exit", name: "出口", description: "外の世界に戻る", x: 20, y: 85, type: "exit" as const, isAccessible: true },
            { id: "divante", name: "ディヴァンテ", description: "父親のディヴァンテが休んでいる", x: 60, y: 40, type: "npc" as const, isAccessible: true },
            { id: "storage", name: "保管庫", description: "物資が保管されている", x: 80, y: 60, type: "item" as const, isAccessible: true },
            { id: "workshop", name: "作業場", description: "武器や道具を修理できる", x: 40, y: 20, type: "shop" as const, isAccessible: true },
            { id: "bed", name: "ベッド", description: "休憩してHPを回復できる", x: 70, y: 70, type: "story" as const, isAccessible: true }
          ]
        };
      
      case "ruined_city":
        return {
          name: "廃墟の街",
          mapImage: ruinedCityMap,
          description: "破壊された街並み。まだ使える物資が散らばっている。",
          points: [
            { id: "exit", name: "街の出口", description: "ワールドマップに戻る", x: 15, y: 90, type: "exit" as const, isAccessible: true },
            { id: "shop_ruins", name: "商店の廃墟", description: "使える物資が残っているかもしれない", x: 40, y: 30, type: "item" as const, isAccessible: true },
            { id: "survivor", name: "生存者", description: "隠れている生存者がいる", x: 70, y: 50, type: "npc" as const, isAccessible: true },
            { id: "rubble", name: "がれきの山", description: "何かが埋まっているようだ", x: 60, y: 80, type: "item" as const, isAccessible: true },
            { id: "lookout", name: "見張り台", description: "街を見渡せる高い場所", x: 85, y: 20, type: "story" as const, isAccessible: true }
          ]
        };

      case "mutator_settlement":
        return {
          name: "ミューテーター居住区",
          mapImage: mutatorSettlementMap,
          description: "ソラとアレックスが住む友好的なコミュニティ。",
          points: [
            { id: "exit", name: "居住区の出口", description: "ワールドマップに戻る", x: 10, y: 70, type: "exit" as const, isAccessible: true },
            { id: "sora", name: "ソラの家", description: "友人のソラが住んでいる", x: 40, y: 40, type: "npc" as const, isAccessible: true },
            { id: "alex", name: "アレックスの家", description: "友人のアレックスが住んでいる", x: 70, y: 30, type: "npc" as const, isAccessible: true },
            { id: "garden", name: "変異植物園", description: "独特な植物が栽培されている", x: 50, y: 70, type: "story" as const, isAccessible: true },
            { id: "community", name: "集会所", description: "コミュニティの中心地", x: 80, y: 60, type: "story" as const, isAccessible: true }
          ]
        };

      case "industrial_ruins":
        return {
          name: "工業地帯の廃墟",
          mapImage: industrialRuinsMap,
          description: "危険だが貴重な技術が眠る工場跡地。",
          points: [
            { id: "exit", name: "工場の出口", description: "ワールドマップに戻る", x: 20, y: 85, type: "exit" as const, isAccessible: true },
            { id: "machinery", name: "古い機械", description: "まだ動く機械が残っている", x: 60, y: 40, type: "item" as const, isAccessible: true },
            { id: "toxic_area", name: "汚染区域", description: "危険な化学物質がある", x: 80, y: 20, type: "story" as const, isAccessible: false, requirement: "防護服が必要" },
            { id: "workshop", name: "工場作業場", description: "高度な技術で物を作れる", x: 40, y: 60, type: "shop" as const, isAccessible: true },
            { id: "storage_tech", name: "技術保管庫", description: "貴重な部品が眠っている", x: 70, y: 70, type: "item" as const, isAccessible: true }
          ]
        };

      case "underground_lab":
        return {
          name: "地下研究所",
          mapImage: undergroundLabMap,
          description: "終焉化の謎を解く鍵が隠された研究施設。",
          points: [
            { id: "exit", name: "研究所の出口", description: "ワールドマップに戻る", x: 15, y: 80, type: "exit" as const, isAccessible: true },
            { id: "computer", name: "研究コンピューター", description: "重要なデータが残されている", x: 50, y: 30, type: "story" as const, isAccessible: true },
            { id: "specimens", name: "標本保管庫", description: "変異に関する標本がある", x: 80, y: 40, type: "item" as const, isAccessible: true },
            { id: "security", name: "セキュリティ室", description: "施設の制御システム", x: 30, y: 60, type: "story" as const, isAccessible: false, requirement: "アクセスカードが必要" },
            { id: "lab_chief", name: "研究主任の記録", description: "最後の研究記録が残されている", x: 70, y: 60, type: "story" as const, isAccessible: true }
          ]
        };

      case "old_battlefield":
        return {
          name: "古い戦場",
          mapImage: oldBattlefieldMap,
          description: "戦争の傷跡が残る荒野。手がかりがあるかもしれない。",
          points: [
            { id: "exit", name: "戦場の出口", description: "ワールドマップに戻る", x: 10, y: 90, type: "exit" as const, isAccessible: true },
            { id: "tank_wreck", name: "戦車の残骸", description: "破壊された戦車に何かが残っている", x: 40, y: 50, type: "item" as const, isAccessible: true },
            { id: "bunker", name: "地下バンカー", description: "軍事施設の入口", x: 70, y: 30, type: "story" as const, isAccessible: true },
            { id: "memorial", name: "慰霊碑", description: "戦死者を弔う石碑", x: 50, y: 70, type: "story" as const, isAccessible: true },
            { id: "crater", name: "爆弾クレーター", description: "大きな爆発の跡", x: 80, y: 60, type: "story" as const, isAccessible: true }
          ]
        };

      default:
        return {
          name: "不明な場所",
          mapImage: safeShelterMap,
          description: "詳細不明の場所",
          points: []
        };
    }
  };

  const mapData = useMemo(() => getMapData(), [locationId]);

  // Check for nearby interaction points
  useEffect(() => {
    const nearby = mapData.points.find(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - playerPosition.x, 2) + Math.pow(point.y - playerPosition.y, 2)
      );
      return distance < 8; // 8% distance threshold
    });
    setNearbyPoint(nearby || null);
  }, [playerPosition, mapData.points]);

  // Handle keyboard input for movement
  // Stable keyboard handler that doesn't recreate on every render
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const moveSpeed = 2;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        setPlayerPosition(prev => ({ 
          ...prev, 
          y: Math.max(5, prev.y - moveSpeed) 
        }));
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        setPlayerPosition(prev => ({ 
          ...prev, 
          y: Math.min(95, prev.y + moveSpeed) 
        }));
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        setPlayerPosition(prev => ({ 
          ...prev, 
          x: Math.max(5, prev.x - moveSpeed) 
        }));
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        setPlayerPosition(prev => ({ 
          ...prev, 
          x: Math.min(95, prev.x + moveSpeed) 
        }));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Directly check nearbyPoint state and call interaction
        handleInteraction();
        break;
      case 'Escape':
        event.preventDefault();
        onExit();
        break;
    }
  }, [onExit]); // Only depend on onExit, not nearbyPoint

  // Add event listeners - now stable since handleKeyPress doesn't change often
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleInteraction = () => {
    if (!nearbyPoint) return;
    
    if (nearbyPoint.type === "exit") {
      onWorldMap();
      return;
    }

    if (!nearbyPoint.isAccessible) {
      setDialogText(`アクセスできません: ${nearbyPoint.requirement || "条件を満たしていません"}`);
      setShowDialog(true);
      return;
    }

    // Handle different interaction types
    switch (nearbyPoint.type) {
      case "npc":
        setDialogText(`${nearbyPoint.name}と話している: "${nearbyPoint.description}"`);
        break;
      case "item":
        setDialogText(`${nearbyPoint.name}を調べた: ${nearbyPoint.description}`);
        break;
      case "shop":
        setDialogText(`${nearbyPoint.name}にアクセスした: ${nearbyPoint.description}`);
        break;
      case "story":
        setDialogText(`${nearbyPoint.name}: ${nearbyPoint.description}`);
        break;
    }
    
    setShowDialog(true);
    onInteract(nearbyPoint.id);
  };

  const getPointIcon = (point: InteractionPoint) => {
    if (!point.isAccessible) return <div className="w-3 h-3 bg-gray-500 rounded border border-gray-600" />;
    
    switch (point.type) {
      case "npc": return <Users className="w-3 h-3 text-blue-400" />;
      case "item": return <Package className="w-3 h-3 text-yellow-400" />;
      case "exit": return <ArrowLeft className="w-3 h-3 text-green-400" />;
      case "story": return <Search className="w-3 h-3 text-purple-400" />;
      case "shop": return <div className="w-3 h-3 bg-orange-400 rounded" />;
      default: return <div className="w-3 h-3 bg-white rounded" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
      
      {/* Title Bar */}
      <div className="relative z-20 p-4">
        <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">{mapData.name}</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-primary">
                十字キー/WASDで移動 • Enterで調査 • Escで戻る
              </div>
              <Button
                onClick={onExit}
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/20"
                data-testid="button-close-local-map"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                戻る
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          
          {/* Local Map Display */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-6">
              <div className="text-center text-primary font-semibold mb-4 border-b border-primary/30 pb-2">
                {mapData.description}
              </div>
              
              {/* Local Area Map */}
              <div className="relative w-full h-96 bg-slate-800/50 border border-slate-600 rounded overflow-hidden">
                {/* Background Map Image */}
                <img 
                  src={mapData.mapImage} 
                  alt={`${mapData.name} Map`} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                
                {/* Dark overlay for better visibility */}
                <div className="absolute inset-0 bg-slate-900/40" />

                {/* Interaction Points */}
                {mapData.points.map((point) => (
                  <div
                    key={point.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    data-testid={`point-${point.id}`}
                  >
                    <div className={`p-1 rounded-full ${
                      nearbyPoint?.id === point.id
                        ? 'bg-primary/80 border-2 border-primary animate-pulse'
                        : point.isAccessible 
                          ? 'bg-slate-700/80 border border-slate-500'
                          : 'bg-slate-800/60 border border-slate-600'
                    }`}>
                      {getPointIcon(point)}
                    </div>
                    
                    {/* Point Name */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                      <div className={`text-xs px-2 py-1 rounded bg-black/70 text-white whitespace-nowrap ${
                        !point.isAccessible ? 'opacity-50' : ''
                      }`}>
                        {point.name}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Player Character */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200"
                  style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
                  data-testid="player-position-local"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary border-2 border-primary-foreground rounded-full" />
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-2 border-primary rounded-full animate-ping opacity-30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls and Info Panel */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Movement Controls */}
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
              <div className="text-center text-primary font-semibold mb-3 border-b border-primary/30 pb-2">
                移動操作
              </div>
              
              <div className="grid grid-cols-3 gap-1 max-w-24 mx-auto mb-4">
                <div></div>
                <Button
                  onMouseDown={() => setPlayerPosition(prev => ({ ...prev, y: Math.max(5, prev.y - 2) }))}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid="button-move-up-local"
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <div></div>
                
                <Button
                  onMouseDown={() => setPlayerPosition(prev => ({ ...prev, x: Math.max(5, prev.x - 2) }))}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid="button-move-left-local"
                >
                  <ArrowLeftIcon className="w-3 h-3" />
                </Button>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <Button
                  onMouseDown={() => setPlayerPosition(prev => ({ ...prev, x: Math.min(95, prev.x + 2) }))}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid="button-move-right-local"
                >
                  <ArrowRight className="w-3 h-3" />
                </Button>
                
                <div></div>
                <Button
                  onMouseDown={() => setPlayerPosition(prev => ({ ...prev, y: Math.min(95, prev.y + 2) }))}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid="button-move-down-local"
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <div></div>
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                キーボード: 十字キー/WASD
              </div>
            </div>

            {/* Nearby Point Info */}
            {nearbyPoint && (
              <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
                <div className="text-center text-primary font-semibold mb-3 border-b border-primary/30 pb-2">
                  調査対象
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {nearbyPoint.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getPointIcon(nearbyPoint)}
                      <span className="text-sm text-gray-300">
                        {nearbyPoint.type === "npc" && "NPC"}
                        {nearbyPoint.type === "item" && "アイテム"}
                        {nearbyPoint.type === "exit" && "出口"}
                        {nearbyPoint.type === "story" && "調査地点"}
                        {nearbyPoint.type === "shop" && "ショップ"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed">
                    {nearbyPoint.description}
                  </div>

                  {nearbyPoint.isAccessible ? (
                    <Button
                      onClick={handleInteraction}
                      className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
                      data-testid="button-interact"
                    >
                      調査する
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div className="text-xs text-red-400 mb-1">
                        アクセス不可
                      </div>
                      <div className="text-xs text-gray-500">
                        {nearbyPoint.requirement}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 text-center">
                    Enter / Spaceキーでも調査可能
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border-2 border-primary/50 rounded-lg p-6 max-w-md mx-4">
            <div className="text-white text-center mb-4" data-testid="dialog-text">
              {dialogText}
            </div>
            <Button
              onClick={() => setShowDialog(false)}
              className="w-full"
              data-testid="button-close-dialog"
            >
              閉じる
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}