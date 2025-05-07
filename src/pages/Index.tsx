
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from '@/components/ui/icon';
import { ProgressCircle } from "@/components/ui/progress-circle";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeedType {
  id: number;
  name: string;
  type: "Одноразовое" | "Многоурожайное" | "Секретное" | "Редкое" | "Мифическое";
  price: number;
  sellPrice: number;
  growthTime: number; // in seconds for demo purposes
  imageUrl: string;
  description?: string;
}

interface PlantType {
  id: string;
  seedId: number;
  progress: number;
  plantedAt: number;
  collected: boolean;
  position: { x: number; y: number };
}

const GrowAGardenGame = () => {
  const [money, setMoney] = useState(500);
  const [inventory, setInventory] = useState<{[key: number]: number}>({});
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("garden");
  const [isPlanting, setIsPlanting] = useState(false);

  // Seeds database
  const seedsData: SeedType[] = [
    {
      id: 1,
      name: "Морковь",
      type: "Одноразовое",
      price: 20,
      sellPrice: 40,
      growthTime: 15, // 15 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1522184216316-3c1a2f3d8c65?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2Fycm90fHx8fHx8MTcxNTEyMDY0Mw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Простое одноразовое семя, доступное с начала игры",
    },
    {
      id: 2,
      name: "Клубника",
      type: "Многоурожайное",
      price: 40,
      sellPrice: 30,
      growthTime: 20, // 20 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyYXdiZXJyeXx8fHx8fDE3MTUxMjA2Nzg&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайное семя, дает плоды несколько раз",
    },
    {
      id: 3,
      name: "Черника",
      type: "Многоурожайное",
      price: 35,
      sellPrice: 28,
      growthTime: 18, // 18 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Ymx1ZWJlcnJ5fHx8fHx8MTcxNTEyMDcwMQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайное семя, доступное в начале игры",
    },
    {
      id: 4,
      name: "Томат",
      type: "Многоурожайное",
      price: 30,
      sellPrice: 25,
      growthTime: 16, // 16 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8dG9tYXRvfHx8fHx8MTcxNTEyMDcyOQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайный овощ, популярный среди новичков",
    },
    {
      id: 5,
      name: "Тыква",
      type: "Одноразовое",
      price: 100,
      sellPrice: 250,
      growthTime: 30, // 30 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1506919258185-6078bba55d2a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cHVtcGtpbnx8fHx8fDE3MTUxMjA3NDk&ixlib=rb-4.0.3&q=80&w=500",
      description: "Премиум одноразовое семя, требует значительных инвестиций",
    },
  ];

  // Load game data from localStorage
  useEffect(() => {
    const savedMoney = localStorage.getItem('garden_money');
    const savedInventory = localStorage.getItem('garden_inventory');
    const savedPlants = localStorage.getItem('garden_plants');
    
    if (savedMoney) setMoney(Number(savedMoney));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedPlants) setPlants(JSON.parse(savedPlants));
  }, []);

  // Update progress of plants
  useEffect(() => {
    const interval = setInterval(() => {
      setPlants(prevPlants => {
        const updatedPlants = prevPlants.map(plant => {
          if (plant.collected) return plant;
          
          const seed = seedsData.find(s => s.id === plant.seedId);
          if (!seed) return plant;
          
          const elapsedTime = (Date.now() - plant.plantedAt) / 1000;
          const newProgress = Math.min(100, Math.floor((elapsedTime / seed.growthTime) * 100));
          
          return {
            ...plant,
            progress: newProgress
          };
        });
        
        return updatedPlants;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Save game data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('garden_money', money.toString());
    localStorage.setItem('garden_inventory', JSON.stringify(inventory));
    localStorage.setItem('garden_plants', JSON.stringify(plants));
  }, [money, inventory, plants]);

  const buySeed = (seedId: number) => {
    const seed = seedsData.find(s => s.id === seedId);
    if (!seed) return;
    
    if (money >= seed.price) {
      setMoney(prev => prev - seed.price);
      setInventory(prev => ({
        ...prev,
        [seedId]: (prev[seedId] || 0) + 1
      }));
      
      toast({
        title: "Семя куплено!",
        description: `Вы приобрели семя ${seed.name}`,
      });
    } else {
      toast({
        title: "Недостаточно средств",
        description: "У вас не хватает шекелей для покупки",
        variant: "destructive"
      });
    }
  };

  const selectSeedForPlanting = (seedId: number) => {
    if (inventory[seedId] && inventory[seedId] > 0) {
      setSelectedSeed(seedId);
      setIsPlanting(true);
      toast({
        title: "Режим посадки",
        description: "Нажмите на сад, чтобы посадить выбранное семя",
      });
    }
  };

  const plantSeed = (x: number, y: number) => {
    if (!selectedSeed || !isPlanting) return;
    
    if (inventory[selectedSeed] && inventory[selectedSeed] > 0) {
      // Check if position is available
      const existingPlant = plants.find(p => 
        Math.abs(p.position.x - x) < 50 && 
        Math.abs(p.position.y - y) < 50
      );
      
      if (existingPlant) {
        toast({
          title: "Невозможно посадить здесь",
          description: "Это место уже занято другим растением",
          variant: "destructive"
        });
        return;
      }
      
      const newPlant: PlantType = {
        id: `plant_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        seedId: selectedSeed,
        progress: 0,
        plantedAt: Date.now(),
        collected: false,
        position: { x, y }
      };
      
      setPlants(prev => [...prev, newPlant]);
      setInventory(prev => ({
        ...prev,
        [selectedSeed]: prev[selectedSeed] - 1
      }));
      
      setIsPlanting(false);
      
      const seed = seedsData.find(s => s.id === selectedSeed);
      toast({
        title: "Семя посажено!",
        description: `Вы посадили ${seed?.name}. Оно вырастет через ${seed?.growthTime} секунд.`,
      });
    }
  };

  const harvestPlant = (plantId: string) => {
    const plantIndex = plants.findIndex(p => p.id === plantId);
    if (plantIndex === -1) return;
    
    const plant = plants[plantIndex];
    if (plant.progress < 100) {
      toast({
        title: "Растение еще не созрело",
        description: "Подождите, пока оно достигнет 100% зрелости",
        variant: "destructive"
      });
      return;
    }
    
    const seed = seedsData.find(s => s.id === plant.seedId);
    if (!seed) return;
    
    // Calculate reward
    let reward = seed.sellPrice;
    
    // Add small random bonus
    const bonusPercent = Math.floor(Math.random() * 20); // 0-20% bonus
    reward += Math.floor(reward * (bonusPercent / 100));
    
    setMoney(prev => prev + reward);
    
    // Handle multi-harvest plants
    if (seed.type === "Многоурожайное") {
      // Reset progress but keep plant
      const updatedPlants = [...plants];
      updatedPlants[plantIndex] = {
        ...plant,
        progress: 0,
        plantedAt: Date.now(),
      };
      setPlants(updatedPlants);
      
      toast({
        title: "Урожай собран!",
        description: `Вы получили ${reward} шекелей. Растение даст новый урожай.`,
      });
    } else {
      // Remove one-time plants
      setPlants(prev => prev.filter(p => p.id !== plantId));
      
      toast({
        title: "Урожай собран!",
        description: `Вы получили ${reward} шекелей.`,
      });
    }
  };

  const removePlant = (plantId: string) => {
    setPlants(prev => prev.filter(p => p.id !== plantId));
    toast({
      title: "Растение удалено",
      description: "Вы вырвали растение из сада",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Одноразовое": return "bg-blue-100 text-blue-800";
      case "Многоурожайное": return "bg-green-100 text-green-800";
      case "Секретное": return "bg-purple-100 text-purple-800";
      case "Редкое": return "bg-amber-100 text-amber-800";
      case "Мифическое": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Grow a Garden</h1>
        <div className="flex justify-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 text-lg py-1 px-4">
            <Icon name="Coins" className="mr-2 h-5 w-5" />
            {money} шекелей
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="garden" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="garden">Сад</TabsTrigger>
          <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
          <TabsTrigger value="shop">Магазин</TabsTrigger>
        </TabsList>

        <TabsContent value="garden" className="mt-4">
          <div 
            className="relative bg-green-50 min-h-[400px] h-[60vh] rounded-lg border border-green-200 overflow-hidden"
            onClick={(e) => {
              if (!isPlanting) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              plantSeed(x, y);
            }}
            style={{ cursor: isPlanting ? "cell" : "default" }}
          >
            {isPlanting && (
              <div className="absolute top-0 left-0 right-0 bg-blue-100 p-2 text-center text-blue-800">
                Выберите место для посадки {seedsData.find(s => s.id === selectedSeed)?.name}
                <Button 
                  variant="ghost" 
                  className="ml-2 h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlanting(false);
                  }}
                >
                  Отмена
                </Button>
              </div>
            )}

            {plants.map((plant) => {
              const seed = seedsData.find(s => s.id === plant.seedId);
              if (!seed) return null;

              return (
                <div 
                  key={plant.id}
                  className="absolute"
                  style={{ 
                    left: `${plant.position.x - 25}px`, 
                    top: `${plant.position.y - 25}px`,
                  }}
                >
                  <div className="relative group">
                    <div className="w-[50px] h-[50px] flex items-center justify-center">
                      <ProgressCircle 
                        value={plant.progress} 
                        size={50} 
                        className={plant.progress === 100 ? "text-green-500" : "text-amber-500"}
                      />
                      <img 
                        src={seed.imageUrl} 
                        alt={seed.name} 
                        className="absolute w-[40px] h-[40px] object-cover rounded-full" 
                      />
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 absolute -bottom-10 flex justify-center gap-1 transition-opacity w-full">
                      {plant.progress === 100 && (
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="h-7 w-7 bg-green-100 border-green-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            harvestPlant(plant.id);
                          }}
                        >
                          <Icon name="Scissors" className="h-4 w-4 text-green-700" />
                        </Button>
                      )}
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="h-7 w-7 bg-red-100 border-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePlant(plant.id);
                        }}
                      >
                        <Icon name="Trash" className="h-4 w-4 text-red-700" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(inventory).map(([seedId, count]) => {
              if (count <= 0) return null;
              const seed = seedsData.find(s => s.id === Number(seedId));
              if (!seed) return null;

              return (
                <Card key={seedId} className="overflow-hidden">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={seed.imageUrl} 
                      alt={seed.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{seed.name}</CardTitle>
                      <Badge className={getTypeColor(seed.type)}>x{count}</Badge>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        selectSeedForPlanting(seed.id);
                        setActiveTab("garden");
                      }}
                    >
                      <Icon name="Seedling" className="mr-2 h-4 w-4" />
                      Посадить
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            {Object.values(inventory).every(count => count <= 0) && (
              <div className="col-span-full text-center p-4 bg-gray-50 rounded-lg">
                <Icon name="PackageOpen" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium">Ваш инвентарь пуст</h3>
                <p className="text-gray-500">Купите семена в магазине, чтобы начать садоводство</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shop" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {seedsData.map((seed) => (
              <Card key={seed.id} className="overflow-hidden">
                <div className="h-36 overflow-hidden">
                  <img 
                    src={seed.imageUrl} 
                    alt={seed.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{seed.name}</CardTitle>
                    <Badge className={getTypeColor(seed.type)}>{seed.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm pb-2">
                  <p>{seed.description}</p>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center">
                      <Icon name="Timer" className="mr-1 h-4 w-4 text-gray-500" />
                      <span>{seed.growthTime} сек.</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Coins" className="mr-1 h-4 w-4 text-amber-500" />
                      <span>Продажа: {seed.sellPrice}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={money >= seed.price ? "default" : "outline"}
                    disabled={money < seed.price}
                    onClick={() => buySeed(seed.id)}
                  >
                    <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                    Купить за {seed.price} шекелей
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-2">Как играть</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Купите семена в магазине, используя шекели</li>
          <li>Перейдите в инвентарь и выберите "Посадить"</li>
          <li>Нажмите на свободное место в саду, чтобы посадить семя</li>
          <li>Дождитесь, пока растение созреет (достигнет 100%)</li>
          <li>Соберите урожай, чтобы получить шекели</li>
          <li>Многоразовые растения дадут новый урожай после сбора</li>
        </ul>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Симулятор садоводства Grow a Garden</p>
        <Button
          variant="ghost"
          className="h-7 text-xs mt-1"
          onClick={() => {
            localStorage.removeItem('garden_money');
            localStorage.removeItem('garden_inventory');
            localStorage.removeItem('garden_plants');
            window.location.reload();
          }}
        >
          Сбросить прогресс игры
        </Button>
      </div>
    </div>
  );
};

export default GrowAGardenGame;
