import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from '@/components/ui/icon';
import { ProgressCircle } from "@/components/ui/progress-circle";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SeedType {
  id: number;
  name: string;
  type: "Одноразовое" | "Многоурожайное" | "Секретное" | "Редкое" | "Мифическое" | "Супер";
  price: number;
  sellPrice: number;
  growthTime: number; // in seconds for demo purposes
  imageUrl: string;
  description?: string;
  superSeed?: boolean;
}

interface ToolType {
  id: number;
  name: string;
  type: "Инструмент" | "Разбрызгиватель" | "Специальный";
  price: number;
  uses: number;
  effect: string;
  imageUrl: string;
  description: string;
  goldenChanceBoost?: number;
  rainbowChanceBoost?: number;
}

interface PlantType {
  id: string;
  seedId: number;
  progress: number;
  plantedAt: number;
  collected: boolean;
  position: { x: number; y: number };
  size: number; // For sprinkler effect
  mutated: boolean; // For lightning rod effect
  goldenMutation?: boolean;
  rainbowMutation?: boolean;
}

const GrowAGardenGame = () => {
  const [money, setMoney] = useState(20); // Starting with 20 shekels
  const [inventory, setInventory] = useState<{[key: number]: number}>({});
  const [toolsInventory, setToolsInventory] = useState<{[key: number]: number}>({3: 1}); // Starting with a shovel
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [selectedSeed, setSelectedSeed] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("garden");
  const [isPlanting, setIsPlanting] = useState(false);
  const [isUsingTool, setIsUsingTool] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toolsSearchTerm, setToolsSearchTerm] = useState("");
  const [seedsFilter, setSeedsFilter] = useState("all");
  const [massPlantingMode, setMassPlantingMode] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<"sunny" | "rainy" | "stormy" | "foggy">("sunny");

  // Seeds database with updated prices
  const seedsData: SeedType[] = [
    {
      id: 1,
      name: "Клубника",
      type: "Многоурожайное",
      price: 50,
      sellPrice: 100,
      growthTime: 20, 
      imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyYXdiZXJyeXx8fHx8fDE3MTUxMjA2Nzg&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайное семя, дает плоды несколько раз",
    },
    {
      id: 2,
      name: "Голубика",
      type: "Многоурожайное",
      price: 400,
      sellPrice: 800,
      growthTime: 18,
      imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Ymx1ZWJlcnJ5fHx8fHx8MTcxNTEyMDcwMQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайное семя с высокой стоимостью плодов",
    },
    {
      id: 3,
      name: "Тюльпан",
      type: "Редкое",
      price: 600,
      sellPrice: 1200,
      growthTime: 40,
      imageUrl: "https://images.unsplash.com/photo-1615385639736-362b69696227?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8dHVsaXB8fHx8fHwxNzE1MTIwNzQ5&ixlib=rb-4.0.3&q=80&w=500",
      description: "Красивый цветок, который можно продать за хорошую цену",
    },
    {
      id: 4,
      name: "Красный леденец",
      type: "Мифическое",
      price: 45000,
      sellPrice: 100000,
      growthTime: 60,
      imageUrl: "https://images.unsplash.com/photo-1575224526797-5730d09d781d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FuZHl8fHx8fHwxNzE1MzE2NDEw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Редкое лакомство, приносящее огромную прибыль при продаже",
    },
    {
      id: 5,
      name: "Томат",
      type: "Многоурожайное",
      price: 800,
      sellPrice: 1600,
      growthTime: 16,
      imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8dG9tYXRvfHx8fHx8MTcxNTEyMDcyOQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайный овощ, популярный среди новичков",
    },
    {
      id: 6,
      name: "Кукуруза",
      type: "Многоурожайное",
      price: 1300,
      sellPrice: 2600,
      growthTime: 22,
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29ybnx8fHx8fDE3MTUxMjA3NDk&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайный овощ с хорошей ценностью",
    },
    {
      id: 7,
      name: "Нарцисс",
      type: "Редкое",
      price: 1000,
      sellPrice: 2000,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1599644677701-f0b94ddde9bc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFmZm9kaWx8fHx8fHwxNzE1MTIwNzQ5&ixlib=rb-4.0.3&q=80&w=500",
      description: "Редкий цветок с высокой ценностью",
    },
    {
      id: 8,
      name: "Арбуз",
      type: "Одноразовое",
      price: 2500,
      sellPrice: 5000,
      growthTime: 35,
      imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8d2F0ZXJtZWxvbnx8fHx8fDE3MTUxMjA3NDk&ixlib=rb-4.0.3&q=80&w=500",
      description: "Дорогой одноразовый фрукт с хорошей прибылью",
    },
    {
      id: 9,
      name: "Тыква",
      type: "Одноразовое",
      price: 3000,
      sellPrice: 6000,
      growthTime: 30,
      imageUrl: "https://images.unsplash.com/photo-1506919258185-6078bba55d2a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cHVtcGtpbnx8fHx8fDE3MTUxMjA3NDk&ixlib=rb-4.0.3&q=80&w=500",
      description: "Премиум одноразовое семя, требует значительных инвестиций",
    },
    {
      id: 10,
      name: "Яблоко",
      type: "Многоурожайное",
      price: 3275,
      sellPrice: 6550,
      growthTime: 42,
      imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8YXBwbGV8fHx8fHwxNzE1MzE2NDE0&ixlib=rb-4.0.3&q=80&w=500",
      description: "Популярный фрукт с отличной прибылью и множеством урожаев",
    },
    {
      id: 11,
      name: "Бамбук",
      type: "Редкое",
      price: 4000,
      sellPrice: 8000,
      growthTime: 50,
      imageUrl: "https://images.unsplash.com/photo-1504648942408-13f6095dc455?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8YmFtYm9vfHx8fHx8MTcxNTMxNjQxNw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Быстрорастущее растение с множеством применений",
    },
    {
      id: 12,
      name: "Пасхальное яйцо",
      type: "Мифическое",
      price: 500000,
      sellPrice: 1000000,
      growthTime: 100,
      imageUrl: "https://images.unsplash.com/photo-1585499583264-491769657921?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZWFzdGVyK2VnZ3x8fHx8fDE3MTUzMTY0MTc&ixlib=rb-4.0.3&q=80&w=500",
      description: "Очень редкое семя, дающее необычайно ценный урожай",
    },
    {
      id: 13,
      name: "Кокос",
      type: "Многоурожайное",
      price: 6000,
      sellPrice: 12000,
      growthTime: 38,
      imageUrl: "https://images.unsplash.com/photo-1583541277540-2e681244f647?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29jb251dHx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Тропический плод, ценный ресурс для многих целей",
    },
    {
      id: 14,
      name: "Кактус",
      type: "Редкое",
      price: 15000,
      sellPrice: 30000,
      growthTime: 70,
      imageUrl: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FjdHVzfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Выносливое растение, может выжить в суровых условиях",
    },
    {
      id: 15,
      name: "Драконий фрукт",
      type: "Редкое",
      price: 50000,
      sellPrice: 100000,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1550828484-44ba48705f3c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZHJhZ29uK2ZydWl0fHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Яркий экзотический фрукт с высокой питательной ценностью",
    },
    {
      id: 16,
      name: "Манго",
      type: "Многоурожайное",
      price: 100000,
      sellPrice: 200000,
      growthTime: 40,
      imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFuZ298fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сладкий тропический фрукт, востребованный на рынке",
    },
    {
      id: 17,
      name: "Виноград",
      type: "Мифическое",
      price: 850000,
      sellPrice: 1700000,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z3JhcGVzfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Растет гроздьями, идеально подходит для виноделия",
    },
    {
      id: 18,
      name: "Конфетный цветок",
      type: "Мифическое",
      price: 100000,
      sellPrice: 200000,
      growthTime: 40,
      imageUrl: "https://images.unsplash.com/photo-1464982239851-430cd391e8a9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29sb3JmdWwrZmxvd2VyfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сладкий цветок, который привлекает насекомых-опылителей",
    },
    {
      id: 19,
      name: "Супер семя",
      type: "Супер",
      price: 1000000,
      sellPrice: 2500000,
      growthTime: 50,
      imageUrl: "https://images.unsplash.com/photo-1582140161538-5e731bdd28ea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2xvd2luZytmcnVpdHx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Гарантированно дает растение с золотой мутацией",
      superSeed: true
    },
  ];

  // Tools database with additional mutation chance boosts
  const toolsData: ToolType[] = [
    {
      id: 1,
      name: "Лейка",
      type: "Инструмент",
      price: 500,
      uses: 10,
      effect: "Сокращает время роста на 30%",
      imageUrl: "https://images.unsplash.com/photo-1623235960836-2f54e915981b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8d2F0ZXJpbmdjYW58fHx8fHwxNzE1MTIwNzQ5&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сокращает время, необходимое для роста растений. Инструмент можно использовать 10 раз, прежде чем он исчезнет.",
    },
    {
      id: 2,
      name: "Совок",
      type: "Инструмент",
      price: 100000,
      uses: -1, // -1 means unlimited
      effect: "Позволяет перемещать многоурожайные растения",
      imageUrl: "https://images.unsplash.com/photo-1598519502991-499b09545e06?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2FyZGVuaW5nfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Позволяет перемещать растения, не подходит для одноразовых посадок.",
    },
    {
      id: 3,
      name: "Лопата",
      type: "Инструмент",
      price: 0, // Free
      uses: -1, // Unlimited
      effect: "Уничтожает растения",
      imageUrl: "https://images.unsplash.com/photo-1620292023929-811222eea773?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c2hvdmVsfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Используется для уничтожения растений на ферме, они исчезают навсегда.",
    },
    {
      id: 4,
      name: "Базовый разбрызгиватель",
      type: "Разбрызгиватель",
      price: 25000,
      uses: 1,
      effect: "Ускоряет рост на 50%, увеличивает размер и шанс на золотую мутацию",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Помогает посевам расти быстрее и выглядеть крупнее. Работает всего пять минут.",
      goldenChanceBoost: 1
    },
    {
      id: 5,
      name: "Advanced Sprinkler",
      type: "Разбрызгиватель",
      price: 50000,
      uses: 1,
      effect: "Ускоряет рост на 75%, увеличивает шанс золотой и радужной мутации",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Повышает скорость роста урожая и вероятность появления мутаций. Работает пять минут.",
      goldenChanceBoost: 3,
      rainbowChanceBoost: 1
    },
    {
      id: 6,
      name: "Goldy Sprinkler",
      type: "Разбрызгиватель",
      price: 120000,
      uses: 1,
      effect: "Ускоряет рост вдвое и значительно увеличивает шанс золотой мутации",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Специализированный разбрызгиватель для получения золотых мутаций.",
      goldenChanceBoost: 5
    },
    {
      id: 7,
      name: "Громоотвод",
      type: "Специальный",
      price: 50000,
      uses: 3,
      effect: "Дает шокирующую мутацию, увеличивающую стоимость в 50 раз",
      imageUrl: "https://images.unsplash.com/photo-1533071581733-072d6a2b8fbc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8bGlnaHRuaW5nfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Обеспечивает культурам шокирующую мутацию, которая делает их в 50 раз более ценными. Можно использовать трижды.",
    },
    {
      id: 8,
      name: "Master Sprinkler",
      type: "Разбрызгиватель",
      price: 500000,
      uses: 1,
      effect: "Максимально улучшает рост и шансы на золотую и радужную мутацию",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Значительно увеличивает рост растений и вероятность всех типов мутации. Лучший инструмент садовода.",
      goldenChanceBoost: 10,
      rainbowChanceBoost: 5
    },
    {
      id: 9,
      name: "Godly Sprinkler", 
      type: "Разбрызгиватель",
      price: 1000000,
      uses: 1,
      effect: "Максимально увеличивает шансы на радужную мутацию",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Специализированный разбрызгиватель для получения редчайших радужных мутаций.",
      goldenChanceBoost: 5,
      rainbowChanceBoost: 10
    }
  ];

  // Load game data from localStorage
  useEffect(() => {
    const savedMoney = localStorage.getItem('garden_money');
    const savedInventory = localStorage.getItem('garden_inventory');
    const savedToolsInventory = localStorage.getItem('garden_tools');
    const savedPlants = localStorage.getItem('garden_plants');
    
    if (savedMoney) setMoney(Number(savedMoney));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedToolsInventory) setToolsInventory(JSON.parse(savedToolsInventory));
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

  // Randomly change weather conditions every 5 minutes
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weatherTypes: Array<"sunny" | "rainy" | "stormy" | "foggy"> = ["sunny", "rainy", "stormy", "foggy"];
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      setWeatherCondition(newWeather);
      
      toast({
        title: "Погода изменилась",
        description: `Текущая погода: ${getWeatherName(newWeather)}`,
      });
    }, 300000); // 5 minutes
    
    return () => clearInterval(weatherInterval);
  }, []);

  // Save game data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('garden_money', money.toString());
    localStorage.setItem('garden_inventory', JSON.stringify(inventory));
    localStorage.setItem('garden_tools', JSON.stringify(toolsInventory));
    localStorage.setItem('garden_plants', JSON.stringify(plants));
  }, [money, inventory, toolsInventory, plants]);

  // Helper function to get weather name in Russian
  const getWeatherName = (weather: "sunny" | "rainy" | "stormy" | "foggy") => {
    switch (weather) {
      case "sunny": return "Солнечно";
      case "rainy": return "Дождливо";
      case "stormy": return "Шторм";
      case "foggy": return "Туман";
    }
  };

  // Get mutation chance bonus from current weather
  const getWeatherMutationBonus = () => {
    switch (weatherCondition) {
      case "sunny": return { golden: 1, rainbow: 0 };
      case "rainy": return { golden: 2, rainbow: 0 };
      case "stormy": return { golden: 3, rainbow: 1 };
      case "foggy": return { golden: 0, rainbow: 2 };
      default: return { golden: 0, rainbow: 0 };
    }
  };

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

  const buyTool = (toolId: number) => {
    const tool = toolsData.find(t => t.id === toolId);
    if (!tool) return;
    
    if (money >= tool.price) {
      setMoney(prev => prev - tool.price);
      setToolsInventory(prev => ({
        ...prev,
        [toolId]: (prev[toolId] || 0) + 1
      }));
      
      toast({
        title: "Инструмент куплен!",
        description: `Вы приобрели ${tool.name}`,
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
      setSelectedTool(null);
      setIsPlanting(true);
      setIsUsingTool(false);
      toast({
        title: "Режим посадки",
        description: `${massPlantingMode ? "Массовая посадка активирована" : "Нажмите на сад, чтобы посадить выбранное семя"}`,
      });
    }
  };

  const selectTool = (toolId: number) => {
    if (toolsInventory[toolId] && toolsInventory[toolId] > 0) {
      setSelectedTool(toolId);
      setSelectedSeed(null);
      setIsUsingTool(true);
      setIsPlanting(false);
      
      const tool = toolsData.find(t => t.id === toolId);
      toast({
        title: "Инструмент выбран",
        description: `Выбран ${tool?.name}. Нажмите на растение, чтобы использовать.`,
      });
    }
  };

  const calculateMutationChance = (seedId: number, additionalBonus = 0) => {
    const seed = seedsData.find(s => s.id === seedId);
    
    // Super seeds always get golden mutation
    if (seed?.superSeed) {
      return { golden: true, rainbow: false };
    }
    
    const weatherBonus = getWeatherMutationBonus();
    
    // Base chances: 1% for golden, 0.1% for rainbow
    const baseGoldenChance = 1;
    const baseRainbowChance = 0.1;
    
    // Calculate total chances with all bonuses
    const goldenChance = baseGoldenChance + additionalBonus + weatherBonus.golden;
    const rainbowChance = baseRainbowChance + (additionalBonus / 2) + weatherBonus.rainbow;
    
    // Check for mutations
    const goldenRoll = Math.random() * 100;
    const rainbowRoll = Math.random() * 1000;
    
    // Rainbow is more rare but takes precedence over golden
    const hasRainbow = rainbowRoll < rainbowChance;
    const hasGolden = !hasRainbow && goldenRoll < goldenChance;
    
    return { golden: hasGolden, rainbow: hasRainbow };
  };

  const checkAdjacentPlants = (x: number, y: number) => {
    // Check how many plants are nearby (within 100px)
    const nearbyPlants = plants.filter(p => 
      Math.sqrt(Math.pow(p.position.x - x, 2) + Math.pow(p.position.y - y, 2)) < 100
    );
    
    // Each nearby plant increases mutation chance
    return Math.min(5, nearbyPlants.length); // Cap at 5% bonus
  };

  const plantSeed = (x: number, y: number) => {
    if (!selectedSeed || !isPlanting) return;
    
    if (inventory[selectedSeed] && inventory[selectedSeed] > 0) {
      // Check if position is available
      const existingPlant = plants.find(p => 
        Math.abs(p.position.x - x) < 40 && 
        Math.abs(p.position.y - y) < 40
      );
      
      if (existingPlant) {
        if (!massPlantingMode) {
          toast({
            title: "Невозможно посадить здесь",
            description: "Это место уже занято другим растением",
            variant: "destructive"
          });
        }
        return;
      }
      
      // Calculate adjacency bonus for mutations
      const adjacencyBonus = checkAdjacentPlants(x, y);
      
      // Determine if plant gets mutations
      const mutations = calculateMutationChance(selectedSeed, adjacencyBonus);
      
      const newPlant: PlantType = {
        id: `plant_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        seedId: selectedSeed,
        progress: 0,
        plantedAt: Date.now(),
        collected: false,
        position: { x, y },
        size: 1,
        mutated: false,
        goldenMutation: mutations.golden,
        rainbowMutation: mutations.rainbow
      };
      
      setPlants(prev => [...prev, newPlant]);
      setInventory(prev => ({
        ...prev,
        [selectedSeed]: prev[selectedSeed] - 1
      }));
      
      const seed = seedsData.find(s => s.id === selectedSeed);
      
      if (!massPlantingMode) {
        setIsPlanting(false);
        
        // Show different messages based on mutations
        if (mutations.rainbow) {
          toast({
            title: "РАДУЖНАЯ МУТАЦИЯ!",
            description: `Невероятно! Вы посадили ${seed?.name} с редчайшей радужной мутацией!`,
          });
        } else if (mutations.golden) {
          toast({
            title: "ЗОЛОТАЯ МУТАЦИЯ!",
            description: `Поздравляем! Вы посадили ${seed?.name} с золотой мутацией!`,
          });
        } else {
          toast({
            title: "Семя посажено!",
            description: `Вы посадили ${seed?.name}. Оно вырастет через ${seed?.growthTime} секунд.`,
          });
        }
      } else if (inventory[selectedSeed] <= 0) {
        // If we've used the last seed in mass planting mode, stop
        setIsPlanting(false);
        toast({
          title: "Посадка завершена",
          description: "У вас закончились семена этого типа",
        });
      }
    }
  };

  const useTool = (plantId: string) => {
    if (!selectedTool || !isUsingTool) return;
    
    const toolId = selectedTool;
    const tool = toolsData.find(t => t.id === toolId);
    if (!tool) return;
    
    const plantIndex = plants.findIndex(p => p.id === plantId);
    if (plantIndex === -1) return;
    
    const plant = plants[plantIndex];
    const seed = seedsData.find(s => s.id === plant.seedId);
    if (!seed) return;
    
    // Handle tool effects
    switch (toolId) {
      case 1: // Watering can
        // Reduce growth time by 30%
        const newPlantedAt = plant.plantedAt - (seed.growthTime * 1000 * 0.3);
        const updatedPlants = [...plants];
        updatedPlants[plantIndex] = {
          ...plant,
          plantedAt: newPlantedAt
        };
        setPlants(updatedPlants);
        
        toast({
          title: "Лейка использована",
          description: `Вы полили ${seed.name}. Рост ускорен на 30%.`,
        });
        break;
        
      case 2: // Spade
        if (seed.type === "Одноразовое") {
          toast({
            title: "Невозможно переместить",
            description: "Совок не работает с одноразовыми растениями",
            variant: "destructive"
          });
          return;
        }
        
        setSelectedTool(null);
        setIsUsingTool(false);
        toast({
          title: "Режим перемещения",
          description: "Выберите новое место для растения",
        });
        
        // Logic to move the plant (not fully implemented)
        // This would require additional state to track the plant being moved
        return;
        
      case 3: // Shovel
        setPlants(prev => prev.filter(p => p.id !== plantId));
        toast({
          title: "Растение удалено",
          description: "Вы выкопали и уничтожили растение",
        });
        break;
        
      case 4: // Basic sprinkler
      case 5: // Advanced sprinkler
      case 6: // Goldy sprinkler
      case 8: // Master sprinkler
      case 9: // Godly sprinkler
        // Apply growth boost and size increase based on sprinkler type
        let growthBoost = 0.5;
        let sizeIncrease = 1.2;
        
        if (toolId === 5) { // Advanced
          growthBoost = 0.75;
          sizeIncrease = 1.5;
        } else if (toolId === 6 || toolId === 9) { // Goldy or Godly
          growthBoost = 1;
          sizeIncrease = 2;
        } else if (toolId === 8) { // Master
          growthBoost = 2;
          sizeIncrease = 3;
        }
        
        const newPlantedTime = plant.plantedAt - (seed.growthTime * 1000 * growthBoost);
        
        // Check for mutations with sprinkler bonuses
        const goldenBonus = tool.goldenChanceBoost || 0;
        const rainbowBonus = tool.rainbowChanceBoost || 0;
        
        const mutations = calculateMutationChance(
          plant.seedId, 
          goldenBonus + rainbowBonus
        );
        
        const sprinkledPlants = [...plants];
        sprinkledPlants[plantIndex] = {
          ...plant,
          plantedAt: newPlantedTime,
          size: plant.size * sizeIncrease,
          goldenMutation: mutations.golden || plant.goldenMutation,
          rainbowMutation: mutations.rainbow || plant.rainbowMutation
        };
        setPlants(sprinkledPlants);
        
        let message = "Растение будет расти быстрее.";
        if (mutations.rainbow) {
          message = "Растение получило радужную мутацию!";
        } else if (mutations.golden) {
          message = "Растение получило золотую мутацию!";
        }
        
        toast({
          title: "Разбрызгиватель использован",
          description: message,
        });
        break;
        
      case 7: // Lightning rod
        const shockedPlants = [...plants];
        shockedPlants[plantIndex] = {
          ...plant,
          mutated: true,
          size: plant.size * 1.2
        };
        setPlants(shockedPlants);
        
        toast({
          title: "Громоотвод применен",
          description: "Растение получило шоковую мутацию и станет гораздо более ценным!",
        });
        break;
    }
    
    // Reduce tool uses if applicable
    if (tool.uses > 0) {
      setToolsInventory(prev => {
        const newCount = prev[toolId] - 1;
        if (newCount <= 0) {
          const { [toolId]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [toolId]: newCount
        };
      });
    }
    
    setIsUsingTool(false);
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
    
    // Increase reward based on size
    reward = Math.floor(reward * plant.size);
    
    // Apply mutation bonuses
    if (plant.mutated) {
      reward = reward * 50; // Shocked mutation increases value 50x
    }
    
    if (plant.goldenMutation) {
      reward = reward * 10; // Golden mutation increases value 10x
    }
    
    if (plant.rainbowMutation) {
      reward = reward * 100; // Rainbow mutation increases value 100x
    }
    
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
      
      let mutationText = "";
      if (plant.rainbowMutation) mutationText = "радужное ";
      else if (plant.goldenMutation) mutationText = "золотое ";
      else if (plant.mutated) mutationText = "мутированное ";
      
      toast({
        title: "Урожай собран!",
        description: `Вы получили ${reward} шекелей за ${mutationText}растение. Оно даст новый урожай.`,
      });
    } else {
      // Remove one-time plants
      setPlants(prev => prev.filter(p => p.id !== plantId));
      
      let mutationText = "";
      if (plant.rainbowMutation) mutationText = "радужное ";
      else if (plant.goldenMutation) mutationText = "золотое ";
      else if (plant.mutated) mutationText = "мутированное ";
      
      toast({
        title: "Урожай собран!",
        description: `Вы получили ${reward} шекелей за ${mutationText}растение.`,
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
      case "Супер": return "bg-orange-100 text-orange-800";
      case "Инструмент": return "bg-slate-100 text-slate-800";
      case "Разбрызгиватель": return "bg-cyan-100 text-cyan-800";
      case "Специальный": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter seeds based on search and type
  const filteredSeeds = seedsData.filter(seed => {
    // First filter by search term
    const matchesSearch = 
      seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seed.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seed.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then filter by seed type if not showing all
    if (seedsFilter === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && seed.type.toLowerCase() === seedsFilter.toLowerCase();
    }
  });

  // Filter tools based on search
  const filteredTools = toolsData.filter(tool => 
    tool.name.toLowerCase().includes(toolsSearchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(toolsSearchTerm.toLowerCase()) ||
    tool.type.toLowerCase().includes(toolsSearchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Grow a Garden</h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 text-lg py-1 px-4">
            <Icon name="Coins" className="mr-2 h-5 w-5" />
            {money} шекелей
          </Badge>
          <Badge className={
            weatherCondition === "sunny" ? "bg-yellow-100 text-yellow-800" :
            weatherCondition === "rainy" ? "bg-blue-100 text-blue-800" :
            weatherCondition === "stormy" ? "bg-purple-100 text-purple-800" :
            "bg-gray-100 text-gray-800"
          }>
            <Icon 
              name={
                weatherCondition === "sunny" ? "Sun" :
                weatherCondition === "rainy" ? "Cloud" :
                weatherCondition === "stormy" ? "CloudLightning" :
                "CloudFog"
              } 
              className="mr-2 h-5 w-5" 
            />
            {getWeatherName(weatherCondition)}
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="garden" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="garden">Сад</TabsTrigger>
          <TabsTrigger value="inventory">Семена</TabsTrigger>
          <TabsTrigger value="tools">Инструменты</TabsTrigger>
          <TabsTrigger value="shop">Магазин</TabsTrigger>
        </TabsList>

        <TabsContent value="garden" className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Switch
                id="mass-planting"
                checked={massPlantingMode}
                onCheckedChange={setMassPlantingMode}
              />
              <Label htmlFor="mass-planting">Режим массовой посадки</Label>
            </div>
            {isPlanting && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsPlanting(false)}
              >
                Отменить посадку
              </Button>
            )}
            {isUsingTool && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsUsingTool(false)}
              >
                Отменить использование
              </Button>
            )}
          </div>
          
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
                {massPlantingMode 
                  ? `Режим массовой посадки: нажимайте несколько раз для посадки ${seedsData.find(s => s.id === selectedSeed)?.name}`
                  : `Выберите место для посадки ${seedsData.find(s => s.id === selectedSeed)?.name}`
                }
              </div>
            )}

            {isUsingTool && (
              <div className="absolute top-0 left-0 right-0 bg-amber-100 p-2 text-center text-amber-800">
                Выберите растение для использования {toolsData.find(t => t.id === selectedTool)?.name}
              </div>
            )}

            {/* Weather effects visualizations */}
            {weatherCondition === "rainy" && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-0.5 h-10 bg-blue-300 opacity-50 animate-rain"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      transform: 'rotate(10deg)'
                    }}
                  />
                ))}
              </div>
            )}
            
            {weatherCondition === "foggy" && (
              <div className="absolute inset-0 bg-gray-200 opacity-30 pointer-events-none" />
            )}
            
            {weatherCondition === "stormy" && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-full bg-purple-300 opacity-20 animate-lightning"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 10}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {plants.map((plant) => {
              const seed = seedsData.find(s => s.id === plant.seedId);
              if (!seed) return null;

              // Calculate visual effects for mutations
              let borderColor = "";
              let glowEffect = "";
              
              if (plant.rainbowMutation) {
                borderColor = "border-4 border-[conic-gradient(red,orange,yellow,green,blue,indigo,violet,red)]";
                glowEffect = "animate-pulse shadow-[0_0_15px_rgba(255,0,255,0.7)]";
              } else if (plant.goldenMutation) {
                borderColor = "border-4 border-yellow-500";
                glowEffect = "animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.5)]";
              } else if (plant.mutated) {
                borderColor = "border-4 border-purple-500";
                glowEffect = "animate-pulse shadow-[0_0_10px_rgba(128,0,128,0.5)]";
              }

              return (
                <div 
                  key={plant.id}
                  className="absolute"
                  style={{ 
                    left: `${plant.position.x - 25}px`, 
                    top: `${plant.position.y - 25}px`,
                  }}
                  onClick={() => {
                    if (isUsingTool && selectedTool) {
                      useTool(plant.id);
                    }
                  }}
                >
                  <div className={`relative group ${glowEffect}`}>
                    <div 
                      className={`flex items-center justify-center rounded-full ${borderColor}`}
                      style={{ 
                        width: `${50 * plant.size}px`, 
                        height: `${50 * plant.size}px` 
                      }}
                    >
                      <ProgressCircle 
                        value={plant.progress} 
                        size={50 * plant.size} 
                        className={
                          plant.rainbowMutation ? "text-violet-500" :
                          plant.goldenMutation ? "text-yellow-500" :
                          plant.mutated ? "text-purple-500" : 
                          plant.progress === 100 ? "text-green-500" : 
                          "text-amber-500"
                        }
                      />
                      <img 
                        src={seed.imageUrl} 
                        alt={seed.name} 
                        className={`absolute object-cover rounded-full ${
                          plant.rainbowMutation ? "animate-rainbow-hue" :
                          plant.goldenMutation ? "filter brightness-150 contrast-125 saturate-150" :
                          plant.mutated ? "filter hue-rotate-180" : ""
                        }`}
                        style={{ 
                          width: `${40 * plant.size}px`, 
                          height: `${40 * plant.size}px` 
                        }}
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
          <div className="mb-4 space-y-2">
            <Input
              type="text"
              placeholder="Поиск семян..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
            
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                size="sm" 
                variant={seedsFilter === "all" ? "default" : "outline"}
                onClick={() => setSeedsFilter("all")}
              >
                Все
              </Button>
              <Button 
                size="sm" 
                variant={seedsFilter === "одноразовое" ? "default" : "outline"}
                className={seedsFilter === "одноразовое" ? "" : "border-blue-200 text-blue-800"}
                onClick={() => setSeedsFilter("одноразовое")}
              >
                Одноразовые
              </Button>
              <Button 
                size="sm" 
                variant={seedsFilter === "многоурожайное" ? "default" : "outline"}
                className={seedsFilter === "многоурожайное" ? "" : "border-green-200 text-green-800"}
                onClick={() => setSeedsFilter("многоурожайное")}
              >
                Многоурожайные
              </Button>
              <Button 
                size="sm" 
                variant={seedsFilter === "редкое" ? "default" : "outline"}
                className={seedsFilter === "редкое" ? "" : "border-amber-200 text-amber-800"}
                onClick={() => setSeedsFilter("редкое")}
              >
                Редкие
              </Button>
              <Button 
                size="sm" 
                variant={seedsFilter === "мифическое" ? "default" : "outline"}
                className={seedsFilter === "мифическое" ? "" : "border-red-200 text-red-800"}
                onClick={() => setSeedsFilter("мифическое")}
              >
                Мифические
              </Button>
              <Button 
                size="sm" 
                variant={seedsFilter === "супер" ? "default" : "outline"}
                className={seedsFilter === "супер" ? "" : "border-orange-200 text-orange-800"}
                onClick={() => setSeedsFilter("супер")}
              >
                Супер
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(inventory)
              .filter(([seedId, count]) => count > 0)
              .filter(([seedId]) => {
                const seed = seedsData.find(s => s.id === Number(seedId));
                if (!seed) return false;
                
                // Filter by search term
                const matchesSearch = 
                  seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  seed.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  seed.type.toLowerCase().includes(searchTerm.toLowerCase());
                
                // Filter by seed type if not showing all
                if (seedsFilter === "all") {
                  return matchesSearch;
                } else {
                  return matchesSearch && seed.type.toLowerCase() === seedsFilter.toLowerCase();
                }
              })
              .map(([seedId, count]) => {
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
                    <CardContent className="text-sm pb-2">
                      <p>{seed.description}</p>
                      {seed.superSeed && (
                        <p className="text-orange-600 font-semibold mt-1">
                          Гарантированная золотая мутация!
                        </p>
                      )}
                    </CardContent>
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

        <TabsContent value="tools" className="mt-4">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Поиск инструментов..."
              value={toolsSearchTerm}
              onChange={(e) => setToolsSearchTerm(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(toolsInventory)
              .filter(([toolId, count]) => count > 0)
              .filter(([toolId]) => {
                const tool = toolsData.find(t => t.id === Number(toolId));
                return tool && (
                  tool.name.toLowerCase().includes(toolsSearchTerm.toLowerCase()) ||
                  tool.description.toLowerCase().includes(toolsSearchTerm.toLowerCase()) ||
                  tool.type.toLowerCase().includes(toolsSearchTerm.toLowerCase())
                );
              })
              .map(([toolId, count]) => {
                const tool = toolsData.find(t => t.id === Number(toolId));
                if (!tool) return null;

                return (
                  <Card key={toolId} className="overflow-hidden">
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={tool.imageUrl} 
                        alt={tool.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge className={getTypeColor(tool.type)}>
                          {tool.uses > 0 ? `x${count} (${tool.uses})` : `x${count}`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <p>{tool.effect}</p>
                      {(tool.goldenChanceBoost || tool.rainbowChanceBoost) && (
                        <div className="flex flex-col mt-2 text-xs">
                          {tool.goldenChanceBoost && (
                            <span className="text-yellow-600">
                              +{tool.goldenChanceBoost}% к шансу золотой мутации
                            </span>
                          )}
                          {tool.rainbowChanceBoost && (
                            <span className="text-violet-600">
                              +{tool.rainbowChanceBoost/10}% к шансу радужной мутации
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          selectTool(tool.id);
                          setActiveTab("garden");
                        }}
                      >
                        <Icon name="Tool" className="mr-2 h-4 w-4" />
                        Использовать
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            
            {Object.values(toolsInventory).every(count => count <= 0) && (
              <div className="col-span-full text-center p-4 bg-gray-50 rounded-lg">
                <Icon name="Tools" className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium">У вас нет инструментов</h3>
                <p className="text-gray-500">Купите инструменты в магазине, чтобы улучшить свои растения</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shop" className="mt-4">
          <Tabs defaultValue="seeds">
            <TabsList className="mb-4">
              <TabsTrigger value="seeds">Семена</TabsTrigger>
              <TabsTrigger value="tools">Инструменты</TabsTrigger>
            </TabsList>
            
            <TabsContent value="seeds">
              <div className="mb-4 space-y-2">
                <Input
                  type="text"
                  placeholder="Поиск семян..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md mx-auto"
                />
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant={seedsFilter === "all" ? "default" : "outline"}
                    onClick={() => setSeedsFilter("all")}
                  >
                    Все
                  </Button>
                  <Button 
                    size="sm" 
                    variant={seedsFilter === "одноразовое" ? "default" : "outline"}
                    className={seedsFilter === "одноразовое" ? "" : "border-blue-200 text-blue-800"}
                    onClick={() => setSeedsFilter("одноразовое")}
                  >
                    Одноразовые
                  </Button>
                  <Button 
                    size="sm" 
                    variant={seedsFilter === "многоурожайное" ? "default" : "outline"}
                    className={seedsFilter === "многоурожайное" ? "" : "border-green-200 text-green-800"}
                    onClick={() => setSeedsFilter("многоурожайное")}
                  >
                    Многоурожайные
                  </Button>
                  <Button 
                    size="sm" 
                    variant={seedsFilter === "редкое" ? "default" : "outline"}
                    className={seedsFilter === "редкое" ? "" : "border-amber-200 text-amber-800"}
                    onClick={() => setSeedsFilter("редкое")}
                  >
                    Редкие
                  </Button>
                  <Button 
                    size="sm" 
                    variant={seedsFilter === "мифическое" ? "default" : "outline"}
                    className={seedsFilter === "мифическое" ? "" : "border-red-200 text-red-800"}
                    onClick={() => setSeedsFilter("мифическое")}
                  >
                    Мифические
                  </Button>
                  <Button 
                    size="sm" 
                    variant={seedsFilter === "супер" ? "default" : "outline"}
                    className={seedsFilter === "супер" ? "" : "border-orange-200 text-orange-800"}
                    onClick={() => setSeedsFilter("супер")}
                  >
                    Супер
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredSeeds.map((seed) => (
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
                      {seed.superSeed && (
                        <p className="text-orange-600 font-semibold mt-1">
                          Гарантированная золотая мутация!
                        </p>
                      )}
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
            
            <TabsContent value="tools">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Поиск инструментов..."
                  value={toolsSearchTerm}
                  onChange={(e) => setToolsSearchTerm(e.target.value)}
                  className="max-w-md mx-auto"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden">
                    <div className="h-36 overflow-hidden">
                      <img 
                        src={tool.imageUrl} 
                        alt={tool.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge className={getTypeColor(tool.type)}>{tool.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm pb-2">
                      <p>{tool.description}</p>
                      <div className="flex mt-2">
                        <div className="flex items-center">
                          <Icon name="CircleCheck" className="mr-1 h-4 w-4 text-gray-500" />
                          <span>{tool.effect}</span>
                        </div>
                      </div>
                      {(tool.goldenChanceBoost || tool.rainbowChanceBoost) && (
                        <div className="flex flex-col mt-2 text-xs">
                          {tool.goldenChanceBoost && (
                            <span className="text-yellow-600">
                              +{tool.goldenChanceBoost}% к шансу золотой мутации
                            </span>
                          )}
                          {tool.rainbowChanceBoost && (
                            <span className="text-violet-600">
                              +{tool.rainbowChanceBoost/10}% к шансу радужной мутации
                            </span>
                          )}
                        </div>
                      )}
                      {tool.uses > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          Можно использовать {tool.uses} раз(а)
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        variant={money >= tool.price ? "default" : "outline"}
                        disabled={money < tool.price || tool.price === 0}
                        onClick={() => buyTool(tool.id)}
                      >
                        <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
                        {tool.price === 0 
                          ? "Бесплатно (уже есть)"
                          : `Купить за ${tool.price} шекелей`
                        }
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-2">Как играть</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Купите семена в магазине, используя шекели</li>
          <li>Перейдите в инвентарь семян и выберите "Посадить"</li>
          <li>Включите режим массовой посадки для быстрой посадки нескольких растений</li>
          <li>Дождитесь, пока растение созреет (достигнет 100%)</li>
          <li>Используйте инструменты, чтобы улучшить рост или изменить растения</li>
          <li>Соберите урожай, чтобы получить шекели</li>
          <li>Многоразовые растения дадут новый урожай после сбора</li>
        </ul>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-2">Мутации</h2>
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold">Шоковая мутация</h3>
            <p className="text-sm">Увеличивает стоимость в 50 раз. Получается при использовании громоотвода.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Золотая мутация</h3>
            <p className="text-sm">Увеличивает стоимость в 10 раз. Шанс 1%, может быть увеличен разбрызгивателями.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Радужная мутация</h3>
            <p className="text-sm">Увеличивает стоимость в 100 раз! Шанс 0.1%, может быть увеличен Advanced и Godly разбрызгивателями.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Супер семя</h3>
            <p className="text-sm">Гарантированно дает золотую мутацию при посадке.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-2">Погода</h2>
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold">Солнечно</h3>
            <p className="text-sm">+1% к шансу золотой мутации.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Дождливо</h3>
            <p className="text-sm">+2% к шансу золотой мутации.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Шторм</h3>
            <p className="text-sm">+3% к шансу золотой и +0.1% к шансу радужной мутации.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Туман</h3>
            <p className="text-sm">+0.2% к шансу радужной мутации.</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Симулятор садоводства Grow a Garden</p>
        <Button
          variant="ghost"
          className="h-7 text-xs mt-1"
          onClick={() => {
            localStorage.removeItem('garden_money');
            localStorage.removeItem('garden_inventory');
            localStorage.removeItem('garden_tools');
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
