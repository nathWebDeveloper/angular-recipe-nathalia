export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  caloriesPer100g: number;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  calories: number;
  cookingTime: number;
  instructions: string[];
  image?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
  createdAt: Date;
  editing?: boolean; // Agregar esta línea
}