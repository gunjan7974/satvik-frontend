export interface Category {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  menuItemsCount?: number;
}