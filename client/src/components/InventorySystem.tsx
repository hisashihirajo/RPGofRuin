import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Package, Sword, Shield, Heart, Zap, X } from "lucide-react";

interface Item {
  id: string;
  name: string;
  type: "weapon" | "armor" | "consumable" | "material";
  description: string;
  quantity: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
}

interface InventorySystemProps {
  items: Item[];
  onItemUse: (item: Item) => void;
  onClose: () => void;
}

const rarityColors = {
  common: "bg-muted",
  rare: "bg-chart-4", 
  epic: "bg-chart-1",
  legendary: "bg-chart-3"
};

const typeIcons = {
  weapon: Sword,
  armor: Shield,
  consumable: Heart,
  material: Package
};

export default function InventorySystem({ items, onItemUse, onClose }: InventorySystemProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const itemsByType = {
    weapon: items.filter(item => item.type === "weapon"),
    armor: items.filter(item => item.type === "armor"),
    consumable: items.filter(item => item.type === "consumable"),
    material: items.filter(item => item.type === "material")
  };

  const ItemGrid = ({ items }: { items: Item[] }) => (
    <div className="grid grid-cols-6 gap-2">
      {items.map((item) => {
        const IconComponent = typeIcons[item.type];
        return (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-20 w-20 p-2 flex flex-col items-center hover-elevate relative"
                onClick={() => setSelectedItem(item)}
                data-testid={`item-${item.id}`}
              >
                <div 
                  className={`absolute inset-1 rounded opacity-20 ${rarityColors[item.rarity]}`}
                />
                <IconComponent className="w-6 h-6 mb-1" />
                <div className="text-xs font-semibold leading-tight text-center line-clamp-2">
                  {item.name}
                </div>
                {item.quantity > 1 && (
                  <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 min-w-5 text-xs px-1">
                    {item.quantity}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5" />
                  {item.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`${rarityColors[item.rarity]} text-white`}
                  >
                    {item.rarity}
                  </Badge>
                  <Badge variant="outline">
                    {item.type === "weapon" ? "武器" :
                     item.type === "armor" ? "防具" :
                     item.type === "consumable" ? "消費" : "素材"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>

                {item.stats && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">ステータス効果</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {item.stats.attack && (
                        <div className="flex items-center gap-1">
                          <Sword className="w-3 h-3" />
                          攻撃力: +{item.stats.attack}
                        </div>
                      )}
                      {item.stats.defense && (
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          防御力: +{item.stats.defense}
                        </div>
                      )}
                      {item.stats.health && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          HP: +{item.stats.health}
                        </div>
                      )}
                      {item.stats.mana && (
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          MP: +{item.stats.mana}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      onItemUse(item);
                      console.log(`Used item: ${item.name}`);
                    }}
                    className="flex-1"
                    data-testid={`button-use-${item.id}`}
                  >
                    使用
                  </Button>
                  {item.type === "consumable" && (
                    <div className="text-sm text-muted-foreground flex items-center">
                      残り: {item.quantity}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            インベントリ
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-inventory">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-auto max-h-96">
          <Tabs defaultValue="weapon" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weapon" className="flex items-center gap-1" data-testid="tab-weapons">
                <Sword className="w-4 h-4" />
                武器 ({itemsByType.weapon.length})
              </TabsTrigger>
              <TabsTrigger value="armor" className="flex items-center gap-1" data-testid="tab-armor">
                <Shield className="w-4 h-4" />
                防具 ({itemsByType.armor.length})
              </TabsTrigger>
              <TabsTrigger value="consumable" className="flex items-center gap-1" data-testid="tab-consumables">
                <Heart className="w-4 h-4" />
                消費 ({itemsByType.consumable.length})
              </TabsTrigger>
              <TabsTrigger value="material" className="flex items-center gap-1" data-testid="tab-materials">
                <Package className="w-4 h-4" />
                素材 ({itemsByType.material.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weapon" className="mt-4">
              <ItemGrid items={itemsByType.weapon} />
            </TabsContent>
            
            <TabsContent value="armor" className="mt-4">
              <ItemGrid items={itemsByType.armor} />
            </TabsContent>
            
            <TabsContent value="consumable" className="mt-4">
              <ItemGrid items={itemsByType.consumable} />
            </TabsContent>
            
            <TabsContent value="material" className="mt-4">
              <ItemGrid items={itemsByType.material} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}