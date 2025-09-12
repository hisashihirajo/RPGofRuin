import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Lock, CheckCircle, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight } from "lucide-react";
import worldMapUrl from "@assets/generated_images/Post-apocalyptic_JRPG_world_map_728cb46f.png";

interface Location {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  isVisited: boolean;
  isAccessible: boolean;
  dangerLevel: "safe" | "moderate" | "dangerous";
  type: "settlement" | "ruins" | "shelter" | "danger_zone";
}

interface MapInterfaceProps {
  currentLocation: string;
  onLocationSelect: (locationId: string) => void;
  onClose: () => void;
}

export default function MapInterface({ 
  currentLocation, 
  onLocationSelect, 
  onClose 
}: MapInterfaceProps) {
  // Player position on the map (percentage-based)
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [nearbyLocation, setNearbyLocation] = useState<Location | null>(null);

  // Mock locations for the post-apocalyptic world
  const locations: Location[] = [
    {
      id: "safe_shelter",
      name: "安全な避難所",
      description: "ディヴァンテが見つけた安全な隠れ家。ここから冒険が始まる。",
      x: 25,
      y: 70,
      isVisited: true,
      isAccessible: true,
      dangerLevel: "safe",
      type: "shelter"
    },
    {
      id: "ruined_city",
      name: "廃墟の街",
      description: "終焉化の影響で廃墟と化した街。まだ使える物資が残っているかもしれない。",
      x: 60,
      y: 40,
      isVisited: true,
      isAccessible: true,
      dangerLevel: "moderate",
      type: "ruins"
    },
    {
      id: "mutator_settlement",
      name: "ミューテーター居住区",
      description: "ソラとアレックスが住む地区。友好的なミューテーターたちが生活している。",
      x: 35,
      y: 25,
      isVisited: false,
      isAccessible: true,
      dangerLevel: "safe",
      type: "settlement"
    },
    {
      id: "industrial_ruins",
      name: "工業地帯の廃墟",
      description: "戦争前の工場跡地。危険だが、貴重な技術が眠っている可能性がある。",
      x: 80,
      y: 30,
      isVisited: false,
      isAccessible: true,
      dangerLevel: "dangerous",
      type: "danger_zone"
    },
    {
      id: "underground_lab",
      name: "地下研究所",
      description: "終焉化の秘密を握る研究施設。まだ立ち入り禁止区域。",
      x: 85,
      y: 80,
      isVisited: false,
      isAccessible: false,
      dangerLevel: "dangerous",
      type: "danger_zone"
    },
    {
      id: "old_battlefield",
      name: "古い戦場",
      description: "戦争の傷跡が残る荒野。何かの手がかりがあるかもしれない。",
      x: 15,
      y: 45,
      isVisited: false,
      isAccessible: true,
      dangerLevel: "dangerous",
      type: "ruins"
    }
  ];

  // Initialize player position based on current location
  useEffect(() => {
    const currentLoc = locations.find(loc => loc.id === currentLocation);
    if (currentLoc) {
      setPlayerPosition({ x: currentLoc.x, y: currentLoc.y });
    }
  }, [currentLocation]);

  // Check for nearby locations
  useEffect(() => {
    const nearby = locations.find(loc => {
      const distance = Math.sqrt(
        Math.pow(loc.x - playerPosition.x, 2) + Math.pow(loc.y - playerPosition.y, 2)
      );
      return distance < 8 && loc.isAccessible; // 8% distance threshold
    });
    setNearbyLocation(nearby || null);
  }, [playerPosition]);

  // Handle keyboard input for movement
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const moveSpeed = 2; // Movement speed in percentage
    
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
        if (nearbyLocation) {
          setShowLocationDialog(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  }, [nearbyLocation, onClose]);

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleLocationEnter = () => {
    if (nearbyLocation) {
      onLocationSelect(nearbyLocation.id);
      setShowLocationDialog(false);
    }
  };

  const getDangerColor = (dangerLevel: string) => {
    switch (dangerLevel) {
      case "safe": return "text-green-400";
      case "moderate": return "text-yellow-400";
      case "dangerous": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getLocationIcon = (location: Location) => {
    if (!location.isAccessible) return <Lock className="w-3 h-3 text-gray-500" />;
    if (location.isVisited) return <CheckCircle className="w-3 h-3 text-green-400" />;
    return <MapPin className="w-3 h-3 text-yellow-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
      
      {/* Title Bar */}
      <div className="relative z-20 p-4">
        <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">ワールドマップ</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-primary">
                十字キー/WASDで移動 • Enterで調査 • Escで戻る
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/20"
                data-testid="button-close-map"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                もどる
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          
          {/* Map Display */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-6">
              <div className="text-center text-primary font-semibold mb-4 border-b border-primary/30 pb-2">
                終焉化した世界
              </div>
              
              {/* World Map */}
              <div className="relative w-full h-96 bg-slate-800/50 border border-slate-600 rounded overflow-hidden">
                {/* Background World Map Image */}
                <img 
                  src={worldMapUrl} 
                  alt="World Map" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                
                {/* Dark overlay for better visibility */}
                <div className="absolute inset-0 bg-slate-900/60" />

                {/* Location Markers */}
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${location.x}%`, top: `${location.y}%` }}
                    data-testid={`location-${location.id}`}
                  >
                    <div className={`p-1 rounded-full ${
                      location.isAccessible 
                        ? 'bg-slate-700/80 border border-slate-500'
                        : 'bg-slate-800/60 border border-slate-600'
                    }`}>
                      {getLocationIcon(location)}
                    </div>
                    
                    {/* Location Name */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                      <div className={`text-xs px-2 py-1 rounded bg-black/70 text-white whitespace-nowrap ${
                        !location.isAccessible ? 'opacity-50' : ''
                      }`}>
                        {location.name}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Player Character */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200"
                  style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
                  data-testid="player-position"
                >
                  <div className="relative">
                    <div className="w-6 h-6 bg-primary border-2 border-primary-foreground rounded-full animate-pulse" />
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-primary rounded-full animate-ping opacity-30" />
                    
                    {/* Player Name */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                      <div className="text-xs px-2 py-1 rounded bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap">
                        クリス
                      </div>
                    </div>
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
                  data-testid="button-move-up"
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <div></div>
                
                <Button
                  onMouseDown={() => setPlayerPosition(prev => ({ ...prev, x: Math.max(5, prev.x - 2) }))}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid="button-move-left"
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
                  data-testid="button-move-right"
                >
                  <ArrowRight className="w-3 h-3" />
                </Button>
                
                <div></div>
                <Button
                  onMouseDown={() => setPlayerPosition(prev => ({ ...prev, y: Math.min(95, prev.y + 2) }))}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  data-testid="button-move-down"
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <div></div>
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                キーボード: 十字キー/WASD
              </div>
            </div>

            {/* Location Info */}
            {nearbyLocation && (
              <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
                <div className="text-center text-primary font-semibold mb-3 border-b border-primary/30 pb-2">
                  近くの場所
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {nearbyLocation.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getLocationIcon(nearbyLocation)}
                      <span className={`text-sm ${getDangerColor(nearbyLocation.dangerLevel)}`}>
                        {nearbyLocation.dangerLevel === "safe" && "安全"}
                        {nearbyLocation.dangerLevel === "moderate" && "注意"}
                        {nearbyLocation.dangerLevel === "dangerous" && "危険"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed">
                    {nearbyLocation.description}
                  </div>

                  <Button
                    onClick={handleLocationEnter}
                    className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
                    data-testid="button-enter-location"
                  >
                    この場所に入る
                  </Button>
                  
                  <div className="text-xs text-gray-400 text-center">
                    Enter / Spaceキーでも入場可能
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
              <div className="text-center text-primary font-semibold mb-3 border-b border-primary/30 pb-2">
                凡例
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-white">プレイヤー</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-white">訪問済み</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-yellow-400" />
                  <span className="text-white">未訪問</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-gray-500" />
                  <span className="text-white">立ち入り禁止</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}