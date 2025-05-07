
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Icon from '@/components/ui/icon';
import { Input } from "@/components/ui/input";

interface SeedType {
  id: number;
  name: string;
  type: "Одноразовое" | "Многоурожайное" | "Секретное" | "Редкое" | "Мифическое";
  price: number;
  sellPrice?: number;
  growthTime?: string;
  source: string[];
  imageUrl: string;
  description?: string;
}

const GrowAGardenCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const seedsData: SeedType[] = [
    {
      id: 1,
      name: "Морковь",
      type: "Одноразовое",
      price: 20,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1522184216316-3c1a2f3d8c65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnJvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      description: "Простое одноразовое семя, доступное с начала игры",
    },
    {
      id: 2,
      name: "Клубника",
      type: "Многоурожайное",
      price: 20,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYXdiZXJyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      description: "Многоурожайное семя, дает плоды несколько раз",
    },
    {
      id: 3,
      name: "Черника",
      type: "Многоурожайное",
      price: 20,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZWJlcnJ5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Многоурожайное семя, доступное в начале игры",
    },
    {
      id: 4,
      name: "Оранжевый тюльпан",
      type: "Редкое",
      price: 750,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1586968793426-5a5755866b33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8b3JhbmdlJTIwdHVsaXB8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      description: "Редкий декоративный цветок",
    },
    {
      id: 5,
      name: "Помидор",
      type: "Многоурожайное",
      price: 30,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dG9tYXRvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Многоурожайный овощ, популярный среди новичков",
    },
    {
      id: 6,
      name: "Кукуруза",
      type: "Многоурожайное",
      price: 40,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y29ybnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      description: "Многоурожайное семя, даёт хороший доход",
    },
    {
      id: 7,
      name: "Нарцисс",
      type: "Редкое",
      price: 1000,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1598197748967-515540d2a2cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFmZm9kaWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      description: "Редкий декоративный цветок, высоко ценится",
    },
    {
      id: 8,
      name: "Малина",
      type: "Секретное",
      price: 60,
      source: ["Forever Pack", "Super Seed Packs", "Специальные задания"],
      imageUrl: "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFzcGJlcnJ5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Секретное семя, доступно только через специальные способы",
    },
    {
      id: 9,
      name: "Яблоко",
      type: "Многоурожайное",
      price: 275,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      description: "Многоурожайное фруктовое дерево, требуется время для созревания",
    },
    {
      id: 10,
      name: "Арбуз",
      type: "Одноразовое",
      price: 3000,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1589984662646-e7b2d7fd9ede?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2F0ZXJtZWxvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      description: "Дорогое одноразовое семя, дает высокую прибыль",
    },
    {
      id: 11,
      name: "Тыква",
      type: "Одноразовое",
      price: 4000,
      source: ["Магазин семян Сэма"],
      imageUrl: "https://images.unsplash.com/photo-1506919258185-6078bba55d2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHVtcGtpbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      description: "Премиум одноразовое семя, требует значительных инвестиций",
    },
    {
      id: 12,
      name: "Персик",
      type: "Секретное",
      price: 100,
      source: ["Forever Pack", "Super Seed Packs"],
      imageUrl: "https://images.unsplash.com/photo-1595743825637-cdaaa564fd0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGVhY2h8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      description: "Секретное фруктовое дерево, доступно через премиум-наборы",
    },
    {
      id: 13,
      name: "Ананас",
      type: "Секретное",
      price: 120,
      source: ["Forever Pack", "Exotic Seed Pack"],
      imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGluZWFwcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Экзотическое секретное растение, особенно ценное",
    },
    {
      id: 14,
      name: "Кактус Shocked",
      type: "Мифическое",
      price: 0,
      sellPrice: 700000,
      source: ["Мутация", "Специальные события"],
      imageUrl: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1909?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2FjdHVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      description: "Мифическая мутированная версия обычного кактуса, невероятно ценная",
    }
  ];

  const filterSeeds = (seeds: SeedType[], term: string) => {
    return seeds.filter(seed => 
      seed.name.toLowerCase().includes(term.toLowerCase()) ||
      seed.type.toLowerCase().includes(term.toLowerCase()) ||
      seed.description?.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredSeeds = filterSeeds(seedsData, searchTerm);

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
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Grow a Garden</h1>
        <p className="text-xl text-gray-600 mb-6">Симулятор садоводства: каталог семян и информация</p>
        
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск семян..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid grid-cols-6 max-w-2xl mx-auto">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="single">Одноразовые</TabsTrigger>
          <TabsTrigger value="multi">Многоурожайные</TabsTrigger>
          <TabsTrigger value="secret">Секретные</TabsTrigger>
          <TabsTrigger value="rare">Редкие</TabsTrigger>
          <TabsTrigger value="mythic">Мифические</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds.map((seed) => (
              <SeedCard key={seed.id} seed={seed} typeColorClass={getTypeColor(seed.type)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="single" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds
              .filter((seed) => seed.type === "Одноразовое")
              .map((seed) => (
                <SeedCard key={seed.id} seed={seed} typeColorClass={getTypeColor(seed.type)} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="multi" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds
              .filter((seed) => seed.type === "Многоурожайное")
              .map((seed) => (
                <SeedCard key={seed.id} seed={seed} typeColorClass={getTypeColor(seed.type)} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="secret" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds
              .filter((seed) => seed.type === "Секретное")
              .map((seed) => (
                <SeedCard key={seed.id} seed={seed} typeColorClass={getTypeColor(seed.type)} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rare" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds
              .filter((seed) => seed.type === "Редкое")
              .map((seed) => (
                <SeedCard key={seed.id} seed={seed} typeColorClass={getTypeColor(seed.type)} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mythic" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeeds
              .filter((seed) => seed.type === "Мифическое")
              .map((seed) => (
                <SeedCard key={seed.id} seed={seed} typeColorClass={getTypeColor(seed.type)} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Способы получения семян</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Store" className="mr-2 h-5 w-5" />
                Магазин семян Сэма
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Основной способ приобретения семян в игре. Используйте шекели (внутриигровую валюту) или робуксы для покупки семян. Ассортимент магазина может меняться.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="CalendarCheck" className="mr-2 h-5 w-5" />
                Ежедневные задания Рафаэля
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Выполняйте три ежедневных задания, чтобы получить наборы семян, содержащие случайные культуры разной редкости.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Package" className="mr-2 h-5 w-5" />
                Супер семя (Super Seed)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Премиум-предмет, который даёт секретное семя. Доступен только за реальные деньги в разделе Forever Pack в игровом магазине.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Gift" className="mr-2 h-5 w-5" />
                Экзотический пакет семян (Exotic Seed Pack)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Специальный набор, который можно приобрести за робуксы. Содержит эксклюзивные и редкие семена, недоступные другими способами.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface SeedCardProps {
  seed: SeedType;
  typeColorClass: string;
}

const SeedCard = ({ seed, typeColorClass }: SeedCardProps) => {
  return (
    <Card className="overflow-hidden hover-scale">
      <div className="h-48 overflow-hidden">
        <img 
          src={seed.imageUrl} 
          alt={seed.name} 
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{seed.name}</CardTitle>
          <Badge className={typeColorClass}>{seed.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">{seed.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm">
            <Icon name="Coins" className="mr-2 h-4 w-4 text-amber-500" />
            <span>Цена: {seed.price} шекелей</span>
          </div>
          {seed.sellPrice && (
            <div className="flex items-center text-sm">
              <Icon name="Banknote" className="mr-2 h-4 w-4 text-green-500" />
              <span>Цена продажи: {seed.sellPrice.toLocaleString()} шекелей</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Icon name="ShoppingBag" className="mr-2 h-4 w-4 text-purple-500" />
            <span>Источник: {seed.source.join(", ")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowAGardenCatalog;
