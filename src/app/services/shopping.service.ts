import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingItem } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private storageKey = 'shopping-list';
  private shoppingItemsSubject = new BehaviorSubject<ShoppingItem[]>([]);
  public shoppingItems$ = this.shoppingItemsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const items = JSON.parse(stored);
      this.shoppingItemsSubject.next(items);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.shoppingItemsSubject.value));
  }

  addItem(name: string, quantity: number = 1, unit: string = 'unidad'): void {
    const currentItems = this.shoppingItemsSubject.value;
    const existingItem = currentItems.find(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: ShoppingItem = {
        id: this.generateId(),
        name,
        quantity,
        unit,
        completed: false,
        createdAt: new Date()
      };
      currentItems.push(newItem);
    }

    this.shoppingItemsSubject.next([...currentItems]);
    this.saveToStorage();
  }

  updateItem(id: string, updates: Partial<ShoppingItem>): void {
    const currentItems = this.shoppingItemsSubject.value;
    const index = currentItems.findIndex(item => item.id === id);
    
    if (index >= 0) {
      currentItems[index] = { ...currentItems[index], ...updates };
      this.shoppingItemsSubject.next([...currentItems]);
      this.saveToStorage();
    }
  }

  removeItem(id: string): void {
    const currentItems = this.shoppingItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    this.shoppingItemsSubject.next(filteredItems);
    this.saveToStorage();
  }

  toggleCompleted(id: string): void {
    const currentItems = this.shoppingItemsSubject.value;
    const item = currentItems.find(item => item.id === id);
    
    if (item) {
      item.completed = !item.completed;
      this.shoppingItemsSubject.next([...currentItems]);
      this.saveToStorage();
    }
  }

  clearCompleted(): void {
    const currentItems = this.shoppingItemsSubject.value;
    const activeItems = currentItems.filter(item => !item.completed);
    this.shoppingItemsSubject.next(activeItems);
    this.saveToStorage();
  }

  clearAll(): void {
    this.shoppingItemsSubject.next([]);
    this.saveToStorage();
  }

  exportList(): string {
    const items = this.shoppingItemsSubject.value.filter(item => !item.completed);
    return items.map(item => `- ${item.name} (${item.quantity} ${item.unit})`).join('\n');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}