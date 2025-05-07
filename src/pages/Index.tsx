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

interface ToolType {
  id: number;
  name: string;
  type: "Инструмент" | "Разбрызгиватель" | "Специальный";
  price: number;
  uses: number;
  effect: string;
  imageUrl: string;
  description: string;
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
      price: 20,
      sellPrice: 30,
      growthTime: 20, // 20 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyYXdiZXJyeXx8fHx8fDE3MTUxMjA2Nzg&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайное семя, дает плоды несколько раз",
    },
    {
      id: 3,
      name: "Черника",
      type: "Многоурожайное",
      price: 20,
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
      sellPrice: 45,
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
    {
      id: 6,
      name: "Кукуруза",
      type: "Многоурожайное",
      price: 40,
      sellPrice: 65,
      growthTime: 22, // 22 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29ybnx8fHx8fDE3MTUxMjA3NDk&ixlib=rb-4.0.3&q=80&w=500",
      description: "Многоурожайный овощ с хорошей ценностью",
    },
    {
      id: 7,
      name: "Арбуз",
      type: "Одноразовое",
      price: 150,
      sellPrice: 350,
      growthTime: 35, // 35 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1563114773-84221bd62daa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8d2F0ZXJtZWxvbnx8fHx8fDE3MTUxMjA3NDk&ixlib=rb-4.0.3&q=80&w=500",
      description: "Дорогой одноразовый фрукт с хорошей прибылью",
    },
    {
      id: 8,
      name: "Оранжевый тюльпан",
      type: "Редкое",
      price: 750,
      sellPrice: 1500,
      growthTime: 40, // 40 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1615385639736-362b69696227?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8dHVsaXB8fHx8fHwxNzE1MTIwNzQ5&ixlib=rb-4.0.3&q=80&w=500",
      description: "Редкий цветок, который продается за высокую цену",
    },
    {
      id: 9,
      name: "Нарцисс",
      type: "Редкое",
      price: 1000,
      sellPrice: 2000,
      growthTime: 45, // 45 seconds for demo
      imageUrl: "https://images.unsplash.com/photo-1599644677701-f0b94ddde9bc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFmZm9kaWx8fHx8fHwxNzE1MTIwNzQ5&ixlib=rb-4.0.3&q=80&w=500",
      description: "Редкий цветок с высокой ценностью",
    },
    // New seeds
    {
      id: 10,
      name: "Папайя",
      type: "Многоурожайное",
      price: 5000,
      sellPrice: 12500,
      growthTime: 50,
      imageUrl: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cGFwYXlhfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Экзотический фрукт с высокой рыночной стоимостью",
    },
    {
      id: 11,
      name: "Дуриан",
      type: "Одноразовое",
      price: 6000,
      sellPrice: 15000,
      growthTime: 60,
      imageUrl: "https://images.unsplash.com/photo-1575482283543-8afc40f2e25c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZHVyaWFufHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Ароматный экзотический фрукт с высокой стоимостью",
    },
    {
      id: 12,
      name: "Кокосовый орех",
      type: "Многоурожайное",
      price: 600,
      sellPrice: 1500,
      growthTime: 38,
      imageUrl: "https://images.unsplash.com/photo-1583541277540-2e681244f647?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29jb251dHx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Тропический плод, ценный ресурс для многих целей",
    },
    {
      id: 13,
      name: "Кактус",
      type: "Редкое",
      price: 1000,
      sellPrice: 2500,
      growthTime: 70,
      imageUrl: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FjdHVzfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Выносливое растение, может выжить в суровых условиях",
    },
    {
      id: 14,
      name: "Драконий фрукт",
      type: "Редкое",
      price: 1400,
      sellPrice: 3500,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1550828484-44ba48705f3c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZHJhZ29uK2ZydWl0fHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Яркий экзотический фрукт с высокой питательной ценностью",
    },
    {
      id: 15,
      name: "Манго",
      type: "Многоурожайное",
      price: 800,
      sellPrice: 2000,
      growthTime: 40,
      imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8bWFuZ298fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сладкий тропический фрукт, востребованный на рынке",
    },
    {
      id: 16,
      name: "Маракуйя",
      type: "Многоурожайное",
      price: 8000,
      sellPrice: 20000,
      growthTime: 55,
      imageUrl: "https://images.unsplash.com/photo-1604494163352-cb0054fff9ad?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cGFzc2lvbitmcnVpdHx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Ароматный и экзотический фрукт с уникальным вкусом",
    },
    {
      id: 17,
      name: "Банан",
      type: "Многоурожайное",
      price: 6000,
      sellPrice: 15000,
      growthTime: 50,
      imageUrl: "https://images.unsplash.com/photo-1543218024-57a70143c369?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8YmFuYW5hfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Популярный фрукт, растущий гроздьями на высоких растениях",
    },
    {
      id: 18,
      name: "Виноград",
      type: "Многоурожайное",
      price: 1500,
      sellPrice: 3750,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z3JhcGVzfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Растет гроздьями, идеально подходит для виноделия",
    },
    {
      id: 19,
      name: "Плод души",
      type: "Мифическое",
      price: 15000,
      sellPrice: 50000,
      growthTime: 90,
      imageUrl: "https://images.unsplash.com/photo-1582140161538-5e731bdd28ea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2xvd2luZytmcnVpdHx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Мистический фрукт с магическими свойствами, очень редкий",
    },
    {
      id: 20,
      name: "Проклятый фрукт",
      type: "Мифическое",
      price: 20000,
      sellPrice: 70000,
      growthTime: 100,
      imageUrl: "https://images.unsplash.com/photo-1611030821715-84a1c32ff133?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyYW5nZStmcnVpdHx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Легендарный фрукт, который дает силы, но имеет свою цену",
    },
    {
      id: 21,
      name: "Гриб",
      type: "Многоурожайное",
      price: 1700,
      sellPrice: 4250,
      growthTime: 30,
      imageUrl: "https://images.unsplash.com/photo-1592492152545-9695d3f473f4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8bXVzaHJvb218fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Быстрорастущий гриб, хорошо развивается в тени",
    },
    {
      id: 22,
      name: "Перец",
      type: "Многоурожайное",
      price: 2000,
      sellPrice: 5000,
      growthTime: 35,
      imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVwcGVyfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Острый и ароматный овощ, доступен в разных вариациях",
    },
    {
      id: 23,
      name: "Конфетный цветок",
      type: "Редкое",
      price: 1000,
      sellPrice: 2500,
      growthTime: 40,
      imageUrl: "https://images.unsplash.com/photo-1464982239851-430cd391e8a9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29sb3JmdWwrZmxvd2VyfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сладкий цветок, который привлекает насекомых-опылителей",
    },
    {
      id: 24,
      name: "Баклажан",
      type: "Многоурожайное",
      price: 8000,
      sellPrice: 20000,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1635537766969-5c7b69ba950a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8ZWdncGxhbnR8fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Питательный овощ с глубоким цветом и богатым вкусом",
    },
    {
      id: 25,
      name: "Лотос",
      type: "Редкое",
      price: 15000,
      sellPrice: 40000,
      growthTime: 70,
      imageUrl: "https://images.unsplash.com/photo-1515513284606-89a82f5a7f36?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8bG90dXN8fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Священный водный цветок с глубоким духовным значением",
    },
    {
      id: 26,
      name: "Ананас",
      type: "Одноразовое",
      price: 3000,
      sellPrice: 7500,
      growthTime: 55,
      imageUrl: "https://images.unsplash.com/photo-1521495112790-ac57722dfe2a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cGluZWFwcGxlfHx8fHx8MTcxNTI1MzQyMw&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сладкий тропический фрукт с характерным вкусом",
    },
    {
      id: 27,
      name: "Персик",
      type: "Многоурожайное",
      price: 3000,
      sellPrice: 7500,
      growthTime: 45,
      imageUrl: "https://images.unsplash.com/photo-1629740067905-bd3f515aa736?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVhY2h8fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сочный и ароматный фрукт с нежной мякотью",
    },
    {
      id: 28,
      name: "Груша",
      type: "Многоурожайное",
      price: 2000,
      sellPrice: 5000,
      growthTime: 40,
      imageUrl: "https://images.unsplash.com/photo-1596555545994-8f0e25986098?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVhcnx8fHx8fDE3MTUyNTM0MjM&ixlib=rb-4.0.3&q=80&w=500",
      description: "Сладкий хрустящий фрукт с мягкой мякотью",
    },
    {
      id: 29,
      name: "Цветущая вишня",
      type: "Редкое",
      price: 5000,
      sellPrice: 12500,
      growthTime: 50,
      imageUrl: "https://images.unsplash.com/photo-1555865739-473893a1bebf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2hlcnJ5K2Jsb3Nzb218fHx8fHwxNzE1MjUzNDIz&ixlib=rb-4.0.3&q=80&w=500",
      description: "Красивое цветущее дерево с прекрасными розовыми цветами",
    }
  ];

  // Tools database
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
      effect: "Ускоряет рост на 50% и увеличивает размер растений",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Помогает посевам расти быстрее и выглядеть крупнее. Работает всего пять минут.",
    },
    {
      id: 5,
      name: "Усовершенствованный разбрызгиватель",
      type: "Разбрызгиватель",
      price: 50000,
      uses: 1,
      effect: "Ускоряет рост на 75% и добавляет шанс мутации",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Повышает скорость роста урожая и вероятность появления случайных мутаций. Работает пять минут.",
    },
    {
      id: 6,
      name: "Божественный разбрызгиватель",
      type: "Разбрызгиватель",
      price: 120000,
      uses: 1,
      effect: "Ускоряет рост вдвое и значительно увеличивает шанс мутации",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Ускоряет рост, повышает вероятность мутации и придаёт посевам более крупный вид.",
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
      price: 10000000,
      uses: 1,
      effect: "Ускоряет рост в 3 раза, значительно повышает шанс мутации и увеличивает размер",
      imageUrl: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8c3ByaW5rbGVyfHx8fHx8MTcxNTEyMDc0OQ&ixlib=rb-4.0.3&q=80&w=500",
      description: "Значительно увеличивает рост растений, вероятность мутации и размер плодов. Работает в течение 10 минут.",
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

  // Save game data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('garden_money', money.toString());
    localStorage.setItem('garden_inventory', JSON.stringify(inventory));
    localStorage.setItem('garden_tools', JSON.stringify(toolsInventory));
    localStorage.setItem('garden_plants', JSON.stringify(plants));
  }, [money, inventory, toolsInventory, plants]);

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
        description: "Нажмите на сад, чтобы посадить выбранное семя",
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
        position: { x, y },
        size: 1,
        mutated: false
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
      case 6: // Divine sprinkler
      case 8: // Master sprinkler
        // Apply growth boost and size increase based on sprinkler type
        let growthBoost = 0.5;
        let sizeIncrease = 1.2;
        let mutationChance = 0.05;
        
        if (toolId === 5) { // Advanced
          growthBoost = 0.75;
          sizeIncrease = 1.5;
          mutationChance = 0.15;
        } else if (toolId === 6) { // Divine
          growthBoost = 1;
          sizeIncrease = 2;
          mutationChance = 0.3;
        } else if (toolId === 8) { // Master
          growthBoost = 2;
          sizeIncrease = 3;
          mutationChance = 0.5;
        }
        
        const newPlantedTime = plant.plantedAt - (seed.growthTime * 1000 * growthBoost);
        const hasMutation = Math.random() < mutationChance;
        
        const sprinkledPlants = [...plants];
        sprinkledPlants[plantIndex] = {
          ...plant,
          plantedAt: newPlantedTime,
          size: plant.size * sizeIncrease,
          mutated: hasMutation || plant.mutated
        };
        setPlants(sprinkledPlants);
        
        toast({
          title: "Разбрызгиватель использован",
          description: `Растение ${hasMutation ? "получило мутацию и " : ""}будет расти быстрее.`,
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
    
    // Increase reward based on size and mutations
    reward = Math.floor(reward * plant.size);
    
    if (plant.mutated) {
      reward = reward * 50; // Shocked mutation increases value 50x
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
        <div className="flex justify-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 text-lg py-1 px-4">
            <Icon name="Coins" className="mr-2 h-5 w-5" />
            {money} шекелей
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

            {isUsingTool && (
              <div className="absolute top-0 left-0 right-0 bg-amber-100 p-2 text-center text-amber-800">
                Выберите растение для использования {toolsData.find(t => t.id === selectedTool)?.name}
                <Button 
                  variant="ghost" 
                  className="ml-2 h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUsingTool(false);
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
                  onClick={() => {
                    if (isUsingTool && selectedTool) {
                      useTool(plant.id);
                    }
                  }}
                >
                  <div className="relative group">
                    <div 
                      className="flex items-center justify-center"
                      style={{ 
                        width: `${50 * plant.size}px`, 
                        height: `${50 * plant.size}px` 
                      }}
                    >
                      <ProgressCircle 
                        value={plant.progress} 
                        size={50 * plant.size} 
                        className={
                          plant.mutated 
                            ? "text-purple-500" 
                            : plant.progress === 100 
                              ? "text-green-500" 
                              : "text-amber-500"
                        }
                      />
                      <img 
                        src={seed.imageUrl} 
                        alt={seed.name} 
                        className={`absolute object-cover rounded-full ${plant.mutated ? "filter hue-rotate-180" : ""}`}
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
          <li>Нажмите на свободное место в саду, чтобы посадить семя</li>
          <li>Дождитесь, пока растение созреет (достигнет 100%)</li>
          <li>Используйте инструменты, чтобы улучшить рост или изменить растения</li>
          <li>Соберите урожай, чтобы получить шекели</li>
          <li>Многоразовые растения дадут новый урожай после сбора</li>
          <li>Мутированные растения стоят в 50 раз дороже!</li>
        </ul>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-2">Инструменты</h2>
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold">Лейка</h3>
            <p className="text-sm">Сокращает время роста растений на 30%. Используется 10 раз.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Совок</h3>
            <p className="text-sm">Позволяет перемещать многоурожайные растения. Нельзя использовать с одноразовыми.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Лопата</h3>
            <p className="text-sm">Уничтожает растения. Это базовый инструмент, который всегда доступен.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Разбрызгиватели</h3>
            <p className="text-sm">Ускоряют рост, увеличивают размер и дают шанс мутации. Чем лучше разбрызгиватель, тем сильнее эффект.</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold">Громоотвод</h3>
            <p className="text-sm">Дает растению шоковую мутацию, которая увеличивает его стоимость в 50 раз!</p>
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
