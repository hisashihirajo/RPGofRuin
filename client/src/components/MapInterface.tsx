import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Lock, CheckCircle } from "lucide-react";

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
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation);
  const [showLocationInfo, setShowLocationInfo] = useState(false);

  // Mock locations for the post-apocalyptic world
  const locations: Location[] = [
    {
      id: "safe_shelter",
      name: "安全な避難所",
      description: "ディヴァンテが見つけた安全な隠れ家。ここから冒険が始まる。",
      x: 20,
      y: 60,
      isVisited: true,
      isAccessible: true,
      dangerLevel: "safe",
      type: "shelter"
    },
    {
      id: "ruined_city",
      name: "廃墟の街",
      description: "終焉化の影響で廃墟と化した街。まだ使える物資が残っているかもしれない。",
      x: 50,
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
      x: 30,
      y: 30,
      isVisited: false,
      isAccessible: true,
      dangerLevel: "safe",
      type: "settlement"
    },
    {
      id: "industrial_ruins",
      name: "工業地帯の廃墟",
      description: "戦争前の工場跡地。危険だが、貴重な技術が眠っている可能性がある。",
      x: 70,
      y: 20,
      isVisited: false,
      isAccessible: true,
      dangerLevel: "dangerous",
      type: "danger_zone"
    },
    {
      id: "underground_lab",
      name: "地下研究所",
      description: "終焉化の秘密を握る研究施設。まだ立ち入り禁止区域。",
      x: 80,
      y: 70,
      isVisited: false,
      isAccessible: false,
      dangerLevel: "dangerous",
      type: "danger_zone"
    },
    {
      id: "old_battlefield",
      name: "古い戦場",
      description: "戦争の傷跡が残る荒野。何かの手がかりがあるかもしれない。",
      x: 60,
      y: 80,
      isVisited: false,
      isAccessible: true,
      dangerLevel: "dangerous",
      type: "ruins"
    }
  ];

  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  const getLocationIcon = (location: Location) => {
    if (!location.isAccessible) return <Lock className="w-4 h-4 text-gray-500" />;
    if (location.id === currentLocation) return <MapPin className="w-4 h-4 text-primary" />;
    if (location.isVisited) return <CheckCircle className="w-4 h-4 text-green-400" />;
    return <MapPin className="w-4 h-4 text-yellow-400" />;
  };

  const getDangerColor = (dangerLevel: string) => {
    switch (dangerLevel) {
      case "safe": return "text-green-400";
      case "moderate": return "text-yellow-400";
      case "dangerous": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const handleLocationClick = (location: Location) => {
    if (!location.isAccessible) return;
    setSelectedLocation(location.id);
    setShowLocationInfo(true);
  };

  const handleTravelConfirm = () => {
    if (selectedLocationData && selectedLocationData.isAccessible) {
      onLocationSelect(selectedLocation);
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
            <h1 className="text-xl font-bold text-primary">ワールドマップ</h1>
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

      <div className="relative z-10 px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          
          {/* Map Display */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-6">
              <div className="text-center text-primary font-semibold mb-4 border-b border-primary/30 pb-2">
                終焉化した世界
              </div>
              
              {/* Map Grid */}
              <div className="relative w-full h-96 bg-slate-800/50 border border-slate-600 rounded">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full border-t border-slate-500" style={{ top: `${i * 10}%` }} />
                  ))}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full border-l border-slate-500" style={{ left: `${i * 10}%` }} />
                  ))}
                </div>

                {/* Location Markers */}
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                      location.isAccessible ? 'hover:scale-110' : 'cursor-not-allowed'
                    } ${selectedLocation === location.id ? 'scale-125' : ''}`}
                    style={{ left: `${location.x}%`, top: `${location.y}%` }}
                    onClick={() => handleLocationClick(location)}
                    data-testid={`location-${location.id}`}
                  >
                    <div className={`p-2 rounded-full ${
                      selectedLocation === location.id 
                        ? 'bg-primary/30 border-2 border-primary' 
                        : location.isAccessible 
                          ? 'bg-slate-700/80 border border-slate-500 hover:bg-slate-600/80'
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
              </div>
            </div>
          </div>

          {/* Location Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4">
              <div className="text-center text-primary font-semibold mb-4 border-b border-primary/30 pb-2">
                場所情報
              </div>

              {selectedLocationData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {selectedLocationData.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getLocationIcon(selectedLocationData)}
                      <span className={`text-sm ${getDangerColor(selectedLocationData.dangerLevel)}`}>
                        {selectedLocationData.dangerLevel === "safe" && "安全"}
                        {selectedLocationData.dangerLevel === "moderate" && "注意"}
                        {selectedLocationData.dangerLevel === "dangerous" && "危険"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed">
                    {selectedLocationData.description}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">
                      状態: {selectedLocationData.isVisited ? "訪問済み" : "未訪問"}
                    </div>
                    {selectedLocationData.id === currentLocation && (
                      <div className="text-xs text-primary font-semibold">
                        現在地
                      </div>
                    )}
                  </div>

                  {/* Travel Button */}
                  {selectedLocationData.isAccessible && selectedLocationData.id !== currentLocation && (
                    <Button
                      onClick={handleTravelConfirm}
                      className="w-full bg-primary/80 hover:bg-primary text-primary-foreground"
                      data-testid="button-travel"
                    >
                      移動する
                    </Button>
                  )}

                  {!selectedLocationData.isAccessible && (
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-2">
                        <Lock className="w-4 h-4 mx-auto mb-1" />
                        立ち入り禁止
                      </div>
                      <div className="text-xs text-gray-500">
                        まだアクセスできません
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 text-sm">
                  地図上の場所を選択してください
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-slate-900/95 border-2 border-primary/50 rounded-lg p-4 mt-4">
              <div className="text-center text-primary font-semibold mb-3 border-b border-primary/30 pb-2">
                凡例
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="text-white">現在地</span>
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