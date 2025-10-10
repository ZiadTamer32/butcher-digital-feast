import beefImage from "@/assets/beef.jpg";
import lambImage from "@/assets/lamb.jpg";
import chickenImage from "@/assets/chicken.jpg";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  category: "beef" | "lamb" | "chicken";
  image: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Prime Beef Steak",
    nameAr: "ستيك لحم بقري فاخر",
    description: "قطع لحم بقري ممتازة طازجة",
    price: 180,
    category: "beef",
    image: beefImage,
  },
  {
    id: "2",
    name: "Ground Beef",
    nameAr: "لحم بقري مفروم",
    description: "لحم مفروم طازج عالي الجودة",
    price: 120,
    category: "beef",
    image: beefImage,
  },
  {
    id: "3",
    name: "Beef Ribs",
    nameAr: "أضلاع لحم بقري",
    description: "أضلاع طازجة للشوي",
    price: 200,
    category: "beef",
    image: beefImage,
  },
  {
    id: "4",
    name: "Lamb Chops",
    nameAr: "ريش غنم",
    description: "ريش غنم طازجة فاخرة",
    price: 250,
    category: "lamb",
    image: lambImage,
  },
  {
    id: "5",
    name: "Ground Lamb",
    nameAr: "لحم غنم مفروم",
    description: "لحم غنم مفروم طازج",
    price: 160,
    category: "lamb",
    image: lambImage,
  },
  {
    id: "6",
    name: "Lamb Shoulder",
    nameAr: "كتف غنم",
    description: "كتف غنم طازج للطبخ",
    price: 220,
    category: "lamb",
    image: lambImage,
  },
  {
    id: "7",
    name: "Chicken Breast",
    nameAr: "صدور دجاج",
    description: "صدور دجاج طازجة",
    price: 90,
    category: "chicken",
    image: chickenImage,
  },
  {
    id: "8",
    name: "Whole Chicken",
    nameAr: "دجاج كامل",
    description: "دجاج طازج كامل",
    price: 70,
    category: "chicken",
    image: chickenImage,
  },
  {
    id: "9",
    name: "Chicken Wings",
    nameAr: "أجنحة دجاج",
    description: "أجنحة دجاج طازجة",
    price: 60,
    category: "chicken",
    image: chickenImage,
  },
];
