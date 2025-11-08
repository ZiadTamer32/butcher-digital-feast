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
  available?: boolean;
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
    available: true,
  },
  {
    id: "2",
    name: "Ground Beef",
    nameAr: "لحم بقري مفروم",
    description: "لحم مفروم طازج عالي الجودة",
    price: 120,
    category: "beef",
    image: beefImage,
    available: true,
  },
  {
    id: "3",
    name: "Beef Ribs",
    nameAr: "أضلاع لحم بقري",
    description: "أضلاع طازجة للشوي",
    price: 200,
    category: "beef",
    image: beefImage,
    available: true,
  },
  {
    id: "4",
    name: "Lamb Chops",
    nameAr: "ريش غنم",
    description: "ريش غنم طازجة فاخرة",
    price: 250,
    category: "lamb",
    image: lambImage,
    available: true,
  },
  {
    id: "5",
    name: "Ground Lamb",
    nameAr: "لحم غنم مفروم",
    description: "لحم غنم مفروم طازج",
    price: 160,
    category: "lamb",
    image: lambImage,
    available: true,
  },
  {
    id: "6",
    name: "Lamb Shoulder",
    nameAr: "كتف غنم",
    description: "كتف غنم طازج للطبخ",
    price: 220,
    category: "lamb",
    image: lambImage,
    available: true,
  },
];
