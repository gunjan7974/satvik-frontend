// lib/data.ts
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isSpicy?: boolean;
  isAvailable: boolean;
}

export const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in rich tomato gravy",
    price: 220,
    category: "Main Course",
    image: "/menu/paneer-butter-masala.jpg",
    isVeg: true,
    isSpicy: false,
    isAvailable: true,
  },
  // Add more menu items...
];

export const categories = [
  "Starters",
  "Main Course",
  "Breads",
  "Rice",
  "Desserts",
  "Beverages",
];